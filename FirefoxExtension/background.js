
browser.contextMenus.create({
    id: "otomatn-fix",
    title: "اصلاح با اتومتن",
    contexts: ["selection"] 
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "otomatn-fix") {
        
        try {
            const [{result}] = await browser.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const container = document.createElement("div");
                        container.appendChild(selection.getRangeAt(0).cloneContents());
                        return container.innerHTML;
                    }
                    return "";
                },
            });

            await browser.storage.local.set({ "otomatn_content": result });

            browser.windows.create({
                url: "popup/popup.html",
                type: "popup",
                width: 600,
                height: 550,
                left: 100,
                top: 100
            });

        } catch (e) {
            console.error("Error grabbing text:", e);
        }
    }
});