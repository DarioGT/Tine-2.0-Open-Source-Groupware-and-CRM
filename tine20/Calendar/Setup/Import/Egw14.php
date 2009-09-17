<?php
/**
 * Tine 2.0
 * 
 * @package     Calendar
 * @subpackage  Setup
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @copyright   Copyright (c) 2009 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id$ 
 */

/**
 * class to import calendars/events from egw14
 * 
 * @package     Calendar
 * @subpackage  Setup
 */
class Calendar_Setup_Import_Egw14 {
    
    /**
     * @var Zend_Db_Adapter_Abstract
     */
    protected $_egwDb = NULL;
    
    /**
     * @var Zend_Config
     */
    protected $_config = NULL;
    
    /**
     * constructs a calendar import for egw14 data
     * 
     * @param Zend_Db_Adapter_Abstract  $_egwDb
     * @param Zend_Config               $_config
     */
    public function __construct($_egwDb, $_config)
    {
        $this->_egwDb  = $_egwDb;
        $this->_config = $_config;
        
        $this->_migrationStartTime = Zend_Date::now();
        
        $eventPage = $this->_getRawEgwEventPage(1, 1);
        
        
        foreach ($eventPage as $egwEventData) {
            print_r($egwEventData);
            $event = $this->_getTineEventRecord($egwEventData);
        }
    }
    
    protected function _getTineEventRecord($_egwEventData)
    {
        // basic datas
        $tineEventData = array(
            'id'           => $_egwEventData['cal_id'],
            'uid'           => substr($_egwEventData['cal_uid'], 0, 40),
            'creation_time' => $_egwEventData['cal_modified'],
            'created_by'    => $_egwEventData['cal_modifier'],
            // 'tags'
            'summary'       => $_egwEventData['cal_title'],
            'description'   => $_egwEventData['cal_description'],
            'location'      => $_egwEventData['cal_location'],
            'transp'        => $_egwEventData['cal_non_blocking'] ? Calendar_Model_Event::TRANSP_TRANSP : Calendar_Model_Event::TRANSP_OPAQUE,
            'priority'      => $this->getPriority($_egwEventData['cal_priority']),
            // 'class_id'
        );
        
        // find calendar
        $tineEventData['container_id'] = $_egwEventData['cal_public'] ? 
            $this->_getPersonalCalendar($_egwEventData['cal_owner'])->getId() :
            $this->_getPrivateCalendar($_egwEventData['cal_owner'])->getId();
            
        // manage attendee
        
        // manage recuring
        
        print_r($tineEventData);
        //$rrule = 
    }
    
    /**
     * gets the personal calendar of given user
     * 
     * @param  string $_userId
     * @return Tinebase_Model_Container
     */
    protected function _getPersonalCalendar($_userId)
    {
        // get calendar by preference to ensure its the default personal
        $defaultCalendarId = Tinebase_Core::getPreference('Calendar')->getValueForUser(Calendar_Preference::DEFAULTCALENDAR, $_userId, Tinebase_Acl_Rights::ACCOUNT_TYPE_USER);
        $calendar = Tinebase_Container::getInstance()->getContainerById($defaultCalendarId);
        
        // detect if container just got created
        $isNewContainer = false;
        if ($calendar->creation_time instanceof Zend_Date) {
            $isNewContainer = $this->_migrationStartTime->isEarlier($calendar->creation_time);
        }
        
        if (($isNewContainer && $this->_config->setPersonalCalendarGrants) || $this->_config->forcePersonalCalendarGrants) {
            // resolve grants based on user/groupmemberships
            $grants = $this->getGrantsByOwner('Calendar', $_userId);
            Tinebase_Container::getInstance()->setGrants($calendar->getId(), $grants, TRUE);
        }
        
        return $calendar;
    }
    
    /**
     * gets a personal container for private events
     * 
     * NOTE: During migration phase, this container is identified by its name
     * 
     * @param  string $_userId
     * @return Tinebase_Model_Container
     */
    protected function _getPrivateCalendar($_userId)
    {
        $privateString = 'private events';
        
        $personalCalendars = Tinebase_Container::getInstance()->getPersonalContainer($_userId, 'Calendar', $_userId, Tinebase_Model_Container::GRANT_ADMIN, TRUE);
        $privateCalendar = $personalCalendars->filter('name', $privateString);
        
        if (count($privateCalendar) < 1) {
            $container = new Tinebase_Model_Container(array(
                'name'           => $privateString,
                'type'           => Tinebase_Model_Container::TYPE_PERSONAL,
                'application_id' => Tinebase_Application::getInstance()->getApplicationByName('Calendar')->getId(),
                'backend'        => 'sql',
            ));
            
            // NOTE: if no grants are given, container class gives all grants to accountId
            $privateCalendar = Tinebase_Container::getInstance()->addContainer($container, NULL, TRUE, $_userId);
        } else {
            $privateCalendar = $personalCalendars->getFirstRecord();
        }
        
        return $privateCalendar;
    }
    
