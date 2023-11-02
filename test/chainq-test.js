const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("chainQ", function () {
  let chainQ;
  let owner, user;

  beforeEach(async () => {
    // Initialize the upgradeable contract
    console.log("Deploying ChainQ Upgradable contract...");
    const Chainq = await ethers.getContractFactory("chainQ");
    chainQ = await upgrades.deployProxy(Chainq, ["100000000000000000"]);

    // Get the named accounts

    console.log("Proxy of ChainQ deployed to:", chainQ.target);
  });

  it("Should set the correct subscription price", async function () {
    const subscriptionPrice = await chainQ.subscriptionPrice();
    expect(subscriptionPrice).to.equal(100000000000000000);
  });

  it("Should allow the owner to change the subscription price", async function () {
    const newPrice = 200000000000000000;
    await chainQ.connect(owner).changeSubscriptionPrice(newPrice);
    const updatedPrice = await chainQ.subscriptionPrice();
    expect(updatedPrice).to.equal(newPrice);
  });

  it("Should allow users to purchase a subscription", async function () {
    const userBalanceBefore = await ethers.provider.getBalance(user);
    const subscriptionPrice = await chainQ.subscriptionPrice();

    // Purchase a subscription
    await chainQ
      .connect(user)
      .purchaseSubscription({ value: subscriptionPrice });

    // Check the user's subscription status
    const [hasSubscription, expirationTimestamp] =
      await chainQ.getSubscriptionStatus(user);
    expect(hasSubscription).to.be.true;
    expect(expirationTimestamp.toNumber()).to.be.above(0);

    // Check the user's balance decreased
    const userBalanceAfter = await ethers.provider.getBalance(user);
    expect(userBalanceAfter).to.equal(userBalanceBefore.sub(subscriptionPrice));
  });

  it("Should allow the owner to withdraw funds", async function () {
    const contractBalanceBefore = await ethers.provider.getBalance(
      chainQ.address
    );

    // Withdraw funds by the owner
    const withdrawalAmount = 100000000000000000; // Replace with the desired withdrawal amount
    await chainQ.connect(owner).withdrawFunds(withdrawalAmount);

    // Check the contract balance decreased
    const contractBalanceAfter = await ethers.provider.getBalance(
      chainQ.address
    );
    expect(contractBalanceAfter).to.equal(
      contractBalanceBefore.sub(withdrawalAmount)
    );
  });

  it("Should allow the owner to delete a user's subscription", async function () {
    // Create a user subscription
    await chainQ
      .connect(user)
      .purchaseSubscription({ value: 100000000000000000 });

    // Check the user's subscription status before deletion
    const [hasSubscriptionBefore, expirationTimestampBefore] =
      await chainQ.getSubscriptionStatus(user);
    expect(hasSubscriptionBefore).to.be.true;

    // Delete the user's subscription
    await chainQ.connect(user).deleteSubscription();

    // Check the user's subscription status after deletion
    const [hasSubscriptionAfter, expirationTimestampAfter] =
      await chainQ.getSubscriptionStatus(user);
    expect(hasSubscriptionAfter).to.be.false;
    expect(expirationTimestampAfter.toNumber()).to.equal(0);
  });
});
