import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { PermissionFlagType } from 'twenty-shared/constants';
import { WorkspaceActivationStatus } from 'twenty-shared/workspace';
import { DataSource, Repository } from 'typeorm';

import { FlatApplication } from 'src/engine/core-modules/application/types/flat-application.type';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { FieldPermissionService } from 'src/engine/metadata-modules/object-permission/field-permission/field-permission.service';
import { ObjectPermissionService } from 'src/engine/metadata-modules/object-permission/object-permission.service';
import { RolePermissionFlagService } from 'src/engine/metadata-modules/role-permission-flag/role-permission-flag.service';
import { RoleTargetService } from 'src/engine/metadata-modules/role-target/services/role-target.service';
import { RoleDTO } from 'src/engine/metadata-modules/role/dtos/role.dto';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';
import { RoleService } from 'src/engine/metadata-modules/role/role.service';
import { UserRoleService } from 'src/engine/metadata-modules/user-role/user-role.service';
import { InjectWorkspaceScopedRepository } from 'src/engine/twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator';
import { WorkspaceScopedRepository } from 'src/engine/twenty-orm/workspace-scoped-repository/workspace-scoped-repository';
import { API_KEY_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/api-key-data-seeds.constant';
import {
  getRotateAdminUserWorkspaceIds,
  getRotateMemberUserWorkspaceIds,
} from 'src/engine/workspace-manager/dev-seeder/core/constants/rotate-staff.constant';
import { STANDARD_ROLE } from 'src/engine/workspace-manager/twenty-standard-application/constants/standard-role.constant';

@Injectable()
export class DevSeederPermissionsService {
  private readonly logger = new Logger(DevSeederPermissionsService.name);

  constructor(
    private readonly roleService: RoleService,
    private readonly userRoleService: UserRoleService,
    private readonly objectPermissionService: ObjectPermissionService,
    @InjectRepository(ObjectMetadataEntity)
    private readonly objectMetadataRepository: Repository<ObjectMetadataEntity>,
    @InjectWorkspaceScopedRepository(RoleEntity)
    private readonly roleRepository: WorkspaceScopedRepository<RoleEntity>,
    private readonly fieldPermissionService: FieldPermissionService,
    private readonly roleTargetService: RoleTargetService,
    private readonly rolePermissionFlagService: RolePermissionFlagService,
    @InjectDataSource()
    private readonly coreDataSource: DataSource,
  ) {}

  public async initPermissions({
    twentyStandardFlatApplication,
    workspaceCustomFlatApplication,
    workspaceId,
  }: {
    workspaceId: string;
    twentyStandardFlatApplication: FlatApplication;
    workspaceCustomFlatApplication: FlatApplication;
    light?: boolean;
  }) {
    const adminRole = await this.roleRepository.findOne(workspaceId, {
      where: {
        universalIdentifier: STANDARD_ROLE.admin.universalIdentifier,
      },
    });

    if (!adminRole) {
      throw new Error(
        'Required roles not found. Make sure the permission sync has run.',
      );
    }

    await this.roleTargetService.create({
      createRoleTargetInput: {
        roleId: adminRole.id,
        targetId: API_KEY_DATA_SEED_IDS.ID_1,
        targetMetadataForeignKey: 'apiKeyId',
        applicationId: twentyStandardFlatApplication.id,
      },
      workspaceId,
    });

    let adminUserWorkspaceId: string | undefined;
    let extraAdminUserWorkspaceIds: string[] = [];
    let memberUserWorkspaceIds: string[] = [];

    // Rotate fork: both dev tenants are airlines; the platform admin and the
    // head of cargo sales are workspace admins, everyone else is a member.
    const [firstAdmin, ...otherAdmins] =
      getRotateAdminUserWorkspaceIds(workspaceId);

    adminUserWorkspaceId = firstAdmin;
    extraAdminUserWorkspaceIds = otherAdmins;
    memberUserWorkspaceIds = getRotateMemberUserWorkspaceIds(workspaceId);

    if (!adminUserWorkspaceId) {
      throw new Error(
        'Should never occur, no eligible user workspace for admin has been found',
      );
    }

    await this.userRoleService.assignRoleToManyUserWorkspace({
      workspaceId,
      userWorkspaceIds: [adminUserWorkspaceId, ...extraAdminUserWorkspaceIds],
      roleId: adminRole.id,
    });

    const memberRole = await this.initMinimalPermissionsAndActivateWorkspace({
      workspaceId,
      workspaceCustomFlatApplication,
    });

    if (memberUserWorkspaceIds.length > 0) {
      await this.userRoleService.assignRoleToManyUserWorkspace({
        workspaceId,
        userWorkspaceIds: memberUserWorkspaceIds,
        roleId: memberRole.id,
      });
    }
  }

  public async initMinimalPermissionsAndActivateWorkspace({
    workspaceId,
    workspaceCustomFlatApplication,
  }: {
    workspaceId: string;
    workspaceCustomFlatApplication: FlatApplication;
  }): Promise<RoleDTO> {
    const memberRole = await this.roleService.createMemberRole({
      workspaceId,
      ownerFlatApplication: workspaceCustomFlatApplication,
    });

    await this.coreDataSource
      .getRepository(WorkspaceEntity)
      .update(workspaceId, {
        defaultRoleId: memberRole.id,
        activationStatus: WorkspaceActivationStatus.ACTIVE,
      });

    return memberRole;
  }

  // Creates a non-admin role whose only elevated capability is the workspace
  // IMPERSONATE permission flag. Assigned to Scott so the impersonation
  // escalation guard can be exercised: a non-admin holding IMPERSONATE must
  // still be blocked from impersonating an admin.
  private async createImpersonateOnlyRoleForSeedWorkspace({
    ownerFlatApplication,
    workspaceId,
  }: {
    workspaceId: string;
    ownerFlatApplication: FlatApplication;
  }): Promise<RoleDTO> {
    const impersonateOnlyRole = await this.roleService.createRole({
      ownerFlatApplication,
      workspaceId,
      input: {
        label: 'Impersonate-only',
        description: 'Member role granted only the impersonate permission',
        icon: 'IconSpy',
        canUpdateAllSettings: false,
        canAccessAllTools: false,
        canReadAllObjectRecords: true,
        canUpdateAllObjectRecords: false,
        canSoftDeleteAllObjectRecords: false,
        canDestroyAllObjectRecords: false,
      },
    });

    await this.rolePermissionFlagService.upsertPermissionFlags({
      workspaceId,
      input: {
        roleId: impersonateOnlyRole.id,
        permissionFlagKeys: [PermissionFlagType.IMPERSONATE],
      },
    });

    return impersonateOnlyRole;
  }

  private async createLimitedRoleForSeedWorkspace({
    ownerFlatApplication,
    workspaceId,
  }: {
    workspaceId: string;
    ownerFlatApplication: FlatApplication;
  }) {
    const customRole = await this.roleService.createRole({
      ownerFlatApplication,
      workspaceId,
      input: {
        label: 'Object-restricted',
        description:
          'All permissions except read on Rockets and update on Pets',
        icon: 'custom',
        canUpdateAllSettings: true,
        canAccessAllTools: true,
        canReadAllObjectRecords: true,
        canUpdateAllObjectRecords: true,
        canSoftDeleteAllObjectRecords: true,
        canDestroyAllObjectRecords: true,
      },
    });

    const petObjectMetadata = await this.objectMetadataRepository.findOneOrFail(
      {
        where: {
          nameSingular: 'pet',
          workspaceId,
        },
      },
    );

    const rocketObjectMetadata =
      await this.objectMetadataRepository.findOneOrFail({
        where: {
          nameSingular: 'rocket',
          workspaceId,
        },
      });

    const personObjectMetadata =
      await this.objectMetadataRepository.findOneOrFail({
        where: {
          nameSingular: 'person',
          workspaceId,
        },
        relations: {
          fields: true,
        },
      });

    const companyObjectMetadata =
      await this.objectMetadataRepository.findOneOrFail({
        where: {
          nameSingular: 'company',
          workspaceId,
        },
        relations: {
          fields: true,
        },
      });

    await this.objectPermissionService.upsertObjectPermissions({
      workspaceId,
      input: {
        roleId: customRole.id,
        objectPermissions: [
          {
            objectMetadataId: petObjectMetadata.id,
            canReadObjectRecords: true,
            canUpdateObjectRecords: false,
            canSoftDeleteObjectRecords: false,
            canDestroyObjectRecords: false,
          },
          {
            objectMetadataId: rocketObjectMetadata.id,
            canReadObjectRecords: false,
            canUpdateObjectRecords: false,
            canSoftDeleteObjectRecords: false,
            canDestroyObjectRecords: false,
          },
        ],
      },
    });

    const personJobTitleFieldMetadata = personObjectMetadata.fields.find(
      (field) => field.name === 'jobTitle',
    );

    if (!personJobTitleFieldMetadata) {
      throw new Error('Person jobTitle field metadata not found');
    }

    const companyLinkedinLinkFieldMetadata = companyObjectMetadata.fields.find(
      (field) => field.name === 'linkedinLink',
    );

    if (!companyLinkedinLinkFieldMetadata) {
      throw new Error('Company linkedin link field metadata not found');
    }

    const readOnlyOnPersonJobTitleFieldPermission = {
      objectMetadataId: personObjectMetadata.id,
      fieldMetadataId: personJobTitleFieldMetadata.id,
      canReadFieldValue: null,
      canUpdateFieldValue: false,
    };

    const noReadOnCompanyLinkedinLinkFieldPermission = {
      objectMetadataId: companyObjectMetadata.id,
      fieldMetadataId: companyLinkedinLinkFieldMetadata.id,
      canReadFieldValue: false,
      canUpdateFieldValue: false,
    };

    await this.fieldPermissionService.upsertFieldPermissions({
      workspaceId,
      input: {
        roleId: customRole.id,
        fieldPermissions: [
          readOnlyOnPersonJobTitleFieldPermission,
          noReadOnCompanyLinkedinLinkFieldPermission,
        ],
      },
    });

    return customRole;
  }
}