    /**
     * gets a page of raw egw event data
     * 
     * @param  int $pageNumber
     * @param  int $pageSize
     * @return array
     */
    protected function _getRawEgwEventPage($pageNumber, $pageSize)
    {
        // get base event data
        $select = $this->_egwDb->select()
            ->from(array('events' => 'egw_cal'))
            ->join(array('dates'  => 'egw_cal_dates'), 'events.cal_id = dates.cal_id', array('MIN(cal_start) AS cal_start', 'MIN(cal_end) AS cal_end'))
            ->where($this->_egwDb->quoteInto($this->_egwDb->quoteIdentifier('cal_reference') . ' = ?', 0))
            //->where('cal_owner = ' . 3144)
            //->where('events.cal_id = ' . 414)
            ->where('events.cal_id = ' . 1241)
            ->group('cal_id')
            ->limitPage($pageNumber, $pageSize);
            
        $eventPage = $this->_egwDb->fetchAll($select, NULL, Zend_Db::FETCH_ASSOC);
        $eventPageIdMap = array();
        foreach ($eventPage as $idx => $egwEventData) {
            $eventPageIdMap[$egwEventData['cal_id']] = $idx;
            // preset attendee and rrule
            $egwEventData['attendee'] = array();
            $egwEventData['rrule'] = NULL;
        }
        
        // collect attendee
        $select = $this->_egwDb->select()
            ->from(array('attendee' => 'egw_cal_user')/*, array('*', 'COUNT(cal_recur_date) AS status_count')*/)
            //->group(array('cal_id', 'cal_user_type', 'cal_user_id', 'cal_status'))
            ->joinLeft(array('contacts' => 'egw_addressbook'), 
                $this->_egwDb->quoteInto($this->_egwDb->quoteIdentifier('attendee.cal_user_type') . ' = ?', 'c') . ' AND ' .
                $this->_egwDb->quoteIdentifier('attendee.cal_user_id') . ' = ' . $this->_egwDb->quoteIdentifier('contacts.contact_id'), 
                array('contacts.contact_email AS email'))
            ->where($this->_egwDb->quoteInto($this->_egwDb->quoteIdentifier('cal_recur_date') . ' = ?', 0))
            ->where($this->_egwDb->quoteInto($this->_egwDb->quoteIdentifier('cal_id') . ' IN (?)', array_keys($eventPageIdMap)));
        
        $eventPageAttendee = $this->_egwDb->fetchAll($select, NULL, Zend_Db::FETCH_ASSOC);
        
        foreach ($eventPageAttendee as $eventAttendee) {
            $idx = $eventPageIdMap[$eventAttendee['cal_id']];
            $eventPage[$idx]['attendee'][] = $eventAttendee;
        }
        unset($eventPageAttendee);
        
        // collect rrules
        $select = $this->_egwDb->select()
            ->from(array('rrule' => 'egw_cal_repeats'))
            ->where($this->_egwDb->quoteInto('cal_id IN (?)', array_keys($eventPageIdMap)));
        
        $eventPageRrules = $this->_egwDb->fetchAll($select, NULL, Zend_Db::FETCH_ASSOC);
        
        foreach ($eventPageRrules as $eventRrule) {
            $idx = $eventPageIdMap[$eventRrule['cal_id']];
            $eventPage[$idx]['rrule'] = $eventRrule;
        }
        unset($eventPageRrules);
        
        return $eventPage;
    }
    
    
    
    
    
    
    
    /**************************** generic stuff *******************************/
    
    /**
     * map egwPriority => tine prioroty
     * 
     * @see etemplate/inc/class.select_widget.inc.php
     * @var array
     */
    protected $_priorityMap = array(
        0 => NULL,  // not set
        1 => 0,     // low
        2 => 1,     // normaml
        3 => 2,     // high
    );
    
    /**
     * map egwGrant => tine grant
     * 
     * @todo   move to a generic egw import helper
     * @see phpgwapi/inc/class.egw.inc.php
     * @var array
     */
    protected $_grantMap = array(
        1 => Tinebase_Model_Container::READGRANT,
        2 => Tinebase_Model_Container::ADDGRANT,
        4 => Tinebase_Model_Container::EDITGRANT,
        8 => Tinebase_Model_Container::DELETEGRANT,
    );
    
