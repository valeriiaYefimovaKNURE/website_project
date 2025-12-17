const TelegarmBot = require('node-telegram-bot-api');

const bot=new TelegarmBot(process.env.TELEGRAM_BOT_TOKEN);
const chatId=process.env.TELEGRAM_CHAT_ID;

async function sendTelegramNewPost({title, shortText, postUrl, imageUri}) {

    const message=`
Викладена нова новина: 

*${title}*

${shortText}

👉 [Дивіться фото повністю](${imageUri})
`;

    if (imageUri) {
        await bot.sendPhoto(chatId, imageUri, {
          caption:message,
          parse_mode: "Markdown"
        });
    } else {
        await bot.sendMessage(chatId, message, {
          parse_mode: "Markdown",
          disable_web_page_preview: false,
        });
  }

    console.log("Повідомлення в Telegram надіслано.");
}

module.exports={sendTelegramNewPost};