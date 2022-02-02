(()=>{"use strict";function e(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function t(t,n){return function(e){if(Array.isArray(e))return e}(t)||function(e,t){var n=e&&("undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"]);if(null!=n){var r,i,c=[],s=!0,o=!1;try{for(n=n.call(e);!(s=(r=n.next()).done)&&(c.push(r.value),!t||c.length!==t);s=!0);}catch(e){o=!0,i=e}finally{try{s||null==n.return||n.return()}finally{if(o)throw i}}return c}}(t,n)||function(t,n){if(t){if("string"==typeof t)return e(t,n);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?e(t,n):void 0}}(t,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(e,t){return(n=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function r(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function i(e,t,c){return(i=r()?Reflect.construct:function(e,t,r){var i=[null];i.push.apply(i,t);var c=new(Function.bind.apply(e,i));return r&&n(c,r.prototype),c}).apply(null,arguments)}function c(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var s=function e(t,n,r,i,s,o,a,u){c(this,e),this.id=t,this.name=n,this.servings=r,this.ingredients=i,this.time=s,this.description=o,this.appliance=a,this.ustensils=u};function o(){this.create=function(e,t){for(var n=arguments.length,r=new Array(n>2?n-2:0),c=2;c<n;c++)r[c-2]=arguments[c];return i(s,[e,t].concat(r))}}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&n(e,t)}function u(e){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function f(e,t){return!t||"object"!==u(t)&&"function"!=typeof t?l(e):t}function d(e){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function p(e){var t="function"==typeof Map?new Map:void 0;return(p=function(e){if(null===e||(r=e,-1===Function.toString.call(r).indexOf("[native code]")))return e;var r;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,c)}function c(){return i(e,arguments,d(this).constructor)}return c.prototype=Object.create(e.prototype,{constructor:{value:c,enumerable:!1,writable:!0,configurable:!0}}),n(c,e)})(e)}function h(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=d(e);if(t){var i=d(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return f(this,n)}}var v=function(e){a(n,e);var t=h(n);function n(){var e;c(this,n);(e=t.call(this)).setAttribute("class","main-search"),e.innerHTML='<div class="input-group d-inline m-0">\n                <div class="form-outline d-flex flex-row">\n                    <input type="search" id="main-search-input" class="form-control rounded" placeholder="'.concat("Rechercher un ingrédient, appareil, ustensile ou une recette",'" aria-label="Search" aria-describedby="search-addon"/>\n                    <label class="form-label visuallyHidden" for="main-search-input">Search</label>\n                    <span class="icon-search input-group-text border-0" id="search-addon">\n                        <i class="fas fa-search"></i>\n                    </span>\n                    <span class="icon-search input-group-text border-0" id="reset-search-icon">\n                        <i class="fa fa-times-circle-o"></i>\n                    </span>\n                </div>\n            </div>\n            ');var r=e.querySelector("#main-search-input"),i=e.querySelector("#search-addon");i.classList.add("d-inline-block");var s=e.querySelector("#reset-search-icon");s.style.display="none";var o=function(){var e=document.querySelector("#tagsWrapper");return!(!e||!e.hasChildNodes())};s.addEventListener("click",(function(e){o()?function(e){r.value=e.target,r.value=""}(e):$.resetSearch()}));var a=e.querySelector(".form-outline"),u=document.createElement("div");u.setAttribute("id","main-suggestions"),u.setAttribute("class","main-suggestions"),a.appendChild(u);var l="",f=!1;function d(){$.removeNoResults(),$.removeResultsBlock(),f&&!l&&r==document.activeElement&&(console.log("NEW SEARCH PENDING"),o()?$.resetToAdvSearchResults():($.resetAllForNewSearch(),$.resetDefaultView()))}return r.addEventListener("input",(function(e){l=e.target.value.toLowerCase(),console.log("currentSearchTerm=>",l)," "===l&&(l="-"),$.processCurrentMainSearch(l),f=!0,d()}),!1),r.addEventListener("keydown",(function(e){l=e.target.value.toLowerCase(),"Backspace"===e.key&&d(),"Enter"===e.key&&($.confirmCurrentChars(),i.classList.remove("d-inline-block"),i.style.display="none",s.style.display="inline-block")}),!1),i.addEventListener("click",(function(){l=r.value,$.confirmCurrentChars(),i.classList.remove("d-inline-block"),i.style.display="none",s.style.display="inline-block"}),!1),e}return n}(p(HTMLElement));function y(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=d(e);if(t){var i=d(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return f(this,n)}}customElements.define("searchbar-component",v);var g=function(e){a(n,e);var t=y(n);function n(e){var r;return c(this,n),(r=t.call(this)).innerHTML="\n\n            <li>\n                <a>".concat(e,"</a>\n            </li>\n        "),r}return n}(p(HTMLElement));function m(e){return e=E(e=S(e=e.toLowerCase()))}function b(e){var t=/[']|\s/g,n=[];if(t.test(e)){var r=e.replace(/(\b(\w{1,3})\b(\s|$))/g,"").split(t),i=e.replace(/[']|\s/g,"-");return r.concat(i)}return n.push(e),n}function S(e){var t=/[çèéêëîïâàä]/g;if(t.test(e)){var n=e.search(t);return/[èéêë]/g.test(e.charAt(n))?e=e.replace(e.charAt(n),"e"):/[îï]/g.test(e.charAt(n))?e=e.replace(e.charAt(n),"i"):/[âàä]/g.test(e.charAt(n))?e=e.replace(e.charAt(n),"a"):/[ç]/g.test(e.charAt(n))&&(e=e.replace(e.charAt(n),"c")),S(e)}return e}function E(e){return e.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ")}function A(e,t){if(!e.find((function(e){return e===t}))&&!e.find((function(e){return e===t.concat("s")}))){var n=e.find((function(e){return e===t.substring(0,t.length-1)}));if(n){var r=e.indexOf(n);e.splice(r,1,t)}else t=t.toLowerCase(),e.push(t)}}customElements.define("menu-list-item-component",g);var R=[];function w(e,n,r){console.log("AVDVANCED SEARCH: SEARCHTERM ====> ",n),n=m(n),R=[],"appareils"===r&&(r="appliance"),e.forEach((function(e){for(var i=0,c=Object.keys(e);i<c.length;i++){var s=c[i];if(s===r){if("ingredients"===s)return e.ingredients.forEach((function(r){for(var i=0,c=Object.entries(r);i<c.length;i++){var s=t(c[i],2),o=s[0],a=s[1];if("ingredient"===o){var u=m(a);(u===n||u.includes(n))&&(R.includes(e)||R.push(e))}}})),R;if("appliance"===s){var o=e.appliance;return((o=m(o))===n||o.includes(n))&&(R.includes(e)||R.push(e)),R}if("ustensils"===s)return e.ustensils.forEach((function(t){((t=m(t))===n||t.includes(n))&&(R.includes(e)||R.push(e))})),R}}})),$.setResults(R)}function C(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=d(e);if(t){var i=d(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return f(this,n)}}var O=function(e){a(n,e);var t=C(n);function n(e,r){var i;c(this,n),(i=t.call(this)).innerHTML='\n            \n            <div class="menu-header closed" id="menu-header-close-'.concat(e,'" isActive="false">\n                <button class="btn"\n                        id="btn-').concat(e,'" \n                        type="button" \n                        aria-expanded="false"\n                        aria-controls="').concat(e,'">').concat(e,'\n                </button>\n                <i id="caret-down" class="fas fa-angle-down"></i>\n            </div>\n\n            <div class="menu-header open" id="menu-header-open-').concat(e,'" isActive="true">\n                <input id="searchInto-').concat(e,'" class="searchInput" placeholder="rechercher un ').concat(e,'">\n                <i id="caret-up" class="fas fa-angle-up"></i>\n            </div>\n\n            <div class="collapse multi-collapse category-menu" id="menu-').concat(e,'" isOpen="false">\n                <div class="card card-body" id="body-items">\n                    <ul id="').concat(e,'-list" class="list">\n                    </ul>\n                </div>\n                <div class="card card-body" id="').concat(e,'-input-suggestions">\n                    <ul id="').concat(e,'-suggestions-list" class="list suggestions-list">\n                    </ul>\n                </div>\n            </div>\n        '),i.setAttribute("isActive","false"),i.setAttribute("id","collapsing-"+e);var s,o=l(i),a=i.querySelector("#menu-header-close-"+e),u=i.querySelector("#menu-header-open-"+e),f=i.querySelector("#menu-"+e),d=i.querySelector("#caret-up"),p=[],h=i.querySelector("#body-items"),v=i.querySelector("#"+e+"-input-suggestions"),y=document.querySelector(".adv-search-wrapper");y.classList.add("row","col-12","col-lg-6"),o.setAttribute("class","col");var m=i.querySelector("#"+e+"-list");r.forEach((function(e){var t=new g(e);t.addEventListener("click",(function(e){w(e)}),!1),m.appendChild(t)})),u.style.display="none";var b=i.querySelector("#"+e+"-input-suggestions");b.style.display="none",a.addEventListener("click",(function(e){!function(e){b.style.display="none",O(),h.style.display="flex",a=e.currentTarget,e.stopPropagation(),$.checkWhosOpen(),o.removeAttribute("isActive","false"),o.setAttribute("isActive","true"),s=o;var t=o.querySelector("input");t.value&&(t.value="");a.style.display="none",u.style.display="flex",f.style.display="flex",d.addEventListener("click",(function(e){!function(e){d=e.currentTarget,e.stopPropagation(),u.style.display="none",a.style.display="flex",f.style.display="none",o.removeAttribute("isActive","true"),o.setAttribute("isActive","false"),y.classList.replace("col-lg-10","col-lg-6"),y.classList.remove("col-lg-offset-2"),o.classList.remove("col-12"),o.classList.replace("col-lg-8","col")}(e)}),!1),function(e){y.classList.replace("col-lg-6","col-lg-10"),y.classList.add("col-lg-offset-2"),e.classList.add("col-12"),e.classList.replace("col","col-lg-8")}(s)}(e)}),!1);var S=i.querySelector("#searchInto-"+e),A="",R=!1;function w(t){var n=t.target.innerText;document.querySelector("#searchInto-"+e).value=n,C(t)}function C(e){A=e.target.value;var t=(S=e.target).getAttribute("id");if((t=t.slice(11,t.length),R=!0,"Enter"===e.key)&&($.processAdvancedSearch(A,t),!L().includes(A))){var n=function(e){var t=document.createElement("div");t.setAttribute("class","searchTag"),t.setAttribute("id","searchTag-"+e);var n=document.createElement("i");n.setAttribute("class","fa fa-times-circle-o"),n.setAttribute("id","close-"+e),/\((.*)\)/.test(e)&&E(e);var r=document.createTextNode(e);return t.appendChild(r),t.appendChild(n),n.addEventListener("click",(function(e){j(e)}),!1),t}(A);!function(){if(y.contains(document.querySelector("#tagsWrapper")))return;var e=document.createElement("div");e.setAttribute("id","tagsWrapper"),e.setAttribute("class","tagsWrapper"),y.prepend(e)}(),document.querySelector("#tagsWrapper").appendChild(n),k(A),d.click()}}function O(e){for(;b.firstChild;)b.removeChild(b.firstChild);if(e)for(;e.length>0;)e.pop()}S.addEventListener("input",(function(e){!function(e){A=e.target.value;var t=(S=e.target).getAttribute("id");t=t.slice(11,t.length),3===A.length&&function(e,t){var n=[];"appliance"===t&&(t="appareils");document.querySelector("#"+t+"-list").querySelectorAll("a").forEach((function(e){n.push(e.innerText)})),function(e){O(),h.style.display="none",v.style.display="flex",e.forEach((function(e){var t=new g(e);t.addEventListener("click",(function(e){w(e)}),!1),b.appendChild(t)}))}(function(e,t,n){var r=[],i=/\.|,$/i;return n.forEach((function(t){if(t=t.toLowerCase(),i.test(t))return t.substring(0,t.length-1);t.includes(e.toLowerCase())&&(r.includes(t)||r.push(t))})),r}(e,0,n))}(A,t);R=!0,R&&!A&&S==document.activeElement&&(n=[],$.removeNoResults(),$.removeResultsBlock(),O(n),b.style.display="none",h.style.display="flex");var n}(e)}),!1),S.addEventListener("keydown",(function(e){C(e)}),!1);var T,k=function(e){p.push(e)},L=function(){return p};function j(t){t.stopPropagation();document.querySelector("#close-"+A);var n,r,i=t.currentTarget.parentNode;document.querySelector("#tagsWrapper").removeChild(i),n=i.textContent,r=p.indexOf(n),p.splice(r,1),(p=L()).forEach((function(t){$.processAdvancedSearch(t,e)})),document.querySelector("#tagsWrapper").hasChildNodes()||(T=!0),T&&$.handleAdvancedSearchReset()}return i}return n}(p(HTMLElement));function T(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=d(e);if(t){var i=d(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return f(this,n)}}customElements.define("collapsing-menu-component",O);var k=function(e){a(n,e);var t=T(n);function n(e){var r;c(this,n),(r=t.call(this)).setAttribute("class","col col-xl-4"),r.innerHTML='\n            <div class="card recipe-card col col m-0 p-0">\n                <img src="" class="card-img-top" alt="">\n                <div class="card-body">\n                    <div class="card-header-recipe row">\n                        <h5 class="card-title col-10 m-0 p-0">'.concat(e.name,'</h5>\n                        <div class="card-time col-2 m-0 p-0">\n                            <i class="far fa-clock m-0 p-0"></i>\n                            <h5 class="time m-0 p-0">').concat(e.time,'min</h5>\n                        </div>\n                    </div>\n                    <div class="recipe-description row">\n                        <ul id="ingredients-list" class="ingredients-list col m-0 p-0">\n                        </ul>\n                        <div class="recipe-txt col m-0 p-0">\n                            <p class="m-0">').concat(e.description,"</p>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            ");var i=r.querySelector("#ingredients-list");return e.ingredients.forEach((function(e){var t=document.createElement("li"),n=document.createTextNode(e.ingredient);e.quantity&&(n.textContent+=": "+e.quantity),e.unit&&("g"===e.unit||"ml"===e.unit?n.textContent+=""+e.unit:n.textContent+=" "+e.unit),t.appendChild(n),i.appendChild(t)})),r}return n}(p(HTMLElement));function L(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=d(e);if(t){var i=d(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return f(this,n)}}customElements.define("card-component",k);var j=function(e){a(n,e);var t=L(n);function n(){var e;return c(this,n),(e=t.call(this)).innerHTML='\n        <div id="header-wrapper" class="header-wrapper d-flex flex-col align-items-center justify-content-center">\n            <header class="header" role="banner" id="header">\n                <div id="header__logo-wrapper" class="header__logo-wrapper text-center" tabindex="0">\n                    <a href="" aria-label="Les petits plats homepage"><img src="./assets/icons/toque.png" alt="Les petits plats logo"></a>\n                    <h1>Les petits plats</h1>\n                </div>\n            </header>\n        </div>\n        ',e.querySelector("#header__logo-wrapper").addEventListener("focus",(function(e){var t=e.target;t==document.activeElement&&t.addEventListener("keydown",(function(e){13===e.keyCode&&t.firstElementChild.click()}),!1)}),!1),e}return n}(p(HTMLElement));function q(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return x(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return x(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var c,s=!0,o=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return s=e.done,e},e:function(e){o=!0,c=e},f:function(){try{s||null==n.return||n.return()}finally{if(o)throw c}}}}function x(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}customElements.define("header-template-component",j);var I,N,M=window.localStorage,B=0,W=function e(){c(this,e),this.id=B++,this.keys=new Map,this.parent=null,this.wordIsComplete=!1,this.setEndOfAword=function(){this.wordIsComplete=!0},this.isEndOfAword=function(){return this.wordIsComplete},this.isASubtree=!1,this.setIsASubtree=function(){this.isASubtree=!0,this.isALeaf=!1},this.IsASubtree=function(){return this.isASubtree},this.isALeaf=function(){return 0===this.keys.size},this.visited=!1,this.parentRecipeObjects=new Map,this.getWord=function(e){for(var t=[];null!==e;)t.unshift(e.keys.keys),e=e.parent;return t.join("")}},H=function e(){c(this,e),this.root=new W;var n,r,i,s,o=[],a="";this.setCurrentWord=function(e){a=e},this.getCurrentWord=function(){return a},this.setCurrentRecipeObject=function(e){n=e},this.getCurrentRecipeObject=function(){return n},this.setTrieResults=function(e){this.results=e},this.resetTrieResults=function(){this.results=[]},this.getTrieResults=function(){return this.results},this.setTrieSuggestions=function(e){this.suggestions=e},this.resetTrieSuggestions=function(){this.suggestions=[]},this.getTrieSuggestions=function(){return this.suggestions},this.add=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.root;if(0!==e.length){if(t.keys.has(e[0])){if(t.keys.size>1){t.setIsASubtree();var n=this.getCurrentRecipeObject(),r=[],i=this.getCurrentWord();t.parentRecipeObjects.set(i,r),r.push(n)}return this.add(e.substring(1),t.keys.get(e[0]))}return t.keys.set(e[0],new W),this.add(e.substring(1),t.keys.get(e[0]))}t.setEndOfAword();var c=this.getCurrentWord();if(t.parentRecipeObjects.has(c)){if(t.parentRecipeObjects.has(c)){var s=t.parentRecipeObjects.get(c),o=this.getCurrentRecipeObject();s.push(o)}}else{var a=[];t.parentRecipeObjects.set(c,a);var u=this.getCurrentRecipeObject();a.push(u)}},this.contains=function(e){for(var t=this.root;e.length>1;){if(!t.keys.has(e[0]))return!1;t=t.keys.get(e[0]),e=e.substr(1)}return t.keys.has(e)&&t.keys.get(e).isEndOfAword()},this.print=function(){var e=new Array;return function t(n,r){if(0!==n.keys.size){var i,c=q(n.keys.keys());try{for(c.s();!(i=c.n()).done;){var s=i.value;t(n.keys.get(s),r.concat(s))}}catch(e){c.e(e)}finally{c.f()}n.isEndOfAword()&&e.push(r),n.parentRecipeObjects.size>0&&e.push(n.parentRecipeObjects)}else r.length>0&&e.push(r)}(this.root,new String),e.length>0?e:null},this.searchElementInTrie=function(e){var t,n;console.log("MAIN SEARCH : WE ARE LOOKING FOR ====>,",e),this.resetTrieSuggestions(),this.resetTrieResults();var c="",s=[];o=[],s=[],void 0===t&&(t=this.root);for(var a=e.split(""),u=0;u<a.length;u++){var l=a[u];if(!t.keys.has(l))return console.log("NO MATCH"),this.setTrieResults([]),void this.setTrieSuggestions([]);t=t.keys.get(l),c+=l,(i=performance.now())-r>0&&console.log("======= TRIE MATCH FOUND FOR ",c," TOOK",i-r,"milliseconds"),t.isEndOfAword()&&t.parentRecipeObjects.size>0&&s.push(t.parentRecipeObjects),this.setTrieResults(s),s=[],n=t,o=this.goToLastNode(n),this.setTrieSuggestions(o)}e="",a=[]},this.goToLastNode=function e(n){if(o=[],n.keys.size>=1){var r,i=q(n.keys);try{for(i.s();!(r=i.n()).done;){var c=t(r.value,2),a=c[0],u=c[1];a,(s=u).parentRecipeObjects.size>0&&(o.includes(n.parentRecipeObjects.has(n.parentRecipeObjects.key))||o.push(n.parentRecipeObjects)),e(s)}}catch(e){i.e(e)}finally{i.f()}}return n.parentRecipeObjects.size>0&&(o.includes(n.parentRecipeObjects.has(n.parentRecipeObjects.key))||o.push(n.parentRecipeObjects)),o}};function P(e,t){var n=new H;return e.forEach((function(e){var t,r=e.name,i=b(r=m(r));n.setCurrentWord(r),n.setCurrentRecipeObject(e),i.forEach((function(e){n.add(e,t)})),e.ingredients.forEach((function(r){var i=r.ingredient,c=b(i=m(i));n.setCurrentWord(i),n.setCurrentRecipeObject(e),c.forEach((function(e){n.add(e,t)}))}));var c=e.appliance,s=b(c=m(c));n.setCurrentWord(c),n.setCurrentRecipeObject(e),s.forEach((function(e){n.add(e,t)})),e.ustensils.forEach((function(r){var i=b(r=m(r));n.setCurrentWord(r),n.setCurrentRecipeObject(e),i.forEach((function(e){n.add(e,t)}))}))})),t?(!function(e){N=e,M.setItem("partialTrie",N)}(n),console.log("PARTIAL TRIE ===",n.print())):(I=n,M.setItem("recipesTrie",I),console.log("ALL RECIPES TRIE ===",n.print())),n}function _(){return I}function z(){return N}function F(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return D(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return D(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var c,s=!0,o=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return s=e.done,e},e:function(e){o=!0,c=e},f:function(){try{s||null==n.return||n.return()}finally{if(o)throw c}}}}function D(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var $=function(){var e=document.querySelector("#root"),n=[],r=[],i=[],c=[],s=[],a=[],u=!1,l=window.localStorage;fetch("./assets/data.json").then((function(e){var t=e.headers.get("content-type");if(!t||!t.includes("application/json"))throw new TypeError("no JSON content was found!");return e.json()})).then((function(t){t.recipes.map((function(e){n.push(e)})),function(t){var n=new j;document.body.insertBefore(n,e),i=new v,e.appendChild(i),function(t){var n=new o;t.forEach((function(e){var i=n.create(e.id,e.name,e.servings,e.ingredients,e.time,e.description,e.appliance,e.ustensils);d(e),re(t),r.push(i)})),l.setItem("allRecipes",JSON.stringify(r)),P(t,!1),C(r),i=document.createElement("section"),i.setAttribute("class","adv-search-wrapper"),e.insertBefore(i,f),function(e){var t=["ingredients","appareils","ustensils"],n=document.querySelector(".adv-search-wrapper");e.forEach((function(e,r){var i=t[r],c=new O(i,e);n.appendChild(c)}))}(a);var i}(t);var i}(n)})).catch((function(e){return console.log(e)}));var f=document.createElement("section");function d(t){var n=new k(t);f.appendChild(n),e.appendChild(f)}f.setAttribute("id","recipes-list"),f.setAttribute("class","row");var p,h,y=[],b=[],S=[],E=function(e){S=e},R=function(){return S},C=function(e){y=e},T=function(){y=[]},L=function(){return y},q=function(){return b=[]},x="";function I(){q(),T(),p=[]}function N(e){I(),V(),ee(),h=[],x+=e.toLowerCase();var t=R()||[];if(x.length>=3)if(t.length){!function(e){z().searchElementInTrie(e)}(x);var n=z().getTrieResults(),r=z().getTrieSuggestions();r?(H(r),n&&(M(n),u||Z())):Y()}else{!function(e){_().searchElementInTrie(e)}(x);var i=_().getTrieResults();H(h=_().getTrieSuggestions()),h.length>0?(H(h),i.length>0&&(M(i),u||Z())):Y()}x=x,x=""}function M(e){var t=[];if(e.forEach((function(e){var n,r=F(e.values());try{for(r.s();!(n=r.n()).done;){n.value.forEach((function(e){t.includes(e)||t.push(e)}))}}catch(e){r.e(e)}finally{r.f()}})),C(t),t.length>0);}var B=[],W=[];function H(e){V(),B=[],e.forEach((function(e){var n,r=F(e.entries());try{for(r.s();!(n=r.n()).done;){var i=t(n.value,2),c=i[0],s=i[1];J(c,s),B.includes(c)||B.push(c),s.forEach((function(e){W.includes(e)||W.push(e)}))}}catch(e){r.e(e)}finally{r.f()}p=W})),q()}var D=[];function J(e,t){if(!D.includes(e)){D.push(e);var n=document.createElement("p"),r=document.createTextNode(e);n.appendChild(r),document.querySelector("#main-suggestions").appendChild(n),n.addEventListener("click",(function(e){U(e,t)}),!1),n.addEventListener("keydown",(function(e){U(e,t)}),!1)}}function U(e,t){var n=e.target.innerText;document.querySelector("#main-search-input").value=n,C(t),K(t),u||Z(),V(),q();var r=document.querySelector("#search-addon"),i=document.querySelector("#reset-search-icon");r.classList.remove("d-inline-block"),r.style.display="none",i.style.display="inline-block"}function V(e){for(e=document.querySelector("#main-suggestions");e.firstChild;)e.removeChild(e.firstChild);return q(),D=[],e}function G(){var e=JSON.parse(l.getItem("allRecipes"));C(e),K(e)}function K(e){for(var t=document.querySelector("#recipes-list");t.firstChild;)t.removeChild(t.firstChild);L(),e||(e=JSON.parse(l.getItem("allRecipes"))),e.forEach((function(e){d(e)})),function(e){var t=document.querySelector("#ingredients-list"),n=document.querySelector("#appareils-list"),r=document.querySelector("#ustensils-list");[t,n,r].forEach((function(e){for(;e.firstChild;)e.removeChild(e.firstChild)})),e[0].forEach((function(e){var n=new g(e);t.appendChild(n);var r="ingredients";n.addEventListener("click",(function(e){ie(e,r)}),!1)})),e[1].forEach((function(e){var t=new g(e);n.appendChild(t);var r="appareils";t.addEventListener("click",(function(e){ie(e,r)}),!1)})),e[2].forEach((function(e){var t=new g(e);r.appendChild(t);var n="ustensils";t.addEventListener("click",(function(e){ie(e,n)}),!1)}))}(a=re(e))}var Q=document.createElement("div");Q.setAttribute("id","no-results-message"),Q.setAttribute("class","no-results-message");var X=document.createTextNode("Pas de résultat pour la recherche!");function Y(){var t=document.querySelector(".adv-search-wrapper");e.insertBefore(Q,t)}function Z(){var t=document.createElement("div");t.setAttribute("id","results-message"),t.setAttribute("class","results-message");var n=y.length,r=document.createTextNode(n+" recipes contain this search");t.appendChild(r);var i=document.querySelector(".adv-search-wrapper");e.insertBefore(t,i),u=!0}function ee(){var t=document.querySelector("#no-results-message");e.contains(t)&&e.removeChild(t)}function te(){var t=document.querySelector("#results-message");e.contains(t)&&(e.removeChild(t),u=!1)}function ne(){T(),q(),V(),ee(),te()}function re(e){return i=[],c=[],s=[],a=[],e.forEach((function(e){e.ingredients.forEach((function(e){var t,n,r=e.ingredient;r=m(r),n=(t=e).unit,Object.values(t).includes("grammes")&&(n="g",t.unit=n),A(i,r)}));var t=e.appliance;t=m(t),A(c,t),e.ustensils.forEach((function(e){var t=e;t=m(t),A(s,t)}))})),a.push(i,c,s),a}Q.appendChild(X);function ie(e,t){var n=e.target.innerText;document.querySelector("#btn-"+t).click(e),document.querySelector("#searchInto-"+t).value=n}return{processCurrentMainSearch:N,confirmCurrentChars:function(){var e=p,t=L();0===t.length?(C(e),K(e)):(C(t),K(t),u||Z()),V(),q()},addSuggestionInList:J,setResults:C,setSuggestions:function(e){b=e},getResults:L,resetSearch:function(){window.location.reload(),l.getItem("recipesTrie")},resetAllForNewSearch:ne,resetDefaultView:G,removeNoResults:ee,removeResultsBlock:te,retrieveFirstSuggestion:function(){return b[0]},displaySearchResults:K,processAdvancedSearch:function(e,t){w($.getResults(),e,t),S=$.getResults(),E(S),P(S,!0),K(S),u||Z()},handleAdvancedSearchReset:function(){if(document.querySelector("#main-search-input").value){var e=document.querySelector("#main-search-input").value;ne(),E([]),K(N(e)),u||Z()}else G()},resetToAdvSearchResults:function(){K(R())},checkWhosOpen:function(){document.querySelectorAll("collapsing-menu-component").forEach((function(e){"true"===e.getAttribute("isActive")&&e.querySelector("#caret-up").click()}))},displayNoResults:Y}}()})();