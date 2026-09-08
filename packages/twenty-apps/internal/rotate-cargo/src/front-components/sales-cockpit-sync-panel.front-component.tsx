import { useEffect, useState } from 'react';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineFrontComponent } from 'twenty-sdk/define';
import {
  enqueueSnackbar,
  getApplicationVariable,
} from 'twenty-sdk/front-component';

import { SALES_COCKPIT_SYNC_PANEL_FRONT_COMPONENT_ID } from 'src/constants/universal-identifiers';

type StatusCounts = Record<string, number>;

type SyncResult = {
  success: boolean;
  fetched: number;
  created: number;
  updated: number;
  unmatchedForwarders: string[];
  syncedAt: string;
  error?: string;
};

const STATUS_ORDER = ['PENDING', 'ACCEPTED', 'COMPLETED', 'SNOOZED', 'DISMISSED', 'CLOSED', 'ARCHIVED'];

const callSyncRoute = async (): Promise<SyncResult> => {
  const apiBaseUrl = process.env.TWENTY_API_URL;
  const token =
    process.env.TWENTY_APP_ACCESS_TOKEN ?? process.env.TWENTY_API_KEY;

  if (!apiBaseUrl || !token) {
    throw new Error('API configuration missing');
  }

  const response = await fetch(`${apiBaseUrl}/s/sales-cockpit/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: '{}',
  });

  if (!response.ok) {
    throw new Error(`Sync failed (${response.status}): ${await response.text()}`);
  }

  return (await response.json()) as SyncResult;
};

const loadStatusCounts = async (): Promise<StatusCounts> => {
  const client = new CoreApiClient() as unknown as {
    query: (input: any) => Promise<any>;
  };
  const counts: StatusCounts = {};
  let after: string | undefined;

  for (;;) {
    const result = await client.query({
      salesInitiatives: {
        __args: { first: 200, ...(after ? { after } : {}) },
        edges: { node: { status: true } },
        pageInfo: { hasNextPage: true, endCursor: true },
      },
    });
    const connection = result.salesInitiatives;

    for (const edge of connection.edges as { node: { status: string } }[]) {
      counts[edge.node.status] = (counts[edge.node.status] ?? 0) + 1;
    }

    if (!connection.pageInfo?.hasNextPage) {
      return counts;
    }

    after = connection.pageInfo.endCursor;
  }
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 12,
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 13,
  padding: 4,
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 8,
};

const buttonStyle = {
  alignSelf: 'flex-start',
  background: '#EF483A',
  border: 0,
  borderRadius: 6,
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 600,
  padding: '8px 12px',
};

export const SalesCockpitSyncPanel = () => {
  const tenant = getApplicationVariable('SALES_COCKPIT_TENANT');
  const [counts, setCounts] = useState<StatusCounts | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastResult, setLastResult] = useState<SyncResult | null>(null);

  useEffect(() => {
    loadStatusCounts()
      .then(setCounts)
      .catch(() => setCounts({}));
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);

    try {
      const result = await callSyncRoute();

      setLastResult(result);
      setCounts(await loadStatusCounts());
      enqueueSnackbar({
        message: result.success
          ? `Synced ${result.fetched} initiatives (${result.created} new, ${result.updated} updated)`
          : `Sync failed: ${result.error ?? 'unknown error'}`,
        options: { variant: result.success ? 'success' : 'error' },
      } as any);
    } catch (error) {
      enqueueSnackbar({
        message: error instanceof Error ? error.message : 'Sync failed',
        options: { variant: 'error' },
      } as any);
    } finally {
      setIsSyncing(false);
    }
  };

  const total = counts
    ? Object.values(counts).reduce((sum, count) => sum + count, 0)
    : null;

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        <span style={{ color: '#5F6468' }}>Tenant</span>
        <strong>{tenant && tenant.length > 0 ? tenant : 'not configured'}</strong>
      </div>
      <div style={rowStyle}>
        <span style={{ color: '#5F6468' }}>Initiatives</span>
        <strong>{total ?? '…'}</strong>
      </div>
      {counts &&
        STATUS_ORDER.filter((status) => counts[status] > 0).map((status) => (
          <div key={status} style={rowStyle}>
            <span style={{ color: '#5F6468', textTransform: 'capitalize' }}>
              {status.toLowerCase()}
            </span>
            <span>{counts[status]}</span>
          </div>
        ))}
      {lastResult && (
        <div style={{ color: lastResult.success ? '#2E8B6F' : '#DE3A2C' }}>
          {lastResult.success
            ? `Last sync ${new Date(lastResult.syncedAt).toLocaleString()}: ${lastResult.created} new, ${lastResult.updated} updated${
                lastResult.unmatchedForwarders.length > 0
                  ? `, ${lastResult.unmatchedForwarders.length} forwarders unmatched`
                  : ''
              }`
            : lastResult.error}
        </div>
      )}
      {lastResult && lastResult.unmatchedForwarders.length > 0 && (
        <div style={{ color: '#5F6468' }}>
          Set “Sales Cockpit agent name” on a company to match:{' '}
          {lastResult.unmatchedForwarders.slice(0, 8).join(', ')}
          {lastResult.unmatchedForwarders.length > 8 ? ', …' : ''}
        </div>
      )}
      <button
        type="button"
        style={{ ...buttonStyle, opacity: isSyncing || !tenant ? 0.6 : 1 }}
        disabled={isSyncing || !tenant}
        onClick={handleSync}
      >
        {isSyncing ? 'Syncing…' : 'Sync now'}
      </button>
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: SALES_COCKPIT_SYNC_PANEL_FRONT_COMPONENT_ID,
  name: 'sales-cockpit-sync-panel',
  description:
    'Dashboard widget: initiative counts by status and a button to sync from the Sales Cockpit now.',
  component: SalesCockpitSyncPanel,
});
