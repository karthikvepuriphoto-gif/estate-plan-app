// Estate Plan Drafter – Apps Script backend. Only drive.file + userinfo.email:
// the app can touch ONLY files it created (or the user picked). Uses Advanced Drive v3, not SpreadsheetApp/DocumentApp (those need broad scopes).
var FOLDER='Estate Plan Drafts', SHEET='Estate Plan Answers', W='DRAFT – for attorney review, not legal advice';
function doGet(){return HtmlService.createTemplateFromFile('Index').evaluate().setTitle('Estate Plan Drafter').addMetaTag('viewport','width=device-width,initial-scale=1');}
function include(f){return HtmlService.createHtmlOutputFromFile(f).getContent();}
function me(){return Session.getActiveUser().getEmail();}
function findOne_(q){var r=Drive.Files.list({q:q+" and trashed=false",fields:'files(id,name)',pageSize:1});return r.files&&r.files[0];}
function folder_(){var p=PropertiesService.getUserProperties(),id=p.getProperty('folderId');if(id)return id;
 var f=findOne_("name='"+FOLDER+"' and mimeType='application/vnd.google-apps.folder'")||Drive.Files.create({name:FOLDER,mimeType:'application/vnd.google-apps.folder'});p.setProperty('folderId',f.id);return f.id;}
function useSharedFolder(id){PropertiesService.getUserProperties().setProperty('folderId',id);return id;} // after spouse picks it in Google Picker
function sheet_(){var fid=folder_(),s=findOne_("name='"+SHEET+"' and '"+fid+"' in parents");if(s)return s.id;
 return Drive.Files.create({name:SHEET,mimeType:'application/vnd.google-apps.spreadsheet',parents:[fid]},Utilities.newBlob('person,updated,answers_json\n','text/csv')).id;}
function readAll_(){var csv=Drive.Files.export(sheet_(),'text/csv');var rows=Utilities.parseCsv(typeof csv==='string'?csv:csv.getDataAsString());var o={};rows.slice(1).forEach(function(r){if(r[0])o[r[0]]=JSON.parse(r[2]||'{}')});return o;}
function writeAll_(o){var lines=[['person','updated','answers_json']];Object.keys(o).forEach(function(k){lines.push([k,new Date().toISOString(),JSON.stringify(o[k])])});
 var csv=lines.map(function(r){return r.map(function(c){return '"'+String(c).replace(/"/g,'""')+'"'}).join(',')}).join('\n');
 Drive.Files.update({},sheet_(),Utilities.newBlob(csv,'text/csv'));}
function listPeople(){return Object.keys(readAll_());}
function loadAnswers(p){return readAll_()[p]||{};}
function saveAnswers(p,a){var lock=LockService.getUserLock();lock.waitLock(10000);try{var o=readAll_();o[p]=a;writeAll_(o);}finally{lock.releaseLock();}}
function createDocs(person,html){ // html built client-side by templates.js, already watermarked
 var body='<html><body><p style="color:#a8662f;font-weight:bold">'+W+'</p>'+html+'<p style="color:#a8662f">'+W+'</p></body></html>';
 var f=Drive.Files.create({name:'Estate drafts – '+person+' – '+new Date().toISOString().slice(0,10),mimeType:'application/vnd.google-apps.document',parents:[folder_()]},Utilities.newBlob(body,'text/html'));
 return 'https://docs.google.com/document/d/'+f.id+'/edit';}
function shareWithSpouse(email){Drive.Permissions.create({role:'writer',type:'user',emailAddress:email},folder_(),{sendNotificationEmail:true});return 'https://drive.google.com/drive/folders/'+folder_();}
// Workspace add-on entry point (phase 2): same functions, CardService homepage that opens the web UI.
function onHomepage(){return CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle('Estate Plan Drafter')).addSection(CardService.newCardSection().addWidget(CardService.newTextParagraph().setText(W)).addWidget(CardService.newTextButton().setText('Open drafter').setOpenLink(CardService.newOpenLink().setUrl(ScriptApp.getService().getUrl())))).build();}
