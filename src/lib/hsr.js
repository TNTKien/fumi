import {
  baseHsrAPI,
  baseHsrUI,
  hsrAvtJSON,
  hsrCharJSON,
  hsrHashJSON,
  hsrWeaponJSON,
  metaJsonUrl,
  skillTreeURL,
} from '../../config';

class characterStats {
  HPAddedRatio = 0;
  AttackAddedRatio = 0;
  DefenceAddedRatio = 0;
  SpeedDelta = 0;
  CriticalChance = 0;
  CriticalDamage = 0;
  BreakDamageAddedRatio = 0;
  SPRatioBase = 0;
  StatusProbability = 0;
  HealRatioBase = 0;
  StatusResistance = 0;
  PhysicalAddedRatio = 0;
  FireAddedRatio = 0;
  IceAddedRatio = 0;
  WindAddedRatio = 0;
  LightningAddedRatio = 0;
  QuantumAddedRatio = 0;
  ImaginaryAddedRatio = 0;
  HPDelta = 0;
  AttackDelta = 0;
  DefenceDelta = 0;
  CriticalDamageBase = 0;
  CriticalChanceBase = 0;
  StatusProbabilityBase = 0;
  BreakDamageAddedRatioBase = 0;
  StatusResistanceBase = 0;
  SpeedAddedRatio = 0;
  HPDeltaRelic = 0;
  AttackDeltaRelic = 0;
  DefenceDeltaRelic = 0;
  SpeedDeltaRelic = 0;
}
class characterStatsF {
  HP = 0;
  ATK = 0;
  DEF = 0;
  SPD = 0;
  CR = 0.05;
  CD = 0.5;
  BE = 0;
  ER = 1;
  EHR = 0;
  HB = 0;
  E_RES = 0;
  PhysicalDMG = 0;
  FireDMG = 0;
  IceDMG = 0;
  WindDMG = 0;
  LightningDMG = 0;
  QuantumDMG = 0;
  ImaginaryDMG = 0;
}
var list = [];

export const getData = async (url) => {
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
  return { status: 200, message: 'Success', data: data };
};

export const HsrPlayer = async (id) => {
  const url = baseHsrAPI + `/uid/` + id;
  // const res = await fetch(url, {
  //   headers: {
  //     'User-Agent': 'enkanetwork.js/v2.8.1',
  //   },
  // });

  // const status = res.status;
  // if (status !== 200) {
  //   // Handle error statuses
  //   const errorMessage =
  //     {
  //       400: 'Wrong UID format',
  //       404: 'Player does not exist',
  //       424: 'Game maintenance',
  //       429: 'Rate-limited',
  //       500: 'Internal server error',
  //       503: 'Service unavailable',
  //       403: 'Forbidden',
  //     }[status] || 'Unknown Error';
  //   return { status: status, message: errorMessage, data: null };
  // }
  // const data = await res.json();
  const { status, message, data } = await getData(url);
  if (status !== 200) return { status, message, data };

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

  const { status, message, data } = await getData(url);
  if (status !== 200) return { status, message, data };

  const characterLists = data.detailInfo.avatarDetailList;
  const userJson = data;

  const hsrHashName = await fetch(hsrHashJSON).then((res) => res.json());
  const hsrChars = await fetch(hsrCharJSON).then((res) => res.json());
  const hsrWeapon = await fetch(hsrWeaponJSON).then((res) => res.json());

  const userChars = [];
  for (const char of characterLists) {
    const charHashName = hsrChars[char.avatarId].AvatarName.Hash;
    const charName = hsrHashName['en'][charHashName];

    const charImgPath = hsrChars[char.avatarId]['AvatarCutinFrontImgPath'];

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
      stats: null,
    });
  }
  const charStats = await Stats(userJson);
  //put stats into userChars
  for (let i = 0; i < 8; i++) {
    userChars[i].stats = charStats[i];
  }
  console.log(userChars);

  return { status: 200, message: 'Success', data: userChars };
};

