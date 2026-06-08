import { type Href, router, usePathname } from 'expo-router';
import { useCallback } from 'react';

function normalizePath(path: string): string {
  if (!path || path === '/') {
    return '/';
  }

  return path.replace(/\/+$/, '');
}

function stripRouteGroups(path: string): string {
  return normalizePath(path.replace(/\/\([^/]+\)/g, ''));
}

function hrefToPath(href: Href): string {
  if (typeof href === 'string') {
    return stripRouteGroups(href);
  }

  let path = stripRouteGroups(href.pathname ?? '/');

  if (href.params) {
    for (const [key, value] of Object.entries(href.params)) {
      if (value == null) {
        continue;
      }

      path = path.replace(`[${key}]`, String(value));
    }
  }

  return path;
}

export function navigateToRoute(href: Href, currentPath?: string): void {
  const target = hrefToPath(href);

  if (currentPath && stripRouteGroups(currentPath) === target) {
    return;
  }

  router.navigate(href);
}

export function useAppNavigation() {
  const pathname = usePathname();

  const navigateTo = useCallback(
    (href: Href) => {
      navigateToRoute(href, pathname);
    },
    [pathname],
  );

  const replaceTo = useCallback((href: Href) => {
    router.replace(href);
  }, []);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, []);

  return { navigateTo, replaceTo, goBack };
}
