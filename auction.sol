pragma solidity ^0.4.0;

contract auction {
  uint userID = 10000;
  uint itemID = 10000;
  uint auctionId = 10000;
  uint bidId = 10000;
  
  enum AuctionStatus {open , closed}
  
    struct user {
        string name;
        bytes32 password;
        uint balance;
        address uAddress;
        uint bid_price;
    }
    
    mapping(uint => user) users; //map for addresss to users
    
    function registerUser(string aname, bytes32 pass , uint bal , address uaddress) returns (uint){
        uint u = userID++;
        users[u].name = aname;
        users[u].password = pass;
        users[u].balance = bal;
        users[u].uAddress = uaddress;
        return u;
    }
    // function searchUser(uint id)returns (string, bytes32, uint, address, uint){
    //     return (users[id].name, users[id].password, users[id].balance, users[id].uAddress, users[id].bid_price);
    // }
    function login(uint uID, bytes32 pass) returns(bool success) {
        if(users[uID].password == pass)
            return true;
        else 
            return false; //user id or password is invalid.
    }
 
    struct item {
        uint itemId;
        string name;
        string itemdecs;
        address owner;
    }

    mapping (uint => item) items;
    
    function getItems() public returns (uint){
        return itemID;
    }
    
    function searchItem(uint itemId) returns(uint, string, string, address) {
        return (itemId, items[itemId].name, items[itemId].itemdecs,  items[itemId].owner);
    }
    // mapping (address => item[]) itemsWithAddress;
    
    function registerItem ( string iName , string iDesc , address own) returns (uint){
            uint id=itemID++;
            items[id].name = iName;
            items[id].itemdecs = iDesc;
            items[id].owner = own;
            return id; 
    }
    modifier onlyOwner(uint id) {
        if (items[id].owner != msg.sender) throw;
        _;
    }
  
    struct createauction {
        uint start;
        uint end;
        uint basePrice;
        uint finalprice;
        AuctionStatus statusofauc; // open or close
    }
    
    mapping (uint => createauction) createauctions;

    function createAuction(uint itemid, uint startTime, uint endTime, uint bPrice, uint fPrice) onlyOwner(itemid) returns (uint){
              uint aucId = auctionId++;
              if(now >= startTime && now <= endTime){
                createauctions[aucId].start = startTime;
                createauctions[aucId].end = endTime;
                createauctions[aucId].basePrice = bPrice;
                createauctions[aucId].finalprice = fPrice;
                createauctions[aucId].statusofauc = AuctionStatus.open;
                return aucId;
              }else {return uint(0);}
    }    
    
    struct bid {
        uint bid_id;
        uint item_Id;
        uint price;
        uint user_id;
    }
    
    bid[] bids; 
    // mapping (uint=> bid) bids; //uint will be userId. mapping bids with userId.for multiple bids by a user.
   
    function makebid(uint _aucId, uint itemId, uint _userId, uint bidprice)  returns (bool){
        uint endtime = createauctions[_aucId].end;
        uint starttime = createauctions[_aucId].start;
        uint bidid = bidId++;   
        users[_userId].bid_price = bidprice;
        
        if((now >= starttime && now <= endtime && (createauctions[_aucId].finalprice >= users[_userId].bid_price))){
                    if (createauctions[_aucId].basePrice <= users[_userId].bid_price){
                        bid b;
                        b.bid_id = bidid;
                        b.price = users[_userId].bid_price;
                        b.item_Id= itemId;
                        b.user_id= _userId;
                        bids.push(b);
                        return true;
                    }
                      return false; // bid price should be greater than baseprice
        }
        changeStatusOfAuction(_aucId);
        users[_userId].balance += bidprice; 
       return false;
    }
    
    function changeStatusOfAuction(uint _aucId) returns (uint, uint,uint){
        uint max = 0; uint id = 0;
        uint t;
        uint count = 0;
        for(uint i=0; i <= bids.length ; i++){
            if (max <= bids[i].price) {
                max = bids[i].price; 
                id = bids[i].item_Id;
                items[id].owner = users[bids[t].user_id].uAddress;
            }
            count++;
            return (max, id,count);
        }
        createauctions[_aucId].statusofauc = AuctionStatus.closed; 
    }
}
