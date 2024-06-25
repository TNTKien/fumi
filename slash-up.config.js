// slash-create's cli tool
import dotenv from 'dotenv';
import process from 'node:process';
dotenv.config({ path: '.dev.vars' });

export const token = process.env.DISCORD_TOKEN;
export const applicationId = process.env.DISCORD_APPLICATION_ID;
export const commandPath = './src/commands';
export const env = {
  development: {
    globalToGuild: process.env.DEVID,
  },
};
