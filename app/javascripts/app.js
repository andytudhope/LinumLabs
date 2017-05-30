// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import token_artifacts from '../../build/contracts/Token.json';
import standard_token_artifacts from '../../build/contracts/StandardToken.json';
import human_standard_artifacts from '../../build/contracts/HumanStandardToken.json';
import human_standard_factory_artifacts from '../../build/contracts/HumanStandardTokenFactory.json';

// MetaCoin is our usable abstraction, which we'll use through the code below.
var Token = contract(token_artifacts);
var StandardToken = contract(standard_token_artifacts);
var HumanStandard = contract(human_standard_artifacts);
var HumanStandardFactory = contract(human_standard_factory_artifacts);
var SolidityCoder = require("web3/lib/solidity/coder.js");

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the Token abstractions for Use.
    Token.setProvider(web3.currentProvider);
    StandardToken.setProvider(web3.currentProvider);
    HumanStandard.setProvider(web3.currentProvider);
    HumanStandardFactory.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
      console.log(account);

    });
  },

  sendToken: function() {
    var self = this;

    var amount = parseInt(document.getElementById("samount").value);
    var to = document.getElementById("sto").value;

    console.log("Initiating transaction... (please wait)");
    var token;
    HumanStandard.deployed().then(function(instance) {
      token = instance;
      return token.transfer(to, amount, {from: account, gas: 3000000})
    }).then(function(res) {
      var txHash = res.tx;
      console.log("The tx hash is: " + txHash);

      var receipt = res.receipt;
      console.log("And your receipt, kind human: ")
      console.log(receipt);

    }).catch(function(e) {
      console.log(e);
      console.log("Error sending coin; see log.");
    });
    
  },


  createToken: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var name = document.getElementById("name").value;
    var decimal = parseInt(document.getElementById("decimal").value);
    var symbol = document.getElementById("symbol").value;

    console.log("Initiating transaction... (please wait)");

    var token;
    HumanStandardFactory.deployed().then(function(instance) {
      token = instance;
      return token.createHumanStandardToken(amount, name, decimal, symbol, {from: account, gas: 3000000});
    }).then(function(res) {
      var txHash = res.tx;
      console.log("The tx hash is: " + txHash);

      var receipt = res.receipt;
      console.log("And your receipt, kind human: ")
      console.log(receipt);

      // Generally speaking, you need to use getTransactionReceipt to be sure that you tx has been confirmed.
      // However, with testrpc, you can just access the receipt as above.
      // The reason I have added a callback fn here is because it makes the request asynchronous,
      // which works much better on real networks where it takes time to mine and confirm transactions.
      // It would be a good idea to add some sort of timeout function in there to make sure that you
      // give the chain long enough to get back to you ;) I also show you how to take a look through the
      // logs, which is much more useful when using an asynchronous function to get the transaction receipt and filter
      // for specific events you are interested in, rather than the generic "event" I have gone for here.

      // web3.eth.getTransactionReceipt(txHash, function(res) {
      //   console.log(res);
      // });

      // Now, I'm just going to filter through the logs to show you that it can be done to return specific info about
      // what the transaction was composed of and who did what when. You'll notice the when part is very easy to establish by
      // just looking at the blockNumber in the tx receipt. Looking at the data is a touch more complex...

      var log = receipt.logs[0];
      var event = null;
      var abi = human_standard_artifacts.abi;

      for (var i = 0; i < abi.length; i++) {
          var item = abi[i];
          if (item.type != "event") continue;
          var signature = item.name + "(" + item.inputs.map(function(input) {return input.type;}).join(",") + ")";
          var hash = web3.sha3(signature);
          if (hash == log.topics[0]) {
              event = item;
              break;
          }
      }

      if (event != null) {
      var inputs = event.inputs.map(function(input) {return input.type;});
      var data = SolidityCoder.decodeParams(inputs, log.data.replace("0x", ""));
          console.log("You created " + parseInt(data[0], 16) + " coins. Go you!")
      }
      
    }).catch(function(e) {
      console.log(e);
      console.log("Error sending coin; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  

  App.start();
});
