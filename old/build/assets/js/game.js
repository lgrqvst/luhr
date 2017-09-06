//@codekit-append sprite.js
//@codekit-append dust.js
//@codekit-append exhaust.js
//@codekit-append thrusterexhaust.js
//@codekit-append spark.js
//@codekit-append main.js

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

var Dust = function() {
  this.x = Math.round(Math.random() * w);
  this.y = Math.round(Math.random() * h);
  this.r = Math.round(Math.random() * 10);
  this.color = "rgba(" + (Math.round(Math.random() * 50 + 200)) + "," + (Math.round(Math.random() * 50 + 200)) + "," + (Math.round(Math.random()) * 50 + 200) + "," + 0.3 + ")";
  // this.color = {
  //   r: Math.random() * 50 + 200,
  //   g: Math.random() * 50 + 200,
  //   b: Math.random() * 50 + 200,
  // };
  this.driftdistance = 25;
  this.targetX = this.x + (this.driftdistance - Math.round(Math.random() * this.driftdistance * 2));
  this.targetY = this.y + (this.driftdistance - Math.round(Math.random() * this.driftdistance * 2));
  return this;
};
Dust.prototype = {
  draw: function() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  },
  drift: function() {
    let x = (this.targetX - this.x) / (Math.round(Math.random() * 400) + 100);
    let y = (this.targetY - this.y) / (Math.round(Math.random() * 400) + 100);
    this.x += x;
    this.y += y;
    if (this.x > w + this.r) this.x = 0;
    if (this.x < 0 - this.r) this.x = w;
    if (this.y > h + this.r) this.y = 0;
    if (this.y < 0 - this.r) this.y = h;
    if (Math.abs(this.targetX - this.x) < 10 || Math.abs(this.targetX - this.x) > 100) this.targetX = this.x + (this.driftdistance - Math.round(Math.random() * this.driftdistance * 2));
    if (Math.abs(this.targetY - this.y) < 10 || Math.abs(this.targetY - this.y) > 100) this.targetY = this.y + (this.driftdistance - Math.round(Math.random() * this.driftdistance * 2));
  },
  pulsate: function() {

  },
  shrink: function() {

  }
};

var Exhaust = function(x = sprite.x, y = sprite.y, c = {r: 255, g: 255, b: 255}, length, thickness, targetX, targetY) {
  this.x = x;
  this.y = y;
  this.alpha = 1;
  this.color = c;
  this.length = length;
  this.thickness = thickness;
  this.targetX = targetX;
  this.targetY = targetY;
  this.angle = sprite.rotation; // Used to generate sparks
  this.age = 0;
  return this;
};
Exhaust.prototype = {
  draw: function() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    // ctx.lineTo((this.targetX - (this.targetX - this.x)) / 10, (this.targetY - (this.targetY - this.y)) / 10);
    // ctx.lineTo(this.targetX, this.targetY);
    ctx.lineTo(this.x - (this.x - this.targetX) / this.length, this.y - (this.y - this.targetY) / this.length);
    let color = "rgba(" + this.color.r + "," + this.color.g + "," + this.color.b + "," + this.alpha + ")";
    ctx.strokeStyle = color;
    ctx.lineWidth = this.thickness * this.age / maxExhaust;
    // ctx.lineWidth = this.thickness;
    ctx.stroke();
  },
  fade: function() {
    if (this.alpha > 0) {
      this.alpha -= 0.01;
    }
  },
  drift: function() {
    this.x -= (this.x - this.targetX) / 10;
    this.y -= (this.y - this.targetY) / 10;
    if(this.x > w) {
      this.x = 0;
      this.targetX -= w;
    }
    if(this.x < 0) {
      this.x = w;
      this.targetX += w;
    }
  }
};

var ThrusterExhaust = function(x,y,vx,vy,c) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.color = c;
  this.alpha = 1;
};
ThrusterExhaust.prototype = {
  draw: function() {
    ctx.beginPath();
    // ctx.arc(this.x, this.y, Math.random() * 7, 0, 2 * Math.PI);
    ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(" + this.color.r + "," + this.color.g + "," + this.color.b + "," + this.alpha + ")";
    ctx.fill();
  },
  drift: function() {
    if (this.vx < 0) this.vx += airResistance;
    if (this.vx > 0) this.vx -= airResistance;
    if (this.vy < 0) this.vy += airResistance;
    if (this.vy > 0) this.vy -= airResistance;

    this.vy -= g;

    this.x += this.vx;
    this.y += this.vy;
  },
  fade: function() {
    if (this.alpha > 0) {
      this.alpha -= 0.1;
    }
  }
};

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

