!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.Quote=n():t.Quote=n()}(window,(function(){return function(t){var n={};function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:r})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)e.d(r,o,function(n){return t[n]}.bind(null,o));return r},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="/",e(e.s=0)}([function(t,n,e){e(1).toString();t.exports=Quote},function(t,n,e){var r=e(2);"string"==typeof r&&(r=[[t.i,r,""]]);var o={hmr:!0,transform:void 0,insertInto:void 0};e(4)(r,o);r.locals&&(t.exports=r.locals)},function(t,n,e){(t.exports=e(3)(!1)).push([t.i,".cdx-quote-icon svg {\n  transform: rotate(180deg);\n}\n\n.cdx-code {\n  margin: 0;\n  background: transparent;\n  box-shadow: 0 1px 15px 0px rgba(10, 10, 10, 0.06);\n  border: 1px solid #efefef;\n  display: block;\n  outline: none;\n  font-size: 16px !important;\n  padding: 10px 12px !important;\n  min-height: 50px;\n  margin-bottom: 20px;\n}\n\n.cdx-code__input {\n  width: 100%;\n  outline: none;\n  box-sizing: border-box;\n}\n\n.cdx-code__text {\n  margin-bottom: 1px;\n}\n\n.cdx-code-settings {\n  display: flex;\n}\n\n.cdx-code-settings .cdx-settings-button {\n  width: 50%;\n}\n\n.cdx-code-lang_input {\n  outline: none;\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  font-variant: tabular-nums;\n  list-style: none;\n  font-feature-settings: 'tnum';\n  position: relative;\n  display: inline-block;\n  width: 100%;\n  height: 32px;\n  padding: 4px 11px;\n  color: rgba(0,0,0,0.65);\n  font-size: 14px;\n  line-height: 1.2;\n  background-color: #f1f3f7;\n  background-image: none;\n  border: 1px solid #eaeaea;\n  margin: 8px 5px 0px 5px;\n  border-radius: 4px;\n  -webkit-transition: all .3s;\n  transition: all .3s;\n}\n",""])},function(t,n){t.exports=function(t){var n=[];return n.toString=function(){return this.map((function(n){var e=function(t,n){var e=t[1]||"",r=t[3];if(!r)return e;if(n&&"function"==typeof btoa){var o=(a=r,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */"),i=r.sources.map((function(t){return"/*# sourceURL="+r.sourceRoot+t+" */"}));return[e].concat(i).concat([o]).join("\n")}var a;return[e].join("\n")}(n,t);return n[2]?"@media "+n[2]+"{"+e+"}":e})).join("")},n.i=function(t,e){"string"==typeof t&&(t=[[null,t,""]]);for(var r={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(r[i]=!0)}for(o=0;o<t.length;o++){var a=t[o];"number"==typeof a[0]&&r[a[0]]||(e&&!a[2]?a[2]=e:e&&(a[2]="("+a[2]+") and ("+e+")"),n.push(a))}},n}},function(t,n,e){var r,o,i={},a=(r=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===o&&(o=r.apply(this,arguments)),o}),s=function(t){return document.querySelector(t)},u=function(t){var n={};return function(t){if("function"==typeof t)return t();if(void 0===n[t]){var e=s.call(this,t);if(window.HTMLIFrameElement&&e instanceof window.HTMLIFrameElement)try{e=e.contentDocument.head}catch(t){e=null}n[t]=e}return n[t]}}(),f=null,c=0,l=[],p=e(5);function d(t,n){for(var e=0;e<t.length;e++){var r=t[e],o=i[r.id];if(o){o.refs++;for(var a=0;a<o.parts.length;a++)o.parts[a](r.parts[a]);for(;a<r.parts.length;a++)o.parts.push(x(r.parts[a],n))}else{var s=[];for(a=0;a<r.parts.length;a++)s.push(x(r.parts[a],n));i[r.id]={id:r.id,refs:1,parts:s}}}}function b(t,n){for(var e=[],r={},o=0;o<t.length;o++){var i=t[o],a=n.base?i[0]+n.base:i[0],s={css:i[1],media:i[2],sourceMap:i[3]};r[a]?r[a].parts.push(s):e.push(r[a]={id:a,parts:[s]})}return e}function h(t,n){var e=u(t.insertInto);if(!e)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=l[l.length-1];if("top"===t.insertAt)r?r.nextSibling?e.insertBefore(n,r.nextSibling):e.appendChild(n):e.insertBefore(n,e.firstChild),l.push(n);else if("bottom"===t.insertAt)e.appendChild(n);else{if("object"!=typeof t.insertAt||!t.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var o=u(t.insertInto+" "+t.insertAt.before);e.insertBefore(n,o)}}function v(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t);var n=l.indexOf(t);n>=0&&l.splice(n,1)}function m(t){var n=document.createElement("style");return void 0===t.attrs.type&&(t.attrs.type="text/css"),g(n,t.attrs),h(t,n),n}function g(t,n){Object.keys(n).forEach((function(e){t.setAttribute(e,n[e])}))}function x(t,n){var e,r,o,i;if(n.transform&&t.css){if(!(i=n.transform(t.css)))return function(){};t.css=i}if(n.singleton){var a=c++;e=f||(f=m(n)),r=j.bind(null,e,a,!1),o=j.bind(null,e,a,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(e=function(t){var n=document.createElement("link");return void 0===t.attrs.type&&(t.attrs.type="text/css"),t.attrs.rel="stylesheet",g(n,t.attrs),h(t,n),n}(n),r=O.bind(null,e,n),o=function(){v(e),e.href&&URL.revokeObjectURL(e.href)}):(e=m(n),r=U.bind(null,e),o=function(){v(e)});return r(t),function(n){if(n){if(n.css===t.css&&n.media===t.media&&n.sourceMap===t.sourceMap)return;r(t=n)}else o()}}t.exports=function(t,n){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(n=n||{}).attrs="object"==typeof n.attrs?n.attrs:{},n.singleton||"boolean"==typeof n.singleton||(n.singleton=a()),n.insertInto||(n.insertInto="head"),n.insertAt||(n.insertAt="bottom");var e=b(t,n);return d(e,n),function(t){for(var r=[],o=0;o<e.length;o++){var a=e[o];(s=i[a.id]).refs--,r.push(s)}t&&d(b(t,n),n);for(o=0;o<r.length;o++){var s;if(0===(s=r[o]).refs){for(var u=0;u<s.parts.length;u++)s.parts[u]();delete i[s.id]}}}};var y,w=(y=[],function(t,n){return y[t]=n,y.filter(Boolean).join("\n")});function j(t,n,e,r){var o=e?"":r.css;if(t.styleSheet)t.styleSheet.cssText=w(n,o);else{var i=document.createTextNode(o),a=t.childNodes;a[n]&&t.removeChild(a[n]),a.length?t.insertBefore(i,a[n]):t.appendChild(i)}}function U(t,n){var e=n.css,r=n.media;if(r&&t.setAttribute("media",r),t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}function O(t,n,e){var r=e.css,o=e.sourceMap,i=void 0===n.convertToAbsoluteUrls&&o;(n.convertToAbsoluteUrls||i)&&(r=p(r)),o&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var a=new Blob([r],{type:"text/css"}),s=t.href;t.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s)}},function(t,n){t.exports=function(t){var n="undefined"!=typeof window&&window.location;if(!n)throw new Error("fixUrls requires window.location");if(!t||"string"!=typeof t)return t;var e=n.protocol+"//"+n.host,r=e+n.pathname.replace(/\/[^\/]*$/,"/");return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(t,n){var o,i=n.trim().replace(/^"(.*)"$/,(function(t,n){return n})).replace(/^'(.*)'$/,(function(t,n){return n}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(i)?t:(o=0===i.indexOf("//")?i:0===i.indexOf("/")?e+i:r+i.replace(/^\.\//,""),"url("+JSON.stringify(o)+")")}))}}])}));