<?php
/**
 * Tine 2.0
 *
 * @package     Felamimail
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Lars Kneschke <l.kneschke@metaways.de>
 * @copyright   Copyright (c) 2009 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id$
 * 
 * @todo        add Tinebase_Record_Abstract Message or make Message a tine record?
 */

/**
 * message model for Felamimail
 *
 * @package     Felamimail
 * @subpackage  Model
 */
class Felamimail_Message extends Zend_Mail_Message 
{    
    /**
     * Public constructor
     *
     * In addition to the parameters of Zend_Mail_Message::__construct() this constructor supports:
     * - uid  use UID FETCH if ftru
     *
     * @param  array $params  list of parameters
     * @throws Zend_Mail_Exception
     */
    public function __construct(array $params)
    {
        if (isset($params['uid'])) {
            $this->_useUid = (bool)$params['uid'];
        }
        
        parent::__construct($params);
    }
    
    /**
     * get message body
     *
     * @param string $_contentType
     * @return string
     */
    public function getBody($_contentType)
    {
        $part = null;
        
        if($this->isMultipart()) {
            foreach (new RecursiveIteratorIterator($this) as $messagePart) {
                $contentType    = $messagePart->getHeaderField('content-type', 0);
                if($contentType == $_contentType) {
                    $part = $messagePart;
                    break;
                }
            }
        } else {
            $part = $this;
        }
        
        if($part === null) {
            return "no text part found";
        }
        
        $content = $part->getContent();
        
        try {
            $encoding       = $part->getHeaderField('content-transfer-encoding');
        } catch(Zend_Mail_Exception $e) {
            $encoding       = null;
        }
        
        switch (strtolower($encoding)) {
            case Zend_Mime::ENCODING_QUOTEDPRINTABLE:
                $content = quoted_printable_decode($content);
                break;
            case Zend_Mime::ENCODING_BASE64:
                $content = base64_decode($content);
                break;
        }
        
        
        try {
            $charset        = $part->getHeaderField('content-type', 'charset');
        } catch(Zend_Mail_Exception $e) {
            Tinebase_Core::getLogger()->debug(__METHOD__ . '::' . __LINE__ . " no charset header found. assume iso-8859-1");
            $charset        = 'iso-8859-1';
        }
        
        if(strtolower($charset) != 'utf-8') {
            $content = iconv($charset, 'utf-8', $content);
        }
        
        return $content;
    }
    
    /**
     * parse address list
     *
     * @param unknown_type $_adressList
     * @return array
     */
    public static function parseAdresslist($_addressList)
    {
        $stream = fopen("php://temp", 'r+');
        fputs($stream, $_addressList);
        rewind($stream);
        
        $addresses = fgetcsv($stream);
        
        foreach($addresses as $key => $address) {
            if(preg_match('/(.*)<(.+@[^@]+)>/', $address, $matches)) {
                $addresses[$key] = array('name' => trim(trim($matches[1]), '"'), 'address' => trim($matches[2]));
            } else {
                $addresses[$key] = array('name' => null, 'address' => $address);
            }
        }

        return $addresses;
    }

    /**
     * convert text
     *
     * @param string $_string
     * @param boolean $_isHeader (if not, use base64 decode)
     * @return string
     * 
     * @todo make it work for message body (use table for quoted printables?)
     */
    public static function convertText($_string, $_isHeader = TRUE)
    {
        $string = $_string;
        if(preg_match('/=?[\d,\w,-]*?[q,Q,b,B]?.*?=/', $string)) {
            $string = preg_replace('/(=[1-9,a-f]{2})/e', "strtoupper('\\1')", $string);
            if ($_isHeader) {
                $string = iconv_mime_decode($string, 2);
            } else {
                //$string = imap_base64($string);
                //$string = base64_decode($string);
            }
        }
        
        return $string;
    }
}
