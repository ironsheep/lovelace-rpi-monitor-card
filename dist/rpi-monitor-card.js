function t(t,e,o,i){var s,n=arguments.length,r=n<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,o,i);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(e,o,r):s(e,o))||r);return n>3&&r&&Object.defineProperty(e,o,r),r
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}const e=window,o=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;class n{constructor(t,e,o){if(this._$cssResult$=!0,o!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(o&&void 0===t){const o=void 0!==e&&1===e.length;o&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&s.set(e,t))}return t}toString(){return this.cssText}}const r=(t,...e)=>{const o=1===t.length?t[0]:e.reduce(((e,o,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+t[i+1]),t[0]);return new n(o,t,i)},a=o?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const o of t.cssRules)e+=o.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var l;const c=window,h=c.trustedTypes,d=h?h.emptyScript:"",u=c.reactiveElementPolyfillSupport,p={toAttribute(t,e){switch(e){case Boolean:t=t?d:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=null!==t;break;case Number:o=null===t?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch(t){o=null}}return o}},_=(t,e)=>e!==t&&(e==e||t==t),m={attribute:!0,type:String,converter:p,reflect:!1,hasChanged:_};class f extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,o)=>{const i=this._$Ep(o,e);void 0!==i&&(this._$Ev.set(i,o),t.push(i))})),t}static createProperty(t,e=m){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const o="symbol"==typeof t?Symbol():"__"+t,i=this.getPropertyDescriptor(t,o,e);void 0!==i&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,e,o){return{get(){return this[e]},set(i){const s=this[t];this[e]=i,this.requestUpdate(t,s,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||m}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const o of e)this.createProperty(o,t[o])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const t of o)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Ep(t,e){const o=e.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,o;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(o=t.hostConnected)||void 0===o||o.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const i=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{o?t.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):i.forEach((o=>{const i=document.createElement("style"),s=e.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=o.cssText,t.appendChild(i)}))})(i,this.constructor.elementStyles),i}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$EO(t,e,o=m){var i;const s=this.constructor._$Ep(t,o);if(void 0!==s&&!0===o.reflect){const n=(void 0!==(null===(i=o.converter)||void 0===i?void 0:i.toAttribute)?o.converter:p).toAttribute(e,o.type);this._$El=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$El=null}}_$AK(t,e){var o;const i=this.constructor,s=i._$Ev.get(t);if(void 0!==s&&this._$El!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(o=t.converter)||void 0===o?void 0:o.fromAttribute)?t.converter:p;this._$El=s,this[s]=n.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,o){let i=!0;void 0!==t&&(((o=o||this.constructor.getPropertyOptions(t)).hasChanged||_)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===o.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,o))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const o=this._$AL;try{e=this.shouldUpdate(o),e?(this.willUpdate(o),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(o)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(o)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var g;f.finalized=!0,f.elementProperties=new Map,f.elementStyles=[],f.shadowRootOptions={mode:"open"},null==u||u({ReactiveElement:f}),(null!==(l=c.reactiveElementVersions)&&void 0!==l?l:c.reactiveElementVersions=[]).push("1.6.1");const v=window,y=v.trustedTypes,w=y?y.createPolicy("lit-html",{createHTML:t=>t}):void 0,$=`lit$${(Math.random()+"").slice(9)}$`,b="?"+$,C=`<${b}>`,A=document,x=(t="")=>A.createComment(t),E=t=>null===t||"object"!=typeof t&&"function"!=typeof t,S=Array.isArray,U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,D=/>/g,T=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),O=/'/g,P=/"/g,N=/^(?:script|style|textarea|title)$/i,M=(t=>(e,...o)=>({_$litType$:t,strings:e,values:o}))(1),k=Symbol.for("lit-noChange"),R=Symbol.for("lit-nothing"),V=new WeakMap,F=A.createTreeWalker(A,129,null,!1),H=(t,e)=>{const o=t.length-1,i=[];let s,n=2===e?"<svg>":"",r=U;for(let e=0;e<o;e++){const o=t[e];let a,l,c=-1,h=0;for(;h<o.length&&(r.lastIndex=h,l=r.exec(o),null!==l);)h=r.lastIndex,r===U?"!--"===l[1]?r=I:void 0!==l[1]?r=D:void 0!==l[2]?(N.test(l[2])&&(s=RegExp("</"+l[2],"g")),r=T):void 0!==l[3]&&(r=T):r===T?">"===l[0]?(r=null!=s?s:U,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?T:'"'===l[3]?P:O):r===P||r===O?r=T:r===I||r===D?r=U:(r=T,s=void 0);const d=r===T&&t[e+1].startsWith("/>")?" ":"";n+=r===U?o+C:c>=0?(i.push(a),o.slice(0,c)+"$lit$"+o.slice(c)+$+d):o+$+(-2===c?(i.push(void 0),e):d)}const a=n+(t[o]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==w?w.createHTML(a):a,i]};class z{constructor({strings:t,_$litType$:e},o){let i;this.parts=[];let s=0,n=0;const r=t.length-1,a=this.parts,[l,c]=H(t,e);if(this.el=z.createElement(l,o),F.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(i=F.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes()){const t=[];for(const e of i.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith($)){const o=c[n++];if(t.push(e),void 0!==o){const t=i.getAttribute(o.toLowerCase()+"$lit$").split($),e=/([.?@])?(.*)/.exec(o);a.push({type:1,index:s,name:e[2],strings:t,ctor:"."===e[1]?G:"?"===e[1]?W:"@"===e[1]?J:K})}else a.push({type:6,index:s})}for(const e of t)i.removeAttribute(e)}if(N.test(i.tagName)){const t=i.textContent.split($),e=t.length-1;if(e>0){i.textContent=y?y.emptyScript:"";for(let o=0;o<e;o++)i.append(t[o],x()),F.nextNode(),a.push({type:2,index:++s});i.append(t[e],x())}}}else if(8===i.nodeType)if(i.data===b)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=i.data.indexOf($,t+1));)a.push({type:7,index:s}),t+=$.length-1}s++}}static createElement(t,e){const o=A.createElement("template");return o.innerHTML=t,o}}function L(t,e,o=t,i){var s,n,r,a;if(e===k)return e;let l=void 0!==i?null===(s=o._$Co)||void 0===s?void 0:s[i]:o._$Cl;const c=E(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(n=null==l?void 0:l._$AO)||void 0===n||n.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,o,i)),void 0!==i?(null!==(r=(a=o)._$Co)&&void 0!==r?r:a._$Co=[])[i]=l:o._$Cl=l),void 0!==l&&(e=L(t,l._$AS(t,e.values),l,i)),e}class j{constructor(t,e){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var e;const{el:{content:o},parts:i}=this._$AD,s=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:A).importNode(o,!0);F.currentNode=s;let n=F.nextNode(),r=0,a=0,l=i[0];for(;void 0!==l;){if(r===l.index){let e;2===l.type?e=new B(n,n.nextSibling,this,t):1===l.type?e=new l.ctor(n,l.name,l.strings,this,t):6===l.type&&(e=new X(n,this,t)),this.u.push(e),l=i[++a]}r!==(null==l?void 0:l.index)&&(n=F.nextNode(),r++)}return s}p(t){let e=0;for(const o of this.u)void 0!==o&&(void 0!==o.strings?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}}class B{constructor(t,e,o,i){var s;this.type=2,this._$AH=R,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=i,this._$Cm=null===(s=null==i?void 0:i.isConnected)||void 0===s||s}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=L(this,t,e),E(t)?t===R||null==t||""===t?(this._$AH!==R&&this._$AR(),this._$AH=R):t!==this._$AH&&t!==k&&this.g(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>S(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.k(t):this.g(t)}O(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}g(t){this._$AH!==R&&E(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){var e;const{values:o,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=z.createElement(i.h,this.options)),i);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===s)this._$AH.p(o);else{const t=new j(s,this),e=t.v(this.options);t.p(o),this.T(e),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new z(t)),e}k(t){S(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,i=0;for(const s of t)i===e.length?e.push(o=new B(this.O(x()),this.O(x()),this,this.options)):o=e[i],o._$AI(s),i++;i<e.length&&(this._$AR(o&&o._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var o;for(null===(o=this._$AP)||void 0===o||o.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cm=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class K{constructor(t,e,o,i,s){this.type=1,this._$AH=R,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=s,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=R}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,o,i){const s=this.strings;let n=!1;if(void 0===s)t=L(this,t,e,0),n=!E(t)||t!==this._$AH&&t!==k,n&&(this._$AH=t);else{const i=t;let r,a;for(t=s[0],r=0;r<s.length-1;r++)a=L(this,i[o+r],e,r),a===k&&(a=this._$AH[r]),n||(n=!E(a)||a!==this._$AH[r]),a===R?t=R:t!==R&&(t+=(null!=a?a:"")+s[r+1]),this._$AH[r]=a}n&&!i&&this.j(t)}j(t){t===R?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class G extends K{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===R?void 0:t}}const q=y?y.emptyScript:"";class W extends K{constructor(){super(...arguments),this.type=4}j(t){t&&t!==R?this.element.setAttribute(this.name,q):this.element.removeAttribute(this.name)}}class J extends K{constructor(t,e,o,i,s){super(t,e,o,i,s),this.type=5}_$AI(t,e=this){var o;if((t=null!==(o=L(this,t,e,0))&&void 0!==o?o:R)===k)return;const i=this._$AH,s=t===R&&i!==R||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==R&&(i===R||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,o;"function"==typeof this._$AH?this._$AH.call(null!==(o=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==o?o:this.element,t):this._$AH.handleEvent(t)}}class X{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){L(this,t)}}const Y=v.litHtmlPolyfillSupport;null==Y||Y(z,B),(null!==(g=v.litHtmlVersions)&&void 0!==g?g:v.litHtmlVersions=[]).push("2.6.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Z,Q;class tt extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const o=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=o.firstChild),o}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,o)=>{var i,s;const n=null!==(i=null==o?void 0:o.renderBefore)&&void 0!==i?i:e;let r=n._$litPart$;if(void 0===r){const t=null!==(s=null==o?void 0:o.renderBefore)&&void 0!==s?s:null;n._$litPart$=r=new B(e.insertBefore(x(),t),t,void 0,null!=o?o:{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return k}}tt.finalized=!0,tt._$litElement$=!0,null===(Z=globalThis.litElementHydrateSupport)||void 0===Z||Z.call(globalThis,{LitElement:tt});const et=globalThis.litElementPolyfillSupport;null==et||et({LitElement:tt}),(null!==(Q=globalThis.litElementVersions)&&void 0!==Q?Q:globalThis.litElementVersions=[]).push("3.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:o,elements:i}=e;return{kind:o,elements:i,finisher(e){customElements.define(t,e)}}})(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,it=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(o){o.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(o){o.createProperty(e.key,t)}};function st(t){return(e,o)=>void 0!==o?((t,e,o)=>{e.constructor.createProperty(o,t)})(t,e,o):it(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function nt(t){return st({...t,state:!0})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var rt;null===(rt=window.HTMLSlotElement)||void 0===rt||rt.prototype.assignedElements;var at="\\d\\d?",lt="\\d\\d",ct="[^\\s]+";function ht(t,e){for(var o=[],i=0,s=t.length;i<s;i++)o.push(t[i].substr(0,e));return o}var dt=function(t){return function(e,o){var i=o[t].map((function(t){return t.toLowerCase()})),s=i.indexOf(e.toLowerCase());return s>-1?s:null}};function ut(t){for(var e=[],o=1;o<arguments.length;o++)e[o-1]=arguments[o];for(var i=0,s=e;i<s.length;i++){var n=s[i];for(var r in n)t[r]=n[r]}return t}var pt=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],_t=["January","February","March","April","May","June","July","August","September","October","November","December"],mt=ht(_t,3),ft={dayNamesShort:ht(pt,3),dayNames:pt,monthNamesShort:mt,monthNames:_t,amPm:["am","pm"],DoFn:function(t){return t+["th","st","nd","rd"][t%10>3?0:(t-t%10!=10?1:0)*t%10]}},gt=(ut({},ft),function(t){return+t-1}),vt=[null,at],yt=[null,ct],wt=["isPm",ct,function(t,e){var o=t.toLowerCase();return o===e.amPm[0]?0:o===e.amPm[1]?1:null}],$t=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(t){var e=(t+"").match(/([+-]|\d\d)/gi);if(e){var o=60*+e[1]+parseInt(e[2],10);return"+"===e[0]?o:-o}return 0}];dt("monthNamesShort"),dt("monthNames");function bt(){return(bt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var o=arguments[e];for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(t[i]=o[i])}return t}).apply(this,arguments)}!function(){try{(new Date).toLocaleDateString("i")}catch(t){return"RangeError"===t.name}}(),function(){try{(new Date).toLocaleString("i")}catch(t){return"RangeError"===t.name}}(),function(){try{(new Date).toLocaleTimeString("i")}catch(t){return"RangeError"===t.name}}();var Ct,At;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(Ct||(Ct={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(At||(At={}));var xt=["closed","locked","off"],Et=function(t,e,o,i){i=i||{},o=null==o?{}:o;var s=new Event(e,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return s.detail=o,t.dispatchEvent(s),s},St=function(t){Et(window,"haptic",t)},Ut=function(t,e,o,i){if(i||(i={action:"more-info"}),!i.confirmation||i.confirmation.exemptions&&i.confirmation.exemptions.some((function(t){return t.user===e.user.id}))||(St("warning"),confirm(i.confirmation.text||"Are you sure you want to "+i.action+"?")))switch(i.action){case"more-info":(o.entity||o.camera_image)&&Et(t,"hass-more-info",{entityId:o.entity?o.entity:o.camera_image});break;case"navigate":i.navigation_path&&function(t,e,o){void 0===o&&(o=!1),o?history.replaceState(null,"",e):history.pushState(null,"",e),Et(window,"location-changed",{replace:o})}(0,i.navigation_path);break;case"url":i.url_path&&window.open(i.url_path);break;case"toggle":o.entity&&(function(t,e){(function(t,e,o){void 0===o&&(o=!0);var i,s=function(t){return t.substr(0,t.indexOf("."))}(e),n="group"===s?"homeassistant":s;switch(s){case"lock":i=o?"unlock":"lock";break;case"cover":i=o?"open_cover":"close_cover";break;default:i=o?"turn_on":"turn_off"}t.callService(n,i,{entity_id:e})})(t,e,xt.includes(t.states[e].state))}(e,o.entity),St("success"));break;case"call-service":if(!i.service)return void St("failure");var s=i.service.split(".",2);e.callService(s[0],s[1],i.service_data),St("success");break;case"fire-dom-event":Et(t,"ll-custom",i)}};function It(t){return void 0!==t&&"none"!==t.action}const Dt={required:{icon:"tune",name:"Required",secondary:"Required options for this card to function",show:!0},actions:{icon:"gesture-tap-hold",name:"Actions",secondary:"Perform actions based on tapping/clicking",show:!1,options:{tap:{icon:"gesture-tap",name:"Tap",secondary:"Set the action to perform on tap",show:!1},hold:{icon:"gesture-tap-hold",name:"Hold",secondary:"Set the action to perform on hold",show:!1},double_tap:{icon:"gesture-double-tap",name:"Double Tap",secondary:"Set the action to perform on double tap",show:!1}}},appearance:{icon:"palette",name:"Appearance",secondary:"Customize the name, icon, etc",show:!1}};let Tt=class extends tt{constructor(){super(...arguments),this._initialized=!1}setConfig(t){this._config=t,this.loadCardHelpers()}shouldUpdate(){return this._initialized||this._initialize(),!0}get _name(){var t;return(null===(t=this._config)||void 0===t?void 0:t.name)||""}get _entity(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity)||""}get _show_warning(){var t;return(null===(t=this._config)||void 0===t?void 0:t.show_warning)||!1}get _show_error(){var t;return(null===(t=this._config)||void 0===t?void 0:t.show_error)||!1}get _tap_action(){var t;return(null===(t=this._config)||void 0===t?void 0:t.tap_action)||{action:"more-info"}}get _hold_action(){var t;return(null===(t=this._config)||void 0===t?void 0:t.hold_action)||{action:"none"}}get _double_tap_action(){var t;return(null===(t=this._config)||void 0===t?void 0:t.double_tap_action)||{action:"none"}}render(){if(!this.hass||!this._helpers)return M``;this._helpers.importMoreInfoControl("climate");const t=Object.keys(this.hass.states).filter((t=>"sun"===t.substr(0,t.indexOf("."))));return M`
      <div class="card-config">
        <div class="option" @click=${this._toggleOption} .option=${"required"}>
          <div class="row">
            <ha-icon .icon=${`mdi:${Dt.required.icon}`}></ha-icon>
            <div class="title">${Dt.required.name}</div>
          </div>
          <div class="secondary">${Dt.required.secondary}</div>
        </div>
        ${Dt.required.show?M`
              <div class="values">
                <paper-dropdown-menu
                  label="Entity (Required)"
                  @value-changed=${this._valueChanged}
                  .configValue=${"entity"}
                >
                  <paper-listbox slot="dropdown-content" .selected=${t.indexOf(this._entity)}>
                    ${t.map((t=>M` <paper-item>${t}</paper-item> `))}
                  </paper-listbox>
                </paper-dropdown-menu>
              </div>
            `:""}
        <div class="option" @click=${this._toggleOption} .option=${"actions"}>
          <div class="row">
            <ha-icon .icon=${`mdi:${Dt.actions.icon}`}></ha-icon>
            <div class="title">${Dt.actions.name}</div>
          </div>
          <div class="secondary">${Dt.actions.secondary}</div>
        </div>
        ${Dt.actions.show?M`
              <div class="values">
                <div class="option" @click=${this._toggleAction} .option=${"tap"}>
                  <div class="row">
                    <ha-icon .icon=${`mdi:${Dt.actions.options.tap.icon}`}></ha-icon>
                    <div class="title">${Dt.actions.options.tap.name}</div>
                  </div>
                  <div class="secondary">${Dt.actions.options.tap.secondary}</div>
                </div>
                ${Dt.actions.options.tap.show?M`
                      <div class="values">
                        <paper-item>Action Editors Coming Soon</paper-item>
                      </div>
                    `:""}
                <div class="option" @click=${this._toggleAction} .option=${"hold"}>
                  <div class="row">
                    <ha-icon .icon=${`mdi:${Dt.actions.options.hold.icon}`}></ha-icon>
                    <div class="title">${Dt.actions.options.hold.name}</div>
                  </div>
                  <div class="secondary">${Dt.actions.options.hold.secondary}</div>
                </div>
                ${Dt.actions.options.hold.show?M`
                      <div class="values">
                        <paper-item>Action Editors Coming Soon</paper-item>
                      </div>
                    `:""}
                <div class="option" @click=${this._toggleAction} .option=${"double_tap"}>
                  <div class="row">
                    <ha-icon .icon=${`mdi:${Dt.actions.options.double_tap.icon}`}></ha-icon>
                    <div class="title">${Dt.actions.options.double_tap.name}</div>
                  </div>
                  <div class="secondary">${Dt.actions.options.double_tap.secondary}</div>
                </div>
                ${Dt.actions.options.double_tap.show?M`
                      <div class="values">
                        <paper-item>Action Editors Coming Soon</paper-item>
                      </div>
                    `:""}
              </div>
            `:""}
        <div class="option" @click=${this._toggleOption} .option=${"appearance"}>
          <div class="row">
            <ha-icon .icon=${`mdi:${Dt.appearance.icon}`}></ha-icon>
            <div class="title">${Dt.appearance.name}</div>
          </div>
          <div class="secondary">${Dt.appearance.secondary}</div>
        </div>
        ${Dt.appearance.show?M`
              <div class="values">
                <paper-input
                  label="Name (Optional)"
                  .value=${this._name}
                  .configValue=${"name"}
                  @value-changed=${this._valueChanged}
                ></paper-input>
                <br />
                <ha-formfield .label=${"Toggle warning "+(this._show_warning?"off":"on")}>
                  <ha-switch
                    .checked=${!1!==this._show_warning}
                    .configValue=${"show_warning"}
                    @change=${this._valueChanged}
                  ></ha-switch>
                </ha-formfield>
                <ha-formfield .label=${"Toggle error "+(this._show_error?"off":"on")}>
                  <ha-switch
                    .checked=${!1!==this._show_error}
                    .configValue=${"show_error"}
                    @change=${this._valueChanged}
                  ></ha-switch>
                </ha-formfield>
              </div>
            `:""}
      </div>
    `}_initialize(){void 0!==this.hass&&void 0!==this._config&&void 0!==this._helpers&&(this._initialized=!0)}async loadCardHelpers(){this._helpers=await window.loadCardHelpers()}_toggleAction(t){this._toggleThing(t,Dt.actions.options)}_toggleOption(t){this._toggleThing(t,Dt)}_toggleThing(t,e){const o=!e[t.target.option].show;for(const[t]of Object.entries(e))e[t].show=!1;e[t.target.option].show=o,this._toggle=!this._toggle}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target;if(this[`_${e.configValue}`]!==e.value){if(e.configValue)if(""===e.value){const t=Object.assign({},this._config);delete t[e.configValue],this._config=t}else this._config=Object.assign(Object.assign({},this._config),{[e.configValue]:void 0!==e.checked?e.checked:e.value});Et(this,"config-changed",{config:this._config})}}static get styles(){return r`
      .option {
        padding: 4px 0px;
        cursor: pointer;
      }
      .row {
        display: flex;
        margin-bottom: -14px;
        pointer-events: none;
      }
      .title {
        padding-left: 16px;
        margin-top: -6px;
        pointer-events: none;
      }
      .secondary {
        padding-left: 40px;
        color: var(--secondary-text-color);
        pointer-events: none;
      }
      .values {
        padding-left: 16px;
        background: var(--secondary-background-color);
        display: grid;
      }
      ha-formfield {
        padding-bottom: 8px;
      }
    `}};t([st({attribute:!1})],Tt.prototype,"hass",void 0),t([nt()],Tt.prototype,"_config",void 0),t([nt()],Tt.prototype,"_toggle",void 0),t([nt()],Tt.prototype,"_helpers",void 0),Tt=t([ot("rpi-monitor-card-editor")],Tt);class Ot{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,o){this._$Ct=t,this._$AM=e,this._$Ci=o}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const Pt="ontouchstart"in window||navigator.maxTouchPoints>0||navigator.maxTouchPoints>0;class Nt extends HTMLElement{constructor(){super(),this.holdTime=500,this.held=!1,this.ripple=document.createElement("mwc-ripple")}connectedCallback(){Object.assign(this.style,{position:"absolute",width:Pt?"100px":"50px",height:Pt?"100px":"50px",transform:"translate(-50%, -50%)",pointerEvents:"none",zIndex:"999"}),this.appendChild(this.ripple),this.ripple.primary=!0,["touchcancel","mouseout","mouseup","touchmove","mousewheel","wheel","scroll"].forEach((t=>{document.addEventListener(t,(()=>{clearTimeout(this.timer),this.stopAnimation(),this.timer=void 0}),{passive:!0})}))}bind(t,e){if(t.actionHandler)return;t.actionHandler=!0,t.addEventListener("contextmenu",(t=>{const e=t||window.event;return e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0,e.returnValue=!1,!1}));const o=t=>{let e,o;this.held=!1,t.touches?(e=t.touches[0].pageX,o=t.touches[0].pageY):(e=t.pageX,o=t.pageY),this.timer=window.setTimeout((()=>{this.startAnimation(e,o),this.held=!0}),this.holdTime)},i=o=>{o.preventDefault(),["touchend","touchcancel"].includes(o.type)&&void 0===this.timer||(clearTimeout(this.timer),this.stopAnimation(),this.timer=void 0,this.held?Et(t,"action",{action:"hold"}):e.hasDoubleClick?"click"===o.type&&o.detail<2||!this.dblClickTimeout?this.dblClickTimeout=window.setTimeout((()=>{this.dblClickTimeout=void 0,Et(t,"action",{action:"tap"})}),250):(clearTimeout(this.dblClickTimeout),this.dblClickTimeout=void 0,Et(t,"action",{action:"double_tap"})):Et(t,"action",{action:"tap"}))};t.addEventListener("touchstart",o,{passive:!0}),t.addEventListener("touchend",i),t.addEventListener("touchcancel",i),t.addEventListener("mousedown",o,{passive:!0}),t.addEventListener("click",i),t.addEventListener("keyup",(t=>{13===t.keyCode&&i(t)}))}startAnimation(t,e){Object.assign(this.style,{left:`${t}px`,top:`${e}px`,display:null}),this.ripple.disabled=!1,this.ripple.active=!0,this.ripple.unbounded=!0}stopAnimation(){this.ripple.active=!1,this.ripple.disabled=!0,this.style.display="none"}}customElements.define("action-handler-rpi-monitor",Nt);const Mt=(t,e)=>{const o=(()=>{const t=document.body;if(t.querySelector("action-handler-rpi-monitor"))return t.querySelector("action-handler-rpi-monitor");const e=document.createElement("action-handler-rpi-monitor");return t.appendChild(e),e})();o&&o.bind(t,e)},kt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends Ot{update(t,[e]){return Mt(t.element,e),k}render(t){}}),Rt="ico-fs-percent",Vt="ico-fs-total",Ft="ico-sys-temp",Ht="ico-up-time",zt="ico-last-update",Lt="ico-memory-percent",jt="fs-percent",Bt="fs-total",Kt="sys-temp",Gt="up-time",qt="last-update",Wt="memory-percent",Jt="sys-temp-scale",Xt="card-timestamp",Yt="daemon-upd-flg",Zt="os-rls-name",Qt="os-upd-count",te="ifaces",ee="ux_release",oe="last_update",ie="up_time",se="fs_total_gb",ne="fs_used_prcnt",re="temperature_c",ae="show-os-parts",le="memory_percent";class ce{constructor(){this._showColorDebug=!1,this._circleIconsValueByName={"circle-outline":0,"circle-slice-1":13,"circle-slice-2":25,"circle-slice-3":38,"circle-slice-4":50,"circle-slice-5":63,"circle-slice-6":75,"circle-slice-7":88,"circle-slice-8":100},this._colorUsedSpaceDefault=[{color:"default",from:0,to:59},{color:"orange",from:60,to:84},{color:"red",from:85,to:100}],this._colorTemperatureDefault=[{color:"default",from:0,to:59},{color:"orange",from:60,to:79},{color:"red",from:85,to:100}],this._colorReportPeriodsAgoDefault=[{color:"default",from:0,to:3},{color:"orange",from:4,to:5},{color:"red",from:6,to:1e6}],this._colorUsedMemoryDefault=[{color:"red",from:75,to:100},{color:"orange",from:61,to:74},{color:"default",from:0,to:60}],this._colorOsUpdateCountDefault=[{color:"red",from:100,to:1e4},{color:"orange",from:25,to:99},{color:"default",from:0,to:24}],this._colorReleaseDefault=[{color:"red",os:"stretch"},{color:"red",os:"jessie"},{color:"red",os:"wheezy"}]}getIconNameForPercent(t){let e="";for(const o in this._circleIconsValueByName){if(t<=this._circleIconsValueByName[o]){e=o;break}}return e}calculateReporterAgeColor(t){let e;return this._colorReportPeriodsAgoDefault.forEach((o=>{t>=o.from&&t<=o.to&&(e=o.color)})),null!=e&&"default"!=e||(e=""),this._showColorDebug&&console.log("- ReporterAge() value=("+t+") -> color ["+e+"]"),e}calculateTemperatureColor(t,e){const o=Number(t),i=e||this._colorTemperatureDefault;let s;if(isNaN(o)||i.forEach((e=>{if(o>=e.from&&o<=e.to&&(s=e.color,this._showColorDebug)){const o="_calculateTemperatureColor() - value=["+t+"] matched(from="+e.from+", to="+e.to+", color="+s+")";console.log(o)}})),this._showColorDebug){const e="_calculateTemperatureColor() - value=["+t+"] returns(color="+s+")";console.log(e)}return null!=s&&"default"!=s||(s=""),s}calculateFileSystemUsageColor(t,e){const o=Number(t),i=e||this._colorUsedSpaceDefault;let s;if(isNaN(o)||i.forEach((e=>{if(o>=e.from&&o<=e.to&&(s=e.color,this._showColorDebug)){const o="_calculateFileSystemUsageColor() - value=["+t+"] matched(from="+e.from+", to="+e.to+", color="+s+")";console.log(o)}})),this._showColorDebug){const e="_calculateFileSystemUsageColor() - value=["+t+"] returns(color="+s+")";console.log(e)}return null!=s&&"default"!=s||(s=""),s}calculateMemoryUsageColor(t,e){const o=Number(t),i=e||this._colorUsedMemoryDefault;let s;if(isNaN(o)||i.forEach((e=>{if(o>=e.from&&o<=e.to&&(s=e.color,this._showColorDebug)){const o="_calculateMemoryUsageColor() - value=["+t+"] matched(from="+e.from+", to="+e.to+", color="+s+")";console.log(o)}})),this._showColorDebug){const e="_calculateMemoryUsageColor() - value=["+t+"] returns(color="+s+")";console.log(e)}return null!=s&&"default"!=s||(s=""),s}calculateOsUpdateCountColor(t,e){const o=Number(t),i=e||this._colorOsUpdateCountDefault;let s;if(isNaN(o)||i.forEach((e=>{if(o>=e.from&&o<=e.to&&(s=e.color,this._showColorDebug)){const o="calculateOsUpdateCountColor() - value=["+t+"] matched(from="+e.from+", to="+e.to+", color="+s+")";console.log(o)}})),this._showColorDebug){const e="calculateOsUpdateCountColor() - value=["+t+"] returns(color="+s+")";console.log(e)}return null!=s&&"default"!=s||(s=""),s}calculateOsReleaseColor(t,e){const o=e||this._colorReleaseDefault;let i="default";return o.forEach((e=>{t===e.os&&(i=e.color,this._showColorDebug&&console.log("calculateOsReleaseColor() - value=["+t+"] matched(os="+e.os+", color="+i+")"))})),this._showColorDebug&&console.log("calculateOsReleaseColor() - value=["+t+"] returns(color="+i+")"),null!=i&&"default"!=i||(i=""),i}calculateDaemonUpdateVersionColor(t,e){let o;if(o=e.length>0&&""!=t?e[0]==t?"default":e.includes(t)?"orange":"red":"orange",this._showColorDebug){const e="calculateDaemonUpdateVersionColor() - value=["+t+"] returns(color="+o+")";console.log(e)}return null!=o&&"default"!=o||(o=""),o}}var he={version:"Version",invalid_configuration:"Invalid configuration",show_warning:"Show Warning",show_error:"Show Error"},de={common:he},ue=Object.freeze({__proto__:null,common:he,default:de}),pe={version:"Versjon",invalid_configuration:"Ikke gyldig konfiguration",show_warning:"Vis advarsel",show_error:"Vis feil"},_e={common:pe},me=Object.freeze({__proto__:null,common:pe,default:_e}),fe={version:"Version",invalid_configuration:"configuración no válida",show_warning:"Mostrar advertencia",show_error:"Mostrar error"},ge={common:fe};const ve={en:ue,es:Object.freeze({__proto__:null,common:fe,default:ge}),nb:me};function ye(t,e="",o=""){const i=(localStorage.getItem("selectedLanguage")||"en").replace(/['"]+/g,"").replace("-","_");let s;try{s=t.split(".").reduce(((t,e)=>t[e]),ve[i])}catch(e){s=t.split(".").reduce(((t,e)=>t[e]),ve.en)}return void 0===s&&(s=t.split(".").reduce(((t,e)=>t[e]),ve.en)),""!==e&&""!==o&&(s=s.replace(e,o)),s}console.info(`%c  RPI-MONITOR-CARD \n%c  ${ye("common.version")} 1.4.2    `,"color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"rpi-monitor-card",name:"RPi Monitor Card",description:"A template custom card for you to create something awesome"});let we=class extends tt{constructor(){super(...arguments),this.kREPLACE_WITH_TEMP_UNITS="replace-with-temp-units",this._firstTime=!0,this._stateInfoAvailable=!1,this._updateTimerID=void 0,this._configEntityId=void 0,this._hostname="",this._showFullCard=!0,this._useTempsInC=!0,this._latestDaemonVersions=["v1.8.3","v1.6.1"],this._currentDaemonVersion="",this._cardMinutesSinceUpdate=0,this._defaultTextColor="",this._defaultIconColor="",this._ux_release_name="",this._os_update_count="",this._showOsAge=!0,this._showCardAge=!0,this._showDaemonUpdNeed=!0,this._showCardName=!0,this._showOsUpCt=!0,this._showDebug=!1,this.colorHelpers=new ce,this._cardFullElements={"Storage Use":ne,Storage:se,"Memory Use":le,Temperature:re,"Up-time":ie,Updated:oe,OS:ae,Model:"rpi_model",Interfaces:te},this._cardFullIconNames={"Storage Use":"file-percent",Storage:"sd","Memory Use":"memory",Temperature:"thermometer","Up-time":"clock-check-outline",Updated:"update",OS:"linux",Model:"raspberry-pi",Interfaces:""},this._cardFullCssIDs={"Storage Use":jt,Storage:Bt,"Memory Use":Wt,Temperature:Kt,"Up-time":Gt,Updated:qt,OS:"*nix",Model:"rpi-model",Interfaces:"rpi-ifaces"},this._cardFullIconCssIDs={"Storage Use":Rt,Storage:Vt,"Memory Use":Lt,Temperature:Ft,"Up-time":Ht,Updated:zt,OS:"ico-*nix",Model:"ico-rpi-model",Interfaces:"ico-rpi-ifaces"},this._cardGlanceElements={"%":ne,GB:se,Mem:le,"replace-with-temp-units":re,UpTime:ie,Upd:oe},this._cardGlanceIconNames={"%":"file-percent",GB:"sd",Mem:"memory","replace-with-temp-units":"thermometer",UpTime:"clock-check-outline",Upd:"update"},this._cardGlanceCssIDs={"%":jt,GB:Bt,Mem:Wt,"replace-with-temp-units":Kt,UpTime:Gt,Upd:qt},this._cardGlanceIconCssIDs={"%":Rt,GB:Vt,Mem:Lt,"replace-with-temp-units":Ft,UpTime:Ht,Upd:zt}}static async getConfigElement(){return console.log("- getConfigElement()"),document.createElement("rpi-monitor-card-editor")}static getStubConfig(){return{}}setConfig(t){if(null!=t.show_debug&&(this._showDebug=t.show_debug||this._showDebug),this._showDebug&&console.log("- setConfig()"),!t||t.show_error)throw new Error(ye("common.invalid_configuration"));if(void 0===t.entity)throw console.log("Invalid configuration. If no entity provided, you'll need to provide a remote entity"),new Error("You need to associate an entity");if(null!=t.card_style){const e=t.card_style.toLocaleLowerCase();if("full"!=e&&"glance"!=e)throw console.log("Invalid configuration. INVALID card_style = ["+t.card_style+"]"),new Error("Illegal card_style: value (card_style: "+t.card_style+") must be [full or glance]");this._showFullCard="full"===t.card_style.toLocaleLowerCase()}if(null!=t.temp_scale){const e=t.temp_scale.toLocaleLowerCase();if("c"!=e&&"f"!=e)throw console.log("Invalid configuration. INVALID temp_scale = ["+t.temp_scale+"]"),new Error("Illegal temp_scale: value (temp_scale: "+t.temp_scale+") must be [F or C]");this._useTempsInC="c"===t.temp_scale.toLocaleLowerCase()}t.test_gui&&function(){var t=document.querySelector("home-assistant");if(t=(t=(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-root")){var e=t.lovelace;return e.current_view=t.___curView,e}return null}().setEditMode(!0),this._config=Object.assign({},t),this._showOsAge=null==this._config.show_os_age||this._config.show_os_age,this._showCardAge=null==this._config.show_update_age||this._config.show_update_age,this._showDaemonUpdNeed=null==this._config.show_daemon_upd||this._config.show_daemon_upd,this._showCardName=null==this._config.show_title||this._config.show_title,this._showOsUpCt=null==this._config.show_os_upd_count||this._config.show_os_upd_count,this._configEntityId=null!=this._config.entity?this._config.entity:void 0,this._ensureStateInfoAvail()}shouldUpdate(t){let e=!1;if(this._ensureStateInfoAvail(),this._ensureWeHaveHostName(),this._debugShowProps(t,"shouldUpdate"),!this._config)return this._showDebug&&console.log(" - SU ABORT, no config"),!1;let o=!1;if(t.has("_config"))this._showDebug&&console.log(" - SU config present"),o=!0;else if(this.hass&&this._config&&t.has("hass")){const i=t.get("hass");if(i&&this._configEntityId)if(o=i.states[this._configEntityId]!==this.hass.states[this._configEntityId],o)this._showDebug&&console.log(" - SU hass state changed");else{this._showDebug&&console.log(" - SU !! NO hass state change");const t=this.hass.states[this._configEntityId];t&&"unknown"!=t.state&&(e=!0,o=!0)}}if(this._showDebug){const t=e?" FORCED":"";console.log("\\---- shouldUpdate("+this._hostname+") - EXIT w/"+o+t)}return o}willUpdate(t){this._debugShowProps(t,"willUpdate()")}render(){if(this._showDebug&&console.log("- render("+this._hostname+")"),this._config.show_warning)return this.showWarning(ye("common.show_warning"));if(this._config.show_error)return this.showError(ye("common.show_error"));if(this._configEntityId&&!this._stateInfoAvailable){const t="Entity Unavailable: "+this._configEntityId;return this.showWarning(t)}const t=this._configEntityId?this.hass.states[this._configEntityId]:void 0;if(!this._configEntityId&&!t)return this.showWarning("Entity Unavailable");if(!this._stateInfoAvailable)return void console.log("?? Render w/o sensor!! ("+this._hostname+")");let e=M``;if(this._firstTime&&(this._showDebug&&(console.log("- 1st-time ["+this._configEntityId+"] stateObj:"),console.log(t)),this._showDebug&&(console.log("- 1st-time ["+this._configEntityId+"] _config:"),console.log(this._config)),this._firstTime=!1),this._showDaemonUpdNeed){const t=this._getAttributeValueForKey("reporter").split(" ");this._currentDaemonVersion=t.length>1?t[1]:"";const e=this._getAttributeValueForKey("reporter_releases");if(e&&e.length>0&&"NOT-LOADED"!=e){const t=e.split(",");this._latestDaemonVersions=t}}const o=this._getAttributeValueForKey("fqdn");this._os_update_count=this._getAttributeValueForKey("ux_updates"),this._ux_release_name=1==this._showOsAge?this._getAttributeValueForKey(ee):"";const i=this._showDaemonUpdNeed?this._computeDaemonUpdMessage(this._currentDaemonVersion):"",s=this._showOsUpCt?this._computeOsUpdCountMessage(this._os_update_count):"";let n="";if(this._showCardAge)if(this._cardMinutesSinceUpdate=this._calculateRelativeMinutesSinceUpdate(),0==this._cardMinutesSinceUpdate)n="just now";else if(this._cardMinutesSinceUpdate>=1440){const t=Math.round(this._cardMinutesSinceUpdate/1440);n=t+" day"+(1==t?"":"s")+" ago"}else if(this._cardMinutesSinceUpdate>=60){const t=Math.round(this._cardMinutesSinceUpdate/60);n=t+" hour"+(1==t?"":"s")+" ago"}else{const t=1==this._cardMinutesSinceUpdate?"":"s";n=this._cardMinutesSinceUpdate+" min"+t+" ago"}const r=1==this._showCardAge?n:"";let a="RPi monitor "+o;a=null!=this._config.name_prefix?this._config.name_prefix+" "+o:a,a=null!=this._config.name?this._config.name:a,0==this._showCardName&&(a="");const l=0==this._showCardName?"last-heard-full-notitle":"last-heard-full",c=0==this._showCardName?"last-heard-notitle":"last-heard",h=0==this._showCardName?"os-name-full-notitle":"os-name-full",d=0==this._showCardName?"os-name-notitle":"os-name",u=(0==this._showCardName?"daemon-update-full-notitle":"daemon-update-full")+" center",p=(0==this._showCardName?"daemon-update-notitle":"daemon-update")+" center",_=(0==this._showCardName?"os-update-ct-full-notitle":"os-update-ct-full")+" center",m=(0==this._showCardName?"os-update-ct-notitle":"os-update-ct")+" center";if(this._showFullCard){const t=this._generateFullsizeCardRows();if(0==t.length||!t)return void console.log("ERROR: failed to generate full rows!");e=M`
        <ha-card
          .header=${a}
          @action=${this._handleAction}
          .actionHandler=${kt({hasHold:It(this._config.hold_action),hasDoubleClick:It(this._config.double_tap_action)})}
          tabindex="0"
          aria-label=${a}
        >
          <div id="states" class="card-content">
            ${t}
            <div id=${Xt} class=${l}>${r}</div>
            <div id=${Zt} class=${h}>${this._ux_release_name}</div>
            <div id=${Yt} class=${u}>${i}</div>
            <div id=${Qt} class=${_}>${s}</div>
          </div>
        </ha-card>
      `}else{const t=this._generateGlanceCardRows();if(0==t.length||!t)return void console.log("ERROR: failed to generate glance rows!");e=M`
        <ha-card
          .header=${a}
          @action=${this._handleAction}
          .actionHandler=${kt({hasHold:It(this._config.hold_action),hasDoubleClick:It(this._config.double_tap_action)})}
          tabindex="0"
          aria-label=${a}
        >
          <div class="glance-content">
            ${t}
            <div id=${Xt} class=${c}>${r}</div>
            <div id=${Zt} class=${d}>${this._ux_release_name}</div>
            <div id=${Yt} class=${p}>${i}</div>
            <div id=${Qt} class=${m}>${s}</div>
          </div>
        </ha-card>
      `}return this._showDebug&&(console.log("/ ---- render() "+this._hostname+" ---- :"),console.log(e)),e}updated(t){if(this._showDebug&&console.log("- updated("+this._hostname+")"),this._debugShowProps(t,"Updated()"),this._config){if(this.hass){const e=t.get("hass");(!e||e&&e.themes!==this.hass.themes)&&function(t,e,o,i){void 0===i&&(i=!1),t._themes||(t._themes={});var s=e.default_theme;("default"===o||o&&e.themes[o])&&(s=o);var n=bt({},t._themes);if("default"!==s){var r=e.themes[s];Object.keys(r).forEach((function(e){var o="--"+e;t._themes[o]="",n[o]=r[e]}))}if(t.updateStyles?t.updateStyles(n):window.ShadyCSS&&window.ShadyCSS.styleSubtree(t,n),i){var a=document.querySelector("meta[name=theme-color]");if(a){a.hasAttribute("default-content")||a.setAttribute("default-content",a.getAttribute("content"));var l=n["--primary-color"]||a.getAttribute("default-content");a.setAttribute("content",l)}}}(this,this.hass.themes,this._config.theme)}this._ensureStateInfoAvail();const e=this.shadowRoot;if(this._stateInfoAvailable){let o=this.colorHelpers.calculateReporterAgeColor(this._cardMinutesSinceUpdate);const i=e.getElementById(Xt);if(i&&(""==o&&(o=this._getDefaultTextColor(i)),i.style.setProperty("color",o)),t.has("hass")){let t=this.colorHelpers.calculateOsReleaseColor(this._ux_release_name,this._config.os_age),o=e.getElementById(Zt);o&&(""==t&&(t=this._getDefaultTextColor(o)),o.style.setProperty("color",t));let i=this.colorHelpers.calculateDaemonUpdateVersionColor(this._currentDaemonVersion,this._latestDaemonVersions);o=e.getElementById(Yt),o&&(""==i&&(i=this._getDefaultTextColor(o)),o.style.setProperty("color",i));let s=this.colorHelpers.calculateOsUpdateCountColor(this._os_update_count,this._config.os_update_severity);if(o=e.getElementById(Qt),o&&(""==s&&(s=this._getDefaultTextColor(o)),o.style.setProperty("color",s)),this._showFullCard)for(const t in this._cardFullCssIDs){const o=this._cardFullCssIDs[t],i=this._cardFullElements[t],s=this._getAttributeValueForKey(i),n=this._getFullCardValueForAttributeKey(i),r=e.getElementById(o),a=this._cardFullIconCssIDs[t],l=e.getElementById(a);if(r&&l){const t=this._getDefaultTextColor(r),e=this._getDefaultIconColor(l);if(i==ne){const o=this.colorHelpers.calculateFileSystemUsageColor(s,this._config.fs_severity);r.style.setProperty("color",""!=o?o:t),l.style.setProperty("color",""!=o?o:e)}if(i==le){const o=this.colorHelpers.calculateMemoryUsageColor(n.replace(" %",""),this._config.memory_severity);r.style.setProperty("color",""!=o?o:t),l.style.setProperty("color",""!=o?o:e)}if(i==re){const o=this.colorHelpers.calculateTemperatureColor(s,this._config.temp_severity);r.style.setProperty("color",""!=o?o:t),l.style.setProperty("color",""!=o?o:e)}}}else for(const t in this._cardGlanceCssIDs){const o=this._cardGlanceCssIDs[t],i=this._cardGlanceElements[t],s=this._getAttributeValueForKey(i),n=this._getGlanceCardValueForAttributeKey(i),r=e.getElementById(o),a=this._cardGlanceIconCssIDs[t],l=e.getElementById(a);if(r&&l){const t=this._getDefaultTextColor(r),o=this._getDefaultIconColor(l);if(i==ne){const e=this.colorHelpers.calculateFileSystemUsageColor(s,this._config.fs_severity);r.style.setProperty("color",""!=e?e:t),l.style.setProperty("color",""!=e?e:o)}if(i==le){const e=this.colorHelpers.calculateMemoryUsageColor(n,this._config.memory_severity);r.style.setProperty("color",""!=e?e:t),l.style.setProperty("color",""!=e?e:o)}if(i==re&&"n/a"!=n){const i=this.colorHelpers.calculateTemperatureColor(s,this._config.temp_severity);r.style.setProperty("color",""!=i?i:t),l.style.setProperty("color",""!=i?i:o);const n=e.getElementById(Jt);n&&(n.textContent=this._getTemperatureScale())}}}}}}}_getDefaultTextColor(t){let e=this._defaultTextColor;return 0==e.length&&(this._defaultTextColor=getComputedStyle(t).getPropertyValue("--primary-text-color"),e=this._defaultTextColor),e}_getDefaultIconColor(t){let e=this._defaultIconColor;return 0==e.length&&(this._defaultIconColor=getComputedStyle(t).getPropertyValue("--paper-item-icon-color"),e=this._defaultIconColor),e}_handleAction(t){this.hass&&this._config&&t.detail.action&&function(t,e,o,i){var s;"double_tap"===i&&o.double_tap_action?s=o.double_tap_action:"hold"===i&&o.hold_action?s=o.hold_action:"tap"===i&&o.tap_action&&(s=o.tap_action),Ut(t,e,o,s)}(this,this.hass,this._config,t.detail.action)}showWarning(t){return M` <hui-warning>${t}</hui-warning> `}showError(t){const e=document.createElement("hui-error-card");return e.setConfig({type:"error",error:t,origConfig:this._config}),M` ${e} `}_debugShowProps(t,e){this._showDebug&&(console.log("/ ---- "+e+" "+this._hostname+" ---- :"),console.log(t))}_ensureStateInfoAvail(){if(this._configEntityId&&this.hass){const t=this._configEntityId?this.hass.states[this._configEntityId]:void 0;t&&"unavailable"!=t.state&&"unknown"!=t.state?this._stateInfoAvailable=!0:this._stateInfoAvailable=!1}}_ensureWeHaveHostName(){if(0==this._hostname.length||this._hostname==this._configEntityId){const t=this._getAttributeValueForKey("host_name");t&&t.length>0?this._hostname=t:this._hostname=this._configEntityId?this._configEntityId:"-not-set-"}}_computeOsUpdCountMessage(t){let e="";return""!=t&&"0"!=t&&"-1"!=t&&(e="upd("+t+")"),e}_computeDaemonUpdMessage(t){let e="";return this._latestDaemonVersions.length>0&&""!=t?t<this._latestDaemonVersions[0]&&(e=t+" ---\x3e "+this._latestDaemonVersions[0]):e=""!=this._currentDaemonVersion?"{no info avail.}":"v?.?.? {no info avail.}",e}_calculateRelativeMinutesSinceUpdate(){let t=-1;const e=this._configEntityId?this.hass.states[this._configEntityId]:void 0;if(this._stateInfoAvailable=!!e,e&&"unknown"!=e.state){const o=e.state,i=new Date(o),s=Math.round(i.getTime()/1e3),n=Math.round((new Date).getTime()/1e3);t=Math.round((n-s)/60)}return t}_filterUptime(t){const e=t.split(" ");let o=t;if(o.includes(":")){for(let t=0;t<e.length;t++){const o=e[t];if(o.includes(":")){const i=o.split(":"),s=i[0]+"h:"+i[1]+"m";e[t]=s}}o=e.join(" ")}return o}_getAttributeValueForKey(t){let e="";try{if(this.hass&&this._config&&this._configEntityId){const o=this._configEntityId?this.hass.states[this._configEntityId]:void 0;if(o&&null!=o.attributes&&t in o.attributes){const i=null==o?void 0:o.attributes[t];e=i instanceof Array==0?i.toString():i}}}catch(t){console.error(t)}if(t==ne&&0==e.length){const t=this._getAttributeValueForKey("fs_free_prcnt");t.length>0&&(e=t)}return e}_getRawAttributeValueForKey(t){let e="";try{if(this.hass&&this._config&&this._configEntityId){const o=this._configEntityId?this.hass.states[this._configEntityId]:void 0;o&&null!=o.attributes&&t in o.attributes&&(e=null==o?void 0:o.attributes[t])}}catch(t){console.error(t)}return e}_generateFullsizeCardRows(){const t=[];for(const e in this._cardFullElements){const o=this._cardFullElements[e],i=this._getFullCardValueForAttributeKey(o);let s=this._cardFullIconNames[e];if(o==ne){const t=this._getAttributeValueForKey(o);s=this.colorHelpers.getIconNameForPercent(t)}const n=this._cardFullIconCssIDs[e],r=this._cardFullCssIDs[e];let a="attribute-row";"Model"==e?a="first-short":"Interfaces"==e&&(a="last-short"),t.push(M`
        <div class="${a}">
          <rpi-attribute-row>
            <div class="icon-holder">
              <ha-icon id="${n}" class="attr-icon-full pointer" icon="mdi:${s}"></ha-icon>
            </div>
            <div class="text-content uom">${e}</div>
            <div id="${r}" class="info pointer text-content right attr-value">${i}</div>
          </rpi-attribute-row>
        </div>
      `)}return t}_generateGlanceCardRows(){const t=[];for(const e in this._cardGlanceElements){const o=this._cardGlanceElements[e],i=this._getGlanceCardValueForAttributeKey(o);let s=e;s==this.kREPLACE_WITH_TEMP_UNITS&&(s="n/a"!=i?this._getTemperatureScale():""),o==le&&(s="% Mem");let n=this._cardGlanceIconNames[e];o==ne&&(n=this.colorHelpers.getIconNameForPercent(i));const r=this._cardGlanceCssIDs[e],a=this._cardGlanceIconCssIDs[e];let l="units";o==re&&(l=Jt),t.push(M`
        <div class="attributes" tabindex="0">
          <div>
            <ha-icon id="${a}" class="attr-icon" icon="mdi:${n}"></ha-icon>
          </div>
          <div id="${r}" class="attr-value">${i}</div>
          <div id="${l}" class="uom">${s}</div>
        </div>
      `)}return t}_getTemperatureScale(){return 1==this._useTempsInC?"C":"F"}_getScaledTemperatureValue(t){let e=t;return"n/a"!=e&&0==this._useTempsInC&&(e=(9*parseFloat(t)/5+32).toFixed(1)),e}_getFullCardValueForAttributeKey(t){const e=this._getAttributeValueForKey(t);let o=e;if(t==le)o=this._getPercentMemoryUsed()+" %";else if(t==oe)o=this._getUIDateForTimestamp(e);else if(t==re){if(o=this._getScaledTemperatureValue(e),"n/a"!=o){o=o+" "+this._getTemperatureScale()}}else if(t==se)o=e+" GB";else if(t==ne)o=e+" %";else if(t==ie)o=this._filterUptime(o);else if(t==ae){o=this._getAttributeValueForKey(ee)+" v"+this._getAttributeValueForKey("ux_version")}else if(t==te){const t=[];e.includes("e")&&t.push("Ether"),e.includes("w")&&t.push("WiFi"),e.includes("b")&&t.push("Bluetooth"),o=t.join(", ")}return o}_getGlanceCardValueForAttributeKey(t){const e=this._getAttributeValueForKey(t);let o=e;return t==le?o=this._getPercentMemoryUsed():t==oe?o=this._getUIDateForTimestamp(e):t==re?o=this._getScaledTemperatureValue(e):t==ie&&(o=this._filterUptime(o)),o}_getUIDateForTimestamp(t){return new Date(t).toLocaleDateString()}_getPercentMemoryUsed(){let t=this._getAttributeValueForKey("mem_used_prcnt");if(0==t.length){const e=this._getRawAttributeValueForKey("memory"),o=e.size_mb,i=e.free_mb,s=Number(o);t=((o-Number(i))/s*100).toFixed(0).toString()}return t}static get styles(){return r`
      ha-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
      }
      rpi-attribute-row {
        display: grid;
        flex-direction: row;
        align-items: center;
        height: 40px;
        grid-template-columns: 40px 2fr 3fr;
      }
      #states > * {
        margin: 8px 0px;
      }
      #states > div > * {
        overflow: hidden;
      }
      #states {
        flex: 1 1 0%;
      }
      .right {
        text-align: right;
      }
      .first-short {
        margin: 8px 0px 0px 0px;
        height: 20px;
      }
      .mid-short {
        margin: 0px;
        height: 20px;
      }
      .last-short {
        margin: 0px 0px 8px 0px;
        height: 20px;
      }
      .pointer {
        cursor: pointer;
      }
      .icon-holder {
        align-items: center;
        margin-left: 8px;
      }
      .attr-icon-full {
        color: var(--paper-item-icon-color);
      }
      .attribute-row {
        height: 40px;
      }
      .text-content {
        display: inline;
        line-height: 20px;
      }
      .info {
        white-space: nowrap;
        text-overflow: ellipses;
        overflow: hidden;
        margin-left: 16px;
        flex: 1 0 60px;
      }
      .glance-content {
        display: flex;
        justify-content: space-between;
        padding: 16px 32px 24px 32px;
      }
      .glance-content {
        text-align: center;
      }
      .attributes {
        cursor: pointer;
      }
      .attributes div {
        text-align: center;
      }
      .uom {
        color: var(--secondary-text-color);
      }
      .attr-value {
        color: var(--primary-text-color);
      }
      .attr-icon {
        color: var(--paper-item-icon-color);
        margin-bottom: 8px;
      }
      .last-heard-full {
        position: absolute;
        top: 45px;
        right: 5%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .last-heard {
        position: absolute;
        top: 55px;
        right: 5%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .last-heard-full-notitle {
        position: absolute;
        top: 3px;
        right: 5%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .last-heard-notitle {
        position: absolute;
        bottom: 5px;
        right: 15%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .os-name-full {
        position: absolute;
        top: 45px;
        left: 5%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .os-name {
        position: absolute;
        top: 55px;
        left: 5%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .os-name-full-notitle {
        position: absolute;
        top: 3px;
        left: 5%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .os-name-notitle {
        position: absolute;
        bottom: 5px;
        left: 15%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .daemon-update-full {
        position: absolute;
        top: 45px;
        right: 27%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .daemon-update {
        position: absolute;
        top: 55px;
        right: 27%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .daemon-update-full-notitle {
        position: absolute;
        top: 3px;
        right: 27%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .daemon-update-notitle {
        position: absolute;
        bottom: 5px;
        right: 37%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .os-update-ct-full {
        position: absolute;
        top: 45px;
        left: 27%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .os-update-ct {
        position: absolute;
        top: 55px;
        left: 27%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .os-update-ct-full-notitle {
        position: absolute;
        top: 3px;
        left: 27%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .os-update-ct-notitle {
        position: absolute;
        bottom: 5px;
        left: 37%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
    `}};t([st({attribute:!1})],we.prototype,"hass",void 0),t([nt()],we.prototype,"_config",void 0),we=t([ot("rpi-monitor-card")],we);export{we as RPiMonitorCard};
