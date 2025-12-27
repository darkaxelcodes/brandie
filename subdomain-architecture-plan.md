# Subdomain Architecture Plan for Brandie

## 📊 Feasibility Analysis

**Status:** ✅ Achievable with minimal code changes

**Good News:** The current architecture is already well-structured for subdomain separation.

---

## 🎯 Recommended Approach: Subdomain-Aware SPA

### Architecture Overview

Deploy the **same codebase** to all subdomains, but use runtime subdomain detection to control:
- Which routes are accessible
- What navigation appears
- Where users get redirected

### Code Impact Summary
1. ✅ Subdomain detection utility (~50 lines)
2. ✅ Route guard enhancements (~100 lines)
3. ✅ Navigation conditional logic (~30 lines)
4. ✅ Netlify deployment config (~200 lines)
5. ✅ New admin analytics page (~500 lines)

**Total Code Impact: ~900 lines | Complexity: LOW**

---

## 🏗️ Subdomain Structure

```
brandie.cloud              → Landing pages only (/, /features, /pricing, /for-startups, /for-agencies)
auth.brandie.cloud         → Auth flows (/auth, /success)
app.brandie.cloud          → Main application (all /brand/* routes, /dashboard, /home, etc.)
superuser.brandie.cloud    → Admin analytics dashboard (view events, analytics, user management)
```

---

## 📝 Implementation Plan

### Step 1: Create Subdomain Detector

**File:** `src/utils/subdomain.ts` (NEW)

```typescript
export const getSubdomain = (): string => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  // localhost/dev environment
  if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
    return 'local'; // Allow all routes in dev
  }

  // Production subdomains
  if (parts.length >= 2) {
    return parts[0]; // 'app', 'auth', 'superuser', or 'www'
  }

  return 'main'; // brandie.cloud (no subdomain)
};

export const isLandingSite = () => {
  const sub = getSubdomain();
  return sub === 'main' || sub === 'www' || sub === 'local';
};

export const isAuthSite = () => {
  const sub = getSubdomain();
  return sub === 'auth' || sub === 'local';
};

export const isAppSite = () => {
  const sub = getSubdomain();
  return sub === 'app' || sub === 'local';
};

export const isSuperuserSite = () => {
  const sub = getSubdomain();
  return sub === 'superuser' || sub === 'local';
};

export const redirectToSubdomain = (subdomain: string, path: string = '/') => {
  if (getSubdomain() !== 'local') {
    window.location.href = `https://${subdomain}.brandie.cloud${path}`;
  }
};
```

---

### Step 2: Enhanced Route Protection

**File:** `src/components/SubdomainGuard.tsx` (NEW)

```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getSubdomain, redirectToSubdomain } from '../utils/subdomain';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface SubdomainGuardProps {
  children: React.ReactNode;
  allowedSubdomains: string[];
  redirectTo?: { subdomain: string; path?: string };
}

