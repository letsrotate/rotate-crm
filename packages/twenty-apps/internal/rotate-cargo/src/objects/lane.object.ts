import { defineObject, FieldType } from 'twenty-sdk/define';

import {
  LANE_DESTINATION_IATA_FIELD_ID,
  LANE_LEG_COLOUR_FIELD_ID,
  LANE_NAME_FIELD_ID,
  LANE_ORIGIN_IATA_FIELD_ID,
  LANE_UNIVERSAL_IDENTIFIER,
  LANE_WEEKLY_TONNES_AIRLINE_FIELD_ID,
  LANE_WEEKLY_TONNES_MARKET_FIELD_ID,
  LANE_YIELD_AIRLINE_FIELD_ID,
  LANE_YIELD_MARKET_FIELD_ID,
} from 'src/constants/universal-identifiers';

// Sales Cockpit leg colouring from load factor: green = wants volume,
// amber = filling up, red = constrained.
export const LANE_LEG_COLOUR_OPTIONS = [
  { id: '61699167-a60a-4db6-9d18-4f1bb620898f', value: 'GREEN', label: 'Green', position: 0, color: 'green' },
  { id: '58b17cc5-59b0-4637-8660-919076ca3e1d', value: 'AMBER', label: 'Amber', position: 1, color: 'orange' },
  { id: 'c2b7135c-c93d-4198-9a1b-6dc08e8bafda', value: 'RED', label: 'Red', position: 2, color: 'red' },
] as const;

export default defineObject({
  universalIdentifier: LANE_UNIVERSAL_IDENTIFIER,
  nameSingular: 'lane',
  namePlural: 'lanes',
  labelSingular: 'Lane',
  labelPlural: 'Lanes',
  description: 'An origin-destination pair (O&D) the airline sells capacity on',
  icon: 'IconRoute',
  labelIdentifierFieldMetadataUniversalIdentifier: LANE_NAME_FIELD_ID,
  fields: [
    {
      universalIdentifier: LANE_NAME_FIELD_ID,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Lane',
      description: 'ORIGIN-DESTINATION in IATA codes, e.g. AMS-AUH',
      icon: 'IconRoute',
    },
    {
      universalIdentifier: LANE_ORIGIN_IATA_FIELD_ID,
      type: FieldType.TEXT,
      name: 'originIata',
      label: 'Origin IATA',
      icon: 'IconPlaneDeparture',
      isNullable: true,
    },
    {
      universalIdentifier: LANE_DESTINATION_IATA_FIELD_ID,
      type: FieldType.TEXT,
      name: 'destinationIata',
      label: 'Destination IATA',
      icon: 'IconPlaneArrival',
      isNullable: true,
    },
    {
      universalIdentifier: LANE_LEG_COLOUR_FIELD_ID,
      type: FieldType.SELECT,
      name: 'legColour',
      label: 'Leg colour',
      description: 'Capacity health of the lane from load factor',
      icon: 'IconTrafficLights',
      isNullable: true,
      options: [...LANE_LEG_COLOUR_OPTIONS],
    },
    {
      universalIdentifier: LANE_WEEKLY_TONNES_AIRLINE_FIELD_ID,
      type: FieldType.NUMBER,
      name: 'weeklyTonnesAirline',
      label: 'Airline tonnes / week',
      description: 'Chargeable tonnes the airline carries per week',
      icon: 'IconScale',
      isNullable: true,
    },
    {
      universalIdentifier: LANE_WEEKLY_TONNES_MARKET_FIELD_ID,
      type: FieldType.NUMBER,
      name: 'weeklyTonnesMarket',
      label: 'Market tonnes / week',
      description: 'Total chargeable tonnes in the market (CASS/WACD) per week',
      icon: 'IconScale',
      isNullable: true,
    },
    {
      universalIdentifier: LANE_YIELD_AIRLINE_FIELD_ID,
      type: FieldType.NUMBER,
      name: 'yieldAirline',
      label: 'Airline yield (USD/kg)',
      icon: 'IconCurrencyDollar',
      isNullable: true,
    },
    {
      universalIdentifier: LANE_YIELD_MARKET_FIELD_ID,
      type: FieldType.NUMBER,
      name: 'yieldMarket',
      label: 'Market yield (USD/kg)',
      icon: 'IconCurrencyDollar',
      isNullable: true,
    },
  ],
});
