import { CommandOptionType, SlashCommand } from 'slash-create/web';

export default class Play extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'play',
      description: 'Play a song!',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'song',
          description: 'Name or YouTube URL',
          required: true,
        },
      ],
    });
  }

  async run(ctx) {}
}
