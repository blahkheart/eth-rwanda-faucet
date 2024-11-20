// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/extensions/AccessControlDefaultAdminRules.sol";
import "./interfaces/IETHRwandaHackerOnboard.sol";

interface IPublicLock {
    function getHasValidKey(address _user) external view returns (bool);
    function tokenOfOwnerByIndex(address _user, uint256 _index) external view returns (uint256);
}

// Custom error definitions
error ExceedsMaxLocks();
error LockAddressNotFound();
error NoValidKeyForUserFound();
error NotAdminForRole();
error LockAlreadyAdded();
error ETHTransferFailed();
error ETHRwHackerOnboardNotFound(); 
error NotFaucetAdmin();
error NotFaucetManager();
error NotWithdrawalRecorder();
contract ETHRwandaCommunityFaucetManager is AccessControlDefaultAdminRules {
    // Maximum number of locks allowed
    uint256 public constant MAX_LOCKS = 10;
    address public immutable MANAGER;
    uint256 public COOL_DOWN = 24 hours;
    uint256 public constant VERSION = 1; 

    // Array of lock addresses
    address[] private lockAddresses;
    address public faucetWalletAddress;

    // Mapping to store the timestamp of the last withdrawal for each user
    mapping(address => uint256) public lastWithdrawal;
    mapping(uint256 => uint256) public lastWithdrawalByTokenId;
    mapping(uint256 => address) public ETHRwandaHackerOnboardVersions;

    // Define a role identifier for the withdrawal recorder role
    bytes32 public constant WITHDRAWAL_RECORDER_ROLE = keccak256("WITHDRAWAL_RECORDER_ROLE");
    bytes32 public constant FAUCET_MANAGER_ROLE = keccak256("FAUCET_MANAGER_ROLE");

    // Event definitions
    event ETHRwLockAdded(address indexed lockAddress);
    event ETHRwLockRemoved(address indexed lockAddress);
    event ETHRwWithdrawalRecorded(address indexed user, uint256 timestamp);
    event ETHRwWithdrawalRecorderRoleGranted(address indexed account);
    event ETHRwWithdrawalRecorderRoleRevoked(address indexed account);
    event ETHRwETHRwandaHackerOnboardVersionSet(uint256 version, address indexed onboardAddress);
    event ETHRwETHTransfer(address indexed to, uint256 amount);

    constructor(address _manager, uint256 _version, address _ethRwandaHackerOnboardAddress, address _faucetWalletAddress)
        AccessControlDefaultAdminRules(0, _manager) // Delay of 0 seconds, admin is deployer
    {
        MANAGER = _manager;
        ETHRwandaHackerOnboardVersions[_version] = _ethRwandaHackerOnboardAddress;
        faucetWalletAddress = _faucetWalletAddress;
    }

    modifier onlyFaucetAdmin() {
        if (!hasRole(getRoleAdmin(DEFAULT_ADMIN_ROLE), msg.sender)) revert NotFaucetAdmin();
        _;
    }

    modifier onlyFaucetManager() {
        if (!hasRole(getRoleAdmin(FAUCET_MANAGER_ROLE), msg.sender)) revert NotFaucetManager();
        _;
    }

    modifier onlyWithdrawalRecorder() {
        if (!hasRole(getRoleAdmin(WITHDRAWAL_RECORDER_ROLE), msg.sender)) revert NotWithdrawalRecorder();
        _;
    }
    receive() external payable {}

    function withdraw(address _to) external onlyFaucetManager {
        (bool success, ) = _to.call{value: address(this).balance}("");
        if (!success) revert ETHTransferFailed();
        emit ETHRwETHTransfer(_to, address(this).balance);
    }
    function setFaucetWalletAddress(address _newFaucetWalletAddress) external onlyFaucetManager {
        faucetWalletAddress = _newFaucetWalletAddress;
    }

    function setCoolDown(uint256 _newCoolDown) external onlyFaucetAdmin {
        COOL_DOWN = _newCoolDown;
    }

    /**
     * @dev Adds multiple lock addresses to the array, skipping already added addresses.
     * @param _lockAddresses The addresses of the locks to add. 
     */
    function batchAddLocks(address[] calldata _lockAddresses) external onlyFaucetManager {
        if (lockAddresses.length + _lockAddresses.length > MAX_LOCKS) revert ExceedsMaxLocks();
        for (uint256 i = 0; i < _lockAddresses.length; i++) {
            if (!_isAddressAdded(_lockAddresses[i])) {
                lockAddresses.push(_lockAddresses[i]);
                emit ETHRwLockAdded(_lockAddresses[i]);
            }
        }
    }

    function getIsHackerInitialized(uint256 _version, address _hackerAddress) public view returns (bool isInitialized_) {
        if (ETHRwandaHackerOnboardVersions[_version] == address(0)) revert ETHRwHackerOnboardNotFound();
        isInitialized_ = IETHRwandaHackerOnboard(ETHRwandaHackerOnboardVersions[_version]).getIsHackerInitialized(_hackerAddress);
    }

    function setETHRwandaHackerOnboardAtVersion(uint256 _version, address _ethRwandaHackerOnboardAddress) external onlyFaucetManager {
        ETHRwandaHackerOnboardVersions[_version] = _ethRwandaHackerOnboardAddress;
        emit ETHRwETHRwandaHackerOnboardVersionSet(_version, _ethRwandaHackerOnboardAddress);
    }

    /**
     * @dev Checks if a lock address is already added.
     * @param _lockAddress The address of the lock to check.
     * @return True if the address is already added, false otherwise.
     */
    function _isAddressAdded(address _lockAddress) internal view returns (bool) {
        for (uint256 i = 0; i < lockAddresses.length; i++) {
            if (lockAddresses[i] == _lockAddress) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Adds a single lock address to the array.
     * @param _lockAddress The address of the lock to add.
     */
    function addLock(address _lockAddress) external onlyFaucetManager {
        if (lockAddresses.length == MAX_LOCKS) revert ExceedsMaxLocks();
        if(_isAddressAdded(_lockAddress)) revert LockAlreadyAdded();
        lockAddresses.push(_lockAddress);
        emit ETHRwLockAdded(_lockAddress);
    }

    /**
     * @dev Removes a single lock address from the array.
     * @param _lockAddress The address of the lock to remove.
     */
    function removeLock(address _lockAddress) external onlyFaucetManager {
        uint256 index = _findLockIndex(_lockAddress);
        if (index >= lockAddresses.length) revert LockAddressNotFound();

        // Remove the lock address by swapping it with the last element and popping it
        lockAddresses[index] = lockAddresses[lockAddresses.length - 1]; 
        lockAddresses.pop();
        emit ETHRwLockRemoved(_lockAddress);
    }

    /**
     * @dev Finds the index of a lock address in the array.
     * @param lockAddress The address of the lock to find.
     * @return The index of the lock in the array.
     */
    function _findLockIndex(address lockAddress) internal view returns (uint256) {
        for (uint256 i = 0; i < lockAddresses.length; i++) {
            if (lockAddresses[i] == lockAddress) {
                return i;
            }
        }
        return lockAddresses.length; // Not found
    }

    /**
     * @dev Checks if a user is able to withdraw based on the 24-hour cooldown.
     * @param user The address of the user.
     * @return True if the user can withdraw, false otherwise.
     */
    function isAbleToWithdraw(address user) public view returns (bool) {
        return (block.timestamp - lastWithdrawal[user]) >  COOL_DOWN;
    }

    function isTokenIdAbleToWithdraw(uint256 tokenId) public view returns (bool) {
        return (block.timestamp - lastWithdrawalByTokenId[tokenId]) >  COOL_DOWN;
    }

    /**
     * @dev Checks if a user has a valid key to any of the locks.
     * @param user The address of the user.
     * @return True if the user has a valid key, false otherwise.
     */
    function hasValidKey(address user) public view returns (bool) {
        if (lockAddresses.length == 0) return false;
        for (uint256 i = 0; i < lockAddresses.length; i++) {
            IPublicLock lock = IPublicLock(lockAddresses[i]);
            if (lock.getHasValidKey(user)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Returns the address of the first lock for which the user has a valid key.
     * @param user The address of the user.
     * @return The address of the first valid lock, or address(0) if none found.
     */
    function getFirstValidKeyLockAddress(address user) public view returns (address) {
        for (uint256 i = 0; i < lockAddresses.length; i++) {
            if (IPublicLock(lockAddresses[i]).getHasValidKey(user)) return lockAddresses[i]; 
        }
        return address(0); // Return address(0) if no valid lock is found
    }

    /**
     * @dev Records the withdrawal by updating the lastWithdrawal timestamp.
     * Can be called by any address with the WITHDRAWAL_RECORDER_ROLE.
     * @param _user The address of the user.
     * @param _tokenId The token ID/ key of the lock.
     */
    function recordWithdrawal(address _user, uint256 _tokenId) external onlyWithdrawalRecorder {
        lastWithdrawal[_user] = block.timestamp;
        lastWithdrawalByTokenId[_tokenId] = block.timestamp;
        emit ETHRwWithdrawalRecorded(_user, block.timestamp);
    }

    /**
     * @dev Grants the WITHDRAWAL_RECORDER_ROLE to an address.
     *      Can only be called by addresses with the admin role.
     * @param account The address to grant the role to.
     */
    function grantWithdrawalRecorderRole(address account) external onlyFaucetManager {
        grantRole(WITHDRAWAL_RECORDER_ROLE, account);
        emit ETHRwWithdrawalRecorderRoleGranted(account);
    }

    /**
     * @dev Revokes the WITHDRAWAL_RECORDER_ROLE from an address.
     *      Can only be called by addresses with the admin role.
     * @param account The address to revoke the role from.
     */
    function revokeWithdrawalRecorderRole(address account) external onlyFaucetManager {
        revokeRole(WITHDRAWAL_RECORDER_ROLE, account);
        emit ETHRwWithdrawalRecorderRoleRevoked(account);
    }

    /**
     * @dev Gets the list of lock addresses.
     * @return An array of lock addresses.
     */
    function getLockAddresses() external view returns (address[] memory) {
        return lockAddresses;
    }
}
