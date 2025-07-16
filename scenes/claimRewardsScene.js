const { Scenes } = require("telegraf");
const { claimRewards } = require("../tokenminer"); // importa a função

const claimRewardsScene = new Scenes.WizardScene(
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

module.exports = claimRewardsScene;