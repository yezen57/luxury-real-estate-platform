// @ts-nocheck
import { pgTable, text, integer, numeric, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const apartmentsTable = pgTable("apartments", {
  id: uuid("id").primaryKey().defaultRandom(),
  apartmentNumber: text("apartment_number").notNull().unique(),
  title: text("title").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  address: text("address").notNull(),
  description: text("description").notNull(),
  rooms: integer("rooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  area: numeric("area", { precision: 10, scale: 2 }).notNull(),
  priceDay: numeric("price_day", { precision: 10, scale: 2 }).notNull(),
  priceWeek: numeric("price_week", { precision: 10, scale: 2 }).notNull(),
  priceMonth: numeric("price_month", { precision: 10, scale: 2 }).notNull(),
  status: text("status", { enum: ["available", "unavailable"] }).notNull().default("available"),
  images: text("images").array().notNull().default([]),
  video: text("video"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertApartmentSchema = createInsertSchema(apartmentsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertApartment = z.infer<typeof insertApartmentSchema>;
export type Apartment = typeof apartmentsTable.$inferSelect;

