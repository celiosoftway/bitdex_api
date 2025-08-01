const { Scenes } = require("telegraf");
const { withdrawStake } = require("../tokenminer"); // importa a função

const withdrawScene = new Scenes.WizardScene(
  "withdrawScene",
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

module.exports = withdrawScene;