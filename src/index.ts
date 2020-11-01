import * as discord from 'discord.js';
import * as dotenv from 'dotenv';
import { addInvite, deleteAllInvitesFromServer, deleteInvite, editInviteUses, getInvitesFromServer } from './models/Invite';
import { addServer, deleteServer, editLogsChannelOnServer, getServer, getServers } from './models/Server';

dotenv.config();
const inviteFinder = new discord.Client();

inviteFinder.once('ready', () => {
  inviteFinder.user?.setActivity(`les raiders`, {
    type: 'WATCHING',
  });
  const servers = getServers();
  for (const server of servers) {
    synchronizeInvitesOnServer(server.serverId);
  }
});

inviteFinder.on('inviteCreate', ({ guild, code, uses }) => {
  addInvite({
    serverId: guild?.id!,
    code,
    uses: uses ?? 0
  });
});

inviteFinder.on('inviteDelete', ({ code }) => {
  deleteInvite(code);
});

inviteFinder.on('guildCreate', guild => {
  addServer(guild.id);
  synchronizeInvitesOnServer(guild.id);
});

inviteFinder.on('guildDelete', guild => {
  deleteServer(guild.id);
  deleteAllInvitesFromServer(guild.id);
})

inviteFinder.on('guildMemberAdd', member => {
  synchronizeInvitesOnServer(member.guild.id);
  const invites = getInvitesFromServer(member.guild.id);
  const now = new Date();
  const memberLifetime = new Date(now.getTime() - member.user?.createdTimestamp!);
  const yearLifetime = Math.round(
    (now.getTime() - member.user?.createdTimestamp!) / 31536000000
  );
  // Because he won't detect the null with a ternary
  const avatar =
    typeof member.user?.avatarURL() === 'string'
      ? member.user?.avatarURL()
      : member.user?.defaultAvatarURL;
  member.guild
    .fetchInvites()
    .then((serverInvites) => {
      let updatedInvite: discord.Invite | null = null;
        const { logsChannelId } = getServer(member.guild.id);
        const logsChannel = member.guild.channels.resolve(logsChannelId);
      // We go through every server invites and compare with his stored clone
      serverInvites.forEach((serverInvite) => {
        const storedInvite = invites.find((invite) => invite.code === serverInvite.code);
        if (storedInvite && serverInvite && storedInvite.uses < serverInvite.uses!) {
          // We save the good invite
          updatedInvite = serverInvite;
          // We store the update in DB
          editInviteUses({
            serverId: member.guild.id,
            code: updatedInvite.code,
            uses: updatedInvite.uses!
          })
          if (logsChannel && logsChannel instanceof discord.TextChannel) {
            logsChannel.send({
              embed: {
                title: `Member joined!`,
                description: `User: ${
                  member.user
                } | Created: ${yearLifetime}y, ${memberLifetime.getMonth()}m, ${memberLifetime.getDay()}d, ${memberLifetime.getHours()}h, ${memberLifetime.getMinutes()}m, ${memberLifetime.getSeconds()}s
                Invite code: **${updatedInvite.code}** | Created by: ${updatedInvite.inviter}\n
                Total Member Count: **${member.guild.memberCount}**`,
                color: 6539563,
                author: {
                  name: `${member.user?.tag}`,
                  icon_url: `${avatar}`,
                },
                footer: {
                  text: `${now.getHours() < 10 ? '0' + now.getHours() : now.getHours()}:${
                    now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
                  }:${now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()}`,
                },
              },
            });
          }
        }
      });
      if (!updatedInvite && logsChannel && logsChannel instanceof discord.TextChannel) {
        logsChannel.send({
          embed: {
            title: `Member joined!`,
            description: `User: ${
              member.user
            } | Created: ${yearLifetime}y, ${memberLifetime.getMonth()}m, ${memberLifetime.getDay()}d, ${memberLifetime.getHours()}h, ${memberLifetime.getMinutes()}m, ${memberLifetime.getSeconds()}s
                Invite code: ¯\_(ツ)_/¯\n
                Total Member Count: **${member.guild.memberCount}**`,
            color: 6539563,
            author: {
              name: `${member.user?.tag}`,
              icon_url: `${avatar}`,
            },
            footer: {
              text: `${now.getHours() < 10 ? '0' + now.getHours() : now.getHours()}:${
                now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
              }:${now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()}`,
            },
          },
        });
      }
    })
    .catch(console.error);
});

inviteFinder.on('message', msg => {
  if (!msg.guild) return;

  if (msg.member?.hasPermission('ADMINISTRATOR') || msg.author.id === process.env.MAINTAINER_ID) {
    if (msg.content.startsWith('!gm-invites-sync')) {
      synchronizeInvitesOnServer(msg.guild.id);
      msg.channel.send(`✅ Invites successfully synchronised!`);
    } else if (msg.content.startsWith('!gm-set-logs-channel')) {
      editLogsChannelOnServer({
        serverId: msg.guild.id,
        logsChannelId: msg.channel.id
      });
      msg.channel.send(`✅ Logs channel successfully added!`);
    }
  }  
})

function synchronizeInvitesOnServer(serverId: string) {
  deleteAllInvitesFromServer(serverId);
  const guild = inviteFinder.guilds.resolve(serverId);
  if (guild) {
    guild
      .fetchInvites()
      .then((invites) => {
        invites.forEach(({ code, uses }) => {
          addInvite({
            serverId: guild.id!,
            code,
            uses: uses ?? 0,
          });
        });
      })
      .catch(console.error);
  }
}

inviteFinder.login(process.env.TOKEN);
