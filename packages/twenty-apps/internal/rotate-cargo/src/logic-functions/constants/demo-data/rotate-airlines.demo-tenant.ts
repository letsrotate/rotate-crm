import { type DemoTenant } from 'src/logic-functions/constants/demo-data/demo-tenant.type';

// Rotate Airlines: a fictional European carrier with an AMS hub, used as the
// second tenant so multi-tenancy is visible in dev and demos.
const R = (local: string) => `${local}@rotateairlines.dev`;

export const ROTATE_AIRLINES_DEMO_TENANT: DemoTenant = {
  key: 'rotate',
  airline: 'Rotate Airlines',
  headOfSalesEmail: R('fleur.jansen'),
  accountManagerStations: {
    [R('sanne.visser')]: 'AMS',
    [R('jonas.becker')]: 'FRA',
    [R('emma.clarke')]: 'LHR',
    [R('michael.rossi')]: 'JFK',
    [R('wingsze.chan')]: 'HKG',
    [R('layla.nasser')]: 'DXB',
  },
  regions: [
    {
      code: 'EUR',
      name: 'Europe',
      description: 'Home market around the Amsterdam hub',
      regionalManagerEmail: R('pieter.bakker'),
      stations: [
        { iata: 'AMS', name: 'Amsterdam Schiphol', country: 'Netherlands', region: 'EUROPE', isHub: true },
        { iata: 'FRA', name: 'Frankfurt', country: 'Germany', region: 'EUROPE' },
        { iata: 'LHR', name: 'London Heathrow', country: 'United Kingdom', region: 'EUROPE' },
        { iata: 'CDG', name: 'Paris Charles de Gaulle', country: 'France', region: 'EUROPE' },
        { iata: 'MXP', name: 'Milan Malpensa', country: 'Italy', region: 'EUROPE' },
      ],
    },
    {
      code: 'AMER',
      name: 'Americas',
      description: 'Transatlantic gateways and the Brazil freighter',
      regionalManagerEmail: R('laura.smith'),
      stations: [
        { iata: 'JFK', name: 'New York JFK', country: 'United States', region: 'NORTH_AMERICA' },
        { iata: 'MIA', name: 'Miami', country: 'United States', region: 'NORTH_AMERICA' },
        { iata: 'YYZ', name: 'Toronto Pearson', country: 'Canada', region: 'NORTH_AMERICA' },
        { iata: 'GRU', name: 'São Paulo Guarulhos', country: 'Brazil', region: 'LATIN_AMERICA' },
      ],
    },
    {
      code: 'APAC',
      name: 'Asia Pacific',
      description: 'Greater China, Japan and Southeast Asia',
      regionalManagerEmail: R('kenji.sato'),
      stations: [
        { iata: 'HKG', name: 'Hong Kong', country: 'Hong Kong SAR', region: 'ASIA_PACIFIC' },
        { iata: 'PVG', name: 'Shanghai Pudong', country: 'China', region: 'ASIA_PACIFIC' },
        { iata: 'NRT', name: 'Tokyo Narita', country: 'Japan', region: 'ASIA_PACIFIC' },
        { iata: 'SIN', name: 'Singapore Changi', country: 'Singapore', region: 'ASIA_PACIFIC' },
      ],
    },
    {
      code: 'MEA',
      name: 'Middle East & Africa',
      description: 'Gulf and African stations served via the DXB freighter',
      regionalManagerEmail: R('yusuf.demir'),
      stations: [
        { iata: 'DXB', name: 'Dubai', country: 'United Arab Emirates', region: 'MIDDLE_EAST' },
        { iata: 'NBO', name: 'Nairobi Jomo Kenyatta', country: 'Kenya', region: 'AFRICA' },
        { iata: 'JNB', name: 'Johannesburg O.R. Tambo', country: 'South Africa', region: 'AFRICA' },
      ],
    },
  ],
  forwarders: [
    { name: 'Kuehne+Nagel', domain: 'kuehne-nagel.com', agentName: 'Kuehne + Nagel', cassCode: '5712345', segment: 'SUMMIT', tier: 'VERY_LARGE', homeStation: 'AMS', accountOwnerEmail: R('sanne.visser'), city: 'Schiphol',
      contacts: [
        { firstName: 'Daan', lastName: 'Mulder', jobTitle: 'National Air Logistics Manager', email: 'daan.mulder@kuehne-nagel.com', city: 'Schiphol', phone: { callingCode: '+31', countryCode: 'NL', number: '206541234' } },
      ] },
    { name: 'DHL Global Forwarding', domain: 'dhl.com', agentName: 'DHL Global Forwarding', cassCode: '5718876', segment: 'SUMMIT', tier: 'VERY_LARGE', homeStation: 'FRA', accountOwnerEmail: R('jonas.becker'), city: 'Frankfurt',
      contacts: [
        { firstName: 'Katrin', lastName: 'Vogel', jobTitle: 'Head of Airfreight Procurement Europe', email: 'katrin.vogel@dhl.com', city: 'Frankfurt', phone: { callingCode: '+49', countryCode: 'DE', number: '6987654321' } },
      ] },
    { name: 'DSV', domain: 'dsv.com', agentName: 'DSV Air & Sea', cassCode: '5734412', segment: 'SUMMIT', tier: 'LARGE', homeStation: 'AMS', accountOwnerEmail: R('sanne.visser'), city: 'Amsterdam',
      contacts: [
        { firstName: 'Lotte', lastName: 'Bos', jobTitle: 'Air Freight Manager Benelux', email: 'lotte.bos@dsv.com', city: 'Amsterdam' },
      ] },
    { name: 'Expeditors', domain: 'expeditors.com', agentName: 'Expeditors', cassCode: '5741107', segment: 'SUMMIT', tier: 'LARGE', homeStation: 'HKG', accountOwnerEmail: R('wingsze.chan'), city: 'Hong Kong',
      contacts: [
        { firstName: 'Jason', lastName: 'Ng', jobTitle: 'Air Export Manager', email: 'jason.ng@expeditors.com', city: 'Hong Kong', phone: { callingCode: '+852', countryCode: 'HK', number: '98765432' } },
      ] },
    { name: 'Yusen Logistics', domain: 'yusen-logistics.com', agentName: 'Yusen Logistics', cassCode: '5756690', segment: 'NON_SUMMIT', tier: 'MEDIUM', homeStation: 'NRT', accountOwnerEmail: R('wingsze.chan'), city: 'Tokyo',
      contacts: [
        { firstName: 'Haruto', lastName: 'Takahashi', jobTitle: 'Air Export Section Chief', email: 'haruto.takahashi@yusen-logistics.com', city: 'Tokyo', phone: { callingCode: '+81', countryCode: 'JP', number: '312345678' } },
      ] },
    { name: 'Bolloré Logistics', domain: 'bollore-logistics.com', agentName: 'Bollore Logistics', cassCode: '5760233', segment: 'NON_SUMMIT', tier: 'MEDIUM', homeStation: 'CDG', accountOwnerEmail: R('emma.clarke'), city: 'Paris',
      contacts: [
        { firstName: 'Julien', lastName: 'Petit', jobTitle: 'Airfreight Director', email: 'julien.petit@bollore-logistics.com', city: 'Paris' },
      ] },
    { name: 'Davies Turner', domain: 'daviesturner.com', agentName: 'Davies Turner', cassCode: '5772201', segment: 'NON_SUMMIT', tier: 'SMALL', homeStation: 'LHR', accountOwnerEmail: R('emma.clarke'), city: 'London',
      contacts: [
        { firstName: 'Oliver', lastName: 'Bennett', jobTitle: 'Air Freight Manager', email: 'oliver.bennett@daviesturner.com', city: 'London', phone: { callingCode: '+44', countryCode: 'GB', number: '2089876543' } },
      ] },
    { name: 'CEVA Logistics', domain: 'cevalogistics.com', agentName: 'CEVA Logistics', cassCode: '5782287', segment: 'NON_SUMMIT', tier: 'MEDIUM', homeStation: 'JFK', accountOwnerEmail: R('michael.rossi'), city: 'New York',
      contacts: [
        { firstName: 'Angela', lastName: 'Torres', jobTitle: 'Airfreight Manager Northeast', email: 'angela.torres@cevalogistics.com', city: 'New York', phone: { callingCode: '+1', countryCode: 'US', number: '7185551234' } },
      ] },
    { name: 'Craft Multimodal', domain: 'craftmultimodal.com.br', agentName: 'Craft Multimodal', cassCode: '5793390', segment: 'NON_SUMMIT', tier: 'SMALL', homeStation: 'GRU', accountOwnerEmail: R('michael.rossi'), city: 'São Paulo',
      contacts: [
        { firstName: 'Beatriz', lastName: 'Lima', jobTitle: 'Coordenadora Aéreo', email: 'beatriz.lima@craftmultimodal.com.br', city: 'São Paulo' },
      ] },
    { name: 'Freightworks', domain: 'freightworks.com', agentName: 'Freightworks', cassCode: '5801120', segment: 'NON_SUMMIT', tier: 'SMALL', homeStation: 'DXB', accountOwnerEmail: R('layla.nasser'), city: 'Dubai',
      contacts: [
        { firstName: 'Hassan', lastName: 'Rahimi', jobTitle: 'Airfreight Manager', email: 'hassan.rahimi@freightworks.com', city: 'Dubai', phone: { callingCode: '+971', countryCode: 'AE', number: '551234567' } },
      ] },
  ],
  lanes: [
    { name: 'AMS-JFK', legColour: 'AMBER', weeklyTonnesAirline: 48, weeklyTonnesMarket: 1650, yieldAirline: 2.35, yieldMarket: 2.50 },
    { name: 'AMS-HKG', legColour: 'GREEN', weeklyTonnesAirline: 22, weeklyTonnesMarket: 980, yieldAirline: 2.10, yieldMarket: 2.30 },
    { name: 'AMS-DXB', legColour: 'GREEN', weeklyTonnesAirline: 31, weeklyTonnesMarket: 420, yieldAirline: 2.20, yieldMarket: 2.45 },
    { name: 'AMS-GRU', legColour: 'RED', weeklyTonnesAirline: 40, weeklyTonnesMarket: 760, yieldAirline: 3.60, yieldMarket: 3.45 },
    { name: 'FRA-JFK', legColour: 'AMBER', weeklyTonnesAirline: 26, weeklyTonnesMarket: 2900, yieldAirline: 2.55, yieldMarket: 2.60 },
    { name: 'FRA-NBO', legColour: 'GREEN', weeklyTonnesAirline: 9, weeklyTonnesMarket: 180, yieldAirline: 2.70, yieldMarket: 2.95 },
    { name: 'LHR-MIA', legColour: 'GREEN', weeklyTonnesAirline: 14, weeklyTonnesMarket: 610, yieldAirline: 2.40, yieldMarket: 2.65 },
    { name: 'CDG-YYZ', legColour: 'GREEN', weeklyTonnesAirline: 11, weeklyTonnesMarket: 340, yieldAirline: 2.30, yieldMarket: 2.50 },
    { name: 'HKG-AMS', legColour: 'RED', weeklyTonnesAirline: 58, weeklyTonnesMarket: 2400, yieldAirline: 3.90, yieldMarket: 3.75 },
    { name: 'PVG-AMS', legColour: 'RED', weeklyTonnesAirline: 36, weeklyTonnesMarket: 1900, yieldAirline: 4.05, yieldMarket: 3.85 },
    { name: 'NRT-AMS', legColour: 'AMBER', weeklyTonnesAirline: 19, weeklyTonnesMarket: 720, yieldAirline: 3.70, yieldMarket: 3.60 },
    { name: 'SIN-AMS', legColour: 'GREEN', weeklyTonnesAirline: 12, weeklyTonnesMarket: 540, yieldAirline: 3.15, yieldMarket: 3.35 },
    { name: 'JFK-AMS', legColour: 'GREEN', weeklyTonnesAirline: 33, weeklyTonnesMarket: 1500, yieldAirline: 1.95, yieldMarket: 2.15 },
    { name: 'GRU-AMS', legColour: 'AMBER', weeklyTonnesAirline: 45, weeklyTonnesMarket: 830, yieldAirline: 3.25, yieldMarket: 3.30 },
    { name: 'DXB-AMS', legColour: 'GREEN', weeklyTonnesAirline: 17, weeklyTonnesMarket: 390, yieldAirline: 2.60, yieldMarket: 2.85 },
    { name: 'NBO-AMS', legColour: 'RED', weeklyTonnesAirline: 28, weeklyTonnesMarket: 350, yieldAirline: 2.95, yieldMarket: 2.80 },
  ],
  initiatives: [
    ['66d0b2f1a2c3d4e5f6a7b001', '1.1', 'RED-YP', 'RATE', 'ACCEPTED', 'Kuehne + Nagel', 'AMS', 'AMS-JFK', 'AMS-JFK', 14.0, 2.55, 2.35, 2.50, 2800, R('sanne.visser'), 'Close yield gap: Kuehne + Nagel AMS-JFK'],
    ['66d0b2f1a2c3d4e5f6a7b002', '3.1', 'GREEN-VP-NECS', 'VOLUME', 'ACCEPTED', 'DSV Air & Sea', 'AMS', 'AMS-DXB', 'AMS-DXB', 8.0, 2.40, null, 2.45, 19200, R('sanne.visser'), 'Develop new business: DSV AMS-DXB'],
    ['66d0b2f1a2c3d4e5f6a7b003', '3.3', 'GREEN-VP-LEV-NEOD', 'VOLUME', 'PENDING', 'Kuehne + Nagel', 'AMS', 'AMS-HKG', 'AMS-HKG', 10.0, 2.25, null, 2.30, 22500, R('sanne.visser'), 'Leverage access: Kuehne + Nagel AMS-HKG'],
    ['66d0b2f1a2c3d4e5f6a7b004', '2.1', 'RED-RED-SWAP', 'MIX', 'PENDING', 'DSV Air & Sea', 'AMS', 'AMS-GRU', 'AMS-GRU', 6.0, 3.55, 3.60, 3.45, 3600, R('sanne.visser'), 'Improve destination mix: DSV AMS-GRU to AMS-MIA'],
    ['66d0b2f1a2c3d4e5f6a7b005', '1.2', 'RED-YP-MS', 'RATE', 'COMPLETED', 'DHL Global Forwarding', 'FRA', 'FRA-JFK', 'FRA-AMS-JFK', 12.0, 2.70, 2.55, 2.60, 1800, R('jonas.becker'), 'Close yield gap: DHL FRA-JFK'],
    ['66d0b2f1a2c3d4e5f6a7b006', '3.7', 'GREEN-VP-NECS-DRIVE', 'VOLUME', 'ACCEPTED', 'DHL Global Forwarding', 'FRA', 'FRA-NBO', 'FRA-AMS-NBO', 5.0, 2.85, null, 2.95, 14250, R('jonas.becker'), 'Develop destination: DHL FRA-NBO perishables return loads'],
    ['66d0b2f1a2c3d4e5f6a7b007', '3.4', 'VP-LEV-DIRECT', 'VOLUME', 'PENDING', 'Davies Turner', 'LHR', 'LHR-MIA', 'LHR-AMS-MIA', 4.0, 2.55, null, 2.65, 10200, R('emma.clarke'), 'Target point to point: Davies Turner LHR-MIA'],
    ['66d0b2f1a2c3d4e5f6a7b008', '8.1', 'PHARMA-PERF', 'MIX', 'ACCEPTED', 'Bollore Logistics', 'CDG', 'CDG-YYZ', 'CDG-AMS-YYZ', 3.5, 3.20, 2.30, 2.50, 11200, R('emma.clarke'), 'Pharma performance: Bolloré CDG-YYZ'],
    ['66d0b2f1a2c3d4e5f6a7b009', '1.5', 'RED-YP-COMP', 'RATE', 'ACCEPTED', 'Expeditors', 'HKG', 'HKG-AMS', 'HKG-AMS', 18.0, 4.05, 3.90, 3.75, 2700, R('wingsze.chan'), 'Close yield gap vs competitor: Expeditors HKG-AMS'],
    ['66d0b2f1a2c3d4e5f6a7b010', '3.5', 'GREEN-VP-LEV-EOD', 'VOLUME', 'SNOOZED', 'Expeditors', 'HKG', 'HKG-JFK', 'HKG-AMS-JFK', 7.0, 3.95, null, 3.85, 27650, R('wingsze.chan'), 'Develop incremental business: Expeditors HKG-JFK via AMS'],
    ['66d0b2f1a2c3d4e5f6a7b011', '1.3', 'RED-YP-CONTRACT', 'RATE', 'PENDING', 'Yusen Logistics', 'NRT', 'NRT-AMS', 'NRT-AMS', 9.0, 3.85, 3.70, 3.60, 1350, R('wingsze.chan'), 'Contract renegotiation: Yusen NRT-AMS'],
    ['66d0b2f1a2c3d4e5f6a7b012', '8.7', 'VUNTECH', 'MIX', 'PENDING', 'Yusen Logistics', 'NRT', 'NRT-AMS', 'NRT-AMS', 2.0, 4.40, 3.70, 3.60, 8800, R('wingsze.chan'), 'Vulnerable and high-tech: Yusen NRT-AMS semiconductor equipment'],
    ['66d0b2f1a2c3d4e5f6a7b013', '3.1', 'GREEN-VP-NECS', 'VOLUME', 'ACCEPTED', 'CEVA Logistics', 'JFK', 'JFK-AMS', 'JFK-AMS', 11.0, 2.10, null, 2.15, 23100, R('michael.rossi'), 'Develop new business: CEVA JFK-AMS'],
    ['66d0b2f1a2c3d4e5f6a7b014', '3.53', 'GREEN-VP-NEW-OD', 'VOLUME', 'PENDING', 'Craft Multimodal', 'GRU', 'GRU-AMS', 'GRU-AMS', 6.0, 3.30, null, 3.30, 19800, R('michael.rossi'), 'New O&D: Craft Multimodal GRU-AMS'],
    ['66d0b2f1a2c3d4e5f6a7b015', '8.4', 'PER', 'MIX', 'DISMISSED', 'Craft Multimodal', 'GRU', 'GRU-AMS', 'GRU-AMS', 4.0, 3.10, 3.25, 3.30, 12400, R('michael.rossi'), 'Perishables: Craft Multimodal GRU-AMS mango season'],
    ['66d0b2f1a2c3d4e5f6a7b016', '3.2', 'GREEN-VP-LEV-EOD-ERD', 'VOLUME', 'ACCEPTED', 'Freightworks', 'DXB', 'DXB-AMS', 'DXB-AMS', 5.0, 2.75, 2.60, 2.85, 13750, R('layla.nasser'), 'Leverage red-destination access: Freightworks DXB-AMS'],
    ['66d0b2f1a2c3d4e5f6a7b017', '7.2', 'RED-SC-ADD-TRUCK-DPS', 'VOLUME', 'CLOSED', 'Freightworks', 'DXB', 'DXB-AMS', 'DXB-AMS', 3.0, 2.65, 2.60, 2.85, 7950, R('layla.nasser'), 'Add trucking: Freightworks direct pickup service Jebel Ali'],
    ['66d0b2f1a2c3d4e5f6a7b018', '1.6', 'RED-YP-SWAP', 'RATE', 'PENDING', 'Kuehne + Nagel', 'AMS', 'NBO-AMS', 'NBO-AMS', 8.0, 2.95, 2.95, 2.80, 1200, R('sanne.visser'), 'Yield swap: replace low-yield NBO-AMS flowers with K+N pharma'],
  ],
  opportunities: [
    { name: 'Kuehne+Nagel AMS-JFK BSA 2027', forwarder: 'Kuehne+Nagel', stage: 'PROPOSAL', amountUsd: 1950000, closeDate: '2026-11-15', contactEmail: 'daan.mulder@kuehne-nagel.com' },
    { name: 'DHL FRA-NBO perishables round trip', forwarder: 'DHL Global Forwarding', stage: 'MEETING', amountUsd: 720000, closeDate: '2026-12-01', contactEmail: 'katrin.vogel@dhl.com' },
    { name: 'Expeditors HKG-AMS peak allocation', forwarder: 'Expeditors', stage: 'CUSTOMER', amountUsd: 2400000, closeDate: '2026-08-31', contactEmail: 'jason.ng@expeditors.com' },
    { name: 'Yusen NRT-AMS semiconductor lane', forwarder: 'Yusen Logistics', stage: 'SCREENING', amountUsd: 540000, closeDate: '2026-10-31', contactEmail: 'haruto.takahashi@yusen-logistics.com' },
  ],
  notes: [
    { title: 'K+N Schiphol quarterly review', forwarder: 'Kuehne+Nagel', markdown: 'Daan wants a firm 30 t/week on AMS-JFK for the winter schedule and is willing to pay 2.55 USD/kg if we drop the fuel surcharge cap. Action: revenue management to model.' },
    { title: 'DHL Frankfurt: NBO flower back-haul', forwarder: 'DHL Global Forwarding', markdown: 'Katrin confirmed 5 t/week of pharma outbound FRA-NBO if we guarantee the cool chain at AMS transit. Return leg flowers already contracted with another carrier until March.' },
    { title: 'Expeditors peak planning HKG', forwarder: 'Expeditors', markdown: 'Peak forecast 70-85 t/week from week 42. HKG-AMS is red; agreed priority handling for Expeditors on the Tuesday and Saturday freighters.' },
  ],
  tasks: [
    { title: 'Model AMS-JFK winter allocation for K+N', markdown: 'Ask revenue management for the impact of a 30 t/week BSA at 2.55 USD/kg.', status: 'IN_PROGRESS', dueAt: '2026-09-18T09:00:00.000Z', forwarder: 'Kuehne+Nagel', assigneeEmail: R('sanne.visser') },
    { title: 'Cool-chain audit at AMS for DHL pharma', markdown: 'Schedule the GDP walk-through with the ground handler before the FRA-NBO launch.', status: 'TODO', dueAt: '2026-09-26T08:00:00.000Z', forwarder: 'DHL Global Forwarding', assigneeEmail: R('jonas.becker') },
    { title: 'Confirm Expeditors freighter priority', markdown: 'Written confirmation to Jason on Tuesday/Saturday priority handling.', status: 'DONE', dueAt: '2026-09-04T10:00:00.000Z', forwarder: 'Expeditors', assigneeEmail: R('wingsze.chan') },
  ],
};
