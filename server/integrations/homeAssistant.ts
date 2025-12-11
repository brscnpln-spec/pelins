import { storage } from "../storage";

async function getHAConfig(): Promise<{ baseUrl: string; token: string } | null> {
  const baseUrlSetting = await storage.getSetting("ha_base_url");
  const tokenSetting = await storage.getSetting("ha_token");

  if (!baseUrlSetting || !tokenSetting) {
    return null;
  }

  return {
    baseUrl: baseUrlSetting.value,
    token: tokenSetting.value,
  };
}

export interface HAEntity {
  id: string;
  friendlyName: string;
  state: string;
  type?: "light" | "temperature" | "window" | "sensor";
}

export async function getEntityState(entityId: string): Promise<string | null> {
  const config = await getHAConfig();
  if (!config) return null;

  try {
    const response = await fetch(
      `${config.baseUrl}/api/states/${entityId}`,
      {
        headers: {
          Authorization: `Bearer ${config.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(`HA API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.state;
  } catch (error) {
    console.error("Error fetching HA entity state:", error);
    return null;
  }
}

export async function callService(
  domain: string,
  service: string,
  data: Record<string, any> = {}
): Promise<boolean> {
  const config = await getHAConfig();
  if (!config) {
    console.log("Home Assistant not configured - skipping service call");
    return false;
  }

  try {
    const response = await fetch(
      `${config.baseUrl}/api/services/${domain}/${service}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Error calling HA service:", error);
    return false;
  }
}

export async function triggerSleepMode(): Promise<boolean> {
  const sceneSetting = await storage.getSetting("ha_sleep_scene");
  const sceneName = sceneSetting?.value || "scene.sleep_mode";

  return await callService("scene", "turn_on", {
    entity_id: sceneName,
  });
}

export async function triggerMonsterScanEffect(): Promise<boolean> {
  const lightSetting = await storage.getSetting("ha_monster_light");
  const lightEntity = lightSetting?.value || "light.bedroom";

  const originalState = await getEntityState(lightEntity);

  await callService("light", "turn_on", {
    entity_id: lightEntity,
    brightness: 255,
  });

  await new Promise((resolve) => setTimeout(resolve, 300));
  await callService("light", "turn_off", { entity_id: lightEntity });

  await new Promise((resolve) => setTimeout(resolve, 200));
  await callService("light", "turn_on", {
    entity_id: lightEntity,
    brightness: 255,
  });

  await new Promise((resolve) => setTimeout(resolve, 300));
  await callService("light", "turn_off", { entity_id: lightEntity });

  if (originalState === "on") {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await callService("light", "turn_on", { entity_id: lightEntity });
  }

  return true;
}

export async function getDashboardEntities(): Promise<HAEntity[]> {
  const entitiesSetting = await storage.getSetting("ha_dashboard_entities");
  
  if (!entitiesSetting) {
    return [];
  }

  try {
    const entityConfigs = JSON.parse(entitiesSetting.value) as Array<{
      id: string;
      friendlyName: string;
      type: "light" | "temperature" | "window" | "sensor";
    }>;

    const entities: HAEntity[] = [];

    for (const config of entityConfigs) {
      const state = await getEntityState(config.id);
      entities.push({
        id: config.id,
        friendlyName: config.friendlyName,
        state: state || "unavailable",
        type: config.type,
      });
    }

    return entities;
  } catch (error) {
    console.error("Error parsing dashboard entities:", error);
    return [];
  }
}

export async function isConfigured(): Promise<boolean> {
  const config = await getHAConfig();
  return config !== null;
}
