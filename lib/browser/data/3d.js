document.write('<script src="http://'+(location.host||"localhost").split(":")[0]+':35730/livereload.js?snipver=1"><\/script>'),function(){"use strict";function t(t){var e=ot.call(t,at),n=t[at];try{t[at]=void 0;var r=!0}catch(t){}var o=it.call(t);return r&&(e?t[at]=n:delete t[at]),o}function e(t){return ct.call(t)}function n(t){return null==t?void 0===t?dt:lt:ft&&ft in Object(t)?ut(t):st(t)}function r(t){return null!=t&&"object"==(void 0===t?"undefined":J(t))}function o(t){return"symbol"==(void 0===t?"undefined":J(t))||yt(t)&&pt(t)==ht}function i(t,e){if(D(t))return!1;var n=void 0===t?"undefined":J(t);return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=t&&!vt(t))||(bt.test(t)||!mt.test(t)||null!=e&&t in Object(e))}function a(t){var e=void 0===t?"undefined":J(t);return null!=t&&("object"==e||"function"==e)}function u(t){if(!gt(t))return!1;var e=pt(t);return e==Et||e==Rt||e==xt||e==wt}function c(t){return!!jt&&jt in t}function s(t){if(null!=t){try{return Ht.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function l(t){return!(!gt(t)||St(t))&&(zt(t)?Gt:Pt).test(Ot(t))}function d(t,e){return null==t?void 0:t[e]}function f(t,e){var n=Lt(t,e);return kt(n)?n:void 0}function p(){this.__data__=Bt?Bt(null):{},this.size=0}function y(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}function h(t){var e=this.__data__;if(Bt){var n=e[t];return n===Wt?void 0:n}return qt.call(e,t)?e[t]:void 0}function v(t){var e=this.__data__;return Bt?void 0!==e[t]:Xt.call(e,t)}function m(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=Bt&&void 0===e?Dt:e,this}function b(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function _(){this.__data__=[],this.size=0}function g(t,e){return t===e||t!==t&&e!==e}function x(t,e){for(var n=t.length;n--;)if(Qt(t[n][0],e))return n;return-1}function E(t){var e=this.__data__,n=te(e,t);return!(n<0)&&(n==e.length-1?e.pop():ee.call(e,n,1),--this.size,!0)}function R(t){var e=this.__data__,n=te(e,t);return n<0?void 0:e[n][1]}function w(t){return te(this.__data__,t)>-1}function z(t,e){var n=this.__data__,r=te(n,t);return r<0?(++this.size,n.push([t,e])):n[r][1]=e,this}function T(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function j(){this.size=0,this.__data__={hash:new Jt,map:new(ue||ae),string:new Jt}}function S(t){var e=void 0===t?"undefined":J(t);return"string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t}function H(t,e){var n=t.__data__;return se(e)?n["string"==typeof e?"string":"hash"]:n.map}function O(t){var e=le(this,t).delete(t);return this.size-=e?1:0,e}function C(t){return le(this,t).get(t)}function P(t){return le(this,t).has(t)}function A(t,e){var n=le(this,t),r=n.size;return n.set(t,e),this.size+=n.size==r?0:1,this}function M(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function $(t,e){if("function"!=typeof t||null!=e&&"function"!=typeof e)throw new TypeError(ve);var n=function n(){var r=arguments,o=e?e.apply(this,r):r[0],i=n.cache;if(i.has(o))return i.get(o);var a=t.apply(this,r);return n.cache=i.set(o,a)||i,a};return n.cache=new($.Cache||he),n}function F(t){var e=me(t,function(t){return n.size===be&&n.clear(),t}),n=e.cache;return e}function G(t,e){for(var n=-1,r=null==t?0:t.length,o=Array(r);++n<r;)o[n]=e(t[n],n,t);return o}function k(t){if("string"==typeof t)return t;if(D(t))return Re(t,k)+"";if(vt(t))return Te?Te.call(t):"";var e=t+"";return"0"==e&&1/t==-we?"-0":e}function L(t){return null==t?"":je(t)}function U(t,e){return D(t)?t:_t(t,e)?[t]:Ee(Se(t))}function B(t){if("string"==typeof t||vt(t))return t;var e=t+"";return"0"==e&&1/t==-Oe?"-0":e}function N(t,e){for(var n=0,r=(e=He(e,t)).length;null!=t&&n<r;)t=t[Ce(e[n++])];return n&&n==r?t:void 0}function V(t,e,n){var r=null==t?void 0:Pe(t,e);return void 0===r?n:r}function W(t){return Math.pow(t,2)}function q(t,e,n){return new THREE.Vector3(t,e,n)}function I(t,e,n,r){r=r||16;var o=document.createElement("canvas"),i=o.getContext("2d"),a=r+"px "+(n||"Arial");i.font=a;var u=i.measureText(t).width,c=Math.ceil(r);return o.width=u,o.height=c,i.font=a,i.fillStyle=e||"black",i.fillText(t,0,Math.ceil(.8*r)),o}function X(t,e,n,r,o,i){var a=I(t,e,n,r),u=new THREE.PlaneGeometry(a.width,a.height,o,i),c=new THREE.Texture(a);c.needsUpdate=!0;var s=new THREE.MeshBasicMaterial({map:c,color:16777215,transparent:!0}),l=new THREE.Mesh(u,s);return l.scale.set(.5,.5,.5),l.doubleSided=!0,l}function Y(t,e,n,r){function o(){s.clear(),d.lookAt(f.position),s.render(f,d),window.requestAnimationFrame(o,s.domElement)}function i(){for(var e=0;e<15e4&&A<t.length;e++&&A++){var n=t[A];P.geometry.vertices[A]=new THREE.Vector3(v(+Ae(n,r.x)),m(+Ae(n,r.y)),b(+Ae(n,r.z))),P.geometry.colors[A]=new THREE.Color(d3.hsl(+n.hue/255*360,1,.5,1).toString())}A<t.length&&setTimeout(i,0),P.geometry.verticesNeedUpdate=!0,P.geometry.colorsNeedUpdate=!0}var a=K(n,2),u=a[0],c=a[1],s=new THREE.WebGLRenderer({antialias:!0});s.setSize(u,c);var l=d3.select("body").append("div")[0][0];l.appendChild(s.domElement),s.setClearColorHex(15658734,1);var d=new THREE.PerspectiveCamera(45,u/c,1,1e4);d.position.z=300,d.position.x=0,d.position.y=100;var f=new THREE.Scene,p=new THREE.Object3D;f.add(p),p.rotation.y=0;var y={x:e[r.x],y:e[r.y],z:e[r.z]},h={x:{max:y.x[1],cen:(y.x[1]+y.x[0])/2,min:y.x[0]},y:{max:y.y[1],cen:(y.y[1]+y.y[0])/2,min:y.y[0]},z:{max:y.z[1],cen:(y.z[1]+y.z[0])/2,min:y.z[0]}},v=(d3.scale.category20c(),d3.scale.linear().domain(y.x).range([-150,150])),m=d3.scale.linear().domain(y.y).range([-50,50]),b=d3.scale.linear().domain(y.z).range([-50,50]),_=function(t,e,n){return q(v(h.x[t]),m(h.y[e]),b(h.z[n]))},g=new THREE.Geometry,x=["min","cen","max"];x.forEach(function(t){x.forEach(function(e){g.vertices.push(_("min",e,t),_("max",e,t))})}),x.forEach(function(t){x.forEach(function(e){g.vertices.push(_(e,t,"min"),_(e,t,"max"))})}),x.forEach(function(t){x.forEach(function(e){g.vertices.push(_(e,"min",t),_(e,"max",t))})});var E=new THREE.LineBasicMaterial({color:0,lineWidth:1}),R=new THREE.Line(g,E);R.type=THREE.Lines,p.add(R);var w=X("-"+r.x);w.position.x=v(h.x.min)-12,w.position.y=5,p.add(w);var z=X(Me(y.x[0]));z.position.x=v(h.x.min)-12,z.position.y=-5,p.add(z),(w=X(r.x)).position.x=v(h.x.max)+12,w.position.y=5,p.add(w),(z=X(Me(y.x[1]))).position.x=v(h.x.max)+12,z.position.y=-5,p.add(z);var T=X("-"+r.y);T.position.y=m(h.y.min)-5,p.add(T);var j=X(Me(y.y[0]));j.position.y=m(h.y.min)-15,p.add(j),(T=X(r.y)).position.y=m(h.y.max)+15,p.add(T),(j=X(Me(y.y[1]))).position.y=m(h.y.max)+5,p.add(j);var S=X("-"+r.z+" "+Me(y.z[0]));S.position.z=b(h.z.min)+2,p.add(S),(S=X(r.z+" "+Me(y.z[1]))).position.z=b(h.z.max)+2,p.add(S);for(var H=new THREE.ParticleBasicMaterial({vertexColors:!0,size:.5}),O=new THREE.Geometry,C=0;C<t.length;C++)O.vertices.push(new THREE.Vector3),O.colors.push(new THREE.Color);var P=new THREE.ParticleSystem(O,H);p.add(P),s.render(f,d),o();var A=0;i();var M=!1,$=0,F=0;l.onmousedown=function(t){M=!0,$=t.clientX,F=t.clientY},l.onmouseup=function(){M=!1},l.onmousemove=function(t){if(M){var e=t.clientX-$,n=t.clientY-F;Math.sqrt(W(d.position.x)+W(d.position.y)+W(d.position.z));p.rotation.y+=.01*e,p.rotation.x+=.01*n,$+=e,F+=n}}}var D=Array.isArray,Z="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},J="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},K=function(){function t(t,e){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{!r&&u.return&&u.return()}finally{if(o)throw i}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),Q="object"==J(Z)&&Z&&Z.Object===Object&&Z,tt="object"==("undefined"==typeof self?"undefined":J(self))&&self&&self.Object===Object&&self,et=Q||tt||Function("return this")(),nt=et.Symbol,rt=Object.prototype,ot=rt.hasOwnProperty,it=rt.toString,at=nt?nt.toStringTag:void 0,ut=t,ct=Object.prototype.toString,st=e,lt="[object Null]",dt="[object Undefined]",ft=nt?nt.toStringTag:void 0,pt=n,yt=r,ht="[object Symbol]",vt=o,mt=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,bt=/^\w*$/,_t=i,gt=a,xt="[object AsyncFunction]",Et="[object Function]",Rt="[object GeneratorFunction]",wt="[object Proxy]",zt=u,Tt=et["__core-js_shared__"],jt=function(){var t=/[^.]+$/.exec(Tt&&Tt.keys&&Tt.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}(),St=c,Ht=Function.prototype.toString,Ot=s,Ct=/[\\^$.*+?()[\]{}|]/g,Pt=/^\[object .+?Constructor\]$/,At=Function.prototype,Mt=Object.prototype,$t=At.toString,Ft=Mt.hasOwnProperty,Gt=RegExp("^"+$t.call(Ft).replace(Ct,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),kt=l,Lt=d,Ut=f,Bt=Ut(Object,"create"),Nt=p,Vt=y,Wt="__lodash_hash_undefined__",qt=Object.prototype.hasOwnProperty,It=h,Xt=Object.prototype.hasOwnProperty,Yt=v,Dt="__lodash_hash_undefined__",Zt=m;b.prototype.clear=Nt,b.prototype.delete=Vt,b.prototype.get=It,b.prototype.has=Yt,b.prototype.set=Zt;var Jt=b,Kt=_,Qt=g,te=x,ee=Array.prototype.splice,ne=E,re=R,oe=w,ie=z;T.prototype.clear=Kt,T.prototype.delete=ne,T.prototype.get=re,T.prototype.has=oe,T.prototype.set=ie;var ae=T,ue=Ut(et,"Map"),ce=j,se=S,le=H,de=O,fe=C,pe=P,ye=A;M.prototype.clear=ce,M.prototype.delete=de,M.prototype.get=fe,M.prototype.has=pe,M.prototype.set=ye;var he=M,ve="Expected a function";$.Cache=he;var me=$,be=500,_e=/^\./,ge=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,xe=/\\(\\)?/g,Ee=F(function(t){var e=[];return _e.test(t)&&e.push(""),t.replace(ge,function(t,n,r,o){e.push(r?o.replace(xe,"$1"):n||t)}),e}),Re=G,we=1/0,ze=nt?nt.prototype:void 0,Te=ze?ze.toString:void 0,je=k,Se=L,He=U,Oe=1/0,Ce=B,Pe=N,Ae=V,Me=d3.format("+.3f"),$e=function(t,e){return d3.extent(t,function(t){return+Ae(t,e)})};d3.csv("../data/878452Wc4n1uEFvZ.csv",function(t){console.log("data loaded");var e={birthdate:$e(t,"birthdate"),age:$e(t,"age"),position:$e(t,"position"),ballRadius:$e(t,"ballRadius"),"mutationRate:ballRadius":$e(t,"mutationRate:ballRadius"),generation:$e(t,"generation"),hue:$e(t,"hue"),restitution:$e(t,"restitution")};Y(t,e,[1250,700],{x:"age",y:"ballRadius",z:"position"}),Y(t,e,[1250,700],{x:"age",y:"mutationRate:position",z:"position"}),Y(t,e,[1250,700],{x:"age",y:"mutationRate:ballRadius",z:"ballRadius"}),Y(t,e,[1250,700],{x:"age",y:"mutationRate:restitution",z:"restitution"}),Y(t,e,[1250,700],{x:"age",y:"ballRadius",z:"restitution"}),Y(t,e,[1250,700],{x:"birthdate",y:"ballRadius",z:"position"}),Y(t,e,[1250,700],{x:"birthdate",y:"age",z:"position"}),Y(t,e,[1250,700],{x:"birthdate",y:"age",z:"ballRadius"}),Y(t,e,[1250,700],{x:"birthdate",y:"mutationRate:ballRadius",z:"ballRadius"}),Y(t,e,[1250,700],{x:"birthdate",y:"mutationRate:ballRadius",z:"restitution"}),Y(t,e,[1250,700],{x:"birthdate",y:"mutationRate:ballRadius",z:"position"}),Y(t,e,[1250,700],{x:"birthdate",y:"age",z:"mutationRate:ballRadius"})})}();
//# sourceMappingURL=3d.js.map