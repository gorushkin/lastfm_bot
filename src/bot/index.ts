// npm install --save @types/node-telegram-bot-api

import type TelegramBot from 'node-telegram-bot-api';

enum Commands {
  SET_GOAL = 'setGoal',
}

const addRoutes = (bot: TelegramBot) => {
  void bot.setMyCommands([
    { command: Commands.SET_GOAL, description: 'Set followed username' }
  ]);

  bot.onText(/\/setGoal/, (msg) => {
    void bot.sendMessage(msg.chat.id, 'setGoal');
  });

  bot.on('message', (msg) => {
    console.log('msg: ', msg);
    void bot.sendMessage(msg.chat.id, 'test');
  });
};

export { addRoutes };
