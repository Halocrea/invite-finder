# Welcome to invite-finder 👋

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000)
[![Twitter: HaloCreation](https://img.shields.io/twitter/follow/HaloCreation.svg?style=social)](https://twitter.com/HaloCreation)

> A bot that will tell the administrators and moderators where does a new member come from

## About

This bot is here to tell you which invite has been used by a newcomer on your server.
<br/>
Basically, you only need to set the channel where you want the bot to post information about a newcomer on your server and the bot will handle the rest on his own. Here is all the information you will get from him.

![newcomer information](https://cdn.discordapp.com/attachments/718756207107637279/820350159958310912/unknown.png)

### Setup

- If you never set up a Discord bot before, please follow the instructions over [here](https://discordapp.com/developers/docs/intro).
- If you don't want to host your own version of the bot but consume an existing instance of it, you can use the following invite link: https://discord.com/api/oauth2/authorize?client_id=765327990896197642&permissions=85024&scope=bot
- Once that is done, invite the bot to your server. The bot will automatically add your server inside his database. The only thing you need to do is to run `!gm-set-logs-channel` where you want him to send messages, so basically the channel where you store logs.

### Commands

**Notice:** You must be an Administrator of your server or the maintainer of the bot instance to run these commands.

- `!gm-set-logs-channel`: Use this command to tell the bot to post his messages inside the channel where you run this command
- `!gm-invites-sync`: Use this command to synchronize the invites of your server with the ones in the bot database. But everything is synchronize automatically right now so you basically won't need to run it

### Permissions required

In order to work properly, this bot will need this set of permissions globally:

- Manage Server
- View Channels
- Send Messages
- Embed Links
- Read Message History

## Install

### Create `.env` file and fill it with your information

```sh
cp sample.env .env
```

### Install and run with Docker

```sh
docker build -t invite-finder .
docker run -d -v /absolute/host/path/to/saves/:app/saves --restart=always --name=invite-finder invite-finder
```

### Install with npm

#### Setup

```sh
npm install
```

#### Run development

```sh
npm run dev
```

#### Build

```sh
npm run build
```

#### Run build

```sh
npm start
```

## Author

👤 **Grenadator**

- Twitter: [@\_Grenadator](https://twitter.com/_Grenadator)
- Github: [@Grenadator](https://github.com/Grenadator)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/Halocrea/invite-finder/issues).

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
