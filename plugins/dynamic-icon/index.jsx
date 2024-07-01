const {
    flux: {
        awaitStore
    }
} = shelter;

const GuildReadStateStore = await awaitStore("GuildReadStateStore");
const RelationshipStore = await awaitStore("RelationshipStore");

export async function onLoad() {
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
