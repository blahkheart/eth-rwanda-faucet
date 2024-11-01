// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/extensions/AccessControlDefaultAdminRules.sol";
import "./interfaces/IETHRwandaHackerOnboard.sol";

interface IPublicLock {
    function getHasValidKey(address _user) external view returns (bool);
}

// Custom error definitions
error ExceedsMaxLocks();
error LockAddressNotFound();
error NotAdminForRole();
error LockAlreadyAdded();
error ETHTransferFailed();

contract ETHRwandaCommunityFaucetManager is AccessControlDefaultAdminRules {
    // Maximum number of locks allowed
    uint256 public constant MAX_LOCKS = 10;
    address public immutable MANAGER;
    uint256 public constant COOL_DOWN = 24 hours;
    uint256 public constant VERSION = 1.0; 

    // Array of lock addresses
    address[] private lockAddresses;

    // Mapping to store the timestamp of the last withdrawal for each user
    mapping(address => uint256) public lastWithdrawal;
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

    constructor(address _manager)
        AccessControlDefaultAdminRules(0, _manager) // Delay of 0 seconds, admin is deployer
    {
        MANAGER = _manager;
    }
    receive() external payable {}

    function withdraw(address _to) external onlyRole(FAUCET_MANAGER_ROLE) {
        (bool success, ) = _to.call{value: address(this).balance}("");
        if (!success) revert ETHTransferFailed();
        emit ETHRwETHTransfer(_to, address(this).balance);
    }
    
    /**
     * @dev Adds multiple lock addresses to the array, skipping already added addresses.
     * @param _lockAddresses The addresses of the locks to add. 
     */
    function batchAddLocks(address[] calldata _lockAddresses) external onlyRole(getRoleAdmin(FAUCET_MANAGER_ROLE)) {
        if (lockAddresses.length + _lockAddresses.length > MAX_LOCKS) revert ExceedsMaxLocks();
        for (uint256 i = 0; i < _lockAddresses.length; i++) {
            if (!_isAddressAdded(_lockAddresses[i])) {
                lockAddresses.push(_lockAddresses[i]);
                emit ETHRwLockAdded(_lockAddresses[i]);
            }
        }
    }

    function getIsHackerInitialized(uint256 _version, address _hackerAddress) public view returns (bool isInitialized_){
       isInitialized_ = IETHRwandaHackerOnboard(ETHRwandaHackerOnboardVersions[_version]).getIsHackerInitialized(_hackerAddress);
    }

    function setETHRwandaHackerOnboardAtVersion(uint256 _version, address _ethRwandaHackerOnboardAddress) external onlyRole(getRoleAdmin(FAUCET_MANAGER_ROLE)) {
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
    function addLock(address _lockAddress) external onlyRole(getRoleAdmin(DEFAULT_ADMIN_ROLE)) {
        if (lockAddresses.length == MAX_LOCKS) revert ExceedsMaxLocks();
        if(_isAddressAdded(_lockAddress)) revert LockAlreadyAdded();
        lockAddresses.push(_lockAddress);
        emit ETHRwLockAdded(_lockAddress);
    }

    /**
     * @dev Removes a single lock address from the array.
     * @param _lockAddress The address of the lock to remove.
     */
    function removeLock(address _lockAddress) external onlyRole(getRoleAdmin(FAUCET_MANAGER_ROLE)) {
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

    /**
     * @dev Checks if a user has a valid key to any of the locks.
     * @param user The address of the user.
     * @return True if the user has a valid key, false otherwise.
     */
    function hasValidKey(address user) public view returns (bool) {
        for (uint256 i = 0; i < lockAddresses.length; i++) {
            IPublicLock lock = IPublicLock(lockAddresses[i]);
            if (lock.getHasValidKey(user)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Records the withdrawal by updating the lastWithdrawal timestamp.
     *      Can be called by any address with the WITHDRAWAL_RECORDER_ROLE.
     * @param user The address of the user.
     */
    function recordWithdrawal(address user) external onlyRole(WITHDRAWAL_RECORDER_ROLE) {
        lastWithdrawal[user] = block.timestamp;
        emit ETHRwWithdrawalRecorded(user, block.timestamp);
    }

    /**
     * @dev Grants the WITHDRAWAL_RECORDER_ROLE to an address.
     *      Can only be called by addresses with the admin role.
     * @param account The address to grant the role to.
     */
    function grantWithdrawalRecorderRole(address account) external {
        if (!hasRole(getRoleAdmin(WITHDRAWAL_RECORDER_ROLE), msg.sender)) revert NotAdminForRole();
        grantRole(WITHDRAWAL_RECORDER_ROLE, account);
        emit ETHRwWithdrawalRecorderRoleGranted(account);
    }

    /**
     * @dev Revokes the WITHDRAWAL_RECORDER_ROLE from an address.
     *      Can only be called by addresses with the admin role.
     * @param account The address to revoke the role from.
     */
    function revokeWithdrawalRecorderRole(address account) external {
        if (!hasRole(getRoleAdmin(WITHDRAWAL_RECORDER_ROLE), msg.sender)) revert NotAdminForRole();
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
