import { CommandOptionType, SlashCommand } from 'slash-create/web';

export default class Avatar extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'avatar',
      description: 'Get the avatar of a user',
      options: [
        {
          type: CommandOptionType.USER,
          name: 'user',
          description: 'The user to get avatar',
          required: false,
        },
      ],
    });
  }

  async run(ctx) {
    const user = ctx.options.user || ctx.member.user;
    return {
      //content: `${user.username}'s avatar:'`,
      embeds: [
        {
          title: `${user.username}'s avatar:`,
          image: {
            url: user.avatarURL,
          },
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 5,
              label: 'View original',
              url: user.avatarURL.replace(/(size=)\d+/, 'size=2048'),
            },
          ],
        },
      ],
    };
  }
}
