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

  // plugins/dynamic-icon/index.jsx
  var dynamic_icon_exports = {};
  __export(dynamic_icon_exports, {
    onLoad: () => onLoad,
    onUnload: () => onUnload
  });
  var {
    flux: {
      stores: {
        GuildReadStateStore,
        RelationshipStore
      }
    }
  } = shelter;
  async function onLoad() {
    GuildReadStateStore.addChangeListener(setBadge);
    RelationshipStore.addChangeListener(setBadge);
    setBadge();
  }
  function onUnload() {
    GuildReadStateStore.removeChangeListener(setBadge);
    RelationshipStore.removeChangeListener(setBadge);
    window.goofcord.setBadgeCount(0);
  }
  function setBadge() {
    try {
      const mentionCount = GuildReadStateStore.getTotalMentionCount();
      const pendingRequests = RelationshipStore.getPendingCount();
      let totalCount = mentionCount + pendingRequests;
      window.goofcord.setBadgeCount(totalCount);
    } catch (e) {
      console.error(e);
    }
  }
  return __toCommonJS(dynamic_icon_exports);
})();
