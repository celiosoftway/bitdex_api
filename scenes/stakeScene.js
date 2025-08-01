const { Scenes } = require("telegraf");
const { stakeBITUSDT } = require("../tokenminer"); // importa a função

const stakeScene = new Scenes.WizardScene(
  "stakeScene",
  async (ctx) => {
    await ctx.reply("💵 Fale algo");
    return ctx.wizard.next();
  },
  async (ctx) => {
    const valor = ctx.message?.text;
    await ctx.reply(valor);
    return ctx.scene.leave();
  }
);

module.exports = stakeScene;