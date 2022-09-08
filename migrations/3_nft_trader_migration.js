const NFTTrader = artifacts.require("NFTTrader");

module.exports = function (deployer) {
  deployer.deploy(NFTTrader);
};
