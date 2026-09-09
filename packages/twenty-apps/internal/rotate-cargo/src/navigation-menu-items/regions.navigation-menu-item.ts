import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { REGION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: 'f18f4f55-bff7-4962-b52b-1a6a89c8cbdb',
  position: 4,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: REGION_UNIVERSAL_IDENTIFIER,
});
