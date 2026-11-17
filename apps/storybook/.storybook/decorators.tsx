import { useEffect } from 'react';
import type { Decorator } from '@storybook/react-vite';

import type { ResolvedContrast, ResolvedTheme } from '@osac/ui-components/hooks/use-theme';
import { updateThemeClass } from '@osac/ui-components/hooks/use-theme';
import type { UserRole } from '@osac/ui-components/shellTypes';
import { MockProviders } from '@osac/ui-components/test-utils/MockProviders';

import type { OsacStoryParameters } from './types';

/**
 * Applies the product's own theme classes rather than Storybook's background
 * addon. `updateThemeClass` is the function the shell calls, so a story is
 * themed exactly the way a running page is -- including the Felt brand tokens
 * and the glass/high-contrast variants.
 */
export const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme ?? 'light') as ResolvedTheme;
  const contrast = (context.globals.contrast ?? 'glass') as ResolvedContrast;

  useEffect(() => {
    updateThemeClass(document.documentElement, theme, contrast);
  }, [theme, contrast]);

  return <Story />;
};

/**
 * Wraps every story in the application's provider tree, backed by the
 * in-memory Connect transport. No cluster, no proxy, no network.
 */
export const withProviders: Decorator = (Story, context) => {
  const osac = (context.parameters.osac ?? {}) as OsacStoryParameters;
  const layout = osac.canvas ?? 'component';
  const role = context.globals.role as UserRole | undefined;

  return (
    <MockProviders
      apiFixtures={osac.apiFixtures}
      transport={osac.transport}
      transportOverrides={osac.transportOverrides}
      routerEntries={osac.routerEntries}
      session={{
        role: role ?? osac.session?.role ?? 'tenant-admin',
        username: osac.session?.username,
        tenantId: osac.session?.tenantId,
      }}
    >
      <div className={`osac-sb-canvas--${layout}`}>
        <Story />
      </div>
    </MockProviders>
  );
};
