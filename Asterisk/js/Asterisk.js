/*
 * Tine 2.0
 * 
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Thomas Wadewitz <t.wadewitz@metaways.de>
 * @copyright   Copyright (c) 2007-2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id:  $
 *
 */
 
Ext.namespace('Tine.Asterisk');

Tine.Asterisk = function() {
	
	/**
	 * builds the asterisk applications tree
	 */
    var _initialTree = [{
        text: 'Phones',
        cls: 'treemain',
        allowDrag: false,
        allowDrop: true,
        id: 'phones',
        icon: false,
        children: [],
        leaf: null,
        expanded: true,
        dataPanelType: 'phones',
        viewRight: 'phones'
    },{
        text: 'Classes',
        cls: 'treemain',
        allowDrag: false,
        allowDrop: true,
        id: 'classes',
        icon: false,
        children: [],
        leaf: null,
        expanded: true,
        dataPanelType: 'classes', 
        viewRight: 'classes'
    },{
        text: "Config",
		cls: "treemain",
		allowDrag: false,
		allowDrop: true,
		id: "config",
		icon: false,
		children: [],
		leaf: null,
		expanded: true,
		dataPanelType: "config",
		viewRight: 'config'
	},{
		text :"Lines",
		cls :"treemain",
		allowDrag :false,
		allowDrop :true,
		id :"lines",
		icon :false,
		children :[],
		leaf :null,
		expanded :true,
		dataPanelType :"lines",
		viewRight: 'lines'
	},{
		text :"Settings",
		cls :"treemain",
		allowDrag :false,
		allowDrop :true,
		id :"settings",
		icon :false,
		children :[],
		leaf :null,
		expanded :true,
		dataPanelType :"settings",
		viewRight:'settings'
	},{
		text :"Software",
		cls :"treemain",
		allowDrag :false,
		allowDrop :true,
		id :"software",
		icon :false,
		children :[],
		leaf :null,
		expanded :true,
		dataPanelType :"software",
		viewRight: 'software'
	}];

	/**
     * creates the asterisk menu tree
     *
     */
    var _getAsteriskTree = function() 
    {
        var translation = new Locale.Gettext();
        translation.textdomain('Asterisk');        
        
        var treeLoader = new Ext.tree.TreeLoader({
            dataUrl:'index.php',
            baseParams: {
                jsonKey: Tine.Tinebase.Registry.get('jsonKey'),
                method: 'Asterisk.getSubTree',
                location: 'mainTree'
            }
        });
        treeLoader.on("beforeload", function(_loader, _node) {
            _loader.baseParams.node     = _node.id;
        }, this);
    
        var treePanel = new Ext.tree.TreePanel({
            title: 'Asterisk',
            id: 'asterisk-tree',
            iconCls: 'AsteriskIconCls',
            loader: treeLoader,
            rootVisible: false,
            border: false
        });
        
        // set the root node
        var treeRoot = new Ext.tree.TreeNode({
            text: 'root',
            draggable:false,
            allowDrop:false,
            id:'root'
        });
        treePanel.setRootNode(treeRoot);

        for(var i=0; i<_initialTree.length; i++) {
        	
        	var node = new Ext.tree.AsyncTreeNode(_initialTree[i]);
    	
        	// check view right
        	if ( _initialTree[i].viewRight && !Tine.Tinebase.hasRight('view', _initialTree[i].viewRight) ) {
                node.disabled = true;
        	}
        	
            treeRoot.appendChild(node);
        }

        
        treePanel.on('click', function(_node, _event) {
        	if ( _node.disabled ) {
        		return false;
        	}
        	
        	var currentToolbar = Tine.Tinebase.MainScreen.getActiveToolbar();

        	switch(_node.attributes.dataPanelType) {
                case 'phones':
                    if(currentToolbar !== false && currentToolbar.id == 'toolbarAsteriskPhones') {
                        Ext.getCmp('gridAsteriskPhones').getStore().load({params:{start:0, limit:50}});
                    } else {
                        Tine.Asterisk.Phones.Main.show(_node);
                    }
                    
                    break;                    
            }
        }, this);

        treePanel.on('beforeexpand', function(_panel) {
            if(_panel.getSelectionModel().getSelectedNode() === null) {
                _panel.expandPath('/root');
                _panel.selectPath('/root/phones');
            }
            _panel.fireEvent('click', _panel.getSelectionModel().getSelectedNode());
        }, this);

        treePanel.on('contextmenu', function(_node, _event) {
            _event.stopEvent();
            //_node.select();
            //_node.getOwnerTree().fireEvent('click', _node);
            //console.log(_node.attributes.contextMenuClass);
            /* switch(_node.attributes.contextMenuClass) {
                case 'ctxMenuContactsTree':
                    ctxMenuContactsTree.showAt(_event.getXY());
                    break;
            } */
        });

        return treePanel;
    };
    
    // public functions and variables
    return {
        getPanel: _getAsteriskTree
    };
    
}();


