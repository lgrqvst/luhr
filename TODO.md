# TO DO

## Ship
- [x] Rewrite the old ship
- [x] Ship starts on landing pad
- [ ] Draw the wings separately from the main fuselage
- [ ] Make wings fold backwards (in a smoothly animated fashion) when boosting
- [ ] When the ship starts up, have the cockpit lights flicker.
- [x] The stabilizer ring from the previous design should extend when the ship starts, and retract when the engine is turned off.
- [ ] Rethink the stabilizer ring, and give it a mechanical effect if I decide to keep it
- [ ] The stabilizer ring should fold out in a more interesting fashion
- [ ] Fuel
- [ ] Particles restore fuel
- [ ] Visible stabilizers
- [ ] Stabilizer exhaust
- [ ] Rudder or maneuvering thrusters when turning (maybe at the wingtips?)
- [ ] Landing gear
- [ ] Adjust behaviour when craft is in contact with the ground, like rocking gently or rolling, rather than stopping abruptly or rotating in the same spot
- [ ] Forward cannon
- [ ] Turret (controlled by mouse)
- [ ] Have different weapons be individually powered
- [ ] AoE weapon
- [ ] Ammunition types
- [ ] Make flight dependent on presence of particles??? Maybe not
- [ ] Health / HP
- [ ] Explosion upon death
- [ ] Craft breaks apart on crash
- [ ] More details on the body (maybe red and green lights for port/starboard?) (or maybe some sort of markings on the wings?)
- [x] Shading on body (difficult maybe)
- [ ] Handle ship going off-screen
- [x] Clean up exhaust
- [x] Handle exhaust outside of handleShip()
- [ ] Animate more parts of the ship
- [x] Possibly rewrite the workings of the ship engine? Doesn't feel quite the way I want it to right now.
- [x] Make engine boosting dangerous
- [x] Figure out how the heck I want the engines to work
- [ ] Shields

## Controls

- [x] W - Main thruster
- [x] A - Turn counter-clockwise
- [x] D - Turn clockwise
- [x] S - Boost
- [x] T - Power up ship
- [x] Y - Start/Stop generator
- [x] U - Activate/Deactivate shields
- [x] I - Activate/Deactivate weapons
- [x] H - Activate/Deactivate harvesting array
- [x] O - Set generator load to 100%
- [x] K - Set generator load to 50%
- [x] M - Set generator load to 0%
- [x] P - Increase generator load
- [x] L - Decrease generator load
- [ ] E - Stabilizers (???) I don't know. Thinking about skipping this one. I think maybe this makes landings too easy?
- [ ] R - Rotate to face up (Is this one really needed?)
- [ ] X - Toggle landing gear
- [ ] Strafing-type controls (E and Q maybe???)
- [ ] space - Fire front cannon
- [ ] mouse - Turn turret
- [ ] left click - Fire turret
- [ ] Prevent right click
- [ ] Fine tune control balance
- [ ] Control to open and close the dome on the landing pad (if the dome is closed the ship can't land, and the landing pad will be treated like background)

## Environment

- [x] Air resistance slows down horizontal movement
- [x] Wind
- [x] Particle pulsation
- [x] Particle flicker
- [ ] Particle activity changes depending on distance to ship
- [ ] Particle activity should be more frantic when being harvested
- [ ] Particles regenerate/reform after a certain time
- [ ] Make number of particles depend on viewport size
- [ ] Sparks when exhaust touches ground and landing pad
- [ ] Smoke-type exhaust should not disappear "under" ground, but should billow out instead
- [ ] Obstacles
- [ ] Enemies
- [ ] Threats
- [ ] Procedurally generated clouds?
- [ ] A bit ambitious perhaps, but floating cities in the far distance?
- [x] A moon gently moving across the screen
- [ ] More moons?
- [ ] Handle the moon when it goes off-screen
- [x] Procedurally generated mountains
- [ ] Procedurally generated buildings
- [ ] Make the buildings prettier. I like the contrast of something being there, but they need to look way better.
- [x] Procedurally generated trees
- [x] Trees sway in the wind
- [ ] Trees react to proximity of ship
- [ ] Grass on the ground
- [ ] Grass sways in wind
- [ ] Grass reacts to proximity of ship
- [ ] Grass and trees set on fire by exhaust???
- [x] Buildings and mountains should move slightly depending on where the ship is, parallax-like
- [x] Landing pad/base
- [x] Animate shadow on landing pad based on position of moon
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
- [ ] Messaging system to populate the message log on certain events (but only once)

## Game

- [ ] Rewrite what I had before
- [ ] Sounds
- [ ] Music
- [ ] Intro
- [ ] Main menu
- [ ] Pause screen
- [ ] Help screen
- [ ] Wave-type levels. For every new wave, maybe something in the environment changes. Enemy-types, obstacle-types, background, music, power-ups, what-have-you
- [ ] Landings are fun, so give the player a reason to have to (or to want to) make landings not just on the landing pad but out in the forest as well.
- [ ] Check that math again.
- [ ] Structure and clean up code. Make it conform to best practices.
- [ ] Maybe wrap the whole thing in Electron to make a nice desktop apps for all platforms

## Other

- [ ] Rewrite the gulpfile so it's better. I mistype 'watch' every dang time.

## Goals that probably won't happen but hey you never know

- [ ] A store to buy upgrades with the stuff you collect
- [ ] High score board
- [ ] Multiplayer (yeah right)
- [ ] Ship customization
