import pino from "pino";
import { env } from "@/config/env";
import { supabaseServer } from "@/integrations/supabase/server";

const logger = pino({
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: { colorize: true }
        }
      : undefined
});

export async function logEvent(agent: string, event_name: string, payload: unknown) {
  logger.info({ agent, event_name, payload }, "event");

  // Best-effort persistence (do not crash request if DB insert fails)
  try {
    await supabaseServer.from("agent_logs").insert({ agent, event_name, payload });
  } catch (e) {
    logger.warn({ err: e }, "failed to persist agent log");
  }
}

export { logger };
