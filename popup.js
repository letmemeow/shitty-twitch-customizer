document.addEventListener('DOMContentLoaded', () => {
    const elements = {
      imageInput: document.getElementById('imageInput'),
      darknessSlider: document.getElementById('darknessSlider'),
      darknessValue: document.getElementById('darknessValue'),
      blurSlider: document.getElementById('blurSlider'),
      blurValue: document.getElementById('blurValue'),
      perfMode: document.getElementById('perfMode'),
      resetBtn: document.getElementById('resetBtn')
    };
  
    // Defaults (with your 0.00 darkness)
    const DEFAULTS = {
      bgImage: '',
      darkness: 0.00,
      blur: 0,
      perfMode: false
    };
  
    // Load settings
    chrome.storage.local.get(DEFAULTS, (result) => {
      elements.darknessSlider.value = result.darkness;
      elements.blurSlider.value = result.blur;
      elements.perfMode.checked = result.perfMode;
      updateUI();
    });
  
    // Event listeners
    elements.imageInput.addEventListener('change', handleImageUpload);
    elements.darknessSlider.addEventListener('input', updateDarkness);
    elements.blurSlider.addEventListener('input', updateBlur);
    elements.perfMode.addEventListener('change', togglePerfMode);
    elements.resetBtn.addEventListener('click', resetSettings);
  
    function handleImageUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (event) => {
        chrome.storage.local.set({ bgImage: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  
    function updateDarkness() {
      const value = parseFloat(elements.darknessSlider.value);
      elements.darknessValue.textContent = `${Math.round(value * 100)}%`;
      chrome.storage.local.set({ darkness: value });
    }
  
    function updateBlur() {
      let value = parseFloat(elements.blurSlider.value);
      if (elements.perfMode.checked) {
        value = Math.min(value, 3); // Limit to 3px in perf mode
      }
      elements.blurValue.textContent = `${value}px`;
      chrome.storage.local.set({ blur: value });
    }
  
    function togglePerfMode() {
      const perfMode = elements.perfMode.checked;
      chrome.storage.local.set({ perfMode });
      if (perfMode && elements.blurSlider.value > 3) {
        elements.blurSlider.value = 3;
        updateBlur();
      }
    }
  
    function resetSettings() {
      if (confirm("Reset all settings to default?")) {
        chrome.storage.local.set(DEFAULTS);
        elements.darknessSlider.value = DEFAULTS.darkness;
        elements.blurSlider.value = DEFAULTS.blur;
        elements.perfMode.checked = DEFAULTS.perfMode;
        elements.imageInput.value = '';
        updateUI();
      }
    }
  
    function updateUI() {
      elements.darknessValue.textContent = 
        `${Math.round(elements.darknessSlider.value * 100)}%`;
      elements.blurValue.textContent = `${elements.blurSlider.value}px`;
    }
  });