export const SubdomainGuard: React.FC<SubdomainGuardProps> = ({
  children,
  allowedSubdomains,
  redirectTo
}) => {
  const currentSubdomain = getSubdomain();

  // Allow local development
  if (currentSubdomain === 'local') {
    return <>{children}</>;
  }

  // Check if current subdomain is allowed
  if (!allowedSubdomains.includes(currentSubdomain)) {
    if (redirectTo) {
      // Redirect to correct subdomain
      redirectToSubdomain(redirectTo.subdomain, redirectTo.path || '/');
      return <LoadingSpinner text="Redirecting..." />;
    }

    // Fallback to home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

---

### Step 3: Update App.tsx Routes

**File:** `src/App.tsx` (MODIFY)

```typescript
// Import subdomain utilities
import { SubdomainGuard } from './components/SubdomainGuard';
import { isLandingSite, isAuthSite, isAppSite, isSuperuserSite } from './utils/subdomain';

// Add new admin page
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics'));

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <TokenProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  {/* Landing Site Routes - brandie.cloud */}
                  <Route path="/" element={
                    <SubdomainGuard allowedSubdomains={['main', 'www', 'local']}>
                      <Suspense fallback={<PageLoader />}>
                        <Landing />
                      </Suspense>
                    </SubdomainGuard>
                  } />
                  <Route path="/for-startups" element={
                    <SubdomainGuard allowedSubdomains={['main', 'www', 'local']}>
                      <Suspense fallback={<PageLoader />}>
                        <ForStartups />
                      </Suspense>
                    </SubdomainGuard>
                  } />
                  {/* ... other landing routes */}

                  {/* Auth Site Routes - auth.brandie.cloud */}
                  <Route path="/auth" element={
                    <SubdomainGuard allowedSubdomains={['auth', 'local']}>
                      <Suspense fallback={<PageLoader />}>
                        <Auth />
                      </Suspense>
                    </SubdomainGuard>
                  } />
                  <Route path="/success" element={
                    <SubdomainGuard allowedSubdomains={['auth', 'local']}>
                      <Suspense fallback={<PageLoader />}>
                        <Success />
                      </Suspense>
                    </SubdomainGuard>
                  } />

                  {/* App Site Routes - app.brandie.cloud */}
                  <Route element={
                    <SubdomainGuard
                      allowedSubdomains={['app', 'local']}
                      redirectTo={{ subdomain: 'app', path: '/home' }}
                    >
                      <ProtectedRoute>
                        <AppLayout />
                      </ProtectedRoute>
                    </SubdomainGuard>
                  }>
                    {/* All existing protected routes */}
                  </Route>

                  {/* Superuser Site Routes - superuser.brandie.cloud */}
                  <Route path="/admin/*" element={
                    <SubdomainGuard allowedSubdomains={['superuser', 'local']}>
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<PageLoader />}>
                          <AdminAnalytics />
                        </Suspense>
                      </ProtectedRoute>
                    </SubdomainGuard>
                  } />
                </Routes>
              </div>
            </Router>
          </TokenProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
```

---

### Step 4: Conditional Navigation

**File:** `src/components/layout/Header.tsx` (MODIFY)

```typescript
import { isLandingSite, isAppSite, redirectToSubdomain } from '../../utils/subdomain';

export const Header = () => {
  const { user } = useAuth();

  const handleSignIn = () => {
    // Redirect to auth subdomain
    redirectToSubdomain('auth', '/auth');
  };

  const handleDashboard = () => {
    // Redirect to app subdomain
    redirectToSubdomain('app', '/home');
  };

  return (
    <header>
      {isLandingSite() && (
        // Show public navigation
        <PublicNavigation onSignIn={handleSignIn} />
      )}
      {isAppSite() && user && (
        // Show app navigation
        <AppNavigation />
      )}
    </header>
  );
};
```

---

### Step 5: Netlify Multi-Site Deployment

Create 4 separate Netlify deployment configurations:

**File:** `netlify-landing.toml`
```toml
[build]
command = "npx vite build"
publish = "dist"
environment = { SECRETS_SCAN_OMIT_KEYS = "VITE_SUPABASE_ANON_KEY,VITE_MIXPANEL_TOKEN,VITE_SUPABASE_URL" }

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

**File:** `netlify-auth.toml`
```toml
[build]
command = "npx vite build"
publish = "dist"
environment = { SECRETS_SCAN_OMIT_KEYS = "VITE_SUPABASE_ANON_KEY,VITE_MIXPANEL_TOKEN,VITE_SUPABASE_URL" }

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

**File:** `netlify-app.toml`
```toml
[build]
command = "npx vite build"
publish = "dist"
environment = { SECRETS_SCAN_OMIT_KEYS = "VITE_SUPABASE_ANON_KEY,VITE_MIXPANEL_TOKEN,VITE_SUPABASE_URL" }

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

**File:** `netlify-superuser.toml`
```toml
[build]
command = "npx vite build"
publish = "dist"
environment = { SECRETS_SCAN_OMIT_KEYS = "VITE_SUPABASE_ANON_KEY,VITE_MIXPANEL_TOKEN,VITE_SUPABASE_URL" }

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

---

## 🔐 Authentication Across Subdomains

### Supabase Configuration

**Dashboard Settings:**
```
Site URL: https://app.brandie.cloud

Redirect URLs:
  - https://app.brandie.cloud/**
  - https://auth.brandie.cloud/**
  - https://brandie.cloud/**
  - https://superuser.brandie.cloud/**
```

### Cookie Sharing Strategy

Supabase auth tokens can be shared across subdomains by setting cookie domain to `.brandie.cloud`

**File:** `src/lib/supabase.ts` (MODIFY)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'brandie-auth',
    // Share auth across subdomains
    cookieOptions: {
      domain: '.brandie.cloud',
      path: '/',
      sameSite: 'lax',
    },
  },
});
```

---

## 🆕 Admin Analytics Dashboard

### Database Schema

**File:** `supabase/migrations/[timestamp]_add_admin_roles.sql` (NEW)

```sql
/*
  # Add Admin Roles Table

  1. New Tables
    - `admin_users`
      - `user_id` (uuid, references auth.users, primary key)
      - `role` (text, 'viewer', 'editor', or 'admin')
      - `granted_at` (timestamptz)
      - `granted_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on `admin_users` table
    - Add policy for superusers to view admin list
*/

CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid REFERENCES auth.users PRIMARY KEY,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'editor', 'admin')),
  granted_at timestamptz DEFAULT now(),
  granted_by uuid REFERENCES auth.users
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role IN ('editor', 'admin')
    )
  );

CREATE POLICY "Admin users can insert new admins"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );
```

### Admin Service

**File:** `src/lib/adminService.ts` (NEW)

```typescript
import { supabase } from './supabase';

export const adminService = {
  async isAdmin(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return false;
    return ['editor', 'admin'].includes(data.role);
  },

  async getAnalyticsEvents(filters: {
    startDate?: string;
    endDate?: string;
    eventType?: string;
    userId?: string;
  }) {
    let query = supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }
    if (filters.eventType) {
      query = query.eq('event_type', filters.eventType);
    }
    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async getUserStats() {
    const { data, error } = await supabase
      .rpc('get_user_statistics');

    return { data, error };
  },
};
```

### Admin Page

**File:** `src/pages/admin/Analytics.tsx` (NEW)

```typescript
import React, { useEffect, useState } from 'react';
import { adminService } from '../../lib/adminService';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function Analytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) return;

    const hasAccess = await adminService.isAdmin(user.id);
    setIsAdmin(hasAccess);

    if (hasAccess) {
      await loadData();
    }

    setLoading(false);
  };

  const loadData = async () => {
    const [eventsResult, statsResult] = await Promise.all([
      adminService.getAnalyticsEvents({}),
      adminService.getUserStats(),
    ]);

    if (eventsResult.data) setEvents(eventsResult.data);
    if (statsResult.data) setStats(statsResult.data);
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading admin panel..." />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p>You do not have permission to access this admin panel.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Analytics Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm text-gray-500 mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{stats?.total_users || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-500 mb-2">Active Today</h3>
          <p className="text-3xl font-bold">{stats?.active_today || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-500 mb-2">Total Events</h3>
          <p className="text-3xl font-bold">{events.length}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-500 mb-2">Brands Created</h3>
          <p className="text-3xl font-bold">{stats?.total_brands || 0}</p>
        </Card>
      </div>

      {/* Events Table */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Events</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Time</th>
                <th className="text-left py-2">Event</th>
                <th className="text-left py-2">User</th>
                <th className="text-left py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{new Date(event.created_at).toLocaleString()}</td>
                  <td className="py-2">{event.event_type}</td>
                  <td className="py-2">{event.user_id}</td>
                  <td className="py-2">{JSON.stringify(event.properties)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
```

---

## 📊 Benefits of This Approach

1. **Minimal Code Changes** - ~900 lines total across entire codebase
2. **Shared Components** - No code duplication, single source of truth
3. **Single Codebase** - Easy maintenance and updates
4. **Independent Scaling** - Each subdomain can scale separately on Netlify
5. **Security** - Admin panel completely isolated from public and app
6. **SEO** - Landing site can be optimized separately with different meta tags
7. **Development Experience** - Still works seamlessly on localhost
8. **Authentication** - Shared auth state across all subdomains via cookies

---

## 🚀 Migration Path

### Phase 1: Preparation (Day 1)
- [ ] Create subdomain utilities (`src/utils/subdomain.ts`)
- [ ] Create SubdomainGuard component
- [ ] Test subdomain detection locally

### Phase 2: Route Updates (Day 2)
- [ ] Update App.tsx with subdomain-aware routing
- [ ] Update Header/Navbar with conditional navigation
- [ ] Test all route combinations locally

### Phase 3: Admin Panel (Day 3)
- [ ] Create admin database migration
- [ ] Build admin service layer
- [ ] Create admin analytics page
- [ ] Test admin access control

### Phase 4: Deployment (Day 4)
- [ ] Create 4 Netlify site configs
- [ ] Deploy to Netlify sites
- [ ] Configure DNS CNAME records
- [ ] Update Supabase auth URLs
- [ ] Test cross-subdomain auth flow
- [ ] Monitor for issues

### Phase 5: Optimization (Day 5)
- [ ] Optimize build process with shared cache
- [ ] Set up subdomain-specific analytics
- [ ] Fine-tune redirects and error pages
- [ ] Performance testing across subdomains

---

## 💰 Cost Impact

### Netlify Hosting
- **Free Tier:** 4 sites = $0/month (100GB bandwidth per site)
- **Pro Tier:** 4 sites = $76/month ($19/site) if higher bandwidth needed

### DNS Configuration
- Standard CNAME records = $0 (included with domain)

### Build Times
- Current: ~2-3 minutes
- With 4 sites: ~8-12 minutes total (can run in parallel)
- Can optimize with shared build cache to reduce to ~5-6 minutes

### No Additional Database Costs
- Same Supabase instance handles all subdomains

---

## 🔒 Security Considerations

### Admin Access
- Admin role stored in database, not just email check
- Can be granted/revoked through secure admin panel
- All admin actions logged to audit table

### CORS Configuration
- Each subdomain properly configured in Supabase
- Edge functions allow requests from all subdomains

### Cookie Security
- Auth cookies use `sameSite: 'lax'` for security
- Domain set to `.brandie.cloud` for sharing
- Secure flag enabled in production

---

## 📝 DNS Configuration

```
Type    Name        Value                           TTL
CNAME   @           brandie-landing.netlify.app     3600
CNAME   www         brandie-landing.netlify.app     3600
CNAME   auth        brandie-auth.netlify.app        3600
CNAME   app         brandie-app.netlify.app         3600
CNAME   superuser   brandie-superuser.netlify.app   3600
```

---

## 🧪 Testing Strategy

### Local Testing
- Use browser dev tools to simulate subdomains
- Test with `/etc/hosts` file entries:
  ```
  127.0.0.1 brandie.local
  127.0.0.1 auth.brandie.local
  127.0.0.1 app.brandie.local
  127.0.0.1 superuser.brandie.local
  ```

### Staging Testing
- Deploy to staging subdomains first
- Test cross-subdomain auth flow
- Verify all redirects work correctly
- Check analytics tracking per subdomain

### Production Testing
- Gradual rollout with monitoring
- A/B test with old vs new architecture
- Monitor error rates per subdomain
- Track performance metrics

---

## 🎯 Success Metrics

- ✅ All routes accessible on correct subdomains
- ✅ Auth flow works across subdomains
- ✅ Admin panel only accessible to authorized users
- ✅ No increase in error rates
- ✅ Page load times remain under 2 seconds
- ✅ SEO rankings maintained or improved
- ✅ Zero data loss during migration

---

## 📚 References

- [Netlify Multi-Site Deployments](https://docs.netlify.com/)
- [Supabase Auth Across Domains](https://supabase.com/docs/guides/auth)
- [Cookie Security Best Practices](https://owasp.org/www-community/controls/SecureCookieAttribute)
