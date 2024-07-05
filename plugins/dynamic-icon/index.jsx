const {
    flux: {
        awaitStore
    }
} = shelter;

let GuildReadStateStore;
let RelationshipStore;
export async function onLoad() {
    GuildReadStateStore = await awaitStore("GuildReadStateStore");
    RelationshipStore = await awaitStore("RelationshipStore");
    GuildReadStateStore.addChangeListener(setBadge);
    RelationshipStore.addChangeListener(setBadge);
    setBadge();
}

export function onUnload() {
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
