import { CommandOptionType, SlashCommand } from 'slash-create/web';
import {
  getMemberBanner,
  getMember,
  getUserBanner,
  getUser,
  getUserAvatar,
} from '../../lib/utils';

export default class Banner extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'banner',
      description: 'Get the banner of a user',
      options: [
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'user_profile',
          description: 'Get the user profile banner',
          options: [
            {
              type: CommandOptionType.USER,
              name: 'user',
              description: 'The user to get banner',
              required: false,
            },
          ],
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'server_profile',
          description: "Get the user's server profile banner",
          options: [
            {
              type: CommandOptionType.USER,
              name: 'user',
              description: 'The user to get banner',
              required: false,
            },
          ],
        },
      ],
    });
  }

  async run(ctx) {
    let subCmdType;
    let userId;

    if ('user_profile' in ctx.options) {
      subCmdType = 'user_profile';
      userId = ctx.options.user_profile.user || ctx.member.id;
    } else if ('server_profile' in ctx.options) {
      subCmdType = 'server_profile';
      userId = ctx.options.server_profile.user || ctx.member.id;
    }

    if (subCmdType === 'user_profile') {
      const bannerURL = await getUserBanner(userId, ctx.creator.env);
      if (!bannerURL) {
        return 'This user does not have a banner.';
      }
      const member = await getMember(ctx.guildID, userId, ctx.creator.env);
      const avatarURL = await getUserAvatar(userId, ctx.creator.env);
      const embed = {
        color: Math.floor(Math.random() * 0xffffff),
        author: {
          name: `${member.nick ? member.nick : member.user.username}'s banner:`,
          icon_url: avatarURL,
        },
        image: {
          url: bannerURL,
        },
      };
      ctx.send({ embeds: [embed] });
    } else if (subCmdType === 'server_profile') {
      const guildId = ctx.guildID;
      const bannerURL = await getMemberBanner(guildId, userId, ctx.creator.env);
      if (!bannerURL) {
        return 'This feature is not supported yet.';
      }
      ctx.send(bannerURL);
    }
  }
}
