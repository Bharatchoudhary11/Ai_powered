export interface AnalyticsRecord {
  date: string; // ISO date
  revenue: number;
  users: number;
  conversions: number;
}

export const records: AnalyticsRecord[] = Array.from({ length: 30 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));

  // Generate deterministic values based only on the index so that the
  // initial data is identical during server and client rendering. This
  // avoids hydration mismatches caused by Math.random().
  const users = 200 + ((i * 17) % 300);
  const conversions = Math.floor(users * (0.05 + ((i % 10) / 100)));
  const revenue = conversions * (20 + ((i * 23) % 80));

  return {
    date: date.toISOString().slice(0, 10),
    revenue: Math.round(revenue),
    users,
    conversions,
  };
});
