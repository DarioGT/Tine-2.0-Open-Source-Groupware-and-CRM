<?php
/**
 * Tine 2.0
 *
 * @package     Addressbook
 * @subpackage  Convert
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Lars Kneschke <l.kneschke@metaways.de>
 * @copyright   Copyright (c) 2011-2011 Metaways Infosystems GmbH (http://www.metaways.de)
 *
 */

/**
 * class to convert a SOGO vcard to contact model and back again
 *
 * @package     Addressbook
 * @subpackage  Convert
 */
class Addressbook_Convert_Contact_VCard_KDE extends Addressbook_Convert_Contact_VCard_Abstract
{
    // Mozilla/5.0 (X11; Linux i686) KHTML/4.7.3 (like Gecko) Konqueror/4.7
    const HEADER_MATCH = '/Konqueror\/(?P<version>.*)/';
    
    protected $_emptyArray = array(
        'adr_one_countryname'   => null,
        'adr_one_locality'      => null,
        'adr_one_postalcode'    => null,
        'adr_one_region'        => null,
        'adr_one_street'        => null,
        'adr_one_street2'       => null,
        'adr_two_countryname'   => null,
        'adr_two_locality'      => null,
        'adr_two_postalcode'    => null,
        'adr_two_region'        => null,
        'adr_two_street'        => null,
        'adr_two_street2'       => null,
        'assistent'             => null,
        'bday'                  => null,
        #'calendar_uri'          => null,
        'email'                 => null,
        'email_home'            => null,
        'jpegphoto'             => null,
        #'freebusy_uri'          => null,
        'note'                  => null,
        'role'                  => null,
        #'salutation'            => null,
        'title'                 => null,
        'url'                   => null,
        'url_home'              => null,
        'n_family'              => null,
        'n_fileas'              => null,
        #'n_fn'                  => null,
        'n_given'               => null,
        'n_middle'              => null,
        'n_prefix'              => null,
        'n_suffix'              => null,
        'org_name'              => null,
        'org_unit'              => null,
        #'pubkey'                => null,
        'room'                  => null,
        #'tel_assistent'         => null,
        #'tel_car'               => null,
        'tel_cell'              => null,
        'tel_cell_private'      => null,
        'tel_fax'               => null,
        'tel_fax_home'          => null,
        'tel_home'              => null,
        'tel_pager'             => null,
        'tel_work'              => null,
        #'tel_other'             => null,
        #'tel_prefer'            => null,
        #'tz'                    => null,
        #'geo'                   => null,
        #'lon'                   => null,
        #'lat'                   => null,
        'tags'                  => null,
        'notes'                 => null,
    );
        
