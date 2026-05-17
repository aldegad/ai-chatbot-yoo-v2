import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { IChatMessage } from '@type';
import { authenticateUser } from '@api/_utils/auth';
import Character from '@models/Character';

const requireEnv = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const getChatRuntimeConfig = () => ({
  apiKeys: [
    requireEnv('ANTHROPIC_API_KEY1'),
    requireEnv('ANTHROPIC_API_KEY2'),
    requireEnv('ANTHROPIC_API_KEY3'),
    requireEnv('ANTHROPIC_API_KEY4'),
  ],
  systemConfig: requireEnv('SYSTEM_CONFIG').replace(/\\n/g, '\n'),
  initMessageFilter1: requireEnv('INIT_MESSAGE_FILTER1'),
  initMessageFilter2: requireEnv('INIT_MESSAGE_FILTER2'),
  rejectedMessageFilter1: requireEnv('REJECTED_MESSAGE_FILTER1'),
  rejectedMessageFilter2: requireEnv('REJECTED_MESSAGE_FILTER2'),
  testUser: requireEnv('TEST_USER'),
});

let currentTokenIndex = 1; // 현재 사용 중인 토큰의 인덱스

export async function POST(req: NextRequest) {
  const authResult = await authenticateUser(req);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { user } = authResult;

  try {
    const { message, characterId }: IChatMessage.SendParams = await req.json();
    const character = await Character.findById(characterId);

    if(!character) return NextResponse.json({ error: '삭제된 캐릭터 입니다.' }, { status: 404 });

    const config = getChatRuntimeConfig();
    const system = `${config.systemConfig}\n\n{npc}:\n${character.system}\n${character.secret}\n{user}:\n${config.testUser}`;

    const responseMessage = await attemptApiCall({ system, message, config });

    return NextResponse.json({ message: responseMessage });
  } catch(error) {
    console.error(error);
    return NextResponse.json({ error: '대화 실패' }, { status: 500 });
  }
}
type ChatRuntimeConfig = ReturnType<typeof getChatRuntimeConfig>
type AttemptApiCallProps = {
  system:string,
  message:string,
  config: ChatRuntimeConfig,
  rejectedMessage?:string,
  _tryCount?:number,
  _inToken?:number,
  _outToken?:number
}
const attemptApiCall = async({ system, message, config, rejectedMessage, _tryCount, _inToken, _outToken }:AttemptApiCallProps) : Promise<string> => {
  let tryCount = _tryCount ? _tryCount + 1 : 1;
  let totalInToken = _inToken || 0;
  let totalOutToken = _outToken || 0;

  console.log('attepmt api call: ', `\x1b[33m${tryCount}\x1b[0m`);

  let messageWithUnlocker = [];
  if(!rejectedMessage) {
    messageWithUnlocker = [
      { role: "user", content: config.initMessageFilter1 },
      { role: "assistant", content: config.initMessageFilter2 },
      { role: "user", content: `%${message}%` }
    ]
  } else {
    messageWithUnlocker = [
      { role: "user", content: message },
      { role: "assistant", content: rejectedMessage },
      { role: "user", content: config.rejectedMessageFilter1 },
      { role: "assistant", content: config.rejectedMessageFilter2 },
      { role: "user", content: `%${message}%` }
    ]
  }

  const response = await axios.post('https://api.anthropic.com/v1/messages', {
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 4096,
    system,
    messages: messageWithUnlocker
  }, {
      headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKeys[currentTokenIndex],
          'anthropic-version': '2023-06-01'
      }
  });

  totalInToken += response.data.usage.input_tokens;
  totalOutToken += response.data.usage.output_tokens;

  if(validateString(response.data.content[0].text)) {
    console.log(
      messageWithUnlocker, 
      `totalInToken: \x1b[33m${totalInToken}\x1b[0m, totalOutToken: \x1b[33m${totalOutToken}\x1b[0m, tryCount: ${tryCount}`
    );
    return response.data.content[0].text;
  } else {
    return await attemptApiCall({
      system, 
      message, 
      config,
      rejectedMessage: response.data.content[0].text,
      _tryCount: tryCount,
      _inToken: totalInToken,
      _outToken: totalOutToken
    });
  }
}

const validateString = (text:string) => {
  return true;
  if(text.includes('{d}')) {
      return true;
  } else {
      return false;
  }
}
