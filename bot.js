require("dotenv").config();
const { Telegraf, Scenes, session,Markup  } = require("telegraf");
const adicionarLiquidezScene = require("./scenes/adicionarLiquidezScene");
const removeliquidezScene =  require("./scenes/removeliquidezScene");

const stakeScene =  require("./scenes/stakeScene");
const withdrawScene =  require("./scenes/withdrawScene");
const claimRewardsScene =  require("./scenes/claimRewardsScene");
const minerStatusScene =  require("./scenes/minerStatusScene");

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
const stage = new Scenes.Stage([
  adicionarLiquidezScene,
  removeliquidezScene, 
  stakeScene, 
  withdrawScene, 
  claimRewardsScene, 
  minerStatusScene]);

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
// bot.hears("💰 Stake", stakeHandler,);
bot.hears("🔍 Transações", transacaoHandler);


bot.hears("➕ Adicionar Liquidez", async (ctx) => {
  return ctx.reply("⚙️ Deseja adicionar liquidez no contrato?", Markup.inlineKeyboard([
    [Markup.button.callback("✅ Sim", "addLiquidezAction")],
    [Markup.button.callback("❌ Não", "cancelaAction")],
  ]));
});

// adiciona liquidez
bot.action("addLiquidezAction", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.scene.enter("adicionaliquidezScene");
});


// remove liquidez
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

//stake
bot.hears("💰 Stake", async (ctx) => {
  return ctx.reply("⚙️ Escolha uma opção:", Markup.inlineKeyboard([
    [Markup.button.callback("💰 Adicionar Stake", "stakeAction")],
    [Markup.button.callback("💸 Withdraw", "withdrawActiom")],
    [Markup.button.callback("📊 Claim Rewards", "claimRewardsActiom")],
    [Markup.button.callback("🧾 Miner Status", "minerStatusActiom")],
    [Markup.button.callback("❌ Sair", "cancelaAction")],
  ]));
});

bot.action("stakeAction", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.scene.enter("stakeScene");
});

bot.action("withdrawActiom", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.scene.enter("withdrawScene");
});

bot.action("claimRewardsActiom", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.scene.enter("claimRewardsScene");
});

bot.action("minerStatusActiom", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.scene.enter("minerStatusScene");
});

// cancela
bot.action('cancelaAction', async (ctx) => {
  ctx.reply("Cancelado");
});

bot.launch();
console.log("🤖 Bot do Telegram iniciado com acesso privado!");