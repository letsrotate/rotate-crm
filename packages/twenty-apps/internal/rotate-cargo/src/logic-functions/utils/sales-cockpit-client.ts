import {
  COGNITO_IDP_URL,
  SALES_COCKPIT_FIELDS,
  SALES_COCKPIT_INITIATIVES_PATH,
  SALES_COCKPIT_STATUSES,
} from 'src/logic-functions/constants/sales-cockpit';

export type SalesCockpitAssignee = {
  name?: string | null;
  email?: string | null;
  userId?: string | null;
};

export type SalesCockpitInitiative = {
  _id: string;
  runId?: string | null;
  runTimestamp?: string | null;
  similarityId?: string | null;
  agentName?: string | null;
  originDestination?: string | null;
  routing?: string | null;
  station?: string | null;
  category?: string | null;
  type?: string | null;
  initiativeType?: string | null;
  title?: string | null;
  regionRotateLong?: string | null;
  targetWeight?: number | null;
  targetYield?: number | null;
  airlineYield?: number | null;
  marketYield?: number | null;
  benchmarkYield?: number | null;
  revenueWeekly?: number | null;
  contributionWeekly?: number | null;
  status?: string | null;
  statusChangedAt?: string | null;
  assignee?: SalesCockpitAssignee | null;
};

export type SalesCockpitClientConfig = {
  apiUrl: string;
  cognitoClientId: string;
  botEmail: string;
  botPassword: string;
  tenant: string;
};

const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (value === undefined || value.trim().length === 0) {
    throw new Error(
      `${name} is not set. A server admin must configure it on the Rotate Cargo application registration.`,
    );
  }

  return value.trim();
};

// Server variables (shared bot) and the workspace's application variables are
// both injected into process.env on every execution.
export const readSalesCockpitConfig = (): SalesCockpitClientConfig | null => {
  const tenant = process.env.SALES_COCKPIT_TENANT?.trim();

  if (!tenant) {
    return null;
  }

  return {
    apiUrl: requiredEnv('SALES_COCKPIT_API_URL').replace(/\/+$/, ''),
    cognitoClientId: requiredEnv('SALES_COCKPIT_COGNITO_CLIENT_ID'),
    botEmail: requiredEnv('SALES_COCKPIT_BOT_EMAIL'),
    botPassword: requiredEnv('SALES_COCKPIT_BOT_PASSWORD'),
    tenant,
  };
};

// USER_PASSWORD_AUTH, the same flow the Sales Cockpit pipeline bot uses; the
// customer-api wants the Cognito IdToken as bearer.
export const fetchCognitoIdToken = async (
  config: SalesCockpitClientConfig,
): Promise<string> => {
  const response = await fetch(COGNITO_IDP_URL, {
    method: 'POST',
    headers: {
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
      'Content-Type': 'application/x-amz-json-1.1',
    },
    body: JSON.stringify({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: config.cognitoClientId,
      AuthParameters: {
        USERNAME: config.botEmail,
        PASSWORD: config.botPassword,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Cognito authentication failed (${response.status}): ${await response.text()}`,
    );
  }

  const payload = (await response.json()) as {
    AuthenticationResult?: { IdToken?: string };
  };
  const idToken = payload.AuthenticationResult?.IdToken;

  if (!idToken) {
    throw new Error('Cognito returned no IdToken');
  }

  return idToken;
};

export const fetchSalesCockpitInitiatives = async (
  config: SalesCockpitClientConfig,
  idToken: string,
): Promise<SalesCockpitInitiative[]> => {
  const response = await fetch(
    `${config.apiUrl}/${SALES_COCKPIT_INITIATIVES_PATH}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'X-Tenant': config.tenant,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        offset: 0,
        status: SALES_COCKPIT_STATUSES,
        fields: SALES_COCKPIT_FIELDS,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Sales Cockpit ${SALES_COCKPIT_INITIATIVES_PATH} failed (${response.status}) for tenant "${config.tenant}": ${await response.text()}`,
    );
  }

  const payload = (await response.json()) as unknown;

  if (Array.isArray(payload)) {
    return payload as SalesCockpitInitiative[];
  }

  if (
    payload !== null &&
    typeof payload === 'object' &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: SalesCockpitInitiative[] }).data;
  }

  throw new Error('Unexpected Sales Cockpit response shape');
};
