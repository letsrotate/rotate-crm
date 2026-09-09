import { type QueryRunner } from 'typeorm';

import { type UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { generateRandomUsers } from 'src/engine/workspace-manager/dev-seeder/core/utils/generate-random-users.util';
import {
  getRotateStaffForWorkspace,
  rotateStaffUserId,
  rotateStaffUserWorkspaceId,
} from 'src/engine/workspace-manager/dev-seeder/core/constants/rotate-staff.constant';

const tableName = 'userWorkspace';

export const USER_WORKSPACE_DATA_SEED_IDS = {
  JANE: '20202020-1e7c-43d9-a5db-685b5069d816',
  TIM: '20202020-9e3b-46d4-a556-88b9ddc2b035',
  JONY: '20202020-3957-4908-9c36-2929a23f8353',
  PHIL: '20202020-7169-42cf-bc47-1cfef15264b1',
  JANE_ACME: '20202020-ae8d-41ea-9469-f74f5d4b002e',
  TIM_ACME: '20202020-e10a-4c27-a90b-b08c57b02d44',
  JONY_ACME: '20202020-e10a-4c27-a90b-b08c57b02d45',
  PHIL_ACME: '20202020-e10a-4c27-a90b-b08c57b02d46',
  SCOTT: '20202020-1111-4a01-8001-000000000002',
};

const { userWorkspaceIds: randomUserWorkspaceIds } = generateRandomUsers();

export const RANDOM_USER_WORKSPACE_IDS = randomUserWorkspaceIds;

type SeedUserWorkspacesArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
  workspaceId: string;
};

export const seedUserWorkspaces = async ({
  queryRunner,
  schemaName,
  workspaceId,
}: SeedUserWorkspacesArgs) => {
  // Rotate fork: memberships come from ROTATE_STAFF (airline staff + platform admin).
  const userWorkspaces: Pick<
    UserWorkspaceEntity,
    'id' | 'userId' | 'workspaceId'
  >[] = getRotateStaffForWorkspace(workspaceId).map(({ index }) => ({
    id: rotateStaffUserWorkspaceId(index, workspaceId),
    userId: rotateStaffUserId(index),
    workspaceId,
  }));

  await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${tableName}`, ['id', 'userId', 'workspaceId'])
    .orIgnore()
    .values(userWorkspaces)
    .execute();
};

type DeleteUserWorkspacesArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
  workspaceId: string;
};

export const deleteUserWorkspaces = async ({
  queryRunner,
  schemaName,
  workspaceId,
}: DeleteUserWorkspacesArgs) => {
  await queryRunner.manager
    .createQueryBuilder()
    .delete()
    .from(`${schemaName}.${tableName}`)
    .where(`"${tableName}"."workspaceId" = :workspaceId`, {
      workspaceId,
    })
    .execute();
};
