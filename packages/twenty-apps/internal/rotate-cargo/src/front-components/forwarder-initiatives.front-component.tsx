import { useEffect, useState } from 'react';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineFrontComponent } from 'twenty-sdk/define';
import { useRecordId } from 'twenty-sdk/front-component';

import { FORWARDER_INITIATIVES_FRONT_COMPONENT_ID } from 'src/constants/universal-identifiers';

type InitiativeRow = {
  id: string;
  name: string;
  status: string;
  initiativeType: string | null;
  originDestination: string | null;
  stationIata: string | null;
  targetWeightTonnes: number | null;
  targetYield: number | null;
  revenueWeekly: { amountMicros: number | null; currencyCode: string } | null;
  assigneeName: string | null;
  cockpitUrl: { primaryLinkUrl: string | null } | null;
};

const STATUS_COLOURS: Record<string, string> = {
  PENDING: '#5F6468',
  ACCEPTED: '#1F8DA3',
  COMPLETED: '#2E8B6F',
  SNOOZED: '#C98A16',
  DISMISSED: '#DE3A2C',
  CLOSED: '#5F6468',
  ARCHIVED: '#8A8F92',
};

const formatUsd = (amountMicros: number | null | undefined): string =>
  typeof amountMicros === 'number'
    ? `$${Math.round(amountMicros / 1_000_000).toLocaleString()}`
    : '–';

const formatNumber = (value: number | null, decimals = 1): string =>
  typeof value === 'number' ? value.toFixed(decimals) : '–';

const tableStyle = {
  borderCollapse: 'collapse' as const,
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 13,
  width: '100%',
};

const cellStyle = {
  borderBottom: '1px solid #E2E6E1',
  padding: '8px 10px',
  textAlign: 'left' as const,
  verticalAlign: 'top' as const,
};

const headerCellStyle = {
  ...cellStyle,
  color: '#5F6468',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
};

export const ForwarderInitiatives = () => {
  const companyId = useRecordId();
  const [rows, setRows] = useState<InitiativeRow[] | null>(null);

  useEffect(() => {
    if (!companyId) {
      setRows([]);

      return;
    }

    const client = new CoreApiClient() as unknown as {
      query: (input: any) => Promise<any>;
    };

    client
      .query({
        salesInitiatives: {
          __args: {
            filter: { forwarderId: { eq: companyId } },
            first: 100,
            orderBy: [{ revenueWeeklyAmountMicros: 'DescNullsLast' }],
          },
          edges: {
            node: {
              id: true,
              name: true,
              status: true,
              initiativeType: true,
              originDestination: true,
              stationIata: true,
              targetWeightTonnes: true,
              targetYield: true,
              revenueWeekly: { amountMicros: true, currencyCode: true },
              assigneeName: true,
              cockpitUrl: { primaryLinkUrl: true },
            },
          },
        },
      })
      .then((result) =>
        setRows(
          result.salesInitiatives.edges.map(
            (edge: { node: InitiativeRow }) => edge.node,
          ),
        ),
      )
      .catch(() => setRows([]));
  }, [companyId]);

  if (rows === null) {
    return <div style={{ padding: 8, color: '#5F6468' }}>Loading…</div>;
  }

  if (rows.length === 0) {
    return (
      <div style={{ padding: 8, color: '#5F6468', fontSize: 13 }}>
        No Sales Cockpit initiatives are linked to this forwarder. The sync
        matches on the company's “Sales Cockpit agent name”, then on its name.
      </div>
    );
  }

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={headerCellStyle}>Initiative</th>
          <th style={headerCellStyle}>Status</th>
          <th style={headerCellStyle}>Lane</th>
          <th style={headerCellStyle}>Target t/wk</th>
          <th style={headerCellStyle}>Target yield</th>
          <th style={headerCellStyle}>Revenue / wk</th>
          <th style={headerCellStyle}>Assignee</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td style={cellStyle}>
              {row.cockpitUrl?.primaryLinkUrl ? (
                <a
                  href={row.cockpitUrl.primaryLinkUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#0F1111' }}
                >
                  {row.name}
                </a>
              ) : (
                row.name
              )}
              {row.initiativeType && (
                <span style={{ color: '#5F6468' }}> · {row.initiativeType.toLowerCase()}</span>
              )}
            </td>
            <td style={{ ...cellStyle, color: STATUS_COLOURS[row.status] ?? '#0F1111', fontWeight: 600 }}>
              {row.status.charAt(0) + row.status.slice(1).toLowerCase()}
            </td>
            <td style={cellStyle}>{row.originDestination ?? row.stationIata ?? '–'}</td>
            <td style={cellStyle}>{formatNumber(row.targetWeightTonnes)}</td>
            <td style={cellStyle}>{formatNumber(row.targetYield, 2)}</td>
            <td style={cellStyle}>{formatUsd(row.revenueWeekly?.amountMicros)}</td>
            <td style={cellStyle}>{row.assigneeName ?? '–'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default defineFrontComponent({
  universalIdentifier: FORWARDER_INITIATIVES_FRONT_COMPONENT_ID,
  name: 'forwarder-initiatives',
  description:
    'Company record tab listing the Sales Cockpit initiatives linked to this forwarder.',
  component: ForwarderInitiatives,
});
