import {
  SEED_APPLE_WORKSPACE_ID,
  SEED_YCOMBINATOR_WORKSPACE_ID,
} from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';

// Rotate fork: the two dev workspaces are airlines, and their members are the
// cargo sales organisation (head of sales, regional managers, station account
// managers). Everything else an airline needs (regions, stations, forwarders,
// initiatives) is seeded by the Rotate Cargo application, not by this seeder.
//
// Every seeded user signs in with the password `rotate-dev`.

export const ROTATE_SEED_PASSWORD_HASH =
  '$2b$10$dMOyKfS.VYUaZ6WB6d4TFe4uDFT66rGCXz.1XpgAUuQ1nU2ARQkoW'; // rotate-dev

export const SEED_ETIHAD_WORKSPACE_ID = SEED_APPLE_WORKSPACE_ID;
export const SEED_ROTATE_AIRLINES_WORKSPACE_ID = SEED_YCOMBINATOR_WORKSPACE_ID;

export type RotateCargoRole =
  | 'PLATFORM_ADMIN'
  | 'HEAD_OF_SALES'
  | 'REGIONAL_MANAGER'
  | 'ACCOUNT_MANAGER';

export type RotateStaffSeed = {
  key: string;
  firstName: string;
  lastName: string;
  email: string;
  cargoRole: RotateCargoRole;
  // Workspaces this person belongs to; admins of a workspace get the admin role.
  workspaces: { workspaceId: string; isAdmin: boolean }[];
};

const both = (isAdmin: boolean) => [
  { workspaceId: SEED_ETIHAD_WORKSPACE_ID, isAdmin },
  { workspaceId: SEED_ROTATE_AIRLINES_WORKSPACE_ID, isAdmin },
];
const etihad = (isAdmin = false) => [
  { workspaceId: SEED_ETIHAD_WORKSPACE_ID, isAdmin },
];
const rotate = (isAdmin = false) => [
  { workspaceId: SEED_ROTATE_AIRLINES_WORKSPACE_ID, isAdmin },
];

export const ROTATE_STAFF: RotateStaffSeed[] = [
  // Rotate platform admin: server admin, member of every tenant. This is the
  // prefilled dev login (admin@rotate.dev / rotate-dev).
  { key: 'ADMIN', firstName: 'Rotate', lastName: 'Admin', email: 'admin@rotate.dev', cargoRole: 'PLATFORM_ADMIN', workspaces: both(true) },

  // Etihad Airways — hub AUH
  { key: 'EY_HEAD', firstName: 'Aisha', lastName: 'Al Hammadi', email: 'aisha.alhammadi@etihad.dev', cargoRole: 'HEAD_OF_SALES', workspaces: etihad(true) },
  { key: 'EY_RM_MEA', firstName: 'Khalid', lastName: 'Al Mazrouei', email: 'khalid.almazrouei@etihad.dev', cargoRole: 'REGIONAL_MANAGER', workspaces: etihad() },
  { key: 'EY_RM_EUR', firstName: 'Sophie', lastName: 'Lambert', email: 'sophie.lambert@etihad.dev', cargoRole: 'REGIONAL_MANAGER', workspaces: etihad() },
  { key: 'EY_RM_APAC', firstName: 'Wei', lastName: 'Chen', email: 'wei.chen@etihad.dev', cargoRole: 'REGIONAL_MANAGER', workspaces: etihad() },
  { key: 'EY_RM_AMER', firstName: 'Carlos', lastName: 'Mendes', email: 'carlos.mendes@etihad.dev', cargoRole: 'REGIONAL_MANAGER', workspaces: etihad() },
  { key: 'EY_AM_AUH', firstName: 'Omar', lastName: 'Haddad', email: 'omar.haddad@etihad.dev', cargoRole: 'ACCOUNT_MANAGER', workspaces: etihad() },
  { key: 'EY_AM_FRA', firstName: 'Lukas', lastName: 'Weber', email: 'lukas.weber@etihad.dev', cargoRole: 'ACCOUNT_MANAGER', workspaces: etihad() },
  { key: 'EY_AM_LHR', firstName: 'Priya', lastName: 'Nair', email: 'priya.nair@etihad.dev', cargoRole: 'ACCOUNT_MANAGER', workspaces: etihad() },
  { key: 'EY_AM_AMS', firstName: 'Bram', lastName: 'de Vries', email: 'bram.devries@etihad.dev', cargoRole: 'ACCOUNT_MANAGER', workspaces: etihad() },
  { key: 'EY_AM_HKG', firstName: 'Ka Yan', lastName: 'Cheung', email: 'kayan.cheung@etihad.dev', cargoRole: 'ACCOUNT_MANAGER', workspaces: etihad() },
  { key: 'EY_AM_PVG', firstName: 'Yiming', lastName: 'Zhang', email: 'yiming.zhang@etihad.dev', cargoRole: 'ACCOUNT_MANAGER', workspaces: etihad() },
  { key: 'EY_AM_JFK', firstName: 'Maria', lastName: 'Gonzalez', email: 'maria.gonzalez@etihad.dev', cargoRole: 'ACCOUNT_MANAGER', workspaces: etihad() },
  { key: 'EY_AM_DEL', firstName: 'Rahul', lastName: 'Verma', email: 'rahul.verma@etihad.dev', cargoRole: 'ACCOUNT_MANAGER', workspaces: etihad() },
  { key: 'EY_AM_GRU', firstName: 'Ana', lastName: 'Ribeiro', email: 'ana.ribeiro@etihad.dev', cargoRole: 'ACCOUNT_MANAGER', workspaces: etihad() },

  // Rotate Airlines (fictional carrier) — hub AMS
  { key: 'RA_HEAD', firstName: 'Fleur', lastName: 'Jansen', email: 'fleur.jansen@rotateairlines.dev', cargoRole: 'HEAD_OF_SALES', workspaces: rotate(true) },
  { key: 'RA_RM_EUR', firstName: 'Pieter', lastName: 'Bakker', email: 'pieter.bakker@rotateairlines.dev', cargoRole: 'REGIONAL_MANAGER', workspaces: rotate() },
  { key: 'RA_RM_AMER', firstName: 'Laura', lastName: 'Smith', email: 'laura.smith@rotateairlines.dev', cargoRole: 'REGIONAL_MANAGER', workspaces: rotate() },
  { key: 'RA_RM_APAC', firstName: 'Kenji', lastName: 'Sato', email: 'kenji.sato@rotateairlines.dev', cargoRole: 'REGIONAL_MANAGER', workspaces: rotate() },
  { key: 'RA_RM_MEA', firstName: 'Yusuf', lastName: 'Demir', email: 'yusuf.demir@rotateairlines.dev', cargoRole: 'REGIONAL_MANAGER', workspaces: rotate() },
  { key: 'RA_AM_AMS', firstName: 'Sanne', lastName: 'Visser', email: 'sanne.visser@rotateairlines.dev', cargoRole: 'ACCOUNT_MANAGER', workspaces: rotate() },
  { key: 'RA_AM_FRA', firstName: 'Jonas', lastName: 'Becker', email: 'jonas.becker@rotateairlines.dev', cargoRole: 'ACCOUNT_MANAGER', workspaces: rotate() },
  { key: 'RA_AM_LHR', firstName: 'Emma', lastName: 'Clarke', email: 'emma.clarke@rotateairlines.dev', cargoRole: 'ACCOUNT_MANAGER', workspaces: rotate() },
  { key: 'RA_AM_JFK', firstName: 'Michael', lastName: 'Rossi', email: 'michael.rossi@rotateairlines.dev', cargoRole: 'ACCOUNT_MANAGER', workspaces: rotate() },
  { key: 'RA_AM_HKG', firstName: 'Wing Sze', lastName: 'Chan', email: 'wingsze.chan@rotateairlines.dev', cargoRole: 'ACCOUNT_MANAGER', workspaces: rotate() },
  { key: 'RA_AM_DXB', firstName: 'Layla', lastName: 'Nasser', email: 'layla.nasser@rotateairlines.dev', cargoRole: 'ACCOUNT_MANAGER', workspaces: rotate() },
];

