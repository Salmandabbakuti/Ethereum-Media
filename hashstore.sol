pragma solidity ^0.5.0;

contract hashStorage{
    struct DocInfo {
        string ipfshash;
        uint dateAdded;
        string filehash;
              }
     mapping (address => DocInfo[]) private collection;
    event HashAdded(string ipfshash, string filehash, uint dateAdded);

    function storeHash(string memory _ipfshash, string memory _filehash) public{
        DocInfo memory docInfo = DocInfo(_ipfshash, now ,_filehash);
        collection[msg.sender].push(docInfo);
         emit HashAdded(_ipfshash, _filehash, now);
            }

function getHashes(uint index, address user) public view returns(string memory,uint,string memory){
    require(msg.sender==user);
    return (collection[user][index].ipfshash,collection[user][index].dateAdded,collection[user][index].filehash);
     }
}