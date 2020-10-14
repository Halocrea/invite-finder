import * as discord from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();
const inviteManager = new discord.Client();

inviteManager.once('ready', () => {
  inviteManager.user?.setActivity(`les raiders`, {
    type: 'WATCHING',
  });
});

inviteManager.on('guildMemberAdd', member => {
  console.log(member);
});

inviteManager.login(process.env.TOKEN);
