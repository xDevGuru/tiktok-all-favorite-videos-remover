const ext = globalThis.browser ?? globalThis.chrome;

ext.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === "removeFavoriteVideos") {
        try {
            const tab = await ext.tabs.create({
                url: "https://www.tiktok.com/",
                active: true,
            });

            ext.tabs.onUpdated.addListener(function listener(tabId, info) {
                if (tabId === tab.id && info.status === "complete") {
                    ext.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ["script.js"],
                    });
                    ext.tabs.onUpdated.removeListener(listener);
                }
            });
        } catch (error) {
            console.log({
                message: "Error opening TikTok or starting script.",
                error,
            });
        }
    }
});
