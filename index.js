const { init } = require('zalojs');

const Client = require('zalojs').default;
const fs = require('fs');
const path = require('path');
require('dotenv').config()

const prefix = '!';

(async () => {
  const { browser, page } = await init({
    groupName: process.env.GROUP_NAME,
    groupID: process.env.GROUP_ID,
    headless: false,
  });

  const client = new Client(page);
  const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

  client.on("message", (message) => {
    message.forEach( async (element) => {
          if (!element.content) return;
          if (!element.content.startsWith(prefix)) return;
          const args = element.content.slice(prefix.length).trim().split(/ +/);
          const commandName = args.shift().toLowerCase();
          const commandFile = commandFiles.find(
            (file) => file.split(".").shift() === commandName,
          );
          if (!commandFile) return;
          const command = require(path.join(__dirname, "commands", commandFile));
          try {
            await command(element, client, args);
          } catch (error) {
            console.log(error);
            await client.send({ message: "There was an error executing the command." });
          }
    });
  });

  client.once('ready', () => {
    console.log(`Bot is ready! ${client.user.name}`);
  });
})();
