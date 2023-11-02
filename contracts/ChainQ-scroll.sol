// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
// import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/proxy/utils/Initializable.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/proxy/utils/UUPSUpgradeable.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/access/OwnableUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
contract chainQ is Initializable,UUPSUpgradeable,OwnableUpgradeable{
    uint256 public subscriptionPrice;

    function initialize(uint256 _subscriptionPrice) initializer public {
        __Ownable_init(msg.sender);
        subscriptionPrice = _subscriptionPrice;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    mapping(address => uint256) public subscriptions;
    mapping(address => uint256) public balances;

    event SubscriptionPurchased(address indexed user, uint256 amount);
    event BalanceWithdrawn(address indexed user, uint256 amount);
    event SubscriptionPriceChanged(uint256 newPrice);

    function purchaseSubscription() public payable {
        require(msg.value >= subscriptionPrice, "Insufficient funds to purchase a subscription");
        require(subscriptions[msg.sender] == 0, "You already have an active subscription");

        subscriptions[msg.sender] = block.timestamp + 30 days; // 30-day subscription
        balances[msg.sender] += msg.value;

        emit SubscriptionPurchased(msg.sender, msg.value);
    }

    function getSubscriptionStatus(address user) external view returns (bool hasSubscription, uint256 expirationTimestamp) {
        hasSubscription = subscriptions[user] > block.timestamp;
        expirationTimestamp = subscriptions[user];
    }
    
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdrawFunds(uint256 amount) public onlyOwner {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No funds available for withdrawal");
        require(amount <= contractBalance, "Withdrawal amount exceeds contract balance");
    
        payable(msg.sender).transfer(amount);
    
        emit BalanceWithdrawn(msg.sender, amount);
    }

    // Function to change the subscription price
    function changeSubscriptionPrice(uint256 newPrice) public onlyOwner {
        subscriptionPrice = newPrice;
        emit SubscriptionPriceChanged(newPrice);
    }

    function deleteSubscription()public {
        subscriptions[msg.sender] = block.timestamp;
    }
    
    // Receive function to accept trx
    receive() external payable {
        
    }
}