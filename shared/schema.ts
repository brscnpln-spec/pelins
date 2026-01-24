import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const ritualCompletions = pgTable("ritual_completions", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  step: text("step").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const monsterScans = pgTable("monster_scans", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  result: text("result").notNull().default("NO_MONSTERS"),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

export const insertRitualCompletionSchema = createInsertSchema(ritualCompletions).omit({
  id: true,
  completedAt: true,
});

export const insertMonsterScanSchema = createInsertSchema(monsterScans).omit({
  id: true,
  timestamp: true,
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
});

export type RitualCompletion = typeof ritualCompletions.$inferSelect;
export type InsertRitualCompletion = z.infer<typeof insertRitualCompletionSchema>;

export type MonsterScan = typeof monsterScans.$inferSelect;
export type InsertMonsterScan = z.infer<typeof insertMonsterScanSchema>;

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;

export const RitualStepEnum = z.enum(["TEETH", "TOILET", "PAJAMAS"]);
export type RitualStep = z.infer<typeof RitualStepEnum>;

export const MorningRitualStepEnum = z.enum([
  "MORNING_TOILET",
  "MORNING_BREAKFAST", 
  "MORNING_CLOTHES",
  "MORNING_FOREST_CLOTHES",
  "MORNING_LUNCH"
]);
export type MorningRitualStep = z.infer<typeof MorningRitualStepEnum>;
