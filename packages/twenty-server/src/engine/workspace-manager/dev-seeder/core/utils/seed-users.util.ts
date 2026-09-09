import { type QueryRunner } from 'typeorm';

import {
  ROTATE_SEED_PASSWORD_HASH,
  ROTATE_STAFF,
  rotateStaffUserId,
} from 'src/engine/workspace-manager/dev-seeder/core/constants/rotate-staff.constant';

import { generateRandomUsers } from './generate-random-users.util';

const tableName = 'user';

export const USER_DATA_SEED_IDS = {
  JANE: '20202020-e6b5-4680-8a32-b8209737156b',
  TIM: '20202020-9e3b-46d4-a556-88b9ddc2b034',
  JONY: '20202020-3957-4908-9c36-2929a23f8357',
  PHIL: '20202020-7169-42cf-bc47-1cfef15264b8',
  SCOTT: '20202020-1111-4a01-8001-000000000001',
};

const { users: randomUsers, userIds: randomUserIds } = generateRandomUsers();

export const RANDOM_USER_IDS = randomUserIds;

type SeedUsersArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
};

export const seedUsers = async ({ queryRunner, schemaName }: SeedUsersArgs) => {
  // Rotate fork: users are the airline sales staff (core/constants/rotate-staff.constant.ts).
  const originalUsers = ROTATE_STAFF.map((staff, index) => ({
    id: rotateStaffUserId(index),
    firstName: staff.firstName,
    lastName: staff.lastName,
    email: staff.email,
    passwordHash: ROTATE_SEED_PASSWORD_HASH,
    canImpersonate: staff.cargoRole === 'PLATFORM_ADMIN',
    canAccessFullAdminPanel: staff.cargoRole === 'PLATFORM_ADMIN',
    isEmailVerified: true,
  }));

  const allUsers = [...originalUsers, ...randomUsers];

  await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${tableName}`, [
      'id',
      'firstName',
      'lastName',
      'email',
      'passwordHash',
      'canImpersonate',
      'canAccessFullAdminPanel',
      'isEmailVerified',
    ])
    .orIgnore()
    .values(allUsers)
    .execute();
};
