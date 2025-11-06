window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/core/input.js',
  exports: ['Input', 'keys'],
  dependencies: []
});

window.Input = {
  keys: {},
  
  init() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      
      // Prevent default for space to avoid page scrolling
      if (e.key === ' ') {
        e.preventDefault();
      }
      
      // Fullscreen toggle
      if (e.shiftKey && e.key === 'F') {
        e.preventDefault();
        const canvas = document.getElementById('gameCanvas');
        if (!document.fullscreenElement) {
          canvas.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  },

  isKeyDown(key) {
    return this.keys[key] || false;
  }
};

window.keys = window.Input.keys;