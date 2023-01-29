import distSession from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import dotenv from 'dotenv';

dotenv.config();

export const RedisStore = connectRedis(distSession);

export const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,
  auth_pass: process.env.REDIS_PASSWORD,
});

redisClient.on('error', err => {
  // eslint-disable-next-line no-console
  console.log(`Could not establish a connection with redis. ${err}`);
});

redisClient.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log('Connected to redis successfully');
});

export const session = distSession;
export default redisClient;
