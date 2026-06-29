import api from "./api";

export interface AnalyticsData {
  totalInquiries: number;
  newInquiriesThisWeek: number;
  responseRate: number;
  popularServices: { name: string; count: number }[];
  inquiryTrends: { date: string; count: number }[];
  geographicData: { country: string; count: number }[];
  monthlyComparison: { month: string; inquiries: number; responses: number }[];
}

export const getAnalytics = async (): Promise<{ analytics: AnalyticsData }> => {
  const response = await api.get("/api/admin/analytics");
  return response.data as { analytics: AnalyticsData };
};
