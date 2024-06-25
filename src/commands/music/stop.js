import { SlashCommand } from 'slash-create/web';

export default class Stop extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'stop',
      description: 'Chơi con mẹ mày!',
    });
  }

  async run(ctx) {
    this.ctx = ctx;
    return `kkk`;
  }
}
