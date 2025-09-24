import posthog from 'posthog-js';

const POSTHOG_KEY = 'phc_rpYDJgn0VjTlYMozHiKqxgOq6xuZGzdShXnIv4TJ2GN';
const POSTHOG_HOST = 'https://us.i.posthog.com';

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false // We'll manually capture pageviews
    });
  }
};

export { posthog };