(()=>{var S=Object.create;var u=Object.defineProperty;var I=Object.getOwnPropertyDescriptor;var A=Object.getOwnPropertyNames;var T=Object.getPrototypeOf,j=Object.prototype.hasOwnProperty;var D=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),k=(e,t)=>{for(var n in t)u(e,n,{get:t[n],enumerable:!0})},h=(e,t,n,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of A(t))!j.call(e,o)&&o!==n&&u(e,o,{get:()=>t[o],enumerable:!(s=I(t,o))||s.enumerable});return e};var l=(e,t,n)=>(n=e!=null?S(T(e)):{},h(t||!e||!e.__esModule?u(n,"default",{value:e,enumerable:!0}):n,e)),N=e=>h(u({},"__esModule",{value:!0}),e);var c=D((Q,b)=>{b.exports=shelter.solidWeb});var J={};k(J,{onLoad:()=>L,onUnload:()=>W,settings:()=>q});var f=l(c(),1),y=l(c(),1),m=l(c(),1),w=l(c(),1),E=l(c(),1);async function g(){let n=(await(await fetch("https://api.invidious.io/instances.json?pretty=0&sort_by=type,users")).json()).map(r=>r[1].uri);console.log("Testing Invidious instances...");let s=1/0,o=null;for(let r of n){if(!r.includes("https"))continue;let p=performance.now();try{await fetch(r,{mode:"no-cors"})}catch{}let i=performance.now()-p;console.log(r,i),i<s&&(s=i,o=r)}return console.log("Fastest instance:",o,s),o}var B=(0,f.template)('<iframe class="invidious-embed" allow="fullscreen"></iframe>',2),F=(0,f.template)('<div class="invidious-thumbnail invidious-embed"><div class="invidious-wrapper"><svg class="invidious-playbutton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M9.25 3.35C7.87 2.45 6 3.38 6 4.96v14.08c0 1.58 1.87 2.5 3.25 1.61l10.85-7.04a1.9 1.9 0 0 0 0-3.22L9.25 3.35Z" class=""></path></svg></div></div>',8),{plugin:{store:a},observeDom:G,flux:{dispatcher:x,storesFlat:{SelectedChannelStore:M}},util:{reactFiberWalker:z,getFiber:P},ui:{Header:U,HeaderTags:H,TextBox:R,injectCss:Y}}=shelter,_=["MESSAGE_CREATE","MESSAGE_UPDATE","UPDATE_CHANNEL_DIMENSIONS"];async function L(){let e=new Date().getDate();if((!a.instance||e%2===0)&&(a.instance=await g()),!(window.goofcord&&window.goofcord.getConfig("invidiousEmbeds")===!1)){O(Z,"invidious-embed-css");for(let t of _)x.subscribe(t,C)}}function W(){for(let e of _)x.unsubscribe(e,C)}function C(e){if(!a.instance||(e.type==="MESSAGE_CREATE"||e.type==="MESSAGE_UPDATE")&&e.message.channel_id!==M.getChannelId())return;let t=G('[id^="chat-messages-"] article:not([data-invidivizer])',n=>{n.dataset.invidivizer="1",t(),n.parentElement.querySelector(`iframe[src*="${a.instance}"]`)?.remove(),n.parentElement.getElementsByClassName("invidious-thumbnail").item(0)?.remove();let s=z(P(n),"embed",!0)?.memoizedProps?.embed?.url;if(typeof s!="string"||!s.startsWith("https://www.youtube.com"))return;n.style.display="none";let o=s.replace("https://www.youtube.com/watch?v=",""),r=(()=>{let i=B.cloneNode(!0);return(0,E.effect)(()=>(0,w.setAttribute)(i,"src",`${a.instance}/embed/${o}?autoplay=1&player_style=youtube&local=true`)),i})();function p(){n.insertAdjacentElement("afterend",r),d.style.display="none"}let d=(()=>{let i=F.cloneNode(!0),v=i.firstChild,$=v.firstChild;return $.$$click=p,i})();d.style.backgroundImage=`url(https://i.ytimg.com/vi/${o}/hqdefault.jpg)`,n.insertAdjacentElement("afterend",d)});setTimeout(t,1e3)}var q=()=>[(0,m.createComponent)(U,{get tag(){return H.H3},children:"Invidious Instance"}),(0,m.createComponent)(R,{placeholder:"my.instance.com",get value(){return a.instance},onInput:e=>a.instance=e})];function O(e,t){let n=document.getElementById(t);if(n)n.textContent=e;else{let s=document.createElement("style");s.id=t,s.textContent=e,document.head.appendChild(s)}}var Z=`
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
        background-size: cover;
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
`;(0,y.delegateEvents)(["click"]);return N(J);})();
