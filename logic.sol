pragma solidity ^0.5.3;

contract hashStorage{
    struct DocInfo {
        string ipfshash;
        uint dateAdded;
        string fileName;
        bool isCreated;
              }
     mapping (address => mapping(string=>DocInfo)) private collection;
    event HashAdded(string ipfshash, string fileName, uint dateAdded);

    function storeHash(string memory _ipfshash, string memory _fileName) public {
        require(!collection[msg.sender][_fileName].isCreated, "A file is already created with this name");
        collection[msg.sender][_fileName]= DocInfo(_ipfshash, now ,_fileName, true);
         emit HashAdded(_ipfshash, _fileName, now);
            }

    function getFileName(string memory _fileName) public view returns(string memory){
    return (collection[msg.sender][_fileName].fileName);
         }
    function getIpfsHash(string memory _fileName) public view returns(string memory){
    return (collection[msg.sender][_fileName].ipfshash);
          }
    function getDateCreated(string memory _fileName) public view returns(uint256){
    return (collection[msg.sender][_fileName].dateAdded);
        }
}
