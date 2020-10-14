import * as discord from 'discord.js';
import * as dotenv from 'dotenv';
import { addInvite, deleteInvite, getInvites } from './models/Invite';

dotenv.config();
const inviteManager = new discord.Client();

inviteManager.once('ready', () => {
  inviteManager.user?.setActivity(`les raiders`, {
    type: 'WATCHING',
  });
});

inviteManager.on('inviteCreate', ({ code, uses }) => {
  addInvite({
    code,
    uses: uses ?? 0
  });
});

inviteManager.on('inviteDelete', ({ code }) => {
  deleteInvite(code);
});

inviteManager.on('guildMemberAdd', member => {
  console.log(member);
});

inviteManager.on('message', msg => {
  if (!msg.guild) return;

  if (msg.content.startsWith('!gm-sync') && msg.member?.hasPermission('ADMINISTRATOR')) {
    msg.guild.fetchInvites()
      .then(invites => {
        invites.forEach(({ code, uses }) => {
          addInvite({
            code,
            uses: uses ?? 0
          })
        });
      })
      .catch(console.error);
  }
})

inviteManager.login(process.env.TOKEN);
