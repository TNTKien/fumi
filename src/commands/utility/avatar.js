import {
  ButtonStyle,
  CommandOptionType,
  ComponentType,
  SlashCommand,
} from 'slash-create/web';
import { getMember, getMemberAvatar } from '../../lib/utils';

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
    await ctx.defer();
    const userId = ctx.options.user || ctx.member.id;
    const guildId = ctx.guildID;

    const member = await getMember(guildId, userId, ctx.creator.env);

    const { userAvatarURL, memberAvatarURL } = await getMemberAvatar(
      guildId,
      userId,
      ctx.creator.env,
    );

    let embed = {
      color: Math.floor(Math.random() * 0xffffff),
      author: {
        name: `${member.nick ? member.nick : member.user.username}'s avatar:`,
        icon_url: userAvatarURL,
      },
      image: {
        url: memberAvatarURL || userAvatarURL,
      },
    };

    let components = [];
    if (memberAvatarURL) {
      components = [
        {
          type: ComponentType.ACTION_ROW,
          components: [
            {
              type: ComponentType.BUTTON,
              style: ButtonStyle.PRIMARY,
              label: 'View Original Avatar',
              custom_id: 'view_avatar',
            },
          ],
        },
      ];
    }

    await ctx.send({
      embeds: [embed],
      components: components,
    });

    ctx.registerComponent('view_avatar', async (btnCtx) => {
      embed.image.url = userAvatarURL;
      await btnCtx.editParent({
        embeds: [embed],
        components: [
          {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.BUTTON,
                style: ButtonStyle.PRIMARY,
                label: 'View Server profile Avatar',
                custom_id: 'view_sv_avatar',
              },
            ],
          },
        ],
      });
    });

    ctx.registerComponent('view_sv_avatar', async (btnCtx) => {
      embed.image.url = memberAvatarURL;
      await btnCtx.editParent({
        embeds: [embed],
        components: components,
      });
    });
  }
}
