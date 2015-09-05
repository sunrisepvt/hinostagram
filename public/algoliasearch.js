/*
 * Copyright (c) 2013 Algolia
 * http://www.algolia.com/
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/*
 * Algolia Search library initialization
 * @param applicationID the application ID you have in your admin interface
 * @param apiKey a valid API key for the service
 * @param method specify if the protocol used is http or https (http by default to make the first search query faster).
 *        You need to use https is you are doing something else than just search queries.
 * @param resolveDNS let you disable first empty query that is launch to warmup the service
 * @param hostsArray (optionnal) the list of hosts that you have received for the service
 */
function AlgoliaExplainResults(e,t,n){function r(e,t){var n=[];if(typeof e=="object"&&"matchedWords"in e&&"value"in e){var i=!1;for(var s=0;s<e.matchedWords.length;++s){var o=e.matchedWords[s];o in t||(t[o]=1,i=!0)}i&&n.push(e.value)}else if(Object.prototype.toString.call(e)==="[object Array]")for(var u=0;u<e.length;++u){var a=r(e[u],t);n=n.concat(a)}else if(typeof e=="object")for(var f in e)e.hasOwnProperty(f)&&(n=n.concat(r(e[f],t)));return n}function i(e,t,n){var s=e._highlightResult||e;if(n.indexOf(".")===-1)return n in s?r(s[n],t):[];var o=n.split("."),u=s;for(var a=0;a<o.length;++a){if(Object.prototype.toString.call(u)==="[object Array]"){var f=[];for(var l=0;l<u.length;++l)f=f.concat(i(u[l],t,o.slice(a).join(".")));return f}if(!(o[a]in u))return[];u=u[o[a]]}return r(u,t)}var s={},o={},u=i(e,o,t);s.title=u.length>0?u[0]:"",s.subtitles=[];if(typeof n!="undefined")for(var a=0;a<n.length;++a){var f=i(e,o,n[a]);for(var l=0;l<f.length;++l)s.subtitles.push({attr:n[a],value:f[l]})}return s}var AlgoliaSearch=function(e,t,n,r,i){var s=this;this.applicationID=e,this.apiKey=t,this.hosts=[],this._isUndefined(i)&&(i=[e+"-1.algolia.io",e+"-2.algolia.io",e+"-3.algolia.io"]),this.hosts=[];for(var o=0;o<i.length;++o)Math.random()>.5&&this.hosts.reverse(),this._isUndefined(n)||n===null?this.hosts.push(("https:"==document.location.protocol?"https":"http")+"://"+i[o]):n==="https"||n==="HTTPS"?this.hosts.push("https://"+i[o]):this.hosts.push("http://"+i[o]);Math.random()>.5&&this.hosts.reverse(),this.requestTimeoutInMs=2e3,this.currentHostIndex=0,this.jsonp=null,this.jsonpWait=0,this._jsonRequest({method:"GET",url:"/1/isalive",callback:function(e,t){s.jsonp=!e},removeCustomHTTPHeaders:!0}),this.extraHeaders=[]};AlgoliaSearch.prototype={deleteIndex:function(e,t){this._jsonRequest({method:"DELETE",url:"/1/indexes/"+encodeURIComponent(e),callback:t})},moveIndex:function(e,t,n){var r={operation:"move",destination:t};this._jsonRequest({method:"POST",url:"/1/indexes/"+encodeURIComponent(e)+"/operation",body:r,callback:n})},copyIndex:function(e,t,n){var r={operation:"copy",destination:t};this._jsonRequest({method:"POST",url:"/1/indexes/"+encodeURIComponent(e)+"/operation",body:r,callback:n})},getLogs:function(e,t,n){this._isUndefined(t)&&(t=0),this._isUndefined(n)&&(n=10),this._jsonRequest({method:"GET",url:"/1/logs?offset="+t+"&length="+n,callback:e})},listIndexes:function(e,t){var n=t?"?page="+t:"";this._jsonRequest({method:"GET",url:"/1/indexes"+n,callback:e})},initIndex:function(e){return new this.Index(this,e)},listUserKeys:function(e){this._jsonRequest({method:"GET",url:"/1/keys",callback:e})},getUserKeyACL:function(e,t){this._jsonRequest({method:"GET",url:"/1/keys/"+e,callback:t})},deleteUserKey:function(e,t){this._jsonRequest({method:"DELETE",url:"/1/keys/"+e,callback:t})},addUserKey:function(e,t){var n={};n.acl=e,this._jsonRequest({method:"POST",url:"/1/keys",body:n,callback:t})},addUserKeyWithValidity:function(e,t,n,r,i){var s=this,o={};o.acl=e,o.validity=t,o.maxQueriesPerIPPerHour=n,o.maxHitsPerQuery=r,this._jsonRequest({method:"POST",url:"/1/indexes/"+s.indexName+"/keys",body:o,callback:i})},setSecurityTags:function(e){if(Object.prototype.toString.call(e)==="[object Array]"){var t=[];for(var n=0;n<e.length;++n)if(Object.prototype.toString.call(e[n])==="[object Array]"){var r=[];for(var i=0;i<e[n].length;++i)r.push(e[n][i]);t.push("("+r.join(",")+")")}else t.push(e[n]);e=t.join(",")}this.tagFilters=e},setUserToken:function(e){this.userToken=e},startQueriesBatch:function(){this.batch=[]},addQueryInBatch:function(e,t,n){var r="query="+encodeURIComponent(t);!this._isUndefined(n)&&n!==null&&(r=this._getSearchParams(n,r)),this.batch.push({indexName:e,params:r})},clearCache:function(){this.cache={}},sendQueriesBatch:function(e,t){var n=this,r={requests:[],apiKey:this.apiKey,appID:this.applicationID};this.userToken&&(r["X-Algolia-UserToken"]=this.userToken),this.tagFilters&&(r["X-Algolia-TagFilters"]=this.tagFilters);for(var i=0;i<n.batch.length;++i)r.requests.push(n.batch[i]);window.clearTimeout(n.onDelayTrigger);if(!this._isUndefined(t)&&t!==null&&t>0){var s=window.setTimeout(function(){n._sendQueriesBatch(r,e)},t);n.onDelayTrigger=s}else this._sendQueriesBatch(r,e)},setRequestTimeout:function(e){e&&(this.requestTimeoutInMs=parseInt(e,10))},Index:function(e,t){this.indexName=t,this.as=e,this.typeAheadArgs=null,this.typeAheadValueOption=null},setExtraHeader:function(e,t){this.extraHeaders.push({key:e,value:t})},_sendQueriesBatch:function(e,t){if(this.jsonp===null){var n=this;this._waitReady(function(){n._sendQueriesBatch(e,t)});return}if(this.jsonp){var r="";for(var i=0;i<e.requests.length;++i){var s="/1/indexes/"+encodeURIComponent(e.requests[i].indexName)+"?"+e.requests[i].params;r+=i+"="+encodeURIComponent(s)+"&"}this._jsonRequest({cache:this.cache,method:"GET",jsonp:!0,url:"/1/indexes/*",body:{params:r},callback:t})}else this._jsonRequest({cache:this.cache,method:"POST",url:"/1/indexes/*/queries",body:e,callback:t,removeCustomHTTPHeaders:!0})},_jsonRequest:function(e){var t=0,n=this,r=e.callback,i=null,s=e.url;this._isUndefined(e.body)||(s=e.url+"_body_"+JSON.stringify(e.body));if(!this._isUndefined(e.cache)){i=e.cache;if(!this._isUndefined(i[s])){this._isUndefined(r)||setTimeout(function(){r(!0,i[s])},1);return}}var o=function(){if(t>=n.hosts.length){n._isUndefined(r)||(t=0,r(!1,{message:"Cannot connect the Algolia's Search API. Please send an email to support@algolia.com to report the issue."}));return}e.callback=function(u,a,f,l){!a&&!n._isUndefined(l)&&console&&console.log("Error: "+l.message),a&&!n._isUndefined(e.cache)&&(i[s]=l),!a&&u?(n.currentHostIndex=++n.currentHostIndex%n.hosts.length,t+=1,o()):(t=0,n._isUndefined(r)||r(a,l))},e.hostname=n.hosts[n.currentHostIndex],n._jsonRequestByHost(e)};o()},_jsonRequestByHost:function(e){var t=this,n=e.hostname+e.url;this.jsonp?this._makeJsonpRequestByHost(n,e):this._makeXmlHttpRequestByHost(n,e)},_makeJsonpRequestByHost:function(e,t){if(!t.jsonp){t.callback(!0,!1,null,{message:"Method "+t.method+" "+e+" is not supported by JSONP."});return}this.jsonpCounter=this.jsonpCounter||0,this.jsonpCounter+=1;var n=document.getElementsByTagName("head")[0],r=document.createElement("script"),i="algoliaJSONP_"+this.jsonpCounter,s=!1,o=null;window[i]=function(e){t.callback(!1,!0,null,e);try{delete window[i]}catch(n){window[i]=undefined}},r.type="text/javascript",r.src=e+"?callback="+i+","+this.applicationID+","+this.apiKey,t.body["X-Algolia-TagFilters"]&&(r.src+="&X-Algolia-TagFilters="+encodeURIComponent(t.body["X-Algolia-TagFilters"])),t.body["X-Algolia-UserToken"]&&(r.src+="&X-Algolia-UserToken="+encodeURIComponent(t.body["X-Algolia-UserToken"])),t.body&&t.body.params&&(r.src+="&"+t.body.params),o=setTimeout(function(){r.onload=r.onreadystatechange=r.onerror=null,window[i]=function(e){try{delete window[i]}catch(t){window[i]=undefined}},t.callback(!0,!1,null,{message:"Timeout - Failed to load JSONP script."}),n.removeChild(r),clearTimeout(o),o=null},this.requestTimeoutInMs),r.onload=r.onreadystatechange=function(){clearTimeout(o),o=null;if(!s&&(!this.readyState||this.readyState=="loaded"||this.readyState=="complete")){s=!0;if(typeof window[i+"_loaded"]=="undefined"){t.callback(!0,!1,null,{message:"Failed to load JSONP script."});try{delete window[i]}catch(e){window[i]=undefined}}else try{delete window[i+"_loaded"]}catch(e){window[i+"_loaded"]=undefined}r.onload=r.onreadystatechange=null,n.removeChild(r)}},r.onerror=function(){clearTimeout(o),o=null,t.callback(!0,!1,null,{message:"Failed to load JSONP script."}),n.removeChild(r);try{delete window[i]}catch(e){window[i]=undefined}},n.appendChild(r)},_makeXmlHttpRequestByHost:function(e,t){var n=this,r=window.XMLHttpRequest?new XMLHttpRequest:{},i=null,s=null;this._isUndefined(t.body)||(i=JSON.stringify(t.body));if("withCredentials"in r){r.open(t.method,e,!0);if(this._isUndefined(t.removeCustomHTTPHeaders)||!t.removeCustomHTTPHeaders)r.setRequestHeader("X-Algolia-API-Key",this.apiKey),r.setRequestHeader("X-Algolia-Application-Id",this.applicationID);r.timeout=this.requestTimeoutInMs;for(var o=0;o<this.extraHeaders.length;++o)r.setRequestHeader(this.extraHeaders[o].key,this.extraHeaders[o].value);i!==null&&r.setRequestHeader("Content-type","application/json")}else{if(typeof XDomainRequest=="undefined"){console&&console.log("Your browser is too old to support CORS requests"),t.callback(!1,!1,null,{message:"CORS not supported"});return}r=new XDomainRequest,r.open(t.method,e)}s=setTimeout(function(){r.abort();if(r.aborted===!0){stopLoadAnimation();return}t.callback(!0,!1,null,{message:"Timeout - Could not connect to endpoint "+e}),clearTimeout(s),s=null},this.requestTimeoutInMs),r.onload=function(e){clearTimeout(s),s=null;if(!n._isUndefined(e)&&e.target!==null){var i=e.target.status===0||e.target.status===503,o=!1,u=null;typeof XDomainRequest!="undefined"?(u=e.target.responseText,o=u&&u.length>0):(u=e.target.response,o=e.target.status===200||e.target.status===201),t.callback(i,o,e.target,u?JSON.parse(u):null)}else t.callback(!1,!0,e,JSON.parse(r.responseText))},r.ontimeout=function(e){},r.onerror=function(e){clearTimeout(s),s=null,t.callback(!0,!1,null,{message:"Could not connect to host",error:e})},r.send(i)},_waitReady:function(e){this.jsonp===null&&(this.jsonpWait+=100,this.jsonpWait>2e3&&(this.jsonp=!0),setTimeout(e,100))},_getSearchParams:function(e,t){if(this._isUndefined(e)||e===null)return t;for(var n in e)n!==null&&e.hasOwnProperty(n)&&(t+=t.length===0?"?":"&",t+=n+"="+encodeURIComponent(Object.prototype.toString.call(e[n])==="[object Array]"?JSON.stringify(e[n]):e[n]));return t},_isUndefined:function(e){return e===void 0},applicationID:null,apiKey:null,tagFilters:null,userToken:null,hosts:[],cache:{},extraHeaders:[]},AlgoliaSearch.prototype.Index.prototype={clearCache:function(){this.cache={}},addObject:function(e,t,n){var r=this;this.as._isUndefined(n)?this.as._jsonRequest({method:"POST",url:"/1/indexes/"+encodeURIComponent(r.indexName),body:e,callback:t}):this.as._jsonRequest({method:"PUT",url:"/1/indexes/"+encodeURIComponent(r.indexName)+"/"+encodeURIComponent(n),body:e,callback:t})},addObjects:function(e,t){var n=this,r={requests:[]};for(var i=0;i<e.length;++i){var s={action:"addObject",body:e[i]};r.requests.push(s)}this.as._jsonRequest({method:"POST",url:"/1/indexes/"+encodeURIComponent(n.indexName)+"/batch",body:r,callback:t})},getObject:function(e,t,n){if(this.as.jsonp===null){var r=this;this.as._waitReady(function(){r.getObject(e,t,n)});return}var i=this,s="";if(!this.as._isUndefined(n)){s="?attributes=";for(var o=0;o<n.length;++o)o!==0&&(s+=","),s+=n[o]}this.as._jsonRequest({method:"GET",jsonp:!0,url:"/1/indexes/"+encodeURIComponent(i.indexName)+"/"+encodeURIComponent(e)+s,callback:t})},partialUpdateObject:function(e,t){var n=this;this.as._jsonRequest({method:"POST",url:"/1/indexes/"+encodeURIComponent(n.indexName)+"/"+encodeURIComponent(e.objectID)+"/partial",body:e,callback:t})},partialUpdateObjects:function(e,t){var n=this,r={requests:[]};for(var i=0;i<e.length;++i){var s={action:"partialUpdateObject",objectID:e[i].objectID,body:e[i]};r.requests.push(s)}this.as._jsonRequest({method:"POST",url:"/1/indexes/"+encodeURIComponent(n.indexName)+"/batch",body:r,callback:t})},saveObject:function(e,t){var n=this;this.as._jsonRequest({method:"PUT",url:"/1/indexes/"+encodeURIComponent(n.indexName)+"/"+encodeURIComponent(e.objectID),body:e,callback:t})},saveObjects:function(e,t){var n=this,r={requests:[]};for(var i=0;i<e.length;++i){var s={action:"updateObject",objectID:e[i].objectID,body:e[i]};r.requests.push(s)}this.as._jsonRequest({method:"POST",url:"/1/indexes/"+encodeURIComponent(n.indexName)+"/batch",body:r,callback:t})},deleteObject:function(e,t){if(e===null||e.length===0){t(!1,{message:"empty objectID"});return}var n=this;this.as._jsonRequest({method:"DELETE",url:"/1/indexes/"+encodeURIComponent(n.indexName)+"/"+encodeURIComponent(e),callback:t})},search:function(e,t,n,r){var i=this,s="query="+encodeURIComponent(e);!this.as._isUndefined(n)&&n!==null&&(s=this.as._getSearchParams(n,s)),window.clearTimeout(i.onDelayTrigger);if(!this.as._isUndefined(r)&&r!==null&&r>0){var o=window.setTimeout(function(){i._search(s,t)},r);i.onDelayTrigger=o}else this._search(s,t)},browse:function(e,t,n){var r=this,i="?page="+e;_.isUndefined(n)||(i+="&hitsPerPage="+n),this.as._jsonRequest({method:"GET",url:"/1/indexes/"+encodeURIComponent(r.indexName)+"/browse"+i,callback:t})},ttAdapter:function(e){var t=this;return function(n,r){t.search(n,function(e,t){e&&r(t.hits)},e)}},waitTask:function(e,t){var n=this;this.as._jsonRequest({method:"GET",url:"/1/indexes/"+encodeURIComponent(n.indexName)+"/task/"+e,callback:function(r,i){r?i.status==="published"?t(!0,i):setTimeout(function(){n.waitTask(e,t)},100):t(!1,i)}})},clearIndex:function(e){var t=this;this.as._jsonRequest({method:"POST",url:"/1/indexes/"+encodeURIComponent(t.indexName)+"/clear",callback:e})},getSettings:function(e){var t=this;this.as._jsonRequest({method:"GET",url:"/1/indexes/"+encodeURIComponent(t.indexName)+"/settings",callback:e})},setSettings:function(e,t){var n=this;this.as._jsonRequest({method:"PUT",url:"/1/indexes/"+encodeURIComponent(n.indexName)+"/settings",body:e,callback:t})},listUserKeys:function(e){var t=this;this.as._jsonRequest({method:"GET",url:"/1/indexes/"+encodeURIComponent(t.indexName)+"/keys",callback:e})},getUserKeyACL:function(e,t){var n=this;this.as._jsonRequest({method:"GET",url:"/1/indexes/"+encodeURIComponent(n.indexName)+"/keys/"+e,callback:t})},deleteUserKey:function(e,t){var n=this;this.as._jsonRequest({method:"DELETE",url:"/1/indexes/"+encodeURIComponent(n.indexName)+"/keys/"+e,callback:t})},addUserKey:function(e,t){var n=this,r={};r.acl=e,this.as._jsonRequest({method:"POST",url:"/1/indexes/"+encodeURIComponent(n.indexName)+"/keys",body:r,callback:t})},addUserKeyWithValidity:function(e,t,n,r,i){var s=this,o={};o.acl=e,o.validity=t,o.maxQueriesPerIPPerHour=n,o.maxHitsPerQuery=r,this.as._jsonRequest({method:"POST",url:"/1/indexes/"+encodeURIComponent(s.indexName)+"/keys",body:o,callback:i})},_search:function(e,t){if(this.as.jsonp===null){var n=this;this.as._waitReady(function(){n._search(e,t)});return}var r={params:e,apiKey:this.as.apiKey,appID:this.as.applicationID};this.as.tagFilters&&(r["X-Algolia-TagFilters"]=this.as.tagFilters),this.as.userToken&&(r["X-Algolia-UserToken"]=this.as.userToken),this.as.jsonp?this.as._jsonRequest({cache:this.cache,method:"GET",jsonp:!0,url:"/1/indexes/"+encodeURIComponent(this.indexName),body:r,callback:t}):this.as._jsonRequest({cache:this.cache,method:"POST",url:"/1/indexes/"+encodeURIComponent(this.indexName)+"/query",body:r,callback:t,removeCustomHTTPHeaders:!0})},as:null,indexName:null,cache:{},typeAheadArgs:null,typeAheadValueOption:null,emptyConstructor:function(){}};