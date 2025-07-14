require("dotenv").config();
const { Telegraf, Scenes, session,Markup  } = require("telegraf");
const adicionarLiquidezScene = require("./scenes/adicionarLiquidezScene");

const {    
    startHandler,
    infoHandler,
    addLiquidezHandler,
    removeLiquidezHandler,
    balanceHandler,
    stakeHandler,
    transacaoHandler
} = require("./handler");

const bot = new Telegraf(process.env.BOT_TOKEN);
const OWNER_ID = parseInt(process.env.OWNER_ID);

// Configurar Stage com cenas
const stage = new Scenes.Stage([adicionarLiquidezScene,]);
bot.use(session());
bot.use(stage.middleware());

// 🔒 Middleware: restringe acesso ao OWNER_ID (id do usuario do telegram)
bot.use(async (ctx, next) => {
  if (ctx.from?.id !== OWNER_ID) {
    console.log(`❌ Tentativa de acesso por ID não autorizado: ${ctx.from?.id}`);
    return ctx.reply("🚫 Acesso negado.");
  }
  return next();
});

// exibe o atalho dos comandos no Telegran
bot.telegram.setMyCommands([
  { command: 'start', description: 'inicia o teclado' },
]);

//constante para os comandos do help
const helpmessage = `
  Comandos do bot:
  /start - inicia o teclado
`;

// Comandos handlers
bot.command("info", infoHandler);
bot.command("start", addLiquidezHandler);
bot.command("start", removeLiquidezHandler);
bot.command("start", balanceHandler);
bot.command("start", stakeHandler);
bot.command("start", transacaoHandler);

// Comandos hears
bot.hears("👤 Info", infoHandler);
//bot.hears("➕ Adicionar Liquidez", addLiquidezHandler);
//bot.hears("➖ Remover Liquidez", removeLiquidezHandler);
bot.hears("🧾 Balance", balanceHandler);
bot.hears("💰 Stake", stakeHandler,);
bot.hears("🔍 Transações", transacaoHandler);


bot.hears("➕ Adicionar Liquidez", async (ctx) => {
  return ctx.reply("⚙️ Deseja adicionar liquidez no contrato?", Markup.inlineKeyboard([
    [Markup.button.callback("✅ Sim", "addLiquidezAction")],
    [Markup.button.callback("❌ Não", "cancelaAction")],
  ]));
});

//bot.action("addLiquidezAction", (ctx) => ctx.scene.enter("config-carteira"));
bot.action("addLiquidezAction", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.scene.enter("adicionaliquidezScene");
});



bot.hears("➖ Remover Liquidez", async (ctx) => {
  return ctx.reply("⚙️ Deseja remover liquidez no contrato?", Markup.inlineKeyboard([
    [Markup.button.callback("✅ Sim", "removeLiquidezAction")],
    [Markup.button.callback("❌ Não", "cancelaAction")],
  ]));
});

bot.action("removeLiquidezAction", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.scene.enter("removeliquidezScene");
});

// cancela
bot.action('cancelaAction', async (ctx) => {
  ctx.reply("Cancelado");
});




bot.launch();
console.log("🤖 Bot do Telegram iniciado com acesso privado!");