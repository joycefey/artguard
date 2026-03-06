// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ArtGuardEscrow {
    // 状态机：0=等待发货, 1=交易完成, 2=有争议, 3=争议已解决
    enum OrderStatus { Waiting, Completed, Disputed, Resolved }

    struct Order {
        address buyer;       // 买家
        address artist;      // 艺术家(卖家)
        uint256 amount;      // 金额
        OrderStatus status;  // 当前状态
        uint256 totalVotes;  // 总票数
        uint256 buyerVotes;  // 支持买家的票数
        uint256 artistVotes; // 支持卖家的票数
        bool resolved;       // 是否已结案
    }

    IERC20 public currency;   // 使用的代币 (MockAUSD)
    uint256 public orderCount; // 订单计数器
    
    // 🔥【升级点】这里不再是 constant，变成了一个公开变量
    // 这样我们就可以在部署时决定是“1人判决”还是“5人陪审团”
    uint256 public MAX_JURORS; 

    mapping(uint256 => Order) public orders;
    mapping(uint256 => mapping(address => bool)) public jurorVoted;

    // 事件系统 (用于前端监听，全部保留)
    event OrderCreated(uint256 indexed orderId, address indexed buyer, address indexed artist, uint256 amount);
    event OrderReleased(uint256 indexed orderId, uint256 amount);
    event DisputeRaised(uint256 indexed orderId);
    event Voted(uint256 indexed orderId, address indexed juror, bool supportBuyer);
    event DisputeResolved(uint256 indexed orderId, uint8 winner);

    // 🔥【升级点】构造函数增加了 _maxJurors 参数
    constructor(address _currency, uint256 _maxJurors) {
        currency = IERC20(_currency);
        MAX_JURORS = _maxJurors; // 部署时设定人数
    }

    // === 功能模块 1: 下单/托管资金 (核心流程) ===
    function createOrder(address _artist, uint256 _amount) external returns (uint256) {
        require(_amount > 0, "Amount must be > 0");
        // 把钱从买家转到合约里 (冻结)
        require(currency.transferFrom(msg.sender, address(this), _amount), "Payment failed");

        orderCount++;
        orders[orderCount] = Order({
            buyer: msg.sender,
            artist: _artist,
            amount: _amount,
            status: OrderStatus.Waiting,
            totalVotes: 0,
            buyerVotes: 0,
            artistVotes: 0,
            resolved: false
        });

        emit OrderCreated(orderCount, msg.sender, _artist, _amount);
        return orderCount;
    }

    // === 功能模块 2: 确认收货 (Happy Path) ===
    function releaseFunds(uint256 _orderId) external {
        Order storage order = orders[_orderId];
        require(msg.sender == order.buyer, "Only buyer can release");
        require(order.status == OrderStatus.Waiting, "Invalid status");

        order.status = OrderStatus.Completed;
        order.resolved = true;
        // 钱转给卖家
        currency.transfer(order.artist, order.amount);
        
        emit OrderReleased(_orderId, order.amount);
    }

    // === 功能模块 3: 发起争议 (Unhappy Path) ===
    function raiseDispute(uint256 _orderId) external {
        Order storage order = orders[_orderId];
        require(msg.sender == order.buyer, "Only buyer can dispute");
        require(order.status == OrderStatus.Waiting, "Invalid status");

        order.status = OrderStatus.Disputed; // 状态变为争议中
        emit DisputeRaised(_orderId);
    }

    // === 功能模块 4: 法官投票 (核心治理) ===
    function castVote(uint256 _orderId, bool _supportBuyer) external {
        Order storage order = orders[_orderId];
        require(order.status == OrderStatus.Disputed, "Not disputed");
        require(!jurorVoted[_orderId][msg.sender], "Already voted");

        jurorVoted[_orderId][msg.sender] = true; // 记录已投票，防刷票
        order.totalVotes++;

        if (_supportBuyer) {
            order.buyerVotes++;
        } else {
            order.artistVotes++;
        }

        emit Voted(_orderId, msg.sender, _supportBuyer);

        // 🔥【逻辑判断】如果当前票数 >= 我们设定的最大人数，立即结案
        if (order.totalVotes >= MAX_JURORS) {
            _resolveDispute(_orderId);
        }
    }

    // === 内部功能: 执行判决 ===
    function _resolveDispute(uint256 _orderId) internal {
        Order storage order = orders[_orderId];
        order.status = OrderStatus.Resolved;
        order.resolved = true;

        if (order.buyerVotes > order.artistVotes) {
            // 判给买家
            currency.transfer(order.buyer, order.amount);
            emit DisputeResolved(_orderId, 1);
        } else {
            // 判给卖家
            currency.transfer(order.artist, order.amount);
            emit DisputeResolved(_orderId, 2);
        }
    }
}