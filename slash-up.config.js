// slash-create's cli tool
export const token = process.env.DISCORD_TOKEN;
export const applicationId = process.env.DISCORD_APPLICATION_ID;
export const commandPath = './src/commands';
export const env = {
  development: {
    globalToGuild: process.env.DEVID,
  },
};
