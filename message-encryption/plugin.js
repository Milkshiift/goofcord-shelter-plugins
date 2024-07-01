(()=>{var A=Object.create;var d=Object.defineProperty;var k=Object.getOwnPropertyDescriptor;var V=Object.getOwnPropertyNames;var T=Object.getPrototypeOf,D=Object.prototype.hasOwnProperty;var H=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),B=(e,t)=>{for(var n in t)d(e,n,{get:t[n],enumerable:!0})},m=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of V(t))!D.call(e,s)&&s!==n&&d(e,s,{get:()=>t[s],enumerable:!(r=k(t,s))||r.enumerable});return e};var c=(e,t,n)=>(n=e!=null?A(T(e)):{},m(t||!e||!e.__esModule?d(n,"default",{value:e,enumerable:!0}):n,e)),G=e=>m(d({},"__esModule",{value:!0}),e);var o=H((te,f)=>{f.exports=shelter.solidWeb});var q={};B(q,{onLoad:()=>O,onUnload:()=>X});var p=c(o(),1),v=c(o(),1),y=c(o(),1),w=c(o(),1),C=c(o(),1),ne=c(o(),1),h=c(o(),1),E=c(o(),1),L=(0,p.template)('<div class="encryptContainer2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"></path></svg></div>',6),N=(0,p.template)('<div class="encryptContainer2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M352 192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H288V144C288 64.47 352.5 0 432 0C511.5 0 576 64.47 576 144V192C576 209.7 561.7 224 544 224C526.3 224 512 209.7 512 192V144C512 99.82 476.2 64 432 64C387.8 64 352 99.82 352 144V192z"></path></svg></div>',6),U=(0,p.template)('<div id="encrypt-icon"></div>',2),{http:u,flux:z,ui:{injectCss:re,tooltip:I},plugin:{store:l},observeDom:P}=shelter,j=window.goofcord.getConfig("encryptionMark"),b=window.goofcord.getConfig("messageEncryption");async function O(){b&&(R(),W(),Q())}var _,x;function R(){_=u.intercept("post",/\/channels\/\d+\/messages/,(e,t)=>(l.enabled&&(e.body.content=window.goofcord.encryptMessage(e.body.content)),t(e))),x=u.intercept("patch",/\/channels\/\d+\/messages/,(e,t)=>(l.enabled&&(e.body.content=window.goofcord.encryptMessage(e.body.content)),t(e)))}var S;function W(){S=z.intercept(e=>{switch(e.type){case"MESSAGE_CREATE":e.message.content=window.goofcord.decryptMessage(e.message.content);break;case"MESSAGE_UPDATE":e.message.content=window.goofcord.decryptMessage(e.message.content);break;case"MESSAGE_START_EDIT":e.content=Y(e.content,j);break;case"LOAD_MESSAGES_SUCCESS":for(let t of e.messages)t.content=window.goofcord.decryptMessage(t.content);break}})}var F=L.cloneNode(!0),J=N.cloneNode(!0),K=`
    .encryptContainer {
      display: flex;
      align-items: center;
    }
    
    .encryptContainer svg path {
      fill: var(--interactive-normal) !important;
    }
    
    .encryptContainer2 {
        padding: 4px;
        margin-left: 4px;
        margin-right: 4px;
    }
    
    .encryptContainer.notActive svg path {
      fill: var(--status-danger) !important;
    }
    
    .encryptContainer svg {
      width: 21px;
      height: 21px;
      cursor: pointer;
      transition: transform .2s;
    }
    
    .encryptContainer:hover svg {
      transform: scale(1.15);
    }
`,$;async function Q(){Z(K,"message-encryption-css"),$=P('[class^="channelTextArea"] [class^="buttons"]',e=>{if(document.querySelector("#encrypt-icon"))return;let[t,n]=shelter.solid.createSignal(!!l.enabled),r=()=>{l.enabled=!t(),n(!t()),window.goofcord.titlebar.flashTitlebar(l.enabled?"#f9c23c":"#D0D0D0")},s=(()=>{let a=U.cloneNode(!0);return(0,h.use)(I,a,()=>t()?"Encryption active":"Encryption not active"),(0,E.addEventListener)(a,"contextmenu",window.goofcord.cycleThroughPasswords,!0),a.$$click=r,(0,C.insert)(a,()=>t()?F:J),(0,w.effect)(i=>{let g=`encryptContainer${t()?"":" notActive"}`,M=e.childElementCount===0&&{display:"none"};return g!==i._v$&&(a.className=i._v$=g),i._v$2=(0,y.style)(a,M,i._v$2),i},{_v$:void 0,_v$2:void 0}),a})();e.prepend(s)})}function X(){b&&(S(),_(),x(),$())}function Y(e,t){return e.startsWith(t)?e.substring(t.length):e}function Z(e,t){let n=document.getElementById(t);if(n)n.textContent=e;else{let r=document.createElement("style");r.id=t,r.textContent=e,document.head.appendChild(r)}}(0,v.delegateEvents)(["click","contextmenu"]);return G(q);})();
