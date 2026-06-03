import { useMemo } from 'react';
import type { ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FAB_HEIGHT, FAB_MARGIN, TAB_BAR_HEIGHT } from '@/constants/screen';

interface UseFabLayoutOptions {
  /** Tab screen: content sits above the tab bar; keeps FAB aligned with stack screens. */
  aboveTabBar?: boolean;
}

export function useFabLayout(options?: UseFabLayoutOptions) {
  const { bottom: insetBottom } = useSafeAreaInsets();

  return useMemo(() => {
    const fromPhysicalBottom = FAB_MARGIN + insetBottom;

    const fabBottom = options?.aboveTabBar
      ? TAB_BAR_HEIGHT + insetBottom - fromPhysicalBottom
      : fromPhysicalBottom;

    return {
      fabStyle: {
        position: 'absolute' as const,
        right: FAB_MARGIN,
        bottom: fabBottom,
      } satisfies ViewStyle,
      listPaddingBottom: fabBottom + FAB_HEIGHT + FAB_MARGIN,
    };
  }, [insetBottom, options?.aboveTabBar]);
}
