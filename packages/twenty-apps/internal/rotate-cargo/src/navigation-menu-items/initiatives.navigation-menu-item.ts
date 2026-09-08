import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { SALES_INITIATIVE_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: 'ed31cb14-13cd-4cdb-bef8-8905ae0b4b90',
  position: 1,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
});
