// removeliquidezScene

const { Scenes } = require("telegraf");
const { removeLiquidez } = require("../contrato"); // importa a função

const removeliquidezScene = new Scenes.WizardScene(
  "removeliquidezScene",
  async (ctx) => {
    await ctx.reply("💵 Envie o valor (em USDT) que deseja remover:");
    return ctx.wizard.next();
  },
  async (ctx) => {
    const valor = ctx.message?.text;
    
    // Validação simples
    if (!valor || isNaN(valor)) {
      await ctx.reply("❌ Valor inválido. Envie um número, ex: 10");
      return ctx.wizard.selectStep(1);
    }

    try {
      await ctx.reply("⏳ Processando transação...");
      const tx = await removeLiquidez(valor); // chama a função com o valor digitado
      await ctx.reply(`✅ ${valor} USDT removido com sucesso à pool!`);
      await ctx.reply(`🔗 Ver Transação \n\n${tx}`);
    } catch (error) {
      await ctx.reply("❌ Erro ao remover liquidez. Verifique o console.");
    }

    return ctx.scene.leave();
  }
);

module.exports = removeliquidezScene;