    /**
     * converts egw -> tine priority
     * 
     * @param  int $_egwPrio
     * @return mixed
     */
    public function getPriority($_egwPrio)
    {
        return $this->_priorityMap[(int) $_egwPrio];
    }
    
    /**
     * returns grants by owner
     * 
     * eGW has owner based grants whereas Tine 2.0 has container based grants.
     * this class reads the egw owner grants and converts them into Tine 2.0 grants
     * attacheable to a tine 2.0 container
     * 
     * @todo   move to a generic egw import helper
     * 
     * @param  string $_application
     * @param  string $_accountId
     * @return Tinebase_Record_RecordSet of Tinebase_Model_Grant
     * @throws Tinebase_Exception_NotFound
     */
    public function getGrantsByOwner($_application, $_accountId)
    {
        $acl_account = array($_accountId);
        
        if ($_accountId > 0) {
            $user     = Tinebase_User::getInstance()->getUserById($_accountId);
            $groupIds = $user->getGroupMemberships();
            
            
            foreach($groupIds as $groupId) {
                $acl_account[] = '-' . $groupId;
            }
        }
        
        $select = $this->_egwDb->select()
            ->from(array('grants' => 'egw_acl'))
            ->where($this->_egwDb->quoteInto($this->_egwDb->quoteIdentifier('acl_appname') . ' = ?', $_application))
            ->where($this->_egwDb->quoteInto($this->_egwDb->quoteIdentifier('acl_account') . ' IN (?)', $acl_account));
            
        $egwGrantDatas = $this->_egwDb->fetchAll($select, NULL, Zend_Db::FETCH_ASSOC);
        //print_r($egwGrantDatas);
        
        // in a first run we merge grants from different sources
        $effectiveGrants = array();
        if ($_accountId > 0) {
            // owner has implicitly all grants in egw
            $effectiveGrants[$_accountId] = 15;
        }
        foreach ($egwGrantDatas as $egwGrantData) {
            // grants are int != 0
            if ( (int) $egwGrantData['acl_location'] == 0) {
                continue;
            }
            
            // NOTE: The grant source is not resolveable in Tine 2.0!
            //       In Tine 2.0 grants are directly given to a container
            $grantsSource      = $egwGrantData['acl_account'];
            $grantsDestination = $egwGrantData['acl_location'];
            $grantsGiven       = $egwGrantData['acl_rights'];
            
            if (! array_key_exists($grantsDestination, $effectiveGrants)) {
                $effectiveGrants[$grantsDestination] = 0;
            }
            $effectiveGrants[$grantsDestination] |= $grantsGiven;
        }
        //print_r($effectiveGrants);
        
        // convert to tine grants
        $tineGrants = new Tinebase_Record_RecordSet('Tinebase_Model_Grants');
        foreach ($effectiveGrants as $grantAccount => $egwGrants) {
            $tineGrant = new Tinebase_Model_Grants(array(
                'account_id' => abs($grantAccount),
                'account_type' => (int) $grantAccount > 0 ? 
                    Tinebase_Acl_Rights::ACCOUNT_TYPE_USER : 
                    Tinebase_Acl_Rights::ACCOUNT_TYPE_GROUP
            ));
            
            foreach ($this->_grantMap as $egwGrant => $tineGrantString) {
                $tineGrant->{$tineGrantString} = (bool) ($egwGrants & $egwGrant);
            }
            
            // the owner also gets admin grants
            if ($_accountId > 0 && $grantAccount == $_accountId) {
                $tineGrant->{Tinebase_Model_Container::ADMINGRANT} = TRUE;
            }
            
            $tineGrants->addRecord($tineGrant);
        }
        //print_r($tineGrants->toArray());
        
        // for group owners (e.g. group addressbooks) we need an container admin
        if ($_accountId < 0) {
            $adminGroup = Tinebase_Group::getInstance()->getDefaultAdminGroup();
            $tineGrant = new Tinebase_Model_Grants(array(
                'account_id' => abs($_accountId),
                'account_type' => Tinebase_Acl_Rights::ACCOUNT_TYPE_GROUP
            ));
            $tineGrant->{Tinebase_Model_Container::ADMINGRANT} = TRUE;
            
            $tineGrants->addRecord($tineGrant);
        }
        
        return $tineGrants;
    }
}