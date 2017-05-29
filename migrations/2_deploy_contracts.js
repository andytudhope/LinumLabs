var StandardToken = artifacts.require("./StandardToken.sol");
var HumanStandard = artifacts.require("./HumanStandardToken.sol");
var HumanStandardFactory = artifacts.require("./HumanStandardTokenFactory.sol");

module.exports = function(deployer) {
    deployer.deploy(StandardToken);
    deployer.link(StandardToken, HumanStandard)
    deployer.deploy(HumanStandard);
    deployer.link(HumanStandard, HumanStandardFactory);
    deployer.deploy(HumanStandardFactory);
};
