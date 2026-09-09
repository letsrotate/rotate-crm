import { defineObject, FieldType } from 'twenty-sdk/define';

import {
  REGION_CODE_FIELD_ID,
  REGION_DESCRIPTION_FIELD_ID,
  REGION_NAME_FIELD_ID,
  REGION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

// Top of the sales hierarchy: a region groups stations and is owned by a
// regional manager; station account managers report into it.
export default defineObject({
  universalIdentifier: REGION_UNIVERSAL_IDENTIFIER,
  nameSingular: 'region',
  namePlural: 'regions',
  labelSingular: 'Region',
  labelPlural: 'Regions',
  description: 'A sales region: a group of stations under one regional manager',
  icon: 'IconWorld',
  labelIdentifierFieldMetadataUniversalIdentifier: REGION_NAME_FIELD_ID,
  fields: [
    {
      universalIdentifier: REGION_NAME_FIELD_ID,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      icon: 'IconWorld',
    },
    {
      universalIdentifier: REGION_CODE_FIELD_ID,
      type: FieldType.TEXT,
      name: 'code',
      label: 'Code',
      description: 'Short code used in reporting, e.g. EUR, MEA, APAC, AMER',
      icon: 'IconHash',
      isNullable: true,
    },
    {
      universalIdentifier: REGION_DESCRIPTION_FIELD_ID,
      type: FieldType.TEXT,
      name: 'description',
      label: 'Description',
      icon: 'IconAlignLeft',
      isNullable: true,
    },
  ],
});