async function Stats(userJson) {
  // let userJson = await getData(url + id);
  let metaJson = await fetch(metaJsonUrl).then((res) => res.json());
  let skillTreeJson = await fetch(skillTreeURL).then((res) => res.json());

  var fnList = [];
  for (let i = 0; i < 8; i++) {
    list.push(new characterStats());
    fnList.push(new characterStatsF());
  }
  await relicStats(metaJson, userJson);
  await lightConeStats(metaJson, userJson);
  await skillTreeStats(skillTreeJson, userJson);
  await baseStats(metaJson, userJson);

  for (let i = 0; i < 8; i++) {
    fnList[i].HP =
      list[i].HPDelta * (1 + list[i].HPAddedRatio) + list[i].HPDeltaRelic;
    fnList[i].ATK =
      list[i].AttackDelta * (1 + list[i].AttackAddedRatio) +
      list[i].AttackDeltaRelic;
    fnList[i].DEF =
      list[i].DefenceDelta * (1 + list[i].DefenceAddedRatio) +
      list[i].DefenceDeltaRelic;
    fnList[i].SPD =
      list[i].SpeedDelta * (1 + list[i].SpeedAddedRatio) +
      list[i].SpeedDeltaRelic;
    fnList[i].CR += list[i].CriticalChance + list[i].CriticalChanceBase;
    fnList[i].CD += list[i].CriticalDamage + list[i].CriticalDamageBase;
    fnList[i].BE =
      list[i].BreakDamageAddedRatio + list[i].BreakDamageAddedRatioBase;
    fnList[i].ER += list[i].SPRatioBase;
    fnList[i].EHR = list[i].StatusProbability + list[i].StatusProbabilityBase;
    fnList[i].E_RES = list[i].StatusResistance + list[i].StatusResistanceBase;
    fnList[i].HB = list[i].HealRatioBase;

    fnList[i].PhysicalDMG = list[i].PhysicalAddedRatio;
    fnList[i].FireDMG = list[i].FireAddedRatio;
    fnList[i].WindDMG = list[i].WindAddedRatio;
    fnList[i].IceDMG = list[i].IceAddedRatio;
    fnList[i].LightningDMG = list[i].LightningAddedRatio;
    fnList[i].QuantumDMG = list[i].QuantumAddedRatio;
    fnList[i].ImaginaryDMG = list[i].ImaginaryAddedRatio;
  }

  return fnList;
}

async function relicStats(metaJson, userJson) {
  userJson.detailInfo.avatarDetailList.forEach((e, i) => {
    var index = i;
    var setRelicId = [];
    if (!e.relicList) return;
    e.relicList.forEach((e, k) => {
      setRelicId.push(e._flat.setID);
      for (let j = 0; j < e._flat.props.length; j++) {
        let type = e._flat.props[j].type;
        if (type.includes('Delta')) type += 'Relic';
        let value = e._flat.props[j].value;
        list[index][type] += value;
      }
    });
    setRelicId.sort();
    let count = {};

    setRelicId.forEach((item) => {
      count[item] = (count[item] || 0) + 1;
    });

    let duplicates = Object.keys(count).filter((key) => count[key] > 1);

    duplicates.forEach((item) => {
      if (count[item] == 2 || count[item] == 4) {
        //item = id
        let keys = Object.keys(metaJson.relic.setSkill[item][2].props);
        if (!keys) return;
        list[index][keys] += metaJson.relic.setSkill[item][2].props[keys];
      }
    });
    delete list[index][''];
  });
}

async function lightConeStats(metaJson, userJson) {
  userJson.detailInfo.avatarDetailList.forEach((e, i) => {
    var index = i;
    if (!e.equipment) return;

    let id = e.equipment.tid;
    let rank = e.equipment.rank;
    if (!metaJson.equipmentSkill || !metaJson.equipmentSkill[id]) return;

    Object.keys(metaJson.equipmentSkill[id][rank].props).forEach((el, i) => {
      var value = metaJson.equipmentSkill[id][rank].props[el];
      if (!el || !value) return;
      if (el == 'AllDamageTypeAddedRatio') {
        list[index].PhysicalAddedRatio += value;
        list[index].FireAddedRatio += value;
        list[index].WindAddedRatio += value;
        list[index].IceAddedRatio += value;
        list[index].LightningAddedRatio += value;
        list[index].QuantumAddedRatio += value;
        list[index].ImaginaryAddedRatio += value;
      }
      list[index][el] += value;
    });
    list[index].HPDelta += e.equipment._flat.props[0].value;
    list[index].AttackDelta += e.equipment._flat.props[1].value;
    list[index].DefenceDelta += e.equipment._flat.props[2].value;
  });
}
async function skillTreeStats(skillTreeJson, userJson) {
  userJson.detailInfo.avatarDetailList.forEach((e, i) => {
    var index = i;
    e.skillTreeList.forEach((e, i) => {
      if (!i || i < 8) return;
      let id = e.pointId;
      let keys = skillTreeJson['en'][id].status.PropertyType;
      let value = skillTreeJson['en'][id].status.Value;

      list[index][keys] += value;
    });
  });
}
async function baseStats(metaJson, userJson) {
  userJson.detailInfo.avatarDetailList.forEach((e, i) => {
    let id = e.avatarId;
    let level = e.level;
    let promotion = e.promotion || 0;
    //45
    list[i].HPDelta +=
      metaJson.avatar[id][promotion].HPBase +
      metaJson.avatar[id][promotion].HPAdd * (level - 1);
    list[i].AttackDelta +=
      metaJson.avatar[id][promotion].AttackBase +
      metaJson.avatar[id][promotion].AttackAdd * (level - 1);
    list[i].DefenceDelta +=
      metaJson.avatar[id][promotion].DefenceBase +
      metaJson.avatar[id][promotion].DefenceAdd * (level - 1);
    list[i].SpeedDelta += metaJson.avatar[id][promotion].SpeedBase;
  });
}

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
