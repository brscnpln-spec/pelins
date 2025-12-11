import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { RitualStepEnum } from "@shared/schema";
import { getUpcomingEvents, getAuthUrl, exchangeCodeForTokens } from "./integrations/googleCalendar";
import { getWeather } from "./integrations/weather";
import {
  triggerSleepMode,
  triggerMonsterScanEffect,
  getDashboardEntities,
  isConfigured as isHAConfigured,
} from "./integrations/homeAssistant";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/ritual/status", async (req, res) => {
    try {
      const date = (req.query.date as string) || new Date().toISOString().split("T")[0];
      const completions = await storage.getRitualStatus(date);
      const completedSteps = completions.map((c) => c.step);
      res.json({ date, completedSteps });
    } catch (error) {
      console.error("Error getting ritual status:", error);
      res.status(500).json({ error: "Failed to get ritual status" });
    }
  });

  app.post("/api/ritual/complete", async (req, res) => {
    try {
      const { date, step } = req.body;

      if (!date || !step) {
        return res.status(400).json({ error: "Date and step are required" });
      }

      const validStep = RitualStepEnum.safeParse(step);
      if (!validStep.success) {
        return res.status(400).json({ error: "Invalid step" });
      }

      const completion = await storage.completeRitualStep({ date, step });
      const allCompletions = await storage.getRitualStatus(date);
      const completedSteps = allCompletions.map((c) => c.step);

      const allDone = completedSteps.length === 3;
      if (allDone) {
        triggerSleepMode().catch((err) =>
          console.error("Failed to trigger sleep mode:", err)
        );
      }

      res.json({ success: true, completedSteps, allDone });
    } catch (error) {
      console.error("Error completing ritual step:", error);
      res.status(500).json({ error: "Failed to complete step" });
    }
  });

  app.post("/api/ritual/reset", async (req, res) => {
    try {
      const { date } = req.body;
      if (!date) {
        return res.status(400).json({ error: "Date is required" });
      }

      await storage.resetRitual(date);
      res.json({ success: true });
    } catch (error) {
      console.error("Error resetting ritual:", error);
      res.status(500).json({ error: "Failed to reset ritual" });
    }
  });

  app.post("/api/ritual/trigger-sleep-mode", async (req, res) => {
    try {
      const success = await triggerSleepMode();
      res.json({ success });
    } catch (error) {
      console.error("Error triggering sleep mode:", error);
      res.status(500).json({ error: "Failed to trigger sleep mode" });
    }
  });

  app.post("/api/monster/scan", async (req, res) => {
    try {
      triggerMonsterScanEffect().catch((err) =>
        console.error("Failed to trigger monster scan effect:", err)
      );

      const scan = await storage.createMonsterScan({ result: "NO_MONSTERS" });

      res.json({
        status: "ok",
        monstersFound: false,
        scanId: scan.id,
      });
    } catch (error) {
      console.error("Error performing monster scan:", error);
      res.status(500).json({ error: "Failed to perform scan" });
    }
  });

  app.get("/api/monster/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const history = await storage.getMonsterScanHistory(limit);
      res.json({ scans: history });
    } catch (error) {
      console.error("Error getting scan history:", error);
      res.status(500).json({ error: "Failed to get scan history" });
    }
  });

  app.get("/api/dashboard/calendar", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 3;
      const events = await getUpcomingEvents(days);
      res.json({ events });
    } catch (error) {
      console.error("Error getting calendar events:", error);
      res.json({ events: [] });
    }
  });

  // Google OAuth routes for local Raspberry Pi setup
  app.get("/api/auth/google", (req, res) => {
    try {
      const authUrl = getAuthUrl();
      res.redirect(authUrl);
    } catch (error) {
      res.status(500).send(`
        <html>
          <body style="font-family: sans-serif; padding: 40px;">
            <h1>Google Calendar Setup</h1>
            <p style="color: red;">Error: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env file</p>
            <p>Please follow the setup instructions in RASPBERRY_PI_KURULUM.md</p>
          </body>
        </html>
      `);
    }
  });

  app.get("/api/auth/google/callback", async (req, res) => {
    try {
      const code = req.query.code as string;
      if (!code) {
        return res.status(400).send("No authorization code received");
      }

      const { refresh_token } = await exchangeCodeForTokens(code);
      
      res.send(`
        <html>
          <body style="font-family: sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
            <h1 style="color: green;">Google Calendar Connected!</h1>
            <p>Add this line to your <code>.env</code> file:</p>
            <pre style="background: #f0f0f0; padding: 20px; border-radius: 8px; overflow-x: auto;">GOOGLE_REFRESH_TOKEN=${refresh_token}</pre>
            <p>Then restart the application:</p>
            <pre style="background: #f0f0f0; padding: 20px; border-radius: 8px;">pm2 restart familyhub</pre>
            <p style="margin-top: 20px;">After restarting, your calendar events will appear on the dashboard.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.status(500).send(`
        <html>
          <body style="font-family: sans-serif; padding: 40px;">
            <h1 style="color: red;">Error</h1>
            <p>${error instanceof Error ? error.message : "Unknown error occurred"}</p>
            <p><a href="/api/auth/google">Try again</a></p>
          </body>
        </html>
      `);
    }
  });

  app.get("/api/dashboard/weather", async (req, res) => {
    try {
      const lat = parseFloat(req.query.lat as string) || 41.0082;
      const lon = parseFloat(req.query.lon as string) || 28.9784;
      const weather = await getWeather(lat, lon);
      res.json(weather);
    } catch (error) {
      console.error("Error getting weather:", error);
      res.status(500).json({ error: "Failed to get weather" });
    }
  });

  app.get("/api/dashboard/home-status", async (req, res) => {
    try {
      const configured = isHAConfigured();
      if (!configured) {
        return res.json({ configured: false, entities: [] });
      }

      const entities = await getDashboardEntities();
      res.json({ configured: true, entities });
    } catch (error) {
      console.error("Error getting home status:", error);
      res.json({ configured: false, entities: [] });
    }
  });

  app.get("/api/settings", async (req, res) => {
    try {
      const allSettings = await storage.getAllSettings();
      const settingsObj: Record<string, string> = {};
      for (const s of allSettings) {
        settingsObj[s.key] = s.value;
      }
      res.json(settingsObj);
    } catch (error) {
      console.error("Error getting settings:", error);
      res.status(500).json({ error: "Failed to get settings" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const { key, value } = req.body;
      if (!key || value === undefined) {
        return res.status(400).json({ error: "Key and value are required" });
      }

      const setting = await storage.setSetting({ key, value: String(value) });
      res.json({ success: true, setting });
    } catch (error) {
      console.error("Error saving setting:", error);
      res.status(500).json({ error: "Failed to save setting" });
    }
  });

  return httpServer;
}
