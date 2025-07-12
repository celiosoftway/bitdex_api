//require("dotenv").config();
require("dotenv").config();
const { ethers } = require("ethers");

const LiquidityPoolManagerArtifact = require("./LiquidityPoolManager.json");
const LiquidityPoolManagerAbi = LiquidityPoolManagerArtifact.abi;

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.LIQUIDITY_POOL_ADDRESS;

const ERC20_ABI = [
    // Some common ERC-20 functions
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)"
];

const bitusdt = new ethers.Contract(process.env.BITUSDT_ADDRESS, ERC20_ABI, provider);

function getContract(signerOrProvider = provider) {
    return new ethers.Contract(contractAddress, LiquidityPoolManagerAbi, signerOrProvider);
}

// Criar instância com o signer (carteira)
const contract = getContract(wallet);
console.log("✅ Conectado ao contrato...");

/*
✅ Funções de Leitura (sem custo de gas):
    owner() → address Retorna o dono do contrato.
    bitusdt() → address Retorna o endereço do token BITUSDT usado.
    lpusdt() → address Retorna o endereço do token LPUSDT usado.

✅ Funções de Escrita (requerem gas):
    addLiquidez(uint256 amount)
    removeLiquidez(uint256 amount)
    transferOwnership(address newOwner)
    renounceOwnership()
*/


async function Owner() {
    try {
        const owner = await contract.owner();
        console.log("Owner do contrato:", owner);
    } catch (error) {
        console.error("Erro ao acessar o contrato:", error);
    }
}

async function AddLiquidez(amount) {
    try {

        await aprove(amount);
        const decimals = await bitusdt.decimals();

        const tx = await contract.addLiquidez(ethers.parseUnits(amount, decimals));

        console.log("Transação enviada:", tx.hash);
        console.log(`Link https://amoy.polygonscan.com/tx/${tx.hash}`);
        const receipt = await tx.wait();
        console.log("✅ Confirmada no bloco:", receipt.blockNumber);

        const saldoBITUSDT1 = await saldoBITUSDT();
        const saldoLPUSDT1 = await saldoLPUSDT();

    } catch (error) {
        console.error("Erro ao adicionar liquidez:", error);
    }
}


async function aprove(amount) {
    const bitusdtAbi = [
        "function approve(address spender, uint256 amount) public returns (bool)"
    ];

    const BITUSDT_ADDRESS = process.env.BITUSDT_ADDRESS; // adicione ao seu .env
    const bitusdtContract = new ethers.Contract(BITUSDT_ADDRESS, bitusdtAbi, wallet);

    const decimals = await bitusdt.decimals();
    const amountAprove = ethers.parseUnits(amount, decimals);

    console.log("Aprovando LiquidityPoolManager a gastar BITUSDT...");
    await bitusdtContract.approve(contractAddress, amountAprove);
    console.log("✅ Aprovado com sucesso!");
}

async function saldoLPUSDT() {
    const lpusdtAbi = [
        "function balanceOf(address owner) view returns (uint256)"
    ];

    const LPUSDT_ADDRESS = process.env.LPUSDT_ADDRESS;
    const lpusdt = new ethers.Contract(LPUSDT_ADDRESS, lpusdtAbi, provider);

    const balance = await lpusdt.balanceOf(wallet.address);
    const valor = await formata(balance)

    console.log("💰 Saldo de LPUSDT:",valor ); // Ex: 3.000,000
    return valor;
}

async function formata(valor) {
    const formatted = Math.floor(Number(ethers.formatUnits(valor, 18))).toLocaleString("en-US").replace(/,/g, '.');
    return formatted;
}

async function saldoBITUSDT() {
    const bitusdtAbi = [
        "function balanceOf(address owner) view returns (uint256)"
    ];
    const bitusdt = new ethers.Contract(process.env.BITUSDT_ADDRESS, bitusdtAbi, provider);

    const saldo = await bitusdt.balanceOf(wallet.address);
    const valor = await formata(saldo);

    console.log("🧾 Saldo BITUSDT:", valor);
    return valor;
}

// AddLiquidez("10000")

// Exporta funções necessárias
module.exports = {
    Owner,
    AddLiquidez,
    aprove,
    saldoLPUSDT,
    saldoBITUSDT,
};


