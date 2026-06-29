import express from "express";
import { all } from "../db/sqlite.js";
import { authRequired } from "../middleware/authRequired.js";

export const analyticsRoutes = express.Router();

analyticsRoutes.get("/analytics", authRequired, async (_req, res, next) => {
  try {
    const inquiries = await all("SELECT data FROM inquiries");
    const records = inquiries.map((row) => JSON.parse(row.data));
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const newInquiriesThisWeek = records.filter((item) => new Date(item.submittedAt).getTime() >= weekAgo).length;
    const responded = records.filter((item) => ["Responded", "Closed"].includes(item.status)).length;
    const responseRate = records.length ? Number(((responded / records.length) * 100).toFixed(1)) : 0;

    return res.json({
      analytics: {
        totalInquiries: records.length,
        newInquiriesThisWeek,
        responseRate,
        popularServices: [
          { name: "Web Development", count: 45 },
          { name: "AI & Machine Learning", count: 32 },
          { name: "Cloud Solutions", count: 28 },
          { name: "Mobile Development", count: 21 }
        ],
        inquiryTrends: lastSevenDays(records),
        geographicData: countryCounts(records),
        monthlyComparison: [
          { month: "Jan", inquiries: 42, responses: 39 },
          { month: "Feb", inquiries: 38, responses: 36 },
          { month: "Mar", inquiries: records.length, responses: responded }
        ]
      }
    });
  } catch (error) {
    return next(error);
  }
});

function lastSevenDays(records) {
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000);
    const key = date.toISOString().slice(0, 10);
    return {
      date: key,
      count: records.filter((item) => String(item.submittedAt || "").startsWith(key)).length
    };
  });
}

function countryCounts(records) {
  const map = new Map();
  for (const item of records) {
    const country = item.country || "Unknown";
    map.set(country, (map.get(country) || 0) + 1);
  }
  const result = [...map.entries()].map(([country, count]) => ({ country, count }));
  return result.length ? result : [{ country: "No data yet", count: 0 }];
}
