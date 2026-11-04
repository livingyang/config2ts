(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();/**
* @vue/shared v3.5.44
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Jn(e){const t=Object.create(null);for(const n of e.split(","))t[n]=1;return n=>n in t}const z={},nt=[],Ne=()=>{},sr=()=>!1,on=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),ln=e=>e.startsWith("onUpdate:"),ee=Object.assign,Yn=(e,t)=>{const n=e.indexOf(t);n>-1&&e.splice(n,1)},mi=Object.prototype.hasOwnProperty,F=(e,t)=>mi.call(e,t),M=Array.isArray,qe=e=>Dt(e)==="[object Map]",Yt=e=>Dt(e)==="[object Set]",Ss=e=>Dt(e)==="[object Date]",j=e=>typeof e=="function",J=e=>typeof e=="string",Le=e=>typeof e=="symbol",$=e=>e!==null&&typeof e=="object",rr=e=>($(e)||j(e))&&j(e.then)&&j(e.catch),ir=Object.prototype.toString,Dt=e=>ir.call(e),gi=e=>Dt(e).slice(8,-1),or=e=>Dt(e)==="[object Object]",Zn=e=>J(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,_t=Jn(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),cn=e=>{const t=Object.create(null);return(n=>t[n]||(t[n]=e(n)))},bi=/-\w/g,ve=cn(e=>e.replace(bi,t=>t.slice(1).toUpperCase())),yi=/\B([A-Z])/g,it=cn(e=>e.replace(yi,"-$1").toLowerCase()),lr=cn(e=>e.charAt(0).toUpperCase()+e.slice(1)),_n=cn(e=>e?`on${lr(e)}`:""),De=(e,t)=>!Object.is(e,t),xn=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t)},cr=(e,t,n,s=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:s,value:n})},_i=e=>{const t=parseFloat(e);return isNaN(t)?e:t};let ws;const an=()=>ws||(ws=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function Xn(e){if(M(e)){const t={};for(let n=0;n<e.length;n++){const s=e[n],r=J(s)?Si(s):Xn(s);if(r)for(const i in r)t[i]=r[i]}return t}else if(J(e)||$(e))return e}const xi=/;(?![^(]*\))/g,vi=/:([^]+)/,Ci=/"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;function Si(e){const t={};return e.replace(Ci,n=>n.startsWith("/*")?"":n).split(xi).forEach(n=>{if(n){const s=n.split(vi);s.length>1&&(t[s[0].trim()]=s[1].trim())}}),t}function Pt(e){let t="";if(J(e))t=e;else if(M(e))for(let n=0;n<e.length;n++){const s=Pt(e[n]);s&&(t+=s+" ")}else if($(e))for(const n in e)e[n]&&(t+=n+" ");return t.trim()}const wi="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly",Ti=Jn(wi);function ar(e){return!!e||e===""}function Ri(e,t,n){if(e.length!==t.length)return!1;let s=!0;for(let r=0;s&&r<e.length;r++)s=fn(e[r],t[r],n);return s}function Ts(e,t,n){if(e.size!==t.size)return!1;const s=Array.from(t),r=new Uint8Array(s.length);for(const i of e){let o=-1;for(let l=0;l<s.length;l++)if(!r[l]&&fn(i,s[l],n)){o=l;break}if(o<0)return!1;r[o]=1}return!0}function Ei(e,t,n){let s=qe(e),r=qe(t);if(s||r||(s=Yt(e),r=Yt(t),s||r))return s&&r?Ts(e,t,n):!1;const i=Object.keys(e).length,o=Object.keys(t).length;if(i!==o)return!1;for(const l in e){const a=e.hasOwnProperty(l),p=t.hasOwnProperty(l);if(a&&!p||!a&&p||!fn(e[l],t[l],n))return!1}return String(e)===String(t)}function Rs(e,t,n,s){n||(n=[new Map,new Map]);const[r,i]=n;if(r.has(e)||i.has(t))return r.get(e)===t&&i.get(t)===e;r.set(e,t),i.set(t,e);const o=s(e,t,n);return r.delete(e),i.delete(t),o}function fn(e,t,n){if(e===t)return!0;let s=Ss(e),r=Ss(t);return s||r?s&&r?e.getTime()===t.getTime():!1:(s=Le(e),r=Le(t),s||r?e===t:(s=M(e),r=M(t),s||r?s&&r?Rs(e,t,n,Ri):!1:(s=$(e),r=$(t),s||r?!s||!r?!1:Rs(e,t,n,Ei):String(e)===String(t))))}const fr=e=>!!(e&&e.__v_isRef===!0),ge=e=>J(e)?e:e==null?"":M(e)||$(e)&&(e.toString===ir||!j(e.toString))?fr(e)?ge(e.value):JSON.stringify(e,ur,2):String(e),ur=(e,t)=>fr(t)?ur(e,t.value):qe(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((n,[s,r],i)=>(n[vn(s,i)+" =>"]=r,n),{})}:Yt(t)?{[`Set(${t.size})`]:[...t.values()].map(n=>vn(n))}:Le(t)?vn(t):$(t)&&!M(t)&&!or(t)?String(t):t,vn=(e,t="")=>{var n;return Le(e)?`Symbol(${(n=e.description)!=null?n:t})`:e};/**
* @vue/reactivity v3.5.44
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Q;class Oi{constructor(t=!1){this.detached=t,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this._warnOnRun=!0,this.__v_skip=!0,!t&&Q&&(Q.active?(this.parent=Q,this.index=(Q.scopes||(Q.scopes=[])).push(this)-1):(this._active=!1,this._warnOnRun=!1))}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let t,n;if(this.scopes){const s=this.scopes.slice();for(t=0,n=s.length;t<n;t++)s[t].pause()}for(t=0,n=this.effects.length;t<n;t++)this.effects[t].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let t,n;if(this.scopes){const r=this.scopes.slice();for(t=0,n=r.length;t<n;t++)r[t].resume()}const s=this.effects.slice();for(t=0,n=s.length;t<n;t++)s[t].resume()}}run(t){if(this._active){const n=Q;try{return Q=this,t()}finally{Q=n}}}on(){++this._on===1&&(this.prevScope=Q,Q=this)}off(){if(this._on>0&&--this._on===0){if(Q===this)Q=this.prevScope;else{let t=Q;for(;t;){if(t.prevScope===this){t.prevScope=this.prevScope;break}t=t.prevScope}}this.prevScope=void 0}}stop(t){if(this._active){this._active=!1;let n,s;for(n=0,s=this.effects.length;n<s;n++)this.effects[n].stop();for(this.effects.length=0,n=0,s=this.cleanups.length;n<s;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){const r=this.scopes.slice();for(n=0,s=r.length;n<s;n++)r[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!t){const r=this.parent.scopes.pop();r&&r!==this&&(this.parent.scopes[this.index]=r,r.index=this.index)}this.parent=void 0}}}function Ai(){return Q}let K;const Cn=new WeakSet;class dr{constructor(t){this.fn=t,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Q&&(Q.active?Q.effects.push(this):this.flags&=-2)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Cn.has(this)&&(Cn.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||hr(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Es(this),mr(this);const t=K,n=Ce;K=this,Ce=!0;try{return this.fn()}finally{gr(this),K=t,Ce=n,this.flags&=-3}}stop(){if(this.flags&1){for(let t=this.deps;t;t=t.nextDep)ts(t);this.deps=this.depsTail=void 0,Es(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Cn.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Pn(this)&&this.run()}get dirty(){return Pn(this)}}let pr=0,xt,vt;function hr(e,t=!1){if(e.flags|=8,t){e.next=vt,vt=e;return}e.next=xt,xt=e}function Qn(){pr++}function es(){if(--pr>0)return;if(vt){let t=vt;for(vt=void 0;t;){const n=t.next;t.next=void 0,t.flags&=-9,t=n}}let e;for(;xt;){let t=xt;for(xt=void 0;t;){const n=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(s){e||(e=s)}t=n}}if(e)throw e}function mr(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function gr(e){let t,n=e.depsTail,s=n;for(;s;){const r=s.prevDep;s.version===-1?(s===n&&(n=r),ts(s),Mi(s)):t=s,s.dep.activeLink=s.prevActiveLink,s.prevActiveLink=void 0,s=r}e.deps=t,e.depsTail=n}function Pn(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(br(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function br(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===Et)||(e.globalVersion=Et,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Pn(e))))return;e.flags|=2;const t=e.dep,n=K,s=Ce;K=e,Ce=!0;try{mr(e);const r=e.fn(e._value);(t.version===0||De(r,e._value))&&(e.flags|=128,e._value=r,t.version++)}catch(r){throw t.version++,r}finally{K=n,Ce=s,gr(e),e.flags&=-3}}function ts(e,t=!1){const{dep:n,prevSub:s,nextSub:r}=e;if(s&&(s.nextSub=r,e.prevSub=void 0),r&&(r.prevSub=s,e.nextSub=void 0),n.subs===e&&(n.subs=s,!s&&n.computed)){n.computed.flags&=-5;for(let i=n.computed.deps;i;i=i.nextDep)ts(i,!0)}!t&&!--n.sc&&n.map&&n.map.delete(n.key)}function Mi(e){const{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}let Ce=!0;const yr=[];function Fe(){yr.push(Ce),Ce=!1}function ke(){const e=yr.pop();Ce=e===void 0?!0:e}function Es(e){const{cleanup:t}=e;if(e.cleanup=void 0,t){const n=K;K=void 0;try{t()}finally{K=n}}}let Et=0;class Ii{constructor(t,n){this.sub=t,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class ns{constructor(t){this.computed=t,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(t){if(!K||!Ce||K===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==K)n=this.activeLink=new Ii(K,this),K.deps?(n.prevDep=K.depsTail,K.depsTail.nextDep=n,K.depsTail=n):K.deps=K.depsTail=n,_r(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){const s=n.nextDep;s.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=s),n.prevDep=K.depsTail,n.nextDep=void 0,K.depsTail.nextDep=n,K.depsTail=n,K.deps===n&&(K.deps=s)}return n}trigger(t){this.version++,Et++,this.notify(t)}notify(t){Qn();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{es()}}}function _r(e){if(e.dep.sc++,e.sub.flags&4){const t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let s=t.deps;s;s=s.nextDep)_r(s)}const n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subs=e}}const Nn=new WeakMap,st=Symbol(""),Ln=Symbol(""),Ot=Symbol("");function te(e,t,n){if(Ce&&K){let s=Nn.get(e);s||Nn.set(e,s=new Map);let r=s.get(n);r||(s.set(n,r=new ns),r.map=s,r.key=n),r.track()}}function Ve(e,t,n,s,r,i){const o=Nn.get(e);if(!o){Et++;return}const l=a=>{a&&a.trigger()};if(Qn(),t==="clear")o.forEach(l);else{const a=M(e),p=a&&Zn(n);if(a&&n==="length"){const u=Number(s);o.forEach((d,v)=>{(v==="length"||v===Ot||!Le(v)&&v>=u)&&l(d)})}else switch((n!==void 0||o.has(void 0))&&l(o.get(n)),p&&l(o.get(Ot)),t){case"add":a?p&&l(o.get("length")):(l(o.get(st)),qe(e)&&l(o.get(Ln)));break;case"delete":a||(l(o.get(st)),qe(e)&&l(o.get(Ln)));break;case"set":qe(e)&&l(o.get(st));break}}es()}function ot(e){const t=k(e);return t===e||(te(t,"iterate",Ot),be(e))?t:He(e)?Ge(e)?t.map(n=>Je(ye(n))):t.map(Je):t.map(ye)}function un(e){return te(e=k(e),"iterate",Ot),e}function Me(e,t){return He(e)?Je(Ge(e)?ye(t):t):ye(t)}const ji={__proto__:null,[Symbol.iterator](){return Sn(this,Symbol.iterator,e=>Me(this,e))},concat(...e){return ot(this).concat(...e.map(t=>M(t)?ot(t):t))},entries(){return Sn(this,"entries",e=>(e[1]=Me(this,e[1]),e))},every(e,t){return $e(this,"every",e,t,void 0,arguments)},filter(e,t){return $e(this,"filter",e,t,n=>n.map(s=>Me(this,s)),arguments)},find(e,t){return $e(this,"find",e,t,n=>Me(this,n),arguments)},findIndex(e,t){return $e(this,"findIndex",e,t,void 0,arguments)},findLast(e,t){return $e(this,"findLast",e,t,n=>Me(this,n),arguments)},findLastIndex(e,t){return $e(this,"findLastIndex",e,t,void 0,arguments)},forEach(e,t){return $e(this,"forEach",e,t,void 0,arguments)},includes(...e){return wn(this,"includes",e)},indexOf(...e){return wn(this,"indexOf",e)},join(e){return ot(this).join(e)},lastIndexOf(...e){return wn(this,"lastIndexOf",e)},map(e,t){return $e(this,"map",e,t,void 0,arguments)},pop(){return ht(this,"pop")},push(...e){return ht(this,"push",e)},reduce(e,...t){return As(this,"reduce",e,t)},reduceRight(e,...t){return As(this,"reduceRight",e,t)},shift(){return ht(this,"shift")},some(e,t){return $e(this,"some",e,t,void 0,arguments)},splice(...e){return ht(this,"splice",e)},toReversed(){return ot(this).toReversed()},toSorted(e){return ot(this).toSorted(e)},toSpliced(...e){return ot(this).toSpliced(...e)},unshift(...e){return ht(this,"unshift",e)},values(){return Sn(this,"values",e=>Me(this,e))}};function Sn(e,t,n){const s=un(e),r=s[t],i=r.call(s);if(s!==e&&!be(e)){if(i[Symbol.toStringTag]==="Array Iterator"){const o=Object.create(Object.getPrototypeOf(i));return o.next=()=>Os(i.next(),n),r!==xr[t]&&Object.defineProperties(o,{return:{get(){const l=i.return;return typeof l=="function"?l.bind(i):l}},throw:{get(){const l=i.throw;return typeof l=="function"?l.bind(i):l}}}),o}i._next=i.next,i.next=()=>Os(i._next(),n)}return i}function Os(e,t){return e.done||(e.value=t(e.value)),e}const xr=Array.prototype;function $e(e,t,n,s,r,i){const o=un(e),l=o!==e&&!be(e),a=o[t];if(a!==xr[t]){const d=a.apply(e,i);return l?ye(d):d}let p=n;o!==e&&(l?p=function(d,v){return n.call(this,Me(e,d),v,e)}:n.length>2&&(p=function(d,v){return n.call(this,d,v,e)}));const u=a.call(o,p,s);return l&&r?r(u):u}function As(e,t,n,s){const r=un(e),i=r!==e&&!be(e);let o=n,l=!1;r!==e&&(i?(l=s.length===0,o=function(p,u,d){return l&&(l=!1,p=Me(e,p)),n.call(this,p,Me(e,u),d,e)}):n.length>3&&(o=function(p,u,d){return n.call(this,p,u,d,e)}));const a=r[t](o,...s);return l?Me(e,a):a}function wn(e,t,n){const s=k(e);te(s,"iterate",Ot);const r=s[t](...n);return(r===-1||r===!1)&&os(n[0])?(n[0]=k(n[0]),s[t](...n)):r}function ht(e,t,n=[]){Fe(),Qn();const s=k(e)[t].apply(e,n);return es(),ke(),s}const Di=Jn("__proto__,__v_isRef,__isVue"),vr=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(Le));function Pi(e){Le(e)||(e=String(e));const t=k(this);return te(t,"has",e),t.hasOwnProperty(e)}class Cr{constructor(t=!1,n=!1){this._isReadonly=t,this._isShallow=n}get(t,n,s){if(n==="__v_skip")return t.__v_skip;const r=this._isReadonly,i=this._isShallow;if(n==="__v_isReactive")return!r;if(n==="__v_isReadonly")return r;if(n==="__v_isShallow")return i;if(n==="__v_raw")return s===(r?i?Ki:Rr:i?Tr:wr).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(s)?t:void 0;const o=M(t);if(!r){let a;if(o&&(a=ji[n]))return a;if(n==="hasOwnProperty")return Pi}const l=Reflect.get(t,n,se(t)?t:s);if((Le(n)?vr.has(n):Di(n))||(r||te(t,"get",n),i))return l;if(se(l)){const a=o&&Zn(n)?l:l.value;return r&&$(a)?kn(a):a}return $(l)?r?kn(l):rs(l):l}}class Sr extends Cr{constructor(t=!1){super(!1,t)}set(t,n,s,r){let i=t[n];const o=M(t)&&Zn(n);if(!this._isShallow){const p=He(i);if(!be(s)&&!He(s)&&(i=k(i),s=k(s)),!o&&se(i)&&!se(s))return p||(i.value=s),!0}const l=o?Number(n)<t.length:F(t,n),a=Reflect.set(t,n,s,se(t)?t:r);return t===k(r)&&a&&(l?De(s,i)&&Ve(t,"set",n,s):Ve(t,"add",n,s)),a}deleteProperty(t,n){const s=F(t,n);t[n];const r=Reflect.deleteProperty(t,n);return r&&s&&Ve(t,"delete",n,void 0),r}has(t,n){const s=Reflect.has(t,n);return(!Le(n)||!vr.has(n))&&te(t,"has",n),s}ownKeys(t){return te(t,"iterate",M(t)?"length":st),Reflect.ownKeys(t)}}class Ni extends Cr{constructor(t=!1){super(!0,t)}set(t,n){return!0}deleteProperty(t,n){return!0}}const Li=new Sr,Fi=new Ni,ki=new Sr(!0);const Fn=e=>e,Bt=e=>Reflect.getPrototypeOf(e);function Hi(e,t,n){return function(...s){const r=this.__v_raw,i=k(r),o=qe(i),l=e==="entries"||e===Symbol.iterator&&o,a=e==="keys"&&o,p=r[e](...s),u=n?Fn:t?Je:ye;return!t&&te(i,"iterate",a?Ln:st),ee(Object.create(p),{next(){const{value:d,done:v}=p.next();return v?{value:d,done:v}:{value:l?[u(d[0]),u(d[1])]:u(d),done:v}}})}}function Vt(e){return function(...t){return e==="delete"?!1:e==="clear"?void 0:this}}function $i(e,t){const n={get(r){const i=this.__v_raw,o=k(i),l=k(r);e||(De(r,l)&&te(o,"get",r),te(o,"get",l));const{has:a}=Bt(o),p=t?Fn:e?Je:ye;if(a.call(o,r))return p(i.get(r));if(a.call(o,l))return p(i.get(l));i!==o&&i.get(r)},get size(){const r=this.__v_raw;return!e&&te(k(r),"iterate",st),r.size},has(r){const i=this.__v_raw,o=k(i),l=k(r);return e||(De(r,l)&&te(o,"has",r),te(o,"has",l)),r===l?i.has(r):i.has(r)||i.has(l)},forEach(r,i){const o=this,l=o.__v_raw,a=k(l),p=t?Fn:e?Je:ye;return!e&&te(a,"iterate",st),l.forEach((u,d)=>r.call(i,p(u),p(d),o))}};return ee(n,e?{add:Vt("add"),set:Vt("set"),delete:Vt("delete"),clear:Vt("clear")}:{add(r){const i=k(this),o=Bt(i),l=k(r),a=!t&&!be(r)&&!He(r)?l:r;return o.has.call(i,a)||De(r,a)&&o.has.call(i,r)||De(l,a)&&o.has.call(i,l)||(i.add(a),Ve(i,"add",a,a)),this},set(r,i){!t&&!be(i)&&!He(i)&&(i=k(i));const o=k(this),{has:l,get:a}=Bt(o);let p=l.call(o,r);p||(r=k(r),p=l.call(o,r));const u=a.call(o,r);return o.set(r,i),p?De(i,u)&&Ve(o,"set",r,i):Ve(o,"add",r,i),this},delete(r){const i=k(this),{has:o,get:l}=Bt(i);let a=o.call(i,r);a||(r=k(r),a=o.call(i,r)),l&&l.call(i,r);const p=i.delete(r);return a&&Ve(i,"delete",r,void 0),p},clear(){const r=k(this),i=r.size!==0,o=r.clear();return i&&Ve(r,"clear",void 0,void 0),o}}),["keys","values","entries",Symbol.iterator].forEach(r=>{n[r]=Hi(r,e,t)}),n}function ss(e,t){const n=$i(e,t);return(s,r,i)=>r==="__v_isReactive"?!e:r==="__v_isReadonly"?e:r==="__v_isShallow"?t:r==="__v_raw"?s:Reflect.get(F(n,r)&&r in s?n:s,r,i)}const Ui={get:ss(!1,!1)},Bi={get:ss(!1,!0)},Vi={get:ss(!0,!1)};const wr=new WeakMap,Tr=new WeakMap,Rr=new WeakMap,Ki=new WeakMap;function Wi(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function rs(e){return He(e)?e:is(e,!1,Li,Ui,wr)}function zi(e){return is(e,!1,ki,Bi,Tr)}function kn(e){return is(e,!0,Fi,Vi,Rr)}function is(e,t,n,s,r){if(!$(e)||e.__v_raw&&!(t&&e.__v_isReactive)||e.__v_skip||!Object.isExtensible(e))return e;const i=r.get(e);if(i)return i;const o=Wi(gi(e));if(o===0)return e;const l=new Proxy(e,o===2?s:n);return r.set(e,l),l}function Ge(e){return He(e)?Ge(e.__v_raw):!!(e&&e.__v_isReactive)}function He(e){return!!(e&&e.__v_isReadonly)}function be(e){return!!(e&&e.__v_isShallow)}function os(e){return e?!!e.__v_raw:!1}function k(e){const t=e&&e.__v_raw;return t?k(t):e}function qi(e){return!F(e,"__v_skip")&&Object.isExtensible(e)&&cr(e,"__v_skip",!0),e}const ye=e=>$(e)?rs(e):e,Je=e=>$(e)?kn(e):e;function se(e){return e?e.__v_isRef===!0:!1}function Er(e){return Gi(e,!1)}function Gi(e,t){return se(e)?e:new Ji(e,t)}class Ji{constructor(t,n){this.dep=new ns,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?t:k(t),this._value=n?t:ye(t),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(t){const n=this._rawValue,s=this.__v_isShallow||be(t)||He(t);t=s?t:k(t),De(t,n)&&(this._rawValue=t,this._value=s?t:ye(t),this.dep.trigger())}}function Or(e){return se(e)?e.value:e}const Yi={get:(e,t,n)=>t==="__v_raw"?e:Or(Reflect.get(e,t,n)),set:(e,t,n,s)=>{const r=e[t];return se(r)&&!se(n)?(r.value=n,!0):Reflect.set(e,t,n,s)}};function Ar(e){return Ge(e)?e:new Proxy(e,Yi)}class Zi{constructor(t,n,s){this.fn=t,this.setter=n,this._value=void 0,this.dep=new ns(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Et-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=s}notify(){if(this.flags|=16,!(this.flags&8)&&K!==this)return hr(this,!0),!0}get value(){const t=this.dep.track();return br(this),t&&(t.version=this.dep.version),this._value}set value(t){this.setter&&this.setter(t)}}function Xi(e,t,n=!1){let s,r;return j(e)?s=e:(s=e.get,r=e.set),new Zi(s,r,n)}const Kt={},Zt=new WeakMap;let tt;function Qi(e,t=!1,n=tt){if(n){let s=Zt.get(n);s||Zt.set(n,s=[]),s.push(e)}}function eo(e,t,n=z){const{immediate:s,deep:r,once:i,scheduler:o,augmentJob:l,call:a}=n,p=O=>r?O:be(O)||r===!1||r===0?ze(O,1):ze(O);let u,d,v,w,I=!1,T=!1;if(se(e)?(d=()=>e.value,I=be(e)):Ge(e)?(d=()=>p(e),I=!0):M(e)?(T=!0,I=e.some(O=>Ge(O)||be(O)),d=()=>e.map(O=>{if(se(O))return O.value;if(Ge(O))return p(O);if(j(O))return a?a(O,2):O()})):j(e)?t?d=a?()=>a(e,2):e:d=()=>{if(v){Fe();try{v()}finally{ke()}}const O=tt;tt=u;try{return a?a(e,3,[w]):e(w)}finally{tt=O}}:d=Ne,t&&r){const O=d,q=r===!0?1/0:r;d=()=>ze(O(),q)}const U=Ai(),L=()=>{u.stop(),U&&U.active&&Yn(U.effects,u)};if(i&&t){const O=t;t=(...q)=>{try{return O(...q)}finally{L()}}}let D=T?new Array(e.length).fill(Kt):Kt;const P=O=>{if(!(!(u.flags&1)||!u.dirty&&!O))if(t){const q=u.run();if(O||r||I||(T?q.some((pe,re)=>De(pe,D[re])):De(q,D))){const pe=tt;Fe();try{v&&v(),tt=u;const re=[q,D===Kt?void 0:T&&D[0]===Kt?[]:D,w];D=q,a?a(t,3,re):t(...re)}finally{tt=pe,ke()}}}else u.run()};return l&&l(P),u=new dr(d),u.scheduler=o?()=>o(P,!1):P,w=O=>Qi(O,!1,u),v=u.onStop=()=>{const O=Zt.get(u);if(O){if(a)a(O,4);else for(const q of O)q();Zt.delete(u)}},t?s?P(!0):D=u.run():o?o(P.bind(null,!0),!0):u.run(),L.pause=u.pause.bind(u),L.resume=u.resume.bind(u),L.stop=L,L}function ze(e,t=1/0,n){if(t<=0||!$(e)||e.__v_skip||(n=n||new Map,(n.get(e)||0)>=t))return e;if(n.set(e,t),t--,se(e))ze(e.value,t,n);else if(M(e))for(let s=0;s<e.length;s++)ze(e[s],t,n);else if(Yt(e)||qe(e))e.forEach(s=>{ze(s,t,n)});else if(or(e)){for(const s in e)ze(e[s],t,n);for(const s of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,s)&&ze(e[s],t,n)}return e}/**
* @vue/runtime-core v3.5.44
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Nt(e,t,n,s){try{return s?e(...s):e()}catch(r){dn(r,t,n)}}function we(e,t,n,s){if(j(e)){const r=Nt(e,t,n,s);return r&&rr(r)&&r.catch(i=>{dn(i,t,n)}),r}if(M(e)){const r=[];for(let i=0;i<e.length;i++)r.push(we(e[i],t,n,s));return r}}function dn(e,t,n,s=!0){const r=t?t.vnode:null,{errorHandler:i,throwUnhandledErrorInProduction:o}=t&&t.appContext.config||z;if(t){let l=t.parent;const a=t.proxy,p=`https://vuejs.org/error-reference/#runtime-${n}`;for(;l;){const u=l.ec;if(u){for(let d=0;d<u.length;d++)if(u[d](e,a,p)===!1)return}l=l.parent}if(i){Fe(),Nt(i,null,10,[e,a,p]),ke();return}}to(e,n,r,s,o)}function to(e,t,n,s=!0,r=!1){if(r)throw e;console.error(e)}const ce=[];let xe=-1;const Ie=[];let We=null,lt=0;const Mr=Promise.resolve();let Xt=null;function no(e){const t=Xt||Mr;return e?t.then(this?e.bind(this):e):t}function so(e){let t=xe+1,n=ce.length;for(;t<n;){const s=t+n>>>1,r=ce[s],i=At(r);i<e||i===e&&r.flags&2?t=s+1:n=s}return t}function ls(e){if(!(e.flags&1)){const t=At(e),n=ce[ce.length-1];!n||!(e.flags&2)&&t>=At(n)?ce.push(e):ce.splice(so(t),0,e),e.flags|=1,Ir()}}function Ir(){Xt||(Xt=Mr.then(Pr))}function ro(e){if(!M(e))We&&e.id===-1?We.splice(lt+1,0,e):e.flags&1||(Ie.push(e),e.flags|=1);else for(let t=0;t<e.length;t++)Ie.push(e[t]);Ir()}function jr(e,t,n,s=xe+1){for(;s<ce.length;s++){const r=ce[s];if(r&&r.flags&2){if(e&&r.id!==e.uid||t!==void 0&&!(r.id>=t))continue;ce.splice(s,1),s=e?s-1:xe,r.flags&4&&(r.flags&=-2),r(),r.flags&4||(r.flags&=-2)}}}function Dr(e,t,n=0){if(Ie.length){let s=Ie,r=0;if(t){s=[];for(let o=0;o<Ie.length;o++){const l=Ie[o];(l.i!==void 0?!l.i||l.i.uid<n:t.has(l))?Ie[r++]=l:s.push(l)}}const i=[...new Set(s)].sort((o,l)=>At(o)-At(l));if(Ie.length=r,We){for(let o=0;o<i.length;o++)We.push(i[o]);return}for(We=i,lt=0;lt<We.length;lt++){const o=We[lt];o.flags&4&&(o.flags&=-2),o.flags&8||o(),o.flags&=-2}We=null,lt=0}}let Tn=!1;function io(e,t){if(Tn){e();return}const n=t===void 0?void 0:new Set(Ie);e(),Tn=!0;try{jr(void 0,t),Dr(void 0,n,t)}finally{Tn=!1}}const At=e=>e.id==null?e.flags&2?-1:1/0:e.id;function Pr(e){try{for(xe=0;xe<ce.length;xe++){const t=ce[xe];t&&!(t.flags&8)&&(t.flags&4&&(t.flags&=-2),Nt(t,t.i,t.i?15:14),t.flags&4||(t.flags&=-2))}}finally{for(;xe<ce.length;xe++){const t=ce[xe];t&&(t.flags&=-2)}xe=-1,ce.length=0,Dr(),Xt=null,(ce.length||Ie.length)&&Pr()}}let Pe=null,Nr=null;function Qt(e){const t=Pe;return Pe=e,Nr=e&&e.type.__scopeId||null,t}function oo(e,t=Pe,n){if(!t||e._n)return e;const s=(...r)=>{s._d&&$s(-1);const i=Qt(t),o=rt.length;let l;try{l=e(...r)}finally{for(let a=rt.length;a>o;a--)ii();Qt(i),s._d&&$s(1)}return l};return s._n=!0,s._c=!0,s._d=!0,s}function Qe(e,t,n,s){const r=e.dirs,i=t&&t.dirs;for(let o=0;o<r.length;o++){const l=r[o];i&&(l.oldValue=i[o].value);let a=l.dir[s];a&&(Fe(),we(a,n,8,[e.el,l,e,t]),ke())}}function lo(e,t){if(ae){let n=ae.provides;const s=ae.parent&&ae.parent.provides;s===n&&(n=ae.provides=Object.create(s)),n[e]=t}}function zt(e,t,n=!1){const s=ll();if(s||ct){let r=ct?ct._context.provides:s?s.parent==null||s.ce?s.vnode.appContext&&s.vnode.appContext.provides:s.parent.provides:void 0;if(r&&e in r)return r[e];if(arguments.length>1)return n&&j(t)?t.call(s&&s.proxy):t}}const co=Symbol.for("v-scx"),ao=()=>zt(co);function qt(e,t,n){return Lr(e,t,n)}function Lr(e,t,n=z){const{immediate:s,deep:r,flush:i,once:o}=n,l=ee({},n),a=t&&s||!t&&i!=="post";let p;if(jt){if(i==="sync"){const w=ao();p=w.__watcherHandles||(w.__watcherHandles=[])}else if(!a){const w=()=>{};return w.stop=Ne,w.resume=Ne,w.pause=Ne,w}}const u=ae;l.call=(w,I,T)=>we(w,u,I,T);let d=!1;i==="post"?l.scheduler=w=>{w.i=u,ue(w,u&&u.suspense)}:i!=="sync"&&(d=!0,l.scheduler=(w,I)=>{I?w():ls(w)}),l.augmentJob=w=>{t&&(w.flags|=4),d&&(w.flags|=2,u&&(w.id=u.uid,w.i=u))};const v=eo(e,t,l);return jt&&(p?p.push(v):a&&v()),v}function fo(e,t,n){const s=this.proxy,r=J(e)?e.includes(".")?Fr(s,e):()=>s[e]:e.bind(s,s);let i;j(t)?i=t:(i=t.handler,n=t);const o=Lt(this),l=Lr(r,i.bind(s),n);return o(),l}function Fr(e,t){const n=t.split(".");return()=>{let s=e;for(let r=0;r<n.length&&s;r++)s=s[n[r]];return s}}const uo=Symbol("_vte"),pn=e=>e.__isTeleport,Rn=Symbol("_leaveCb");function po(e){let t=e[0];if(e.length>1){for(const n of e)if(n.type!==Te){t=n;break}}return t}function kr(e){if(!as(e))return pn(e.type)&&e.children?po(e.children):e;if(e.component)return e.component.subTree;const{shapeFlag:t,children:n}=e;if(n){if(t&16)return n[0];if(t&32&&j(n.default))return n.default()}}function en(e,t){if(e.shapeFlag&6&&e.component){e.transition=t;const n=e.component.subTree;en(pn(n.type)&&kr(n)||n,t)}else if(e.shapeFlag&128)e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback);else if(e.transition=t,e.type===ne&&M(e.children)){const n=zr(e.children,!1);n&&en(n,t)}}function Hn(e){if(e.component)return Hn(e.component.subTree);if(e.type===ne){const t=M(e.children)&&zr(e.children,!1);return t?Hn(t):void 0}if(e.type!==Te)return e}function cs(e,t){return j(e)?ee({name:e.name},t,{setup:e}):e}function Hr(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}function Ms(e,t){let n;return!!((n=Object.getOwnPropertyDescriptor(e,t))&&!n.configurable)}const tn=new WeakMap;function Ct(e,t,n,s,r=!1){if(M(e)){e.forEach((T,U)=>Ct(T,t&&(M(t)?t[U]:t),n,s,r));return}if(St(s)&&!r){s.shapeFlag&512&&s.type.__asyncResolved&&s.component.subTree.component&&Ct(e,t,n,s.component.subTree);return}const i=s.shapeFlag&4?ps(s.component):s.el,o=r?null:i,{i:l,r:a}=e,p=t&&t.r,u=l.refs===z?l.refs={}:l.refs,d=l.setupState,v=k(d),w=d===z?sr:T=>Ms(u,T)?!1:F(v,T),I=(T,U)=>!(U&&Ms(u,U));if(p!=null&&p!==a){if(Is(t),J(p))u[p]=null,w(p)&&(d[p]=null);else if(se(p)){const T=t;I(p,T.k)&&(p.value=null),T.k&&(u[T.k]=null)}}if(j(a))Nt(a,l,12,[o,u]);else{const T=J(a),U=se(a);if(T||U){const L=()=>{if(e.f){const D=T?w(a)?d[a]:u[a]:I()||!e.k?a.value:u[e.k];if(r)M(D)&&Yn(D,i);else if(M(D))D.includes(i)||D.push(i);else if(T)u[a]=[i],w(a)&&(d[a]=u[a]);else{const P=[i];I(a,e.k)&&(a.value=P),e.k&&(u[e.k]=P)}}else T?(u[a]=o,w(a)&&(d[a]=o)):U&&(I(a,e.k)&&(a.value=o),e.k&&(u[e.k]=o))};if(o){const D=()=>{L(),tn.delete(e)};D.id=-1,tn.set(e,D),ue(D,n)}else Is(e),L()}}}function Is(e){const t=tn.get(e);t&&(t.flags|=8,tn.delete(e))}an().requestIdleCallback;an().cancelIdleCallback;const St=e=>!!e.type.__asyncLoader,as=e=>e.type.__isKeepAlive;function ho(e,t){$r(e,"a",t)}function mo(e,t){$r(e,"da",t)}function $r(e,t,n=ae){const s=e.__wdc||(e.__wdc=()=>{let r=n;for(;r;){if(r.isDeactivated)return;r=r.parent}return e()});if(hn(t,s,n),n){let r=n.parent;for(;r&&r.parent;)as(r.parent.vnode)&&go(s,t,n,r),r=r.parent}}function go(e,t,n,s){const r=hn(t,e,s,!0);Ur(()=>{Yn(s[t],r)},n)}function hn(e,t,n=ae,s=!1){if(n){const r=n[e]||(n[e]=[]),i=t.__weh||(t.__weh=(...o)=>{Fe();const l=Lt(n),a=we(t,n,e,o);return l(),ke(),a});return s?r.unshift(i):r.push(i),i}}const Ke=e=>(t,n=ae)=>{(!jt||e==="sp")&&hn(e,(...s)=>t(...s),n)},bo=Ke("bm"),yo=Ke("m"),_o=Ke("bu"),xo=Ke("u"),vo=Ke("bum"),Ur=Ke("um"),Co=Ke("sp"),So=Ke("rtg"),wo=Ke("rtc");function To(e,t=ae){hn("ec",e,t)}const Ro=Symbol.for("v-ndc");function wt(e,t,n,s){let r;const i=n,o=M(e);if(o||J(e)){const l=o&&Ge(e);let a=!1,p=!1;l&&(a=!be(e),p=He(e),e=un(e)),r=new Array(e.length);for(let u=0,d=e.length;u<d;u++)r[u]=t(a?p?Je(ye(e[u])):ye(e[u]):e[u],u,void 0,i)}else if(typeof e=="number")if(!Number.isInteger(e)||e<0)r=[];else{r=new Array(e);for(let l=0;l<e;l++)r[l]=t(l+1,l,void 0,i)}else if($(e))if(e[Symbol.iterator])r=Array.from(e,(l,a)=>t(l,a,void 0,i));else{const l=Object.keys(e);r=new Array(l.length);for(let a=0,p=l.length;a<p;a++){const u=l[a];r[a]=t(e[u],u,a,i)}}else r=[];return r}const $n=e=>e?ai(e)?ps(e):$n(e.parent):null,Tt=ee(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>$n(e.parent),$root:e=>$n(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>Vr(e),$forceUpdate:e=>e.f||(e.f=()=>{ls(e.update)}),$nextTick:e=>e.n||(e.n=no.bind(e.proxy)),$watch:e=>fo.bind(e)}),En=(e,t)=>e!==z&&!e.__isScriptSetup&&F(e,t),Eo={get({_:e},t){if(t==="__v_skip")return!0;const{ctx:n,setupState:s,data:r,props:i,accessCache:o,type:l,appContext:a}=e;if(t[0]!=="$"){const v=o[t];if(v!==void 0)switch(v){case 1:return s[t];case 2:return r[t];case 4:return n[t];case 3:return i[t]}else{if(En(s,t))return o[t]=1,s[t];if(r!==z&&F(r,t))return o[t]=2,r[t];if(F(i,t))return o[t]=3,i[t];if(n!==z&&F(n,t))return o[t]=4,n[t];Un&&(o[t]=0)}}const p=Tt[t];let u,d;if(p)return t==="$attrs"&&te(e.attrs,"get",""),p(e);if((u=l.__cssModules)&&(u=u[t]))return u;if(n!==z&&F(n,t))return o[t]=4,n[t];if(d=a.config.globalProperties,F(d,t))return d[t]},set({_:e},t,n){const{data:s,setupState:r,ctx:i}=e;return En(r,t)?(r[t]=n,!0):s!==z&&F(s,t)?(s[t]=n,!0):F(e.props,t)||t[0]==="$"&&t.slice(1)in e?!1:(i[t]=n,!0)},has({_:{data:e,setupState:t,accessCache:n,ctx:s,appContext:r,props:i,type:o}},l){let a;return!!(n[l]||e!==z&&l[0]!=="$"&&F(e,l)||En(t,l)||F(i,l)||F(s,l)||F(Tt,l)||F(r.config.globalProperties,l)||(a=o.__cssModules)&&a[l])},defineProperty(e,t,n){return n.get!=null?e._.accessCache[t]=0:F(n,"value")&&this.set(e,t,n.value,null),Reflect.defineProperty(e,t,n)}};function js(e){return M(e)?e.reduce((t,n)=>(t[n]=null,t),{}):e}let Un=!0;function Oo(e){const t=Vr(e),n=e.proxy,s=e.ctx;Un=!1,t.beforeCreate&&Ds(t.beforeCreate,e,"bc");const{data:r,computed:i,methods:o,watch:l,provide:a,inject:p,created:u,beforeMount:d,mounted:v,beforeUpdate:w,updated:I,activated:T,deactivated:U,beforeDestroy:L,beforeUnmount:D,destroyed:P,unmounted:O,render:q,renderTracked:pe,renderTriggered:re,errorCaptured:fe,serverPrefetch:Ft,expose:Ye,inheritAttrs:ft,components:kt,directives:Ht,filters:yn}=t;if(p&&Ao(p,s,null),o)for(const G in o){const V=o[G];j(V)&&(s[G]=V.bind(n))}if(r){const G=r.call(n,n);$(G)&&(e.data=rs(G))}if(Un=!0,i)for(const G in i){const V=i[G],Ze=j(V)?V.bind(n,n):j(V.get)?V.get.bind(n,n):Ne,$t=!j(V)&&j(V.set)?V.set.bind(n):Ne,Xe=bn({get:Ze,set:$t});Object.defineProperty(s,G,{enumerable:!0,configurable:!0,get:()=>Xe.value,set:_e=>Xe.value=_e})}if(l)for(const G in l)Br(l[G],s,n,G);if(a){const G=j(a)?a.call(n):a;Reflect.ownKeys(G).forEach(V=>{lo(V,G[V])})}u&&Ds(u,e,"c");function ie(G,V){M(V)?V.forEach(Ze=>G(Ze.bind(n))):V&&G(V.bind(n))}if(ie(bo,d),ie(yo,v),ie(_o,w),ie(xo,I),ie(ho,T),ie(mo,U),ie(To,fe),ie(wo,pe),ie(So,re),ie(vo,D),ie(Ur,O),ie(Co,Ft),M(Ye))if(Ye.length){const G=e.exposed||(e.exposed={});Ye.forEach(V=>{Object.defineProperty(G,V,{get:()=>n[V],set:Ze=>n[V]=Ze,enumerable:!0})})}else e.exposed||(e.exposed={});q&&e.render===Ne&&(e.render=q),ft!=null&&(e.inheritAttrs=ft),kt&&(e.components=kt),Ht&&(e.directives=Ht),Ft&&Hr(e)}function Ao(e,t,n=Ne){M(e)&&(e=Bn(e));for(const s in e){const r=e[s];let i;$(r)?"default"in r?i=zt(r.from||s,r.default,!0):i=zt(r.from||s):i=zt(r),se(i)?Object.defineProperty(t,s,{enumerable:!0,configurable:!0,get:()=>i.value,set:o=>i.value=o}):t[s]=i}}function Ds(e,t,n){we(M(e)?e.map(s=>s.bind(t.proxy)):e.bind(t.proxy),t,n)}function Br(e,t,n,s){let r=s.includes(".")?Fr(n,s):()=>n[s];if(J(e)){const i=t[e];j(i)&&qt(r,i)}else if(j(e))qt(r,e.bind(n));else if($(e))if(M(e))e.forEach(i=>Br(i,t,n,s));else{const i=j(e.handler)?e.handler.bind(n):t[e.handler];j(i)&&qt(r,i,e)}}function Vr(e){const t=e.type,{mixins:n,extends:s}=t,{mixins:r,optionsCache:i,config:{optionMergeStrategies:o}}=e.appContext,l=i.get(t);let a;return l?a=l:!r.length&&!n&&!s?a=t:(a={},r.length&&r.forEach(p=>nn(a,p,o,!0)),nn(a,t,o)),$(t)&&i.set(t,a),a}function nn(e,t,n,s=!1){const{mixins:r,extends:i}=t;i&&nn(e,i,n,!0),r&&r.forEach(o=>nn(e,o,n,!0));for(const o in t)if(!(s&&o==="expose")){const l=Mo[o]||n&&n[o];e[o]=l?l(e[o],t[o]):t[o]}return e}const Mo={data:Ps,props:Ns,emits:Ns,methods:bt,computed:bt,beforeCreate:oe,created:oe,beforeMount:oe,mounted:oe,beforeUpdate:oe,updated:oe,beforeDestroy:oe,beforeUnmount:oe,destroyed:oe,unmounted:oe,activated:oe,deactivated:oe,errorCaptured:oe,serverPrefetch:oe,components:bt,directives:bt,watch:jo,provide:Ps,inject:Io};function Ps(e,t){return t?e?function(){return ee(j(e)?e.call(this,this):e,j(t)?t.call(this,this):t)}:t:e}function Io(e,t){return bt(Bn(e),Bn(t))}function Bn(e){if(M(e)){const t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function oe(e,t){return e?[...new Set([].concat(e,t))]:t}function bt(e,t){return e?ee(Object.create(null),e,t):t}function Ns(e,t){return e?M(e)&&M(t)?[...new Set([...e,...t])]:ee(Object.create(null),js(e),js(t??{})):t}function jo(e,t){if(!e)return t;if(!t)return e;const n=ee(Object.create(null),e);for(const s in t)n[s]=oe(e[s],t[s]);return n}function Kr(){return{app:null,config:{isNativeTag:sr,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let Do=0;function Po(e,t){return function(s,r=null){j(s)||(s=ee({},s)),r!=null&&!$(r)&&(r=null);const i=Kr(),o=new WeakSet,l=[];let a=!1;const p=i.app={_uid:Do++,_component:s,_props:r,_container:null,_context:i,_instance:null,version:pl,get config(){return i.config},set config(u){},use(u,...d){return o.has(u)||(u&&j(u.install)?(o.add(u),u.install(p,...d)):j(u)&&(o.add(u),u(p,...d))),p},mixin(u){return i.mixins.includes(u)||i.mixins.push(u),p},component(u,d){return d?(i.components[u]=d,p):i.components[u]},directive(u,d){return d?(i.directives[u]=d,p):i.directives[u]},mount(u,d,v){if(!a){const w=p._ceVNode||Se(s,r);return w.appContext=i,v===!0?v="svg":v===!1&&(v=void 0),e(w,u,v),a=!0,p._container=u,u.__vue_app__=p,ps(w.component)}},onUnmount(u){l.push(u)},unmount(){a&&(we(l,p._instance,16),e(null,p._container),delete p._container.__vue_app__)},provide(u,d){return i.provides[u]=d,p},runWithContext(u){const d=ct;ct=p;try{return u()}finally{ct=d}}};return p}}let ct=null;const No=(e,t)=>t==="modelValue"||t==="model-value"?e.modelModifiers:e[`${t}Modifiers`]||e[`${ve(t)}Modifiers`]||e[`${it(t)}Modifiers`];function Lo(e,t,...n){if(e.isUnmounted)return;const s=e.vnode.props||z;let r=n;const i=t.startsWith("update:"),o=i&&No(s,t.slice(7));o&&(o.trim&&(r=n.map(u=>J(u)?u.trim():u)),o.number&&(r=r.map(_i)));let l,a=s[l=_n(t)]||s[l=_n(ve(t))];!a&&i&&(a=s[l=_n(it(t))]),a&&we(a,e,6,r);const p=s[l+"Once"];if(p){if(!e.emitted)e.emitted={};else if(e.emitted[l])return;e.emitted[l]=!0,we(p,e,6,r)}}const Fo=new WeakMap;function Wr(e,t,n=!1){const s=n?Fo:t.emitsCache,r=s.get(e);if(r!==void 0)return r;const i=e.emits;let o={},l=!1;if(!j(e)){const a=p=>{const u=Wr(p,t,!0);u&&(l=!0,ee(o,u))};!n&&t.mixins.length&&t.mixins.forEach(a),e.extends&&a(e.extends),e.mixins&&e.mixins.forEach(a)}return!i&&!l?($(e)&&s.set(e,null),null):(M(i)?i.forEach(a=>o[a]=null):ee(o,i),$(e)&&s.set(e,o),o)}function mn(e,t){return!e||!on(t)?!1:(t=t.slice(2),t=t==="Once"?t:t.replace(/Once$/,""),F(e,t[0].toLowerCase()+t.slice(1))||F(e,it(t))||F(e,t))}function Ls(e){const{type:t,vnode:n,proxy:s,withProxy:r,propsOptions:[i],slots:o,attrs:l,emit:a,render:p,renderCache:u,props:d,data:v,setupState:w,ctx:I,inheritAttrs:T}=e,U=Qt(e);let L,D;try{if(n.shapeFlag&4){const O=r||s,q=O;L=je(p.call(q,O,u,d,w,v,I)),D=l}else{const O=t;L=je(O.length>1?O(d,{attrs:l,slots:o,emit:a}):O(d,null)),D=t.props?l:ko(l)}}catch(O){rt.length=0,dn(O,e,1),L=Se(Te)}let P=L;if(D&&T!==!1){const O=Object.keys(D),{shapeFlag:q}=P;O.length&&q&7&&(i&&O.some(ln)&&(D=Ho(D,i)),P=at(P,D,!1,!0))}if(n.dirs&&(P=at(P,null,!1,!0),P.dirs=P.dirs?P.dirs.concat(n.dirs):n.dirs),n.transition){const O=pn(P.type)&&kr(P)||P;en(O,n.transition)}return L=P,Qt(U),L}function zr(e,t=!0){let n;for(let s=0;s<e.length;s++){const r=e[s];if(ds(r)){if(r.type!==Te||r.children==="v-if"){if(n)return;n=r}}else return}return n}const ko=e=>{let t;for(const n in e)(n==="class"||n==="style"||on(n))&&((t||(t={}))[n]=e[n]);return t},Ho=(e,t)=>{const n={};for(const s in e)(!ln(s)||!(s.slice(9)in t))&&(n[s]=e[s]);return n};function $o(e,t,n){const{props:s,children:r,component:i}=e,{props:o,children:l,patchFlag:a}=t,p=i.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&a>=0){if(a&1024)return!0;if(a&16)return s?Fs(s,o,p):!!o;if(a&8){const u=t.dynamicProps;for(let d=0;d<u.length;d++){const v=u[d];if(qr(o,s,v)&&!mn(p,v))return!0}}}else return(r||l)&&(!l||!l.$stable)?!0:s===o?!1:s?o?Fs(s,o,p):!0:!!o;return!1}function Fs(e,t,n){const s=Object.keys(t);if(s.length!==Object.keys(e).length)return!0;for(let r=0;r<s.length;r++){const i=s[r];if(!F(e,i)||qr(t,e,i)&&!mn(n,i))return!0}return!1}function qr(e,t,n){const s=e[n],r=t[n];return n==="style"&&$(s)&&$(r)?!fn(s,r):s!==r}function Uo({vnode:e,parent:t,suspense:n},s){for(;t;){const r=t.subTree;if(r.suspense&&r.suspense.activeBranch===e&&(r.suspense.vnode.el=r.el=s,e=r),r===e)(e=t.vnode).el=s,t=t.parent;else break}n&&n.activeBranch===e&&(n.vnode.el=s)}const Gr={},Jr=()=>Object.create(Gr),Yr=e=>Object.getPrototypeOf(e)===Gr;function Bo(e,t,n,s=!1){const r={},i=Jr();e.propsDefaults=Object.create(null),Zr(e,t,r,i);for(const o in e.propsOptions[0])o in r||(r[o]=void 0);n?e.props=s?r:zi(r):e.type.props?e.props=r:e.props=i,e.attrs=i}function Vo(e,t,n,s){const{props:r,attrs:i,vnode:{patchFlag:o}}=e,l=k(r),[a]=e.propsOptions;let p=!1;if((s||o>0)&&!(o&16)){if(o&8){const u=e.vnode.dynamicProps;for(let d=0;d<u.length;d++){let v=u[d];if(mn(e.emitsOptions,v))continue;const w=t[v];if(a)if(F(i,v))w!==i[v]&&(i[v]=w,p=!0);else{const I=ve(v);r[I]=Vn(a,l,I,w,e,!1)}else w!==i[v]&&(i[v]=w,p=!0)}}}else{Zr(e,t,r,i)&&(p=!0);let u;for(const d in l)(!t||!F(t,d)&&((u=it(d))===d||!F(t,u)))&&(a?n&&(n[d]!==void 0||n[u]!==void 0)&&(r[d]=Vn(a,l,d,void 0,e,!0)):delete r[d]);if(i!==l)for(const d in i)(!t||!F(t,d))&&(delete i[d],p=!0)}p&&Ve(e.attrs,"set","")}function Zr(e,t,n,s){const[r,i]=e.propsOptions;let o=!1,l;if(t)for(let a in t){if(_t(a))continue;const p=t[a];let u;r&&F(r,u=ve(a))?!i||!i.includes(u)?n[u]=p:(l||(l={}))[u]=p:mn(e.emitsOptions,a)||(!(a in s)||p!==s[a])&&(s[a]=p,o=!0)}if(i){const a=k(n),p=l||z;for(let u=0;u<i.length;u++){const d=i[u];n[d]=Vn(r,a,d,p[d],e,!F(p,d))}}return o}function Vn(e,t,n,s,r,i){const o=e[n];if(o!=null){const l=F(o,"default");if(l&&s===void 0){const a=o.default;if(o.type!==Function&&!o.skipFactory&&j(a)){const{propsDefaults:p}=r;if(n in p)s=p[n];else{const u=Lt(r);s=p[n]=a.call(null,t),u()}}else s=a;r.ce&&r.ce._setProp(n,s)}o[0]&&(i&&!l?s=!1:o[1]&&(s===""||s===it(n))&&(s=!0))}return s}const Ko=new WeakMap;function Xr(e,t,n=!1){const s=n?Ko:t.propsCache,r=s.get(e);if(r)return r;const i=e.props,o={},l=[];let a=!1;if(!j(e)){const u=d=>{a=!0;const[v,w]=Xr(d,t,!0);ee(o,v),w&&l.push(...w)};!n&&t.mixins.length&&t.mixins.forEach(u),e.extends&&u(e.extends),e.mixins&&e.mixins.forEach(u)}if(!i&&!a)return $(e)&&s.set(e,nt),nt;if(M(i))for(let u=0;u<i.length;u++){const d=ve(i[u]);ks(d)&&(o[d]=z)}else if(i)for(const u in i){const d=ve(u);if(ks(d)){const v=i[u],w=o[d]=M(v)||j(v)?{type:v}:ee({},v),I=w.type;let T=!1,U=!0;if(M(I))for(let L=0;L<I.length;++L){const D=I[L],P=j(D)&&D.name;if(P==="Boolean"){T=!0;break}else P==="String"&&(U=!1)}else T=j(I)&&I.name==="Boolean";w[0]=T,w[1]=U,(T||F(w,"default"))&&l.push(d)}}const p=[o,l];return $(e)&&s.set(e,p),p}function ks(e){return e[0]!=="$"&&!_t(e)}const fs=e=>e==="_"||e==="_ctx"||e==="$stable",us=e=>M(e)?e.map(je):[je(e)],Wo=(e,t,n)=>{if(t._n)return t;const s=oo((...r)=>us(t(...r)),n);return s._c=!1,s},Qr=(e,t,n)=>{const s=e._ctx;for(const r in e){if(fs(r))continue;const i=e[r];if(j(i))t[r]=Wo(r,i,s);else if(i!=null){const o=us(i);t[r]=()=>o}}},ei=(e,t)=>{const n=us(t);e.slots.default=()=>n},ti=(e,t,n)=>{for(const s in t)(n||!fs(s))&&(e[s]=t[s])},zo=(e,t,n)=>{const s=e.slots=Jr();if(e.vnode.shapeFlag&32){const r=t._;r?(ti(s,t,n),n&&cr(s,"_",r,!0)):Qr(t,s)}else t&&ei(e,t)},qo=(e,t,n)=>{const{vnode:s,slots:r}=e;let i=!0,o=z;if(s.shapeFlag&32){const l=t._;l?n&&l===1?i=!1:ti(r,t,n):(i=!t.$stable,Qr(t,r)),o=t}else t&&(ei(e,t),o={default:1});if(i)for(const l in r)!fs(l)&&o[l]==null&&delete r[l]},ue=Xo;function Go(e){return Jo(e)}function Jo(e,t){const n=an();n.__VUE__=!0;const{insert:s,remove:r,patchProp:i,createElement:o,createText:l,createComment:a,setText:p,setElementText:u,parentNode:d,nextSibling:v,setScopeId:w=Ne,insertStaticContent:I}=e,T=(c,f,h,y=null,g=null,b=null,C=void 0,x=null,_=!!f.dynamicChildren)=>{if(c===f)return;c&&!mt(c,f)&&(y=Ut(c),_e(c,g,b,!0),c=null),f.patchFlag===-2&&(_=!1,f.dynamicChildren=null),f.dynamicChildren&&c&&c.dynamicChildren&&c.dynamicChildren.hasOnce&&(f.dynamicChildren===nt&&(f.dynamicChildren=[]),f.dynamicChildren.hasOnce=!0);const{type:m,ref:R,shapeFlag:S}=f;switch(m){case gn:U(c,f,h,y);break;case Te:L(c,f,h,y);break;case Gt:c==null&&D(f,h,y,C);break;case ne:kt(c,f,h,y,g,b,C,x,_);break;default:S&1?q(c,f,h,y,g,b,C,x,_):S&6?Ht(c,f,h,y,g,b,C,x,_):(S&64||S&128)&&m.process(c,f,h,y,g,b,C,x,_,dt)}R!=null&&g?Ct(R,c&&c.ref,b,f||c,!f):R==null&&c&&c.ref!=null&&Ct(c.ref,null,b,c,!0)},U=(c,f,h,y)=>{if(c==null)s(f.el=l(f.children),h,y);else{const g=f.el=c.el;f.children!==c.children&&p(g,f.children)}},L=(c,f,h,y)=>{c==null?s(f.el=a(f.children||""),h,y):f.el=c.el},D=(c,f,h,y)=>{[c.el,c.anchor]=I(c.children,f,h,y,c.el,c.anchor)},P=({el:c,anchor:f},h,y)=>{let g;for(;c&&c!==f;)g=v(c),s(c,h,y),c=g;s(f,h,y)},O=({el:c,anchor:f})=>{let h;for(;c&&c!==f;)h=v(c),r(c),c=h;r(f)},q=(c,f,h,y,g,b,C,x,_)=>{if(f.type==="svg"?C="svg":f.type==="math"&&(C="mathml"),c==null)pe(f,h,y,g,b,C,x,_);else{const m=c.el&&c.el._isVueCE?c.el:null;try{m&&m._beginPatch(),Ft(c,f,g,b,C,x,_)}finally{m&&m._endPatch()}}},pe=(c,f,h,y,g,b,C,x)=>{let _,m;const{props:R,shapeFlag:S,transition:E,dirs:A}=c;if(_=c.el=o(c.type,b,R&&R.is,R),S&8?u(_,c.children):S&16&&fe(c.children,_,null,y,g,On(c,b),C,x),A&&Qe(c,null,y,"created"),re(_,c,c.scopeId,C,y),R){for(const B in R)B!=="value"&&!_t(B)&&i(_,B,null,R[B],b,y);"value"in R&&i(_,"value",null,R.value,b),(m=R.onVnodeBeforeMount)&&Ae(m,y,c)}A&&Qe(c,null,y,"beforeMount");const N=Yo(g,E);N&&E.beforeEnter(_),s(_,f,h),((m=R&&R.onVnodeMounted)||N||A)&&ue(()=>{try{m&&Ae(m,y,c),N&&E.enter(_),A&&Qe(c,null,y,"mounted")}finally{}},g)},re=(c,f,h,y,g)=>{if(h&&w(c,h),y)for(let b=0;b<y.length;b++)w(c,y[b]);if(g){let b=g.subTree;if(f===b||ri(b.type)&&(b.ssContent===f||b.ssFallback===f)){const C=g.vnode;re(c,C,C.scopeId,C.slotScopeIds,g.parent)}}},fe=(c,f,h,y,g,b,C,x,_=0)=>{for(let m=_;m<c.length;m++){const R=c[m]=x?Be(c[m]):je(c[m]);T(null,R,f,h,y,g,b,C,x)}},Ft=(c,f,h,y,g,b,C)=>{const x=f.el=c.el;let{patchFlag:_,dynamicChildren:m,dirs:R}=f;_|=c.patchFlag&16;const S=c.props||z,E=f.props||z;let A;if(h&&et(h,!1),(A=E.onVnodeBeforeUpdate)&&Ae(A,h,f,c),R&&Qe(f,c,h,"beforeUpdate"),h&&et(h,!0),m&&(!c.dynamicChildren||c.dynamicChildren.length!==m.length)&&(_=0,C=!1,m=null),(S.innerHTML&&E.innerHTML==null||S.textContent&&E.textContent==null)&&u(x,""),m?Ye(c.dynamicChildren,m,x,h,y,On(f,g),b):C||V(c,f,x,null,h,y,On(f,g),b,!1),_>0){if(_&16)ft(x,S,E,h,g);else if(_&2&&S.class!==E.class&&i(x,"class",null,E.class,g),_&4&&i(x,"style",S.style,E.style,g),_&8){const N=f.dynamicProps;for(let B=0;B<N.length;B++){const H=N[B],Y=S[H],X=E[H];(X!==Y||H==="value")&&i(x,H,Y,X,g,h)}}_&1&&c.children!==f.children&&u(x,f.children)}else!C&&m==null&&ft(x,S,E,h,g);((A=E.onVnodeUpdated)||R)&&ue(()=>{A&&Ae(A,h,f,c),R&&Qe(f,c,h,"updated")},y)},Ye=(c,f,h,y,g,b,C)=>{for(let x=0;x<f.length;x++){const _=c[x],m=f[x],R=_.el||Kn(_),S=R&&(_.type===ne||!mt(_,m)||_.shapeFlag&198)?d(R):h;T(_,m,S,null,y,g,b,C,!0)}},ft=(c,f,h,y,g)=>{if(f!==h){if(f!==z)for(const b in f)!_t(b)&&!(b in h)&&i(c,b,f[b],null,g,y);for(const b in h){if(_t(b))continue;const C=h[b],x=f[b];C!==x&&b!=="value"&&i(c,b,x,C,g,y)}"value"in h&&i(c,"value",f.value,h.value,g)}},kt=(c,f,h,y,g,b,C,x,_)=>{const m=f.el=c?c.el:l(""),R=f.anchor=c?c.anchor:l("");let{patchFlag:S,dynamicChildren:E,slotScopeIds:A}=f;A&&(x=x?x.concat(A):A),c==null?(s(m,h,y),s(R,h,y),fe(f.children||[],h,R,g,b,C,x,_)):S>0&&S&64&&E&&c.dynamicChildren&&c.dynamicChildren.length===E.length?(Ye(c.dynamicChildren,E,h,g,b,C,x),(f.key!=null||g&&f===g.subTree)&&ni(c,f,!0)):V(c,f,h,R,g,b,C,x,_)},Ht=(c,f,h,y,g,b,C,x,_)=>{f.slotScopeIds=x,c==null?f.shapeFlag&512?g.ctx.activate(f,h,y,C,_):yn(f,h,y,g,b,C,_):gs(c,f,_)},yn=(c,f,h,y,g,b,C)=>{const x=c.component=ol(c,y,g);if(as(c)&&(x.ctx.renderer=dt),cl(x,!1,C),x.asyncDep){if(g&&g.registerDep(x,ie,C,b),!c.el){const _=x.subTree=Se(Te);L(null,_,f,h),c.placeholder=_.el}}else ie(x,c,f,h,g,b,C)},gs=(c,f,h)=>{const y=f.component=c.component;if($o(c,f,h))if(y.asyncDep&&!y.asyncResolved){f.el=c.el,f.placeholder=c.placeholder,G(y,f,h);return}else y.next=f,y.update();else f.el=c.el,f.placeholder=c.placeholder,y.vnode=f},ie=(c,f,h,y,g,b,C)=>{const x=()=>{if(c.isMounted){let{next:S,bu:E,u:A,parent:N,vnode:B}=c;{const Ee=si(c);if(Ee){S&&(S.el=B.el,G(c,S,C)),Ee.asyncDep.then(()=>{ue(()=>{c.isUnmounted||m()},g)});return}}let H=S,Y;et(c,!1),S?(S.el=B.el,G(c,S,C)):S=B,E&&xn(E),(Y=S.props&&S.props.onVnodeBeforeUpdate)&&Ae(Y,N,S,B),et(c,!0);const X=Ls(c),Re=c.subTree;c.subTree=X,T(Re,X,d(Re.el),Ut(Re),c,g,b),S.el=X.el,H===null&&Uo(c,X.el),A&&ue(A,g),(Y=S.props&&S.props.onVnodeUpdated)&&ue(()=>Ae(Y,N,S,B),g)}else{let S;const{el:E,props:A}=f,{bm:N,m:B,parent:H,root:Y,type:X}=c,Re=St(f);et(c,!1),N&&xn(N),!Re&&(S=A&&A.onVnodeBeforeMount)&&Ae(S,H,f),et(c,!0);{Y.ce&&Y.ce._hasShadowRoot()&&Y.ce._injectChildStyle(X,c.parent?c.parent.type:void 0);const Ee=c.subTree=Ls(c);T(null,Ee,h,y,c,g,b),f.el=Ee.el}if(B&&ue(B,g),!Re&&(S=A&&A.onVnodeMounted)){const Ee=f;ue(()=>Ae(S,H,Ee),g)}(f.shapeFlag&256||H&&St(H.vnode)&&H.vnode.shapeFlag&256)&&c.a&&ue(c.a,g),c.isMounted=!0,f=h=y=null}};c.scope.on();const _=c.effect=new dr(x);c.scope.off();const m=c.update=_.run.bind(_),R=c.job=_.runIfDirty.bind(_);R.i=c,R.id=c.uid,_.scheduler=()=>ls(R),et(c,!0),m()},G=(c,f,h)=>{f.component=c;const y=c.vnode.props;c.vnode=f,c.next=null,Vo(c,f.props,y,h),qo(c,f.children,h),Fe(),jr(c),ke()},V=(c,f,h,y,g,b,C,x,_=!1)=>{const m=c&&c.children,R=c?c.shapeFlag:0,S=f.children,{patchFlag:E,shapeFlag:A}=f;if(E>0){if(E&128){$t(m,S,h,y,g,b,C,x,_);return}else if(E&256){Ze(m,S,h,y,g,b,C,x,_);return}}A&8?(R&16&&ut(m,g,b),S!==m&&u(h,S)):R&16?A&16?$t(m,S,h,y,g,b,C,x,_):ut(m,g,b,!0):(R&8&&u(h,""),A&16&&fe(S,h,y,g,b,C,x,_))},Ze=(c,f,h,y,g,b,C,x,_)=>{c=c||nt,f=f||nt;const m=c.length,R=f.length,S=Math.min(m,R);let E;for(E=0;E<S;E++){const A=f[E]=_?Be(f[E]):je(f[E]);T(c[E],A,h,null,g,b,C,x,_)}m>R?ut(c,g,b,!0,!1,S):fe(f,h,y,g,b,C,x,_,S)},$t=(c,f,h,y,g,b,C,x,_)=>{let m=0;const R=f.length;let S=c.length-1,E=R-1;for(;m<=S&&m<=E;){const A=c[m],N=f[m]=_?Be(f[m]):je(f[m]);if(mt(A,N))T(A,N,h,null,g,b,C,x,_);else break;m++}for(;m<=S&&m<=E;){const A=c[S],N=f[E]=_?Be(f[E]):je(f[E]);if(mt(A,N))T(A,N,h,null,g,b,C,x,_);else break;S--,E--}if(m>S){if(m<=E){const A=E+1,N=A<R?f[A].el:y;for(;m<=E;)T(null,f[m]=_?Be(f[m]):je(f[m]),h,N,g,b,C,x,_),m++}}else if(m>E)for(;m<=S;)_e(c[m],g,b,!0),m++;else{const A=m,N=m,B=new Map;for(m=N;m<=E;m++){const he=f[m]=_?Be(f[m]):je(f[m]);he.key!=null&&B.set(he.key,m)}let H,Y=0;const X=E-N+1;let Re=!1,Ee=0;const pt=new Array(X);for(m=0;m<X;m++)pt[m]=0;for(m=A;m<=S;m++){const he=c[m];if(Y>=X){_e(he,g,b,!0);continue}let Oe;if(he.key!=null)Oe=B.get(he.key);else for(H=N;H<=E;H++)if(pt[H-N]===0&&mt(he,f[H])){Oe=H;break}Oe===void 0?_e(he,g,b,!0):(pt[Oe-N]=m+1,Oe>=Ee?Ee=Oe:Re=!0,T(he,f[Oe],h,null,g,b,C,x,_),Y++)}const xs=Re?Zo(pt):nt;for(H=xs.length-1,m=X-1;m>=0;m--){const he=N+m,Oe=f[he],vs=f[he+1],Cs=he+1<R?vs.el||Kn(vs):y;pt[m]===0?T(null,Oe,h,Cs,g,b,C,x,_):Re&&(H<0||m!==xs[H]?Xe(Oe,h,Cs,2):H--)}}},Xe=(c,f,h,y,g=null)=>{const{el:b,type:C,transition:x,children:_,shapeFlag:m}=c;if(m&6){Xe(c.component.subTree,f,h,y);return}if(m&128){c.suspense.move(f,h,y);return}if(m&64){C.move(c,f,h,dt);return}if(C===ne){s(b,f,h);for(let S=0;S<_.length;S++)Xe(_[S],f,h,y);s(c.anchor,f,h);return}if(C===Gt){P(c,f,h);return}if(y!==2&&m&1&&x)if(y===0)x.persisted&&!b[Rn]?s(b,f,h):(x.beforeEnter(b),s(b,f,h),ue(()=>x.enter(b),g));else{const{leave:S,delayLeave:E,afterLeave:A}=x,N=()=>{c.ctx.isUnmounted?r(b):s(b,f,h)},B=()=>{const H=b._isLeaving||!!b[Rn];b._isLeaving&&b[Rn](!0),x.persisted&&!H?N():S(b,()=>{N(),A&&A()})};E?E(b,N,B):B()}else s(b,f,h)},_e=(c,f,h,y=!1,g=!1)=>{const{type:b,props:C,ref:x,children:_,dynamicChildren:m,shapeFlag:R,patchFlag:S,dirs:E,cacheIndex:A,memo:N}=c;if((S===-2||m&&m.hasOnce)&&(g=!1),x!=null&&(Fe(),Ct(x,null,h,c,!0),ke()),A!=null&&(!c.ctx||c.ctx===f)&&(f.renderCache[A]=void 0),R&256){f.ctx.deactivate(c);return}const B=R&1&&E,H=!St(c);let Y;if(H&&(Y=C&&C.onVnodeBeforeUnmount)&&Ae(Y,f,c),R&6)hi(c.component,h,y);else{if(R&128){c.suspense.unmount(h,y);return}B&&Qe(c,null,f,"beforeUnmount"),R&64?c.type.remove(c,f,h,dt,y):m&&!m.hasOnce&&(b!==ne||S>0&&S&64)?ut(m,f,h,!1,!0):(b===ne&&S&384||!g&&R&16)&&ut(_,f,h),y&&bs(c)}const X=N!=null&&A==null;(H&&(Y=C&&C.onVnodeUnmounted)||B||X)&&ue(()=>{Y&&Ae(Y,f,c),B&&Qe(c,null,f,"unmounted"),X&&(c.el=null)},h)},bs=c=>{const{type:f,el:h,anchor:y,transition:g}=c,b=f===ne;if(b&&!g){ys(h,y);return}if(f===Gt){O(c),g&&!g.persisted&&g.afterLeave&&g.afterLeave();return}const C=b?Hn(c):c,x=()=>{b?d(h)&&ys(h,y):r(h),g&&!g.persisted&&g.afterLeave&&g.afterLeave()};if(C&&C.shapeFlag&1&&g&&!g.persisted){const{leave:_,delayLeave:m}=g,R=C.el,S=()=>_(R,x);m?m(R,x,S):S()}else x()},ys=(c,f)=>{let h;for(;c!==f;)h=v(c),r(c),c=h;r(f)},hi=(c,f,h)=>{const{bum:y,scope:g,job:b,subTree:C,um:x,m:_,a:m}=c;Hs(_),Hs(m),y&&xn(y),g.stop(),b?(b.flags|=8,_e(C,c,f,h)):c.vnode.el&&C&&(C.transition=c.vnode.transition,_e(C,c,f,h)),x&&ue(x,f),ue(()=>{c.isUnmounted=!0},f)},ut=(c,f,h,y=!1,g=!1,b=0)=>{for(let C=b;C<c.length;C++)_e(c[C],f,h,y,g)},Ut=c=>{if(c.shapeFlag&6)return Ut(c.component.subTree);if(c.shapeFlag&128)return c.suspense.next();const f=v(c.anchor||c.el),h=f&&f[uo];return h?v(h):f},_s=(c,f,h)=>{const y=c&&f._vnode?void 0:c&&c.component?c.component.uid:il();io(()=>{c==null?f._vnode&&_e(f._vnode,null,null,!0):T(f._vnode||null,c,f,null,null,null,h),f._vnode=c},y)},dt={p:T,um:_e,m:Xe,r:bs,mt:yn,mc:fe,pc:V,pbc:Ye,n:Ut,o:e};return{render:_s,hydrate:void 0,createApp:Po(_s)}}function On({type:e,props:t},n){return n==="svg"&&e==="foreignObject"||n==="mathml"&&e==="annotation-xml"&&t&&t.encoding&&t.encoding.includes("html")?void 0:n}function et({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function Yo(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function ni(e,t,n=!1){const s=e.children,r=t.children;if(M(s)&&M(r))for(let i=0;i<s.length;i++){const o=s[i];let l=r[i];l.shapeFlag&1&&!l.dynamicChildren&&((l.patchFlag<=0||l.patchFlag===32)&&(l=r[i]=Be(r[i]),l.el=o.el),!n&&l.patchFlag!==-2&&ni(o,l)),l.type===gn&&(l.patchFlag===-1&&(l=r[i]=Be(l)),l.el=o.el),l.type===Te&&!l.el&&(l.el=o.el)}}function Zo(e){const t=e.slice(),n=[0];let s,r,i,o,l;const a=e.length;for(s=0;s<a;s++){const p=e[s];if(p!==0){if(r=n[n.length-1],e[r]<p){t[s]=r,n.push(s);continue}for(i=0,o=n.length-1;i<o;)l=i+o>>1,e[n[l]]<p?i=l+1:o=l;p<e[n[i]]&&(i>0&&(t[s]=n[i-1]),n[i]=s)}}for(i=n.length,o=n[i-1];i-- >0;)n[i]=o,o=t[o];return n}function si(e){const t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:si(t)}function Hs(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}function Kn(e){if(e.placeholder)return e.placeholder;const t=e.component;return t?Kn(t.subTree):null}const ri=e=>e.__isSuspense;function Xo(e,t){t&&t.pendingBranch?M(e)?t.effects.push(...e):t.effects.push(e):ro(e)}const ne=Symbol.for("v-fgt"),gn=Symbol.for("v-txt"),Te=Symbol.for("v-cmt"),Gt=Symbol.for("v-stc"),rt=[];let me=null;function Z(e=!1){rt.push(me=e?null:[])}function ii(){rt.pop(),me=rt[rt.length-1]||null}let Mt=1;function $s(e,t=!1){Mt+=e,e<0&&me&&t&&(me.hasOnce=!0)}function oi(e){return e.dynamicChildren=Mt>0?me||nt:null,ii(),Mt>0&&me&&me.push(e),e}function le(e,t,n,s,r,i){return oi(W(e,t,n,s,r,i,!0))}function Wn(e,t,n,s,r){return oi(Se(e,t,n,s,r,!0))}function ds(e){return e?e.__v_isVNode===!0:!1}function mt(e,t){return e.type===t.type&&e.key===t.key}const li=({key:e})=>e??null,Jt=({ref:e,ref_key:t,ref_for:n})=>(typeof e=="number"&&(e=""+e),e!=null?J(e)||se(e)||j(e)?{i:Pe,r:e,k:t,f:!!n}:e:null);function W(e,t=null,n=null,s=0,r=null,i=e===ne?0:1,o=!1,l=!1){const a={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&li(t),ref:t&&Jt(t),scopeId:Nr,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:i,patchFlag:s,dynamicProps:r,dynamicChildren:null,appContext:null,ctx:Pe};return l?(sn(a,n),i&128&&e.normalize(a)):n&&(a.shapeFlag|=J(n)?8:16),Mt>0&&!o&&me&&(a.patchFlag>0||i&6)&&a.patchFlag!==32&&me.push(a),a}const Se=Qo;function Qo(e,t=null,n=null,s=0,r=null,i=!1){if((!e||e===Ro)&&(e=Te),ds(e)){const l=at(e,t,!0);return n&&sn(l,n),Mt>0&&!i&&me&&(l.shapeFlag&6?me[me.indexOf(e)]=l:me.push(l)),l.patchFlag=-2,l}if(dl(e)&&(e=e.__vccOpts),t){t=el(t);let{class:l,style:a}=t;l&&!J(l)&&(t.class=Pt(l)),$(a)&&(os(a)&&!M(a)&&(a=ee({},a)),t.style=Xn(a))}const o=J(e)?1:ri(e)?128:pn(e)?64:$(e)?4:j(e)?2:0;return W(e,t,n,s,r,o,i,!0)}function el(e){return e?os(e)||Yr(e)?ee({},e):e:null}function at(e,t,n=!1,s=!1){const{props:r,ref:i,patchFlag:o,children:l,transition:a}=e,p=t?sl(r||{},t):r,u={__v_isVNode:!0,__v_skip:!0,type:e.type,props:p,key:p&&li(p),ref:t&&t.ref?n&&i?M(i)?i.concat(Jt(t)):[i,Jt(t)]:Jt(t):i,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:l,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==ne?o===-1?16:o|16:o,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:a,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&at(e.ssContent),ssFallback:e.ssFallback&&at(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce,cacheIndex:e.cacheIndex};return a&&s&&en(u,a.clone(u)),u}function zn(e=" ",t=0){return Se(gn,null,e,t)}function tl(e,t){const n=Se(Gt,null,e);return n.staticCount=t,n}function nl(e="",t=!1){return t?(Z(),Wn(Te,null,e)):Se(Te,null,e)}function je(e){return e==null||typeof e=="boolean"?Se(Te):M(e)?Se(ne,null,e.slice()):ds(e)?Be(e):Se(gn,null,String(e))}function Be(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:at(e)}function sn(e,t){let n=0;const{shapeFlag:s}=e;if(t==null)t=null;else if(M(t))n=16;else if(typeof t=="object")if(s&65){const r=t.default;r&&(r._c&&(r._d=!1),sn(e,r()),r._c&&(r._d=!0));return}else{n=32;const r=t._;!r&&!Yr(t)?t._ctx=Pe:r===3&&Pe&&(Pe.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else if(j(t)){if(s&65){sn(e,{default:t});return}t={default:t,_ctx:Pe},n=32}else t=String(t),s&64?(n=16,t=[zn(t)]):n=8;e.children=t,e.shapeFlag|=n}function sl(...e){const t={};for(let n=0;n<e.length;n++){const s=e[n];for(const r in s)if(r==="class")t.class!==s.class&&(t.class=Pt([t.class,s.class]));else if(r==="style")t.style=Xn([t.style,s.style]);else if(on(r)){const i=t[r],o=s[r];o&&i!==o&&!(M(i)&&i.includes(o))?t[r]=i?[].concat(i,o):o:o==null&&i==null&&!ln(r)&&(t[r]=o)}else r!==""&&(t[r]=s[r])}return t}function Ae(e,t,n,s=null){we(e,t,7,[n,s])}const rl=Kr();let ci=0;function il(){return ci}function ol(e,t,n){const s=e.type,r=(t?t.appContext:e.appContext)||rl,i={uid:ci++,vnode:e,type:s,parent:t,appContext:r,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new Oi(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(r.provides),ids:t?t.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Xr(s,r),emitsOptions:Wr(s,r),emit:null,emitted:null,propsDefaults:z,inheritAttrs:s.inheritAttrs,ctx:z,data:z,props:z,attrs:z,slots:z,refs:z,setupState:z,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return i.ctx={_:i},i.root=t?t.root:i,i.emit=Lo.bind(null,i),e.ce&&e.ce(i),i}let ae=null;const ll=()=>ae||Pe;let rn,It;{const e=an(),t=(n,s)=>{let r;return(r=e[n])||(r=e[n]=[]),r.push(s),i=>{r.length>1?r.forEach(o=>o(i)):r[0](i)}};rn=t("__VUE_INSTANCE_SETTERS__",n=>ae=n),It=t("__VUE_SSR_SETTERS__",n=>jt=n)}const Lt=e=>{const t=ae;return rn(e),e.scope.on(),()=>{e.scope.off(),rn(t)}},Us=()=>{ae&&ae.scope.off(),rn(null)};function ai(e){return e.vnode.shapeFlag&4}let jt=!1;function cl(e,t=!1,n=!1){t&&It(t);const{props:s,children:r}=e.vnode,i=ai(e);Bo(e,s,i,t),zo(e,r,n||t);const o=i?al(e,t):void 0;return t&&It(!1),o}function al(e,t){const n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,Eo);const{setup:s}=n;if(s){Fe();const r=e.setupContext=s.length>1?ul(e):null,i=Lt(e),o=Nt(s,e,0,[e.props,r]),l=rr(o);if(ke(),i(),(l||e.sp)&&!St(e)&&Hr(e),l){if(o.then(Us,Us),t)return o.then(a=>{It(!0);try{Bs(e,a,t)}finally{It(!1)}}).catch(a=>{dn(a,e,0)});e.asyncDep=o}else Bs(e,o)}else fi(e)}function Bs(e,t,n){j(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:$(t)&&(e.setupState=Ar(t)),fi(e)}function fi(e,t,n){const s=e.type;e.render||(e.render=s.render||Ne);{const r=Lt(e);Fe();try{Oo(e)}finally{ke(),r()}}}const fl={get(e,t){return te(e,"get",""),e[t]}};function ul(e){const t=n=>{e.exposed=n||{}};return{attrs:new Proxy(e.attrs,fl),slots:e.slots,emit:e.emit,expose:t}}function ps(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy(Ar(qi(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in Tt)return Tt[n](e)},has(t,n){return n in t||n in Tt}})):e.proxy}function dl(e){return j(e)&&"__vccOpts"in e}const bn=(e,t)=>Xi(e,t,jt),pl="3.5.44";/**
* @vue/runtime-dom v3.5.44
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let qn;const Vs=typeof window<"u"&&window.trustedTypes;if(Vs)try{qn=Vs.createPolicy("vue",{createHTML:e=>e})}catch{}const ui=qn?e=>qn.createHTML(e):e=>e,hl="http://www.w3.org/2000/svg",ml="http://www.w3.org/1998/Math/MathML",Ue=typeof document<"u"?document:null,Ks=Ue&&Ue.createElement("template"),gl={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{const t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,s)=>{const r=t==="svg"?Ue.createElementNS(hl,e):t==="mathml"?Ue.createElementNS(ml,e):n?Ue.createElement(e,{is:n}):Ue.createElement(e);return e==="select"&&s&&s.multiple!=null&&r.setAttribute("multiple",s.multiple),r},createText:e=>Ue.createTextNode(e),createComment:e=>Ue.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>Ue.querySelector(e),setScopeId(e,t){e.setAttribute(t,"")},insertStaticContent(e,t,n,s,r,i){const o=n?n.previousSibling:t.lastChild;if(r&&(r===i||r.nextSibling))for(;t.insertBefore(r.cloneNode(!0),n),!(r===i||!(r=r.nextSibling)););else{Ks.innerHTML=ui(s==="svg"?`<svg>${e}</svg>`:s==="mathml"?`<math>${e}</math>`:e);const l=Ks.content;if(s==="svg"||s==="mathml"){const a=l.firstChild;for(;a.firstChild;)l.appendChild(a.firstChild);l.removeChild(a)}t.insertBefore(l,n)}return[o?o.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},bl=Symbol("_vtc");function yl(e,t,n){const s=e[bl];s&&(t=(t?[t,...s]:[...s]).join(" ")),t==null?e.removeAttribute("class"):n?e.setAttribute("class",t):e.className=t}const Ws=Symbol("_vod"),_l=Symbol("_vsh"),xl=Symbol(""),vl=/(?:^|;)\s*display\s*:/;function Cl(e,t,n){const s=e.style,r=J(n);let i=!1;if(n&&!r){if(t)if(J(t))for(const o of t.split(";")){const l=o.slice(0,o.indexOf(":")).trim();n[l]==null&&yt(s,l,"")}else for(const o in t)n[o]==null&&yt(s,o,"");for(const o in n){o==="display"&&(i=!0);const l=n[o];l!=null?wl(e,o,!J(t)&&t?t[o]:void 0,l)||yt(s,o,l):yt(s,o,"")}}else if(r){if(t!==n){const o=s[xl];o&&(n+=";"+o),s.cssText=n,i=vl.test(n)}}else t&&e.removeAttribute("style");Ws in e&&((!r||t!==n)&&(e[Ws]=i?s.display:""),e[_l]&&(s.display="none"))}const Wt=/\s*!important$/;function yt(e,t,n){if(M(n))n.forEach(s=>yt(e,t,s));else if(n==null&&(n=""),t.startsWith("--"))Wt.test(n)?e.setProperty(t,n.replace(Wt,""),"important"):e.setProperty(t,n);else{const s=Sl(e,t);Wt.test(n)?e.setProperty(it(s),n.replace(Wt,""),"important"):e[s]=n}}const zs=["Webkit","Moz","ms"],An={};function Sl(e,t){const n=An[t];if(n)return n;let s=ve(t);if(s!=="filter"&&s in e)return An[t]=s;s=lr(s);for(let r=0;r<zs.length;r++){const i=zs[r]+s;if(i in e)return An[t]=i}return t}function wl(e,t,n,s){return e.tagName==="TEXTAREA"&&(t==="width"||t==="height")&&J(s)&&n===s}const qs="http://www.w3.org/1999/xlink";function Gs(e,t,n,s,r,i=Ti(t)){s&&t.startsWith("xlink:")?n==null?e.removeAttributeNS(qs,t.slice(6,t.length)):e.setAttributeNS(qs,t,n):n==null||i&&!ar(n)?e.removeAttribute(t):e.setAttribute(t,i?"":Le(n)?String(n):n)}function Js(e,t,n,s,r){if(t==="innerHTML"||t==="textContent"){n!=null&&(e[t]=t==="innerHTML"?ui(n):n);return}const i=e.tagName;if(t==="value"&&i!=="PROGRESS"&&!i.includes("-")){const l=i==="OPTION"?e.getAttribute("value")||"":e.value,a=n==null?e.type==="checkbox"?"on":"":String(n);(l!==a||!("_value"in e))&&(e.value=a),n==null&&e.removeAttribute(t),e._value=n;return}let o=!1;if(n===""||n==null){const l=typeof e[t];l==="boolean"?n=ar(n):n==null&&l==="string"?(n="",o=!0):l==="number"&&(n=0,o=!0)}try{e[t]=n}catch{}o&&e.removeAttribute(r||t)}function Tl(e,t,n,s){e.addEventListener(t,n,s)}function Rl(e,t,n,s){e.removeEventListener(t,n,s)}const Ys=Symbol("_vei");function El(e,t,n,s,r=null){const i=e[Ys]||(e[Ys]={}),o=i[t];if(s&&o)o.value=s;else{const[l,a]=Ml(t);if(s){const p=i[t]=Dl(s,r);Tl(e,l,p,a)}else o&&(Rl(e,l,o,a),i[t]=void 0)}}const Ol=/(Once|Passive|Capture)$/,Al=/^on:?(?:Once|Passive|Capture)$/;function Ml(e){let t,n;for(;(n=e.match(Ol))&&!Al.test(e);)t||(t={}),e=e.slice(0,e.length-n[1].length),t[n[1].toLowerCase()]=!0;return[e[2]===":"?e.slice(3):it(e.slice(2)),t]}let Mn=0;const Il=Promise.resolve(),jl=()=>Mn||(Il.then(()=>Mn=0),Mn=Date.now());function Dl(e,t){const n=s=>{if(!s._vts)s._vts=Date.now();else if(s._vts<=n.attached)return;const r=n.value;if(M(r)){const i=s.stopImmediatePropagation;s.stopImmediatePropagation=()=>{i.call(s),s._stopped=!0};const o=r.slice(),l=[s];for(let a=0;a<o.length&&!s._stopped;a++){const p=o[a];p&&we(p,t,5,l)}}else we(r,t,5,[s])};return n.value=e,n.attached=jl(),n}const Zs=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,Pl=(e,t,n,s,r,i)=>{const o=r==="svg";t==="class"?yl(e,s,o):t==="style"?Cl(e,n,s):on(t)?ln(t)||El(e,t,n,s,i):(t[0]==="."?(t=t.slice(1),!0):t[0]==="^"?(t=t.slice(1),!1):Nl(e,t,s,o))?(Js(e,t,s),!e.tagName.includes("-")&&(t==="value"||t==="checked"||t==="selected")&&Gs(e,t,s,o,i,t!=="value")):e._isVueCE&&(Ll(e,t)||e._def.__asyncLoader&&(/[A-Z]/.test(t)||!J(s)))?Js(e,ve(t),s,i,t):(t==="true-value"?e._trueValue=s:t==="false-value"&&(e._falseValue=s),Gs(e,t,s,o))};function Nl(e,t,n,s){if(s)return!!(t==="innerHTML"||t==="textContent"||t in e&&Zs(t)&&j(n));if(t==="spellcheck"||t==="draggable"||t==="translate"||t==="autocorrect"||t==="sandbox"&&e.tagName==="IFRAME"||t==="form"||t==="list"&&e.tagName==="INPUT"||t==="type"&&e.tagName==="TEXTAREA")return!1;if(t==="width"||t==="height"){const r=e.tagName;if(r==="IMG"||r==="VIDEO"||r==="CANVAS"||r==="SOURCE")return!1}return Zs(t)&&J(n)?!1:t in e}function Ll(e,t){const n=e._def.props;if(!n)return!1;const s=ve(t);return Array.isArray(n)?n.some(r=>ve(r)===s):Object.keys(n).some(r=>ve(r)===s)}const Fl=ee({patchProp:Pl},gl);let Xs;function kl(){return Xs||(Xs=Go(Fl))}const Hl=((...e)=>{const t=kl().createApp(...e),{mount:n}=t;return t.mount=s=>{const r=Ul(s);if(!r)return;const i=t._component;!j(i)&&!i.render&&!i.template&&(i.template=r.innerHTML),r.nodeType===1&&(r.textContent="");const o=n(r,!1,$l(r));return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),o},t});function $l(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function Ul(e){return J(e)?document.querySelector(e):e}const Bl=`id,name,bool,num,mytype,stringarray,numberarray,typearray,space field/sub,obj,objarray
Index,String,Boolean,Number,Enum,String[],Number[],Enum[],String,Object,Object[]
1,xxx,1,111,type1,"1, 2, 3","1, 2, 3",t1,a,"num:1,str:ab","num:1,,str:a;num:2"
2,xxx,,222,type2," a , b",,"t1,  t2",a,"str:hello,num:2","str:hi;;bool:true"
3,333,,NaN,,,"1,2","t2, t3, t4",b,,;
,,,,,,,,,,
4,444,0,Infinity,type2,",1,,b",",1,,3",,c,"num:4,bool:true,str:test","num:4,bool:false"
5,555,1,555,type1,"a
b","1
2",t3,c,"num:1
str:m","num:1
num:2"
`,Vl=`name,bool,num\r
EnumIndex,Boolean,Number\r
111,1,111\r
222,,222\r
333,,`,Kl=`id,base
Index,Ref[z-base.csv]
1,z1
`,Wl=`id,name,kind,params
Index,String,Enum,Object
101,fireball,attack,"damage:100,range:5,element:fire"
102,heal,support,"heal:200,target:ally"
103,lightning,attack,"damage:80,range:3,element:thunder,chain:3"
`,zl=`id,skill,level,damage,heal,manaCost
Index,Ref[skill.csv],Number,Number,Number,Number
1,101,1,100,0,20
2,101,2,150,0,30
3,102,1,0,200,40
4,103,1,80,0,25
`,ql=`id,name,skills
Index,String,Ref[skill.csv][]
1,hero1,"101,102"
2,hero2,"103"
`,Gl=`id,name
Index,String
z1,base-one
z2,base-two
`,Jl=`id,name,bool,num,mytype,stringarray,numberarray,typearray,space field/sub,obj,objarray
Index,String,Boolean,Number,Enum,String[],Number[],Enum[],String,Object,Object[]
1,xxx,1,111,type1,"1, 2, 3","1, 2, 3",t1,a,"num:1,str:ab","num:1,,str:a;num:2"
2,xxx,,222,type2," a , b",,"t1,  t2",a,"str:hello,num:2","str:hi;;bool:true"
3,333,,NaN,,,"1,2","t2, t3, t4",b,,;
,,,,,,,,,,
4,444,0,Infinity,type2,",1,,b",",1,,3",,c,"num:4,bool:true,str:test","num:4,bool:false"
5,555,1,555,type1,"a
b","1
2",t3,c,"num:1
str:m","num:1
num:2"
`,Yl=`name,bool,num\r
EnumIndex,Boolean,Number\r
111,1,111\r
222,,222\r
333,,`,Zl=`name,bool,num,dataRecord,myType,typeArr,enumIndexRecord,recordArr,tpl,tplArr
String,Boolean,Number,Ref[data.csv],RefEnum[data.csv.mytype],RefEnum[data.csv.typearray][],Ref[enum-index.csv],Ref[data.csv][],Template[data.csv],Template[data.csv][]
"xxx",1,111,1,type1,"t1, t2",111,"1,2","1|num:999,numberarray:[10,20]","1|num:10,bool:true
2|name:yyy,stringarray:[p,q]"
"xxx",,222,2,type2,,222,,"2|mytype:type2
obj:{str:hi,num:9}","3|mytype:type2,obj:{str:hi,num:9}"
333,,,,,,333,"3",4|name:zzz,4
`,Xl=`id,text
Index,String
skill.101.name,Fireball
skill.101.desc,"Deals {damage} fire damage to an enemy within {range}m."
skill.102.name,Heal
skill.102.desc,"Restores {heal} HP to a friendly target."
skill.103.name,Lightning
skill.103.desc,"Deals {damage} thunder damage, chaining up to {chain} targets."
unit.1.name,Hero One
unit.1.desc,"A brave hero.
Charges into battle first."
unit.2.name,Hero Two
`,Ql=`id,text
Index,String
skill.101.name,火球术
skill.101.desc,"对 {range} 米内的敌人造成 {damage} 点火焰伤害。"
skill.102.name,治疗术
skill.102.desc,"为友方目标恢复 {heal} 点生命值。"
skill.103.name,闪电链
skill.103.desc,"造成 {damage} 点雷电伤害，最多连锁 {chain} 个目标。"
unit.1.name,英雄一号
unit.1.desc,"勇敢的英雄。
总是率先冲锋。"
unit.2.name,英雄二号
`,ec=`num = 1\r
\r
str = "string"\r
\r
bool = true\r
\r
[ItemType]\r
book = 1\r
fruit = 2\r
`,tc=`num = 1\r
\r
str = "test"\r
\r
[ItemType]\r
book = 1\r
fruit = 2\r
`,nc=`// Auto Generated by config2ts, DO NOT EDIT

export namespace DataCsv {

    export type mytype = "type1" | "type2" | "";
    export const mytypeList: mytype[] = ["type1", "type2", ""];

    export type typearray = "t1" | "t2" | "t3" | "t4";
    export const typearrayList: typearray[] = ["t1", "t2", "t3", "t4"];

    export type obj = {
        num?: number;
        str?: string;
        bool?: boolean;
    };

    export type objarray = {
        num?: number;
        str?: string;
        bool?: boolean;
    };

    export interface Record {
        id: string;
        name: string;
        bool: boolean;
        num: number;
        mytype: mytype;
        stringarray: string[];
        numberarray: number[];
        typearray: typearray[];
        'space field/sub': string;
        obj: obj;
        objarray: objarray[];
    };

    export const List: Record[] = [
        {
            id: '1',
            name: 'xxx',
            bool: true,
            num: 111,
            mytype: 'type1',
            stringarray: ['1','2','3'],
            numberarray: [1,2,3],
            typearray: ['t1'],
            'space field/sub': 'a',
            obj: {num:1,str:'ab'},
            objarray: [{num:1,str:'a'},{num:2}],
        },
        {
            id: '2',
            name: 'xxx',
            bool: false,
            num: 222,
            mytype: 'type2',
            stringarray: ['a','b'],
            numberarray: [],
            typearray: ['t1','t2'],
            'space field/sub': 'a',
            obj: {str:'hello',num:2},
            objarray: [{str:'hi'},{},{bool:true}],
        },
        {
            id: '3',
            name: '333',
            bool: false,
            num: NaN,
            mytype: '',
            stringarray: [],
            numberarray: [1,2],
            typearray: ['t2','t3','t4'],
            'space field/sub': 'b',
            obj: {},
            objarray: [{},{}],
        },
        {
            id: '4',
            name: '444',
            bool: true,
            num: Infinity,
            mytype: 'type2',
            stringarray: ['','1','','b'],
            numberarray: [0,1,0,3],
            typearray: [],
            'space field/sub': 'c',
            obj: {num:4,bool:true,str:'test'},
            objarray: [{num:4,bool:false}],
        },
        {
            id: '5',
            name: '555',
            bool: true,
            num: 555,
            mytype: 'type1',
            stringarray: ['a','b'],
            numberarray: [1,2],
            typearray: ['t3'],
            'space field/sub': 'c',
            obj: {num:1,str:'m'},
            objarray: [{num:1},{num:2}],
        }
    ];

    export const Map: { [id: string]: Record } = {};
    for (const v of List) { Map[v.id] = v; };

};`,sc=`// Auto Generated by config2ts, DO NOT EDIT

export namespace EnumIndexCsv {

    export type name = "111" | "222" | "333";
    export const nameList: name[] = ["111", "222", "333"];

    export interface Record {
        name: name;
        bool: boolean;
        num: number;
    };

    export const List: Record[] = [
        {
            name: '111',
            bool: true,
            num: 111,
        },
        {
            name: '222',
            bool: false,
            num: 222,
        },
        {
            name: '333',
            bool: false,
            num: 0,
        }
    ];

    export const Map: { [id: string]: Record } = {};
    for (const v of List) { Map[v.name] = v; };

};`,rc=`// Auto Generated by config2ts, DO NOT EDIT

export namespace ZBaseCsv {

    export interface Record {
        id: string;
        name: string;
    };

    export const List: Record[] = [
        {
            id: 'z1',
            name: 'base-one',
        },
        {
            id: 'z2',
            name: 'base-two',
        }
    ];

    export const Map: { [id: string]: Record } = {};
    for (const v of List) { Map[v.id] = v; };

};

export namespace AUserCsv {

    export interface Record {
        id: string;
        base: ZBaseCsv.Record;
    };

    export const List: Record[] = [
        {
            id: '1',
            base: ZBaseCsv.Map["z1"],
        }
    ];

    export const Map: { [id: string]: Record } = {};
    for (const v of List) { Map[v.id] = v; };

};

export namespace SkillCsv {

    export type kind = "attack" | "support";
    export const kindList: kind[] = ["attack", "support"];

    export type params = {
        damage?: number;
        range?: number;
        element?: string;
        heal?: number;
        target?: string;
        chain?: number;
    };

    export interface Record {
        id: string;
        name: string;
        kind: kind;
        params: params;
    };

    export const List: Record[] = [
        {
            id: '101',
            name: 'fireball',
            kind: 'attack',
            params: {damage:100,range:5,element:'fire'},
        },
        {
            id: '102',
            name: 'heal',
            kind: 'support',
            params: {heal:200,target:'ally'},
        },
        {
            id: '103',
            name: 'lightning',
            kind: 'attack',
            params: {damage:80,range:3,element:'thunder',chain:3},
        }
    ];

    export const Map: { [id: string]: Record } = {};
    for (const v of List) { Map[v.id] = v; };

};

export namespace SkilllevelCsv {

    export interface Record {
        id: string;
        skill: SkillCsv.Record;
        level: number;
        damage: number;
        heal: number;
        manaCost: number;
    };

    export const List: Record[] = [
        {
            id: '1',
            skill: SkillCsv.Map["101"],
            level: 1,
            damage: 100,
            heal: 0,
            manaCost: 20,
        },
        {
            id: '2',
            skill: SkillCsv.Map["101"],
            level: 2,
            damage: 150,
            heal: 0,
            manaCost: 30,
        },
        {
            id: '3',
            skill: SkillCsv.Map["102"],
            level: 1,
            damage: 0,
            heal: 200,
            manaCost: 40,
        },
        {
            id: '4',
            skill: SkillCsv.Map["103"],
            level: 1,
            damage: 80,
            heal: 0,
            manaCost: 25,
        }
    ];

    export const Map: { [id: string]: Record } = {};
    for (const v of List) { Map[v.id] = v; };

};

export namespace UnitCsv {

    export interface Record {
        id: string;
        name: string;
        skills: SkillCsv.Record[];
    };

    export const List: Record[] = [
        {
            id: '1',
            name: 'hero1',
            skills: [SkillCsv.Map["101"],SkillCsv.Map["102"]],
        },
        {
            id: '2',
            name: 'hero2',
            skills: [SkillCsv.Map["103"]],
        }
    ];

    export const Map: { [id: string]: Record } = {};
    for (const v of List) { Map[v.id] = v; };

};`,ic=`// Auto Generated by config2ts, DO NOT EDIT

export namespace DataCsv {

    export type mytype = "type1" | "type2" | "";
    export const mytypeList: mytype[] = ["type1", "type2", ""];

    export type typearray = "t1" | "t2" | "t3" | "t4";
    export const typearrayList: typearray[] = ["t1", "t2", "t3", "t4"];

    export type obj = {
        num?: number;
        str?: string;
        bool?: boolean;
    };

    export type objarray = {
        num?: number;
        str?: string;
        bool?: boolean;
    };

    export interface Record {
        id: string;
        name: string;
        bool: boolean;
        num: number;
        mytype: mytype;
        stringarray: string[];
        numberarray: number[];
        typearray: typearray[];
        'space field/sub': string;
        obj: obj;
        objarray: objarray[];
    };

    export const List: Record[] = [
        {
            id: '1',
            name: 'xxx',
            bool: true,
            num: 111,
            mytype: 'type1',
            stringarray: ['1','2','3'],
            numberarray: [1,2,3],
            typearray: ['t1'],
            'space field/sub': 'a',
            obj: {num:1,str:'ab'},
            objarray: [{num:1,str:'a'},{num:2}],
        },
        {
            id: '2',
            name: 'xxx',
            bool: false,
            num: 222,
            mytype: 'type2',
            stringarray: ['a','b'],
            numberarray: [],
            typearray: ['t1','t2'],
            'space field/sub': 'a',
            obj: {str:'hello',num:2},
            objarray: [{str:'hi'},{},{bool:true}],
        },
        {
            id: '3',
            name: '333',
            bool: false,
            num: NaN,
            mytype: '',
            stringarray: [],
            numberarray: [1,2],
            typearray: ['t2','t3','t4'],
            'space field/sub': 'b',
            obj: {},
            objarray: [{},{}],
        },
        {
            id: '4',
            name: '444',
            bool: true,
            num: Infinity,
            mytype: 'type2',
            stringarray: ['','1','','b'],
            numberarray: [0,1,0,3],
            typearray: [],
            'space field/sub': 'c',
            obj: {num:4,bool:true,str:'test'},
            objarray: [{num:4,bool:false}],
        },
        {
            id: '5',
            name: '555',
            bool: true,
            num: 555,
            mytype: 'type1',
            stringarray: ['a','b'],
            numberarray: [1,2],
            typearray: ['t3'],
            'space field/sub': 'c',
            obj: {num:1,str:'m'},
            objarray: [{num:1},{num:2}],
        }
    ];

    export const Map: { [id: string]: Record } = {};
    for (const v of List) { Map[v.id] = v; };

};

export namespace EnumIndexCsv {

    export type name = "111" | "222" | "333";
    export const nameList: name[] = ["111", "222", "333"];

    export interface Record {
        name: name;
        bool: boolean;
        num: number;
    };

    export const List: Record[] = [
        {
            name: '111',
            bool: true,
            num: 111,
        },
        {
            name: '222',
            bool: false,
            num: 222,
        },
        {
            name: '333',
            bool: false,
            num: 0,
        }
    ];

    export const Map: { [id: string]: Record } = {};
    for (const v of List) { Map[v.name] = v; };

};

export namespace RefsCsv {

    export interface Record {
        name: string;
        bool: boolean;
        num: number;
        dataRecord: DataCsv.Record;
        myType: DataCsv.mytype;
        typeArr: DataCsv.typearray[];
        enumIndexRecord: EnumIndexCsv.Record;
        recordArr: DataCsv.Record[];
        tpl: DataCsv.Record;
        tplArr: DataCsv.Record[];
    };

    export const List: Record[] = [
        {
            name: 'xxx',
            bool: true,
            num: 111,
            dataRecord: DataCsv.Map["1"],
            myType: 'type1',
            typeArr: ['t1','t2'],
            enumIndexRecord: EnumIndexCsv.Map["111"],
            recordArr: [DataCsv.Map["1"],DataCsv.Map["2"]],
            tpl: {...DataCsv.Map["1"],num:999,numberarray:[10,20]},
            tplArr: [{...DataCsv.Map["1"],num:10,bool:true},{...DataCsv.Map["2"],name:'yyy',stringarray:['p','q']}],
        },
        {
            name: 'xxx',
            bool: false,
            num: 222,
            dataRecord: DataCsv.Map["2"],
            myType: 'type2',
            typeArr: [],
            enumIndexRecord: EnumIndexCsv.Map["222"],
            recordArr: [],
            tpl: {...DataCsv.Map["2"],mytype:'type2',obj:{str:'hi',num:9}},
            tplArr: [{...DataCsv.Map["3"],mytype:'type2',obj:{str:'hi',num:9}}],
        },
        {
            name: '333',
            bool: false,
            num: 0,
            dataRecord: DataCsv.Map[""],
            myType: '',
            typeArr: [],
            enumIndexRecord: EnumIndexCsv.Map["333"],
            recordArr: [DataCsv.Map["3"]],
            tpl: {...DataCsv.Map["4"],name:'zzz'},
            tplArr: [DataCsv.Map["4"]],
        }
    ];

};`,oc=`// Auto Generated by config2ts, DO NOT EDIT

export namespace LangEnCsv {

    export interface Record {
        id: string;
        text: string;
    };

    export const List: Record[] = [
        {
            id: 'skill.101.name',
            text: 'Fireball',
        },
        {
            id: 'skill.101.desc',
            text: 'Deals {damage} fire damage to an enemy within {range}m.',
        },
        {
            id: 'skill.102.name',
            text: 'Heal',
        },
        {
            id: 'skill.102.desc',
            text: 'Restores {heal} HP to a friendly target.',
        },
        {
            id: 'skill.103.name',
            text: 'Lightning',
        },
        {
            id: 'skill.103.desc',
            text: 'Deals {damage} thunder damage, chaining up to {chain} targets.',
        },
        {
            id: 'unit.1.name',
            text: 'Hero One',
        },
        {
            id: 'unit.1.desc',
            text: 'A brave hero.\\nCharges into battle first.',
        },
        {
            id: 'unit.2.name',
            text: 'Hero Two',
        }
    ];

    export const Map: { [id: string]: Record } = {};
    for (const v of List) { Map[v.id] = v; };

};

export namespace LangZhCsv {

    export interface Record {
        id: string;
        text: string;
    };

    export const List: Record[] = [
        {
            id: 'skill.101.name',
            text: '火球术',
        },
        {
            id: 'skill.101.desc',
            text: '对 {range} 米内的敌人造成 {damage} 点火焰伤害。',
        },
        {
            id: 'skill.102.name',
            text: '治疗术',
        },
        {
            id: 'skill.102.desc',
            text: '为友方目标恢复 {heal} 点生命值。',
        },
        {
            id: 'skill.103.name',
            text: '闪电链',
        },
        {
            id: 'skill.103.desc',
            text: '造成 {damage} 点雷电伤害，最多连锁 {chain} 个目标。',
        },
        {
            id: 'unit.1.name',
            text: '英雄一号',
        },
        {
            id: 'unit.1.desc',
            text: '勇敢的英雄。\\n总是率先冲锋。',
        },
        {
            id: 'unit.2.name',
            text: '英雄二号',
        }
    ];

    export const Map: { [id: string]: Record } = {};
    for (const v of List) { Map[v.id] = v; };

};`,lc=`// Auto Generated by config2ts, DO NOT EDIT

export const IniFileIni = {
    num: 1,
    str: 'string',
    bool: true,
    ItemType: {
        book: 1,
        fruit: 2,
    },
};

export const TomlFileToml = {
    num: 1,
    str: 'test',
    ItemType: {
        book: 1,
        fruit: 2,
    },
};`,cc="# 01-basic-types\n\nScalar and structured field types in one table: `Index` / `String` / `Boolean` / `Number` (incl. `NaN` / `Infinity` / empty cells) / `Enum` / `String[]` / `Number[]` / `Enum[]` (empty slots, whitespace trimming, multiline cells) / `Object` / `Object[]` (`;`-separated entries, empty slots).\n",ac="# 02-enum-index\n\n`EnumIndex` first column: every row becomes a distinct object literal type, the key union type and `KeyList` are emitted, and rows are addressable via `Map`.\n",fc="# 03-cross-ref\n\nCross-table references: `Ref[file]` (single row), `Ref[file][]` (comma-separated row ids). Tables: `z-base` / `skill` / `skilllevel` / `unit` / `a-user` chained through references; generation topologically sorts referenced tables first.\n",uc="# 04-refs-and-templates\n\nA table without an `Index` column (`refs.csv`) exercising `RefEnum[file]`, `RefEnum[file.field][]`, `Ref[file]`, `Ref[file][]`, `Template[file]` and `Template[file][]` — template cells inherit a base row and override selected fields (`<baseId>|<key>:<value>,...`). Requires `data.csv` and `enum-index.csv` as reference targets.\n",dc="# 05-multiline-strings\n\n`String` cells containing quoted line breaks (multi-line descriptions) and dotted ids (`skill.101.name`); a language-pair table layout.\n",pc="# 06-ini-toml\n\nNon-CSV formats: `.ini` and `.toml` tables converted with the same namespace generation, including nested sections (`[ItemType]`).\n",hc=Object.assign({"../../fixtures/01-basic-types/data.csv":Bl,"../../fixtures/02-enum-index/enum-index.csv":Vl,"../../fixtures/03-cross-ref/a-user.csv":Kl,"../../fixtures/03-cross-ref/skill.csv":Wl,"../../fixtures/03-cross-ref/skilllevel.csv":zl,"../../fixtures/03-cross-ref/unit.csv":ql,"../../fixtures/03-cross-ref/z-base.csv":Gl,"../../fixtures/04-refs-and-templates/data.csv":Jl,"../../fixtures/04-refs-and-templates/enum-index.csv":Yl,"../../fixtures/04-refs-and-templates/refs.csv":Zl,"../../fixtures/05-multiline-strings/lang-en.csv":Xl,"../../fixtures/05-multiline-strings/lang-zh.csv":Ql,"../../fixtures/06-ini-toml/ini-file.ini":ec,"../../fixtures/06-ini-toml/toml_file.toml":tc}),mc=Object.assign({"../../fixtures/01-basic-types/expected.ts":nc,"../../fixtures/02-enum-index/expected.ts":sc,"../../fixtures/03-cross-ref/expected.ts":rc,"../../fixtures/04-refs-and-templates/expected.ts":ic,"../../fixtures/05-multiline-strings/expected.ts":oc,"../../fixtures/06-ini-toml/expected.ts":lc}),Qs=Object.assign({"../../fixtures/01-basic-types/README.md":cc,"../../fixtures/02-enum-index/README.md":ac,"../../fixtures/03-cross-ref/README.md":fc,"../../fixtures/04-refs-and-templates/README.md":uc,"../../fixtures/05-multiline-strings/README.md":dc,"../../fixtures/06-ini-toml/README.md":pc});function hs(e){const t=e.split("/"),n=t.indexOf("fixtures");return t[n+1]}function gc(e){const t=Object.keys(Qs).find(r=>hs(r)===e);if(!t)return{title:e,description:""};const s=Qs[t].split(`
`).slice(1).join(`
`).trim();return{title:e,description:s}}const Rt=new Map;for(const[e,t]of Object.entries(hc)){const n=hs(e);if(!Rt.has(n)){const s=gc(n);Rt.set(n,{id:n,title:s.title,description:s.description,files:[],expected:""})}Rt.get(n).files.push({name:e.split("/").pop(),raw:t})}for(const[e,t]of Object.entries(mc)){const n=hs(e),s=Rt.get(n);s&&(s.expected=t)}const Gn=[...Rt.values()].sort((e,t)=>e.id.localeCompare(t.id));function bc(e){return e?Gn.find(t=>t.id===e)??null:null}const yc={class:"code-block"},_c={class:"code-bar"},xc={class:"code-name"},vc={class:"code-meta"},Cc=cs({__name:"CodeBlock",props:{filename:{},code:{},lang:{}},setup(e){const t=e,n=Er(!1),s=bn(()=>t.code.split(`
`).length);async function r(){try{await navigator.clipboard.writeText(t.code),n.value=!0,setTimeout(()=>n.value=!1,1200)}catch{}}return(i,o)=>(Z(),le("div",yc,[W("div",_c,[W("span",xc,ge(t.filename),1),W("span",vc,ge(s.value)+" 行",1),W("button",{class:"copy-btn",type:"button",onClick:r},ge(n.value?"已复制":"复制"),1)]),W("pre",null,[W("code",null,ge(t.code),1)])]))}}),ms=(e,t)=>{const n=e.__vccOpts||e;for(const[s,r]of t)n[s]=r;return n},er=ms(Cc,[["__scopeId","data-v-40574cc5"]]);var tr={},In={},jn=34,gt=10,Dn=13;function di(e){return new Function("d","return {"+e.map(function(t,n){return JSON.stringify(t)+": d["+n+'] || ""'}).join(",")+"}")}function Sc(e,t){var n=di(e);return function(s,r){return t(n(s),r,e)}}function nr(e){var t=Object.create(null),n=[];return e.forEach(function(s){for(var r in s)r in t||n.push(t[r]=r)}),n}function de(e,t){var n=e+"",s=n.length;return s<t?new Array(t-s+1).join(0)+n:n}function wc(e){return e<0?"-"+de(-e,6):e>9999?"+"+de(e,6):de(e,4)}function Tc(e){var t=e.getUTCHours(),n=e.getUTCMinutes(),s=e.getUTCSeconds(),r=e.getUTCMilliseconds();return isNaN(e)?"Invalid Date":wc(e.getUTCFullYear())+"-"+de(e.getUTCMonth()+1,2)+"-"+de(e.getUTCDate(),2)+(r?"T"+de(t,2)+":"+de(n,2)+":"+de(s,2)+"."+de(r,3)+"Z":s?"T"+de(t,2)+":"+de(n,2)+":"+de(s,2)+"Z":n||t?"T"+de(t,2)+":"+de(n,2)+"Z":"")}function pi(e){var t=new RegExp('["'+e+`
\r]`),n=e.charCodeAt(0);function s(d,v){var w,I,T=r(d,function(U,L){if(w)return w(U,L-1);I=U,w=v?Sc(U,v):di(U)});return T.columns=I||[],T}function r(d,v){var w=[],I=d.length,T=0,U=0,L,D=I<=0,P=!1;d.charCodeAt(I-1)===gt&&--I,d.charCodeAt(I-1)===Dn&&--I;function O(){if(D)return In;if(P)return P=!1,tr;var pe,re=T,fe;if(d.charCodeAt(re)===jn){for(;T++<I&&d.charCodeAt(T)!==jn||d.charCodeAt(++T)===jn;);return(pe=T)>=I?D=!0:(fe=d.charCodeAt(T++))===gt?P=!0:fe===Dn&&(P=!0,d.charCodeAt(T)===gt&&++T),d.slice(re+1,pe-1).replace(/""/g,'"')}for(;T<I;){if((fe=d.charCodeAt(pe=T++))===gt)P=!0;else if(fe===Dn)P=!0,d.charCodeAt(T)===gt&&++T;else if(fe!==n)continue;return d.slice(re,pe)}return D=!0,d.slice(re,I)}for(;(L=O())!==In;){for(var q=[];L!==tr&&L!==In;)q.push(L),L=O();v&&(q=v(q,U++))==null||w.push(q)}return w}function i(d,v){return d.map(function(w){return v.map(function(I){return u(w[I])}).join(e)})}function o(d,v){return v==null&&(v=nr(d)),[v.map(u).join(e)].concat(i(d,v)).join(`
`)}function l(d,v){return v==null&&(v=nr(d)),i(d,v).join(`
`)}function a(d){return d.map(p).join(`
`)}function p(d){return d.map(u).join(e)}function u(d){return d==null?"":d instanceof Date?Tc(d):t.test(d+="")?'"'+d.replace(/"/g,'""')+'"':d}return{parse:s,parseRows:r,format:o,formatBody:l,formatRows:a,formatRow:p,formatValue:u}}var Rc=pi(","),Ec=Rc.parse;pi("	");new Date("2019-01-01T00:00").getHours()||new Date("2019-07-01T00:00").getHours();const Oc={key:0,class:"csv-table-wrap"},Ac={class:"csv-table"},Mc={key:1,class:"raw-pre"},Ic=cs({__name:"CsvTable",props:{filename:{},raw:{}},setup(e){const t=e,n=bn(()=>{if(!t.filename.endsWith(".csv"))return null;try{const s=Ec(t.raw.trim());return s.length===0||s.columns.length===0?null:{columns:s.columns,rows:s,typeRowIndex:0}}catch{return null}});return(s,r)=>n.value?(Z(),le("div",Oc,[W("table",Ac,[W("thead",null,[W("tr",null,[(Z(!0),le(ne,null,wt(n.value.columns,i=>(Z(),le("th",{key:i},ge(i),1))),128))])]),W("tbody",null,[(Z(!0),le(ne,null,wt(n.value.rows,(i,o)=>(Z(),le("tr",{key:o,class:Pt({"type-row":o===n.value.typeRowIndex})},[(Z(!0),le(ne,null,wt(n.value.columns,l=>(Z(),le("td",{key:l},ge(i[l]),1))),128))],2))),128))])])])):(Z(),le("pre",Mc,ge(t.raw),1))}}),jc=ms(Ic,[["__scopeId","data-v-ff127603"]]),Dc={class:"layout"},Pc={class:"body"},Nc={class:"sidebar"},Lc=["onClick"],Fc={class:"case-name"},kc={key:0,class:"content"},Hc={class:"case-title"},$c={class:"case-desc"},Uc={class:"panel"},Bc={class:"file-label"},Vc={class:"panel"},Kc=cs({__name:"App",setup(e){const t=Er(n());function n(){const o=window.location.hash.match(/^#\/case\/(.+)$/);return o?decodeURIComponent(o[1]):null}qt(()=>window.location.hash,()=>t.value=n());function s(o){window.location.hash=`#/case/${o}`}const r=bn(()=>bc(t.value)??Gn[0]??null);function i(o){return/\.(csv|ini|toml)$/.test(o)}return(o,l)=>(Z(),le("div",Dc,[l[5]||(l[5]=tl('<header class="topbar" data-v-9b08768b><div class="brand" data-v-9b08768b><span class="logo" data-v-9b08768b>config2ts</span><span class="tagline" data-v-9b08768b>配置表 → 类型安全 TypeScript · 功能演示</span></div><a class="gh-link" href="https://github.com/livingyang/config2ts" target="_blank" rel="noreferrer" data-v-9b08768b>GitHub →</a></header>',1)),W("div",Pc,[W("nav",Nc,[l[0]||(l[0]=W("div",{class:"side-title"},"测试用例",-1)),(Z(!0),le(ne,null,wt(Or(Gn),a=>{var p;return Z(),le("button",{key:a.id,class:Pt(["case-item",{active:((p=r.value)==null?void 0:p.id)===a.id}]),type:"button",onClick:u=>s(a.id)},[W("span",Fc,ge(a.id),1)],10,Lc)}),128)),l[1]||(l[1]=W("p",{class:"side-note"},[zn("以下输入与输出与单元测试中的 golden file 完全一致，由 "),W("code",null,"fixtures:regen"),zn(" 生成。")],-1))]),r.value?(Z(),le("main",kc,[W("h1",Hc,ge(r.value.title),1),W("p",$c,ge(r.value.description),1),W("section",Uc,[l[2]||(l[2]=W("h2",{class:"panel-title"},"输入 · 源配置表",-1)),(Z(!0),le(ne,null,wt(r.value.files,a=>(Z(),le("div",{key:a.name,class:"stack"},[W("div",Bc,ge(a.name),1),i(a.name)?(Z(),Wn(jc,{key:0,filename:a.name,raw:a.raw},null,8,["filename","raw"])):(Z(),Wn(er,{key:1,filename:a.name,code:a.raw},null,8,["filename","code"]))]))),128))]),l[4]||(l[4]=W("div",{class:"arrow"},"↓ 转换",-1)),W("section",Vc,[l[3]||(l[3]=W("h2",{class:"panel-title"},"输出 · 生成 TypeScript",-1)),Se(er,{filename:"expected.ts",code:r.value.expected},null,8,["code"])])])):nl("",!0)])]))}}),Wc=ms(Kc,[["__scopeId","data-v-9b08768b"]]);Hl(Wc).mount("#app");
