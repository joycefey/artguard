const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ArtGuardModule", (m) => {
  // 1. 部署代币 (MockAUSD)
  // 🟢 修复点：这里括号里什么都不传，因为你的合约不需要参数
  const currency = m.contract("MockAUSD");

  // 2. 部署担保合约 (ArtGuardEscrow)
  // 参数1: 代币地址
  // 参数2: 1 (这里填 1，就是我们要的 MVP 1票结案模式)
  const escrow = m.contract("ArtGuardEscrow", [currency, 1]);

  return { currency, escrow };
});