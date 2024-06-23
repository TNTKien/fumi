import { SlashCommand } from 'slash-create/web';

export default class Ping extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'ping',
      description: 'Pong!',
    });
  }

  async run(ctx) {
    this.ctx = ctx;
    return `Pong!`;
  }
}
