(function(exports){"use strict";const {settings:{registerSection:b}}=shelter,c=[];async function d(){await new Promise((f)=>setTimeout(f,1e3)),c.push(b("divider")),c.push(b("header","GoofCord")),c.push(b("button","goofcord","Settings",()=>{window.goofcord.openSettingsWindow()}))}function e(){c.forEach((f)=>f())}exports.onLoad=d;exports.onUnload=e;return exports})({});