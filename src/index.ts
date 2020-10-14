import * as discord from 'discord.js';
import * as dotenv from 'dotenv';
import { addInvite, deleteInvite } from './models/Invite';

dotenv.config();
const inviteManager = new discord.Client();

inviteManager.once('ready', () => {
  inviteManager.user?.setActivity(`les raiders`, {
    type: 'WATCHING',
  });
});

inviteManager.on('inviteCreate', invite => {
  addInvite({
    inviteCode: invite.code,
    uses: invite.uses ? invite.uses : 0
  });
});

inviteManager.on('inviteDelete', invite => {
  deleteInvite(invite.code);
});

inviteManager.on('guildMemberAdd', member => {
  console.log(member);
});

inviteManager.login(process.env.TOKEN);
