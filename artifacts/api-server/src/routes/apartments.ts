// @ts-nocheck
import { Router } from "express";
import { db, apartmentsTable } from "../../../../lib/db/src";
import { eq, ilike, and, gte, lte, or, count, sql } from "drizzle-orm";

const router = Router();

router.get("/apartments", async (req, res): Promise<void> => {
  try {
    const {
      search,
      city,
      district,
      status,
      minPrice,
      maxPrice,
      sortBy,
      page = "1",
      limit = "12",
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 12));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(apartmentsTable.title, `%${search}%`),
          ilike(apartmentsTable.apartmentNumber, `%${search}%`),
          ilike(apartmentsTable.city, `%${search}%`),
          ilike(apartmentsTable.district, `%${search}%`)
        )
      );
    }

    if (city) {
      conditions.push(ilike(apartmentsTable.city, `%${city}%`));
    }

    if (district) {
      conditions.push(ilike(apartmentsTable.district, `%${district}%`));
    }

    if (status === "available" || status === "unavailable") {
      conditions.push(eq(apartmentsTable.status, status));
    }

    if (minPrice) {
      conditions.push(gte(apartmentsTable.priceMonth, minPrice));
    }

    if (maxPrice) {
      conditions.push(lte(apartmentsTable.priceMonth, maxPrice));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    let orderBy;
    switch (sortBy) {
      case "price_asc":
        orderBy = sql`${apartmentsTable.priceMonth} ASC`;
        break;
      case "price_desc":
        orderBy = sql`${apartmentsTable.priceMonth} DESC`;
        break;
      case "date_asc":
        orderBy = sql`${apartmentsTable.createdAt} ASC`;
        break;
      case "date_desc":
      default:
        orderBy = sql`${apartmentsTable.createdAt} DESC`;
        break;
    }

    const [totalResult, data] = await Promise.all([
      db.select({ count: count() }).from(apartmentsTable).where(where),
      db
        .select()
        .from(apartmentsTable)
        .where(where)
        .orderBy(orderBy)
        .limit(limitNum)
        .offset(offset),
    ]);

    const total = Number(totalResult[0]?.count ?? 0);

    const formatted = data.map((a) => ({
      ...a,
      area: Number(a.area),
      priceDay: Number(a.priceDay),
      priceWeek: Number(a.priceWeek),
      priceMonth: Number(a.priceMonth),
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    }));

    res.json({ data: formatted, total, page: pageNum, limit: limitNum });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/apartments/:id", async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const [apartment] = await db
      .select()
      .from(apartmentsTable)
      .where(eq(apartmentsTable.id, id));

    if (!apartment) {
      res.status(404).json({ error: "Apartment not found" });
      return;
    }

    res.json({
      ...apartment,
      area: Number(apartment.area),
      priceDay: Number(apartment.priceDay),
      priceWeek: Number(apartment.priceWeek),
      priceMonth: Number(apartment.priceMonth),
      createdAt: apartment.createdAt.toISOString(),
      updatedAt: apartment.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/apartments", async (req, res): Promise<void> => {
  if (!req.session?.admin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const {
      apartmentNumber,
      title,
      city,
      district,
      address,
      description,
      rooms,
      bathrooms,
      area,
      priceDay,
      priceWeek,
      priceMonth,
      status = "available",
      images = [],
      video,
    } = req.body;

    const [created] = await db
      .insert(apartmentsTable)
      .values({
        apartmentNumber,
        title,
        city,
        district,
        address,
        description,
        rooms: Number(rooms),
        bathrooms: Number(bathrooms),
        area: String(area),
        priceDay: String(priceDay),
        priceWeek: String(priceWeek),
        priceMonth: String(priceMonth),
        status,
        images,
        video: video || null,
      })
      .returning();

    res.status(201).json({
      ...created,
      area: Number(created.area),
      priceDay: Number(created.priceDay),
      priceWeek: Number(created.priceWeek),
      priceMonth: Number(created.priceMonth),
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    });
  } catch (err: any) {
    req.log.error(err);
    // PostgreSQL unique violation error code
    if (err?.code === "23505" && err?.constraint_name?.includes("apartment_number")) {
      res.status(409).json({ error: "رقم الوحدة مستخدم بالفعل، يرجى اختيار رقم آخر" });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/apartments/:id", async (req, res): Promise<void> => {
  if (!req.session?.admin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const { id } = req.params;
    const updates: Record<string, unknown> = {};

    const fields = [
      "apartmentNumber",
      "title",
      "city",
      "district",
      "address",
      "description",
      "rooms",
      "bathrooms",
      "area",
      "priceDay",
      "priceWeek",
      "priceMonth",
      "status",
      "images",
      "video",
    ];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        if (["area", "priceDay", "priceWeek", "priceMonth"].includes(field)) {
          updates[field] = String(req.body[field]);
        } else if (["rooms", "bathrooms"].includes(field)) {
          updates[field] = Number(req.body[field]);
        } else {
          updates[field] = req.body[field];
        }
      }
    }

    updates.updatedAt = new Date();

    const [updated] = await db
      .update(apartmentsTable)
      .set(updates)
      .where(eq(apartmentsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Apartment not found" });
      return;
    }

    res.json({
      ...updated,
      area: Number(updated.area),
      priceDay: Number(updated.priceDay),
      priceWeek: Number(updated.priceWeek),
      priceMonth: Number(updated.priceMonth),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (err: any) {
    req.log.error(err);
    // PostgreSQL unique violation error code
    if (err?.code === "23505" && err?.constraint_name?.includes("apartment_number")) {
      res.status(409).json({ error: "رقم الوحدة مستخدم بالفعل، يرجى اختيار رقم آخر" });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/apartments/:id", async (req, res): Promise<void> => {
  if (!req.session?.admin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const { id } = req.params;
    const deleted = await db
      .delete(apartmentsTable)
      .where(eq(apartmentsTable.id, id))
      .returning();

    if (deleted.length === 0) {
      res.status(404).json({ error: "Apartment not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/apartments/:id/status", async (req, res): Promise<void> => {
  if (!req.session?.admin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== "available" && status !== "unavailable") {
      res.status(400).json({ error: "Invalid status" });
      return;
    }

    const [updated] = await db
      .update(apartmentsTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(apartmentsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Apartment not found" });
      return;
    }

    res.json({
      ...updated,
      area: Number(updated.area),
      priceDay: Number(updated.priceDay),
      priceWeek: Number(updated.priceWeek),
      priceMonth: Number(updated.priceMonth),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;


