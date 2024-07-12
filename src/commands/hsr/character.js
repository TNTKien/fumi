import { ComponentType, SlashCommand } from 'slash-create/web';
import { HsrCharacter } from '../../lib/hsr';
import {
  baseHsrUI,
  hsrCharJSON,
  hsrHashJSON,
  hsrWeaponJSON,
} from '../../../config';

export default class Character extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'character',
      description: `See your Honkai Star Rail character's stats`,
      //   options: [
      //     {
      //       type: CommandOptionType.USER,
      //       name: 'user',
      //       description: 'The user you want to see',
      //       required: false,
      //     },
      //   ],
    });
  }
  async run(ctx) {
    await ctx.defer({ ephemeral: true });
    const memberID = ctx.member.id;
    const user = await ctx.creator.users.get(memberID);

    if (!user)
      return await ctx.send('This user has not linked their account yet!');

    const res = await HsrCharacter(user.hsrID);
    if (!res.data)
      return await ctx.send(`Error: ${res.status} - ${res.message}`);

    const characterData = res.data;
    //console.log(characterData[1].equipment.tid);

    const hsrHashName = await fetch(hsrHashJSON).then((res) => res.json());
    const hsrChars = await fetch(hsrCharJSON).then((res) => res.json());
    const hsrWeapon = await fetch(hsrWeaponJSON).then((res) => res.json());

    const userChars = [];
    for (const char of characterData) {
      const charHashName = hsrChars[char.avatarId].AvatarName.Hash;
      const charName = hsrHashName['en'][charHashName];

      const charImgPath = hsrChars[char.avatarId]['AvatarCutinFrontImgPath'];

      //const LCHashName = hsrWeapon[char.equipment.tid].EquipmentName.Hash;
      let LCName = '_ _';
      let LCPath = '';
      let LCRank = '_ _';
      if (char.equipment) {
        LCName = hsrHashName['en'][char.equipment._flat.name];
        LCPath = hsrWeapon[char.equipment.tid]['ImagePath'];
        LCRank = char.equipment.rank;
      }

      userChars.push({
        name: charName,
        level: char.level,
        rank: char.rank || '0',
        img: baseHsrUI + charImgPath,
        lightcone: {
          name: LCName,
          img: baseHsrUI + LCPath,
          rank: LCRank,
        },
      });
    }

    const menu = [
      {
        type: ComponentType.ACTION_ROW,
        components: [
          {
            type: 3,
            custom_id: 'character_select',
            placeholder: 'Choose a character',
            min_values: 1,
            max_values: 1,
            options: userChars.map((char, index) => ({
              label: char.name,
              value: index,
            })),
          },
        ],
      },
    ];

    await ctx.send({ content: '_ _', components: menu });

    ctx.registerComponent('character_select', async (selectCtx) => {
      const selectedChar = userChars[selectCtx.values[0]];
      const embed = {
        title:
          selectedChar.name +
          ' - ' +
          `E${selectedChar.rank}S${selectedChar.lightcone.rank}`,
        thumbnail: {
          url: selectedChar.lightcone.img,
        },
        image: {
          url: selectedChar.img,
        },
        color: Math.floor(Math.random() * 0xffffff),
        fields: [
          {
            name: 'Level',
            value: selectedChar.level,
            inline: true,
          },
          {
            name: 'Lightcone',
            value: selectedChar.lightcone.name,
            inline: true,
          },
        ],
        footer: {
          text: `UID: ${user.hsrID}`,
        },
      };
      await selectCtx.send({ embeds: [embed] });
    });
  }
}
