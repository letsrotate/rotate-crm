import { defineObject, FieldType } from 'twenty-sdk/define';

import {
  STATION_COUNTRY_FIELD_ID,
  STATION_IATA_CODE_FIELD_ID,
  STATION_IS_HUB_FIELD_ID,
  STATION_NAME_FIELD_ID,
  STATION_REGION_FIELD_ID,
  STATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

// Mirrors bronze.reference.airport region_rotate_long in the Sales Cockpit.
export const STATION_REGION_OPTIONS = [
  { id: 'c3741e83-4989-4303-81d4-8c3a158896d7', value: 'EUROPE', label: 'Europe', position: 0, color: 'blue' },
  { id: '7de81882-ea07-4782-a27f-ded07f7ef0f2', value: 'MIDDLE_EAST', label: 'Middle East', position: 1, color: 'orange' },
  { id: '23960f89-6609-4fac-a33b-bcff6ffd4cfb', value: 'AFRICA', label: 'Africa', position: 2, color: 'yellow' },
  { id: 'cd1d1d22-38c1-4efc-8196-09a6bd0e7363', value: 'ASIA_PACIFIC', label: 'Asia Pacific', position: 3, color: 'green' },
  { id: '45ad543f-6d43-41b0-b735-6ece5933eec5', value: 'NORTH_AMERICA', label: 'North America', position: 4, color: 'purple' },
  { id: '3a977a76-0ee7-4e6c-ad6d-a159845ad4db', value: 'LATIN_AMERICA', label: 'Latin America', position: 5, color: 'pink' },
] as const;

export default defineObject({
  universalIdentifier: STATION_UNIVERSAL_IDENTIFIER,
  nameSingular: 'station',
  namePlural: 'stations',
  labelSingular: 'Station',
  labelPlural: 'Stations',
  description: 'An airport the airline sells from or to, keyed by IATA code',
  icon: 'IconPlane',
  labelIdentifierFieldMetadataUniversalIdentifier: STATION_IATA_CODE_FIELD_ID,
  fields: [
    {
      universalIdentifier: STATION_IATA_CODE_FIELD_ID,
      type: FieldType.TEXT,
      name: 'iataCode',
      label: 'IATA code',
      description: 'Three-letter IATA airport code, e.g. AMS',
      icon: 'IconHash',
    },
    {
      universalIdentifier: STATION_NAME_FIELD_ID,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      description: 'Airport or city name',
      icon: 'IconAbc',
      isNullable: true,
    },
    {
      universalIdentifier: STATION_COUNTRY_FIELD_ID,
      type: FieldType.TEXT,
      name: 'country',
      label: 'Country',
      icon: 'IconWorld',
      isNullable: true,
    },
    {
      universalIdentifier: STATION_REGION_FIELD_ID,
      type: FieldType.SELECT,
      name: 'region',
      label: 'Region',
      icon: 'IconMapPin',
      isNullable: true,
      options: [...STATION_REGION_OPTIONS],
    },
    {
      universalIdentifier: STATION_IS_HUB_FIELD_ID,
      type: FieldType.BOOLEAN,
      name: 'isHub',
      label: 'Hub',
      description: 'Whether this station is one of the airline\'s hubs',
      icon: 'IconBuildingSkyscraper',
      defaultValue: false,
    },
  ],
});
