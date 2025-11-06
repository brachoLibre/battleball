window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/engine/renderer.js',
  exports: ['Renderer'],
  dependencies: []
});

window.Renderer = {
  canvas: null,
  ctx: null,

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
    }
  },

  clear() {
    if (this.ctx && this.canvas) {
      this.ctx.fillStyle = '#2a5f2a';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  },

  drawField() {
    if (!this.ctx || !this.canvas) return;
    
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Field lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;

    // End zones
    ctx.fillStyle = 'rgba(100, 150, 100, 0.3)';
    ctx.fillRect(0, 0, 100, height);
    ctx.fillRect(width - 100, 0, 100, height);

    // Center line
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 80, 0, Math.PI * 2);
    ctx.stroke();

    // End zone lines
    ctx.beginPath();
    ctx.moveTo(100, 0);
    ctx.lineTo(100, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width - 100, 0);
    ctx.lineTo(width - 100, height);
    ctx.stroke();
  },

  drawCircle(x, y, radius, color) {
    if (this.ctx) {
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  },

  drawRect(x, y, width, height, color) {
    if (this.ctx) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, width, height);
    }
  },

  drawText(text, x, y, color = '#ffffff', size = 16) {
    if (this.ctx) {
      this.ctx.fillStyle = color;
      this.ctx.font = `${size}px monospace`;
      this.ctx.fillText(text, x, y);
    }
  }
};