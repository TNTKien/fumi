import { baseAPI, baseImgURL } from '../../config';

export const getUser = async (id, env) => {
  const response = await fetch(`${baseAPI}/users/${id}`, {
    headers: {
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
    },
  });
  return response.json();
};

export const getMember = async (guildId, userId, env) => {
  const response = await fetch(
    `${baseAPI}/guilds/${guildId}/members/${userId}`,
    {
      headers: {
        Authorization: `Bot ${env.DISCORD_TOKEN}`,
      },
    },
  );
  return response.json();
};

export const getUserAvatar = async (id, env) => {
  const user = await getUser(id, env);
  const avatarURL = `${baseImgURL}/avatars/${id}/${user.avatar}${user.avatar.startsWith('a_') ? '.gif' : '.png'}?size=2048`;
  return avatarURL;
};

export const getMemberAvatar = async (guildId, userId, env) => {
  const member = await getMember(guildId, userId, env);
  const user = member.user;

  const userAvatarURL = `${baseImgURL}/avatars/${user.id}/${user.avatar}${user.avatar.startsWith('a_') ? '.gif' : '.png'}?size=2048`;

  const memberAvatarHash = member.avatar;
  if (!memberAvatarHash) {
    return { userAvatarURL, memberAvatarURL: null };
  }
  const memberAvatarURL = `${baseImgURL}/guilds/${guildId}/users/${userId}/avatars/${memberAvatarHash}${memberAvatarHash.startsWith('a_') ? '.gif' : '.png'}?size=2048`;

  return { userAvatarURL, memberAvatarURL };
};

export const getUserBanner = async (id, env) => {
  const user = await getUser(id, env);
  if (!user.banner) {
    return null;
  }
  const bannerURL = `${baseImgURL}/banners/${id}/${user.banner}${user.banner.startsWith('a_') ? '.gif' : '.png'}?size=2048`;
  return bannerURL;
};

export const getMemberBanner = async (guildId, userId, env) => {
  const member = await getMember(guildId, userId, env);
  if (!member.banner) {
    return null;
  }
  const memberBannerURL = `${baseImgURL}/guilds/${guildId}/users/${userId}/banners/${member.banner}${member.banner.startsWith('a_') ? '.gif' : '.png'}?size=2048`;
  return memberBannerURL;
};
