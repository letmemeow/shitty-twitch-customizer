function applyStyles() {
    chrome.storage.local.get(['bgImage', 'darkness', 'blur'], (result) => {
        const bgImage = result.bgImage || '';
        const darkness = result.darkness ?? 0.00; // Your default
        const blur = result.blur ?? 0;

        const styleId = 'twitch-chat-custom-style';
        let style = document.getElementById(styleId) || document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .chat-room__content {
                position: relative;
                isolation: isolate;
            }
            .chat-room__content::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: 
                    linear-gradient(
                        rgba(0, 0, 0, ${darkness}),
                        rgba(0, 0, 0, ${darkness})
                    ),
                    url("${bgImage}");
                background-size: cover;
                background-position: center;
                background-attachment: fixed;
                z-index: -1;
                ${blur > 0 ? `filter: blur(${blur}px);` : ''}
            }
            .tw-root--theme-dark .chat-room__content::before {
                background-blend-mode: multiply;
            }
            .chat-line__message {
                background: transparent !important;
            }
            .text-fragment {
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7) !important;
            }
        `;
        document.head.appendChild(style);
    });
}

// Initialize
applyStyles();

// Watch for changes
chrome.storage.onChanged.addListener(applyStyles);
new MutationObserver(applyStyles).observe(document.body, { subtree: true, childList: true });