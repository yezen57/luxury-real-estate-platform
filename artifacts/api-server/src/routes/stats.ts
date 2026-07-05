import { Router } from "express";
import { db, apartmentsTable } from "@workspace/db";
import { eq, count, countDistinct, sql } from "drizzle-orm";

const router = Router();

router.get("/stats", async (req, res): Promise<void> => {
  try {
    const [totalRow, availableRow, unavailableRow, citiesRow, recent] =
      await Promise.all([
        db.select({ count: count() }).from(apartmentsTable),
        db
          .select({ count: count() })
          .from(apartmentsTable)
          .where(eq(apartmentsTable.status, "available")),
        db
          .select({ count: count() })
          .from(apartmentsTable)
          .where(eq(apartmentsTable.status, "unavailable")),
        db.select({ count: countDistinct(apartmentsTable.city) }).from(apartmentsTable),
        db
          .select()
          .from(apartmentsTable)
          .orderBy(sql`${apartmentsTable.createdAt} DESC`)
          .limit(6),
      ]);

    res.json({
      total: Number(totalRow[0]?.count ?? 0),
      available: Number(availableRow[0]?.count ?? 0),
      unavailable: Number(unavailableRow[0]?.count ?? 0),
      cities: Number(citiesRow[0]?.count ?? 0),
      recentApartments: recent.map((a) => ({
        ...a,
        area: Number(a.area),
        priceDay: Number(a.priceDay),
        priceWeek: Number(a.priceWeek),
        priceMonth: Number(a.priceMonth),
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats/cities", async (req, res): Promise<void> => {
  try {
    const rows = await db
      .select({
        city: apartmentsTable.city,
        count: count(),
      })
      .from(apartmentsTable)
      .groupBy(apartmentsTable.city)
      .orderBy(sql`count(*) DESC`);

    res.json(rows.map((r) => ({ city: r.city, count: Number(r.count) })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