    /**
     * converts Addressbook_Model_Contact to vcard
     * 
     * @todo return all supported fields in correct format see http://forge.tine20.org/mantisbt/view.php?id=5346
     * @param  Addressbook_Model_Contact  $_record
     * @return string
     */
    public function fromTine20Model(Tinebase_Record_Abstract $_record)
    {
        if (Tinebase_Core::isLogLevel(Zend_Log::DEBUG)) Tinebase_Core::getLogger()->debug(__METHOD__ . '::' . __LINE__ . ' contact ' . print_r($_record->toArray(), true));
        
        $card = new Sabre_VObject_Component('VCARD');
        
        // required vcard fields
        $card->add(new Sabre_VObject_Property('VERSION', '3.0'));
        $card->add(new Sabre_VObject_Property('FN', $_record->n_fileas));
        $card->add(new Sabre_VObject_Element_MultiValue('N', array($_record->n_family, $_record->n_given, $_record->n_middle, $_record->n_prefix, $_record->n_suffix)));
        
        $card->add(new Sabre_VObject_Property('PRODID', '-//tine20.org//Tine 2.0//EN'));
        $card->add(new Sabre_VObject_Property('UID', $_record->getId()));

        // optional fields
        $card->add(new Sabre_VObject_Element_MultiValue('ORG', array($_record->org_name, $_record->org_unit)));
        $card->add(new Sabre_VObject_Property('TITLE', $_record->title));
        
        $tel = new Sabre_VObject_Property('TEL', $_record->tel_work);
        $tel->add('TYPE', 'WORK');
        $card->add($tel);
        
        $tel = new Sabre_VObject_Property('TEL', $_record->tel_home);
        $tel->add('TYPE', 'HOME');
        $card->add($tel);
        
        $tel = new Sabre_VObject_Property('TEL', $_record->tel_cell);
        $tel->add('TYPE', 'CELL');
        $card->add($tel);
        
        $tel = new Sabre_VObject_Property('TEL', $_record->tel_pager);
        $tel->add('TYPE', 'PAGER');
        $card->add($tel);
        
        $tel = new Sabre_VObject_Property('TEL', $_record->tel_fax);
        $tel->add('TYPE', 'FAX');
        $card->add($tel);
        
        $tel = new Sabre_VObject_Property('TEL', $_record->tel_fax_home);
        $tel->add('TYPE', 'FAX');
        $tel->add('TYPE', 'HOME');
        $card->add($tel);
        
        $tel = new Sabre_VObject_Property('TEL', $_record->tel_cell_private);
        $tel->add('TYPE', 'CELL');
        $tel->add('TYPE', 'HOME');
        $card->add($tel);
        
        $adr = new Sabre_VObject_Element_MultiValue('ADR', array(null, $_record->adr_one_street2, $_record->adr_one_street, $_record->adr_one_locality, $_record->adr_one_region, $_record->adr_one_postalcode, $_record->adr_one_countryname));
        $adr->add('TYPE', 'WORK');
        $card->add($adr);
        
        $adr = new Sabre_VObject_Element_MultiValue('ADR', array(null, $_record->adr_two_street2, $_record->adr_two_street, $_record->adr_two_locality, $_record->adr_two_region, $_record->adr_two_postalcode, $_record->adr_two_countryname));
        $adr->add('TYPE', 'HOME');
        $card->add($adr);
        
        $email = new Sabre_VObject_Property('EMAIL', $_record->email);
        $adr->add('TYPE', 'PREF');
        $card->add($email);
        
        $email = new Sabre_VObject_Property('EMAIL', $_record->email_home);
        $card->add($email);
                
        $card->add(new Sabre_VObject_Property('URL', $_record->url));
        
        $card->add(new Sabre_VObject_Property('NOTE', $_record->note));
        
        if ($_record->bday instanceof Tinebase_DateTime) {
            $bday = new Sabre_VObject_Property_DateTime('BDAY');
            $bday->setDateTime($_record->bday, Sabre_VObject_Property_DateTime::LOCAL);
            $card->add($bday);
        }
        
        if(! empty($_record->jpegphoto)) {
            try {
                $image = Tinebase_Controller::getInstance()->getImage('Addressbook', $_record->getId());
                $jpegData = $image->getBlob('image/jpeg');
                $photo = new Sabre_VObject_Property('PHOTO', $jpegData);
                $photo->add('ENCODING', 'b');
                $photo->add('TYPE', 'JPEG');
                $card->add($photo);
            } catch (Exception $e) {
                Tinebase_Core::getLogger()->info(__METHOD__ . '::' . __LINE__ . " Image for contact {$_record->getId()} not found or invalid");
            }
        
        
        }        
        if(isset($_record->tags) && count($_record->tags) > 0) {
            $card->add(new Sabre_VObject_Property('CATEGORIES', Sabre_VObject_Element_List((array) $_record->tags->name)));
        }
        
        if (Tinebase_Core::isLogLevel(Zend_Log::DEBUG)) Tinebase_Core::getLogger()->debug(__METHOD__ . '::' . __LINE__ . ' card ' . $card->serialize());
        
        return $card;
    }
        
    protected function _toTine20ModelParseEmail(&$_data, $_property)
    {
        $type = null;
        foreach($_property['TYPE'] as $typeProperty) {
            if(strtolower($typeProperty) == 'pref') {
                $type = 'work';
                break;
            }
        }
        
        switch ($type) {
            case 'work':
                $_data['email'] = $_property->value;
                break;
                
            default:
                $_data['email_home'] = $_property->value;
                break;
        
        }
    }
}
