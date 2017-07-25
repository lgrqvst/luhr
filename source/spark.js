var Spark = function(x, y, vx, vy, angle, intensity, color) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  // this.orientation = orientation; // Up, down, left, right
  this.angle = angle;
  this.intensity = intensity;
  this.color = color;
  this.alpha = 1;
};
Spark.prototype = {
  draw: function() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    let rads = this.angle * Math.PI / 180;
    let rand = Math.round(Math.random() * 15) + 4;
    let x = this.x - Math.cos(rads) * this.intensity / rand;
    let y = this.y + Math.sin(rads) * this.intensity / rand;
    ctx.lineTo(x, y);
    ctx.strokeStyle = "rgba(" + this.color.r + "," + this.color.g + "," + this.color.b +"," + this.alpha + ")";
    ctx.lineWidth = 1;
    ctx.stroke();
  },
  spark: function() {
    this.vy += g;
    this.x += this.vx;
    this.y += this.vy;
  },
  fade: function() {
    if (this.alpha > 0) {
      this.alpha -= 0.1;
    }
  }
};
