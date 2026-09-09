export type DemoStation = {
  iata: string;
  name: string;
  country: string;
  region: 'EUROPE' | 'MIDDLE_EAST' | 'AFRICA' | 'ASIA_PACIFIC' | 'NORTH_AMERICA' | 'LATIN_AMERICA';
  isHub?: boolean;
};

export type DemoRegion = {
  code: string;
  name: string;
  description: string;
  regionalManagerEmail: string;
  stations: DemoStation[];
};

export type DemoContact = {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  city: string;
  phone?: { callingCode: string; countryCode: string; number: string };
};

export type DemoForwarder = {
  name: string;
  domain: string;
  agentName: string;
  cassCode: string;
  segment: 'SUMMIT' | 'NON_SUMMIT';
  tier: 'VERY_LARGE' | 'LARGE' | 'MEDIUM' | 'SMALL';
  homeStation: string;
  accountOwnerEmail: string;
  city: string;
  contacts: DemoContact[];
};

export type DemoLane = {
  name: string;
  legColour: 'GREEN' | 'AMBER' | 'RED';
  weeklyTonnesAirline: number;
  weeklyTonnesMarket: number;
  yieldAirline: number;
  yieldMarket: number;
};

// [externalId, initiativeNumber, category, type, status, agentName, station,
//  originDestination, routing, targetTonnes, targetYield, airlineYield,
//  marketYield, revenueWeeklyUsd, assigneeEmail, title]
export type DemoInitiativeRow = [
  string, string, string, 'RATE' | 'MIX' | 'VOLUME',
  'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'SNOOZED' | 'DISMISSED' | 'CLOSED',
  string, string, string, string, number, number | null, number | null, number | null, number, string, string,
];

export type DemoOpportunity = {
  name: string;
  forwarder: string;
  stage: 'NEW' | 'SCREENING' | 'MEETING' | 'PROPOSAL' | 'CUSTOMER';
  amountUsd: number;
  closeDate: string;
  contactEmail: string;
};

export type DemoNote = { title: string; markdown: string; forwarder: string };

export type DemoTask = {
  title: string;
  markdown: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueAt: string;
  forwarder: string;
  assigneeEmail: string;
};

export type DemoTenant = {
  key: string;
  airline: string;
  headOfSalesEmail: string;
  accountManagerStations: Record<string, string>;
  regions: DemoRegion[];
  forwarders: DemoForwarder[];
  lanes: DemoLane[];
  initiatives: DemoInitiativeRow[];
  opportunities: DemoOpportunity[];
  notes: DemoNote[];
  tasks: DemoTask[];
};
