document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const elements = {
        imageInput: document.getElementById('imageInput'),
        darknessSlider: document.getElementById('darknessSlider'),
        darknessValue: document.getElementById('darknessValue'),
        blurSlider: document.getElementById('blurSlider'),
        blurValue: document.getElementById('blurValue'),
        resetBtn: document.getElementById('resetBtn')
    };

    // Default values (with your 0.00 darkness)
    const DEFAULTS = {
        bgImage: '',
        darkness: 0.00,
        blur: 0
    };

    // Current state
    let currentSettings = {...DEFAULTS};

    // Initialize
    loadSettings();

    // Event listeners
    elements.imageInput.addEventListener('change', handleImageUpload);
    elements.darknessSlider.addEventListener('input', updateDarkness);
    elements.blurSlider.addEventListener('input', updateBlur);
    elements.resetBtn.addEventListener('click', resetSettings);

    // Functions
    function loadSettings() {
        chrome.storage.local.get(['bgImage', 'darkness', 'blur'], (result) => {
            currentSettings = {
                bgImage: result.bgImage || DEFAULTS.bgImage,
                darkness: result.darkness ?? DEFAULTS.darkness,
                blur: result.blur ?? DEFAULTS.blur
            };
            updateUI();
        });
    }

    function updateUI() {
        elements.darknessSlider.value = currentSettings.darkness;
        elements.darknessValue.textContent = `${Math.round(currentSettings.darkness * 100)}%`;
        elements.blurSlider.value = currentSettings.blur;
        elements.blurValue.textContent = `${currentSettings.blur}px`;
    }

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                currentSettings.bgImage = event.target.result;
                saveCurrentSettings();
            };
            reader.readAsDataURL(file);
        }
    }

    function updateDarkness() {
        const value = parseFloat(elements.darknessSlider.value);
        currentSettings.darkness = value;
        elements.darknessValue.textContent = `${Math.round(value * 100)}%`;
        saveCurrentSettings();
    }

    function updateBlur() {
        const value = parseFloat(elements.blurSlider.value);
        currentSettings.blur = value;
        elements.blurValue.textContent = `${value}px`;
        saveCurrentSettings();
    }

    function saveCurrentSettings() {
        chrome.storage.local.set({
            bgImage: currentSettings.bgImage,
            darkness: currentSettings.darkness,
            blur: currentSettings.blur
        });
    }

    function resetSettings() {
        if (confirm("Reset all settings to default?")) {
            currentSettings = {...DEFAULTS};
            elements.imageInput.value = '';
            saveCurrentSettings();
            updateUI();
            reloadTwitchTabs();
        }
    }

    function reloadTwitchTabs() {
        chrome.tabs.query({url: "*://*.twitch.tv/*"}, (tabs) => {
            tabs.forEach(tab => chrome.tabs.reload(tab.id));
        });
    }
});