function t(t,e,i,o){var s,n=arguments.length,r=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(e,i,r):s(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}const e=window,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;class n{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}}const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1]),t[0]);return new n(i,t,o)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,o))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var l;const c=window,h=c.trustedTypes,d=h?h.emptyScript:"",u=c.reactiveElementPolyfillSupport,p={toAttribute(t,e){switch(e){case Boolean:t=t?d:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},m=(t,e)=>e!==t&&(e==e||t==t),_={attribute:!0,type:String,converter:p,reflect:!1,hasChanged:m};class f extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const o=this._$Ep(i,e);void 0!==o&&(this._$Ev.set(o,i),t.push(o))})),t}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,o=this.getPropertyDescriptor(t,i,e);void 0!==o&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(o){const s=this[t];this[e]=o,this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||_}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const o=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{i?t.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):o.forEach((i=>{const o=document.createElement("style"),s=e.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=i.cssText,t.appendChild(o)}))})(o,this.constructor.elementStyles),o}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=_){var o;const s=this.constructor._$Ep(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==(null===(o=i.converter)||void 0===o?void 0:o.toAttribute)?i.converter:p).toAttribute(e,i.type);this._$El=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$El=null}}_$AK(t,e){var i;const o=this.constructor,s=o._$Ev.get(t);if(void 0!==s&&this._$El!==s){const t=o.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:p;this._$El=s,this[s]=n.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let o=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||m)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var g;f.finalized=!0,f.elementProperties=new Map,f.elementStyles=[],f.shadowRootOptions={mode:"open"},null==u||u({ReactiveElement:f}),(null!==(l=c.reactiveElementVersions)&&void 0!==l?l:c.reactiveElementVersions=[]).push("1.6.0");const v=window,y=v.trustedTypes,b=y?y.createPolicy("lit-html",{createHTML:t=>t}):void 0,$=`lit$${(Math.random()+"").slice(9)}$`,w="?"+$,C=`<${w}>`,A=document,I=(t="")=>A.createComment(t),S=t=>null===t||"object"!=typeof t&&"function"!=typeof t,E=Array.isArray,x=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,k=/>/g,U=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),D=/'/g,R=/"/g,M=/^(?:script|style|textarea|title)$/i,F=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),P=Symbol.for("lit-noChange"),O=Symbol.for("lit-nothing"),N=new WeakMap,V=A.createTreeWalker(A,129,null,!1);class H{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let s=0,n=0;const r=t.length-1,a=this.parts,[l,c]=((t,e)=>{const i=t.length-1,o=[];let s,n=2===e?"<svg>":"",r=x;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(r.lastIndex=h,l=r.exec(i),null!==l);)h=r.lastIndex,r===x?"!--"===l[1]?r=T:void 0!==l[1]?r=k:void 0!==l[2]?(M.test(l[2])&&(s=RegExp("</"+l[2],"g")),r=U):void 0!==l[3]&&(r=U):r===U?">"===l[0]?(r=null!=s?s:x,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?U:'"'===l[3]?R:D):r===R||r===D?r=U:r===T||r===k?r=x:(r=U,s=void 0);const d=r===U&&t[e+1].startsWith("/>")?" ":"";n+=r===x?i+C:c>=0?(o.push(a),i.slice(0,c)+"$lit$"+i.slice(c)+$+d):i+$+(-2===c?(o.push(void 0),e):d)}const a=n+(t[i]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==b?b.createHTML(a):a,o]})(t,e);if(this.el=H.createElement(l,i),V.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(o=V.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes()){const t=[];for(const e of o.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith($)){const i=c[n++];if(t.push(e),void 0!==i){const t=o.getAttribute(i.toLowerCase()+"$lit$").split($),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:s,name:e[2],strings:t,ctor:"."===e[1]?G:"?"===e[1]?q:"@"===e[1]?W:B})}else a.push({type:6,index:s})}for(const e of t)o.removeAttribute(e)}if(M.test(o.tagName)){const t=o.textContent.split($),e=t.length-1;if(e>0){o.textContent=y?y.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],I()),V.nextNode(),a.push({type:2,index:++s});o.append(t[e],I())}}}else if(8===o.nodeType)if(o.data===w)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=o.data.indexOf($,t+1));)a.push({type:7,index:s}),t+=$.length-1}s++}}static createElement(t,e){const i=A.createElement("template");return i.innerHTML=t,i}}function z(t,e,i=t,o){var s,n,r,a;if(e===P)return e;let l=void 0!==o?null===(s=i._$Co)||void 0===s?void 0:s[o]:i._$Cl;const c=S(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(n=null==l?void 0:l._$AO)||void 0===n||n.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,i,o)),void 0!==o?(null!==(r=(a=i)._$Co)&&void 0!==r?r:a._$Co=[])[o]=l:i._$Cl=l),void 0!==l&&(e=z(t,l._$AS(t,e.values),l,o)),e}class L{constructor(t,e){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var e;const{el:{content:i},parts:o}=this._$AD,s=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:A).importNode(i,!0);V.currentNode=s;let n=V.nextNode(),r=0,a=0,l=o[0];for(;void 0!==l;){if(r===l.index){let e;2===l.type?e=new j(n,n.nextSibling,this,t):1===l.type?e=new l.ctor(n,l.name,l.strings,this,t):6===l.type&&(e=new Y(n,this,t)),this.u.push(e),l=o[++a]}r!==(null==l?void 0:l.index)&&(n=V.nextNode(),r++)}return s}p(t){let e=0;for(const i of this.u)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class j{constructor(t,e,i,o){var s;this.type=2,this._$AH=O,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cm=null===(s=null==o?void 0:o.isConnected)||void 0===s||s}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=z(this,t,e),S(t)?t===O||null==t||""===t?(this._$AH!==O&&this._$AR(),this._$AH=O):t!==this._$AH&&t!==P&&this.g(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>E(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.k(t):this.g(t)}O(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}g(t){this._$AH!==O&&S(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){var e;const{values:i,_$litType$:o}=t,s="number"==typeof o?this._$AC(t):(void 0===o.el&&(o.el=H.createElement(o.h,this.options)),o);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===s)this._$AH.p(i);else{const t=new L(s,this),e=t.v(this.options);t.p(i),this.T(e),this._$AH=t}}_$AC(t){let e=N.get(t.strings);return void 0===e&&N.set(t.strings,e=new H(t)),e}k(t){E(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const s of t)o===e.length?e.push(i=new j(this.O(I()),this.O(I()),this,this.options)):i=e[o],i._$AI(s),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cm=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class B{constructor(t,e,i,o,s){this.type=1,this._$AH=O,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=O}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,o){const s=this.strings;let n=!1;if(void 0===s)t=z(this,t,e,0),n=!S(t)||t!==this._$AH&&t!==P,n&&(this._$AH=t);else{const o=t;let r,a;for(t=s[0],r=0;r<s.length-1;r++)a=z(this,o[i+r],e,r),a===P&&(a=this._$AH[r]),n||(n=!S(a)||a!==this._$AH[r]),a===O?t=O:t!==O&&(t+=(null!=a?a:"")+s[r+1]),this._$AH[r]=a}n&&!o&&this.j(t)}j(t){t===O?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class G extends B{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===O?void 0:t}}const K=y?y.emptyScript:"";class q extends B{constructor(){super(...arguments),this.type=4}j(t){t&&t!==O?this.element.setAttribute(this.name,K):this.element.removeAttribute(this.name)}}class W extends B{constructor(t,e,i,o,s){super(t,e,i,o,s),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=z(this,t,e,0))&&void 0!==i?i:O)===P)return;const o=this._$AH,s=t===O&&o!==O||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,n=t!==O&&(o===O||s);s&&this.element.removeEventListener(this.name,this,o),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class Y{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){z(this,t)}}const Z=v.litHtmlPolyfillSupport;null==Z||Z(H,j),(null!==(g=v.litHtmlVersions)&&void 0!==g?g:v.litHtmlVersions=[]).push("2.6.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var J,Q;class X extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var o,s;const n=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:e;let r=n._$litPart$;if(void 0===r){const t=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:null;n._$litPart$=r=new j(e.insertBefore(I(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return P}}X.finalized=!0,X._$litElement$=!0,null===(J=globalThis.litElementHydrateSupport)||void 0===J||J.call(globalThis,{LitElement:X});const tt=globalThis.litElementPolyfillSupport;null==tt||tt({LitElement:X}),(null!==(Q=globalThis.litElementVersions)&&void 0!==Q?Q:globalThis.litElementVersions=[]).push("3.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const et=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:o}=e;return{kind:i,elements:o,finisher(e){customElements.define(t,e)}}})(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,it=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};function ot(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):it(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function st(t){return ot({...t,state:!0})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var nt;null===(nt=window.HTMLSlotElement)||void 0===nt||nt.prototype.assignedElements;var rt,at,lt=function(t,e){return ct(e).format(t)},ct=function(t){return new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric"})};!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(rt||(rt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(at||(at={}));var ht=function(t){if(t.time_format===at.language||t.time_format===at.system){var e=t.time_format===at.language?t.language:void 0,i=(new Date).toLocaleString(e);return i.includes("AM")||i.includes("PM")}return t.time_format===at.am_pm},dt=function(t,e){return ut(e).format(t)},ut=function(t){return new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric",hour:ht(t)?"numeric":"2-digit",minute:"2-digit",hour12:ht(t)})},pt=function(t,e){return mt(e).format(t)},mt=function(t){return new Intl.DateTimeFormat(t.language,{hour:"numeric",minute:"2-digit",hour12:ht(t)})};function _t(){return(_t=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(t[o]=i[o])}return t}).apply(this,arguments)}function ft(t){return t.substr(0,t.indexOf("."))}var gt=function(t,e,i){var o=e?function(t){switch(t.number_format){case rt.comma_decimal:return["en-US","en"];case rt.decimal_comma:return["de","es","it"];case rt.space_comma:return["fr","sv","cs"];case rt.system:return;default:return t.language}}(e):void 0;if(Number.isNaN=Number.isNaN||function t(e){return"number"==typeof e&&t(e)},(null==e?void 0:e.number_format)!==rt.none&&!Number.isNaN(Number(t))&&Intl)try{return new Intl.NumberFormat(o,vt(t,i)).format(Number(t))}catch(e){return console.error(e),new Intl.NumberFormat(void 0,vt(t,i)).format(Number(t))}return"string"==typeof t?t:function(t,e){return void 0===e&&(e=2),Math.round(t*Math.pow(10,e))/Math.pow(10,e)}(t,null==i?void 0:i.maximumFractionDigits).toString()+("currency"===(null==i?void 0:i.style)?" "+i.currency:"")},vt=function(t,e){var i=_t({maximumFractionDigits:2},e);if("string"!=typeof t)return i;if(!e||!e.minimumFractionDigits&&!e.maximumFractionDigits){var o=t.indexOf(".")>-1?t.split(".")[1].length:0;i.minimumFractionDigits=o,i.maximumFractionDigits=o}return i},yt=function(t,e,i,o){var s=void 0!==o?o:e.state;if("unknown"===s||"unavailable"===s)return t("state.default."+s);if(function(t){return!!t.attributes.unit_of_measurement||!!t.attributes.state_class}(e)){if("monetary"===e.attributes.device_class)try{return gt(s,i,{style:"currency",currency:e.attributes.unit_of_measurement})}catch(t){}return gt(s,i)+(e.attributes.unit_of_measurement?" "+e.attributes.unit_of_measurement:"")}var n=function(t){return ft(t.entity_id)}(e);if("input_datetime"===n){var r;if(void 0===o)return e.attributes.has_date&&e.attributes.has_time?(r=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day,e.attributes.hour,e.attributes.minute),dt(r,i)):e.attributes.has_date?(r=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day),lt(r,i)):e.attributes.has_time?((r=new Date).setHours(e.attributes.hour,e.attributes.minute),pt(r,i)):e.state;try{var a=o.split(" ");if(2===a.length)return dt(new Date(a.join("T")),i);if(1===a.length){if(o.includes("-"))return lt(new Date(o+"T00:00"),i);if(o.includes(":")){var l=new Date;return pt(new Date(l.toISOString().split("T")[0]+"T"+o),i)}}return o}catch(t){return o}}return"humidifier"===n&&"on"===s&&e.attributes.humidity?e.attributes.humidity+" %":"counter"===n||"number"===n||"input_number"===n?gt(s,i):e.attributes.device_class&&t("component."+n+".state."+e.attributes.device_class+"."+s)||t("component."+n+".state._."+s)||s},bt=["closed","locked","off"],$t=function(t,e,i,o){o=o||{},i=null==i?{}:i;var s=new Event(e,{bubbles:void 0===o.bubbles||o.bubbles,cancelable:Boolean(o.cancelable),composed:void 0===o.composed||o.composed});return s.detail=i,t.dispatchEvent(s),s},wt=function(t){$t(window,"haptic",t)},Ct=function(t,e){return function(t,e,i){void 0===i&&(i=!0);var o,s=ft(e),n="group"===s?"homeassistant":s;switch(s){case"lock":o=i?"unlock":"lock";break;case"cover":o=i?"open_cover":"close_cover";break;default:o=i?"turn_on":"turn_off"}return t.callService(n,o,{entity_id:e})}(t,e,bt.includes(t.states[e].state))},At=function(t,e,i,o){if(o||(o={action:"more-info"}),!o.confirmation||o.confirmation.exemptions&&o.confirmation.exemptions.some((function(t){return t.user===e.user.id}))||(wt("warning"),confirm(o.confirmation.text||"Are you sure you want to "+o.action+"?")))switch(o.action){case"more-info":(i.entity||i.camera_image)&&$t(t,"hass-more-info",{entityId:i.entity?i.entity:i.camera_image});break;case"navigate":o.navigation_path&&function(t,e,i){void 0===i&&(i=!1),i?history.replaceState(null,"",e):history.pushState(null,"",e),$t(window,"location-changed",{replace:i})}(0,o.navigation_path);break;case"url":o.url_path&&window.open(o.url_path);break;case"toggle":i.entity&&(Ct(e,i.entity),wt("success"));break;case"call-service":if(!o.service)return void wt("failure");var s=o.service.split(".",2);e.callService(s[0],s[1],o.service_data,o.target),wt("success");break;case"fire-dom-event":$t(t,"ll-custom",o)}};function It(t){return void 0!==t&&"none"!==t.action}const St={required:{icon:"tune",name:"Required",secondary:"Required options for this card to function",show:!0},actions:{icon:"gesture-tap-hold",name:"Actions",secondary:"Perform actions based on tapping/clicking",show:!1,options:{tap:{icon:"gesture-tap",name:"Tap",secondary:"Set the action to perform on tap",show:!1},hold:{icon:"gesture-tap-hold",name:"Hold",secondary:"Set the action to perform on hold",show:!1},double_tap:{icon:"gesture-double-tap",name:"Double Tap",secondary:"Set the action to perform on double tap",show:!1}}},appearance:{icon:"palette",name:"Appearance",secondary:"Customize the name, icon, etc",show:!1}};let Et=class extends X{constructor(){super(...arguments),this._initialized=!1}setConfig(t){this._config=t,this.loadCardHelpers()}shouldUpdate(){return this._initialized||this._initialize(),!0}get _name(){var t;return(null===(t=this._config)||void 0===t?void 0:t.name)||""}get _entity(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity)||""}get _show_warning(){var t;return(null===(t=this._config)||void 0===t?void 0:t.show_warning)||!1}get _show_error(){var t;return(null===(t=this._config)||void 0===t?void 0:t.show_error)||!1}get _tap_action(){var t;return(null===(t=this._config)||void 0===t?void 0:t.tap_action)||{action:"more-info"}}get _hold_action(){var t;return(null===(t=this._config)||void 0===t?void 0:t.hold_action)||{action:"none"}}get _double_tap_action(){var t;return(null===(t=this._config)||void 0===t?void 0:t.double_tap_action)||{action:"none"}}render(){if(!this.hass||!this._helpers)return F``;this._helpers.importMoreInfoControl("climate");const t=Object.keys(this.hass.states).filter((t=>"sun"===t.substr(0,t.indexOf("."))));return F`
      <div class="card-config">
        <div class="option" @click=${this._toggleOption} .option=${"required"}>
          <div class="row">
            <ha-icon .icon=${`mdi:${St.required.icon}`}></ha-icon>
            <div class="title">${St.required.name}</div>
          </div>
          <div class="secondary">${St.required.secondary}</div>
        </div>
        ${St.required.show?F`
              <div class="values">
                <paper-dropdown-menu
                  label="Entity (Required)"
                  @value-changed=${this._valueChanged}
                  .configValue=${"entity"}
                >
                  <paper-listbox slot="dropdown-content" .selected=${t.indexOf(this._entity)}>
                    ${t.map((t=>F` <paper-item>${t}</paper-item> `))}
                  </paper-listbox>
                </paper-dropdown-menu>
              </div>
            `:""}
        <div class="option" @click=${this._toggleOption} .option=${"actions"}>
          <div class="row">
            <ha-icon .icon=${`mdi:${St.actions.icon}`}></ha-icon>
            <div class="title">${St.actions.name}</div>
          </div>
          <div class="secondary">${St.actions.secondary}</div>
        </div>
        ${St.actions.show?F`
              <div class="values">
                <div class="option" @click=${this._toggleAction} .option=${"tap"}>
                  <div class="row">
                    <ha-icon .icon=${`mdi:${St.actions.options.tap.icon}`}></ha-icon>
                    <div class="title">${St.actions.options.tap.name}</div>
                  </div>
                  <div class="secondary">${St.actions.options.tap.secondary}</div>
                </div>
                ${St.actions.options.tap.show?F`
                      <div class="values">
                        <paper-item>Action Editors Coming Soon</paper-item>
                      </div>
                    `:""}
                <div class="option" @click=${this._toggleAction} .option=${"hold"}>
                  <div class="row">
                    <ha-icon .icon=${`mdi:${St.actions.options.hold.icon}`}></ha-icon>
                    <div class="title">${St.actions.options.hold.name}</div>
                  </div>
                  <div class="secondary">${St.actions.options.hold.secondary}</div>
                </div>
                ${St.actions.options.hold.show?F`
                      <div class="values">
                        <paper-item>Action Editors Coming Soon</paper-item>
                      </div>
                    `:""}
                <div class="option" @click=${this._toggleAction} .option=${"double_tap"}>
                  <div class="row">
                    <ha-icon .icon=${`mdi:${St.actions.options.double_tap.icon}`}></ha-icon>
                    <div class="title">${St.actions.options.double_tap.name}</div>
                  </div>
                  <div class="secondary">${St.actions.options.double_tap.secondary}</div>
                </div>
                ${St.actions.options.double_tap.show?F`
                      <div class="values">
                        <paper-item>Action Editors Coming Soon</paper-item>
                      </div>
                    `:""}
              </div>
            `:""}
        <div class="option" @click=${this._toggleOption} .option=${"appearance"}>
          <div class="row">
            <ha-icon .icon=${`mdi:${St.appearance.icon}`}></ha-icon>
            <div class="title">${St.appearance.name}</div>
          </div>
          <div class="secondary">${St.appearance.secondary}</div>
        </div>
        ${St.appearance.show?F`
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
    `}_initialize(){void 0!==this.hass&&void 0!==this._config&&void 0!==this._helpers&&(this._initialized=!0)}async loadCardHelpers(){this._helpers=await window.loadCardHelpers()}_toggleAction(t){this._toggleThing(t,St.actions.options)}_toggleOption(t){this._toggleThing(t,St)}_toggleThing(t,e){const i=!e[t.target.option].show;for(const[t]of Object.entries(e))e[t].show=!1;e[t.target.option].show=i,this._toggle=!this._toggle}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target;if(this[`_${e.configValue}`]!==e.value){if(e.configValue)if(""===e.value){const t=Object.assign({},this._config);delete t[e.configValue],this._config=t}else this._config=Object.assign(Object.assign({},this._config),{[e.configValue]:void 0!==e.checked?e.checked:e.value});$t(this,"config-changed",{config:this._config})}}static get styles(){return r`
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
    `}};t([ot({attribute:!1})],Et.prototype,"hass",void 0),t([st()],Et.prototype,"_config",void 0),t([st()],Et.prototype,"_toggle",void 0),t([st()],Et.prototype,"_helpers",void 0),Et=t([et("rpi-monitor-card-editor")],Et);class xt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const Tt="ontouchstart"in window||navigator.maxTouchPoints>0||navigator.maxTouchPoints>0;class kt extends HTMLElement{constructor(){super(),this.holdTime=500,this.held=!1,this.ripple=document.createElement("mwc-ripple")}connectedCallback(){Object.assign(this.style,{position:"absolute",width:Tt?"100px":"50px",height:Tt?"100px":"50px",transform:"translate(-50%, -50%)",pointerEvents:"none",zIndex:"999"}),this.appendChild(this.ripple),this.ripple.primary=!0,["touchcancel","mouseout","mouseup","touchmove","mousewheel","wheel","scroll"].forEach((t=>{document.addEventListener(t,(()=>{clearTimeout(this.timer),this.stopAnimation(),this.timer=void 0}),{passive:!0})}))}bind(t,e){if(t.actionHandler)return;t.actionHandler=!0,t.addEventListener("contextmenu",(t=>{const e=t||window.event;return e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0,e.returnValue=!1,!1}));const i=t=>{let e,i;this.held=!1,t.touches?(e=t.touches[0].pageX,i=t.touches[0].pageY):(e=t.pageX,i=t.pageY),this.timer=window.setTimeout((()=>{this.startAnimation(e,i),this.held=!0}),this.holdTime)},o=i=>{i.preventDefault(),["touchend","touchcancel"].includes(i.type)&&void 0===this.timer||(clearTimeout(this.timer),this.stopAnimation(),this.timer=void 0,this.held?$t(t,"action",{action:"hold"}):e.hasDoubleClick?"click"===i.type&&i.detail<2||!this.dblClickTimeout?this.dblClickTimeout=window.setTimeout((()=>{this.dblClickTimeout=void 0,$t(t,"action",{action:"tap"})}),250):(clearTimeout(this.dblClickTimeout),this.dblClickTimeout=void 0,$t(t,"action",{action:"double_tap"})):$t(t,"action",{action:"tap"}))};t.addEventListener("touchstart",i,{passive:!0}),t.addEventListener("touchend",o),t.addEventListener("touchcancel",o),t.addEventListener("mousedown",i,{passive:!0}),t.addEventListener("click",o),t.addEventListener("keyup",(t=>{13===t.keyCode&&o(t)}))}startAnimation(t,e){Object.assign(this.style,{left:`${t}px`,top:`${e}px`,display:null}),this.ripple.disabled=!1,this.ripple.active=!0,this.ripple.unbounded=!0}stopAnimation(){this.ripple.active=!1,this.ripple.disabled=!0,this.style.display="none"}}customElements.define("action-handler-rpi-monitor",kt);const Ut=(t,e)=>{const i=(()=>{const t=document.body;if(t.querySelector("action-handler-rpi-monitor"))return t.querySelector("action-handler-rpi-monitor");const e=document.createElement("action-handler-rpi-monitor");return t.appendChild(e),e})();i&&i.bind(t,e)},Dt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends xt{update(t,[e]){return Ut(t.element,e),P}render(t){}}),Rt="ifaces",Mt="ux_release",Ft="last_update",Pt="up_time",Ot="fs_total_gb",Nt="fs_free_prcnt",Vt="temperature_c",Ht="show-os-parts",zt="memory_percent";var Lt={version:"Version",invalid_configuration:"Invalid configuration",show_warning:"Show Warning",show_error:"Show Error"},jt={common:Lt},Bt=Object.freeze({__proto__:null,common:Lt,default:jt}),Gt={version:"Versjon",invalid_configuration:"Ikke gyldig konfiguration",show_warning:"Vis advarsel",show_error:"Vis feil"},Kt={common:Gt},qt=Object.freeze({__proto__:null,common:Gt,default:Kt}),Wt={version:"Version",invalid_configuration:"configuración no válida",show_warning:"Mostrar advertencia",show_error:"Mostrar error"},Yt={common:Wt};const Zt={en:Bt,es:Object.freeze({__proto__:null,common:Wt,default:Yt}),nb:qt};function Jt(t,e="",i=""){const o=(localStorage.getItem("selectedLanguage")||"en").replace(/['"]+/g,"").replace("-","_");let s;try{s=t.split(".").reduce(((t,e)=>t[e]),Zt[o])}catch(e){s=t.split(".").reduce(((t,e)=>t[e]),Zt.en)}return void 0===s&&(s=t.split(".").reduce(((t,e)=>t[e]),Zt.en)),""!==e&&""!==i&&(s=s.replace(e,i)),s}console.info(`%c  RPI-MONITOR-CARD \n%c  ${Jt("common.version")} 1.3.1    `,"color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"rpi-monitor-card",name:"RPi Monitor Card",description:"A template custom card for you to create something awesome"});let Qt=class extends X{constructor(){super(...arguments),this._cardSecondsSinceUpdate=0,this._cardUpdateString="",this._firstTime=!0,this._sensorAvailable=!1,this._updateTimerID=void 0,this._configEntityId=void 0,this._hostname="",this._showFullCard=!0,this._useTempsInC=!0,this.kREPLACE_WITH_TEMP_UNITS="replace-with-temp-units",this.kMQTT_DAEMON_RELEASE_URL="https://raw.githubusercontent.com/ironsheep/RPi-Reporter-MQTT2HA-Daemon/master/Release",this.latestDaemonVersions=["v1.7.2","v1.6.1"],this.currentDaemonVersion="",this._showDebug=!1,this._cardFullElements={"Storage Use":Nt,Storage:Ot,"Memory Use":zt,Temperature:Vt,"Up-time":Pt,Updated:Ft,OS:Ht,Model:"rpi_model",Interfaces:Rt},this._cardFullIconNames={Storage:"sd","Storage Use":"file-percent","Memory Use":"memory",Temperature:"thermometer","Up-time":"clock-check-outline",Updated:"update",OS:"linux",Model:"raspberry-pi",Interfaces:""},this.kClassIdIconFSAvail="ico-fs-percent",this.kClassIdIconFSTotal="ico-fs-total",this.kClassIdIconSysTemp="ico-sys-temp",this.kClassIdIconUptime="ico-up-time",this.kClassIdIconUpdated="ico-last-update",this.kClassIdIconOS="ico-*nix",this.kClassIdIconRPiModel="ico-rpi-model",this.kClassIdIconInterfaces="ico-rpi-ifaces",this.kClassIdIconMemoryUsage="ico-memory-percent",this.kClassIdFSAvail="fs-percent",this.kClassIdFSTotal="fs-total",this.kClassIdSysTemp="sys-temp",this.kClassIdUptime="up-time",this.kClassIdUpdated="last-update",this.kClassIdOS="*nix",this.kClassIdRPiModel="rpi-model",this.kClassIdInterfaces="rpi-ifaces",this.kClassIdMemoryUsage="memory-percent",this.kClassIdTempScale="sys-temp-scale",this._cardFullCssIDs={"Storage Use":this.kClassIdFSAvail,Storage:this.kClassIdFSTotal,"Memory Use":this.kClassIdMemoryUsage,Temperature:this.kClassIdSysTemp,"Up-time":this.kClassIdUptime,Updated:this.kClassIdUpdated,OS:this.kClassIdOS,Model:this.kClassIdRPiModel,Interfaces:this.kClassIdInterfaces},this._cardFullIconCssIDs={"Storage Use":this.kClassIdIconFSAvail,Storage:this.kClassIdIconFSTotal,"Memory Use":this.kClassIdIconMemoryUsage,"Up-time":this.kClassIdIconUptime,Updated:this.kClassIdIconUpdated,Temperature:this.kClassIdIconSysTemp,OS:this.kClassIdIconOS,Model:this.kClassIdIconRPiModel,Interfaces:this.kClassIdIconInterfaces},this._cardGlanceElements={"%":Nt,GB:Ot,Mem:zt,"replace-with-temp-units":Vt,UpTime:Pt,Upd:Ft},this._cardGlanceIconNames={"%":"file-percent",GB:"sd",Mem:"memory","replace-with-temp-units":"thermometer",UpTime:"clock-check-outline",Upd:"update"},this._cardGlanceCssIDs={"%":this.kClassIdFSAvail,GB:this.kClassIdFSTotal,Mem:this.kClassIdMemoryUsage,"replace-with-temp-units":this.kClassIdSysTemp,UpTime:this.kClassIdUptime,Upd:this.kClassIdUpdated},this._cardGlanceIconCssIDs={"%":this.kClassIdIconFSAvail,GB:this.kClassIdIconFSTotal,Mem:this.kClassIdIconMemoryUsage,"replace-with-temp-units":this.kClassIdIconSysTemp,UpTime:this.kClassIdIconUptime,Upd:this.kClassIdIconUpdated},this._circleIconsValueByName={"circle-outline":0,"circle-slice-1":13,"circle-slice-2":25,"circle-slice-3":38,"circle-slice-4":50,"circle-slice-5":63,"circle-slice-6":75,"circle-slice-7":88,"circle-slice-8":100},this._colorUsedSpaceDefault=[{color:"default",from:0,to:59},{color:"yellow",from:60,to:84},{color:"red",from:85,to:100}],this._colorTemperatureDefault=[{color:"default",from:0,to:59},{color:"yellow",from:60,to:79},{color:"red",from:85,to:100}],this._colorReportPeriodsAgoDefault=[{color:"default",from:0,to:3},{color:"orange",from:4,to:5},{color:"red",from:6,to:100}],this._colorUsedMemoryDefault=[{color:"red",from:75,to:100},{color:"yellow",from:61,to:74},{color:"default",from:0,to:60}],this._colorReleaseDefault=[{color:"red",os:"stretch"},{color:"red",os:"jessie"},{color:"red",os:"wheezy"}]}static async getConfigElement(){return console.log("- getConfigElement()"),document.createElement("rpi-monitor-card-editor")}static getStubConfig(){return{}}setConfig(t){if(null!=t.show_debug&&(this._showDebug=t.show_debug||this._showDebug),this._showDebug&&console.log("- setConfig()"),!t||t.show_error)throw new Error(Jt("common.invalid_configuration"));if(null!=t.card_style){const e=t.card_style.toLocaleLowerCase();if("full"!=e&&"glance"!=e)throw console.log("Invalid configuration. INVALID card_style = ["+t.card_style+"]"),new Error("Illegal card_style: value (card_style: "+t.card_style+") must be [full or glance]");this._showFullCard="full"===t.card_style.toLocaleLowerCase()}if(null!=t.temp_scale){const e=t.temp_scale.toLocaleLowerCase();if("c"!=e&&"f"!=e)throw console.log("Invalid configuration. INVALID temp_scale = ["+t.temp_scale+"]"),new Error("Illegal temp_scale: value (temp_scale: "+t.temp_scale+") must be [F or C]");this._useTempsInC="c"===t.temp_scale.toLocaleLowerCase()}if(!t.entity)throw console.log("Invalid configuration. If no entity provided, you'll need to provide a remote entity"),new Error("You need to associate an entity");t.test_gui&&function(){var t=document.querySelector("home-assistant");if(t=(t=(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-root")){var e=t.lovelace;return e.current_view=t.___curView,e}return null}().setEditMode(!0),this._config=Object.assign({},t),console.log("- config=["+this._config+"]"),this._configEntityId=null!=this._config.entity?this._config.entity:void 0,this._updateSensorAvailability()}shouldUpdate(t){if(0==this._hostname.length||this._hostname==this._configEntityId){const t=this._getAttributeValueForKey("host_name");t&&t.length>0?this._hostname=t:this._hostname=this._configEntityId?this._configEntityId:"-not-set-"}let e=!0;if(this._updateSensorAvailability(),t.has("_config"))e=!0;else if(this.hass&&this._config){const i=t.get("hass");i&&this._configEntityId&&(e=i.states[this._configEntityId]!==this.hass.states[this._configEntityId])}return e}render(){if(this._showDebug&&console.log("- render("+this._hostname+")"),this._config.show_warning)return this.showWarning(Jt("common.show_warning"));if(this._config.show_error)return this.showError(Jt("common.show_error"));if(this._configEntityId&&!this._sensorAvailable){const t="Entity Unavailable: "+this._configEntityId;return this.showWarning(t)}const t=this._configEntityId?this.hass.states[this._configEntityId]:void 0;if(!this._configEntityId&&!t)return this.showWarning("Entity Unavailable");if(0==this._sensorAvailable)return void console.log("?? Render w/o sensor!! ("+this._hostname+")");let e=F``;this._firstTime&&(this._showDebug&&console.log("- stateObj: ["+t+"]"),this._startCardRefreshTimer(),this._showDebug&&console.log("- 1st-time _config: ["+this._config+"]"),this._firstTime=!1);const i=null==this._config.show_os_age||this._config.show_os_age,o=null==this._config.show_update_age||this._config.show_update_age,s=null==this._config.show_daemon_upd||this._config.show_daemon_upd,n=null==this._config.show_title||this._config.show_title;if(s){const t=this._getAttributeValueForKey("reporter").split(" ");this.currentDaemonVersion=t.length>1?t[1]:"";const e=this._getAttributeValueForKey("reporter_releases");if(e&&e.length>0&&"NOT-LOADED"!=e){const t=e.split(",");this.latestDaemonVersions=t}}const r=this._getAttributeValueForKey("fqdn"),a=1==i?this._getAttributeValueForKey(Mt):"",l=s?this._computeDaemonUpdMessage(this.currentDaemonVersion):"",c=1==o?this._cardUpdateString:"";let h="RPi monitor "+r;h=null!=this._config.name_prefix?this._config.name_prefix+" "+r:h,h=null!=this._config.name?this._config.name:h,0==n&&(h="");const d=0==n?"last-heard-full-notitle":"last-heard-full",u=0==n?"last-heard-notitle":"last-heard",p=0==n?"os-name-full-notitle":"os-name-full",m=0==n?"os-name-notitle":"os-name",_=0==n?"daemon-update-full-notitle":"daemon-update-full",f=0==n?"daemon-update-notitle":"daemon-update";if(this._showFullCard){const t=this._generateFullsizeCardRows();if(0==t.length||!t)return void console.log("ERROR: failed to generate full rows!");e=F`
        <ha-card
          .header=${h}
          @action=${this._handleAction}
          .actionHandler=${Dt({hasHold:It(this._config.hold_action),hasDoubleClick:It(this._config.double_tap_action)})}
          tabindex="0"
          aria-label=${h}
        >
          <div id="states" class="card-content">
            ${t}
            <div id="card-timestamp" class=${d}>${c}</div>
            <div id="os-name" class=${p}>${a}</div>
            <div id="daemon-update" class="${_} center">${l}</div>
          </div>
        </ha-card>
      `}else{const t=this._generateGlanceCardRows();if(0==t.length||!t)return void console.log("ERROR: failed to generate glance rows!");e=F`
        <ha-card
          .header=${h}
          @action=${this._handleAction}
          .actionHandler=${Dt({hasHold:It(this._config.hold_action),hasDoubleClick:It(this._config.double_tap_action)})}
          tabindex="0"
          aria-label=${h}
        >
          <div class="content">
            ${t}
            <div id="card-timestamp" class=${u}>${c}</div>
            <div id="os-name" class=${m}>${a}</div>
            <div id="daemon-update" class="${f} center">${l}</div>
          </div>
        </ha-card>
      `}return e}updated(t){if(this._showDebug&&console.log("- updated("+this._hostname+")"),this._config){if(this.hass){const e=t.get("hass");(!e||e&&e.themes!==this.hass.themes)&&function(t,e,i,o){void 0===o&&(o=!1),t._themes||(t._themes={});var s=e.default_theme;("default"===i||i&&e.themes[i])&&(s=i);var n=_t({},t._themes);if("default"!==s){var r=e.themes[s];Object.keys(r).forEach((function(e){var i="--"+e;t._themes[i]="",n[i]=r[e]}))}if(t.updateStyles?t.updateStyles(n):window.ShadyCSS&&window.ShadyCSS.styleSubtree(t,n),o){var a=document.querySelector("meta[name=theme-color]");if(a){a.hasAttribute("default-content")||a.setAttribute("default-content",a.getAttribute("content"));var l=n["--primary-color"]||a.getAttribute("default-content");a.setAttribute("content",l)}}}(this,this.hass.themes,this._config.theme)}if(this.hass&&this._configEntityId){this.hass.states[this._configEntityId]||this._stopCardRefreshTimer()}const e=this.shadowRoot;if(this._sensorAvailable){const t=this._getAttributeValueForKey(Mt),i=this._computeOsReleaseColor(t);if(""!=i){e.getElementById("os-name").style.setProperty("color",i)}const o=this._computeDaemonUpdateVersionColor(this.currentDaemonVersion);if(""!=o){e.getElementById("daemon-update").style.setProperty("color",o)}const s=this._computeReporterAgeColor(this._cardSecondsSinceUpdate);if(""!=s&&null!=s){e.getElementById("card-timestamp").style.setProperty("color",s)}if(this._showFullCard)for(const t in this._cardFullCssIDs){const i=this._cardFullCssIDs[t],o=this._cardFullElements[t],s=this._getAttributeValueForKey(o),n=this._getFullCardValueForAttributeKey(o),r=e.getElementById(i);r.textContent=n;const a=this._cardFullIconCssIDs[t],l=e.getElementById(a);if(o==Nt){const t=this._computeFileSystemUsageColor(s);""!=t&&(r.style.setProperty("color",t),l.style.setProperty("color",t))}if(o==zt){const t=this._computeMemoryUsageColor(n.replace(" %",""));""!=t&&(r.style.setProperty("color",t),l.style.setProperty("color",t))}if(o==Vt){const t=this._computeTemperatureColor(s);""!=t&&(r.style.setProperty("color",t),l.style.setProperty("color",t))}}else for(const t in this._cardGlanceCssIDs){const i=this._cardGlanceCssIDs[t],o=this._cardGlanceElements[t],s=this._getAttributeValueForKey(o),n=this._getGlanceCardValueForAttributeKey(o),r=e.getElementById(i);r.textContent=n;const a=this._cardGlanceIconCssIDs[t],l=e.getElementById(a);if(o==Nt){const t=this._computeFileSystemUsageColor(s);""!=t&&(r.style.setProperty("color",t),l.style.setProperty("color",t))}if(o==zt){const t=this._computeMemoryUsageColor(n);""!=t&&(r.style.setProperty("color",t),l.style.setProperty("color",t))}if(o==Vt&&"n/a"!=n){const t=this._computeTemperatureColor(s);""!=t&&(r.style.setProperty("color",t),l.style.setProperty("color",t));e.getElementById(this.kClassIdTempScale).textContent=this._getTemperatureScale()}}}}}_handleAction(t){this.hass&&this._config&&t.detail.action&&function(t,e,i,o){var s;"double_tap"===o&&i.double_tap_action?s=i.double_tap_action:"hold"===o&&i.hold_action?s=i.hold_action:"tap"===o&&i.tap_action&&(s=i.tap_action),At(t,e,i,s)}(this,this.hass,this._config,t.detail.action)}showWarning(t){return F` <hui-warning>${t}</hui-warning> `}showError(t){const e=document.createElement("hui-error-card");return e.setConfig({type:"error",error:t,origConfig:this._config}),F` ${e} `}_startCardRefreshTimer(){this._updateTimerID=setInterval((()=>this._handleCardUpdateTimerExpiration()),1e3),this._showDebug&&console.log("TIMER: ("+this._hostname+") started")}_stopCardRefreshTimer(){null!=this._updateTimerID&&(clearInterval(this._updateTimerID),this._updateTimerID=void 0,this._showDebug&&console.log("TIMER: ("+this._hostname+") STOPPED"))}_handleCardUpdateTimerExpiration(){const[t,e]=this._getRelativeTimeSinceUpdate();if(t&&t.length>0){let i=t;t.includes("NaN")&&(console.log(" HCUTE (DBG) ("+this._hostname+") card_timestamp_value=["+t+"]"),i="{bad value}"),this._cardUpdateString!=i&&(this._cardUpdateString=i),this._cardSecondsSinceUpdate!=e&&(this._cardSecondsSinceUpdate=e)}}_logChangeMessage(t){const e="("+this._hostname+"): "+t;this._showDebug&&console.log(e)}_updateSensorAvailability(){let t=!1;if(this.hass&&this._config){const e=this._configEntityId?this.hass.states[this._configEntityId]:void 0;if(this._configEntityId||e){if(this._configEntityId)try{const e="unavailable"!=this.hass.states[this._configEntityId].state;t=this._sensorAvailable!=e,this._sensorAvailable=e}catch(e){this._sensorAvailable=!1,t=!0}}else this._sensorAvailable=!1,t=!0}else this._sensorAvailable=!1,t=!0;t&&this._logChangeMessage("* SENSOR available: "+this._sensorAvailable)}_computeDaemonUpdMessage(t){let e="";return this._showDebug&&(console.log("- RNDR currentDaemonVersion=["+t+"]"),console.log("- RNDR latestDaemonVersions=["+this.latestDaemonVersions+"]")),this.latestDaemonVersions.length>0&&""!=t?t!=this.latestDaemonVersions[0]&&(e=t+" ---\x3e "+this.latestDaemonVersions[0]):e=""!=this.currentDaemonVersion?"{no info avail.}":"v?.?.? {no info avail.}",e}_getRelativeTimeSinceUpdate(){var t;const e=this._configEntityId?this.hass.states[this._configEntityId]:void 0;let i="",o=0,s="";if(this.hass.locale&&e){try{const o=yt(null===(t=this.hass)||void 0===t?void 0:t.localize,e,this.hass.locale),n=void 0===o?"{unknown}":this._formatTimeAgo(o);i=this._sensorAvailable?n:"{unknown}";s=n.split(" ")[0]}catch(t){console.log("GRTSU - exception:"),console.error(t)}o=s.includes("just")||s.includes("unknown")?0:Number(s)}return[i,o]}_formatTimeAgo(t){const e=new Date((t||"").replace(/-/g,"/").replace(/[TZ]/g," ")),i=((new Date).getTime()-e.getTime())/1e3,o=Math.floor(i/86400),s=e.getFullYear(),n=e.getMonth()+1,r=e.getDate();if(isNaN(o)||o<0||o>=31)return s.toString()+"-"+(n<10?"0"+n.toString():n.toString())+"-"+(r<10?"0"+r.toString():r.toString());let a="{unknown}";return 0==o?i<60?a="just now":i<120?a="1 min ago":i<3600?a=Math.floor(i/60)+" mins ago":i<7200?a="1 hr ago":i<86400&&(a=Math.floor(i/3600)+" hrs ago"):1==o?a="Yesterday":o<7?a=o+" days ago":o<31&&(a=Math.ceil(o/7)+" wks ago"),a}_getIconNameForPercent(t){let e="";for(const i in this._circleIconsValueByName){if(t<=this._circleIconsValueByName[i]){e=i;break}}return e}_computeReporterAgeColor(t){let e;return this._colorReportPeriodsAgoDefault.forEach((i=>{t>=i.from&&t<=i.to&&(e=i.color)})),null!=e&&"default"!=e||(e=""),e}_computeTemperatureColor(t){const e=this._config,i=Number(t),o=e.temp_severity?e.temp_severity:this._colorTemperatureDefault;let s;if(isNaN(i)||o.forEach((e=>{if(i>=e.from&&i<=e.to&&(s=e.color,this._showDebug)){const i="_computeTemperatureColor() - value=["+t+"] matched(from="+e.from+", to="+e.to+", color="+s+")";console.log(i)}})),this._showDebug){const e="_computeTemperatureColor() - value=["+t+"] returns(color="+s+")";console.log(e)}return null!=s&&"default"!=s||(s=""),s}_computeFileSystemUsageColor(t){const e=this._config,i=Number(t),o=e.fs_severity?e.fs_severity:this._colorUsedSpaceDefault;let s;if(isNaN(i)||o.forEach((e=>{if(i>=e.from&&i<=e.to&&(s=e.color,this._showDebug)){const i="_computeFileSystemUsageColor() - value=["+t+"] matched(from="+e.from+", to="+e.to+", color="+s+")";console.log(i)}})),this._showDebug){const e="_computeFileSystemUsageColor() - value=["+t+"] returns(color="+s+")";console.log(e)}return null!=s&&"default"!=s||(s=""),s}_computeMemoryUsageColor(t){const e=this._config,i=Number(t),o=e.memory_severity?e.memory_severity:this._colorUsedMemoryDefault;let s;if(isNaN(i)||o.forEach((e=>{if(i>=e.from&&i<=e.to&&(s=e.color,this._showDebug)){const i="_computeMemoryUsageColor() - value=["+t+"] matched(from="+e.from+", to="+e.to+", color="+s+")";console.log(i)}})),this._showDebug){const e="_computeMemoryUsageColor() - value=["+t+"] returns(color="+s+")";console.log(e)}return null!=s&&"default"!=s||(s=""),s}_computeOsReleaseColor(t){const e=this._config,i=e.os_age?e.os_age:this._colorReleaseDefault;let o="default";if(i.forEach((e=>{if(t===e.os&&(o=e.color,this._showDebug)){const i="_computeOsReleaseColor() - value=["+t+"] matched(os="+e.os+", color="+o+")";console.log(i)}})),this._showDebug){const e="_computeOsReleaseColor() - value=["+t+"] returns(color="+o+")";console.log(e)}return null!=o&&"default"!=o||(o=""),o}_computeDaemonUpdateVersionColor(t){let e;if(e=this.latestDaemonVersions.length>0&&""!=t?this.latestDaemonVersions[0]==t?"default":this.latestDaemonVersions.includes(t)?"orange":"red":"orange",this._showDebug){const i="_computeDaemonUpdateVersionColor() - value=["+t+"] returns(color="+e+")";console.log(i)}return null!=e&&"default"!=e||(e=""),e}_filterUptime(t){const e=t.split(" ");let i=t;if(i.includes(":")){for(let t=0;t<e.length;t++){const i=e[t];if(i.includes(":")){const o=i.split(":"),s=o[0]+"h:"+o[1]+"m";e[t]=s}}i=e.join(" ")}return i}_getAttributeValueForKey(t){let e="";try{if(this.hass&&this._config&&this._configEntityId){const i=this._configEntityId?this.hass.states[this._configEntityId]:void 0;i&&null!=i.attributes&&t in i.attributes&&(e=null==i?void 0:i.attributes[t])}}catch(t){console.error(t)}return e}_emptyCardValuesWhileWaitingForSensor(){const t=this.shadowRoot;if(this._sensorAvailable)if(this._showFullCard)for(const e in this._cardFullCssIDs){const i=this._cardFullCssIDs[e];t.getElementById(i).textContent=""}else for(const e in this._cardGlanceCssIDs){const i=this._cardGlanceCssIDs[e],o=this._cardGlanceElements[e];if(t.getElementById(i).textContent="",o==Vt){t.getElementById(this.kClassIdTempScale).textContent=this._getTemperatureScale()}}}_generateFullsizeCardRows(){const t=[];for(const e in this._cardFullElements){const i=this._cardFullElements[e],o=this._getFullCardValueForAttributeKey(i);let s=this._cardFullIconNames[e];if(i==Nt){const t=this._getAttributeValueForKey(i);s=this._getIconNameForPercent(t)}const n=this._cardFullIconCssIDs[e],r=this._cardFullCssIDs[e];let a="attribute-row";"Model"==e?a="first-short":"Interfaces"==e&&(a="last-short"),t.push(F`
        <div class="${a}">
          <rpi-attribute-row>
            <div class="icon-holder">
              <ha-icon id="${n}" class="attr-icon-full pointer" icon="mdi:${s}"></ha-icon>
            </div>
            <div class="text-content uom">${e}</div>
            <div id="${r}" class="info pointer text-content right attr-value">${o}</div>
          </rpi-attribute-row>
        </div>
      `)}return t}_generateGlanceCardRows(){const t=[];for(const e in this._cardGlanceElements){const i=this._cardGlanceElements[e],o=this._getGlanceCardValueForAttributeKey(i);let s=e;s==this.kREPLACE_WITH_TEMP_UNITS&&(s="n/a"!=o?this._getTemperatureScale():""),i==zt&&(s="% Mem");let n=this._cardGlanceIconNames[e];i==Nt&&(n=this._getIconNameForPercent(o));const r=this._cardGlanceCssIDs[e],a=this._cardGlanceIconCssIDs[e];let l="units";i==Vt&&(l=this.kClassIdTempScale),t.push(F`
        <div class="attributes" tabindex="0">
          <div>
            <ha-icon id="${a}" class="attr-icon" icon="mdi:${n}"></ha-icon>
          </div>
          <div id="${r}" class="attr-value">${o}</div>
          <div id="${l}" class="uom">${s}</div>
        </div>
      `)}return t}_getTemperatureScale(){return 1==this._useTempsInC?"ºC":"ºF"}_getScaledTemperatureValue(t){let e=t;return"n/a"!=e&&0==this._useTempsInC&&(e=(9*parseFloat(t)/5+32).toFixed(1)),e}_getFullCardValueForAttributeKey(t){const e=this._getAttributeValueForKey(t);let i=e;if(t==zt)i=this._getPercentMemoryUsed()+" %";else if(t==Ft)i=this._getUIDateForTimestamp(e);else if(t==Vt){if(i=this._getScaledTemperatureValue(e),"n/a"!=i){i=i+" "+this._getTemperatureScale()}}else if(t==Ot)i=e+" GB";else if(t==Nt)i=e+" %";else if(t==Pt)i=this._filterUptime(i);else if(t==Ht){i=this._getAttributeValueForKey(Mt)+" v"+this._getAttributeValueForKey("ux_version")}else if(t==Rt){const t=[];e.includes("e")&&t.push("Ether"),e.includes("w")&&t.push("WiFi"),e.includes("b")&&t.push("Bluetooth"),i=t.join(", ")}return i}_getGlanceCardValueForAttributeKey(t){const e=this._getAttributeValueForKey(t);let i=e;return t==zt?i=this._getPercentMemoryUsed():t==Ft?i=this._getUIDateForTimestamp(e):t==Vt?i=this._getScaledTemperatureValue(e):t==Pt&&(i=this._filterUptime(i)),i}_getUIDateForTimestamp(t){return new Date(t).toLocaleDateString("en-us")}_getPercentMemoryUsed(){const t=this._getAttributeValueForKey("memory"),e=t.size_mb,i=t.free_mb,o=Number(e);return((e-Number(i))/o*100).toFixed(0).toString()}static get styles(){return r`
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
      .content {
        display: flex;
        justify-content: space-between;
        padding: 16px 32px 24px 32px;
      }
      .content {
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
    `}};t([ot({attribute:!1})],Qt.prototype,"hass",void 0),t([st()],Qt.prototype,"_config",void 0),t([st()],Qt.prototype,"_cardSecondsSinceUpdate",void 0),t([st()],Qt.prototype,"_cardUpdateString",void 0),Qt=t([et("rpi-monitor-card")],Qt);export{Qt as RPiMonitorCard};
