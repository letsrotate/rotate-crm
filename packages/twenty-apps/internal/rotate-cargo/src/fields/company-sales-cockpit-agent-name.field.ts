import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_SALES_COCKPIT_AGENT_NAME_FIELD_ID } from 'src/constants/universal-identifiers';

// The Sales Cockpit has no stable forwarder id: WACD agent_name is its key.
// The sync matches initiatives to companies on this field first, then on the
// company name.
export default defineField({
  universalIdentifier: COMPANY_SALES_COCKPIT_AGENT_NAME_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'salesCockpitAgentName',
  label: 'Sales Cockpit agent name',
  description: 'Exact agent name used by the Sales Cockpit for this forwarder',
  icon: 'IconTargetArrow',
  isNullable: true,
});
