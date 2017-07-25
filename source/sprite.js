var Sprite = function() {
  this.x = Math.round(w / 2);
  // this.y = Math.round(h / 2);
  this.y = Math.round(h);
  this.vx = 0;
  this.vy = 0;
  this.radius = 15;
  this.rotation = 270;
  this.movespeed = 0.05;
  this.boostspeed = 0.1;
  this.currentPowerMod = 0;
  this.standardPowerMod = 1;
  this.boostPowerMod = 1.5;
  this.thrusterPowerMod = 0.5;
  this.turnspeed = 3;
  this.engineOn = false;
  this.engineOutput = 0;
  this.primaryFuel = 1000;
  this.secondaryFuel = 250;
  this.thruster1Default = 45;
  this.thruster2Default = 135;
  this.thruster1Current = 45;
  this.thruster2Current = 135
  this.thrusterTest = 0;

  return this;
};
Sprite.prototype = {
  draw: function() {

    let rads = 0;

    rads = this.rotation * Math.PI / 180;

    let r = this.radius;

    // MOVE THIS FUNCTION OUT OF THIS METHOD FOR USE IN OTHER PLACES...
    let xy = function(x1, y1) {
      let l = Math.sqrt(x1 * x1 + y1 * y1);
      if (x1 < 0 && y1 < 0) l *= -1;

      let r1 = Math.asin(y1 / l);
      if (x1 < 0) r1 = Math.acos(x1 / l);

      let r2 = (sprite.rotation) * Math.PI / 180;
      let r3 = r1 + r2;
      let x2 = sprite.x + Math.cos(r3) * l;
      let y2 = sprite.y + Math.sin(r3) * l;

      return {
        x: x2,
        y: y2
      };
    };

    let xy2 = function(x1, y1) {
      let l = Math.sqrt(x1 * x1 + y1 * y1);
      if (x1 < 0 && y1 < 0) l *= -1;

      let r1 = Math.asin(y1 / l);
      if (x1 < 0) r1 = Math.acos(x1 / l);

      let r2 = (sprite.rotation) * Math.PI / 180;
      let r3 = r1 + r2;
      let x2 = sprite.x + Math.cos(r1) * l;
      let y2 = sprite.y + Math.sin(r1) * l;

      return {
        x: x2,
        y: y2,
        a: r1 / Math.PI * 180
      };
    };

    let a = {};

    // Thrusters

    if (controls.e) {

      ctx.beginPath();

      a = xy2(this.vx / 10, this.vy / 10);

      ctx.moveTo(a.x, a.y);

      a = xy2(this.vx * 50, this.vy * 50);

      ctx.lineTo(a.x, a.y);

      ctx.strokeStyle = "#F00";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Stabilizer ring

    ctx.beginPath();

    ctx.arc(this.x, this.y, r, 0, 2 * Math.PI);

    ctx.closePath();

    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = r / 10;
    ctx.stroke();

    // Engine

    ctx.beginPath();
    a = xy(r * -0.15, r * 0.125);
    ctx.moveTo(a.x, a.y);

    a = [
      xy(r * -0.4, r * 0.2),
      xy(r * -0.45, r * 0.175),

      xy(r * -0.45, r * -0.175),
      xy(r * -0.4, r * -0.2),

      xy(r * -0.15, r * -0.125)
    ]

    a.forEach(function(e) {
      ctx.lineTo(e.x, e.y);
    });

    ctx.closePath();

    ctx.fillStyle = "#333";
    ctx.fill();

    ctx.beginPath();
    a = xy(r * -0.3, r * 0.1);
    ctx.moveTo(a.x, a.y);
    a = xy(r * 0.05, r* 0.5);
    ctx.lineTo(a.x, a.y);

    a = xy(r * -0.4, r * 0.1);
    ctx.moveTo(a.x, a.y);
    a = xy(r * -0.05, r* 0.5);
    ctx.lineTo(a.x, a.y);

    a = xy(r * -0.3, r * -0.1);
    ctx.moveTo(a.x, a.y);
    a = xy(r * 0.05, r* -0.5);
    ctx.lineTo(a.x, a.y);

    a = xy(r * -0.4, r * -0.1);
    ctx.moveTo(a.x, a.y);
    a = xy(r * -0.05, r* -0.5);
    ctx.lineTo(a.x, a.y);

    ctx.strokeStyle = "#333";
    ctx.lineWidth = r / 20;
    ctx.stroke();

    // Shading

    // Add some sweet shading here to different parts of the main body depending on the craft rotation.
    // E.g. if rotation is 0, add a darker layer on the right side of the craft. If rotation is 270, maybe to the bottom of the wings. 285, maybe start covering up the right side of the craft slightly, but keep like the wingtips bright.
    // Fade out depending on current rotational distance from max rendering rotation for specific shadow

    // Main body

    ctx.beginPath();
    a = xy(r * 1.2, r * 0.05);
    ctx.moveTo(a.x, a.y);

    a = [
      xy(r * 0.3475, r * 0.475),
      xy(r * 0.35, r * 0.55),
      xy(r * 0.3, r * 0.575),
      xy(r * 0.25, r * 0.425),
      xy(r * 0.2, r * 0.45),
      xy(r * 0.25, r * 0.6),
      xy(r * 0.2, r * 0.6),
      xy(r * 0.15, r * 0.5),
      xy(r * 0.1, r * 0.5),
      xy(r * 0, r * 0.85),
      xy(r * -0.15, r * 0.975),
      xy(r * -0.2, r * 1.2),
      xy(r * -0.3, r * 1.2),
      xy(r * -0.25, r * 0.75),
      xy(r * -0.375, r * 0.525),
      xy(r * -0.75, r * 0.675),
      xy(r * -0.8, r * 0.665),
      xy(r * -0.4, r * 0.5),
      xy(r * -0.2, r * 0.4),
      xy(r * -0.1, r * 0.2),
      xy(r * -0.15, r * 0.15),

      xy(r * -0.15, r * -0.15),
      xy(r * -0.1, r * -0.2),
      xy(r * -0.2, r * -0.4),
      xy(r * -0.4, r * -0.5),
      xy(r * -0.8, r * -0.665),
      xy(r * -0.75, r * -0.675),
      xy(r * -0.375, r * -0.525),
      xy(r * -0.25, r * -0.75),
      xy(r * -0.3, r * -1.2),
      xy(r * -0.2, r * -1.2),
      xy(r * -0.15, r * -0.975),
      xy(r * 0, r * -0.85),
      xy(r * 0.1, r * -0.5),
      xy(r * 0.15, r * -0.5),
      xy(r * 0.2, r * -0.6),
      xy(r * 0.25, r * -0.6),
      xy(r * 0.2, r * -0.45),
      xy(r * 0.25, r * -0.425),
      xy(r * 0.3, r * -0.575),
      xy(r * 0.35, r * -0.55),
      xy(r * 0.3475, r * - 0.475),

      xy(r * 1.2, r * -0.05)
    ]

    a.forEach(function(e) {
      ctx.lineTo(e.x, e.y);
    });

    ctx.closePath();

    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fill();

    // Main viewport

    ctx.beginPath();
    a = xy(r * 1, r * 0.075);
    ctx.moveTo(a.x, a.y);

    a = [
      xy(r * 0.4, r * 0.35),
      xy(r * 0.375, r * 0.275),
      xy(r * 0.5, r * 0.15),

      xy(r * 0.5, r * -0.15),
      xy(r * 0.375, r * -0.275),
      xy(r * 0.4, r * -0.35),

      xy(r * 1, r * -0.075)
    ]

    a.forEach(function(e) {
      ctx.lineTo(e.x, e.y);
    });

    ctx.closePath();

    ctx.fillStyle = "#447";
    if (this.engineOn) ctx.fillStyle = "#88a";
    ctx.fill();

    ctx.beginPath();
    a = xy(r * 1, r * 0.075);
    ctx.moveTo(a.x, a.y);

    a = [
      xy(r * 0.5, r * 0.15),
      xy(r * 0.5, r * -0.15),

      xy(r * 1, r * -0.075)
    ]

    a.forEach(function(e) {
      ctx.lineTo(e.x, e.y);
    });

    ctx.closePath();

    ctx.fillStyle = "#447";
    if (this.engineOn) ctx.fillStyle = "#bbd";
    ctx.fill();

    // ctx.beginPath();
    // ctx.moveTo(this.x, this.y);
    // ctx.arc(this.x, this.y, 2, rads, rads + 2 * Math.PI);
    // ctx.fillStyle = "rgba(255,255,255,1)";
    // ctx.fill();

    // console.log(this.x,this.y,a.x,a.y);

    // THIS IS THE OLD MODEL.
    // Base circle
    // ctx.beginPath();
    // ctx.moveTo(this.x, this.y);
    // ctx.arc(this.x, this.y, 10, rads, rads + 2 * Math.PI);
    // ctx.fillStyle = "rgba(255,255,255,1)";
    // ctx.fill();

    // Window
    // ctx.beginPath();
    // ctx.moveTo(this.x, this.y);
    // ctx.arc(this.x, this.y, 8, rads + 1.75 * Math.PI, rads + 2.25 * Math.PI);
    // ctx.fillStyle = "rgba(0,0,0,0.25)";
    // ctx.fill();

    // Cover bottom of window
    // ctx.beginPath();
    // ctx.moveTo(this.x, this.y);
    // ctx.arc(this.x, this.y, 2, rads + 1.5 * Math.PI, rads + 2.5 * Math.PI);
    // ctx.fillStyle = "rgba(255,255,255,1)";
    // ctx.fill();
  },
  adjustThrusters: function() {
    if (!this.balancingThruster) this.balancingThruster = 90;

    // Only move the thrusters into position if they're engaged. Otherwise move them back to default position.
    if (controls.e) {

    } else {

    }

    // THE ONES BELOW WEREN'T REALLY WHAT I WAS AFTER, AND SO, WERE ABANDONED WITHOUT MERCY.
    let doit = false;
    if (this.engineOn && doit) {
      // console.log(this.vx, this.vy);
      let vx = this.vx;
      let vy = this.vy;

      let a = Math.asin(Math.abs(vy) / Math.sqrt(Math.pow(Math.abs(vx),2) + Math.pow(Math.abs(vy),2))) / Math.PI * 180;

      let b = 0;
      if (vx >= -1 && vx <= 1 && vy > 1) {
        a = 90;
      } else if (vx < -1 && vy > 1) {
        b = 90;
      } else if (vx < -1 && vy >= -1 && vy <= 1) {
        a = 180;
      } else if (vx < -1 && vy < -1) {
        b = 180;
      } else if (vx >= -1 && vx <= 1 && vy < -1) {
        a = 270;
      } else if (vx > 1 && vy > -1) {
        b = 270;
      } else if (vx > 1 && vy >= -1 && vy <= 1) {
        a = 0;
      }
      a += b;

      // this.balancingThruster += Math.round((a - this.balancingThruster) / 10);
    }

    if (this.engineOn && doit) {
      // let h1 = Math.pow(this.vx, 2);
      // let h2 = Math.pow(this.vy, 2);
      // let h = h1 + h2;
      let h = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      let a = Math.acos(this.vx / h) / Math.PI * 180;
      // a = a / Math.PI * 180 + 180;
      // a = a - this.balancingThruster;
      // a = a / 5;
      a = Math.round(a);

      // this.balancingThruster = a;
    } else {
      // this.balancingthruster = 0;
    }
  }
};
