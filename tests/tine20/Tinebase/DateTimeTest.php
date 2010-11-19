<?php
/**
 * Tine 2.0 - http://www.tine20.org
 * 
 * @package     Tinebase
 * @license     http://www.gnu.org/licenses/agpl.html
 * @copyright   Copyright (c) 2010 Metaways Infosystems GmbH (http://www.metaways.de)
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @version     $Id$
 */

/**
 * Test helper
 */
require_once dirname(dirname(__FILE__)) . DIRECTORY_SEPARATOR . 'TestHelper.php';

if (!defined('PHPUnit_MAIN_METHOD')) {
    define('PHPUnit_MAIN_METHOD', 'Tinebase_DateTimeTest::main');
}

/**
 * Test class for Tinebase_AsyncJob
 */
class Tinebase_DateTimeTest extends PHPUnit_Framework_TestCase
{    
    
    /**
     * Sets up the fixture.
     * This method is called before a test is executed.
     *
     * @access protected
     */
    protected function setUp() {}

    /**
     * Tears down the fixture
     * This method is called after a test is executed.
     *
     * @access protected
     */
    protected function tearDown() {}
    
    public function testConstructFromIsoString()
    {
        $dt = new Tinebase_DateTime('2010-06-25 18:04:00');
        $this->assertEquals('1277489040', $dt->getTimestamp());
        
        // after 32 Bit timestamp overflow (2038-01-19 03:14:07)
        $dt = new Tinebase_DateTime('2040-06-25 18:04:00');
        $this->assertEquals('2224260240', $dt->getTimestamp());
    }
    
    /**
     * check if exception is thrown when trying to compare against an not DateTime
     */
    public function testCompareExceptionByNoDateTime()
    {
        $dt = Tinebase_DateTime::now();
        
        $this->setExpectedException('Tinebase_Exception_Date');
        $dt->compare('2010-11-13 09:36:00');
    }
}

if (PHPUnit_MAIN_METHOD == 'Tinebase_DateTimeTest::main') {
    Tinebase_DateTimeTest::main();
}
