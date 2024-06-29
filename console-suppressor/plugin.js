(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // plugins/console-suppressor/index.jsx
  var console_suppressor_exports = {};
  __export(console_suppressor_exports, {
    onLoad: () => onLoad,
    onUnload: () => onUnload
  });
  var originalConsoleMethods = {};
  function filterConsoleMessages() {
    Object.keys(console).forEach((method) => {
      originalConsoleMethods[method] = console[method];
      console[method] = function() {
        const message = arguments[0];
        if (message.includes("%c[")) {
          return;
        }
        originalConsoleMethods[method].apply(console, arguments);
      };
    });
  }
  function revertConsoleMessages() {
    Object.keys(originalConsoleMethods).forEach((method) => {
      console[method] = originalConsoleMethods[method];
    });
    originalConsoleMethods = {};
  }
  async function onLoad() {
    filterConsoleMessages();
  }
  function onUnload() {
    revertConsoleMessages();
  }
  return __toCommonJS(console_suppressor_exports);
})();
