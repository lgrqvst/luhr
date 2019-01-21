# TO DO

- [ ] Figure out new To Do list

## Ship

- [ ] Rewrite the old ship
- [ ] Ship starts on landing pad
- [ ] Draw the wings separately from the main fuselage
- [ ] Make wings fold backwards (in a smoothly animated fashion) when boosting
- [ ] When the ship starts up, have the cockpit lights flicker.
- [ ] The stabilizer ring from the previous design should extend when the ship starts, and retract when the engine is turned off.
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
- [ ] Shading on body (difficult maybe)
- [ ] Handle ship going off-screen
- [ ] Clean up exhaust
- [ ] Handle exhaust outside of handleShip()
- [ ] Animate more parts of the ship
- [ ] Possibly rewrite the workings of the ship engine? Doesn't feel quite the way I want it to right now.
- [ ] Make engine boosting dangerous
- [ ] Figure out how the heck I want the engines to work
- [ ] Shields

## Controls

- [ ] W - Main thruster
- [ ] A - Turn counter-clockwise
- [ ] D - Turn clockwise
- [ ] S - Boost
- [ ] T - Power up ship
- [ ] Y - Start/Stop generator
- [ ] U - Activate/Deactivate shields
- [ ] I - Activate/Deactivate weapons
- [ ] H - Activate/Deactivate harvesting array
- [ ] O - Set generator load to 100%
- [ ] K - Set generator load to 50%
- [ ] M - Set generator load to 0%
- [ ] P - Increase generator load
- [ ] L - Decrease generator load
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

- [ ] Air resistance slows down horizontal movement
- [ ] Wind
- [ ] Particle pulsation
- [ ] Particle flicker
- [ ] Particle parallax effect
- [ ] Particle activity changes depending on distance to ship
- [ ] Particle activity should be more frantic when being harvested
- [ ] Particles regenerate/reform after a certain time
- [ ] Make number of particles depend on viewport size
- [ ] Sparks when exhaust touches ground and landing pad
- [ ] Smoke-type exhaust should not disappear "under" ground, but should billow out instead
- [ ] Obstacles
- [ ] Floating mines
- [ ] Enemies
- [ ] Threats
- [ ] Procedurally generated clouds?
- [ ] A bit ambitious perhaps, but floating cities in the far distance?
- [ ] A moon gently moving across the screen
- [ ] More moons?
- [ ] Handle the moon when it goes off-screen
- [ ] Aurora borealis in the sky behind the mountains?
- [ ] Procedurally generated mountains
- [ ] Procedurally generated buildings
- [ ] Make the buildings prettier. I like the contrast of something being there, but they need to look way better.
- [ ] Procedurally generated trees
- [ ] Trees sway in the wind
- [ ] Trees react to proximity of ship
- [ ] Grass on the ground
- [ ] Grass sways in wind
- [ ] Grass reacts to proximity of ship
- [ ] Grass and trees set on fire by exhaust???
- [ ] Buildings and mountains should move slightly depending on where the ship is, parallax-like
- [ ] Landing pad/base
- [ ] Animate shadow on landing pad based on position of moon
- [ ] Add a dome to the landing pad that open/closes when the ship leaves and takes off
- [ ] Maybe at some point in time expand a bit on the landing pad design
- [ ] Make the landing pad land-able
- [ ] No-particle areas
- [ ] Smoke in addition to sparks
- [ ] Power-ups
- [ ] Add occasional lines in the sky to indicate wind, cartoon style
- [ ] Some stars in the sky near the top of the screen
- [ ] Add a bit of ground at the bottom. Not aesthetically pleasing to have the trees right at the bottom of the screen.

## UI / HUD

### Status indicators

- [ ] Generator
- [ ] Shields
- [ ] Weapons I
- [ ] Weapons II ?
- [ ] Weapons III ??
- [ ] Harvesting
- [ ] Engine
- [ ] Ship is on battery power

### Power channels

- [ ] General
- [ ] Shields
- [ ] Weapons
- [ ] Harvesting
- [ ] Engine
- [ ] Battery charging
- [ ] Emergency power charging
- [ ] Venting

### Stores

- [ ] Fuel I
- [ ] Fuel II
- [ ] Oxidizer
- [ ] Coolant
- [ ] Ammunition I
- [ ] Ammunition II
- [ ] Ammunition III
- [ ] Loaded macguffins / Cargo hold status

### Bars and meters

- [ ] Generator load
- [ ] Generator output
- [ ] Generator temperature
- [ ] Shield strength
- [ ] Shield condition
- [ ] Weapon I strength
- [ ] Weapon II strength
- [ ] Weapon II ready to fire
- [ ] Weapon III strength
- [ ] Weapon III ready to fire
- [ ] Engine output
- [ ] Engine temperature
- [ ] Fuel
- [ ] Fuel consumption
- [ ] Ship health

### Ship sensors and indicators

- [ ] Ship states
- [ ] Ship rotation
- [ ] Altitude
- [ ] Vertical speed
- [ ] Horizontal speed
- [ ] Current acceleration
- [ ] Thruster indicators
- [ ] Ground proximity alert and other warnings/indications
- [ ] Distance to landing pad
- [ ] Wind direction and strength

### Other in-game UI items

- [ ] Message log
- [ ] Messaging system to populate the message log on certain events (but only once)
- [ ] Box for subtitles, dialogue, etc.
- [ ] Score (Profit earned or total macguffins collected or whatever)
- [ ] Leveling status
- [ ] Wave number
- [ ] Some sort of indicator that points to the ship when it goes off-screen (assuming that continues to be possible)

### Menu screens

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
