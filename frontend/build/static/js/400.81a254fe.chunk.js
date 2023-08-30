"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[400],{6925:function(e,t,n){n.r(t),n.d(t,{default:function(){return Z}});var i=n(4165),a=n(5861),r=n(9439),l=n(2791),u=n(7689),s=n(2810),c=n(3999),o=n(3373),d=n(5434),p=n(9895),f=n(1595),v=n(3108),h=n(5094),x=n(9508),y=(n(8055),n(184));function Z(){var e=(0,l.useContext)(v.V),t=(0,x.x)(),n=t.isLoading,Z=t.error,V=t.sendRequest,m=t.clearError,C=(0,l.useState)(),j=(0,r.Z)(C,2),N=j[0],T=j[1],E=(0,u.UO)().placeId,I=(0,h.c)({title:{value:"",isValid:!1},description:{value:"",isValid:!1}},!1),A=(0,r.Z)(I,3),b=A[0],g=A[1],k=A[2],w=(0,u.s0)();function H(){return(H=(0,a.Z)((0,i.Z)().mark((function t(n){return(0,i.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n.preventDefault(),t.prev=1,t.next=4,V("http://localhost:5000"+"/api/places/".concat(E),"PATCH",JSON.stringify({title:b.inputs.title.value,description:b.inputs.description.value}),{"Content-Type":"application/json",Authorization:"Bearer "+e.token});case 4:w("/"+e.userId+"/places"),t.next=9;break;case 7:t.prev=7,t.t0=t.catch(1);case 9:case 10:case"end":return t.stop()}}),t,null,[[1,7]])})))).apply(this,arguments)}return(0,l.useEffect)((function(){function e(){return(e=(0,a.Z)((0,i.Z)().mark((function e(){var t;return(0,i.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,V("http://localhost:5000"+"/api/places/".concat(E));case 3:t=e.sent,T(t.place),k({title:{value:t.title,isValid:!0},description:{value:t.description,isValid:!0}},!0),e.next=10;break;case 8:e.prev=8,e.t0=e.catch(0);case 10:case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()}),[V,E,k]),n?(0,y.jsx)("div",{className:"center",children:(0,y.jsx)(p.Z,{asOverlay:!0})}):N||Z?(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(d.Z,{error:Z,onClear:m}),!n&&N&&(0,y.jsxs)("form",{className:"place-form",onSubmit:function(e){return H.apply(this,arguments)},children:[(0,y.jsx)(s.Z,{id:"title",element:"input",type:"text",label:"Title",validators:[(0,f.hg)()],errorText:"Please enter a valid title.",onInput:g,initialValue:N.title,initialValid:!0}),(0,y.jsx)(s.Z,{id:"description",element:"textarea",label:"Description",validators:[(0,f.CP)(5)],errorText:"Please enter a valid description (at least 5 characters).",onInput:g,initialValue:N.description,initialValid:!0}),(0,y.jsx)(c.Z,{type:"submit",disabled:!b.isValid,children:"UPDATE PLACE"})]})]}):(0,y.jsx)("div",{className:"center",children:(0,y.jsx)(o.Z,{children:(0,y.jsx)("h2",{children:"Could not find place!"})})})}},2810:function(e,t,n){n.d(t,{Z:function(){return c}});var i=n(9439),a=n(1413),r=n(2791),l=n(1595),u=n(184);function s(e,t){switch(t.type){case"CHANGE":return(0,a.Z)((0,a.Z)({},e),{},{value:t.val,isValid:(0,l.Gu)(t.val,t.validators)});case"TOUCH":return(0,a.Z)((0,a.Z)({},e),{},{touched:!0});default:return e}}function c(e){var t=(0,r.useReducer)(s,{value:e.initialValue||"",isValid:e.initialValid||!1,touched:!1}),n=(0,i.Z)(t,2),a=n[0],l=n[1],c=e.id,o=e.onInput,d=a.value,p=a.isValid;function f(t){l({type:"CHANGE",val:t.target.value,validators:e.validators})}function v(){l({type:"TOUCH"})}(0,r.useEffect)((function(){o(c,d,p)}),[c,d,p,o]);var h="input"===e.element?(0,u.jsx)("input",{id:e.id,type:e.type,placeholder:e.placeholder,onChange:f,onBlur:v,value:a.value}):(0,u.jsx)("textarea",{id:e.id,rows:e.rows||3,onChange:f,onBlur:v,value:a.value});return(0,u.jsxs)("div",{className:"form-control ".concat(!a.isValid&&a.touched&&"form-control--invalid"),children:[(0,u.jsx)("label",{htmlFor:e.id,children:e.label}),h,!a.isValid&&a.touched&&(0,u.jsx)("p",{children:e.errorText})]})}},3373:function(e,t,n){n.d(t,{Z:function(){return a}});n(2791);var i=n(184),a=function(e){return(0,i.jsx)("div",{className:"card ".concat(e.className),style:e.style,children:e.children})}},5094:function(e,t,n){n.d(t,{c:function(){return s}});var i=n(9439),a=n(4942),r=n(1413),l=n(2791),u=function(e,t){switch(t.type){case"INPUT_CHANGE":var n=!0;for(var i in e.inputs)e.inputs[i]&&(n=i===t.inputId?n&&t.isValid:n&&e.inputs[i].isValid);return(0,r.Z)((0,r.Z)({},e),{},{inputs:(0,r.Z)((0,r.Z)({},e.inputs),{},(0,a.Z)({},t.inputId,{value:t.value,isValid:t.isValid})),isValid:n});case"SET_DATA":return{inputs:t.inputs,isValid:t.formIsValid};default:return e}};function s(e,t){var n=(0,l.useReducer)(u,{inputs:e,isValid:t}),a=(0,i.Z)(n,2),r=a[0],s=a[1];return[r,(0,l.useCallback)((function(e,t,n){s({type:"INPUT_CHANGE",value:t,isValid:n,inputId:e})}),[]),(0,l.useCallback)((function(e,t){s({type:"SET_DATA",inputs:e,formIsValid:t})}),[])]}},1595:function(e,t,n){n.d(t,{CP:function(){return c},Gu:function(){return d},Ox:function(){return o},hg:function(){return s}});var i=n(7762),a="REQUIRE",r="MINLENGTH",l="MAXLENGTH",u="EMAIL",s=function(){return{type:a}},c=function(e){return{type:r,val:e}},o=function(){return{type:u}},d=function(e,t){var n,s=!0,c=(0,i.Z)(t);try{for(c.s();!(n=c.n()).done;){var o=n.value;o.type===a&&(s=s&&e.trim().length>0),o.type===r&&(s=s&&e.trim().length>=o.val),o.type===l&&(s=s&&e.trim().length<=o.val),"MIN"===o.type&&(s=s&&+e>=o.val),"MAX"===o.type&&(s=s&&+e<=o.val),o.type===u&&(s=s&&/^\S+@\S+\.\S+$/.test(e))}}catch(d){c.e(d)}finally{c.f()}return s}},8055:function(){}}]);
//# sourceMappingURL=400.81a254fe.chunk.js.map