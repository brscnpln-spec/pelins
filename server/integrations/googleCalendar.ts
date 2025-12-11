import { google } from "googleapis";

let connectionSettings: any;
let localOAuthClient: any = null;

// Check if we have local OAuth credentials
function hasLocalCredentials(): boolean {
  return !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN
  );
}

// Get redirect URI based on environment
function getRedirectUri(): string {
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }
  return "http://localhost:5000/api/auth/google/callback";
}

// Get OAuth client for local deployment
async function getLocalOAuthClient() {
  if (localOAuthClient) {
    return localOAuthClient;
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    getRedirectUri()
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  localOAuthClient = oauth2Client;
  return oauth2Client;
}

// Get access token from Replit Connector (for Replit deployment)
async function getReplitAccessToken() {
  if (
    connectionSettings &&
    connectionSettings.settings.expires_at &&
    new Date(connectionSettings.settings.expires_at).getTime() > Date.now()
  ) {
    return connectionSettings.settings.access_token;
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) {
    throw new Error("X_REPLIT_TOKEN not found for repl/depl");
  }

  connectionSettings = await fetch(
    "https://" +
      hostname +
      "/api/v2/connection?include_secrets=true&connector_names=google-calendar",
    {
      headers: {
        Accept: "application/json",
        X_REPLIT_TOKEN: xReplitToken,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.items?.[0]);

  const accessToken =
    connectionSettings?.settings?.access_token ||
    connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error("Google Calendar not connected");
  }
  return accessToken;
}

async function getCalendarClient() {
  // Check for local credentials first
  if (hasLocalCredentials()) {
    const oauth2Client = await getLocalOAuthClient();
    return google.calendar({ version: "v3", auth: oauth2Client });
  }

  // Fall back to Replit Connector
  const accessToken = await getReplitAccessToken();
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  return google.calendar({ version: "v3", auth: oauth2Client });
}

export interface CalendarEvent {
  id: string;
  start: string;
  end: string;
  summary: string;
  calendarName?: string;
}

export async function getUpcomingEvents(days: number = 3): Promise<CalendarEvent[]> {
  try {
    const calendar = await getCalendarClient();
    
    const now = new Date();
    const timeMin = now.toISOString();
    const timeMax = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

    const calendarList = await calendar.calendarList.list();
    const calendars = calendarList.data.items || [];

    const allEvents: CalendarEvent[] = [];

    for (const cal of calendars) {
      if (!cal.id) continue;

      try {
        const events = await calendar.events.list({
          calendarId: cal.id,
          timeMin,
          timeMax,
          singleEvents: true,
          orderBy: "startTime",
          maxResults: 20,
        });

        const items = events.data.items || [];
        for (const event of items) {
          if (event.id && event.summary) {
            allEvents.push({
              id: event.id,
              start: event.start?.dateTime || event.start?.date || "",
              end: event.end?.dateTime || event.end?.date || "",
              summary: event.summary,
              calendarName: cal.summary || "Calendar",
            });
          }
        }
      } catch (err) {
        console.error(`Error fetching events from calendar ${cal.id}:`, err);
      }
    }

    allEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    return allEvents;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return [];
  }
}

// Helper to generate OAuth URL for initial setup
export function getAuthUrl(): string {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    getRedirectUri()
  );

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/calendar.events.readonly",
    ],
  });
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(code: string): Promise<{ refresh_token: string }> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    getRedirectUri()
  );

  const { tokens } = await oauth2Client.getToken(code);
  
  if (!tokens.refresh_token) {
    throw new Error("No refresh token received. Make sure to revoke access and try again.");
  }

  return { refresh_token: tokens.refresh_token };
}
