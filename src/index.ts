import * as discord from 'discord.js';
import * as dotenv from 'dotenv';
import { addInvite, deleteInvite, getInvitesFromServer } from './models/Invite';
import { addServer, editLogsChannelOnServer } from './models/Server';

dotenv.config();
const inviteManager = new discord.Client();

inviteManager.once('ready', () => {
  inviteManager.user?.setActivity(`les raiders`, {
    type: 'WATCHING',
  });
});

inviteManager.on('inviteCreate', ({ guild, code, uses }) => {
  addInvite({
    serverId: guild?.id!,
    code,
    uses: uses ?? 0
  });
});

inviteManager.on('inviteDelete', ({ code }) => {
  deleteInvite(code);
});

inviteManager.on('guildMemberAdd', member => {
  const invites = getInvitesFromServer(member.guild.id);
});

inviteManager.on('message', msg => {
  if (!msg.guild) return;

  if (msg.member?.hasPermission('ADMINISTRATOR')) {
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

inviteManager.login(process.env.TOKEN);
