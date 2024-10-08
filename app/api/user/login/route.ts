import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@lib/mongodb';
import { IUser } from '@type';
import User from '@models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password }: IUser.LoginParams = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: '가입된 정보가 없습니다.' }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: '가입된 정보가 없습니다.' }, { status: 400 });
    }

    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '5m' });
    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET, { expiresIn: '30d' });

    const response = NextResponse.json({ message: '로그인 되었습니다.', accessToken, refreshToken });
    /** 
     * 앱까지 같이 할 프로젝트라 이것을 사용할 수 없음
     * response.cookies.set('token', token, { httpOnly: true, maxAge: 3600 });
     * response.cookies.set('refreshToken', refreshToken, { httpOnly: true, maxAge: 604800 }); 
    */

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error login' }, { status: 500 });
  }
}
