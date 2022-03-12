"use strict";function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _classPrivateFieldInitSpec(a,b,c){_checkPrivateRedeclaration(a,b),b.set(a,c)}function _checkPrivateRedeclaration(a,b){if(b.has(a))throw new TypeError("Cannot initialize the same private elements twice on an object")}function _classPrivateFieldGet(a,b){var c=_classExtractFieldDescriptor(a,b,"get");return _classApplyDescriptorGet(a,c)}function _classApplyDescriptorGet(a,b){return b.get?b.get.call(a):b.value}function _classPrivateFieldSet(a,b,c){var d=_classExtractFieldDescriptor(a,b,"set");return _classApplyDescriptorSet(a,d,c),c}function _classExtractFieldDescriptor(a,b,c){if(!b.has(a))throw new TypeError("attempted to "+c+" private field on non-instance");return b.get(a)}function _classApplyDescriptorSet(a,b,c){if(b.set)b.set.call(a,c);else{if(!b.writable)throw new TypeError("attempted to set read only private field");b.value=c}}var _dStyle=new WeakMap,_environments=new WeakMap,_config=new WeakMap,_logoSrc=new WeakMap,Ourpass=function(){function a(){_classCallCheck(this,a),_classPrivateFieldInitSpec(this,_dStyle,{writable:!0,value:void 0}),_classPrivateFieldInitSpec(this,_environments,{writable:!0,value:void 0}),_classPrivateFieldInitSpec(this,_config,{writable:!0,value:void 0}),_classPrivateFieldInitSpec(this,_logoSrc,{writable:!0,value:void 0}),_classPrivateFieldSet(this,_dStyle,{ourpassParentModal:"\n        position: fixed;\n        z-index: 99999;\n        top: 0;\n        bottom: 0;\n        left: 0;\n        right: 0;\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        background-color: rgba(0,0,0,0.85);\n      ",ourpassLoaderWrapper:"\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        justify-content: center;\n      ",ourpassLoaderImg:"\n        height: 80px;\n        width: 80px;\n        animation: loader 1s 1s infinite;\n        display: block;\n      ",ourpassLoaderCloseSpan:"\n        display: block;\n        cursor: pointer;\n        font-weight: 900;\n        color: #fff;\n        margin-top: 30px;\n        text-decoration: underline;\n      ",ourPassContentModal:"\n        position: relative;\n        background-color: rgb(254, 254, 254);\n        margin: auto;\n        display: none;\n        justify-content: center;\n        align-items: center;\n        border-radius: 5px;\n        width: calc(100% - 50px) !important;\n        height: 95% !important;\n        max-width: 385px !important;\n        max-height: 630px !important;\n      ",ourpassIframe:"\n        display: none;\n        border: none;\n        height: 100% !important;\n        width: 100% !important;\n        z-index: 99999;\n        border-radius: 5px;\n      "}),_classPrivateFieldSet(this,_logoSrc,"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgaWQ9InN2ZzEwIgogICB2ZXJzaW9uPSIxLjEiCiAgIGZpbGw9Im5vbmUiCiAgIHZpZXdCb3g9IjAgMCAxNjcgMTY3IgogICBoZWlnaHQ9IjE2NyIKICAgd2lkdGg9IjE2NyI+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMTYiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxNCIgLz4KICA8Y2lyY2xlCiAgICAgaWQ9ImNpcmNsZTIiCiAgICAgZmlsbD0iIzFEQkM4NiIKICAgICByPSI4My41IgogICAgIGN5PSI4My41IgogICAgIGN4PSI4My41IiAvPgogIDxwYXRoCiAgICAgaWQ9InBhdGg0IgogICAgIGZpbGw9IiM5QkRGQzgiCiAgICAgZD0iTTU1LjM1MTYgODkuMTQwNEw4OS4yNjI5IDU1LjI2MDlWODkuMTQwNEg1NS4zNTE2WiIKICAgICBjbGlwLXJ1bGU9ImV2ZW5vZGQiCiAgICAgZmlsbC1ydWxlPSJldmVub2RkIgogICAgIG9wYWNpdHk9IjAuNSIgLz4KICA8cGF0aAogICAgIGlkPSJwYXRoNiIKICAgICBmaWxsPSJ3aGl0ZSIKICAgICBkPSJNNjMuODMyIDEyMy4wNTRMMTIwLjM0IDY2LjU0NTdWMTIzLjA1NEg2My44MzJaIgogICAgIGNsaXAtcnVsZT0iZXZlbm9kZCIKICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiIC8+CiAgPHBhdGgKICAgICBpZD0icGF0aDgiCiAgICAgZmlsbD0id2hpdGUiCiAgICAgZD0iTTQ2Ljg3ODkgNjYuNTQ1M0w2OS40NzU5IDQzLjk0ODRWNjYuNTQ1M0g0Ni44Nzg5WiIKICAgICBjbGlwLXJ1bGU9ImV2ZW5vZGQiCiAgICAgZmlsbC1ydWxlPSJldmVub2RkIiAvPgo8L3N2Zz4K"),_classPrivateFieldSet(this,_environments,{sandbox:{baseUrl:"https://merchant-sandbox.ourpass.co"},production:{baseUrl:"https://merchant.ourpass.co"}}),_classPrivateFieldSet(this,_config,{})}return _createClass(a,[{key:"handleIframeLoaded",value:function handleIframeLoaded(){this.removeEventListener("load",this.handleIframeLoaded,!0),document.getElementById("ourpassLoaderWrapper").style.display="none",document.getElementById("dFrame").style.display="block",document.getElementById("ourPassContentModal").style.display="block",document.getElementById("ourpassParentModal").onclick=function(){document.getElementById("ourPassContentModal").animate([{transform:"scale(1)"},{transform:"scale(1.02)"},{transform:"scale(1)"}],{duration:200})}}},{key:"handleAnimation",value:function handleAnimation(){var a=document.getElementById("ourpassLoaderImg");a||(this.createAnElement("ourpassParentModal","div",["ourpassLoaderWrapper"],_classPrivateFieldGet(this,_dStyle).ourpassLoaderWrapper),this.createAnElement("ourpassLoaderWrapper","img",["ourpassLoaderImg"],_classPrivateFieldGet(this,_dStyle).ourpassLoaderImg),this.createAnElement("ourpassLoaderWrapper","span",["ourpassLoaderCloseSpan",["onclick","OurpassCheckout.g()"]],_classPrivateFieldGet(this,_dStyle).ourpassLoaderCloseSpan,"cancel checkout"),document.getElementById("ourpassLoaderImg").setAttribute("src",_classPrivateFieldGet(this,_logoSrc))),document.getElementById("ourpassLoaderImg").style.display="block",document.getElementById("ourpassLoaderImg").animate([{transform:"scale(0.7)"},{transform:"scale(0.8)"},{transform:"scale(0.7)"}],{duration:1e3,iterations:1/0})}},{key:"generateIframeSrc",value:function generateIframeSrc(){var a=this.clientInfo.items?JSON.stringify(this.clientInfo.items):"",b=this.clientInfo.metadata?JSON.stringify(this.clientInfo.metadata):"",c=new URL("".concat(_classPrivateFieldGet(this,_config).baseUrl,"/checkout/"));return c.searchParams.append("src",this.clientInfo.src),c.searchParams.append("items",a),c.searchParams.append("metadata",b),c.searchParams.append("amount",this.clientInfo.amount),c.searchParams.append("url",this.clientInfo.url),c.searchParams.append("name",this.clientInfo.name),c.searchParams.append("email",this.clientInfo.email),c.searchParams.append("qty",this.clientInfo.qty),c.searchParams.append("description",this.clientInfo.description),c.searchParams.append("api_key",this.clientInfo.api_key),c.searchParams.append("reference",this.clientInfo.reference),c.searchParams.append("cdn_version","01-03-2022"),c.toString()}},{key:"g",value:function g(){this.removeElement("ourpassParentModal");var a=document.body.style.top;document.body.style.position="",document.body.style.top="",window.scrollTo(0,-1*parseInt(a||"0")),this.clientInfo.onClose()}},{key:"closeOnModal",value:function closeOnModal(){event.target==document.getElementById("ourpassParentModal")&&this.g()}},{key:"createAnElement",value:function createAnElement(a,b,c,d){var e=4<arguments.length&&void 0!==arguments[4]?arguments[4]:null,f=document.createElement(b);if(f.style.cssText=d,e&&(f.innerHTML=e),f.setAttribute("id",c[0]),1<c.length&&f.setAttribute("".concat(c[1][0]),"".concat(c[1][1])),a instanceof HTMLElement)a.appendChild(f);else if("pass"==a){var g=document.getElementById("button").parentNode;g.appendChild(f)}else document.getElementById(a).appendChild(f);return f}},{key:"removeElement",value:function removeElement(a){a instanceof HTMLElement||(a=document.getElementById(a)),a&&a.parentNode&&a.parentNode.removeChild(a)}},{key:"openIframe",value:function openIframe(a){var b=this,c=document.getElementById("ourpassParentModal");switch(!c||c.remove(),this.clientInfo=a,a.env){case"sandbox":_classPrivateFieldSet(this,_config,_classPrivateFieldGet(this,_environments).sandbox);break;case"production":_classPrivateFieldSet(this,_config,_classPrivateFieldGet(this,_environments).production);break;default:_classPrivateFieldSet(this,_config,_classPrivateFieldGet(this,_environments).production);}c=this.createAnElement(document.getElementsByTagName("body")[0],"div",["ourpassParentModal"],_classPrivateFieldGet(this,_dStyle).ourpassParentModal),document.body.style.position="fixed",document.body.style.top="-".concat(window.scrollY,"px");this.createAnElement("ourpassParentModal","div",["ourPassContentModal"],_classPrivateFieldGet(this,_dStyle).ourPassContentModal);this.handleAnimation();var d=this.createAnElement("ourPassContentModal","iframe",["dFrame",["src",this.generateIframeSrc()]],_classPrivateFieldGet(this,_dStyle).ourpassIframe);d.addEventListener("load",this.handleIframeLoaded,!0),window.addEventListener("message",function(a){_classPrivateFieldGet(b,_config).baseUrl===a.origin&&("false pass"==a.data&&b.g(),"closeiframe"==a.data&&b.g(),"false pass1"==a.data&&(b.removeElement(c),b.clientInfo.onSuccess(b.clientInfo)))})}}]),a}();window.OurpassCheckout=new Ourpass;