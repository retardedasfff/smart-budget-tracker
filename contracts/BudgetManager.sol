// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BudgetManager {
    enum TransactionType { EXPENSE, INCOME }
    
    struct Transaction {
        uint256 id;
        TransactionType transactionType;
        uint256 amount; // In production, this would be encrypted with FHE
        string tag;
        string description;
        uint256 timestamp;
        address owner;
        bool isDeleted;
    }
    
    struct BudgetAccess {
        address owner;
        address sharedWith;
        bool hasAccess;
        uint256 grantedAt;
    }
    
    mapping(uint256 => Transaction) public transactions;
    mapping(address => uint256[]) public userTransactions;
    mapping(address => mapping(address => bool)) public accessControl; // owner => sharedWith => hasAccess
    mapping(address => address[]) public sharedWithUsers; // owner => list of users with access
    mapping(address => address[]) public sharedByUsers; // user => list of owners who shared with them
    
    uint256 private _transactionIdCounter;
    uint256 public totalUsers;
    mapping(address => bool) public isActiveUser;
    
    event TransactionAdded(
        uint256 indexed id,
        address indexed owner,
        TransactionType transactionType,
        uint256 amount,
        string tag
    );
    
    event TransactionUpdated(uint256 indexed id, address indexed owner);
    event TransactionDeleted(uint256 indexed id, address indexed owner);
    event BudgetShared(address indexed owner, address indexed sharedWith);
    event AccessRevoked(address indexed owner, address indexed sharedWith);
    event UserActivated(address indexed user);
    
    function addTransaction(
        TransactionType _type,
        uint256 _amount,
        string memory _tag,
        string memory _description
    ) external {
        if (!isActiveUser[msg.sender]) {
            isActiveUser[msg.sender] = true;
            totalUsers++;
            emit UserActivated(msg.sender);
        }
        
        uint256 id = _transactionIdCounter++;
        transactions[id] = Transaction({
            id: id,
            transactionType: _type,
            amount: _amount,
            tag: _tag,
            description: _description,
            timestamp: block.timestamp,
            owner: msg.sender,
            isDeleted: false
        });
        
        userTransactions[msg.sender].push(id);
        
        emit TransactionAdded(id, msg.sender, _type, _amount, _tag);
    }
    
    function updateTransaction(
        uint256 _id,
        TransactionType _type,
        uint256 _amount,
        string memory _tag,
        string memory _description
    ) external {
        require(transactions[_id].owner == msg.sender, "Not the owner");
        require(!transactions[_id].isDeleted, "Transaction deleted");
        
        transactions[_id].transactionType = _type;
        transactions[_id].amount = _amount;
        transactions[_id].tag = _tag;
        transactions[_id].description = _description;
        transactions[_id].timestamp = block.timestamp;
        
        emit TransactionUpdated(_id, msg.sender);
    }
    
    function deleteTransaction(uint256 _id) external {
        require(transactions[_id].owner == msg.sender, "Not the owner");
        require(!transactions[_id].isDeleted, "Already deleted");
        
        transactions[_id].isDeleted = true;
        emit TransactionDeleted(_id, msg.sender);
    }
    
    function shareBudget(address _sharedWith) external {
        require(_sharedWith != address(0), "Invalid address");
        require(_sharedWith != msg.sender, "Cannot share with yourself");
        require(!accessControl[msg.sender][_sharedWith], "Already shared");
        
        accessControl[msg.sender][_sharedWith] = true;
        sharedWithUsers[msg.sender].push(_sharedWith);
        sharedByUsers[_sharedWith].push(msg.sender);
        
        emit BudgetShared(msg.sender, _sharedWith);
    }
    
    function revokeAccess(address _user) external {
        require(accessControl[msg.sender][_user], "Access not granted");
        
        accessControl[msg.sender][_user] = false;
        
        // Remove from sharedWithUsers array
        address[] storage shared = sharedWithUsers[msg.sender];
        for (uint256 i = 0; i < shared.length; i++) {
            if (shared[i] == _user) {
                shared[i] = shared[shared.length - 1];
                shared.pop();
                break;
            }
        }
        
        // Remove from sharedByUsers array
        address[] storage sharedBy = sharedByUsers[_user];
        for (uint256 i = 0; i < sharedBy.length; i++) {
            if (sharedBy[i] == msg.sender) {
                sharedBy[i] = sharedBy[sharedBy.length - 1];
                sharedBy.pop();
                break;
            }
        }
        
        emit AccessRevoked(msg.sender, _user);
    }
    
    function getUserTransactions(address _user) external view returns (uint256[] memory) {
        return userTransactions[_user];
    }
    
    function getSharedBudgets(address _user) external view returns (address[] memory) {
        return sharedByUsers[_user];
    }
    
    function hasAccess(address _owner, address _user) external view returns (bool) {
        return accessControl[_owner][_user];
    }
}

