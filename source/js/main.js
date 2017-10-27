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
