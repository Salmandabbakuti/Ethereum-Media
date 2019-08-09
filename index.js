 function log(message) {
   document.getElementById("log").innerHTML=message;
    console.log(message);
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
 function initAllFiles() {
    hashStore.getFilesLength((err, maxFiles) => {
        let sectionContent = ''
        maxFiles = maxFiles.toNumber()
        for(let i = 0; i < maxFiles; i++) {
            hashStore.getUserFiles(i, (err, message) => {
                sectionContent += `<div class="message-box">
                    <div>File Name: ${message[0]}</div></br>
                    <div>Ipfs Hash: ${message[1]}</div>
                </div>`

                if(i === maxFiles - 1) document.querySelector('#allFiles').innerHTML = sectionContent
            })
        }
    })
}
  const address = "0x16771f19bc0b1f241383dc3c8de322f6036067ed";
  const abi = [{"constant":true,"inputs":[{"name":"_fileName","type":"string"}],"name":"getFileName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_fileName","type":"string"}],"name":"getDateCreated","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getFilesLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_fileName","type":"string"}],"name":"getIpfsHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_ipfshash","type":"string"},{"name":"_fileName","type":"string"}],"name":"storeHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getUserFiles","outputs":[{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"ipfshash","type":"string"},{"indexed":false,"name":"fileName","type":"string"},{"indexed":false,"name":"dateAdded","type":"uint256"}],"name":"HashAdded","type":"event"}];
  hashStore = web3.eth.contract(abi).at(address);
$(function () {
    var hashStore;
    $('#getFileData').click(function (e) {
      e.preventDefault();
      hashStore.getDateCreated.call(document.getElementById("fileNameIndex").value, function (err, result1) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        document.getElementById("getDateCreated").innerHTML = result1;
      });
    });
    $('#getFileData').click(function (e) {
      e.preventDefault();
            hashStore.getFileName.call(document.getElementById("fileNameIndex").value, function (err, result2) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        document.getElementById("getFileName").innerHTML = result2;
      });
     });
    $('#getFileData').click(function (e) {
      e.preventDefault();
            hashStore.getIpfsHash.call(document.getElementById("fileNameIndex").value, function (err, result3) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        document.getElementById("getIpfsHash").innerHTML = "http://gateway.ipfs.io/ipfs/"+result3;
      });
     });
$('#storeHash').click(function (e) {
      e.preventDefault();
      if(web3.eth.defaultAccount === undefined) {
        return error("No accounts found. If you're using MetaMask, " +
                     "please unlock it first and reload the page.");
      }
      log("Transaction On its Way...");
      hashStore.storeHash.sendTransaction(document.getElementById("ipfsHash").value, document.getElementById("fileName").value,function (err, hash) {
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
       $('#storedFiles').click();
        }
    }
  });
