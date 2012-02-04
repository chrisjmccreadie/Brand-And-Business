/*
 * jQuery Address Plugin v1.1
 * http://www.asual.com/jquery/address/
 *
 * Copyright (c) 2009 Rostislav Hristov
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 *
 * Date: 2009-12-23 14:27:00 +0200 (Wed, 23 Dec 2009)
 */

(function(d){d.address=function(){var s=function(a){d(this).trigger(d.extend(d.Event(a),function(){for(var b={value:this.value(),path:this.path(),pathNames:this.pathNames(),parameterNames:this.parameterNames(),parameters:{},queryString:this.queryString()},e=0,o=b.parameterNames.length;e<o;e++)b.parameters[b.parameterNames[e]]=this.parameter(b.parameterNames[e]);return b}.call(this)))},p=function(){var a=c.href.indexOf("#");return a!=-1?M(C(c.href.substr(a+1))):""},N=function(a,b){if(k.strict)a=b?
a.substr(0,1)!="/"?"/"+a:a:a==""?"/":a;return a},D=function(a,b){return r&&c.protocol=="file:"?b?f.replace(/\?/,"%3F"):f.replace(/%253F/,"?"):a},O=function(a){for(var b=0,e=a.childNodes.length,o;b<e;b++){if(a.childNodes[b].src)E=String(a.childNodes[b].src);if(o=O(a.childNodes[b]))return o}},P=function(){if(!F){var a=p(),b=f!=a;if(v&&i<523){if(w!=z.length){w=z.length;if(typeof t[w-1]!=x)f=t[w-1];A(false)}}else if(r&&i<7&&b)c.reload();else if(b){f=a;A(false)}}},A=function(a){s.call(d.address,"change");
a?s.call(d.address,"internalChange"):s.call(d.address,"externalChange");y(Q,10)},Q=function(){var a=(c.pathname+(/\/$/.test(c.pathname)?"":"/")+I.value()).replace(/\/\//,"/").replace(/^\/$/,""),b=window[k.tracker];if(typeof b==J)b(a);else if(typeof pageTracker!=x&&typeof pageTracker._trackPageview==J)pageTracker._trackPageview(a);else typeof urchinTracker==J&&urchinTracker(a)},R=function(){var a=h.contentWindow.document;a.open();a.write("<html><head><title>"+g.title+"</title><script>var "+n+' = "'+
p()+'";<\/script></head></html>');a.close()},W=function(){if(!S){S=l;if(r&&i<8){var a=g.getElementsByTagName("frameset")[0];h=g.createElement((a?"":"i")+"frame");if(a){a.insertAdjacentElement("beforeEnd",h);a[a.cols?"cols":"rows"]+=",0";h.src="javascript:false";h.noResize=true;h.frameBorder=h.frameSpacing=0}else{h.src="javascript:false";h.style.display="none";g.body.insertAdjacentElement("afterBegin",h)}y(function(){d(h).bind("load",function(){var b=h.contentWindow;f=typeof b[n]!=x?b[n]:"";if(f!=
p()){A(false);c.hash=D(f,l)}});typeof h.contentWindow[n]==x&&R()},50)}else if(v){if(i<418){d(g.body).append('<form id="'+n+'" style="position:absolute;top:-9999px;" method="get"></form>');K=g.getElementById(n)}if(typeof c[n]==x)c[n]={};if(typeof c[n][c.pathname]!=x)t=c[n][c.pathname].split(",")}y(function(){s.call(d.address,"init");A(false)},1);if(r&&i>=8)g.body.onhashchange=P;else V(P,50);d("a[rel*=address:]").address()}},I={baseURL:function(){var a=c.href;if(a.indexOf("#")!=-1)a=a.substr(0,a.indexOf("#"));
if(a.substr(a.length-1)=="/")a=a.substr(0,a.length-1);return a},strict:function(){return k.strict},history:function(){return k.history},tracker:function(){return k.tracker},title:function(){return g.title},value:function(){if(!G)return null;return C(N(D(f,q),q))},path:function(){var a=this.value();return a.indexOf("?")!=-1?a.split("?")[0]:a},pathNames:function(){var a=this.path(),b=a.split("/");if(a.substr(0,1)=="/"||a.length==0)b.splice(0,1);a.substr(a.length-1,1)=="/"&&b.splice(b.length-1,1);return b},
queryString:function(){var a=this.value(),b=a.indexOf("?");if(b!=-1&&b<a.length)return a.substr(b+1)},parameter:function(a){var b=this.value(),e=b.indexOf("?");if(e!=-1){b=b.substr(e+1);b=b.split("&");for(var o=b.length,B=[];o--;){e=b[o].split("=");e[0]==a&&B.push(e[1])}if(B.length!=0)return B.length!=1?B:B[0]}},parameterNames:function(){var a=this.value(),b=a.indexOf("?"),e=[];if(b!=-1){a=a.substr(b+1);if(a!=""&&a.indexOf("=")!=-1){a=a.split("&");for(b=0;b<a.length;){e.push(a[b].split("=")[0]);b++}}}return e}},
Y={strict:function(a){k.strict=a},history:function(a){k.history=a},tracker:function(a){k.tracker=a},title:function(a){a=C(a);y(function(){X=g.title=a;if(T&&h&&h.contentWindow&&h.contentWindow.document){h.contentWindow.document.title=a;T=q}if(!L&&U)c.replace(c.href.indexOf("#")!=-1?c.href:c.href+"#");L=q},50)},value:function(a){a=M(C(N(a,l)));if(a=="/")a="";if(f!=a){L=l;f=a;F=l;A(true);t[z.length]=f;if(v)if(k.history){c[n][c.pathname]=t.toString();w=z.length+1;if(i<418){if(c.search==""){K.action="#"+
f;K.submit()}}else if(i<523||f==""){a=g.createEvent("MouseEvents");a.initEvent("click",l,l);var b=g.createElement("a");b.href="#"+f;b.dispatchEvent(a)}else c.hash="#"+f}else c.replace("#"+f);else if(f!=p())if(k.history)c.hash="#"+D(f,l);else c.replace("#"+f);r&&i<8&&k.history&&y(R,50);if(v)y(function(){F=q},1);else F=q}}},n="jQueryAddress",J="function",x="undefined",l=true,q=false,m=d.browser,i=parseFloat(d.browser.version),U=m.mozilla,r=m.msie,u=m.opera,v=m.safari,G=q,j;try{j=top.document!=undefined?
top:window}catch(Z){j=window}var g=j.document,z=j.history,c=j.location,V=setInterval,y=setTimeout,C=decodeURI,M=encodeURI;m=navigator.userAgent;var h,K,E,X=g.title,w=z.length,F=q,S=q,L=l,T=l,t=[],f=p(),H={},k={history:l,strict:l};if(r){i=parseFloat(m.substr(m.indexOf("MSIE")+4));if(g.documentMode&&g.documentMode!=i)i=g.documentMode!=8?7:8}if(G=U&&i>=1||r&&i>=6||u&&i>=9.5||v&&i>=312){for(m=1;m<w;m++)t.push("");t.push(p());if(r&&c.hash!=p())c.hash="#"+D(p(),l);if(u)history.navigationMode="compatible";
O(document);u=E.indexOf("?");if(E&&u>-1){u=E.substr(u+1).split("&");for(m=0;j=u[m];m++){j=j.split("=");if(/^(history|strict)$/.test(j[0]))k[j[0]]=isNaN(j[1])?/^(true|yes)$/i.test(j[1]):parseInt(j[1])!=0;if(/^tracker$/.test(j[0]))k[j[0]]=j[1]}}d(W)}else if(!G&&c.href.indexOf("#")!=-1||v&&i<418&&c.href.indexOf("#")!=-1&&c.search!=""){g.open();g.write('<html><head><meta http-equiv="refresh" content="0;url='+c.href.substr(0,c.href.indexOf("#"))+'" /></head></html>');g.close()}else Q();d.each("init,change,internalChange,externalChange".split(","),
function(a,b){H[b]=function(e,o){d(d.address).bind(b,o||e,o&&e);return this}});d.each("strict,history,tracker,title,value".split(","),function(a,b){H[b]=function(e){if(typeof e!="undefined"){G&&Y[b](e);return d.address}else return I[b]()}});d.each("baseURL,path,pathNames,queryString,parameter,parameterNames".split(","),function(a,b){H[b]=function(e){return I[b](e)}});return H}();d.fn.address=function(s){d(this).click(function(){var p=s?s.call(this):/address:/.test(d(this).attr("rel"))?d(this).attr("rel").split("address:")[1].split(" ")[0]:
d(this).attr("href").replace(/^#/,"");d.address.value(p);return false})}})(jQuery);