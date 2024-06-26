/**
 * The core server that runs on a Cloudflare worker.
 */

import { AutoRouter } from 'itty-router';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';
import { InteractionResponseFlags } from 'discord-interactions';
import { INVITE_COMMAND, PING_COMMAND, AVATAR_COMMAND } from './commands.js';

class JsonResponse extends Response {
  constructor(body, init) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    };
    super(jsonBody, init);
  }
}

const router = AutoRouter();

/**
 * A simple :wave: hello page to verify the worker is working.
 */
router.get('/', (request, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

/**
 * Main route for all requests sent from Discord.  All incoming messages will
 * include a JSON payload described here:
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
router.post('/', async (request, env) => {
  const { isValid, interaction } = await server.verifyDiscordRequest(
    request,
    env,
  );
  if (!isValid || !interaction) {
    return new Response('Bad request signature.', { status: 401 });
  }

  if (interaction.type === InteractionType.PING) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return new JsonResponse({
      type: InteractionResponseType.PONG,
    });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    // Most user commands will come as `APPLICATION_COMMAND`.
    switch (interaction.data.name.toLowerCase()) {
      case INVITE_COMMAND.name.toLowerCase(): {
        //return INVITE_COMMAND.handler();
        const applicationId = env.DISCORD_APPLICATION_ID;
        const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${applicationId}&scope=applications.commands`;
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: INVITE_URL,
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }

      case PING_COMMAND.name.toLowerCase(): {
        //return PING_COMMAND.handler();
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Pong!!!',
          },
        });
      }

      case AVATAR_COMMAND.name.toLowerCase(): {
        //return AVATAR_COMMAND.handler(interaction);
        const user = interaction.data.options?.find(
          (option) => option.name === 'user',
        );
        console.log(user);
        const userId = user?.value || interaction.member.user.id;

        const res = await fetch(`https://discord.com/api/v10/users/${userId}`, {
          headers: {
            Authorization: `Bot ${env.DISCORD_TOKEN}`,
          },
        });
        const userData = await res.json();
        const avatarName = userData.avatar;
        const isGif = avatarName?.startsWith('a_');
        const avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarName}.${
          isGif ? 'gif' : 'png'
        }?size=2048`;

        //const avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarName}.png?size=2048`;
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            //content: avatarUrl,
            embeds: [
              {
                title: `${userData.username} có avatar:`,
                image: {
                  url: avatarUrl,
                },
                timestamp: new Date().toISOString(),
                type: 'rich',
                color: 1703423,
              },
            ],
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    style: 5,
                    label: 'Xem ảnh gốc',
                    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                  },
                ],
              },
            ],
          },
        });
      }
      default:
        return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
    }
  }

  console.error('Unknown Type');
  return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});
router.all('*', () => new Response('Not Found.', { status: 404 }));

async function verifyDiscordRequest(request, env) {
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  const body = await request.text();
  const isValidRequest =
    signature &&
    timestamp &&
    (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
  if (!isValidRequest) {
    return { isValid: false };
  }

  return { interaction: JSON.parse(body), isValid: true };
}

const server = {
  verifyDiscordRequest,
  fetch: router.fetch,
};

export default server;
