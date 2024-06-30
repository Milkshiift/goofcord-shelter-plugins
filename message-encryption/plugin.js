(()=>{var H=Object.create;var l=Object.defineProperty;var T=Object.getOwnPropertyDescriptor;var D=Object.getOwnPropertyNames;var G=Object.getPrototypeOf,L=Object.prototype.hasOwnProperty;var N=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),z=(e,t)=>{for(var n in t)l(e,n,{get:t[n],enumerable:!0})},m=(e,t,n,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of D(t))!L.call(e,s)&&s!==n&&l(e,s,{get:()=>t[s],enumerable:!(a=T(t,s))||a.enumerable});return e};var r=(e,t,n)=>(n=e!=null?H(G(e)):{},m(t||!e||!e.__esModule?l(n,"default",{value:e,enumerable:!0}):n,e)),B=e=>m(l({},"__esModule",{value:!0}),e);var o=N((oe,f)=>{f.exports=shelter.solidWeb});var te={};z(te,{onLoad:()=>J,onUnload:()=>q});var p=r(o(),1),C=r(o(),1),E=r(o(),1),h=r(o(),1),_=r(o(),1),re=r(o(),1),b=r(o(),1),x=r(o(),1),P=(0,p.template)('<div class="encryptContainer2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"></path></svg></div>',6),U=(0,p.template)('<div class="encryptContainer2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M352 192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H288V144C288 64.47 352.5 0 432 0C511.5 0 576 64.47 576 144V192C576 209.7 561.7 224 544 224C526.3 224 512 209.7 512 192V144C512 99.82 476.2 64 432 64C387.8 64 352 99.82 352 144V192z"></path></svg></div>',6),j=(0,p.template)('<div id="encrypt-icon"></div>',2),{http:u,flux:I,ui:{injectCss:R,tooltip:W},plugin:{store:d},observeDom:F}=shelter,O=window.goofcord.getConfig("encryptionMark"),$=window.goofcord.getConfig("messageEncryption");async function J(){$&&(K(),Q(),Z())}var S,M;function K(){S=u.intercept("post",/\/channels\/\d+\/messages/,(e,t)=>(d.enabled&&(e.body.content=window.goofcord.encryptMessage(e.body.content)),t(e))),M=u.intercept("patch",/\/channels\/\d+\/messages/,(e,t)=>(d.enabled&&(e.body.content=window.goofcord.encryptMessage(e.body.content)),t(e)))}var A;function Q(){A=I.intercept(e=>{switch(e.type){case"MESSAGE_CREATE":e.message.content=window.goofcord.decryptMessage(e.message.content);break;case"MESSAGE_UPDATE":e.message.content=window.goofcord.decryptMessage(e.message.content);break;case"MESSAGE_START_EDIT":e.content=ee(e.content,O);break;case"LOAD_MESSAGES_SUCCESS":for(let t of e.messages)t.content=window.goofcord.decryptMessage(t.content);break}})}var X=P.cloneNode(!0),Y=U.cloneNode(!0),v=`
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
    }
`,y=!1,k,w;async function Z(){y?w(v):(y=!0,w=R(v)),k=F('[class^="channelTextArea"] [class^="buttons"]',e=>{if(document.querySelector("#encrypt-icon"))return;let[t,n]=shelter.solid.createSignal(!!d.enabled),a=()=>{d.enabled=!t(),n(!t())},s=(()=>{let c=j.cloneNode(!0);return(0,b.use)(W,c,()=>t()?"Encryption active":"Encryption not active"),(0,x.addEventListener)(c,"contextmenu",window.goofcord.cycleThroughPasswords,!0),c.$$click=a,(0,_.insert)(c,()=>t()?X:Y),(0,h.effect)(i=>{let g=`encryptContainer${t()?"":" notActive"}`,V=e.childElementCount===0&&{display:"none"};return g!==i._v$&&(c.className=i._v$=g),i._v$2=(0,E.style)(c,V,i._v$2),i},{_v$:void 0,_v$2:void 0}),c})();e.prepend(s)})}function q(){$&&(A(),S(),M(),k())}function ee(e,t){return e.startsWith(t)?e.substring(t.length):e}(0,C.delegateEvents)(["click","contextmenu"]);return B(te);})();
