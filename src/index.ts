import * as discord from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();
const inviteManager = new discord.Client();

inviteManager.once('ready', () => {
  console.log(`I'm alive`);
});

inviteManager.login(process.env.TOKEN);
