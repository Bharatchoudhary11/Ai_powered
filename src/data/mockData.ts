export interface AnalyticsRecord {
  date: string; // ISO date
  revenue: number;
  users: number;
  conversions: number;
}

export const records: AnalyticsRecord[] = Array.from({ length: 30 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const users = Math.floor(200 + Math.random() * 300);
  const conversions = Math.floor(users * (0.05 + Math.random() * 0.1));
  const revenue = conversions * (20 + Math.random() * 80);
  return {
    date: date.toISOString().slice(0, 10),
    revenue: Math.round(revenue),
    users,
    conversions,
  };
});
