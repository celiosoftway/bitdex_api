//require("dotenv").config();
require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const LiquidityPoolManagerArtifact = require("./abi/LiquidityPoolManager.json");
const LiquidityPoolManagerAbi = LiquidityPoolManagerArtifact.abi;
const LiquidityPoolAddress = process.env.LIQUIDITY_POOL_ADDRESS;

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

function getContract(signerOrProvider = provider, abi, contractAddress) {
    return new ethers.Contract(contractAddress, abi, signerOrProvider);
}

async function Owner() {
    // Criar instância com o signer (carteira)
    const contract = getContract(wallet, LiquidityPoolManagerAbi, LiquidityPoolAddress);
    console.log("✅ Conectado ao contrato...");

    try {
        const owner = await contract.owner();
        console.log("Owner do contrato:", owner);
    } catch (error) {
        console.error("Erro ao acessar o contrato:", error);
    }
}

async function approveMax(spenderAddress) {
    const bitusdtContract = new ethers.Contract(process.env.BITUSDT_ADDRESS, ERC20_ABI, wallet);
    const maxUint256 = ethers.MaxUint256; // Valor máximo possível

    try {
        console.log(`Aprovando ${spenderAddress} a gastar o máximo de BITUSDT...`);
        const tx = await bitusdtContract.approve(spenderAddress, maxUint256);
        await tx.wait();
        console.log("✅ Aprovado com sucesso!!!");
    } catch (error) {
        console.error("Erro ao aprovar:", error);
    }
}

async function AddLiquidez(amount) {
    try {
        // Criar instância com o signer (carteira)
        const contract = getContract(wallet, LiquidityPoolManagerAbi, LiquidityPoolAddress);
        console.log("✅ Conectado ao contrato...:", contract);

        console.log(
            "Funções disponíveis:",
            contract.interface.fragments
                .filter(f => f.type === "function")
                .map(f => f.name)
        );

        const currentAllowance = await bitusdt.allowance(wallet.address, LiquidityPoolAddress);

        console.log("BITUSDT address:", process.env.BITUSDT_ADDRESS);

        if (currentAllowance < amount) {
            console.log("Aprovação insuficiente. Aprovando novo valor...");
            await approveMax(LiquidityPoolAddress);
        } else {
            console.log("✅ Aprovação já é suficiente. Pulando.");
        }


        console.log("AddLiquidez:");
        console.log("Contract Address:", LiquidityPoolAddress);
        console.log("Signer Address:", wallet.address);
        console.log("Amount:", amount.toString());


        const decimals = await bitusdt.decimals();

        const tx = await contract.addLiquidez(ethers.parseUnits(amount, decimals));

        console.log("Transação enviada:", tx.hash);
        console.log(`Link https://amoy.polygonscan.com/tx/${tx.hash}`);
        const receipt = await tx.wait();
        console.log("✅ Confirmada no bloco:", receipt.blockNumber);

        const txx = `https://amoy.polygonscan.com/tx/${tx.hash}`;
        return txx;

    } catch (error) {
        console.error("Erro ao adicionar liquidez:", error);
        throw error;
    }
}

async function removeLiquidez(amount) {
    try {
        // Criar instância com o signer (carteira)
        const contract = getContract(wallet, LiquidityPoolManagerAbi, LiquidityPoolAddress);
        console.log("✅ Conectado ao contrato...");

        const decimals = await bitusdt.decimals();
        const tx = await contract.removeLiquidez(ethers.parseUnits(amount, decimals));

        console.log("Transação enviada:", tx.hash);
        console.log(`Link https://amoy.polygonscan.com/tx/${tx.hash}`);
        const receipt = await tx.wait();
        console.log("✅ Confirmada no bloco:", receipt.blockNumber);

        const txx = `https://amoy.polygonscan.com/tx/${tx.hash}`
        return txx;

    } catch (error) {
        console.error("Erro ao adicionar liquidez:", error);
        throw error;
    }
}

async function aprove(amount, contractAddress) {
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

    console.log("💰 Saldo de LPUSDT:", valor); // Ex: 3.000,000
    return valor;
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

async function formata(valor) {
    const formatted = Math.floor(Number(ethers.formatUnits(valor, 18))).toLocaleString("en-US").replace(/,/g, '.');
    return formatted;
}



//removeLiquidez("5")
//approveMax(LiquidityPoolAddress);

// Exporta funções necessárias


(async () => {
    //AddLiquidez("10")
    //const contract = getContract(wallet, LiquidityPoolManagerAbi, LiquidityPoolAddress);

    /*
            // Debug: tentar simular com callStatic
        try {
            console.log("⏳ Simulação iniciou (callStatic)");
            await contract.callStatic.addLiquidez(parsedAmount);
            console.log("✅ Simulação passou (callStatic)");
        } catch (err) {
            console.error("❌ Simulação falhou (callStatic):", err);
            throw err; // não continue se callStatic falhou
        }
*/
    //AddLiquidez("10")
})();


module.exports = {
    Owner,
    AddLiquidez,
    aprove,
    saldoLPUSDT,
    saldoBITUSDT,
    removeLiquidez
};


