if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,s)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let c={};const t=e=>n(e,o),d={module:{uri:o},exports:c,require:t};i[o]=Promise.all(r.map((e=>d[e]||t(e)))).then((e=>(s(...e),c)))}}define(["./workbox-3625d7b0"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-3db36ecd.css",revision:null},{url:"assets/index-dc9df2e0.js",revision:null},{url:"index.html",revision:"3fb75a93bc0b79e3ee14fe48fec9e559"},{url:"registerSW.js",revision:"3b389bca09ef2036b5d30cae3e8a0c17"},{url:"favicon.ico",revision:"54197fb90e475dc0f84b0aac4b765058"},{url:"android-chrome-192x192.png",revision:"6452e17819f3786bbcf4c28e05fad6b4"},{url:"android-chrome-512x512.png",revision:"809899a92718cbf1fada72bc1f6edae5"},{url:"manifest.webmanifest",revision:"2a61abe50d7a429761c40c862f4e935a"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
