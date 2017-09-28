# TO DO

## Ship
- [x] Rewrite the old ship
- [x] Ship starts on landing pad
- [ ] Draw the wings separately from the main fuselage
- [ ] Make wings fold backwards when boosting
- [ ] When the ship starts up, have the cockpit lights flicker.
- [x] The stabilizer ring from the previous design should extend when the ship starts, and retract when the engine is turned off.
- [ ] The stabilizer ring should fold out in a more interesting fashion
- [ ] Fuel
- [ ] Particles restore fuel
- [ ] Visible stabilizers
- [ ] Stabilizer exhaust
- [ ] Rudder or maneuvering thrusters when turning (maybe at the wingtips?)
- [ ] Landing gear
- [ ] Adjust behaviour when craft is in contact with the ground, like rocking gently or rolling, rather than stopping abruptly or rotating in the same spot
- [ ] Slow-firing forward cannon
- [ ] Quick-firing turret (controlled by mouse)
- [ ] AoE weapon
- [ ] Ammunition types
- [ ] Make flight dependent on presence of particles
- [ ] Health / HP
- [ ] Explosion upon death
- [ ] Craft breaks apart on crash
- [ ] More details on the body (maybe red and green lights for port/starboard?)
- [ ] Shading on body
- [ ] Handle ship going off-screen
- [x] Clean up exhaust
- [x] Handle exhaust outside of handleShip()
- [ ] Animate more parts of the ship
- [ ] Add some flame when the engines are firing
- [ ] Possibly rewrite the workings of the ship engine? Doesn't feel quite the way I want it to right now.
- [ ] Make engine boosting dangerous

## Controls

- [x] Q - Engine on/off
- [x] W - Main thruster
- [x] A - Turn counter-clockwise
- [x] D - Turn clockwise
- [x] S - Boost (Drains engine output quickly)
- [ ] E - Stabilizers (???)
- [x] F - Boost engine output (Drains more fuel)
- [ ] R - Rotate to face up (Is this one really needed?)
- [ ] C - Toggle harvesting (Decreases responsiveness) _(not yet implemented)_
- [ ] X - Toggle landing gear _(not yet implemented)_
- [ ] T (or maybe some other key) - Maintain current vector (might skip this one, but it was in the first version)
- [ ] space - Fire front cannon _(not yet implemented)_
- [ ] mouse - Turn turret _(not yet implemented)_
- [ ] left click - Fire turret _(not yet implemented)_
- [ ] Prevent right click
- [ ] Fine tune control balance

## Environment

- [x] Air resistance slows down horizontal movement
- [x] Wind
- [x] Particle pulsation
- [x] Particle flicker
- [ ] Particles regenerate/reform after a certain time
- [ ] Make number of particles depend on viewport size
- [ ] Sparks when exhaust touches ground and landing pad
- [ ] Obstacles
- [ ] Enemies
- [ ] Threats
- [ ] Procedurally generated clouds?
- [x] A moon gently moving across the screen
- [ ] More moons?
- [ ] Handle the moon when it goes off-screen
- [x] Procedurally generated mountains
- [ ] Procedurally generated buildings
- [ ] Make the buildings prettier. I like the contrast of something being there, but they need to look way better.
- [x] Procedurally generated trees
- [x] Trees sway in the wind
- [ ] Trees react to proximity of ship
- [x] Buildings and mountains should move slightly depending on where the ship is, parallax-like
- [x] Landing pad/base
- [ ] Add a dome to the landing pad that open/closes when the ship leaves and takes off
- [ ] Maybe at some point in time expand a bit on the landing pad design
- [x] Make the landing pad land-able
- [ ] No-particle areas
- [ ] Smoke in addition to sparks
- [ ] Power-ups
- [ ] Add occasional lines in the sky to indicate wind, cartoon style
- [ ] Some stars in the sky near the top of the screen
- [ ] Add a bit of ground at the bottom. Not aesthetically pleasing to have the trees right at the bottom of the screen.

## UI / HUD

- [ ] Engine status
- [x] Engine output
- [ ] Fuel
- [ ] Fuel consumption
- [ ] Ammunition
- [ ] Weapon indicator
- [ ] Ship status/health/hull integrity
- [x] Ship rotation
- [x] Altitude
- [x] Vertical speed
- [x] Horizontal speed
- [x] Current acceleration
- [ ] Ship states
- [ ] Thruster indications
- [ ] Ground proximity alert and other warnings/indications
- [ ] Distance to landingpad
- [ ] Box for subtitles, dialogue, etc.
- [ ] Wind direction and strength
- [ ] Loaded macguffins / Cargo hold status
- [ ] Score (Profit earned or total macguffins collected or whatever)
- [ ] Leveling status
- [ ] Wave number
- [ ] Add acronym meaning to the title screen
- [ ] Add phonetic reading to the title screen
- [ ] Something something Japanese to the title screen?? Nice aesthetic maybe?
- [ ] About link on title screen

## Game

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

## Goals that probably won't happen but hey you never know

- [ ] A store to buy upgrades with the stuff you collect
- [ ] High score board
- [ ] Multiplayer (yeah right)
- [ ] Ship customization
