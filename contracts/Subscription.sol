// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Subscription is Ownable, ReentrancyGuard {
    IERC20 public usdcToken;

    uint256 public monthlyPrice = 9990000; // 9.99 USDC (6 decimals)
    uint256 public yearlyPrice = 99000000; // 99 USDC (6 decimals)
    uint256 public constant MONTH_DURATION = 30 days;
    uint256 public constant YEAR_DURATION = 365 days;

    uint256 public artistPoolPercentage = 7000; // 70% to artist pool
    uint256 public constant FEE_DENOMINATOR = 10000;

    uint256 public totalArtistPool;
    uint256 public totalSubscribers;

    struct SubscriptionInfo {
        uint256 startTime;
        uint256 endTime;
        bool isActive;
    }

    mapping(address => SubscriptionInfo) public subscriptions;
    mapping(address => uint256) public artistShares;
    mapping(address => uint256) public artistWithdrawn;

    event Subscribed(
        address indexed user,
        uint256 amount,
        uint256 duration,
        uint256 endTime
    );

    event SubscriptionRenewed(
        address indexed user,
        uint256 amount,
        uint256 newEndTime
    );

    event ArtistPaid(
        address indexed artist,
        uint256 amount
    );

    constructor(address _usdcToken) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
    }

    function subscribe(bool yearly) external nonReentrant {
        uint256 price = yearly ? yearlyPrice : monthlyPrice;
        uint256 duration = yearly ? YEAR_DURATION : MONTH_DURATION;

        require(
            usdcToken.transferFrom(msg.sender, address(this), price),
            "Transfer failed"
        );

        uint256 artistPoolShare = (price * artistPoolPercentage) / FEE_DENOMINATOR;
        totalArtistPool += artistPoolShare;

        SubscriptionInfo storage sub = subscriptions[msg.sender];
        
        if (sub.isActive && sub.endTime > block.timestamp) {
            sub.endTime += duration;
            emit SubscriptionRenewed(msg.sender, price, sub.endTime);
        } else {
            sub.startTime = block.timestamp;
            sub.endTime = block.timestamp + duration;
            sub.isActive = true;
            totalSubscribers++;
            emit Subscribed(msg.sender, price, duration, sub.endTime);
        }
    }

    function isSubscribed(address user) external view returns (bool) {
        SubscriptionInfo memory sub = subscriptions[user];
        return sub.isActive && sub.endTime > block.timestamp;
    }

    function getSubscriptionEnd(address user) external view returns (uint256) {
        return subscriptions[user].endTime;
    }

    function getSubscriptionInfo(address user)
        external
        view
        returns (
            uint256 startTime,
            uint256 endTime,
            bool isActive,
            uint256 remainingDays
        )
    {
        SubscriptionInfo memory sub = subscriptions[user];
        uint256 remaining = 0;
        if (sub.endTime > block.timestamp) {
            remaining = (sub.endTime - block.timestamp) / 1 days;
        }
        return (sub.startTime, sub.endTime, sub.isActive, remaining);
    }

    function distributeToArtist(address artist, uint256 amount) external onlyOwner {
        require(amount <= totalArtistPool, "Insufficient pool");
        totalArtistPool -= amount;
        artistShares[artist] += amount;
        emit ArtistPaid(artist, amount);
    }

    function withdrawArtistShare() external nonReentrant {
        uint256 available = artistShares[msg.sender] - artistWithdrawn[msg.sender];
        require(available > 0, "No earnings available");
        
        artistWithdrawn[msg.sender] += available;
        require(usdcToken.transfer(msg.sender, available), "Transfer failed");
    }

    function getArtistBalance(address artist) external view returns (uint256) {
        return artistShares[artist] - artistWithdrawn[artist];
    }

    function setMonthlyPrice(uint256 newPrice) external onlyOwner {
        monthlyPrice = newPrice;
    }

    function setYearlyPrice(uint256 newPrice) external onlyOwner {
        yearlyPrice = newPrice;
    }

    function setArtistPoolPercentage(uint256 newPercentage) external onlyOwner {
        require(newPercentage <= 9000, "Max 90%");
        artistPoolPercentage = newPercentage;
    }

    function withdrawPlatformFees(address to) external onlyOwner {
        uint256 balance = usdcToken.balanceOf(address(this));
        uint256 available = balance - totalArtistPool;
        require(available > 0, "No fees available");
        require(usdcToken.transfer(to, available), "Transfer failed");
    }

    function getStats()
        external
        view
        returns (
            uint256 subscribers,
            uint256 artistPool,
            uint256 platformBalance
        )
    {
        uint256 balance = usdcToken.balanceOf(address(this));
        return (totalSubscribers, totalArtistPool, balance - totalArtistPool);
    }
}