'use strict';

// Intersection code snagged from http://www.kevlindev.com/gui/math/intersection/index.htm

function Intersection(status) {
    if ( arguments.length > 0 ) {
        this.init(status);
    }
}
Intersection.prototype.init = function(status) {
    this.status = status;
    this.points = new Array();
};

var intersectLineLine = function(a1, a2, b1, b2) {
    var result;

    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

    if ( u_b != 0 ) {
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;

        if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
            result = new Intersection("Intersection");
            result.points.push({
                x: a1.x + ua * (a2.x - a1.x),
                y: a1.y + ua * (a2.y - a1.y)
            });
        } else {
            result = new Intersection("No Intersection");
        }
    } else {
        if ( ua_t == 0 || ub_t == 0 ) {
            result = new Intersection("Coincident");
        } else {
            result = new Intersection("Parallel");
        }
    }

    return result;
};

const w = window.innerWidth;
const h = window.innerHeight;

function getContext(w, h) {
  var canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = w || window.innerWidth;
  canvas.height = h || window.innerHeight;
  return canvas.getContext("2d");
}

var ctx = getContext(w, h);

var g = 0.03;
var airResistance = 0.5;
// var g = 0;
// var wind = 0.3;

var maxExhaust = 200;

var sprite = new Sprite();

var dust = [];

for (var i = 0; i < 500; i++) {
  let d = new Dust();
  dust.push(d);
}

var exhaust = [];

var thrusterexhaust = [];

var sparks = [];

var controls = {
  w: false,
  a: false,
  s: false,
  d: false,
  e: false
}

window.addEventListener('keydown',function(e) {
  // console.log(e.which);
  let code = e.which;
  if (code === 87) controls.w = true;
  if (code === 65) controls.a = true;
  if (code === 83) controls.s = true;
  if (code === 68) controls.d = true;
  if (code === 69) controls.e = true;
  if (code === 82) controls.r = true;
  if (code === 84) controls.t = true;
});

window.addEventListener('keyup',function(e) {
  let code = e.which;
  if (code === 87) controls.w = false;
  if (code === 65) controls.a = false;
  if (code === 83) controls.s = false;
  if (code === 68) controls.d = false;
  if (code === 69) controls.e = false;
  if (code === 82) controls.r = false;
  if (code === 84) controls.t = false;
  if (code === 81) {
    sprite.engineOn = sprite.engineOn ? false : true;
  }
  if (code === 70 && sprite.engineOn) {
    sprite.engineOutput += 100;
  }
});