Ext.namespace('Tine.Asterisk.Phones');

Tine.Asterisk.Phones.Main = {
       
	actions: {
	    addPhone: null,
	    editPhone: null,
	    deletePhone: null
	},
	
	handlers: {
	    /**
	     * onclick handler for addPhone
	     */
	    addPhone: function(_button, _event) 
	    {
	        Tine.Tinebase.Common.openWindow('contactWindow', 'index.php?method=Asterisk.editPhone&phoneId=', 450, 300);
	    },

        /**
         * onclick handler for editPhone
         */
        editPhone: function(_button, _event) 
        {
            var selectedRows = Ext.getCmp('Asterisk_Phones_Grid').getSelectionModel().getSelections();
            var phoneId = selectedRows[0].id;
            
            Tine.Tinebase.Common.openWindow('contactWindow', 'index.php?method=Asterisk.editPhone&phoneId=' + phoneId, 450, 300);
        },
        
	    /**
	     * onclick handler for deletePhone
	     */
	    deletePhone: function(_button, _event) {
	        Ext.MessageBox.confirm('Confirm', 'Do you really want to delete the selected phones?', function(_button){
	            if (_button == 'yes') {
	            
	                var phoneIds = [];
	                var selectedRows = Ext.getCmp('Asterisk_Phones_Grid').getSelectionModel().getSelections();
	                for (var i = 0; i < selectedRows.length; ++i) {
	                    phoneIds.push(selectedRows[i].id);
	                }
	                
	                phoneIds = Ext.util.JSON.encode(phoneIds);
	                
	                Ext.Ajax.request({
	                    url: 'index.php',
	                    params: {
	                        method: 'Asterisk.deletePhones',
	                        _phoneIds: phoneIds
	                    },
	                    text: 'Deleting phone(s)...',
	                    success: function(_result, _request){
	                        Ext.getCmp('Asterisk_Phones_Grid').getStore().reload();
	                    },
	                    failure: function(result, request){
	                        Ext.MessageBox.alert('Failed', 'Some error occured while trying to delete the phone.');
	                    }
	                });
	            }
	        });
	    }    
	},
	
	renderer: {
        contactTid: function(_data, _cell, _record, _rowIndex, _columnIndex, _store) {
            //switch(_data) {
            //    default:
                    return "<img src='images/oxygen/16x16/actions/user.png' width='12' height='12' alt='contact'/>";
            //}
	    }		
	},

    initComponent: function()
    {
        this.translation = new Locale.Gettext();
        this.translation.textdomain('Asterisk');
    
        this.actions.addPhone = new Ext.Action({
            text: this.translation._('add phone'),
            handler: this.handlers.addPhone,
            iconCls: 'action_addPhone',
            scope: this
        });
        
        this.actions.editPhone = new Ext.Action({
            text: this.translation._('edit phone'),
            disabled: true,
            handler: this.handlers.editPhone,
            iconCls: 'action_edit',
            scope: this
        });
        
        this.actions.deletePhone = new Ext.Action({
            text: this.translation._('delete phone'),
            disabled: true,
            handler: this.handlers.deletePhone,
            iconCls: 'action_delete',
            scope: this
        });
    },

    updateMainToolbar : function() 
    {
        var menu = Ext.menu.MenuMgr.get('Tinebase_System_AdminMenu');
        menu.removeAll();
        /*menu.add(
            {text: 'product', handler: Tine.Crm.Main.handlers.editProductSource}
        );*/

        var adminButton = Ext.getCmp('tineMenu').items.get('Tinebase_System_AdminButton');
        adminButton.setIconClass('AddressbookTreePanel');
        //if(Tine.Asterisk.rights.indexOf('admin') > -1) {
        //    adminButton.setDisabled(false);
        //} else {
            adminButton.setDisabled(true);
        //}

        var preferencesButton = Ext.getCmp('tineMenu').items.get('Tinebase_System_PreferencesButton');
        preferencesButton.setIconClass('AsteriskTreePanel');
        preferencesButton.setDisabled(true);
    },
	
    displayPhonesToolbar: function()
    {
        var onFilterChange = function(_field, _newValue, _oldValue){
            // only refresh data on new query strings
            if (_newValue != _oldValue) {
                Ext.getCmp('Asterisk_Phones_Grid').getStore().load({
                    params: {
                        start: 0,
                        limit: 50
                    }
                });
            }
        };
        
        var quickSearchField = new Ext.ux.SearchField({
            id: 'quickSearchField',
            width: 240
        }); 
        quickSearchField.on('change', onFilterChange, this);
        
        var tagFilter = new Tine.widgets.tags.TagCombo({
            app: 'Asterisk',
            blurOnSelect: true
        });
        tagFilter.on('change', onFilterChange, this);
        
        var phoneToolbar = new Ext.Toolbar({
            id: 'Asterisk_Phones_Toolbar',
            split: false,
            height: 26,
            items: [
                this.actions.addPhone, 
                this.actions.editPhone,
                this.actions.deletePhone,
                '->',
                this.translation._('Filter: '), tagFilter,
                this.translation._('Search: '), quickSearchField
            ]
        });

        Tine.Tinebase.MainScreen.setActiveToolbar(phoneToolbar);
    },

    displayPhonesGrid: function() 
    {
    	// the datastore
        var dataStore = new Ext.data.JsonStore({
            root: 'results',
            totalProperty: 'totalcount',
            id: 'id',
            fields: Tine.Asterisk.Phones.Phone,
            // turn on remote sorting
            remoteSort: true
        });
        
        dataStore.setDefaultSort('description', 'asc');

        dataStore.on('beforeload', function(_dataStore) {
            _dataStore.baseParams.query = Ext.getCmp('quickSearchField').getRawValue();
            _dataStore.baseParams.tagFilter = Ext.getCmp('TagCombo').getValue();
        }, this);   
        
        //Ext.StoreMgr.add('PhonesStore', dataStore);
        
        // the paging toolbar
        var pagingToolbar = new Ext.PagingToolbar({
            pageSize: 50,
            store: dataStore,
            displayInfo: true,
            displayMsg: this.translation._('Displaying phones {0} - {1} of {2}'),
            emptyMsg: this.translation._("No phones to display")
        }); 
        
        // the columnmodel
        var columnModel = new Ext.grid.ColumnModel([
            { resizable: true, id: 'id', header: this.translation._('Id'), dataIndex: 'id', width: 30, hidden: true },
            { resizable: true, id: 'macaddress', header: this.translation._('MAC address'), dataIndex: 'macaddress',width: 60 },
            { resizable: true, id: 'model', header: this.translation._('phone model'), dataIndex: 'model', width: 100, hidden: true },
            { resizable: true, id: 'swversion', header: this.translation._('phone sw version'), dataIndex: 'swversion', width: 80, hidden: true },
            { resizable: true, id: 'ipaddress', header: this.translation._('phone IP address'), dataIndex: 'ipaddress', width: 110 },
            { resizable: true, id: 'last_modified_time', header: this.translation._('last modified'), dataIndex: 'last_modified_time', width: 100, hidden: true },
            { resizable: true, id: 'class_id', header: this.translation._('class id'), dataIndex: 'class_id', width: 20, hidden: true },
            {
                resizable: true,
                id: 'description',
                header: this.translation._('description'),
                dataIndex: 'description',
                width: 250
            }
        ]);
        
        columnModel.defaultSortable = true; // by default columns are sortable
        
        // the rowselection model
        var rowSelectionModel = new Ext.grid.RowSelectionModel({multiSelect:true});

        rowSelectionModel.on('selectionchange', function(_selectionModel) {
            var rowCount = _selectionModel.getCount();

            if(rowCount < 1) {
                // no row selected
                this.actions.deletePhone.setDisabled(true);
                this.actions.editPhone.setDisabled(true);
            } else if(rowCount > 1) {
                // more than one row selected
                this.actions.deletePhone.setDisabled(false);
                this.actions.editPhone.setDisabled(true);
            } else {
                // only one row selected
                this.actions.deletePhone.setDisabled(false);
                this.actions.editPhone.setDisabled(false);
            }
        }, this);
        
        // the gridpanel
        var gridPanel = new Ext.grid.GridPanel({
            id: 'Asterisk_Phones_Grid',
            store: dataStore,
            cm: columnModel,
            tbar: pagingToolbar,     
            autoSizeColumns: false,
            selModel: rowSelectionModel,
            enableColLock:false,
            loadMask: true,
            autoExpandColumn: 'description',
            border: false,
            view: new Ext.grid.GridView({
                autoFill: true,
                forceFit:true,
                ignoreAdd: true,
                emptyText: 'No phones to display'
            })            
            
        });
        
        gridPanel.on('rowcontextmenu', function(_grid, _rowIndex, _eventObject) {
            _eventObject.stopEvent();
            if(!_grid.getSelectionModel().isSelected(_rowIndex)) {
                _grid.getSelectionModel().selectRow(_rowIndex);
            }
            var contextMenu = new Ext.menu.Menu({
		        id:'ctxMenuPhones', 
		        items: [
		            this.actions.editPhone,
		            this.actions.deletePhone,
		            '-',
		            this.actions.addPhone 
		        ]
		    });
            contextMenu.showAt(_eventObject.getXY());
        }, this);
        
        gridPanel.on('rowdblclick', function(_gridPar, _rowIndexPar, ePar) {
            var record = _gridPar.getStore().getAt(_rowIndexPar);
            //console.log('id: ' + record.data.id);
            try {
                Tine.Tinebase.Common.openWindow('contactWindow', 'index.php?method=Asterisk.editPhone&phoneId=' + record.data.id, 450, 300);
            } catch(e) {
                // alert(e);
            }
        }, this);

        gridPanel.on('keydown', function(e){
             if(e.getKey() == e.DELETE && Ext.getCmp('Asterisk_Phones_Grid').getSelectionModel().getCount() > 0){
                 this.handlers.deletePhone();
             }
        }, this);

        // add the grid to the layout
        Tine.Tinebase.MainScreen.setActiveContentPanel(gridPanel);
    },
    
    /**
     * update datastore with node values and load datastore
     */
    loadData: function(_node)
    {
        var dataStore = Ext.getCmp('Asterisk_Phones_Grid').getStore();
        
        console.log(_node);
        
        // we set them directly, because this properties also need to be set when paging
        switch(_node.attributes.dataPanelType) {
            case 'phones':
                dataStore.baseParams.method = 'Asterisk.getPhones';
                break;
        }
        
        dataStore.load({
            params:{
                start:0, 
                limit:50 
            }
        });
    },

    show: function(_node) 
    {
console.log(_node);        
        var currentToolbar = Tine.Tinebase.MainScreen.getActiveToolbar();

        if(currentToolbar === false || currentToolbar.id != 'Asterisk_Phones_Toolbar') {
            this.initComponent();
            this.displayPhonesToolbar();
            this.displayPhonesGrid();
            this.updateMainToolbar();
        }
        this.loadData(_node);
    },
    
    reload: function() 
    {
        if(Ext.ComponentMgr.all.containsKey('Asterisk_Phones_Grid')) {
            setTimeout ("Ext.getCmp('Asterisk_Phones_Grid').getStore().reload()", 200);
        }
    }
};


