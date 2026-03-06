// hardhat.config.cjs
require("@nomicfoundation/hardhat-toolbox");

// 下一轮我会教你怎么安全地把私钥填进去，现在先留空
const PRIVATE_KEY = vars.get("PRIVATE_KEY", "0000000000000000000000000000000000000000000000000000000000000000"); 

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28", // 跟你的编译器版本保持一致
  networks: {
    // 雪崩测试网 Fuji 配置
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: [PRIVATE_KEY] // 这里会读取你的私钥
    },
  },
};