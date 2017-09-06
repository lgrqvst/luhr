# RAVr

A small game to learn more about canvas, to strengthen my JavaScript and to brush up on my trigonometry.

Note: I decided to start over from scratch. This whole thing started as an improvised project, and the things I wanted to add increased exponentially as I went along, until it got to the point where I just didn't feel like touching the code anymore. I still feel it has potential though, both as a learning experience for my self, and in terms of its value as a game. Flying the ship is fun, and I want to make it a more complete experience. I also changed the name to RAVr. I'll come up with what the acronym means later.

Play the old version [here](https://lgrqvst.github.io/ravr/old/build).

### Objectives:

-  Gather macguffins with your ship, then land and return them to base.
-  Destroy threats to protect buildings.
-  Don't die.

### Controls:

(The _not implemented_ refers to the old version linked above. In the new version _nothing_ is implemented yet.)

Q - Engine on/off  
W - Main thruster  
A - Turn counter-clockwise  
D - Turn clockwise  
S - Boost (Drains engine power quickly)  
E - Stabilizers (Drains engine power)  
F - Replenish engine power (Drains fuel)  
R - Rotate to face up  
C - Toggle harvesting (Decreases responsiveness) _(not yet implemented)_  
X - Toggle landing gear _(not yet implemented)_  
space - Fire front cannon _(not yet implemented)_  
mouse - Turn turret _(not yet implemented)_  
left click - Fire turret _(not yet implemented)_  

## TO DO

### Ship
- [ ] Rewrite the old ship
- [ ] Fuel
- [ ] Particles restore fuel
- [ ] Visible stabilizers
- [ ] Stabilizer exhaust
- [ ] Rudder or maneuvering thrusters when turning (maybe at the wingtips?)
- [ ] Landing gear
- [ ] Adjust behaviour when craft is in contact with the ground, like rolling, rather than stopping abruptly
- [ ] Slow-firing forward cannon
- [ ] Quick-firing turret (controlled by mouse)
- [ ] AoE weapon
- [ ] Ammunition types
- [ ] Make flight dependent on presence of particles
- [ ] Health / HP
- [ ] Explosion upon death
- [ ] Craft breaks apart on crash
- [ ] Render a copy of the craft on the other side when crossing over horizontally
- [ ] More details on the body (maybe red and green lights for port/starboard?)
- [ ] Shading on body


### Environment

- [ ] Air resistance slows down horizontal movement
- [ ] Wind
- [x] Particle pulsation
- [x] Particle flicker
- [ ] Particles regenerate/reform after a certain time
- [ ] Obstacles
- [ ] Enemies
- [ ] Threats
- [ ] Terrain
- [ ] Buildings
- [ ] Background landscape (css?)
- [ ] No-particle areas
- [ ] Sparks when exhaust touches terrain
- [ ] Smoke in addition to sparks
- [ ] Safe landing pads
- [ ] Power-ups

### UI

- [ ] Engine status
- [ ] Engine power
- [ ] Fuel
- [ ] Fuel drain
- [ ] Ship status/health
- [ ] Ship rotation
- [ ] Altitude
- [ ] Vertical speed
- [ ] Horizontal speed
- [ ] Thruster indication
- [ ] Box for subtitles, dialogue, etc.

### Game

- [ ] Rewrite what I had before
- [ ] Sounds
- [ ] Music
- [ ] Intro
- [ ] Main menu
- [ ] Pause screen
- [ ] Help screen
- [ ] Wave-type levels. For every new wave, maybe something in the environment changes. Enemy-types, obstacle-types, background, music, power-ups, what-have-you
- [ ] Check that math again.
- [ ] Structure and clean up code. Make it conform to best practices.
