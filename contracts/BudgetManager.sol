// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BudgetManager - Fully Homomorphic Encryption Budget Tracker
 * @dev Budget tracker with FHE-encrypted transaction amounts
 * 
 * This contract uses Fully Homomorphic Encryption (FHE) via Zama FHEVM.
 * All transaction amounts are encrypted using FHE before being stored on-chain.
 * Amounts are stored as FHE handles (bytes32) which represent encrypted euint32 values.
 */
contract BudgetManager {
    enum TransactionType { EXPENSE, INCOME }
    
    struct Transaction {
        uint256 id;
        TransactionType transactionType;
        bytes32 encryptedAmount; // FHE handle (bytes32) for encrypted amount (euint32)
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
        string tag
    );
    
    event TransactionUpdated(uint256 indexed id, address indexed owner);
    event TransactionDeleted(uint256 indexed id, address indexed owner);
    event BudgetShared(address indexed owner, address indexed sharedWith);
    event AccessRevoked(address indexed owner, address indexed sharedWith);
    event UserActivated(address indexed user);
    
    /**
     * @dev Add a new transaction with FHE-encrypted amount
     * @param _type Transaction type (EXPENSE or INCOME)
     * @param _encryptedAmount FHE handle (bytes32) for encrypted amount
     * @param _tag Transaction tag/category
     * @param _description Transaction description
     */
    function addTransaction(
        TransactionType _type,
        bytes32 _encryptedAmount, // FHE handle
        string memory _tag,
        string memory _description
    ) external {
        require(_encryptedAmount != bytes32(0), "FHE encrypted amount cannot be empty");
        
        if (!isActiveUser[msg.sender]) {
            isActiveUser[msg.sender] = true;
            totalUsers++;
            emit UserActivated(msg.sender);
        }
        
        uint256 id = _transactionIdCounter++;
        transactions[id] = Transaction({
            id: id,
            transactionType: _type,
            encryptedAmount: _encryptedAmount, // FHE handle stored
            tag: _tag,
            description: _description,
            timestamp: block.timestamp,
            owner: msg.sender,
            isDeleted: false
        });
        
        userTransactions[msg.sender].push(id);
        
        emit TransactionAdded(id, msg.sender, _type, _tag);
    }
    
    /**
     * @dev Update an existing transaction with new FHE-encrypted amount
     * @param _id Transaction ID
     * @param _type Transaction type
     * @param _encryptedAmount New FHE handle (bytes32) for encrypted amount
     * @param _tag Transaction tag
     * @param _description Transaction description
     */
    function updateTransaction(
        uint256 _id,
        TransactionType _type,
        bytes32 _encryptedAmount, // FHE handle
        string memory _tag,
        string memory _description
    ) external {
        require(transactions[_id].owner == msg.sender, "Not the owner");
        require(!transactions[_id].isDeleted, "Transaction deleted");
        require(_encryptedAmount != bytes32(0), "FHE encrypted amount cannot be empty");
        
        transactions[_id].transactionType = _type;
        transactions[_id].encryptedAmount = _encryptedAmount; // FHE handle stored
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
    
    /**
     * @dev Get transaction metadata (amount is encrypted)
     * @param _id Transaction ID
     * @return id Transaction ID
     * @return transactionType Transaction type
     * @return tag Transaction tag
     * @return description Transaction description
     * @return timestamp Transaction timestamp
     * @return owner Transaction owner
     * @return isDeleted Whether transaction is deleted
     */
    function getTransactionMetadata(uint256 _id) external view returns (
        uint256 id,
        TransactionType transactionType,
        string memory tag,
        string memory description,
        uint256 timestamp,
        address owner,
        bool isDeleted
    ) {
        Transaction storage tx = transactions[_id];
        require(tx.owner != address(0), "Transaction does not exist");
        return (
            tx.id,
            tx.transactionType,
            tx.tag,
            tx.description,
            tx.timestamp,
            tx.owner,
            tx.isDeleted
        );
    }
    
    /**
     * @dev Get FHE handle for encrypted transaction amount
     * @param _id Transaction ID
     * @return encryptedAmount FHE handle (bytes32) for encrypted amount
     */
    function getEncryptedAmount(uint256 _id) external view returns (bytes32) {
        Transaction storage tx = transactions[_id];
        require(tx.owner != address(0), "Transaction does not exist");
        // Check access: owner or user with shared access
        require(
            tx.owner == msg.sender || accessControl[tx.owner][msg.sender],
            "No access to this transaction"
        );
        return tx.encryptedAmount; // Returns FHE handle
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
