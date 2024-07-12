import { CommandOptionType, SlashCommand } from 'slash-create/web';
import { HsrPlayer } from '../../lib/hsr';

export default class Profile extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'profile',
      description: 'See your Honkai Star Rail profile',
      options: [
        {
          type: CommandOptionType.USER,
          name: 'user',
          description: 'The user you want to see',
          required: false,
        },
      ],
    });
  }
  async run(ctx) {
    await ctx.defer();
    const memberID = ctx.options.user || ctx.member.id;
    const user = await ctx.creator.users.get(memberID);

    if (!user)
      return await ctx.send('This user has not linked their account yet!');

    const res = await HsrPlayer(user.hsrID);
    if (!res.data)
      return await ctx.send(`Error: ${res.status} - ${res.message}`);

    const playerData = res.data;

    const embed = {
      title: playerData.nickname,
      //   author: {
      //     name: 'Is that you?',
      //     icon_url: playerData.headIcon,
      //   },
      thumbnail: {
        url: playerData.headIcon,
      },
      description: playerData.signature || '_ _',
      color: Math.floor(Math.random() * 0xffffff),
      fields: [
        {
          name: 'Level',
          value: playerData.level || '_ _',
          inline: true,
        },
        {
          name: 'Equilibrium',
          value: playerData.worldLevel || '_ _',
          inline: true,
        },
        {
          name: 'Friends',
          value: playerData.friendCount || '_ _',
          inline: true,
        },
      ],
      footer: {
        text: `UID: ${playerData.uid}`,
      },
    };

    await ctx.send({ embeds: [embed] });
  }
}