Tine.Asterisk.Phones.EditDialog =  {

    	phoneRecord: null,
    	
    	updatePhoneRecord: function(_phoneData)
    	{
            if(_phoneData.last_modified_time && _phoneData.last_modified_time !== null) {
                _phoneData.last_modified_time = Date.parseDate(_phoneData.last_modified_time, 'c');
            }
            this.phoneRecord = new Tine.Asterisk.Phones.Phone(_phoneData);
    	},
    	
    	deletePhone: function(_button, _event)
    	{
	        var phoneIds = Ext.util.JSON.encode([this.phoneRecord.get('id')]);
	            
	        Ext.Ajax.request({
	            url: 'index.php',
	            params: {
	                method: 'Asterisk.deletePhones', 
	                phoneIds: phoneIds
	            },
	            text: 'Deleting phone...',
	            success: function(_result, _request) {
	                window.opener.Tine.Asterisk.Phones.Main.reload();
	                window.close();
	            },
	            failure: function ( result, request) { 
	                Ext.MessageBox.alert('Failed', 'Some error occured while trying to delete the phone.'); 
	            } 
	        });    		
    	},
    	
        applyChanges: function(_button, _event, _closeWindow) 
        {
        	var form = Ext.getCmp('asterisk_editPhoneForm').getForm();

        	if(form.isValid()) {
        		form.updateRecord(this.phoneRecord);
	    
	            Ext.Ajax.request({
	                params: {
	                    method: 'Asterisk.savePhone', 
	                    phoneData: Ext.util.JSON.encode(this.phoneRecord.data)
	                },
	                success: function(_result, _request) {
	                	if(window.opener.Tine.Asterisk.Phones) {
                            window.opener.Tine.Asterisk.Phones.Main.reload();
	                	}
                        if(_closeWindow === true) {
                            window.close();
                        } else {
		                	this.updatePhoneRecord(Ext.util.JSON.decode(_result.responseText).updatedData);
		                	this.updateToolbarButtons();
		                	form.loadRecord(this.phoneRecord);
                        }
	                },
	                failure: function ( result, request) { 
	                    Ext.MessageBox.alert('Failed', 'Could not save phone.'); 
	                },
	                scope: this 
	            });
	        } else {
	            Ext.MessageBox.alert('Errors', 'Please fix the errors noted.');
	        }
    	},

        saveChanges: function(_button, _event) 
        {
        	this.applyChanges(_button, _event, true);
        },
        
        editPhoneDialog: [{
            layout:'form',
            //frame: true,
            border:false,
            width: 440,
            height: 280,
            items: [{
                    xtype: 'textfield',
                    fieldLabel: 'MAC Address',
                    name: 'macaddress',
                    maxLength: 12,
                    anchor:'100%',
                    allowBlank: false
                }, {
                    xtype: 'combo',
                    fieldLabel: 'Phone Model',
                    name: 'model',
                    mode: 'local',
                    displayField:'model',
                    valueField:'key',
                    anchor:'100%',                    
                    triggerAction: 'all',
                    allowBlank: false,
                    editable: false,
                    store: new Ext.data.SimpleStore(
                        {
                            fields: ['key','model'],
                            data: [
                                ['snom300','snom300'],
                                ['snom320','snom320']
                            ]
                        }
                    )
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Phone SW Version',
                    name: 'swversion',
                    maxLength: 40,
                    anchor:'100%',                    
                    allowBlank: false
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Phone IP Address',
                    name: 'ipaddress',
                    maxLength: 20,
                    anchor:'100%',  
                    readOnly: true
                }, {
                    labelSeparator: '',
                    xtype:'textarea',
                    name: 'description',
                    fieldLabel: 'Description',
                    grow: false,
                    preventScrollbars:false,
                    anchor:'100%',
                    height: 150
                }]
        }],
        
        updateToolbarButtons: function()
        {
            if(this.phoneRecord.get('id') > 0) {
                Ext.getCmp('asterisk_editPhoneForm').action_delete.enable();
            }
        },
        
        display: function(_phoneData) 
        {       	
            // Ext.FormPanel
		    var dialog = new Tine.widgets.dialog.EditRecord({
		        id : 'asterisk_editPhoneForm',
		        //title: 'the title',
		        labelWidth: 120,
                labelAlign: 'side',
                handlerScope: this,
                handlerApplyChanges: this.applyChanges,
                handlerSaveAndClose: this.saveChanges,
                handlerDelete: this.deletePhone,
		        items: this.editPhoneDialog
		    });

            var viewport = new Ext.Viewport({
                layout: 'border',
                frame: true,
                //height: 300,
                items: dialog
            });
	        
	        //if (!arguments[0]) var task = {};
            this.updatePhoneRecord(_phoneData);
            this.updateToolbarButtons();           
	        dialog.getForm().loadRecord(this.phoneRecord);
        }
   
};

Tine.Asterisk.Phones.Phone = Ext.data.Record.create([
    {name: 'id'},
    {name: 'macaddress'},
    {name: 'model'},
    {name: 'swversion'},
    {name: 'ipaddress'},
    {name: 'last_modified_time'},
    {name: 'class_id'},
    {name: 'description'}
]);