function update() {
  sprite.adjustThrusters();

  dust.forEach(function(e) {
    e.drift();
    e.pulsate();
  });

  exhaust.forEach(function(e,i) {
    e.drift();
    e.fade();
    e.age = i;

    var is = intersectLineLine({x:0,y:h},{x:w,y:h},{x:e.x,y:e.y},{x:e.x - (e.x - e.targetX) / e.length, y:e.y - (e.y - e.targetY) / e.length});
    if (is.status === "Intersection") {
      let x = is.points[0].x;
      let y = is.points[0].y;
      let a = sprite.rotation + Math.round(Math.random() * 120) - 60;
      let i = sprite.engineOutput;
      let rads = a * Math.PI / 180;
      let vx = Math.cos(rads) * i / 50 * -1;
      let vy = Math.sin(rads) * i / 50;
      let c = {
        r: Math.round(Math.random(50) + 200),
        g: Math.round(Math.random(50) + 200),
        b: Math.round(Math.random(50) + 200)
      }
      if (controls.s) {
        i *= 5;
        c = {r: Math.round(Math.random(50) + 200), g: 150, b: 150};
      }
      if (controls.w) {
        i *= 2
      }
      if (controls.e) {
        i *= 1;
        c = {r: 150, g: 150, b: Math.round(Math.random(50) + 200)};
      }
      let s = new Spark(x,y,vx,vy,a,i,c);
      sparks.push(s);
      if (sparks.length > 200) sparks.shift();
    }
  });

  // Control sparks
  let s = []
  sparks.forEach(function(e) {
    e.spark();
    e.fade();
    if(e.alpha > 0) {
      s.push(e);
    }
  });
  sparks = s;

  let t = []
  thrusterexhaust.forEach(function(e) {
    e.drift();
    e.fade();
    if(e.alpha > 0) {
      t.push(e);
    }
  });
  thrusterexhaust = t;

  if (sprite.engineOn) {
    // Determine energy line length and thickness.
    if (controls.s) {
      sprite.currentPowerMod += (sprite.boostPowerMod - sprite.currentPowerMod)/ 50;
      if (sprite.boostPowerMod - sprite.currentPowerMod < 0.05) sprite.currentPowerMod = sprite.boostPowerMod
    } else if (controls.e) {
      sprite.currentPowerMod += (sprite.thrusterPowerMod - sprite.currentPowerMod)/ 50;
      if (sprite.currentPowerMod - sprite.thrusterPowerMod < 0.05) sprite.currentPowerMod = sprite.thrusterPowerMod;
    } else {
      sprite.currentPowerMod += (sprite.standardPowerMod - sprite.currentPowerMod) / 50;
      if (Math.abs(sprite.currentPowerMod - sprite.standardPowerMod) < 0.05) sprite.currentPowerMod = sprite.standardPowerMod;
    }

    // Lets engineOutput rise slowly when engine is started. Don't increse output while engaging thrusters
    if (sprite.engineOutput < 100 && !controls.e) {
      sprite.engineOutput += 0.25;
    }
  }

  // If engine has any power, the craft can be controlled
  if (sprite.engineOutput > 0) {
    sprite.primaryFuel -= 1 * sprite.currentPowerMod;

    if (controls.w) {
      let rads = sprite.rotation * Math.PI / 180;

      sprite.vy += Math.sin(rads) * sprite.movespeed * sprite.engineOutput / 100;
      sprite.vx += Math.cos(rads) * sprite.movespeed * sprite.engineOutput / 100;
    }

    if (controls.t) {
      let rads = sprite.rotation * Math.PI / 180;

      sprite.vy += Math.sin(rads) * g * sprite.engineOutput / 100;
      sprite.vx += Math.cos(rads) * g * sprite.engineOutput / 100;
    }

    if (controls.s) {
      let rads = sprite.rotation * Math.PI / 180;

      sprite.vy += Math.sin(rads) * sprite.boostspeed * sprite.engineOutput / 100;
      sprite.vx += Math.cos(rads) * sprite.boostspeed * sprite.engineOutput / 100;

      sprite.engineOutput -= 0.75;
    }

    if (controls.e) {
      sprite.vy -= sprite.vy / 10;
      sprite.vx -= sprite.vx / 20;

      sprite.engineOutput -= 0.5;
    }

    if (controls.a) {
      if (sprite.engineOutput < 100) {
        sprite.rotation -= sprite.turnspeed * sprite.engineOutput / 100;
      } else {
        sprite.rotation -= sprite.turnspeed;
      }
    }

    if (controls.d) {
      if (sprite.engineOutput < 100) {
        sprite.rotation += sprite.turnspeed * sprite.engineOutput / 100;
      } else {
        sprite.rotation += sprite.turnspeed;
      }
    }

    //  Rotate to face up
    if (controls.r && sprite.rotation !== 270) {
      let r = sprite.rotation;
      let d = Math.abs((270 - r) / 10);
      if (d < 2) d = 2;
      if (r < 270 && r >= 90) {
        sprite.rotation += d;
      } else {
        sprite.rotation -= d;
      }
      if (r >= 269 && r <= 271) sprite.rotation = 270;
    }

    if (sprite.rotation < 0) sprite.rotation = 360;
    if (sprite.rotation > 360) sprite.rotation = 0;
  }

  // Generate main engine exhaust if engine is outputting power
  if (sprite.engineOn) {
    let c = {r: 255, g: 255, b: 255};
    let l = 10;
    let t = 1;
    let d = 1;
    if (controls.s) {
      c = {r:200, g: 100, b: 100};
      l = 1;
      t = 3;
      d = 2;
    }
    if (controls.w) {
      l = 5;
      t = 2;
      d = 1.25;
    }
    if (controls.e) {
      c = {r: 200, g: 200, b: 255};
      l = 10;
      t = 1;
      d = 0.75;
    }
    let rads = sprite.rotation * Math.PI / 180;
    let x = sprite.x + Math.cos(rads) * sprite.engineOutput * sprite.currentPowerMod * d * -1;
    let y = sprite.y + Math.sin(rads) * sprite.engineOutput * sprite.currentPowerMod * d * -1;
    let e = new Exhaust(sprite.x, sprite.y, c, l, t, x, y);
    exhaust.push(e);
    if (exhaust.length > maxExhaust) exhaust.shift();
  }

  //Generate thruster exhaust if engine is outputting power and thrusters are engaged
  if (sprite.engineOn && controls.e) {
    // let rads = sprite.balancingThruster + 45;
    // let x1 = sprite.x + Math.cos(rads) * 10;
    // let y1 = sprite.y + Math.sin(rads) * 10;
    // rads = sprite.balancingThruster - 45;
    // let x2 = sprite.x + Math.cos(rads) * 10;
    // let y2 = sprite.y + Math.sin(rads) * 10;
    // let vx1 = Math.cos(sprite.balancingThruster + 45) * 5;
    // let vx2 = Math.cos(sprite.balancingThruster - 45) * 5;
    // let vy1 = Math.sin(sprite.balancingThruster + 45) * 5;
    // let vy2 = Math.sin(sprite.balancingThruster - 45) * 5;
    let c = {
      r: 150,
      g: 150,
      b: 255
    }
    // let t1 = new ThrusterExhaust(x1,y1,vx1,vy1,c);
    // let t2 = new ThrusterExhaust(x2,y2,vx2,vy2,c);

    // thrusterexhaust.push(t1);
    // thrusterexhaust.push(t2);
  }

  // If engine output is really high, have it dissipate faster. That engine's not built to handle this much energy!!
  if (sprite.engineOutput > 100) {
    sprite.engineOutput -= (sprite.engineOutput - 100) / 50;
    if (sprite.engineOutput < 101) sprite.engineOutput = 100;
  }

  // Engine slowly dies when turned off.
  if (!sprite.engineOn && sprite.engineOutput > 0) {
    sprite.engineOutput--;
  }

  if (sprite.y !== h - sprite.radius) {
    sprite.vy += g;
  }

  sprite.y += sprite.vy;

  if (sprite.y > h -sprite.radius) {
    sprite.y = h -sprite.radius;
    sprite.vy *= -0.33;
  }

  sprite.x += sprite.vx;

  if (sprite.y === h - sprite.radius) {
    sprite.vx *= 0.75;
  }

  // if (sprite.x > w) sprite.x = w;
  // if (sprite.x < 0) sprite.x = 0;

  if (sprite.x > w) sprite.x = 0;
  if (sprite.x < 0) sprite.x = w;

  sprite.vx = Math.round(sprite.vx * 1000) / 1000;
  sprite.vy = Math.round(sprite.vy * 1000) / 1000;
}

