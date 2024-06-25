import { SlashCommand } from 'slash-create/web';

export default class Emoji extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'emoji',
      description: 'Emoji Management',
    });
  }

  async run(ctx) {
    return `kkk`;
  }
}
