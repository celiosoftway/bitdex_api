require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

// Provider e carteira
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Endereços dos contratos
const BITUSDT_ADDRESS = process.env.BITUSDT_ADDRESS;
const TOKENMINER_ADDRESS = process.env.TOKENMINER_ADDRESS;

const ERC20_ABI = [
  // Funções comuns
  "function approve(address spender, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",

  // Eventos
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];
const TokenMinerAbi = JSON.parse(fs.readFileSync("./abi/TokenMiner.json")).abi;

// Endereço do contrato BITDEX
const BITDEX_ADDRESS = process.env.BITDEX_ADDRESS;
const USER_ADDRESS = process.env.DEV_ADDRESS; // ou use wallet.address se quiser a própria carteira
const bitdex = new ethers.Contract(BITDEX_ADDRESS, ERC20_ABI, provider);


// Função principal
async function stakeBITUSDT(amountString) {
    try {
        const bitusdt = new ethers.Contract(BITUSDT_ADDRESS, ERC20_ABI, wallet);
        const miner = new ethers.Contract(TOKENMINER_ADDRESS, TokenMinerAbi, wallet);

        const decimals = await bitusdt.decimals();
        const amount = ethers.parseUnits(amountString, decimals); // ex: "10"

        const overrides = {
            maxPriorityFeePerGas: ethers.parseUnits("30", "gwei"),
            maxFeePerGas: ethers.parseUnits("40", "gwei")
        };

        console.log("Aprovando TokenMiner a gastar BITUSDT...");
        const approveTx = await bitusdt.approve(TOKENMINER_ADDRESS, amount, overrides);
        await approveTx.wait();
        console.log("✅ Token aprovado");

        console.log("Realizando depósito (stake) no TokenMiner...");
        const depositTx = await miner.depositForMining(amount, overrides);
        console.log("⏳ Aguardando confirmação da transação:", depositTx.hash);
        const receipt = await depositTx.wait();

        console.log("✅ Stake realizado com sucesso no bloco:", receipt.blockNumber);
        console.log(`🔗 https://amoy.polygonscan.com/tx/${depositTx.hash}`);
    } catch (err) {
        console.error("❌ Erro durante o stake:", err);
    }
}

async function claimRewards() {
    try {
        const miner = new ethers.Contract(TOKENMINER_ADDRESS, TokenMinerAbi, wallet);

        const overrides = {
            maxPriorityFeePerGas: ethers.parseUnits("30", "gwei"),
            maxFeePerGas: ethers.parseUnits("40", "gwei")
        };

        console.log("⏳ Enviando transação de claim...");
        const tx = await miner.claim(overrides);
        console.log("🔗 Transação enviada:", tx.hash);
        const receipt = await tx.wait();

        console.log("✅ BITDEX reclamado com sucesso no bloco:", receipt.blockNumber);
        console.log(`🔗 https://amoy.polygonscan.com/tx/${tx.hash}`);
    } catch (err) {
        console.error("❌ Erro ao executar claim:", err);
    }
}

async function checkMinerStatus() {
    try {
        const contract = new ethers.Contract(TOKENMINER_ADDRESS, TokenMinerAbi, wallet);

        const deposit = await contract.deposits(wallet.address);

        const stake = ethers.formatUnits(deposit.amount, 18);
        const claimed = ethers.formatUnits(deposit.totalClaimed, 18);
        const lastClaimed = new Date(Number(deposit.lastClaimed) * 1000).toLocaleString("pt-BR");

        const reward = await contract.pendingReward(wallet.address);
        const rewardFormatted = Number(ethers.formatUnits(reward, 18)).toFixed(6);

        console.log("📦 Stake (BITUSDT):", stake);
        console.log("🪙 Total claimado (BITDEX):", claimed);
        console.log("🕒 Último claim:", lastClaimed);
        console.log("💎 Recompensa acumulada (BITDEX):", rewardFormatted, "BITDEX");

    } catch (err) {
        console.error("❌ Erro ao verificar status de mineração:", err);
    }
}

async function getTotalClaimed(userAddress) {
  try {
    const filter = bitdex.filters.Transfer(ethers.ZeroAddress, userAddress);

    console.log(`⏳ Buscando eventos Transfer (mint) para: ${userAddress}...`);
    const events = await bitdex.queryFilter(filter, 0, "latest");

    let total = 0n;

    for (const event of events) {
      total += event.args.value; // event.args.value já é BigInt
    }

    const formatted = Number(ethers.formatUnits(total, 18)).toLocaleString("en-US", {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6
    });

    console.log(`✅ Total BITDEX claimado por ${userAddress}: ${formatted} BITDEX`);
  } catch (err) {
    console.error("❌ Erro ao buscar eventos de claim:", err);
  }
}

async function withdrawStake(amountString) {
    try {
        const miner = new ethers.Contract(TOKENMINER_ADDRESS, TokenMinerAbi, wallet);
        const decimals = 18;
        const amount = ethers.parseUnits(amountString, decimals);

        // 🔍 Consulta saldo em stake
        const deposit = await miner.deposits(wallet.address);
        const currentStake = deposit.amount;

        if (currentStake < amount) {
            const stakedFormatted = Number(ethers.formatUnits(currentStake, decimals)).toFixed(6);
            console.log(`❌ Saldo insuficiente em stake. Você tem ${stakedFormatted} BITUSDT em stake.`);
            return;
        }

        // Overrides de gas
        const overrides = {
            maxPriorityFeePerGas: ethers.parseUnits("30", "gwei"),
            maxFeePerGas: ethers.parseUnits("40", "gwei")
        };

        console.log(`⏳ Enviando transação de retirada de ${amountString} BITUSDT...`);
        const tx = await miner.withdraw(amount, overrides);

        console.log("🔗 Transação enviada:", tx.hash);
        const receipt = await tx.wait();

        console.log("✅ Saque realizado com sucesso no bloco:", receipt.blockNumber);
        console.log(`🔗 https://amoy.polygonscan.com/tx/${tx.hash}`);
    } catch (err) {
        console.error("❌ Erro ao sacar BITUSDT:", err);
    }
}


// stakeBITUSDT("10");
// claimRewards()
// checkMinerStatus();
// getTotalClaimed(USER_ADDRESS);
// withdrawStake("25")

module.exports = {
  stakeBITUSDT,
  claimRewards,
  checkMinerStatus,
  getTotalClaimed,
  withdrawStake
};