function draw() {
  ctx.clearRect(0,0,w,h);

  exhaust.forEach(function(e) {
    e.draw();
  });

  sparks.forEach(function(e) {
    e.draw();
  });

  thrusterexhaust.forEach(function(e) {
    e.draw();
  });

  dust.forEach(function(e) {
    if (Math.sqrt(Math.pow(Math.abs(e.x - sprite.x),2) + Math.pow(Math.abs(e.y - sprite.y),2)) < sprite.engineOutput * sprite.currentPowerMod && sprite.engineOutput > 0) {
      ctx.beginPath();
      ctx.moveTo(e.x, e.y);
      ctx.lineTo(sprite.x, sprite.y);
      ctx.strokeStyle = "rgba(255,255,255," + Math.random() * 0.5 + ")";
      ctx.lineWidth = 1 * sprite.currentPowerMod;
      if (controls.s) {
        ctx.strokeStyle = "rgba(" + Math.round(Math.random() * 155 + 100) + "," + Math.round(Math.random() * 155 + 100) + ",0," + Math.random() * 0.5 + ")";
        ctx.lineWidth = 1.5 * sprite.currentPowerMod;
      }
      if (controls.e) {
        ctx.strokeStyle = "rgba(" + Math.round(Math.random() * 50 + 100) + "," + Math.round(Math.random() * 50 + 100) + "," + Math.round(Math.random() * 55 + 200) + "," + Math.random() * 0.5 + ")";
        ctx.lineWidth = 1.5 / sprite.currentPowerMod;
      }
      ctx.stroke();
      ctx.lineWidth = 1;
    }
    e.draw();
  });
  sprite.draw();
}

var frame = setInterval(function() {
  update();
  draw();
}, 10);


//# sourceMappingURL=game.js.map