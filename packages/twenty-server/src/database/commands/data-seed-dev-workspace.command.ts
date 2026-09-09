import { Logger } from '@nestjs/common';

import { Command, CommandRunner, Option } from 'nest-commander';

import {
  SEED_APPLE_WORKSPACE_ID,
  SEED_YCOMBINATOR_WORKSPACE_ID,
  SeededWorkspacesIds,
} from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';
import { DevSeederService } from 'src/engine/workspace-manager/dev-seeder/services/dev-seeder.service';

type DataSeedWorkspaceOptions = {
  light?: boolean;
};

@Command({
  name: 'workspace:seed:dev',
  description:
    'Seed workspace with initial data. This command is intended for development only.',
})
export class DataSeedWorkspaceCommand extends CommandRunner {
  private readonly logger = new Logger(DataSeedWorkspaceCommand.name);

  constructor(private readonly devSeederService: DevSeederService) {
    super();
  }

  @Option({
    flags: '--light',
    description:
      'Light seed: only seed the Apple workspace (skip YCombinator), skip demo custom objects (Pet, Survey, etc.) and limit records to 5 per object',
  })
  parseLight(): boolean {
    return true;
  }

  async run(
    _passedParams: string[],
    options: DataSeedWorkspaceOptions,
  ): Promise<void> {
    // Rotate fork: both airline tenants are always seeded, and always in
    // light mode (no demo custom objects, staff only). Demo cargo data comes
    // from the Rotate Cargo application; see packages/twenty-utils/rotate-dev-env.sh.
    const workspaceIds: SeededWorkspacesIds[] = [
      SEED_APPLE_WORKSPACE_ID,
      SEED_YCOMBINATOR_WORKSPACE_ID,
    ];

    if (options.light) {
      this.logger.log('--light is implied on the Rotate fork');
    }

    try {
      for (const workspaceId of workspaceIds) {
        await this.devSeederService.seedDev(workspaceId, { light: true });
      }
    } catch (error) {
      this.logger.error(error);
      this.logger.error(error.stack);
    }
  }
}
