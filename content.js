let currentStyles = {
    bgImage: '',
    darkness: 0,
    blur: 0
  };
  
  function applyOptimizedStyles() {
    const chatContainer = document.querySelector('.chat-scrollable-area__message-container, .chat-list, .chat-room__content');
    if (!chatContainer) return;
  
    // Performance-optimized blur (capped at 5px)
    const safeBlur = Math.min(currentStyles.blur, 5);
    
    const styleId = 'twitch-custom-styles';
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
  
    style.textContent = `
      .twitch-custom-container {
        position: relative;
        background: 
          linear-gradient(
            rgba(0, 0, 0, ${currentStyles.darkness}),
            rgba(0, 0, 0, ${currentStyles.darkness})
          ),
          url("${currentStyles.bgImage}") !important;
        background-size: cover !important;
        background-attachment: fixed !important;
        transform: translateZ(0); /* GPU acceleration */
      }
      .twitch-custom-container::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        backdrop-filter: blur(${safeBlur}px);
        -webkit-backdrop-filter: blur(${safeBlur}px);
        z-index: 0;
        pointer-events: none; /* Improve performance */
      }
      .chat-line__message {
        background: transparent !important;
      }
    `;
  
    // Add class if not present
    if (!chatContainer.classList.contains('twitch-custom-container')) {
      chatContainer.classList.add('twitch-custom-container');
    }
  }
  
  // Throttled update (max 1 update per 200ms)
  let updateTimeout;
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.bgImage || changes.darkness || changes.blur) {
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => {
        chrome.storage.local.get(['bgImage', 'darkness', 'blur'], (result) => {
          currentStyles = {
            bgImage: result.bgImage || '',
            darkness: result.darkness || 0,
            blur: result.blur || 0
          };
          applyOptimizedStyles();
        });
      }, 200);
    }
  });
  
  // Initial load
  chrome.storage.local.get(['bgImage', 'darkness', 'blur'], (result) => {
    currentStyles = {
      bgImage: result.bgImage || '',
      darkness: result.darkness || 0,
      blur: result.blur || 0
    };
    applyOptimizedStyles();
  });