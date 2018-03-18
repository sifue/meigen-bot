'use strict';

const Meigen = require('../models/meigen');
const loader = require('../models/sequelizeLoader');

Meigen.sync();

module.exports = robot => {
  // ヘルプ表示
  robot.hear(/名言botの使い方/i, msg => {
    msg.send(
      '名言を言ってくれるボット。' +
      '「〇〇曰く」というと反応する。' +
      '「覚えて 〇〇 内容」で覚え、「忘れて 〇〇 内容」で忘れる。' +
      '複数登録するとランダムに表示される。'
    );
  });

  // 発言
  robot.hear(/^([^ ]+)曰く$/i, msg => {
    const teller = msg.match[1];
    Meigen.findAll({
      where: {
        teller
      }
    }).then(meigens => {
      const meigen = meigens[Math.floor(Math.random() * meigens.length)];
      msg.send(
        `${teller}曰く、${meigen.content}`
      );
    });
  });

  // 登録
  robot.hear(/^覚えて/i, msg => {
    const message = msg.message;
    const parsed = message.text.match(/^覚えて ([^ ]+) (.+)$/);

    if (!parsed) {
      msg.send(
        '形式が、 `覚えて 〇〇 内容` ではありません。'
      );
    }

    const teller = parsed[1];
    const content = parsed[2];

    const user = message.user;
    const userId = user.id;
    const userName = user.name;
    const roomId = user.room;
    const isDeleted = false;

    Meigen.create({
      teller,
      content,
      userId,
      userName,
      roomId,
      isDeleted
    }).then(marketitem => {
      msg.send(
        `覚えました。 「${teller}曰く、${content}」`
      );
    });

  });

  // 削除
  robot.hear(/^忘れて/i, msg => {
    const message = msg.message;
    const parsed = message.text.match(/^忘れて ([^ ]+) (.+)$/);

    if (!parsed) {
      msg.send(
        '形式が、 `忘れて 〇〇 内容` ではありません。'
      );
    }

    const teller = parsed[1];
    const content = parsed[2];

    const user = message.user;
    const userId = user.id;
    const userName = user.name;
    const roomId = user.room;
    const isDeleted = true;

    Meigen.update({
      userId,
      userName,
      roomId,
      isDeleted
    },
      {
        where: {
          teller,
          content
        }
      }).then(deletedIds => {
        if (deletedIds) {
          msg.send(
            `忘れました。 「${teller}曰く、${content}」`
          );
        } else {
          msg.send(
            '元々覚えていませんでした。'
          );
        }
      });
  });
};