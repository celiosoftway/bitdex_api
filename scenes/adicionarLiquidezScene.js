const { Scenes } = require("telegraf");
const { AddLiquidez } = require("../contrato"); // importa a função

const adicionaliquidezScene = new Scenes.WizardScene(
  "adicionaliquidezScene",
  async (ctx) => {
    await ctx.reply("💵 Envie o valor (em USDT) que deseja adicionar:");
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
      const tx = await AddLiquidez(valor); // chama a função com o valor digitado
      await ctx.reply(`✅ ${valor} USDT adicionados com sucesso à pool!`);
      await ctx.reply(`🔗 Ver Transação \n\n${tx}`);
    } catch (error) {
      await ctx.reply("❌ Erro ao adicionar liquidez. Verifique o console.");
    }

    return ctx.scene.leave();
  }
);

module.exports = adicionaliquidezScene;
