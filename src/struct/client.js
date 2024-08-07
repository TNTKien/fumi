import { SlashCreator, CloudflareWorkerServer } from 'slash-create/web';
import Database from './database';

import Ping from '../commands/ping';
import Avatar from '../commands/utility/avatar';
import Banner from '../commands/utility/banner';
import Emoji from '../commands/expression/emoji';
import Link from '../commands/hsr/link';
import initSchema from './schema';
import Profile from '../commands/hsr/profile';
import Character from '../commands/hsr/character';
// import { readdirSync, readFileSync } from 'node:fs';
// import { join } from 'path';

export default class FumiClient extends SlashCreator {
  constructor(env) {
    super({
      applicationID: env.DISCORD_APPLICATION_ID,
      publicKey: env.DISCORD_PUBLIC_KEY,
      token: env.DISCORD_TOKEN,
    });
    this.workers = new CloudflareWorkerServer();
    this.env = env;
    this.db = env.database;
    this.users = new Database(this, 'users');
  }

  async start() {
    this.withServer(this.workers).registerCommands([
      Ping,
      Avatar,
      Banner,
      Emoji,
      Link,
      Profile,
      Character,
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
    await initSchema(env.database);
    if (pathname.startsWith('/interactions'))
      return this.workers.fetch(request, env, ctx);

    if (pathname.startsWith('/avt')) {
      const baseURL =
        'https://raw.githubusercontent.com/TNTKien/fumi/main/images/120/';
      const name = [
        'boothil-honkai-star-rail.gif',
        'doro_think.png',
        'dr-ratio-hsr.gif',
        'firefly-hsr.gif',
        'gomen.png',
        'honkai-star-rail-hsr.gif',
        'jade-hsr-jade.gif',
        'kafka-honkai.gif',
        'koyuky.png',
        'robin-hsr.gif',
        'silver-wolf-picmix.gif',
        'softest-good-morning.gif',
        'topaz-gm.gif',
        'yuka.png',
        'kadoko.gif',
        'hanser.jpg',
        '120r.gif',
        'sui120.jpg',
        'hoxilo.jpg',
        'nikke-privaty.gif',
        'privaty.gif',
      ];
      const imageURL = `${baseURL}${name[Math.floor(Math.random() * name.length)]}`;
      //redirect to image
      const kkk = baseURL + 'bath.jpg';
      return Response.redirect(kkk, 302);
    }

    const image = await fetch(
      'https://github.com/TNTKien/fumi/assets/95180188/83b17607-802b-49a3-83a4-fdbf8afe85ea',
    );
    return new Response(image.body, {
      headers: { 'content-type': 'image/png' },
    });
    z;
  }
}
