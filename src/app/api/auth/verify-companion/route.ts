import { NextResponse } from 'next/server';
import { verifyCompanionByName } from '@/lib/user.service';
import { getSession } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Companion name required' }, { status: 400 });
    }

    const companion = await verifyCompanionByName(name);
    if (!companion) {
      return NextResponse.json({ error: 'Not registered' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      companionId: companion.id, 
      companionName: companion.name 
    });
  } catch (error) {
    console.error('Verify companion error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
