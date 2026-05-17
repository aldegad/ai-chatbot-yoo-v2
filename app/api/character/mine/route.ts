import { NextRequest, NextResponse } from 'next/server'
import Character from '@models/Character'
import { authenticateUser } from '@api/_utils/auth'
import { ICharacter } from '@type'
import { FilterQuery } from 'mongoose'

export async function GET(req: NextRequest) {
  const authResult = await authenticateUser(req);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { user } = authResult;

  try {
    const visibility = req.nextUrl.searchParams.get('visibility');

    const query:FilterQuery<ICharacter.Model> = { creatorId: user._id };
    if (visibility !== 'ALL') {
      query.visibility = visibility;
    }

    const characters = await Character.find(query, { secret: 0 });

    return NextResponse.json<ICharacter.MineResponse>({ list: characters, length: characters.length }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error character mine' }, { status: 500 });
  }
}
