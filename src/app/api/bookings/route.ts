import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getBookingsForDateRange, createSingleBooking, createCompanionBooking } from '@/lib/booking.service';
import { sendCENotify } from '@/lib/notify.service';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Missing date range' }, { status: 400 });
    }

    const bookings = await getBookingsForDateRange(startDate, endDate);
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { date, companionId, companionName } = await req.json();
    if (!date) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

    // Fetch primary user
    const primaryUser = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!primaryUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Check available slots
    const existingBookings = await prisma.booking.findMany({ where: { date } });
    const availableSlots = [1, 2].filter(slot => !existingBookings.some(b => b.slot === slot));

    if (companionId) {
      if (availableSlots.length < 2) {
        return NextResponse.json({ error: 'Not enough slots for companion booking' }, { status: 400 });
      }
      
      // Create companion booking
      await createCompanionBooking(session.userId, companionId, date, [availableSlots[0], availableSlots[1]]);
      
      // Send Markdown Notification
      const msg = `## 新預約（兩人同行）：\n- 預約人： ${primaryUser.name}\n- 同行者： ${companionName}\n- 日期： ${date}\n- 電話： ${primaryUser.parentPhone}`;
      await sendCENotify(msg);
      
    } else {
      if (availableSlots.length < 1) {
        return NextResponse.json({ error: 'No available slots' }, { status: 400 });
      }
      
      // Create single booking
      await createSingleBooking(session.userId, date, availableSlots[0]);
      
      // Send Markdown Notification
      const msg = `## 新預約：\n- 學生： ${primaryUser.name}\n- 日期： ${date}\n- 電話： ${primaryUser.parentPhone}`;
      await sendCENotify(msg);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Booking error:', error);
    
    // Prisma unique constraint violation handling (e.g. daily limit hit)
    if (error.code === 'P2002') {
       return NextResponse.json({ 
         error: 'You (or your companion) have already booked a slot on this date.' 
       }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
