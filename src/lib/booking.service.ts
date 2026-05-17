import { prisma } from './prisma';

export async function getBookingsForDateRange(startDate: string, endDate: string) {
  return prisma.booking.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      user: {
        select: { name: true },
      },
    },
  });
}

export async function createSingleBooking(userId: string, date: string, slot: number) {
  return prisma.booking.create({
    data: {
      userId,
      date,
      slot,
    },
    include: {
      user: true,
    },
  });
}

export async function createCompanionBooking(
  primaryUserId: string,
  companionUserId: string,
  date: string,
  slots: [number, number]
) {
  // Generate a shared UUID for the companion group
  const companionGroupId = crypto.randomUUID();

  // Execute both creations in a transaction
  return prisma.$transaction([
    prisma.booking.create({
      data: {
        userId: primaryUserId,
        date,
        slot: slots[0],
        companionGroupId,
      },
    }),
    prisma.booking.create({
      data: {
        userId: companionUserId,
        date,
        slot: slots[1],
        companionGroupId,
      },
    }),
  ]);
}

export async function deleteBooking(bookingId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return null;

  if (booking.companionGroupId) {
    // Companion booking: delete both linked bookings
    return prisma.booking.deleteMany({
      where: { companionGroupId: booking.companionGroupId },
    });
  }

  // Single booking: just delete the one
  return prisma.booking.delete({
    where: { id: bookingId },
  });
}
