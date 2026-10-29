// STORAGE ADAPTER SEAM. Swap LocalAdapter for a backend adapter (e.g. Apps Script google.script.run) without touching UI code.
// Interface: load(person) -> Promise<answers>, save(person, answers) -> Promise<void>, people() -> Promise<string[]>
const LocalAdapter={key:"epa.v1",_all(){return JSON.parse(localStorage.getItem(this.key)||"{}")},
 async people(){return Object.keys(this._all())},async load(p){return this._all()[p]||{}},
 async save(p,a){const s=this._all();s[p]=a;localStorage.setItem(this.key,JSON.stringify(s))}};
const AppsScriptAdapter={call(fn,...x){return new Promise((r,j)=>google.script.run.withSuccessHandler(r).withFailureHandler(j)[fn](...x))},
 people(){return this.call("listPeople")},load(p){return this.call("loadAnswers",p)},save(p,a){return this.call("saveAnswers",p,a)}};
window.Storage=(typeof google!=="undefined"&&google.script)?AppsScriptAdapter:LocalAdapter;
