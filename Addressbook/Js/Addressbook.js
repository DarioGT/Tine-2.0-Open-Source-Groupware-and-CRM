Ext.namespace("Egw.Addressbook");Egw.Addressbook=function(){var f;var o=true;var V=false;var O;var I;var D=function(H){if(!O){O=Ext.getCmp("contact-tree").getSelectionModel().getSelectedNode();}H.baseParams.datatype=O.attributes.datatype;H.baseParams.owner=O.attributes.owner;switch(O.attributes.datatype){case "list":H.baseParams.listId=O.attributes.listId;H.baseParams.method="Addressbook.getList";break;case "contacts":case "otherpeople":case "sharedaddressbooks":H.baseParams.method="Addressbook.getContacts";H.baseParams.options=Ext.encode({displayContacts:o,displayLists:V});break;case "overview":H.baseParams.method="Addressbook.getOverview";H.baseParams.options=Ext.encode({displayContacts:o,displayLists:V});break;}H.baseParams.query=Ext.getCmp("quickSearchField").getRawValue();};var q=function(k,H){W("contactWindow","index.php?method=Addressbook.editContact&_contactId=",850,600);};var P=function(k,H){W("listWindow","index.php?method=Addressbook.editList&_listId=",450,600);};var r=function(K,H){var z=Array();var X=I.getSelectionModel().getSelections();for(var k=0;k<X.length;++k){z.push(X[k].id);}z=Ext.util.JSON.encode(z);Ext.Ajax.request({url:"index.php",params:{method:"Addressbook.deleteContacts",_contactIds:z},text:"Deleting contact...",success:function(t,E){f.reload();},failure:function(E,t){Ext.MessageBox.alert("Failed","Some error occured while trying to delete the conctact.");}});};var F=function(X,H){var z=I.getSelectionModel().getSelections();var k=z[0].id;if(z[0].data.contact_tid=="l"){W("listWindow","index.php?method=Addressbook.editList&_listId="+k,450,600);}else{W("contactWindow","index.php?method=Addressbook.editContact&_contactId="+k,850,600);}};var A=function(H,k){f.reload();};var C=new Ext.Action({text:"add contact",handler:q,iconCls:"action_addContact"});var B=new Ext.Action({text:"add list",handler:P,iconCls:"action_addList"});var n=new Ext.Action({text:"edit",disabled:true,handler:F,iconCls:"action_edit"});var g=new Ext.Action({text:"delete",disabled:true,handler:r,iconCls:"action_delete"});var s=function(){var k=Ext.getCmp("north-panel");var z=Ext.getCmp("applicationToolbar");k.remove(z);var K=new Ext.Action({handler:U,enableToggle:true,pressed:o,iconCls:"x-btn-icon action_displayContacts"});var E=new Ext.Action({handler:G,enableToggle:true,pressed:V,iconCls:"x-btn-icon action_displayLists"});var X=new Ext.app.SearchField({id:"quickSearchField",width:240,emptyText:"enter searchfilter"});X.on("change",A);var H=new Ext.Toolbar({region:"south",id:"applicationToolbar",split:false,height:26,items:[C,B,n,g,"-","Display",": ",K,E,"->","Search:"," "," ",X]});k.add(H);k.doLayout();return ;};var p=function(){var E=Ext.getCmp("west");if(E.items){for(var k=0;k<E.items.length;k++){E.remove(E.items.get(k));}}var K=new Ext.tree.TreeLoader({dataUrl:"index.php"});K.on("beforeload",function(m,t){m.baseParams.method="Addressbook.getSubTree";m.baseParams._node=t.id;m.baseParams._datatype=t.attributes.datatype;m.baseParams._owner=t.attributes.owner;m.baseParams._location="mainTree";},this);var z=new Ext.tree.TreePanel({id:"contact-tree",loader:K,rootVisible:false,border:false});var H=new Ext.tree.TreeNode({text:"root",draggable:false,allowDrop:false,id:"root"});z.setRootNode(H);H.appendChild(new Ext.tree.AsyncTreeNode(initialTree));z.on("click",function(m,t){O=m;f.reload();},this);E.add(z);E.show();E.doLayout();z.expandPath("/root/addressbook");z.selectPath("/root/addressbook");return ;var H=z.getRootNode();var X=Array();H.eachChild(function(t){X.push(t);},this);H.appendChild(new Ext.tree.AsyncTreeNode(initialTree));z.expandPath("/root/addressbook");z.selectPath("/root/addressbook");z.on("click",function(t){f.reload();});};var b=function(){var H=Ext.getCmp("center-panel");if(H.items){for(var k=0;k<H.items.length;k++){H.remove(H.items.get(k));}}f=new Ext.data.JsonStore({url:"index.php",root:"results",totalProperty:"totalcount",id:"contact_id",fields:[{name:"contact_id"},{name:"contact_tid"},{name:"contact_owner"},{name:"contact_private"},{name:"cat_id"},{name:"n_family"},{name:"n_given"},{name:"n_middle"},{name:"n_prefix"},{name:"n_suffix"},{name:"n_fn"},{name:"n_fileas"},{name:"contact_bday"},{name:"org_name"},{name:"org_unit"},{name:"contact_title"},{name:"contact_role"},{name:"contact_assistent"},{name:"contact_room"},{name:"adr_one_street"},{name:"adr_one_street2"},{name:"adr_one_locality"},{name:"adr_one_region"},{name:"adr_one_postalcode"},{name:"adr_one_countryname"},{name:"contact_label"},{name:"adr_two_street"},{name:"adr_two_street2"},{name:"adr_two_locality"},{name:"adr_two_region"},{name:"adr_two_postalcode"},{name:"adr_two_countryname"},{name:"tel_work"},{name:"tel_cell"},{name:"tel_fax"},{name:"tel_assistent"},{name:"tel_car"},{name:"tel_pager"},{name:"tel_home"},{name:"tel_fax_home"},{name:"tel_cell_private"},{name:"tel_other"},{name:"tel_prefer"},{name:"contact_email"},{name:"contact_email_home"},{name:"contact_url"},{name:"contact_url_home"},{name:"contact_freebusy_uri"},{name:"contact_calendar_uri"},{name:"contact_note"},{name:"contact_tz"},{name:"contact_geo"},{name:"contact_pubkey"},{name:"contact_created"},{name:"contact_creator"},{name:"contact_modified"},{name:"contact_modifier"},{name:"contact_jpegphoto"},{name:"account_id"}],remoteSort:true});f.setDefaultSort("n_family","asc");f.loadData({"results":[],"totalcount":"0","status":"success"});f.on("beforeload",D);f.load({params:{start:0,limit:50}});var z=new Ext.PagingToolbar({pageSize:25,store:f,displayInfo:true,displayMsg:"Displaying contacts {0} - {1} of {2}",emptyMsg:"No contacts to display"});var X=new Ext.grid.ColumnModel([{resizable:true,id:"contact_tid",header:"Type",dataIndex:"contact_tid",width:30,renderer:c},{resizable:true,id:"n_family",header:"Family name",dataIndex:"n_family"},{resizable:true,id:"n_given",header:"Given name",dataIndex:"n_given",width:80},{resizable:true,id:"n_fn",header:"Full name",dataIndex:"n_fn",hidden:true},{resizable:true,id:"n_fileas",header:"Name + Firm",dataIndex:"n_fileas",hidden:true},{resizable:true,id:"contact_email",header:"eMail",dataIndex:"contact_email",width:150,hidden:false},{resizable:true,id:"contact_bday",header:"Birthday",dataIndex:"contact_bday",hidden:true},{resizable:true,id:"org_name",header:"Organisation",dataIndex:"org_name",width:150},{resizable:true,id:"org_unit",header:"Unit",dataIndex:"org_unit",hidden:true},{resizable:true,id:"contact_title",header:"Title",dataIndex:"contact_title",hidden:true},{resizable:true,id:"contact_role",header:"Role",dataIndex:"contact_role",hidden:true},{resizable:true,id:"contact_room",header:"Room",dataIndex:"contact_room",hidden:true},{resizable:true,id:"adr_one_street",header:"Street",dataIndex:"adr_one_street",hidden:true},{resizable:true,id:"adr_one_locality",header:"Locality",dataIndex:"adr_one_locality",width:80,hidden:false},{resizable:true,id:"adr_one_region",header:"Region",dataIndex:"adr_one_region",hidden:true},{resizable:true,id:"adr_one_postalcode",header:"Postalcode",dataIndex:"adr_one_postalcode",hidden:true},{resizable:true,id:"adr_one_countryname",header:"Country",dataIndex:"adr_one_countryname",hidden:true},{resizable:true,id:"adr_two_street",header:"Street (private)",dataIndex:"adr_two_street",hidden:true},{resizable:true,id:"adr_two_locality",header:"Locality (private)",dataIndex:"adr_two_locality",hidden:true},{resizable:true,id:"adr_two_region",header:"Region (private)",dataIndex:"adr_two_region",hidden:true},{resizable:true,id:"adr_two_postalcode",header:"Postalcode (private)",dataIndex:"adr_two_postalcode",hidden:true},{resizable:true,id:"adr_two_countryname",header:"Country (private)",dataIndex:"adr_two_countryname",hidden:true},{resizable:true,id:"tel_work",header:"Phone",dataIndex:"tel_work",hidden:false},{resizable:true,id:"tel_cell",header:"Cellphone",dataIndex:"tel_cell",hidden:false},{resizable:true,id:"tel_fax",header:"Fax",dataIndex:"tel_fax",hidden:true},{resizable:true,id:"tel_car",header:"Car phone",dataIndex:"tel_car",hidden:true},{resizable:true,id:"tel_pager",header:"Pager",dataIndex:"tel_pager",hidden:true},{resizable:true,id:"tel_home",header:"Phone (private)",dataIndex:"tel_home",hidden:true},{resizable:true,id:"tel_fax_home",header:"Fax (private)",dataIndex:"tel_fax_home",hidden:true},{resizable:true,id:"tel_cell_private",header:"Cellphone (private)",dataIndex:"tel_cell_private",hidden:true},{resizable:true,id:"contact_email_home",header:"eMail (private)",dataIndex:"contact_email_home",hidden:true},{resizable:true,id:"contact_url",header:"URL",dataIndex:"contact_url",hidden:true},{resizable:true,id:"contact_url_home",header:"URL (private)",dataIndex:"contact_url_home",hidden:true},{resizable:true,id:"contact_note",header:"Note",dataIndex:"contact_note",hidden:true},{resizable:true,id:"contact_tz",header:"Timezone",dataIndex:"contact_tz",hidden:true},{resizable:true,id:"contact_geo",header:"Geo",dataIndex:"contact_geo",hidden:true}]);X.defaultSortable=true;I=new Ext.grid.GridPanel({store:f,cm:X,tbar:z,autoSizeColumns:false,selModel:new Ext.grid.RowSelectionModel({multiSelect:true}),enableColLock:false,autoExpandColumn:"n_family",border:false});H.add(I);H.show();H.doLayout();I.on("rowclick",function(m,t,E){var K=I.getSelectionModel().getCount();if(K<1){n.setDisabled(true);g.setDisabled(true);}else{if(K==1){n.setDisabled(false);g.setDisabled(false);}else{n.setDisabled(true);g.setDisabled(false);}}});I.on("rowcontextmenu",function(t,m,E){E.stopEvent();var K=t.getStore().getAt(m);M.showAt(E.getXY());});I.on("rowdblclick",function(E,t,m){var K=E.getStore().getAt(t);if(K.data.contact_tid=="l"){try{W("listWindow","index.php?method=Addressbook.editList&_listId="+K.data.contact_id,450,600);}catch(T){}}else{try{W("contactWindow","index.php?method=Addressbook.editContact&_contactId="+K.data.contact_id,850,600);}catch(T){}}});return ;textF1=new Ext.form.TextField({height:22,width:200,emptyText:"Suchparameter ...",allowBlank:false});textF1.on("specialkey",function(E,K){if(K.getKey()==K.ENTER||K.getKey()==e.RETURN){}});};var c=function(X,E,z,H,k,K){switch(X){case "l":return "<img src='images/oxygen/16x16/actions/users.png' width='12' height='12' alt='list'/>";default:return "<img src='images/oxygen/16x16/actions/user.png' width='12' height='12' alt='contact'/>";}};var U=function(k,H){o=k.pressed;f.reload();};var G=function(k,H){V=k.pressed;f.reload();};var M=new Ext.menu.Menu({id:"ctxMenuAddress",items:[n,g,"-",C,B]});var Q=function(k,H){};var W=function(k,t,H,E){if(document.all){w=document.body.clientWidth;h=document.body.clientHeight;x=window.screenTop;y=window.screenLeft;}else{if(window.innerWidth){w=window.innerWidth;h=window.innerHeight;x=window.screenX;y=window.screenY;}}var K=((w-H)/2)+y;var X=((h-E)/2)+x;var z=window.open(t,k,"width="+H+",height="+E+",top="+X+",left="+K+",directories=no,toolbar=no,location=no,menubar=no,scrollbars=no,status=no,resizable=no,dependent=no");return z;};var l=function(m,z){var k;var Z=1024,t=786;var X=850,T=600;if(z=="list"){X=450,T=600;}if(document.all){Z=document.body.clientWidth;t=document.body.clientHeight;x=window.screenTop;y=window.screenLeft;}else{if(window.innerWidth){Z=window.innerWidth;t=window.innerHeight;x=window.screenX;y=window.screenY;}}var K=((Z-X)/2)+y,E=((t-T)/2)+x;if(z=="list"&&!m){k="index.php?method=Addressbook.editList";}else{if(z=="list"&&m){k="index.php?method=Addressbook.editList&contactid="+m;}else{if(z!="list"&&m){k="index.php?method=Addressbook.editContact&contactid="+m;}else{k="index.php?method=Addressbook.editContact";}}}appId="addressbook";var H=window.open(k,"popupname","width="+X+",height="+T+",top="+E+",left="+K+",directories=no,toolbar=no,location=no,menubar=no,scrollbars=no,status=no,resizable=no,dependent=no");return ;};var u=function(H){H=(H==null)?false:H;window.opener.Egw.Addressbook.reload();if(H==true){window.setTimeout("window.close()",400);}};var R=function(X){if(!z){var z=new Ext.Window({title:"please select addressbook",modal:true,width:375,height:400,minWidth:375,minHeight:400,layout:"fit",plain:true,bodyStyle:"padding:5px;",buttonAlign:"center"});var K=Ext.tree;treeLoader=new K.TreeLoader({dataUrl:"index.php"});treeLoader.on("beforeload",function(t,E){t.baseParams.method="Addressbook.getSubTree";t.baseParams._node=E.id;t.baseParams._datatype=E.attributes.datatype;t.baseParams._owner=E.attributes.owner;t.baseParams._location="selectFolder";},this);var H=new K.TreePanel({animate:true,id:"addressbookTree",loader:treeLoader,containerScroll:true,rootVisible:false});var k=new K.TreeNode({text:"root",draggable:false,allowDrop:false,id:"root"});H.setRootNode(k);Ext.each(application,function(E){k.appendChild(new K.AsyncTreeNode(E));});H.on("click",function(m){m.select();if(H.getSelectionModel().getSelectedNode()){var T=H.getSelectionModel().getSelectedNode().id;var t=H.getNodeById(T).attributes.owner;if((t>0)||(t<0)){var E=Ext.getCmp("addressbook_");E.setValue(t);z.hide();}else{Ext.MessageBox.alert("wrong selection","please select a valid addressbook");}}else{Ext.MessageBox.alert("no selection","please select an addressbook");}});z.add(H);z.show();}};return {show:function(H){s();p();b(H);},displayAddressbookSelectDialog:R,reload:function(){f.reload();}};}();Egw.Addressbook.ContactEditDialog=function(){var p;var Q;var V;var G=function(U,A){var R=Ext.getCmp("contactDialog").getForm();R.render();if(R.isValid()){var o={};if(formData.values){o.contact_id=formData.values.contact_id;}R.submit({waitTitle:"Please wait!",waitMsg:"saving contact...",params:o,success:function(B,W,P){window.opener.Egw.Addressbook.reload();},failure:function(B,W){}});}else{Ext.MessageBox.alert("Errors","Please fix the errors noted.");}};var M=function(U,A){var R=Ext.getCmp("contactDialog").getForm();R.render();if(R.isValid()){var o={};if(formData.values){o.contact_id=formData.values.contact_id;}R.submit({waitTitle:"Please wait!",waitMsg:"saving contact...",params:o,success:function(B,W,P){window.opener.Egw.Addressbook.reload();window.setTimeout("window.close()",400);},failure:function(B,W){}});}else{Ext.MessageBox.alert("Errors","Please fix the errors noted.");}};var l=function(o,R){var A=Ext.util.JSON.encode([formData.values.contact_id]);Ext.Ajax.request({url:"index.php",params:{method:"Addressbook.deleteContacts",_contactIds:A},text:"Deleting contact...",success:function(B,U){window.opener.Egw.Addressbook.reload();window.setTimeout("window.close()",400);},failure:function(U,B){Ext.MessageBox.alert("Failed","Some error occured while trying to delete the conctact.");}});};var f=new Ext.Action({text:"save and close",handler:M,iconCls:"action_saveAndClose"});var b=new Ext.Action({text:"apply changes",handler:G,iconCls:"action_applyChanges"});var D=new Ext.Action({text:"delete contact",handler:l,iconCls:"action_delete"});var s=function(){Ext.QuickTips.init();Ext.form.Field.prototype.msgTarget="side";var z=true;if(formData.values){z=false;}var I=new Ext.Toolbar({region:"south",id:"applicationToolbar",split:false,height:26,items:[f,b,D]});var H=new Ext.data.JsonStore({url:"index.php",baseParams:{method:"Egwbase.getCountryList"},root:"results",id:"shortName",fields:["shortName","translatedName"],remoteSort:false});var W=new Ext.form.TriggerField({fieldLabel:"Addressbook",name:"contact_owner",id:"addressbook_",anchor:"95%",readOnly:true});W.onTriggerClick=function(){Egw.Addressbook.displayAddressbookSelectDialog(F);};var R=function(X){X.baseParams.method="Addressbook.getContacts";X.baseParams.options=Ext.encode({displayContacts:false,displayLists:true});};var k=[["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"]];var o=new Ext.data.SimpleStore({fields:["contact_id","contact_tid"],data:k});var A=new Ext.data.SimpleStore({fields:["contact_id","contact_tid"],});var u=new Ext.DataView({style:"overflow:auto",singleSelect:true,itemSelector:"div.thumb-wrap",store:o,tpl:new Ext.XTemplate("<tpl for=\".\">","<div class=\"thumb-wrap\" id=\"{contact_id}\">","<span>{contact_tid}</span></div>","</tpl>")});u.on("dblclick",function(E,m,t,K){var X=o.getAt(m);o.remove(X);A.add(X);A.sort("contact_tid","ASC");});var g=new Ext.DataView({style:"overflow:auto",singleSelect:true,itemSelector:"div.thumb-wrap",store:A,tpl:new Ext.XTemplate("<tpl for=\".\">","<div class=\"thumb-wrap\" id=\"{contact_id}\">","<span>{contact_tid}</span></div>","</tpl>")});g.on("dblclick",function(E,m,t,K){var X=A.getAt(m);A.remove(X);o.add(X);o.sort("contact_tid","ASC");});var B=new Ext.Panel({id:"list_source",title:"available lists",region:"center",margins:"5 5 5 0",layout:"fit",items:u});var P=new Ext.Panel({id:"list_selected",title:"chosen lists",region:"center",margins:"5 5 5 0",layout:"fit",items:g});var U=new Ext.FormPanel({url:"index.php",baseParams:{method:"Addressbook.saveContact"},labelAlign:"top",bodyStyle:"padding:5px",anchor:"100%",deferredRender:false,region:"center",id:"contactDialog",tbar:I,deferredRender:false,items:[{layout:"column",border:false,anchor:"100%",items:[{columnWidth:0.4,layout:"form",border:false,items:[{xtype:"textfield",fieldLabel:"First Name",name:"n_given",anchor:"95%"},{xtype:"textfield",fieldLabel:"Middle Name",name:"n_middle",anchor:"95%"},{xtype:"textfield",fieldLabel:"Last Name",name:"n_family",allowBlank:false,anchor:"95%"}]},{columnWidth:0.2,layout:"form",border:false,items:[{xtype:"textfield",fieldLabel:"Prefix",name:"n_prefix",anchor:"95%"},{xtype:"textfield",fieldLabel:"Suffix",name:"n_suffix",anchor:"95%"},W]},{columnWidth:0.4,layout:"form",border:false,items:[{xtype:"textarea",name:"contact_note",fieldLabel:"Notes",grow:false,preventScrollbars:false,anchor:"95% 85%"}]}]},{xtype:"tabpanel",plain:true,activeTab:0,anchor:"100% 70%",defaults:{bodyStyle:"padding:10px"},items:[{title:"Business information",layout:"column",border:false,items:[{columnWidth:0.333,layout:"form",border:false,items:[{xtype:"textfield",fieldLabel:"Company",name:"org_name",anchor:"95%"},{xtype:"textfield",fieldLabel:"Street",name:"adr_one_street",anchor:"95%"},{xtype:"textfield",fieldLabel:"Street 2",name:"adr_one_street2",anchor:"95%"},{xtype:"textfield",fieldLabel:"Postalcode",name:"adr_one_postalcode",anchor:"95%"},{xtype:"textfield",fieldLabel:"City",name:"adr_one_locality",anchor:"95%"},{xtype:"textfield",fieldLabel:"Region",name:"adr_one_region",anchor:"95%"},new Ext.form.ComboBox({fieldLabel:"Country",name:"adr_one_countryname",hiddenName:"adr_one_countryname",store:H,displayField:"translatedName",valueField:"shortName",typeAhead:true,mode:"remote",triggerAction:"all",emptyText:"Select a state...",selectOnFocus:true,anchor:"95%"})]},{columnWidth:0.333,layout:"form",border:false,items:[{xtype:"textfield",fieldLabel:"Phone",name:"tel_work",anchor:"95%"},{xtype:"textfield",fieldLabel:"Cellphone",name:"tel_cell",anchor:"95%"},{xtype:"textfield",fieldLabel:"Fax",name:"tel_fax",anchor:"95%"},{xtype:"textfield",fieldLabel:"Car phone",name:"tel_car",anchor:"95%"},{xtype:"textfield",fieldLabel:"Pager",name:"tel_pager",anchor:"95%"},{xtype:"textfield",fieldLabel:"Email",name:"contact_email",vtype:"email",anchor:"95%"},{xtype:"textfield",fieldLabel:"URL",name:"contact_url",vtype:"url",anchor:"95%"},]},{columnWidth:0.333,layout:"form",border:false,items:[{xtype:"textfield",fieldLabel:"Unit",name:"org_unit",anchor:"95%"},{xtype:"textfield",fieldLabel:"Role",name:"contact_role",anchor:"95%"},{xtype:"textfield",fieldLabel:"Title",name:"contact_title",anchor:"95%"},{xtype:"textfield",fieldLabel:"Room",name:"contact_room",anchor:"95%"},{xtype:"textfield",fieldLabel:"Name Assistent",name:"contact_assistent",anchor:"95%"},{xtype:"textfield",fieldLabel:"Phone Assistent",name:"tel_assistent",anchor:"95%"},]}]},{title:"Private information",layout:"column",border:false,items:[{columnWidth:0.333,layout:"form",border:false,items:[{xtype:"textfield",fieldLabel:"Street",name:"adr_two_street",anchor:"95%"},{xtype:"textfield",fieldLabel:"Street2",name:"adr_two_street2",anchor:"95%"},{xtype:"textfield",fieldLabel:"Postalcode",name:"adr_two_postalcode",anchor:"95%"},{xtype:"textfield",fieldLabel:"City",name:"adr_two_locality",anchor:"95%"},{xtype:"textfield",fieldLabel:"Region",name:"adr_two_region",anchor:"95%"},new Ext.form.ComboBox({fieldLabel:"Country",name:"adr_two_countryname",hiddenName:"adr_two_countryname",store:H,displayField:"translatedName",valueField:"shortName",typeAhead:true,mode:"remote",triggerAction:"all",emptyText:"Select a state...",selectOnFocus:true,anchor:"95%"})]},{columnWidth:0.333,layout:"form",border:false,items:[new Ext.form.DateField({fieldLabel:"Birthday",name:"contact_bday",format:formData.config.dateFormat,altFormats:"Y-m-d",anchor:"95%"}),{xtype:"textfield",fieldLabel:"Phone",name:"tel_home",anchor:"95%"},{xtype:"textfield",fieldLabel:"Cellphone",name:"tel_cell_private",anchor:"95%"},{xtype:"textfield",fieldLabel:"Fax",name:"tel_fax_home",anchor:"95%"},{xtype:"textfield",fieldLabel:"Email",name:"contact_email_home",vtype:"email",anchor:"95%"},{xtype:"textfield",fieldLabel:"URL",name:"contact_url_home",vtype:"url",anchor:"95%"}]},{columnWidth:0.333,layout:"form",border:false,items:[new Ext.form.FieldSet({id:"photo",legend:"Photo"})]}]},{title:"Lists",layout:"column",border:false,items:[{columnWidth:0.5,layout:"form",border:false,items:[new Ext.Panel({layout:"fit",id:"source",width:250,height:350,items:[B]})]},{columnWidth:0.5,layout:"form",border:false,items:[new Ext.Panel({layout:"fit",id:"destination",width:250,height:350,items:[P]})]}]},{title:"Categories",layout:"column",border:false,items:[{}]}]}]});var C=new Ext.Viewport({layout:"border",items:U});var c=new Ext.data.SimpleStore({fields:["id","addressbooks"],data:formData.config.addressbooks});return ;};var n=function(R,U){var o=Ext.getCmp("contactDialog").getForm();for(var B in U){var A=o.findField(B);if(A){A.setValue(U[B]);}}};var q=function(A,R){Ext.MessageBox.alert("Export","Not yet implemented.");};var F=function(R,o){var A=Ext.getCmp("addressbook_");A.setValue(o);};var O=function(){var B=Ext.Element.get("container");var P=B.createChild({tag:"div",id:"iWindowTag"});var W=B.createChild({tag:"div",id:"iWindowContTag"});var R=new Ext.data.SimpleStore({fields:["category_id","category_realname"],data:[["1","erste Kategorie"],["2","zweite Kategorie"],["3","dritte Kategorie"],["4","vierte Kategorie"],["5","fuenfte Kategorie"],["6","sechste Kategorie"],["7","siebte Kategorie"],["8","achte Kategorie"]]});R.load();ds_checked=new Ext.data.SimpleStore({fields:["category_id","category_realname"],data:[["2","zweite Kategorie"],["5","fuenfte Kategorie"],["6","sechste Kategorie"],["8","achte Kategorie"]]});ds_checked.load();var C=new Ext.form.Form({labelWidth:75,url:"index.php?method=Addressbook.saveAdditionalData",reader:new Ext.data.JsonReader({root:"results"},[{name:"category_id"},{name:"category_realname"},])});var A=1;var g=new Array();ds_checked.each(function(u){g[u.data.category_id]=u.data.category_realname;});R.each(function(u){if((A%12)==1){C.column({width:"33%",labelWidth:50,labelSeparator:""});}if(g[u.data.category_id]){C.add(new Ext.form.Checkbox({boxLabel:u.data.category_realname,name:u.data.category_realname,checked:true}));}else{C.add(new Ext.form.Checkbox({boxLabel:u.data.category_realname,name:u.data.category_realname}));}if((A%12)==0){C.end();}A=A+1;});C.render("iWindowContTag");if(!U){var U=new Ext.LayoutDialog("iWindowTag",{modal:true,width:700,height:400,shadow:true,minWidth:700,minHeight:400,autoTabs:true,proxyDrag:true,center:{autoScroll:true,tabPosition:"top",closeOnTab:true,alwaysShowTabs:true}});U.addKeyListener(27,this.hide);U.addButton("save",function(){Ext.MessageBox.alert("Todo","Not yet implemented!");U.hide;},U);U.addButton("cancel",function(){Ext.MessageBox.alert("Todo","Not yet implemented!");U.hide;},U);var o=U.getLayout();o.beginUpdate();o.add("center",new Ext.ContentPanel("iWindowContTag",{autoCreate:true,title:"Category"}));o.endUpdate();}U.show();};var r=function(){var B=Ext.Element.get("container");var P=B.createChild({tag:"div",id:"iWindowTag"});var W=B.createChild({tag:"div",id:"iWindowContTag"});var R=new Ext.data.SimpleStore({fields:["list_id","list_realname"],data:[["1","Liste A"],["2","Liste B"],["3","Liste C"],["4","Liste D"],["5","Liste E"],["6","Liste F"],["7","Liste G"],["8","Liste H"]]});R.load();ds_checked=new Ext.data.SimpleStore({fields:["list_id","list_realname"],data:[["2","Liste B"],["5","Liste E"],["6","Liste F"],["8","Liste H"]]});ds_checked.load();var C=new Ext.form.Form({labelWidth:75,url:"index.php?method=Addressbook.saveAdditionalData",reader:new Ext.data.JsonReader({root:"results"},[{name:"list_id"},{name:"list_realname"},])});var A=1;var g=new Array();ds_checked.each(function(u){g[u.data.list_id]=u.data.list_realname;});R.each(function(u){if((A%12)==1){C.column({width:"33%",labelWidth:50,labelSeparator:""});}if(g[u.data.list_id]){C.add(new Ext.form.Checkbox({boxLabel:u.data.list_realname,name:u.data.list_realname,checked:true}));}else{C.add(new Ext.form.Checkbox({boxLabel:u.data.list_realname,name:u.data.list_realname}));}if((A%12)==0){C.end();}A=A+1;});C.render("iWindowContTag");if(!U){var U=new Ext.LayoutDialog("iWindowTag",{modal:true,width:700,height:400,shadow:true,minWidth:700,minHeight:400,autoTabs:true,proxyDrag:true,center:{autoScroll:true,tabPosition:"top",closeOnTab:true,alwaysShowTabs:true}});U.addKeyListener(27,this.hide);U.addButton("save",function(){Ext.MessageBox.alert("Todo","Not yet implemented!");},U);U.addButton("cancel",function(){window.location.reload();U.hide;},U);var o=U.getLayout();o.beginUpdate();o.add("center",new Ext.ContentPanel("iWindowContTag",{autoCreate:true,title:"Lists"}));o.endUpdate();}U.show();};return {display:function(){var R=s();if(formData.values){n(R,formData.values);}}};}();Egw.Addressbook.ListEditDialog=function(){var p;var s=new Ext.Action({text:"save and close",iconCls:"action_saveAndClose"});var q=new Ext.Action({text:"apply changes",iconCls:"action_applyChanges"});var l=new Ext.Action({text:"delete contact",iconCls:"action_delete"});var G=function(){Ext.QuickTips.init();Ext.form.Field.prototype.msgTarget="side";var u=true;if(formData.values){u=false;}var C=new Ext.Toolbar({region:"south",id:"applicationToolbar",split:false,height:26,items:[s,q,l]});var P=new Ext.data.SimpleStore({fields:["id","addressbooks"],data:formData.config.addressbooks});var R=new Ext.form.TriggerField({fieldLabel:"Addressbook",name:"list_owner",anchor:"95%",readOnly:true});R.onTriggerClick=function(){Egw.Addressbook.displayAddressbookSelectDialog(O);};var o=new Ext.FormPanel({url:"index.php",baseParams:{method:"Addressbook.saveList"},labelAlign:"top",bodyStyle:"padding:5px",anchor:"100%",region:"center",id:"listDialog",tbar:C,items:[{layout:"form",title:"list information",border:false,anchor:"100%",items:[R,{xtype:"textfield",fieldLabel:"List Name",name:"list_name",anchor:"95%"},{xtype:"textarea",fieldLabel:"List Description",name:"list_description",grow:false,anchor:"95%"}]}]});o.on("beforeaction",function(I,c){I.baseParams._listOwner=I.getValues().list_owner;I.baseParams._listmembers=V(D);if(formData.values&&formData.values.list_id){I.baseParams._listId=formData.values.list_id;}else{I.baseParams._listId="";}});if(formData.values){var Q=formData.values.list_owner;var g=formData.values.list_id;}else{var Q=-1;var g=-1;}searchDS=new Ext.data.JsonStore({url:"index.php",baseParams:{method:"Addressbook.getOverview",owner:Q,options:"{\"displayContacts\":true,\"displayLists\":false}",},root:"results",totalProperty:"totalcount",id:"contact_id",fields:[{name:"contact_id"},{name:"n_family"},{name:"n_given"},{name:"contact_email"}],remoteSort:true,success:function(c,I){},failure:function(c,I){}});searchDS.setDefaultSort("n_family","asc");var A=new Ext.Template("<div class=\"search-item\">","{n_family}, {n_given} {contact_email}","</div>");var b=new Ext.form.ComboBox({title:"select new list members",store:searchDS,displayField:"n_family",typeAhead:false,loadingText:"Searching...",width:415,pageSize:10,hideTrigger:true,tpl:A,onSelect:function(I){var c=new f({contact_id:I.data.contact_id,n_family:I.data.n_family,contact_email:I.data.contact_email});D.add(c);D.sort("n_family");b.reset();b.collapse();}});b.on("specialkey",function(E,H){if(searchDS.getCount()==0){var K=/^[a-z0-9_-]+(\.[a-z0-9_-]+)*@([0-9a-z][0-9a-z-]*[0-9a-z]\.)+([a-z]{2,4}|museum)$/;var I=K.exec(b.getValue());if(I&&(H.getKey()==H.ENTER||H.getKey()==e.RETURN)){var X=b.getValue();var c=X.indexOf("@");if(c!=-1){var z=Ext.util.Format.capitalize(X.substr(0,c));}else{var z=X;}var k=new f({contact_id:"-1",n_family:z,contact_email:X});D.add(k);D.sort("n_family");b.reset();}}});o.add(b);var U=new Ext.Viewport({layout:"border",items:o});var f=Ext.data.Record.create([{name:"contact_id",type:"int"},{name:"n_family",type:"string"},{name:"contact_email",type:"string"}]);if(formData.values){var n=formData.values.list_members;}var D=new Ext.data.SimpleStore({fields:["contact_id","n_family","contact_email"],data:n});D.sort("n_family","ASC");var B=new Ext.grid.ColumnModel([{resizable:true,id:"n_family",header:"Family name",dataIndex:"n_family"},{resizable:true,id:"contact_email",header:"eMail address",dataIndex:"contact_email"}]);B.defaultSortable=true;var W=new Ext.menu.Menu({id:"ctxListMenu",items:[{id:"delete",text:"delete entry",icon:"images/oxygen/16x16/actions/edit-delete.png",handler:M}]});var F=new Ext.grid.GridPanel({store:D,columns:B,sm:new Ext.grid.RowSelectionModel({multiSelect:true}),monitorWindowResize:false,trackMouseOver:true,autoExpandColumn:"contact_email"});F.on("rowcontextmenu",function(H,k,I){I.stopEvent();var c=H.getDataSource().getAt(k);if(c.data.contact_tid=="l"){W.showAt(I.getXY());}else{W.showAt(I.getXY());}});U.add(F);return ;};var O=function(D,Q){p.setValues([{id:"list_owner",value:Q}]);};var M=function(f,D){var n=Array();var F=listGrid.getSelectionModel().getSelections();for(var Q=0;Q<F.length;++Q){ds_listMembers.remove(F[Q]);}};var r=function(D,Q){D.findField("list_name").setValue(Q["list_name"]);D.findField("list_description").setValue(Q["list_description"]);D.findField("list_owner").setValue(Q["list_owner"]);};var V=function(Q){var D=new Array();Q.each(function(n){D.push(n.data);},this);return Ext.util.JSON.encode(D);};return {display:function(){var D=G();if(formData.values){}}};}();