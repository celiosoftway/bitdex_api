
# 💠 BITDEX DeFi Ecosystem

Este repositório contém a integração com contratos inteligentes para o ecossistema **BITDEX**, uma plataforma DeFi baseada na rede **Polygon Amoy** que permite:

- Prover e retirar liquidez usando tokens mock USDT (`BITUSDT`)
- Receber tokens representativos (`LPUSDT`)
- Minerar tokens utilitários de gas (`BITDEX`)
- Futuramente, aplicar LPUSDT em estratégias automatizadas de rendimento

É um projeto de estudo.
---

## 📦 Contratos Implementados

### ✅ 1. `BITUSDT` (Mock USDT)
- Token ERC-20 estável que simula o USDT na rede de testes.
- Utilizado para adicionar liquidez e para stake no minerador de BITDEX.

### ✅ 2. `LPUSDT` (Liquidity Provider Token)
- Token ERC-20 recebido ao adicionar `BITUSDT` no contrato `LiquidityPoolManager`.
- Representa participação proporcional na pool.

### ✅ 3. `LiquidityPoolManager`
- Contrato que gerencia adições e remoções de liquidez.
- Recebe `LPUSDT` ao adiciona `BITUSDT` (`USDT`)
- Queima `LPUSDT` ao sacar `BITUSDT`.
- Futura integração com contratos de estratégia para distribuição de lucros via `LPUSDT`.

### ✅ 4. `BITDEX` (Token de Gas)
- Token ERC-20 usado como “gas” interno da plataforma.
- Cada operação DeFi irá consumir BITDEX (ex: 0.01 BITDEX por ação).

### ✅ 5. `TokenMiner`
- Usuários depositam `BITUSDT` em stake para minerar `BITDEX` com base no tempo de bloqueio.
- Lógica de recompensa proporcional ao valor e duração do stake.


---

## 🌐 Endereços na Rede Polygon Amoi

| Contrato              | Endereço |
|-----------------------|----------|
| BITUSDT               | `0xbaBaDC004CbE8e0dEd2e1f67D72145D21265cec1` |
| LPUSDT                | `0x06da9c093A6Ba0208dC395A86b5b0E43cF09E3f3` |
| LiquidityPoolManager  | `0x9bAcED2aB2972F6f449aB04a980331345404643c` |
| BITDEX                | `0xA942495A55FF1053680Bd07b73B12e2E02bBF9f2` |
| TokenMiner            | `0x0b99Cb82Aa9a66aF6d8a263D5EA269C968A9D0e4` |

---

## 🧱 Estrutura do Projeto

- `/contracts` – Contratos inteligentes escritos em Solidity.
- `/scripts` – Scripts de deploy e interação com contratos via Hardhat.
- `/backend` – API Node.js para interação com a blockchain (em construção).
- `/telegram-bot` – Bot do Telegram com comandos para interação DeFi (em construção).
- `/frontend` – Interface web para controle de stake, liquidez e transações (em breve).

---

## 🚀 Como rodar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/bitdex-defi.git
cd bitdex-defi
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` conforme o env de exemplo.

## 📌 Roadmap

- [x] Deploy dos contratos principais
- [x] Stake para mineração de BITDEX
- [x] Bot Telegram com saldo e liquidez
- [ ] Estratégias de rendimento com LPUSDT
- [ ] Distribuição automática de lucros
- [ ] Interface Web integrada (React)
- [ ] Sistema completo de cobrança com BITDEX como token de gas

---

## 🤝 Contribuição

Contribuições são bem-vindas! Se você quiser sugerir melhorias, abra uma issue ou envie um pull request.

---

## 📜 Licença

Este projeto está licenciado sob a **MIT License**.

