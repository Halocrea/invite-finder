import * as discord from 'discord.js';
import * as dotenv from 'dotenv';
import { addInvite, deleteInvite, editInviteUses, getInvitesFromServer } from './models/Invite';
import { addServer, editLogsChannelOnServer, getServer } from './models/Server';

dotenv.config();
const inviteFinder = new discord.Client();

inviteFinder.once('ready', () => {
  inviteFinder.user?.setActivity(`les raiders`, {
    type: 'WATCHING',
  });
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

inviteFinder.on('guildMemberAdd', member => {
  const invites = getInvitesFromServer(member.guild.id);
  member.guild
    .fetchInvites()
    .then((serverInvites) => {
      let updatedInvite: discord.Invite;
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
          const { logsChannelId } = getServer(member.guild.id);
          const logsChannel = member.guild.channels.resolve(logsChannelId);
          if (logsChannel && logsChannel instanceof discord.TextChannel) {
            logsChannel.send(`${updatedInvite.code}`);
          }
        }
      });
    })
    .catch(console.error);
});

inviteFinder.on('message', msg => {
  if (!msg.guild) return;

  if (msg.member?.hasPermission('ADMINISTRATOR') || msg.author.id === process.env.MAINTAINER_ID) {
    if (msg.content.startsWith('!gm-invites-sync')) {
      msg.guild
        .fetchInvites()
        .then((invites) => {
          invites.forEach(({ code, uses }) => {
            addInvite({
              serverId: msg.guild?.id!,
              code,
              uses: uses ?? 0,
            });
          });
        })
        .catch(console.error);
      msg.channel.send(`✅ Invites successfully synchronised!`);
    } else if (msg.content.startsWith('!gm-set-server')) {
      addServer(msg.guild.id);
      msg.channel.send(`✅ Server successfully added!`);
    } else if (msg.content.startsWith('!gm-set-logs-channel')) {
      editLogsChannelOnServer({
        serverId: msg.guild.id,
        logsChannelId: msg.channel.id
      });
      msg.channel.send(`✅ Logs channel successfully added!`);
    }
  }  
})

inviteFinder.login(process.env.TOKEN);
