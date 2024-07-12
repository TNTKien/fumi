import { baseHsrAPI, baseHsrUI, hsrAvtJSON } from '../../config';

export const HsrPlayer = async (id) => {
  const url = baseHsrAPI + `/uid/` + id;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'enkanetwork.js/v2.8.1',
    },
  });

  const status = res.status;
  if (status !== 200) {
    // Handle error statuses
    const errorMessage =
      {
        400: 'Wrong UID format',
        404: 'Player does not exist',
        424: 'Game maintenance',
        429: 'Rate-limited',
        500: 'Internal server error',
        503: 'Service unavailable',
        403: 'Forbidden',
      }[status] || 'Unknown Error';
    return { status: status, message: errorMessage, data: null };
  }
  const data = await res.json();

  const hsrAvatars = await fetch(hsrAvtJSON).then((res) => res.json());
  const iconPath = hsrAvatars[data.detailInfo.headIcon].Icon;

  const playerinfo = {
    uid: data.detailInfo.uid,
    nickname: data.detailInfo.nickname,
    signature: data.detailInfo.signature,
    headIcon: baseHsrUI + iconPath,
    level: data.detailInfo.level,
    worldLevel: data.detailInfo.worldLevel,
    friendCount: data.detailInfo.friendCount,
  };
  console.log(playerinfo);
  return { status: 200, message: 'Success', data: playerinfo };
};

export const HsrCharacter = async (id) => {
  const url = baseHsrAPI + `/uid/` + id;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'enkanetwork.js/v2.8.1',
    },
  });

  const status = res.status;
  if (status !== 200) {
    const errorMessage =
      {
        400: 'Wrong UID format',
        404: 'Player does not exist',
        424: 'Game maintenance',
        429: 'Rate-limited',
        500: 'Internal server error',
        503: 'Service unavailable',
        403: 'Forbidden',
      }[status] || 'Unknown Error';
    return { status: status, message: errorMessage, data: null };
  }
  const data = await res.json();
  const characterLists = data.detailInfo.avatarDetailList;
  return { status: 200, message: 'Success', data: characterLists };
};

// Sample data
// {
//     detailInfo: {
//       uid: 801111734,
//       nickname: 'IAMNEYK',
//       signature: 'xin chao và dit me ban',
//       headIcon: 202017,
//       level: 70,
//       isDisplayAvatar: true,
//       worldLevel: 6,
//       friendCount: 28,
//       platform: 'PC',
//       recordInfo: {
//         achievementCount: 571,
//         avatarCount: 36,
//         equipmentCount: 72,
//         maxRogueChallengeScore: 9,
//         challengeInfo: {},
//         bookCount: 173,
//         relicCount: 353,
//         musicCount: 95
//       },
//       privacySettingInfo: {
//         displayOnlineStatus: true,
//         displayDiary: true,
//         displayCollection: true,
//         displayRecord: true,
//         displayRecordTeam: true,
//         displayRecordType: 'BATTLE_RECORD_CHALLENGE'
//       },
//       avatarDetailList: [
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object]
//       ]
//     },
//     ttl: 47,
//     uid: '801111734'
//   }
