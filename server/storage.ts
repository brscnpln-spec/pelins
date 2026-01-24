import {
  ritualCompletions,
  monsterScans,
  settings,
  type RitualCompletion,
  type InsertRitualCompletion,
  type MonsterScan,
  type InsertMonsterScan,
  type Setting,
  type InsertSetting,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, like, notLike } from "drizzle-orm";

export interface IStorage {
  getRitualStatus(date: string): Promise<RitualCompletion[]>;
  completeRitualStep(data: InsertRitualCompletion): Promise<RitualCompletion>;
  resetRitual(date: string): Promise<void>;
  resetMorningRitual(date: string): Promise<void>;
  
  createMonsterScan(data: InsertMonsterScan): Promise<MonsterScan>;
  getMonsterScanHistory(limit?: number): Promise<MonsterScan[]>;
  
  getSetting(key: string): Promise<Setting | undefined>;
  setSetting(data: InsertSetting): Promise<Setting>;
  getAllSettings(): Promise<Setting[]>;
}

export class DatabaseStorage implements IStorage {
  async getRitualStatus(date: string): Promise<RitualCompletion[]> {
    return await db
      .select()
      .from(ritualCompletions)
      .where(eq(ritualCompletions.date, date));
  }

  async completeRitualStep(data: InsertRitualCompletion): Promise<RitualCompletion> {
    const existing = await db
      .select()
      .from(ritualCompletions)
      .where(
        and(
          eq(ritualCompletions.date, data.date),
          eq(ritualCompletions.step, data.step)
        )
      );

    if (existing.length > 0) {
      return existing[0];
    }

    const [completion] = await db
      .insert(ritualCompletions)
      .values(data)
      .returning();
    return completion;
  }

  async resetRitual(date: string): Promise<void> {
    await db
      .delete(ritualCompletions)
      .where(
        and(
          eq(ritualCompletions.date, date),
          notLike(ritualCompletions.step, "MORNING_%")
        )
      );
  }

  async resetMorningRitual(date: string): Promise<void> {
    await db
      .delete(ritualCompletions)
      .where(
        and(
          eq(ritualCompletions.date, date),
          like(ritualCompletions.step, "MORNING_%")
        )
      );
  }

  async createMonsterScan(data: InsertMonsterScan): Promise<MonsterScan> {
    const [scan] = await db
      .insert(monsterScans)
      .values(data)
      .returning();
    return scan;
  }

  async getMonsterScanHistory(limit: number = 10): Promise<MonsterScan[]> {
    return await db
      .select()
      .from(monsterScans)
      .orderBy(desc(monsterScans.timestamp))
      .limit(limit);
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key));
    return setting;
  }

  async setSetting(data: InsertSetting): Promise<Setting> {
    const existing = await this.getSetting(data.key);
    
    if (existing) {
      const [updated] = await db
        .update(settings)
        .set({ value: data.value })
        .where(eq(settings.key, data.key))
        .returning();
      return updated;
    }

    const [setting] = await db
      .insert(settings)
      .values(data)
      .returning();
    return setting;
  }

  async getAllSettings(): Promise<Setting[]> {
    return await db.select().from(settings);
  }
}

export const storage = new DatabaseStorage();
