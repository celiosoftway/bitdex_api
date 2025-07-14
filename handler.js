require("dotenv").config();

const {
    Owner,
    AddLiquidez,
    aprove,
    saldoLPUSDT,
    saldoBITUSDT,
} = require("./contrato");

const { ethers } = require("ethers");
const { Markup } = require("telegraf");
const OWNER_ID = parseInt(process.env.OWNER_ID);

const keyboard = Markup.keyboard([
    ["🧾 Balance", "🔍 Transações"],
    ["👤 Info", "💰 Stake"],
    ["➕ Adicionar Liquidez", "➖ Remover Liquidez"]
]).oneTime().resize();

// comando start, envia uma mensagem em privato
async function startHandler(ctx) {
    if (ctx.chat.id != ctx.from.id) {
        ctx.reply('Oioi\n' +
            'Estou te enviando uma mensagem no privado, okay? ^^');

        bot.telegram.sendMessage(ctx.from.id, 'Oioi\n' +
            'Agora podemos conversar em particular ^^\n' +
            'Use o comando /help para ver a lista de comandos ^^');
    } else {
        ctx.replyWithMarkdown('keyboard iniciado',
            keyboard
        );
    }
    return true;
}

async function infoHandler(ctx) {
    ctx.replyWithMarkdown('Info',
        keyboard
    );
}

async function addLiquidezHandler(ctx) {
    ctx.replyWithMarkdown('addLiquidezHandler',
        keyboard
    );
}

async function removeLiquidezHandler(ctx) {
    ctx.replyWithMarkdown('removeLiquidezHandler',
        keyboard
    );
}

async function balanceHandler(ctx) {

    const BITUSDT = await saldoBITUSDT();
    const LPUSDT = await saldoLPUSDT();

    let mensagem = `*Saldo da sua carteira* \n\n`;
    mensagem += `💰 Saldo em BITUSDT: ${BITUSDT}\n`
    mensagem += `💸 Saldo em LPUSDT: ${LPUSDT} \n\n`;
 
    ctx.replyWithMarkdown(mensagem, keyboard );
}

async function stakeHandler(ctx) {
    ctx.replyWithMarkdown('stakeHandler',
        keyboard
    );
}

async function transacaoHandler(ctx) {
    ctx.replyWithMarkdown('transacaoHandler',
        keyboard
    );
}



module.exports = {
    startHandler,
    infoHandler,
    addLiquidezHandler,
    removeLiquidezHandler,
    balanceHandler,
    stakeHandler,
    transacaoHandler
}