import { prisma } from './prisma';

export async function findUserByNameAndBirthday(name: string, birthday: string) {
  return prisma.user.findUnique({
    where: {
      name_birthday: {
        name,
        birthday,
      },
    },
  });
}

export async function verifyCompanionByName(name: string) {
  // Edge case 2: If multiple exist, return the first one found
  return prisma.user.findFirst({
    where: { name },
  });
}

export async function createUser(name: string, birthday: string, parentPhone: string) {
  return prisma.user.create({
    data: {
      name,
      birthday,
      parentPhone,
    },
  });
}
