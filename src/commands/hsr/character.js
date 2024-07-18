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
    //try {
    const memberID = ctx.member.id;
    const user = await ctx.creator.users.get(memberID);

    if (!user)
      return await ctx.send('This user has not linked their account yet!');

    const { status, message, data } = await HsrCharacter(user.hsrID);
    if (!data) return await ctx.send(`Error: ${res.status} - ${res.message}`);

    const userChars = data;

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
      // const stats = Object.entries(selectedChar.stats)
      //   .filter(([key, value]) => value !== 0)
      //   .map(([key, value]) => {
      //     if (['HP', 'ATK', 'DEF', 'SPD'].includes(key)) {
      //       value = Math.floor(value);
      //     }
      //     if (
      //       [
      //         'CR',
      //         'CD',
      //         'E_RES',
      //         'BE',
      //         'ER',
      //         'EHR',
      //         'PhysicalDMG',
      //         'FireDMG',
      //         'IceDMG',
      //         'WindDMG',
      //         'LightningDMG',
      //         'ImaginaryDMG',
      //         'QuantumDMG',
      //       ].includes(key)
      //     ) {
      //       switch (key) {
      //         case 'CR':
      //           key = 'CRIT Rate';
      //           break;
      //         case 'CD':
      //           key = 'CRIT DMG';
      //           break;
      //         case 'E_RES':
      //           key = 'Effect RES';
      //           break;
      //         case 'BE':
      //           key = 'Break Effect';
      //           break;
      //         case 'ER':
      //           key = 'Energy Regen';
      //           break;
      //         case 'EHR':
      //           key = 'Effect Hit Rate';
      //           break;
      //         // case key has DMG in it, then add "Boost" to the end
      //         default:
      //           key = key + ' Boost';
      //           break;
      //       }
      //       value = Math.floor(value * 100) + '%';
      //     }
      //     return `${key}: ${value}`;
      //   });
      // console.log(stats);
      // const FormatedStats = formatStats(stats);

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
          {
            name: 'Stats',
            value: Object.entries(selectedChar.stats)
              .filter(([key, value]) => value !== 0)
              .map(([key, value]) => {
                if (['HP', 'ATK', 'DEF', 'SPD'].includes(key)) {
                  value = Math.floor(value);
                }
                if (
                  [
                    'CR',
                    'CD',
                    'E_RES',
                    'BE',
                    'ER',
                    'EHR',
                    'PhysicalDMG',
                    'FireDMG',
                    'IceDMG',
                    'WindDMG',
                    'LightningDMG',
                    'ImaginaryDMG',
                    'QuantumDMG',
                  ].includes(key)
                ) {
                  switch (key) {
                    case 'CR':
                      key = 'CRIT Rate';
                      break;
                    case 'CD':
                      key = 'CRIT DMG';
                      break;
                    case 'E_RES':
                      key = 'Effect RES';
                      break;
                    case 'BE':
                      key = 'Break Effect';
                      break;
                    case 'ER':
                      key = 'Energy Regen';
                      break;
                    case 'EHR':
                      key = 'Effect Hit Rate';
                      break;
                    // case key has DMG in it, then add "Boost" to the end
                    default:
                      key = key + ' Boost';
                      break;
                  }
                  value = Math.floor(value * 100) + '%';
                }
                return `${key}: ${value}`;
              })
              .join('\n'),
          },
        ],
        footer: {
          text: `UID: ${user.hsrID}`,
        },
      };
      await selectCtx.send({ embeds: [embed] });
    });
    //   } catch (error) {
    //     console.log(error);
    //     await ctx.send(`⚠️ Error!`);
    //   }
  }
}

// function formatStats(stats) {
//   let result = '';
//   keys.forEach((key, index) => {
//     if (index < 4) {
//       result += `${key}: ${stats[key]}, `;
//       if (index === 3) {
//         result = result.slice(0, -2) + '\n'; // Remove last comma and add newline
//       }
//     } else if (index >= 4 && index < 6) {
//       result += `${key}: ${stats[key]}, `;
//       if (index === 5) {
//         result = result.slice(0, -2) + '\n'; // Remove last comma and add newline
//       }
//     } else {
//       result += `${key}: ${stats[key]}\n`;
//     }
//   });
//   return result.trim(); // Remove the last newline
// }
