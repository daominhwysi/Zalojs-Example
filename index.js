const { init } = require('zalojs');
const config = require('./config.json');
const Client = require('zalojs').default;
const fs = require('fs');
const path = require('path');

const prefix = '!';

(async () => {
  const { browser, page } = await init({
    groupName: config.gname,
    groupSelector: config.gselector,
    headless: config.headless,
  });

  const client = new Client(page);
  const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

  client.on('message', (message) => {
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const commandFile = commandFiles.find(file => file.split('.').shift() === commandName);
    if (!commandFile) return;

    const command = require(path.join(__dirname, 'commands', commandFile));
    try {
      command(message, client, args);
    } catch (error) {
      console.log(error);
      message.author.reply('There was an error executing the command.');
    }
  });

  client.once('ready', (user) => {
    console.log('Bot is ready!');
  });
})();
