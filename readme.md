## Intro
This is a discord bot which which
- Listens to one command. A channel name to be exact. For example `!join-channel-1` where `!join-` invokes the bot and `channel-1` is the channel name.
- Verifies the command from google sheet.
- DM's the person giving the command if command is valid.
- Takes email in the DM and verifies from Google Sheet.
- If registered email provided then assigns a role to the user or responses accordingly.
- Welcomes the user in the new channel.


## Prerequisites
This is created using [discord.js](https://discord.js.org) module. Version 13 is used for this. Other requirements are as below.
- Discord developer application: Create a new application and setup [Discord Applications](https://discord.com/developers/applications),
- Google service account key: Setup in [Google Developer Console](https://console.developers.google.com/)
- Node.js development environment.
- A discord channel with the highest permissions, better to create a new one.
## Installation
Clone the repository from `https://github.com/Khairulbashar010/discordBot.git` and change directory to './discordBot'.
**I have nodemon globally installed. I suggest you to set it up first using
`npm i -g nodemon`. You can also install it locally.**
Then run the following commands.
- `npm install`
- Copy the .env.example file and rename it to .env
- Enter `BOT_TOKEN` in env from [Discord Applications](https://discord.com/developers/applications).
- Create a blank sheet in [Google Sheets](https://docs.google.com/spreadsheets).
- Open the spreadsheet and copy the sheetId from the url. It starts after /d and ends before /edit. Put it in the env file as `SHEETID`.
- Create a new app in [Google Developer Console](https://console.developers.google.com/) Setup a new Service User and generate a key. Download the json file and put in the root directory. **Do not share this with anyone**. Put the path to that file in the env as`SERVICEACCOUNTKEY`.
- **Open the .xlsx file and create two sheets like in your own Google Sheet. Then copy the rows from the one in your root directory.**
- Put any thing in the `PREFIX` variable. **This will invoke the bot to listen for commands**
- Specify the bot channel name in `BOTCHANNEL`. **This channel must exist in your server**

Read further below if some of this doesn't make sense.


## Setup discord server and add bot
**Setup discord server**
- Download discord from [download](https://discord.com/download).
- Signup if you haven't already and login. Make sure to verify your email.
- Create a new server.
- Create a new text channel.
- Click on the server name and go to server settings.
- Click roles and create a new role named `BOT`, on top of the `@everyone` role. Make sure to give permissions to this Audio permissions won't be necessary but everything related to **Role, Channel and User** is important.
- Create a new role naming same as the new channel created earlier.
- Assign some permissions.

**Add bot to server**
- Go to [Discord Applications](https://discord.com/developers/applications)
- Create a new app and click on the application.
- Go to OAuth2 and click on "URL Generator"
- Select bot and scroll down to get the url. Go to that url and authorize the bot to your server.
- Come back to the server and assign the `BOT` role to the bot.

Invite another account on the server to test out stuff. You can create another account or get a friend to help out.

## Setting the spreadsheet accordingly
The .xlsx in the repository is only a template. It can be deleted if the google sheet setup is complete.
I'll describe the google sheet here.
Open the second sheet. The `Clan` column contains the commands that the bot will validate. The `RoleId` and `ChannelId` respectively stands for the role we want user assign to and the channel it represents. The `Enabled/Disabled` column stands for if the command is active or not. Values of this column should be `TRUE or FALSE`. Anything except the string 'TRUE' will be counted as 'FALSE'.
The first tab can be called as the member's tab. It will contain all the `Email` of the users we allow in the server. The bot will assign a role and add them to a channel if they are validated and update the `RoleId` and `ChannelId` column here. A user can only be in one channel.

## Running the bot

Open a console in the root directory and run `npm run dev` or `npm run start`