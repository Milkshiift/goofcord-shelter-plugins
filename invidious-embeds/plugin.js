(function(exports){var a=Object.create,b=Object.defineProperty,c=Object.getOwnPropertyDescriptor,d=Object.getOwnPropertyNames,ba=Object.getPrototypeOf,ca=Object.prototype.hasOwnProperty,e=(O,P)=>()=>(P||O((P={exports:{}}).exports,P),P.exports),f=(O,P,Q,R)=>{if(P&&typeof P==="object"||typeof P==="function"){for(var S=d(P),T=0,U=S.length,V;T<U;T++)if(V=S[T],!ca.call(O,V)&&V!==Q)b(O,V,{get:((W)=>P[W]).bind(null,V),enumerable:!(R=c(P,V))||R.enumerable})}return O},g=(O,P,Q)=>(Q=O!=null?a(ba(O)):{},f(P||!O||!O.__esModule?b(Q,"default",{value:O,enumerable:!0}):Q,O)),h=e((exports,P)=>{P.exports=shelter.solidWeb});async function i(){const O=await fetch("https://api.invidious.io/instances.json?pretty=0&sort_by=type,users"),P=await O.json(),Q=P.map((T)=>T[1].uri);console.log("Testing Invidious instances...");let R=Infinity,S=null;for(const T of Q){if(!T.includes("https"))continue;const U=performance.now();try{await fetch(T+"/embed/5IXQ6f6eMxQ?autoplay=1&player_style=youtube&local=true",{mode:"no-cors"})}catch(na){}const V=performance.now(),W=V-U;console.log(T,W);if(W<R)R=W,S=T}console.log("Fastest instance:",S,R);return S}function j(O,P,Q,R=document.body,S={childList:!0,subtree:!0},T={childList:!0,subtree:!0}){let U=null,V=null,W=null;const na=(Z)=>{if(V&&W===Z)return;X();W=Z;const oa=Z.querySelectorAll(P);oa.forEach(Q);V=new MutationObserver((pa)=>{if(!W||!W.isConnected){X();return}for(const $ of pa)if($.type==="childList"){for(const _ of $.addedNodes)if(_.nodeType===Node.ELEMENT_NODE){if(_.matches(P))Q(_);_.querySelectorAll(P).forEach(Q)}}});try{V.observe(Z,T)}catch(pa){X()}},X=()=>{if(V)V.disconnect(),V=null},Y=()=>{const Z=R.querySelector(O);if(Z&&Z.isConnected)if(W!==Z)na(Z);else{}else if(W)X(),W=null;else{}};U=new MutationObserver((Z,oa)=>{Y()});Y();U.observe(R,S);return function Z(){if(U)U.disconnect(),U=null;X();W=null}}var k=g(h(),1),l=g(h(),1),da=g(h(),1),ea=g(h(),1),m=g(h(),1),n=g(h(),1),fa=g(h(),1),o=g(h(),1),ga=g(h(),1);const ha=(0,k.template)("<iframe class=\"invidious-embed\" allow=\"fullscreen\" loading=\"lazy\"></iframe>",2),p=(0,k.template)("<div class=\"invidious-thumbnail invidious-embed\"><div class=\"invidious-wrapper\"><svg class=\"invidious-playbutton\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"white\" d=\"M9.25 3.35C7.87 2.45 6 3.38 6 4.96v14.08c0 1.58 1.87 2.5 3.25 1.61l10.85-7.04a1.9 1.9 0 0 0 0-3.22L9.25 3.35Z\"></path></svg></div></div>",8),q=(0,k.template)("<br>",1),r=(0,k.template)("<p>Instance last checked/updated: <!#><!/></p>",4),{plugin:{store:s},observeDom:ia,util:{getFiber:t,reactFiberWalker:u},ui:{Header:v,HeaderTags:ja,injectCss:ka,TextBox:la,Button:w,SwitchItem:x}}=shelter,y="https://www.youtube.com/watch?v=",z="https://i.ytimg.com/vi/",A="invidious-embed",B="invidious-thumbnail",C="invidious-wrapper",D="invidious-playbutton",E="data-invidious-processed",F=864e5;async function G(){if(!s.autoupdate&&s.lastInstanceUpdateTimestamp>0)return;const O=Date.now(),P=s.lastInstanceUpdateTimestamp??0,Q=!s.instance||O-P>F;if(Q)try{console.log("Updating Invidious instance..."),s.instance=await i(),s.lastInstanceUpdateTimestamp=O,console.log("Invidious instance updated:",s.instance)}catch(R){console.error("Failed to update Invidious instance:",R)}}function H(O,P){const Q=`${s.instance}/embed/${P}?autoplay=1&player_style=youtube&local=true`,R=`${z}${P}/hqdefault.jpg`,S=(()=>{const V=(0,o.getNextElement)(ha);(0,ga.setAttribute)(V,"src",Q);return V})();let T;function U(){if(T&&T.parentElement)T.insertAdjacentElement("beforebegin",S),T.remove(),T=null}T=(()=>{const V=(0,o.getNextElement)(p),W=V.firstChild,na=W.firstChild;W.$$click=U;(0,fa.runHydrationEvents)();return V})();T.style.backgroundImage=`url(${R})`;O.insertAdjacentElement("afterend",T);O.style.display="none"}function I(O){O.parentElement.getElementsByClassName(B).item(0)?.remove();if(O.hasAttribute(E))return;O.setAttribute(E,"true");try{const P=t(O),Q=u(P,"embed",!0)?.memoizedProps?.embed;if(!Q?.url||typeof Q.url!=="string"||!Q.url.startsWith(y))return;const R=Q.url.substring(y.length);if(!R){console.warn("Could not extract video ID from:",Q.url);return}H(O,R)}catch(P){console.error("Error processing message element for Invidious embed:",P,O)}}let J,K=()=>{};async function ma(){if(window["goofcord"]&&window.goofcord.getConfig("invidiousEmbeds")===!1)return;await G();if(!s.instance){console.warn("No Invidious instance configured or found. Embed replacement disabled.");return}if(J)J(N);else J=ka(N);K=j("[data-list-id=\"chat-messages\"]",`article:not([${E}])`,I)}function L(){K(),J(),J=void 0}const M=()=>[(0,n.createComponent)(v,{get tag(){return ja.H3},children:"Invidious Instance"}),(0,n.createComponent)(la,{placeholder:"invidious.example.com",get value(){return s.instance??""},onInput:(O)=>s.instance=O?.trim()?O.trim():void 0}),(0,o.getNextElement)(q),(0,o.getNextElement)(q),(0,n.createComponent)(x,{get value(){return s.autoupdate??!0},onChange:(O)=>s.autoupdate=O,children:"Auto-update instance?"}),(0,n.createComponent)(w,{grow:!0,onClick:async()=>{s.lastInstanceUpdateTimestamp=0,await G()},style:{position:"relative",left:"50%",transform:"translate(-50%, 0%)"},children:"Update Instance Now"}),(0,m.memo)((()=>{const O=(0,m.memo)(()=>!!s.lastInstanceUpdateTimestamp);return()=>O()&&(()=>{const P=(0,o.getNextElement)(r),Q=P.firstChild,R=Q.nextSibling,[S,T]=(0,da.getNextMarker)(R.nextSibling);P.style.setProperty("marginTop","8px");P.style.setProperty("color","var(--text-muted)");(0,ea.insert)(P,()=>new Date(s.lastInstanceUpdateTimestamp).toLocaleString(),S,T);return P})()})())],N=`
    .${A} {
        /* Shared styles for iframe and thumbnail */
        display: block;
        border: none;
        width: 100%;
        max-width: 500px;
        aspect-ratio: 16 / 9;
        border-radius: 4px;
        background-color: #000;
        overflow: hidden;
        margin-top: 4px;
        margin-bottom: 4px;
    }

    .${B} {
        display: flex;
        align-items: center;
        justify-content: center;
        background-position: center;
        background-size: cover;
        position: relative;
    }

    .${C} {
        /* Centered play button container */
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: hsla(0, 0%, 0%, 0.6);
        transition: background-color 0.2s ease-in-out;
        cursor: pointer;
    }
    .${C}:hover {
         background-color: hsla(0, 0%, 0%, 0.8);
    }


    .${D} {
        width: 24px;
        height: 24px;
        transition: transform 0.2s ease-in-out;
        opacity: 0.9;
    }

    .${C}:hover .${D} {
       transform: scale(1.1);
       opacity: 1;
    }
`;(0,l.delegateEvents)(["click"]);exports.onLoad=ma;exports.onUnload=L;exports.settings=M;return exports})({});