import { CoreApiClient } from 'twenty-client-sdk/core';
import { definePostInstallLogicFunction } from 'twenty-sdk/define';

import { POST_INSTALL_LOGIC_FUNCTION_ID } from 'src/constants/universal-identifiers';

// Major cargo stations so Lanes and Initiatives have something to link to on
// day one; the sync adds any others it meets. Full demo tenants (regions,
// staff, forwarders, initiatives) come from POST /s/rotate-cargo/seed-demo.
const SEED_STATIONS = [
  ['AMS', 'Amsterdam Schiphol', 'Netherlands', 'EUROPE'],
  ['FRA', 'Frankfurt', 'Germany', 'EUROPE'],
  ['LHR', 'London Heathrow', 'United Kingdom', 'EUROPE'],
  ['CDG', 'Paris Charles de Gaulle', 'France', 'EUROPE'],
  ['LUX', 'Luxembourg', 'Luxembourg', 'EUROPE'],
  ['IST', 'Istanbul', 'Türkiye', 'EUROPE'],
  ['DXB', 'Dubai', 'United Arab Emirates', 'MIDDLE_EAST'],
  ['AUH', 'Abu Dhabi', 'United Arab Emirates', 'MIDDLE_EAST'],
  ['DOH', 'Doha', 'Qatar', 'MIDDLE_EAST'],
  ['JNB', 'Johannesburg', 'South Africa', 'AFRICA'],
  ['NBO', 'Nairobi', 'Kenya', 'AFRICA'],
  ['HKG', 'Hong Kong', 'Hong Kong SAR', 'ASIA_PACIFIC'],
  ['PVG', 'Shanghai Pudong', 'China', 'ASIA_PACIFIC'],
  ['NRT', 'Tokyo Narita', 'Japan', 'ASIA_PACIFIC'],
  ['ICN', 'Seoul Incheon', 'South Korea', 'ASIA_PACIFIC'],
  ['SIN', 'Singapore', 'Singapore', 'ASIA_PACIFIC'],
  ['SYD', 'Sydney', 'Australia', 'ASIA_PACIFIC'],
  ['JFK', 'New York JFK', 'United States', 'NORTH_AMERICA'],
  ['ORD', 'Chicago O\'Hare', 'United States', 'NORTH_AMERICA'],
  ['LAX', 'Los Angeles', 'United States', 'NORTH_AMERICA'],
  ['MIA', 'Miami', 'United States', 'NORTH_AMERICA'],
  ['YYZ', 'Toronto Pearson', 'Canada', 'NORTH_AMERICA'],
  ['MEX', 'Mexico City', 'Mexico', 'LATIN_AMERICA'],
  ['GRU', 'São Paulo Guarulhos', 'Brazil', 'LATIN_AMERICA'],
  ['SCL', 'Santiago', 'Chile', 'LATIN_AMERICA'],
] as const;

const handler = async () => {
  const client = new CoreApiClient() as unknown as {
    query: (input: any) => Promise<any>;
    mutation: (input: any) => Promise<any>;
  };

  const existing = await client.query({
    stations: {
      __args: { first: 1 },
      edges: { node: { id: true } },
    },
  });

  // Re-installs and upgrades run this again; never duplicate seed data.
  if (existing.stations?.edges?.length > 0) {
    return {};
  }

  await client.mutation({
    createStations: {
      __args: {
        data: SEED_STATIONS.map(([iataCode, name, country, region]) => ({
          iataCode,
          name,
          country,
          region,
          isHub: false,
        })),
      },
      id: true,
    },
  });

  console.log(`[rotate-cargo] Seeded ${SEED_STATIONS.length} stations.`);

  return {};
};

export default definePostInstallLogicFunction({
  universalIdentifier: POST_INSTALL_LOGIC_FUNCTION_ID,
  name: 'post-install',
  description: 'Seeds the major cargo stations on first install.',
  timeoutSeconds: 60,
  shouldRunSynchronously: true,
  handler,
});
