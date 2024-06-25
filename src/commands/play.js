import { SlashCommand } from 'slash-create/web';

export default class Play extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'play',
      description: 'Chơi con mẹ mày!',
    });
  }

  async run(ctx) {
    this.ctx = ctx;
    return `kkk`;
  }
}
