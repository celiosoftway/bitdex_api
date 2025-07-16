const { Scenes } = require("telegraf");
const { checkMinerStatus } = require("../tokenminer"); // importa a função

const minerStatusScene = new Scenes.WizardScene(
  "removeliquidezScene",
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

module.exports = minerStatusScene;