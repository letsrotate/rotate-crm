import { defineApplication, FieldType } from 'twenty-sdk/define';

import {
  APPLICATION_UNIVERSAL_IDENTIFIER,
  DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'Rotate Cargo',
  description:
    'Air cargo sales for Rotate CRM: forwarders with IATA CASS codes, stations, origin-destination lanes, and Sales Cockpit initiatives synced into the workspace.',
  author: 'Rotate',
  category: 'Sales',
  websiteUrl: 'https://letsrotate.com',
  emailSupport: 'support@letsrotate.com',
  issueReportUrl: 'https://github.com/letsrotate/rotate-crm/issues',
  defaultRoleUniversalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  // Per-workspace: which airline this tenant is in the Sales Cockpit.
  applicationVariables: {
    SALES_COCKPIT_TENANT: {
      universalIdentifier: 'd0da046a-2ef8-4cd5-8ca8-762d067fe395',
      label: 'Sales Cockpit tenant',
      description:
        'Airline slug used as the X-Tenant header against the Sales Cockpit API (e.g. "etihad", "jal", "demo"). Leave empty to disable the sync for this workspace.',
      type: FieldType.TEXT,
      value: '',
    },
    SALES_COCKPIT_APP_URL: {
      universalIdentifier: '80e5002e-e38e-48b4-84bc-4e7b073bf40e',
      label: 'Sales Cockpit app URL',
      description:
        'Base URL of the Sales Cockpit web app; initiative records link back to it.',
      type: FieldType.TEXT,
      value: 'https://app.prod.letsrotate.com',
    },
  },
  // Server-wide: one Rotate service account reads every tenant's initiatives.
  serverVariables: {
    SALES_COCKPIT_API_URL: {
      description:
        'Base URL of the Rotate customer API (https://api.prod.letsrotate.com; api.test / api.dev for the other environments).',
      isRequired: true,
    },
    SALES_COCKPIT_COGNITO_CLIENT_ID: {
      description:
        'Cognito app client id matching SALES_COCKPIT_API_URL (USER_PASSWORD_AUTH flow).',
      isRequired: true,
    },
    SALES_COCKPIT_BOT_EMAIL: {
      description:
        'Service account email with the rotate:platform::admin group (same bot the Sales Cockpit pipeline uses).',
      isRequired: true,
    },
    SALES_COCKPIT_BOT_PASSWORD: {
      description: 'Service account password.',
      isSecret: true,
      isRequired: true,
    },
  },
});