// Deterministic ids so re-seeding is idempotent and tests can reference them.
// The platform admin keeps upstream's "Tim" ids: a few code paths (default
// workspace resolution, permission seeding) key on them.
const UPSTREAM_TIM_USER_ID = '20202020-9e3b-46d4-a556-88b9ddc2b034';
const UPSTREAM_TIM_USER_WORKSPACE_ID = '20202020-9e3b-46d4-a556-88b9ddc2b035';
const UPSTREAM_TIM_ACME_USER_WORKSPACE_ID = '20202020-e10a-4c27-a90b-b08c57b02d44';
const UPSTREAM_TIM_WORKSPACE_MEMBER_ID = '20202020-0687-4c41-b707-ed1bfca972a7';

const hex2 = (index: number) => index.toString(16).padStart(2, '0');

export const rotateStaffUserId = (index: number): string =>
  index === 0
    ? UPSTREAM_TIM_USER_ID
    : `40404040-0000-4000-8000-0000000000${hex2(index)}`;

export const rotateStaffUserWorkspaceId = (
  index: number,
  workspaceId: string,
): string => {
  if (index === 0) {
    return workspaceId === SEED_ETIHAD_WORKSPACE_ID
      ? UPSTREAM_TIM_USER_WORKSPACE_ID
      : UPSTREAM_TIM_ACME_USER_WORKSPACE_ID;
  }
  const workspaceNibble = workspaceId === SEED_ETIHAD_WORKSPACE_ID ? '1' : '2';

  return `41414141-000${workspaceNibble}-4000-8000-0000000000${hex2(index)}`;
};

export const rotateStaffWorkspaceMemberId = (
  index: number,
  workspaceId: string,
): string => {
  if (index === 0 && workspaceId === SEED_ETIHAD_WORKSPACE_ID) {
    return UPSTREAM_TIM_WORKSPACE_MEMBER_ID;
  }
  const workspaceNibble = workspaceId === SEED_ETIHAD_WORKSPACE_ID ? '1' : '2';

  return `42424242-000${workspaceNibble}-4000-8000-0000000000${hex2(index)}`;
};

export const getRotateStaffForWorkspace = (workspaceId: string) =>
  ROTATE_STAFF.map((staff, index) => ({ staff, index })).filter(({ staff }) =>
    staff.workspaces.some((membership) => membership.workspaceId === workspaceId),
  );

export const getRotateAdminUserWorkspaceIds = (workspaceId: string): string[] =>
  getRotateStaffForWorkspace(workspaceId)
    .filter(({ staff }) =>
      staff.workspaces.some(
        (membership) => membership.workspaceId === workspaceId && membership.isAdmin,
      ),
    )
    .map(({ index }) => rotateStaffUserWorkspaceId(index, workspaceId));

export const getRotateMemberUserWorkspaceIds = (workspaceId: string): string[] =>
  getRotateStaffForWorkspace(workspaceId)
    .filter(
      ({ staff }) =>
        !staff.workspaces.some(
          (membership) => membership.workspaceId === workspaceId && membership.isAdmin,
        ),
    )
    .map(({ index }) => rotateStaffUserWorkspaceId(index, workspaceId));
