export interface LaravelDetection {
  isLaravel: boolean;
  isInertia: boolean;
  hasZiggy: boolean;
  hasCsrf: boolean;
  laravelVersion?: string;
  inertiaVersion?: string;
  frameworkEvidence: string[];
}

export interface AuthData {
  csrfToken?: string;
  xsrfToken?: string;
  sessionCookie?: string;
  bearerToken?: string;
  authUser?: Record<string, unknown> | null;
}

export interface InertiaData {
  component?: string;
  url?: string;
  version?: string;
  pageProps: Record<string, unknown>;
  sharedProps: Record<string, unknown>;
  rawPageData?: Record<string, unknown>;
  errors?: Record<string, unknown>;
  flash?: Record<string, unknown>;
}

export interface ZiggyRoute {
  name?: string;
  uri: string;
  methods: string[];
  parameters?: string[];
  domain?: string;
}

export interface ZiggyData {
  url?: string;
  port?: number | null;
  defaults?: Record<string, unknown>;
  routes: Record<string, ZiggyRoute>;
}

export interface PageInspectionResult {
  url: string;
  title: string;
  detection: LaravelDetection;
  auth: AuthData;
  inertia?: InertiaData | null;
  ziggy?: ZiggyData | null;
}

export type ActiveTabCategory = 'auth' | 'inertia' | 'ziggy' | 'headers';
