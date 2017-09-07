# RAVr

A small game I started making to learn more about canvas, to strengthen my JavaScript and to brush up on my trigonometry.

Note: I decided to start over from scratch. This whole thing started as an improvised project, and the things I wanted to add increased exponentially as I went along, until it got to the point where I just didn't feel like touching the code anymore. I still feel it has potential though, both as a learning opportunity for myself, and in terms of its value as a game. Flying the ship is fun, and I want to make it a more complete experience. I also changed the name to RAVr. I'll come up with what the acronym means later.

Play the old version [here](https://lgrqvst.github.io/ravr/old/build/).

The new version [here](https://lgrqvst.github.io/ravr/build/)

### Objectives:

-  Gather macguffins with your ship, then land and return them to base.
-  Destroy threats to protect buildings.
-  Don't die.

### Controls:

(These refer to the old version linked above. Controls for the new version will be largely the same, but with more stuff added on. See below for details of what has been implemented.)

Q - Engine on/off  
W - Main thruster  
A - Turn counter-clockwise  
D - Turn clockwise  
S - Boost (Drains engine power quickly)  
E - Stabilizers (Drains engine power)  
F - Replenish engine power  
R - Rotate to face up  
T - Maintain current vector

## TO DO

### Ship
- [ ] Rewrite the old ship
- [ ] Ship starts on landing pad
- [ ] The stabilizer ring from the previous design should extend when the ship starts, and retract when the engine is turned off.
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

### Controls

- [ ] Q - Engine on/off
- [ ] W - Main thruster
- [ ] A - Turn counter-clockwise
- [ ] D - Turn clockwise
- [ ] S - Boost (Drains engine power quickly)
- [ ] E - Stabilizers (Drains engine power)
- [ ] F - Replenish engine power (Drains fuel)
- [ ] R - Rotate to face up
- [ ] C - Toggle harvesting (Decreases responsiveness) _(not yet implemented)_
- [ ] X - Toggle landing gear _(not yet implemented)_
- [ ] T (or maybe some other key) - Maintain current vector
- [ ] space - Fire front cannon _(not yet implemented)_
- [ ] mouse - Turn turret _(not yet implemented)_
- [ ] left click - Fire turret _(not yet implemented)_

### Environment

- [ ] Air resistance slows down horizontal movement
- [ ] Wind
- [x] Particle pulsation
- [x] Particle flicker
- [ ] Particles regenerate/reform after a certain time
- [ ] Make number of particles depend on viewport size
- [ ] Obstacles
- [ ] Enemies
- [ ] Threats
- [ ] Procedurally generated clouds?
- [x] A moon gently moving across the screen
- [ ] More moons?
- [ ] Handle the moon when it goes off-screen
- [x] Procedurally generated mountains
- [ ] Procedurally generated buildings
- [ ] Make the buildings prettier. I like the contrast of something being there, but they need to look better.
- [x] Procedurally generated trees
- [x] Trees sway in the wind
- [ ] Trees react to proximity of ship
- [ ] Buildings and mountains should move slightly depending on where the ship is, parallax-like
- [x] Landing pad/base
- [ ] Maybe at some point in time expand a bit on the landing pad design
- [ ] Make the landing pad land-able
- [ ] No-particle areas
- [ ] Smoke in addition to sparks
- [ ] Power-ups
- [ ] Add occasional lines in the sky to indicate wind, cartoon style
- [ ] Some stars in the sky near the top of the screen
- [ ] Add a bit of ground at the bottom. Not aesthetically pleasing to have the trees right at the bottom of the screen.

### UI

- [ ] Engine status
- [ ] Engine power
- [ ] Fuel
- [ ] Fuel drain
- [ ] Ship status/health/hull integrity
- [ ] Ship rotation
- [ ] Altitude
- [ ] Vertical speed
- [ ] Horizontal speed
- [ ] Thruster indication
- [ ] Box for subtitles, dialogue, etc.
- [ ] Wind direction and strength
- [ ] Add acronym meaning to the title screen
- [ ] Add phonetic reading to the title screen
- [ ] Something something Japanese to the title screen?? Nice aesthetic maybe?
- [ ] About link on title screen

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
