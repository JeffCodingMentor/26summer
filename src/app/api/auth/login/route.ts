import { NextResponse } from 'next/server';
import { findUserByNameAndBirthday, createUser } from '@/lib/user.service';
import { createSession } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const { name, birthday, parentPhone } = await req.json();
    
    if (!name || !birthday) {
      return NextResponse.json({ error: 'Name and birthday required' }, { status: 400 });
    }

    let user = await findUserByNameAndBirthday(name, birthday);
    
    if (!user) {
      // Automatic registration flow
      if (!parentPhone) {
        return NextResponse.json({ 
          error: 'Parent phone required for new registration', 
          needsRegistration: true 
        }, { status: 400 });
      }
      user = await createUser(name, birthday, parentPhone);
    }

    await createSession(user.id);
    return NextResponse.json({ success: true, user: { id: user.id, name: user.name } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
