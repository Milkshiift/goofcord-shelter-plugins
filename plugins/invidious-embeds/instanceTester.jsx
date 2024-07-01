export async function updateFastestInstance() {
    const response = await fetch("https://api.invidious.io/instances.json?pretty=0&sort_by=type,users");
    const json = await response.json();
    const instances = json.map((instance) => instance[1].uri);

    console.log("Testing Invidious instances...");
    let prevBestTime = Infinity;
    let prevBestInstance = null;
    for (const instance of instances) {
        if (!instance.includes("https")) continue;
        const start = performance.now();
        try {
            await fetch(instance, {
                mode: 'no-cors'
            });
        } catch (e) {}
        const end = performance.now();
        const time = end - start;
        console.log(instance, time);
        if (time < prevBestTime) {
            prevBestTime = time;
            prevBestInstance = instance;
        }
    }

    console.log("Fastest instance:", prevBestInstance, prevBestTime);
    return prevBestInstance;
}
