import { SlashCreator, CloudflareWorkerServer } from 'slash-create/web';

import Ping from '../commands/ping';
import Avatar from '../commands/utility/avatar';
import Banner from '../commands/utility/banner';
import Play from '../commands/music/play';
import Stop from '../commands/music/stop';
import Emoji from '../commands/expression/emoji';
export default class FumiClient extends SlashCreator {
  constructor(env) {
    super({
      applicationID: env.DISCORD_APPLICATION_ID,
      publicKey: env.DISCORD_PUBLIC_KEY,
      token: env.DISCORD_TOKEN,
    });
    this.workers = new CloudflareWorkerServer();
    this.env = env;
  }

  async start() {
    this.withServer(this.workers).registerCommands([
      Ping,
      Avatar,
      Play,
      Stop,
      Banner,
      Emoji,
    ]);
    // this.withServer(this.workers)
    //   .registerCommandsIn('../commands')
    //   .syncCommands();

    // <--> handle component interactions
    this.on('componentInteraction', async (ctx) => {
      //   const functions = { "acknowledged": acknowledged };
      const interaction = functions[ctx.customID];
      return interaction.execute(ctx);
    });
    // <--> handle other events
    this.on('error', (error) => console.error(error.stack || error.toString()));
    this.on('commandError', (command, error) =>
      console.error(`${command.commandName}:`, error.stack || error.toString()),
    );
  }

  // <--> cloudflare request handling
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    //await initSchema(env.database);
    if (pathname.startsWith('/interactions'))
      return this.workers.fetch(request, env, ctx);
    return new Response('Not found', { status: 404 });
  }
}
