import { type DemoTenant } from 'src/logic-functions/constants/demo-data/demo-tenant.type';

// Etihad Airways demo tenant: hub AUH, four sales regions, the forwarders
// that matter on the Gulf carrier's network, and a month of Sales Cockpit
// initiatives. Staff emails match the dev seeder (rotate-staff.constant.ts).
const E = (local: string) => `${local}@etihad.dev`;

export const ETIHAD_DEMO_TENANT: DemoTenant = {
  key: 'etihad',
  airline: 'Etihad Airways',
  headOfSalesEmail: E('aisha.alhammadi'),
  accountManagerStations: {
    [E('omar.haddad')]: 'AUH',
    [E('lukas.weber')]: 'FRA',
    [E('priya.nair')]: 'LHR',
    [E('bram.devries')]: 'AMS',
    [E('kayan.cheung')]: 'HKG',
    [E('yiming.zhang')]: 'PVG',
    [E('maria.gonzalez')]: 'JFK',
    [E('rahul.verma')]: 'DEL',
    [E('ana.ribeiro')]: 'GRU',
  },
  regions: [
    {
      code: 'MEA',
      name: 'Middle East & Africa',
      description: 'Home market around the Abu Dhabi hub plus the African gateways',
      regionalManagerEmail: E('khalid.almazrouei'),
      stations: [
        { iata: 'AUH', name: 'Abu Dhabi Zayed International', country: 'United Arab Emirates', region: 'MIDDLE_EAST', isHub: true },
        { iata: 'RUH', name: 'Riyadh King Khalid', country: 'Saudi Arabia', region: 'MIDDLE_EAST' },
        { iata: 'CAI', name: 'Cairo', country: 'Egypt', region: 'AFRICA' },
        { iata: 'NBO', name: 'Nairobi Jomo Kenyatta', country: 'Kenya', region: 'AFRICA' },
        { iata: 'JNB', name: 'Johannesburg O.R. Tambo', country: 'South Africa', region: 'AFRICA' },
      ],
    },
    {
      code: 'EUR',
      name: 'Europe',
      description: 'Pharma and automotive exports from the European gateways',
      regionalManagerEmail: E('sophie.lambert'),
      stations: [
        { iata: 'LHR', name: 'London Heathrow', country: 'United Kingdom', region: 'EUROPE' },
        { iata: 'FRA', name: 'Frankfurt', country: 'Germany', region: 'EUROPE' },
        { iata: 'AMS', name: 'Amsterdam Schiphol', country: 'Netherlands', region: 'EUROPE' },
        { iata: 'CDG', name: 'Paris Charles de Gaulle', country: 'France', region: 'EUROPE' },
        { iata: 'MXP', name: 'Milan Malpensa', country: 'Italy', region: 'EUROPE' },
        { iata: 'IST', name: 'Istanbul', country: 'Türkiye', region: 'EUROPE' },
      ],
    },
    {
      code: 'APAC',
      name: 'Asia Pacific & Indian subcontinent',
      description: 'E-commerce and electronics flows from Greater China and India',
      regionalManagerEmail: E('wei.chen'),
      stations: [
        { iata: 'HKG', name: 'Hong Kong', country: 'Hong Kong SAR', region: 'ASIA_PACIFIC' },
        { iata: 'PVG', name: 'Shanghai Pudong', country: 'China', region: 'ASIA_PACIFIC' },
        { iata: 'DEL', name: 'Delhi Indira Gandhi', country: 'India', region: 'ASIA_PACIFIC' },
        { iata: 'BOM', name: 'Mumbai', country: 'India', region: 'ASIA_PACIFIC' },
        { iata: 'SIN', name: 'Singapore Changi', country: 'Singapore', region: 'ASIA_PACIFIC' },
        { iata: 'ICN', name: 'Seoul Incheon', country: 'South Korea', region: 'ASIA_PACIFIC' },
      ],
    },
    {
      code: 'AMER',
      name: 'Americas',
      description: 'North and South America, mostly via the JFK and ORD gateways',
      regionalManagerEmail: E('carlos.mendes'),
      stations: [
        { iata: 'JFK', name: 'New York JFK', country: 'United States', region: 'NORTH_AMERICA' },
        { iata: 'ORD', name: "Chicago O'Hare", country: 'United States', region: 'NORTH_AMERICA' },
        { iata: 'YYZ', name: 'Toronto Pearson', country: 'Canada', region: 'NORTH_AMERICA' },
        { iata: 'GRU', name: 'São Paulo Guarulhos', country: 'Brazil', region: 'LATIN_AMERICA' },
        { iata: 'MEX', name: 'Mexico City', country: 'Mexico', region: 'LATIN_AMERICA' },
      ],
    },
  ],
  forwarders: [
    { name: 'Kuehne+Nagel', domain: 'kuehne-nagel.com', agentName: 'Kuehne + Nagel', cassCode: '2312345', segment: 'SUMMIT', tier: 'VERY_LARGE', homeStation: 'FRA', accountOwnerEmail: E('lukas.weber'), city: 'Frankfurt',
      contacts: [
        { firstName: 'Markus', lastName: 'Hoffmann', jobTitle: 'Head of Air Logistics, Germany', email: 'markus.hoffmann@kuehne-nagel.com', city: 'Frankfurt', phone: { callingCode: '+49', countryCode: 'DE', number: '6912345678' } },
        { firstName: 'Fatima', lastName: 'Al Sayegh', jobTitle: 'Key Account Manager, Middle East', email: 'fatima.alsayegh@kuehne-nagel.com', city: 'Dubai', phone: { callingCode: '+971', countryCode: 'AE', number: '501234567' } },
      ] },
    { name: 'DHL Global Forwarding', domain: 'dhl.com', agentName: 'DHL Global Forwarding', cassCode: '2318876', segment: 'SUMMIT', tier: 'VERY_LARGE', homeStation: 'AUH', accountOwnerEmail: E('omar.haddad'), city: 'Abu Dhabi',
      contacts: [
        { firstName: 'Sanjay', lastName: 'Mehta', jobTitle: 'Airfreight Director, MEA', email: 'sanjay.mehta@dhl.com', city: 'Dubai', phone: { callingCode: '+971', countryCode: 'AE', number: '509876543' } },
      ] },
    { name: 'DB Schenker', domain: 'dbschenker.com', agentName: 'DB Schenker', cassCode: '2320981', segment: 'SUMMIT', tier: 'LARGE', homeStation: 'FRA', accountOwnerEmail: E('lukas.weber'), city: 'Essen',
      contacts: [
        { firstName: 'Claudia', lastName: 'Richter', jobTitle: 'Head of Air Freight Procurement', email: 'claudia.richter@dbschenker.com', city: 'Essen', phone: { callingCode: '+49', countryCode: 'DE', number: '2011234567' } },
      ] },
    { name: 'DSV', domain: 'dsv.com', agentName: 'DSV Air & Sea', cassCode: '2334412', segment: 'SUMMIT', tier: 'LARGE', homeStation: 'AMS', accountOwnerEmail: E('bram.devries'), city: 'Amsterdam',
      contacts: [
        { firstName: 'Anouk', lastName: 'Hendriks', jobTitle: 'Air Freight Manager Benelux', email: 'anouk.hendriks@dsv.com', city: 'Amsterdam', phone: { callingCode: '+31', countryCode: 'NL', number: '201234567' } },
      ] },
    { name: 'Expeditors', domain: 'expeditors.com', agentName: 'Expeditors', cassCode: '2341107', segment: 'SUMMIT', tier: 'LARGE', homeStation: 'HKG', accountOwnerEmail: E('kayan.cheung'), city: 'Hong Kong',
      contacts: [
        { firstName: 'Kevin', lastName: 'Lau', jobTitle: 'District Manager Air Export', email: 'kevin.lau@expeditors.com', city: 'Hong Kong', phone: { callingCode: '+852', countryCode: 'HK', number: '91234567' } },
      ] },
    { name: 'Geodis', domain: 'geodis.com', agentName: 'Geodis', cassCode: '2350233', segment: 'SUMMIT', tier: 'MEDIUM', homeStation: 'CDG', accountOwnerEmail: E('priya.nair'), city: 'Paris',
      contacts: [
        { firstName: 'Camille', lastName: 'Moreau', jobTitle: 'Airfreight Product Manager', email: 'camille.moreau@geodis.com', city: 'Paris', phone: { callingCode: '+33', countryCode: 'FR', number: '148123456' } },
      ] },
    { name: 'Nippon Express', domain: 'nipponexpress.com', agentName: 'Nippon Express', cassCode: '2366790', segment: 'NON_SUMMIT', tier: 'MEDIUM', homeStation: 'PVG', accountOwnerEmail: E('yiming.zhang'), city: 'Shanghai',
      contacts: [
        { firstName: 'Li', lastName: 'Na', jobTitle: 'Air Export Supervisor', email: 'li.na@nipponexpress.com', city: 'Shanghai', phone: { callingCode: '+86', countryCode: 'CN', number: '2112345678' } },
      ] },
    { name: 'Kintetsu World Express', domain: 'kwe.com', agentName: 'Kintetsu World Express', cassCode: '2372201', segment: 'NON_SUMMIT', tier: 'MEDIUM', homeStation: 'HKG', accountOwnerEmail: E('kayan.cheung'), city: 'Hong Kong',
      contacts: [
        { firstName: 'Michelle', lastName: 'Tsang', jobTitle: 'Air Freight Manager', email: 'michelle.tsang@kwe.com', city: 'Hong Kong' },
      ] },
    { name: 'Hellmann Worldwide Logistics', domain: 'hellmann.com', agentName: 'Hellmann Worldwide', cassCode: '2380456', segment: 'NON_SUMMIT', tier: 'MEDIUM', homeStation: 'LHR', accountOwnerEmail: E('priya.nair'), city: 'London',
      contacts: [
        { firstName: 'James', lastName: 'Whitfield', jobTitle: 'Airfreight Trade Lane Manager', email: 'james.whitfield@hellmann.com', city: 'London', phone: { callingCode: '+44', countryCode: 'GB', number: '2071234567' } },
      ] },
    { name: 'Allcargo Logistics', domain: 'allcargologistics.com', agentName: 'Allcargo', cassCode: '2391120', segment: 'NON_SUMMIT', tier: 'SMALL', homeStation: 'DEL', accountOwnerEmail: E('rahul.verma'), city: 'Mumbai',
      contacts: [
        { firstName: 'Neha', lastName: 'Kapoor', jobTitle: 'Manager Air Freight, North India', email: 'neha.kapoor@allcargologistics.com', city: 'Delhi', phone: { callingCode: '+91', countryCode: 'IN', number: '9812345678' } },
      ] },
    { name: 'CEVA Logistics', domain: 'cevalogistics.com', agentName: 'CEVA Logistics', cassCode: '2402287', segment: 'NON_SUMMIT', tier: 'MEDIUM', homeStation: 'JFK', accountOwnerEmail: E('maria.gonzalez'), city: 'New York',
      contacts: [
        { firstName: 'Robert', lastName: 'Kim', jobTitle: 'VP Airfreight Americas', email: 'robert.kim@cevalogistics.com', city: 'New York', phone: { callingCode: '+1', countryCode: 'US', number: '2125551234' } },
      ] },
    { name: 'Craft Multimodal', domain: 'craftmultimodal.com.br', agentName: 'Craft Multimodal', cassCode: '2413390', segment: 'NON_SUMMIT', tier: 'SMALL', homeStation: 'GRU', accountOwnerEmail: E('ana.ribeiro'), city: 'São Paulo',
      contacts: [
        { firstName: 'Rafael', lastName: 'Souza', jobTitle: 'Gerente Aéreo', email: 'rafael.souza@craftmultimodal.com.br', city: 'São Paulo', phone: { callingCode: '+55', countryCode: 'BR', number: '11912345678' } },
      ] },
  ],
  lanes: [
    { name: 'FRA-AUH', legColour: 'GREEN', weeklyTonnesAirline: 62, weeklyTonnesMarket: 410, yieldAirline: 2.61, yieldMarket: 2.88 },
    { name: 'FRA-HKG', legColour: 'RED', weeklyTonnesAirline: 38, weeklyTonnesMarket: 1240, yieldAirline: 3.12, yieldMarket: 3.05 },
    { name: 'AMS-AUH', legColour: 'GREEN', weeklyTonnesAirline: 21, weeklyTonnesMarket: 190, yieldAirline: 2.45, yieldMarket: 2.70 },
    { name: 'AMS-DEL', legColour: 'AMBER', weeklyTonnesAirline: 14, weeklyTonnesMarket: 320, yieldAirline: 2.20, yieldMarket: 2.35 },
    { name: 'LHR-AUH', legColour: 'GREEN', weeklyTonnesAirline: 55, weeklyTonnesMarket: 380, yieldAirline: 2.40, yieldMarket: 2.55 },
    { name: 'LHR-SIN', legColour: 'RED', weeklyTonnesAirline: 18, weeklyTonnesMarket: 690, yieldAirline: 3.35, yieldMarket: 3.20 },
    { name: 'CDG-AUH', legColour: 'AMBER', weeklyTonnesAirline: 26, weeklyTonnesMarket: 240, yieldAirline: 2.58, yieldMarket: 2.75 },
    { name: 'MXP-JFK', legColour: 'AMBER', weeklyTonnesAirline: 9, weeklyTonnesMarket: 1450, yieldAirline: 2.95, yieldMarket: 2.80 },
    { name: 'HKG-AUH', legColour: 'RED', weeklyTonnesAirline: 74, weeklyTonnesMarket: 520, yieldAirline: 3.60, yieldMarket: 3.40 },
    { name: 'HKG-FRA', legColour: 'RED', weeklyTonnesAirline: 41, weeklyTonnesMarket: 2100, yieldAirline: 3.85, yieldMarket: 3.70 },
    { name: 'PVG-AMS', legColour: 'RED', weeklyTonnesAirline: 33, weeklyTonnesMarket: 1900, yieldAirline: 3.95, yieldMarket: 3.80 },
    { name: 'DEL-JFK', legColour: 'AMBER', weeklyTonnesAirline: 22, weeklyTonnesMarket: 860, yieldAirline: 3.10, yieldMarket: 3.25 },
    { name: 'BOM-LHR', legColour: 'GREEN', weeklyTonnesAirline: 17, weeklyTonnesMarket: 540, yieldAirline: 2.75, yieldMarket: 2.90 },
    { name: 'JFK-AUH', legColour: 'GREEN', weeklyTonnesAirline: 29, weeklyTonnesMarket: 260, yieldAirline: 2.30, yieldMarket: 2.42 },
    { name: 'ORD-DEL', legColour: 'GREEN', weeklyTonnesAirline: 12, weeklyTonnesMarket: 390, yieldAirline: 2.85, yieldMarket: 3.05 },
    { name: 'GRU-AUH', legColour: 'GREEN', weeklyTonnesAirline: 8, weeklyTonnesMarket: 95, yieldAirline: 3.40, yieldMarket: 3.55 },
    { name: 'AUH-JNB', legColour: 'AMBER', weeklyTonnesAirline: 19, weeklyTonnesMarket: 170, yieldAirline: 2.05, yieldMarket: 2.15 },
  ],
  initiatives: [
    ['66d0a1e0f1c2b3a4d5e6f001', '1.1', 'RED-YP', 'RATE', 'ACCEPTED', 'Kuehne + Nagel', 'FRA', 'FRA-AUH', 'FRA-AUH', 12.0, 2.95, 2.61, 2.88, 4080, E('lukas.weber'), 'Close yield gap: Kuehne + Nagel FRA-AUH'],
    ['66d0a1e0f1c2b3a4d5e6f002', '3.1', 'GREEN-VP-NECS', 'VOLUME', 'ACCEPTED', 'DB Schenker', 'FRA', 'FRA-AUH', 'FRA-AUH', 9.5, 2.80, null, 2.88, 26600, E('lukas.weber'), 'Develop new business: DB Schenker FRA-AUH'],
    ['66d0a1e0f1c2b3a4d5e6f003', '3.3', 'GREEN-VP-LEV-NEOD', 'VOLUME', 'PENDING', 'Kuehne + Nagel', 'FRA', 'FRA-JNB', 'FRA-AUH-JNB', 6.0, 2.35, null, 2.50, 14100, E('lukas.weber'), 'Leverage access: Kuehne + Nagel FRA-JNB via AUH'],
    ['66d0a1e0f1c2b3a4d5e6f004', '1.2', 'RED-YP-MS', 'RATE', 'COMPLETED', 'DSV Air & Sea', 'AMS', 'AMS-AUH', 'AMS-AUH', 8.0, 2.70, 2.45, 2.70, 2000, E('bram.devries'), 'Close yield gap: DSV AMS-AUH'],
    ['66d0a1e0f1c2b3a4d5e6f005', '8.1', 'PHARMA-PERF', 'MIX', 'ACCEPTED', 'DSV Air & Sea', 'AMS', 'AMS-DEL', 'AMS-AUH-DEL', 4.5, 3.10, 2.20, 2.35, 13950, E('bram.devries'), 'Pharma performance: DSV AMS-DEL'],
    ['66d0a1e0f1c2b3a4d5e6f006', '3.7', 'GREEN-VP-NECS-DRIVE', 'VOLUME', 'PENDING', 'Hellmann Worldwide', 'LHR', 'LHR-AUH', 'LHR-AUH', 7.0, 2.50, null, 2.55, 17500, E('priya.nair'), 'Develop destination: Hellmann LHR-AUH'],
    ['66d0a1e0f1c2b3a4d5e6f007', '2.1', 'RED-RED-SWAP', 'MIX', 'SNOOZED', 'Hellmann Worldwide', 'LHR', 'LHR-SIN', 'LHR-AUH-SIN', 5.0, 3.30, 3.35, 3.20, 3250, E('priya.nair'), 'Improve destination mix: Hellmann LHR-SIN to LHR-AUH'],
    ['66d0a1e0f1c2b3a4d5e6f008', '1.3', 'RED-YP-CONTRACT', 'RATE', 'ACCEPTED', 'Geodis', 'CDG', 'CDG-AUH', 'CDG-AUH', 10.0, 2.85, 2.58, 2.75, 2700, E('priya.nair'), 'Contract renegotiation: Geodis CDG-AUH'],
    ['66d0a1e0f1c2b3a4d5e6f009', '3.4', 'VP-LEV-DIRECT', 'VOLUME', 'PENDING', 'Geodis', 'MXP', 'MXP-JFK', 'MXP-AUH-JFK', 4.0, 2.90, null, 2.80, 11600, E('priya.nair'), 'Target point to point: Geodis MXP-JFK'],
    ['66d0a1e0f1c2b3a4d5e6f010', '1.5', 'RED-YP-COMP', 'RATE', 'ACCEPTED', 'Expeditors', 'HKG', 'HKG-AUH', 'HKG-AUH', 15.0, 3.75, 3.60, 3.40, 2250, E('kayan.cheung'), 'Close yield gap vs competitor: Expeditors HKG-AUH'],
    ['66d0a1e0f1c2b3a4d5e6f011', '3.5', 'GREEN-VP-LEV-EOD', 'VOLUME', 'ACCEPTED', 'Kintetsu World Express', 'HKG', 'HKG-FRA', 'HKG-AUH-FRA', 8.0, 3.80, 3.85, 3.70, 30400, E('kayan.cheung'), 'Develop incremental business: KWE HKG-FRA'],
    ['66d0a1e0f1c2b3a4d5e6f012', '3.53', 'GREEN-VP-NEW-OD', 'VOLUME', 'PENDING', 'Nippon Express', 'PVG', 'PVG-AMS', 'PVG-AUH-AMS', 6.0, 3.90, null, 3.80, 23400, E('yiming.zhang'), 'New O&D: Nippon Express PVG-AMS'],
    ['66d0a1e0f1c2b3a4d5e6f013', '8.3', 'DGR', 'MIX', 'DISMISSED', 'Nippon Express', 'PVG', 'PVG-AUH', 'PVG-AUH', 3.0, 4.20, 3.90, 3.95, 750, E('yiming.zhang'), 'Dangerous goods: Nippon Express PVG-AUH lithium batteries'],
    ['66d0a1e0f1c2b3a4d5e6f014', '3.2', 'GREEN-VP-LEV-EOD-ERD', 'VOLUME', 'ACCEPTED', 'Allcargo', 'DEL', 'DEL-JFK', 'DEL-AUH-JFK', 5.0, 3.20, 3.10, 3.25, 16000, E('rahul.verma'), 'Leverage red-destination access: Allcargo DEL-JFK'],
    ['66d0a1e0f1c2b3a4d5e6f015', '3.1', 'GREEN-VP-NECS', 'VOLUME', 'PENDING', 'Kuehne + Nagel', 'BOM', 'BOM-LHR', 'BOM-AUH-LHR', 7.5, 2.85, null, 2.90, 21375, E('rahul.verma'), 'Develop new business: Kuehne + Nagel BOM-LHR'],
    ['66d0a1e0f1c2b3a4d5e6f016', '3.1', 'GREEN-VP-NECS', 'VOLUME', 'ACCEPTED', 'CEVA Logistics', 'JFK', 'JFK-AUH', 'JFK-AUH', 9.0, 2.40, null, 2.42, 21600, E('maria.gonzalez'), 'Develop new business: CEVA JFK-AUH'],
    ['66d0a1e0f1c2b3a4d5e6f017', '4.2', 'GREEN-VP-NF', 'VOLUME', 'PENDING', 'DHL Global Forwarding', 'ORD', 'ORD-DEL', 'ORD-AUH-DEL', 6.0, 3.00, null, 3.05, 18000, E('maria.gonzalez'), 'Develop new flight: DHL ORD-DEL on the new ORD frequency'],
    ['66d0a1e0f1c2b3a4d5e6f018', '3.11', 'GREEN-VP-SMALLS', 'VOLUME', 'PENDING', 'Craft Multimodal', 'GRU', 'GRU-AUH', 'GRU-AUH', 2.5, 3.50, null, 3.55, 8750, E('ana.ribeiro'), 'Small shipments: Craft Multimodal GRU-AUH'],
    ['66d0a1e0f1c2b3a4d5e6f019', '7.1', 'RED-SC-ADD-TRUCK-DDS', 'VOLUME', 'CLOSED', 'DHL Global Forwarding', 'AUH', 'AUH-JNB', 'AUH-JNB', 4.0, 2.10, 2.05, 2.15, 8400, E('omar.haddad'), 'Add trucking: DHL AUH-JNB direct delivery service'],
    ['66d0a1e0f1c2b3a4d5e6f020', '1.1', 'RED-YP', 'RATE', 'ACCEPTED', 'DHL Global Forwarding', 'AUH', 'AUH-FRA', 'AUH-FRA', 11.0, 2.75, 2.48, 2.70, 2970, E('omar.haddad'), 'Close yield gap: DHL AUH-FRA'],
  ],
  opportunities: [
    { name: 'Kuehne+Nagel FRA-AUH BSA 2027', forwarder: 'Kuehne+Nagel', stage: 'PROPOSAL', amountUsd: 2450000, closeDate: '2026-11-30', contactEmail: 'markus.hoffmann@kuehne-nagel.com' },
    { name: 'DHL Global Forwarding Gulf pharma contract', forwarder: 'DHL Global Forwarding', stage: 'MEETING', amountUsd: 1800000, closeDate: '2026-12-15', contactEmail: 'sanjay.mehta@dhl.com' },
    { name: 'DSV AMS-DEL pharma lane agreement', forwarder: 'DSV', stage: 'SCREENING', amountUsd: 620000, closeDate: '2026-10-31', contactEmail: 'anouk.hendriks@dsv.com' },
    { name: 'Expeditors HKG-AUH e-commerce block space', forwarder: 'Expeditors', stage: 'CUSTOMER', amountUsd: 3100000, closeDate: '2026-08-31', contactEmail: 'kevin.lau@expeditors.com' },
    { name: 'CEVA JFK-AUH new business Q4', forwarder: 'CEVA Logistics', stage: 'NEW', amountUsd: 480000, closeDate: '2026-12-20', contactEmail: 'robert.kim@cevalogistics.com' },
  ],
  notes: [
    { title: 'Q3 business review with Kuehne+Nagel Frankfurt', forwarder: 'Kuehne+Nagel', markdown: '**Attendees:** Markus Hoffmann, Lukas Weber.\n\nK+N is moving pharma volumes from LH to us on FRA-AUH if we hold 2.95 USD/kg through winter. They want a guaranteed 40 t/week allocation on the Sunday 77F. Open point: temperature-controlled trucking at AUH for onward RUH.' },
    { title: 'DHL rate discussion AUH-FRA', forwarder: 'DHL Global Forwarding', markdown: 'Sanjay pushed back on the +10% on general cargo. Agreed to split: +6% now, review in January. Perishables from JNB stay on the old tariff until March.' },
    { title: 'Expeditors e-commerce forecast HKG', forwarder: 'Expeditors', markdown: 'Peak forecast 90-110 t/week HKG-AUH from mid-October. Capacity on the HKG freighter is red; prioritise Expeditors over spot. Kevin will send SKU mix by Friday.' },
  ],
  tasks: [
    { title: 'Send FRA-AUH winter rate proposal to K+N', markdown: 'Include the 40 t/week allocation on Sunday 77F and the RUH trucking option.', status: 'IN_PROGRESS', dueAt: '2026-09-19T09:00:00.000Z', forwarder: 'Kuehne+Nagel', assigneeEmail: E('lukas.weber') },
    { title: 'Station visit DHL Abu Dhabi warehouse', markdown: 'Walk the pharma cold room with Sanjay; confirm GDP certification renewal date.', status: 'TODO', dueAt: '2026-09-24T07:00:00.000Z', forwarder: 'DHL Global Forwarding', assigneeEmail: E('omar.haddad') },
    { title: 'Confirm Expeditors peak allocation HKG-AUH', markdown: 'Reply to Kevin with confirmed weekly allocation once revenue management signs off.', status: 'TODO', dueAt: '2026-09-15T10:00:00.000Z', forwarder: 'Expeditors', assigneeEmail: E('kayan.cheung') },
    { title: 'Prepare CEVA JFK onboarding pack', markdown: 'Booking portal access, AUH transit times, Gulf pharma capabilities deck.', status: 'DONE', dueAt: '2026-09-05T15:00:00.000Z', forwarder: 'CEVA Logistics', assigneeEmail: E('maria.gonzalez') },
  ],
};
