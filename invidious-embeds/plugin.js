(()=>{var C=Object.create;var u=Object.defineProperty;var I=Object.getOwnPropertyDescriptor;var A=Object.getOwnPropertyNames;var T=Object.getPrototypeOf,j=Object.prototype.hasOwnProperty;var k=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),D=(e,t)=>{for(var n in t)u(e,n,{get:t[n],enumerable:!0})},v=(e,t,n,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of A(t))!j.call(e,i)&&i!==n&&u(e,i,{get:()=>t[i],enumerable:!(s=I(t,i))||s.enumerable});return e};var l=(e,t,n)=>(n=e!=null?C(T(e)):{},v(t||!e||!e.__esModule?u(n,"default",{value:e,enumerable:!0}):n,e)),F=e=>v(u({},"__esModule",{value:!0}),e);var a=k((Q,b)=>{b.exports=shelter.solidWeb});var J={};D(J,{onLoad:()=>q,onUnload:()=>W,settings:()=>L});var f=l(a(),1),g=l(a(),1),m=l(a(),1),w=l(a(),1),E=l(a(),1);async function y(){let n=(await(await fetch("https://api.invidious.io/instances.json?pretty=0&sort_by=type,users")).json()).map(r=>r[1].uri);console.log("Testing Invidious instances...");let s=1/0,i=null;for(let r of n){if(!r.includes("https"))continue;let p=performance.now();try{await fetch(r,{mode:"no-cors"})}catch{}let o=performance.now()-p;console.log(r,o),o<s&&(s=o,i=r)}return console.log("Fastest instance:",i,s),i}var G=(0,f.template)('<iframe class="invidious-embed" allow="fullscreen"></iframe>',2),M=(0,f.template)('<div class="invidious-thumbnail invidious-embed"><div class="invidious-wrapper"><svg class="invidious-playbutton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M9.25 3.35C7.87 2.45 6 3.38 6 4.96v14.08c0 1.58 1.87 2.5 3.25 1.61l10.85-7.04a1.9 1.9 0 0 0 0-3.22L9.25 3.35Z" class=""></path></svg></div></div>',8),{plugin:{store:c},observeDom:N,flux:{dispatcher:x,storesFlat:{SelectedChannelStore:B}},util:{reactFiberWalker:P,getFiber:U},ui:{Header:z,HeaderTags:H,TextBox:R,injectCss:Y}}=shelter;async function q(){c.instance??=await y(),O(Z,"invidious-embed-css");for(let e of _)x.subscribe(e,S)}var _=["MESSAGE_CREATE","MESSAGE_UPDATE","UPDATE_CHANNEL_DIMENSIONS"];function S(e){if(!c.instance||(e.type==="MESSAGE_CREATE"||e.type==="MESSAGE_UPDATE")&&e.message.channel_id!==B.getChannelId())return;let t=N('[id^="chat-messages-"] article:not([data-invidivizer])',n=>{n.dataset.invidivizer="1",t(),n.parentElement.querySelector(`iframe[src*="${c.instance}"]`)?.remove(),n.parentElement.querySelector('div[class="invidious-thumbnail"]')?.remove();let s=P(U(n),"embed",!0)?.memoizedProps?.embed?.url;if(typeof s!="string"||!s.startsWith("https://www.youtube.com"))return;n.style.display="none";let i=s.replace("https://www.youtube.com/watch?v=",""),r=(()=>{let o=G.cloneNode(!0);return(0,E.effect)(()=>(0,w.setAttribute)(o,"src",`${c.instance}/embed/${i}?autoplay=1&player_style=youtube&local=true`)),o})();function p(){n.insertAdjacentElement("afterend",r),d.style.display="none"}let d=(()=>{let o=M.cloneNode(!0),h=o.firstChild,$=h.firstChild;return $.$$click=p,o})();d.style.backgroundImage=`url(https://i.ytimg.com/vi/${i}/hqdefault.jpg)`,n.insertAdjacentElement("afterend",d)});setTimeout(t,1e3)}var L=()=>[(0,m.createComponent)(z,{get tag(){return H.H3},children:"Invidious Instance"}),(0,m.createComponent)(R,{placeholder:"my.instance.com",get value(){return c.instance},onInput:e=>c.instance=e})];function W(){for(let e of _)x.unsubscribe(e,S)}function O(e,t){let n=document.getElementById(t);if(n)n.textContent=e;else{let s=document.createElement("style");s.id=t,s.textContent=e,document.head.appendChild(s)}}var Z=`
    .invidious-embed {
        border: 0; 
        width: 100%; 
        max-width: 500px; 
        aspect-ratio: 16/9; 
        border-radius: 4px
    }
    
    .invidious-thumbnail {
        display: flex;
        align-content: center;
        flex-wrap: wrap;
        justify-content: center;
        background-position: center;
    }
    
    .invidious-wrapper {
        box-sizing: border-box;
        display: flex;
        padding: 12px;
        height: 48px;
        border-radius: 24px;
        background-color: hsl(0 calc( 1 * 0%) 0% /.6);
    }
    
    .invidious-playbutton {
        cursor: pointer;
        transition: opacity .25s;
        opacity: .6;
    }
    
    .invidious-playbutton:hover {
        opacity: 1;
    }
`;(0,g.delegateEvents)(["click"]);return F(J);})();
