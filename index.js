const uid = require("uuid");

const fs = require("fs/promises");
const Discord = require("discord.js");
var Datastore = require("nedb");

const PREFIX = ".";
const db = new Datastore({ filename: "msg_db", autoload: true });
db.ensureIndex({ fieldName: "key", unique: true }, function (err) {
  if (err) console.log(`Encountered error in ensureindex: ${err}`);
});

async function init() {
  const client = new Discord.Client();

  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on("message", async (msg) => {
    let vaffanculo = msg.guild?.members.resolve("132794741480751104");
    if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;
    const args = msg.content.slice(PREFIX.length).trim().split("\n");
    const command = args.shift().toLowerCase();
    if (command === "quote") {
      if (!msg.mentions.users.first() || args.length != 3) {
        msg.reply(
          "The syntax is wrong. Why are you so gay? I literally only know 1 command, and you couldn't even remember that. Please KYS. Here is the actual syntax if you're still interested.\n```\n.quote\n<mention of the quoter>\n<the quote itself>\n<date separated by spaces>```"
        );
        return;
      }
      msg.delete();

      let quoted = msg.mentions.users.first();
      let embed = new Discord.MessageEmbed()
        .setAuthor(quoted.username, quoted.displayAvatarURL)
        .setColor(0xffff00)
        .setDescription(args[1])
        .setFooter(
          new Date(args[2]).toLocaleDateString("hu"),
          quoted.displayAvatarURL()
        );
      let sentEmbed = await msg.channel.send(embed);
      let uuid = uid.v4().slice(4);
      setMessage(uuid, sentEmbed);
    }
    if (command === "delete") {
      msg.channel.messages.fetch();
    }
  });
  let token = await fs.readFile("token", "utf8");
  client.login(token);
}
init();

function getMessage() {
  if (!doc)
    db.insert({ key: key, value: value }, (err, newDoc) => {
      console.log(`Inserted the following: ${newDoc}`);
    });
  else db.update({ key: key }, { key: key, value: value });
}

function setMessage(key, value) {
  db.findOne({ key: key }, (err, doc) => {
    if (!doc)
      db.insert({ key: key, value: value }, (err, newDoc) => {
        console.log(`Inserted the following: ${newDoc}`);
      });
    else db.update({ key: key }, { key: key, value: value });
  });
}

function deleteMessage() {
  db.update({ key: key }, "$unset");
}
