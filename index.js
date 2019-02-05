 function log(message) {
    $('#log').append($('<p>').text(message));
    $('#log').scrollTop($('#log').prop('scrollHeight'));
  }
  function error(message) {
    $('#log').append($('<p>').addClass('dark-red').text(message));
    $('#log').scrollTop($('#log').prop('scrollHeight'));
  }
  function waitForReceipt(hash, cb) {
    web3.eth.getTransactionReceipt(hash, function (err, receipt) {
      if (err) {
        error(err);
      }
      if (receipt !== null) {
        // Transaction went through
        if (cb) {
          cb(receipt);
        }
      } else {
        // Try again in 1 second
        window.setTimeout(function () {
          waitForReceipt(hash, cb);
        }, 1000);
      }
    });
  }
  const address = "0xcbff0b348aac0e1cdc198a9582219c4da7c11f4e";
  const abi = [{"constant":false,"inputs":[{"name":"_ipfshash","type":"string"},{"name":"_filehash","type":"string"}],"name":"storeHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"ipfshash","type":"string"},{"indexed":false,"name":"filehash","type":"string"},{"indexed":false,"name":"dateAdded","type":"uint256"}],"name":"HashAdded","type":"event"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getDateCreated","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getFileHashes","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getIpfsHashes","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}];
  $(function () {
    var hashStore;
    $('#getFileData').click(function (e) {
      e.preventDefault();
      hashStore.getDateCreated.call(document.getElementById("index").value, function (err, result1) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        document.getElementById("getDateCreated").innerHTML = result1;
      });
    });
    $('#getFileData').click(function (e) {
      e.preventDefault();
            hashStore.getFileHashes.call(document.getElementById("index").value, function (err, result2) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        document.getElementById("getFileHash").innerHTML = result2;
      });
     });
    $('#getFileData').click(function (e) {
      e.preventDefault();
            hashStore.getIpfsHashes.call(document.getElementById("index").value, function (err, result3) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        document.getElementById("getIpfsHash").innerHTML = result3;
      });
     });
$('#storeHash').click(function (e) {
      e.preventDefault();
      if(web3.eth.defaultAccount === undefined) {
        return error("No accounts found. If you're using MetaMask, " +
                     "please unlock it first and reload the page.");
      }
      log("Transaction On its Way...");
      hashStore.storeHash.sendTransaction(document.getElementById("ipfsHash").value, document.getElementById("fileHash").value,function (err, hash) {
        if (err) {
          return error(err);
        }
        waitForReceipt(hash, function () {
          log("Transaction succeeded.");
        });
      });
    });
    if (typeof(web3) === "undefined") {
      error("Unable to find web3. " +
            "Please run MetaMask (or something else that injects web3).");
    } else {
      log("Found injected web3.");
      web3 = new Web3(web3.currentProvider);
      ethereum.enable();
      if (web3.version.network != 3) {
        error("Wrong network detected. Please switch to the Ropsten test network.");
      } else {
        log("Connected to the Ropsten test network.");
        hashStore = web3.eth.contract(abi).at(address);
        }
    }
  });