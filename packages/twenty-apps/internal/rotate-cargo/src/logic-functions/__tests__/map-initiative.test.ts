import { describe, expect, it } from 'vitest';

import {
  buildCockpitUrl,
  extractInitiativeNumber,
  mapSalesCockpitInitiative,
  mapSalesCockpitInitiativeType,
  mapSalesCockpitStatus,
  splitOriginDestination,
} from 'src/logic-functions/utils/map-initiative';

describe('mapSalesCockpitStatus', () => {
  it('collapses archived variants onto ARCHIVED', () => {
    expect(mapSalesCockpitStatus('ARCHIVED_COMPLETED')).toBe('ARCHIVED');
    expect(mapSalesCockpitStatus('ARCHIVED_PENDING')).toBe('ARCHIVED');
  });

  it('keeps the live statuses and defaults unknown ones to PENDING', () => {
    expect(mapSalesCockpitStatus('ACCEPTED')).toBe('ACCEPTED');
    expect(mapSalesCockpitStatus('snoozed')).toBe('SNOOZED');
    expect(mapSalesCockpitStatus('SOMETHING_NEW')).toBe('PENDING');
    expect(mapSalesCockpitStatus(null)).toBe('PENDING');
  });
});

describe('mapSalesCockpitInitiativeType', () => {
  it('reads the init_type from either field', () => {
    expect(mapSalesCockpitInitiativeType({ type: 'volume' })).toBe('VOLUME');
    expect(
      mapSalesCockpitInitiativeType({ type: '3.1', initiativeType: 'rate' }),
    ).toBe('RATE');
    expect(mapSalesCockpitInitiativeType({ type: null })).toBeNull();
  });
});

describe('extractInitiativeNumber', () => {
  it('prefers an explicit rule number and falls back to the similarity id', () => {
    expect(extractInitiativeNumber({ initiativeType: '3.1' })).toBe('3.1');
    expect(
      extractInitiativeNumber({
        initiativeType: 'volume',
        similarityId: '1.1HKG-AMSDGFHKG-AMS',
      }),
    ).toBe('1.1');
    expect(extractInitiativeNumber({ similarityId: 'NETWOPTAGENT' })).toBeNull();
  });
});

describe('splitOriginDestination', () => {
  it('parses IATA pairs only', () => {
    expect(splitOriginDestination('AMS-AUH')).toEqual({
      originIata: 'AMS',
      destinationIata: 'AUH',
    });
    expect(splitOriginDestination('HKG-DXB-AMS')).toBeNull();
    expect(splitOriginDestination(null)).toBeNull();
  });
});

describe('buildCockpitUrl', () => {
  it('links back to the tenant browser, or nothing without an app url', () => {
    expect(buildCockpitUrl('https://app.prod.letsrotate.com/', 'etihad', 'abc')?.primaryLinkUrl).toBe(
      'https://app.prod.letsrotate.com/cockpit/etihad/browser?initiativeId=abc',
    );
    expect(buildCockpitUrl('', 'etihad', 'abc')).toBeNull();
  });
});

describe('mapSalesCockpitInitiative', () => {
  it('maps a cockpit document onto the CRM record shape', () => {
    const record = mapSalesCockpitInitiative({
      initiative: {
        _id: '64f0',
        runId: 'run-1',
        similarityId: '3.1HKG-LHRExpeditorsHKG-LHR',
        agentName: 'Expeditors',
        originDestination: 'hkg-lhr',
        routing: 'HKG-LHR',
        station: 'hkg',
        category: 'GREEN-VP-NECS',
        type: 'volume',
        title: 'Develop new business',
        regionRotateLong: 'Asia Pacific',
        targetWeight: 12.5,
        targetYield: 3.2,
        airlineYield: 2.9,
        revenueWeekly: 40000.4,
        status: 'ACCEPTED',
        assignee: { name: 'Ana', email: 'ANA@AIRLINE.COM' },
        runTimestamp: '2026-09-01T00:00:00.000Z',
      },
      tenant: 'demo',
      appUrl: 'https://app.prod.letsrotate.com',
      syncedAt: '2026-09-08T12:00:00.000Z',
    });

    expect(record).toMatchObject({
      name: 'Develop new business',
      externalId: '64f0',
      initiativeNumber: '3.1',
      initiativeType: 'VOLUME',
      status: 'ACCEPTED',
      stationIata: 'HKG',
      originDestination: 'HKG-LHR',
      targetWeightTonnes: 12.5,
      revenueWeekly: { amountMicros: 40000400000, currencyCode: 'USD' },
      contributionWeekly: null,
      assigneeEmail: 'ana@airline.com',
      lastSyncedAt: '2026-09-08T12:00:00.000Z',
    });
    expect(record.cockpitUrl?.primaryLinkUrl).toContain('/cockpit/demo/browser');
  });

  it('builds a title from category, agent and lane when the cockpit has none', () => {
    const record = mapSalesCockpitInitiative({
      initiative: {
        _id: 'x',
        category: 'RED-YP',
        agentName: 'Geodis',
        originDestination: 'AMS-AUH',
      },
      tenant: 'demo',
      appUrl: undefined,
      syncedAt: '2026-09-08T12:00:00.000Z',
    });

    expect(record.name).toBe('RED-YP · Geodis · AMS-AUH');
    expect(record.cockpitUrl).toBeNull();
  });
});
