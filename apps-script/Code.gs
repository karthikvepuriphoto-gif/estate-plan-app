// Estate Plan Drafter – Apps Script backend. Only drive.file + userinfo.email:
// the app can touch ONLY files it created (or the user picked). Uses Advanced Drive v3, not SpreadsheetApp/DocumentApp (those need broad scopes).
var FOLDER='Estate Plan Drafts', SHEET='Estate Plan Answers', W='DRAFT – for attorney review, not legal advice';
function doGet(){return HtmlService.createTemplateFromFile('Index').evaluate().setTitle('Estate Plan Drafter').addMetaTag('viewport','width=device-width,initial-scale=1');}
function include(f){return HtmlService.createHtmlOutputFromFile(f).getContent();}
function me(){return wrap_(function(){return Session.getActiveUser().getEmail();});}
function findOne_(q){var r=Drive.Files.list({q:q+" and trashed=false",fields:'files(id,name)',pageSize:1});return r.files&&r.files[0];}
function folder_(){var p=PropertiesService.getUserProperties(),id=p.getProperty('folderId');if(id)return id;
 var f=findOne_("name='"+FOLDER+"' and mimeType='application/vnd.google-apps.folder'")||Drive.Files.create({name:FOLDER,mimeType:'application/vnd.google-apps.folder'});p.setProperty('folderId',f.id);return f.id;}
function useSharedFolder(id){PropertiesService.getUserProperties().setProperty('folderId',id);return id;} // after spouse picks it in Google Picker
function sheet_(){var fid=folder_(),s=findOne_("name='"+SHEET+"' and '"+fid+"' in parents");if(s)return s.id;
 return Drive.Files.create({name:SHEET,mimeType:'application/vnd.google-apps.spreadsheet',parents:[fid]},Utilities.newBlob('person,updated,answers_json\n','text/csv')).id;}
// Answers live in UserProperties (no extra scope, per-user, reliable). The Sheet is a human-readable mirror (write-only, best effort).
function props_(){return PropertiesService.getUserProperties();}
function readAll_(){var raw=props_().getProperty('answers');if(!raw)return {};try{var o=JSON.parse(raw);return (o&&typeof o==='object')?o:{};}catch(e){return {};}}
function mirror_(o){try{var lines=[['person','updated','answers_json']];Object.keys(o).forEach(function(k){lines.push([k,new Date().toISOString(),JSON.stringify(o[k])])});
 var csv=lines.map(function(r){return r.map(function(c){return '"'+String(c).replace(/"/g,'""')+'"'}).join(',')}).join('\n');
 Drive.Files.update({},sheet_(),Utilities.newBlob(csv,'text/csv'));}catch(e){console.warn('sheet mirror failed: '+e);}}
function writeAll_(o){props_().setProperty('answers',JSON.stringify(o));mirror_(o);}
// Every client-callable function returns a JSON string {ok,data|error} so google.script.run never gets a non-serializable value.
function wrap_(fn){try{var d=fn();return JSON.stringify({ok:true,data:d===undefined?null:d});}catch(e){console.error(e&&e.stack||e);return JSON.stringify({ok:false,error:String(e&&e.message||e)});}}
function listPeople(){return wrap_(function(){return Object.keys(readAll_());});}
function loadAnswers(p){return wrap_(function(){var a=readAll_()[String(p)];return (a&&typeof a==='object')?a:{};});}
function saveAnswers(p,a){return wrap_(function(){var lock=LockService.getUserLock();lock.waitLock(10000);try{var o=readAll_();o[String(p)]=(typeof a==='string'?JSON.parse(a):a)||{};writeAll_(o);}finally{lock.releaseLock();}return true;});}
function clearAnswers(p){return wrap_(function(){var lock=LockService.getUserLock();lock.waitLock(10000);try{var o=readAll_();delete o[String(p)];writeAll_(o);}finally{lock.releaseLock();}return true;});}
function renamePerson(from,to){return wrap_(function(){var o=readAll_();if(o[from]&&!o[to]){o[to]=o[from];delete o[from];writeAll_(o);}return true;});}
function createDocs(person,html){return wrap_(function(){ // html built client-side by templates.js, already watermarked
 var body='<html><body><p style="color:#a8662f;font-weight:bold">'+W+'</p>'+html+'<p style="color:#a8662f">'+W+'</p></body></html>';
 var f=Drive.Files.create({name:'Estate drafts – '+person+' – '+new Date().toISOString().slice(0,10),mimeType:'application/vnd.google-apps.document',parents:[folder_()]},Utilities.newBlob(body,'text/html'));
 return 'https://docs.google.com/document/d/'+f.id+'/edit';});}
function shareWithSpouse(email){return wrap_(function(){Drive.Permissions.create({role:'writer',type:'user',emailAddress:email},folder_(),{sendNotificationEmail:true});return 'https://drive.google.com/drive/folders/'+folder_();});}
// Workspace add-on entry point (phase 2): same functions, CardService homepage that opens the web UI.
function onHomepage(){return CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle('Estate Plan Drafter')).addSection(CardService.newCardSection().addWidget(CardService.newTextParagraph().setText(W)).addWidget(CardService.newTextButton().setText('Open drafter').setOpenLink(CardService.newOpenLink().setUrl(ScriptApp.getService().getUrl())))).build();}
