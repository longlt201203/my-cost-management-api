import { createClient } from "redis";
import { Env } from "./env";

export const redisClient = createClient({
	url: Env.REDIS_URL,
});

export async function initRedisClient() {
	await redisClient.connect();
}
