import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_FORWARDER_SEGMENT_FIELD_ID } from 'src/constants/universal-identifiers';

// Sales Cockpit agent_segment: Summit = strategic global forwarders.
export default defineField({
  universalIdentifier: COMPANY_FORWARDER_SEGMENT_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'forwarderSegment',
  label: 'Forwarder segment',
  icon: 'IconChartPie',
  isNullable: true,
  options: [
    { id: '17f9e247-365e-43e6-91b9-5bd0fa4c02d2', value: 'SUMMIT', label: 'Summit', position: 0, color: 'purple' },
    { id: '1a620381-ca1e-46dc-9ede-ec1ade40dca4', value: 'NON_SUMMIT', label: 'Non-Summit', position: 1, color: 'gray' },
  ],
});
