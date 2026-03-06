// src/lib/contracts.ts

export const MOCK_TOKEN_ADDRESS = "0xA1a31B9e8947e0393Dd7681A1ddDa1a9eB47Aa91";
export const ESCROW_ADDRESS = "0xC9fecf9a5b67d0D3B4067504DB29CbAe02c91e01";

export const MOCK_TOKEN_ABI = [
  "function mint(address to, uint256 amount) public",
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function balanceOf(address account) public view returns (uint256)",
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) public returns (bool)"
];

export const ESCROW_ABI = [
  "function createOrder(address artist, uint256 amount) external returns (uint256)",
  "function releaseFunds(uint256 orderId) external",
  "function raiseDispute(uint256 orderId) external",
  "function castVote(uint256 orderId, bool supportBuyer) external",
  "function orders(uint256) view returns (address, address, uint256, uint8, uint256, uint256, uint256, bool)",
  "function orderCount() view returns (uint256)"
];