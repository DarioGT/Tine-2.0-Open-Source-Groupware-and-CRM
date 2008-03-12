<?php
/**
 * Tine 2.0
 * 
 * @package     Tinebase
 * @subpackage  Group
 * @license     http://www.gnu.org/licenses/agpl.html
 * @copyright   Copyright (c) 2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @author      Lars Kneschke <l.kneschke@metaways.de>
 * @version     $Id$
 */

/**
 * sql implementation of the groups interface
 * 
 * @package     Tinebase
 * @subpackage  Group
 */
class Tinebase_Group_Sql implements Tinebase_Group_Interface
{
    /**
     * the groups table
     *
     * @var Tinebase_Db_Table
     */
    protected $groupsTable;
    
    /**
     * the groupmembers table
     *
     * @var Tinebase_Db_Table
     */
    protected $groupMembersTable;
    
    /**
     * the constructor
     *
     * don't use the constructor. use the singleton 
     */
    private function __construct() {
        $this->groupsTable = new Tinebase_Db_Table(array('name' => SQL_TABLE_PREFIX . 'groups'));
        $this->groupMembersTable = new Tinebase_Db_Table(array('name' => SQL_TABLE_PREFIX . 'group_members'));
    }
    
    /**
     * don't clone. Use the singleton.
     *
     */
    private function __clone() {}

    /**
     * holdes the instance of the singleton
     *
     * @var Tinebase_Account_Sql
     */
    private static $_instance = NULL;
    
    /**
     * the singleton pattern
     *
     * @return Tinebase_Group_Sql
     */
    public static function getInstance() 
    {
        if (self::$_instance === NULL) {
            self::$_instance = new Tinebase_Group_Sql;
        }
        
        return self::$_instance;
    }    

    /**
     * return all groups an account is member of
     *
     * @param mixed $_accountId the account as integer or Tinebase_Account_Model_Account
     * @return array
     */
    public function getGroupMemberships($_accountId)
    {
        if($_account instanceof Tinebase_Account_Model_Account) {
            $accountId = $_account->accountId;
        } else {
            $accountId = (int) $_accountId;
        }
    }
    
    /**
     * get list of groupmembers
     *
     * @param int $_groupId
     * @return array
     */
    public function getGroupMembers($_groupId)
    {
    }
    
    /**
     * replace all current groupmembers with the new groupmembers list
     *
     * @param int $_groupId
     * @param array $_groupMembers
     * @return unknown
     */
    public function setGroupMembers($_groupId, $_groupMembers)
    {
    }

    /**
     * add a new groupmember to the group
     *
     * @param int $_groupId
     * @param int $_accountId
     * @return void
     */
    public function addGroupMember($_groupId, $_accountId)
    {
        $data = array(
            'group_id'      => $_groupId,
            'account_id'    => $_accountId
        );
        
        $this->groupMembersTable->insert($data);
    }

    /**
     * remove one groupmember from the group
     *
     * @param int $_groupId
     * @param int $_accountId
     * @return void
     */
    public function removeGroupMember($_groupId, $_accountId)
    {
        $where = array(
            'group_id'      => $_groupId,
            'account_id'    => $_accountId
        );
        
        $this->groupMembersTable->delete($where);
    }
    
    /**
     * create a new group
     *
     * @param string $_groupName
     * @return unknown
     */
    public function addGroup(Tinebase_Group_Model_Group $_group)
    {
        $data = $_group->toArray();
        
        if(empty($data['id'])) {
            unset($data['id']);
        }
        
        $groupId = $this->groupsTable->insert($data);
        
        if(!isset($data['id'])) {
            $_group->id = $groupId;
        }
        
        return $_group;
    }
    
    /**
     * remove group
     *
     * @param int $_groupId
     * @return unknown
     */
    public function deleteGroup($_groupId)
    {
    }
}