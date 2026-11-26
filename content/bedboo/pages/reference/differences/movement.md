# Movement and physics

How player movement, server corrections, looking, sprinting, flight, elytra gliding, and vehicle control differ between Java and Bedrock, and how bedboo's physics engine reproduces the Bedrock rules. Measured on BDS 1.26.51.1 (protocol 2193, bedrock-protocol 3.60.1): the bot recorded every `player_auth_input` it sent and every `correct_player_move_prediction` it received. When the server is started with `player-position-acceptance-threshold=0.001` and every sent position is offset by +5 blocks, the server never adopts the client position, so each correction (about every 6 ticks) carries the server's own simulation state. The engine was fitted until it reproduced those states offline.

## Movement engine  {#engine}

- **Affects:** `bot.physics` (and every field below), `bot.physics.simulatePlayer`, `bot.entity.velocity`,
  mineflayer-pathfinder's simulations, `bot.physics.stepHeight`, `negligeableVelocity`, `soulsandSpeed`,
  `honeyblockSpeed`, `honeyblockJumpSpeed`, `ladderMaxSpeed`, `playerHeight` (sneaking), `slowFalling`,
  `sprintingUUID`.
- **Java:** prismarine-physics (Java 1.8–1.21 rules), client-authoritative position packets.
- **Bedrock:** movement is server-authoritative with rewind: the client sends one `player_auth_input` per tick
  (eye-level position, move vector, yaw, input flags, `delta`), and BDS simulates the same inputs and corrects positions
  that move further than its own result (or by more than the acceptance threshold). Measured rules that differ from
  Java:
  - float32 positions and velocities; the server takes the yaw from the float32 degrees on the wire and uses precise
    sine/cosine (no 65536-entry table), so a diagonal walk matches only with precise trigonometry;
  - the move vector is normalized (a diagonal is (0.7071, 0.7071)), × 0.3 while sneaking, × 0.98;
  - order of one tick: speed + friction from the previous tick's ground state → move vector → jump → climb → stuck
    blocks → sneak edge avoidance → collide (Y, X, Z) with auto-step → step-on slowdown / bounce → gravity + drag →
    friction; the reported `delta` is the velocity at the end of the tick (standing still: (0, −0.0784, 0));
  - friction comes from the block at floor(pos − 0.5), or else the block supporting the box, or else 0.6 — standing on an
    edge or walking off a ledge never uses air's 0.9;
  - auto-step 0.5625 (Java 0.6); `negligeableVelocity` is 1e-6 (velocity is zeroed only when |v|² \< 1e-12);
  - jump: vy = max(vy, 0.42 + 0.1 × jump boost), sprint-jump +0.2, 10-tick delay while held; honey jump × 0.6
    (Java 0.5);
  - sneak edge avoidance shrinks the box by 0.025, probes 1.01 × step height down, and clips the velocity itself; the
    sneaking box is 1.49 high (measured; `SNEAK_HEIGHT` in `lib/bedrock/constants.js`, also used for the `height` of
    crouching players);
  - climbing: falls at most 0.2/tick (Java 0.15); holding jump climbs 0.2/tick (then gravity: delta 0.1176); pushing
    against the climbable keeps 0.2 as the end-of-tick velocity (delta 0.2); no horizontal clamp; sneaking holds on;
  - collisions treat penetrations below 1e-4 as contact (float32 positions end up slightly inside the faces they rest
    against);
  - water gravity 0.005 (gravity / 16), lava 0.02; bubble columns act per block with the Java values;
  - soul sand: ground speed × 0.544 (Java: velocity × 0.4); honey and slime: × (0.4 + 0.2 × |vy|) on the step (Java
    honey: velocity × 0.4); slime bounces only when landing from the air;
  - slow falling applies only while already falling (vy \< 0) — the first tick from rest still uses 0.08;
  - using an item: the impulse is clamped and sprinting stops; a raised shield is a plain sneak (see
    [item use slowdown](#item-use-slowdown));
  - BDS does not simulate the first input it processes after a teleport (see [corrections](#corrections));
  - creative flight: see [creative flight](#flight).
- **bedboo:** `lib/physics/engine.js` (a prismarine-physics 1.11.1 fork) implements these rules with the upstream
  module shape:
  - `bot.physics` keeps the 31 upstream field names, with Bedrock values: `stepHeight` 0.5625, `negligeableVelocity`
    1e-6, `soulsandSpeed` 0.544, `honeyblockSpeed` 0.4 (the base of the step-on slowdown), `honeyblockJumpSpeed` 0.6,
    `ladderMaxSpeed` 0.2, `waterGravity` 0.005, `sprintingUUID` = Bedrock's "Sprinting speed boost" modifier;
  - `simulatePlayer(state, world)` accepts prismarine-physics `PlayerState`s (pathfinder) and bedboo's own
    (`require('bedboo/lib/physics').PlayerState`);
  - `require('minecraft-data')(bot.version)` resolves to the Bedrock data (upstream API contract) so prismarine-physics'
    `PlayerState` works;
  - measured on 60 s walking laps: 0 corrections at the default acceptance threshold, and at most 1 per 100 ticks at 0.1.

## Server corrections, teleports, knockback, effects  {#corrections}

- **Affects:** `forcedMove`, `move`, `bot.entity.position` / `velocity`.
- **Java:** the server sends absolute or relative `position` packets; the client confirms the teleport.
- **Bedrock:** sends `move_player` (teleport/reset) for teleports, `correct_player_move_prediction` (position at eye
  level, `delta` = end-of-tick velocity, `on_ground`, `tick` of the corrected input) for mispredictions, and
  `set_entity_motion` for knockback. There are no relative teleports. Measured behavior: `move_player.tick`,
  `set_entity_motion.tick`, `mob_effect.tick`, and `update_attributes.tick` carry the last input the server processed;
  it applies the change from the next input on and does not simulate the first input it receives after a teleport.
- **bedboo:**
  - keeps a history of the last `rewind_history_size` (+20) inputs; a correction rewinds to its tick, applies the
    server state, and replays the inputs since (`forcedMove` is emitted);
  - teleports: sets position to the target, sets velocity to 0, and sets `handled_teleport` in the next input; inputs
    already in flight are re-simulated from the target, and otherwise the next input is not simulated;
  - knockback, effects, and movement speed changes with a `tick` rewrite the inputs already sent from that tick on and
    re-simulate them (the server still sends one correction for the input in flight; its state matches bedboo's);
  - velocity "relative" teleports do not exist; `set_entity_motion` sets the velocity.

## Input stream and suspension  {#input}

- **Affects:** `physicsTick`, movement packets while no chunk is loaded or during loading screens.
- **Java:** sends position packets only when something changes (or once a second); sends no packets during the
  configuration phase; runs no physics without a chunk.
- **Bedrock:** sends one `player_auth_input` per server tick, always (the server drives the player from it); has no
  configuration phase — loading screens, dimension changes, and death suspend the stream
  (`bot._bedrock.input.suspend`).
- **bedboo:** without a loaded column, the bot neither simulates nor emits `physicsTick`, but keeps sending its
  unchanged position; while the input queue is suspended, nothing is sent.

## Looking  {#look}

- **Affects:** `bot.look`, `bot.lookAt`, `bot.physics.yawSpeed`, `bot.physics.pitchSpeed`.
- **Java:** the yaw sent to the server turns by at most `yawSpeed` per tick; `look` resolves once the server receives
  the final rotation.
- **Bedrock:** rotation is part of every `player_auth_input` (yaw, pitch, head yaw, interact rotation, and camera
  orientation); the server moves the player using that yaw.
- **bedboo:** uses the same sensitivity rounding and `force` semantics as upstream; the new yaw and pitch go out in
  full in the next input (no gradual turn — that tick's movement already uses them, matching the server); `look`
  resolves once that input is sent (≤ 1 tick), or immediately with `force`. `yawSpeed` and `pitchSpeed` keep their
  upstream values but are unused.

## Sneak / sprint before a click  {#controls-before-clicks}

- **Affects:** `bot.setControlState('sneak' | 'sprint')` followed immediately by a click (`placeBlock` / `activateBlock`
  against an interactable block, `attack` with sprint knockback, `useOn`); `bot._bedrock.physics.controlsSent()`.
- **Java:** mineflayer writes `entity_action` / `player_input` inside `setControlState`, so the next click is handled
  with the new state.
- **Bedrock:** sneaking and sprinting exist only as `player_auth_input` flags (`start_sneaking`, `sneaking`, …), sent
  once per tick; BDS handles any transaction queued before that input with the old state (verified on BDS 1.26.51.1: a
  sneak-click on a chest opened it instead of placing the held block).
- **bedboo:** clicks that depend on the state wait for the input that carries it: `useItemOn` and `useOnEntity`
  (`lib/bedrock/transactions.js`) await `bot._bedrock.physics.controlsSent()` when a sneak or sprint change is
  pending; the synchronous `bot.attack`, `useOn`, and `mount` (`lib/plugins/entities.js`) send through
  `afterControlsSent(fn)` (see [attacking and using entities](entities.md#interact)). The click runs at most one tick
  (50 ms) later than upstream's; when nothing is pending, it is queued synchronously. If the input stream is suspended
  first (loading screen, dimension change), the click goes out immediately; after `end`, it is dropped
  (`controlsSent()` rejects). As a result, sneaking followed immediately by `useItemOn` against a chest places the
  block instead of opening the chest.

## A double-tapped forward sprints  {#double-tap-sprint}

- **Affects:** `bot.setControlState('forward', …)` toggled quickly (mineflayer-pathfinder's short moves, or a tap followed by a hold), `bot.entity.position` / corrections while walking.
- **Java:** double-tap sprinting is a client feature; mineflayer never sprints unless the `sprint` control is set.
- **Bedrock:** BDS detects the double tap itself from the input's `up` key flag: pressing forward again within 6 ticks of the previous press makes the player sprint (with no sprint flag needed) until forward is released (measured on 1.26.51.1: press-to-press of 6 ticks sprints, 7 does not; without predicting this, a tap for 3 ticks → 1 tick off → hold caused 3 corrections in 3 s). Because the `up` flag also drives movement, it cannot be withheld.
- **bedboo:** the physics plugin predicts this just like the vanilla client (which sprints on a double tap on its own): such a second press triggers a sprint (`sprinting` / `start_sprinting` in the input, with no sprint key) while forward is held and sprinting is possible (not flying or riding, not sneaking or backing up, no item in use, food above 6, and not stopped by a wall; a teleport or death ends it). Like any Bedrock sprint, it is [sticky](#sticky-sprint): `setControlState('sprint', false)` does **not** end it while forward stays held, because BDS keeps the sprint speed (predicting a walk there causes a correction about every 27 ticks—for example, under mineflayer-pathfinder, which releases the sprint control every tick while walking). Every toggle pattern tested produced no corrections, and the server's position matched the bot's. `getControlState('sprint')` stays false. Creative `flyTo` avoids the double tap instead ([creative flight](#flight)).

## A sprint lasts until forward is released  {#sticky-sprint}

- **Affects:** `bot.setControlState('sprint', false)` while `forward` stays held (mineflayer-pathfinder's walking branches, or user code that sprints for a while), and the bot's speed.
- **Java:** releasing the sprint control sends `stop_sprinting`; the player walks starting on the next tick.
- **Bedrock:** a sprint is sticky (measured on 1.26.51.1): once the player sprints—via the sprint flag or a double tap—BDS keeps the sprint speed while forward is held, even after a `stop_sprinting` (it clears the `sprinting` actor flag but re-sends the movement attribute with its "Sprinting speed boost" until forward is released). The vanilla client behaves the same way (letting go of the sprint key does not stop a sprint). Walking at 0.1 then causes a correction about every 27 ticks.
- **bedboo:** the physics plugin keeps sprinting (and reporting `sprinting`, with no `stop_sprinting`) after the sprint control is released, until forward is released or another end condition applies: sneaking, backing up, hitting a wall, food ≤ 6 in survival, an item in use, flying, riding, a teleport, or a death. `getControlState('sprint')` reports the control state (false). To continue at walking speed, release `forward` (for at least 7 ticks if the previous press was within 6 ticks, or the re-press will trigger a [double tap](#double-tap-sprint)).

## Item use slowdown and the raised shield  {#item-use-slowdown}

- **Affects:** movement while `bot.usingHeldItem` is active (eating, drawing a bow, or raising a shield).
- **Java:** mineflayer's physics does not slow down for item use at all.
- **Bedrock:** BDS clamps the movement impulse to ±0.1225 and drops the sprint modifier while the player uses an item—a state it enters only on a `click_air` transaction; a held sprint key resumes sprinting afterwards. Because a shield is raised by sneaking (no item use), BDS simulates a plain sneak (measured: 3.81 blocks per 60 ticks for both).
- **bedboo:** the engine applies the item-use clamp only while `bot.usingHeldItem` is set and a `click_air` was sent for that use (observed on the outgoing transactions; `item_release` / `completed_using_item` end it). A raised shield (`activateItem(true)`) moves just like a sneak, without corrections. See also [item use](inventory.md#item-use).

## Creative flight and flyTo  {#flight}

- **Affects:** `bot.creative.flyTo` / `startFlying` / `stopFlying`, `bot.physics.gravity`,
  `bot._bedrock.physics.setFlying`.
- **Java:** the client toggles `abilities.flying` itself; `startFlying` sets `bot.physics.gravity = 0` and
  `stopFlying` restores it; upstream `flyTo` moves `bot.entity.position` in 0.5-block steps per tick by setting it
  directly (no physics).
- **Bedrock:** flight is a server-side movement state. BDS starts and stops flight on `request_ability flying` (the
  auth-input `start_flying` flag alone is ignored), reports it with `update_abilities`, and simulates it
  server-side:
  - +0.15 / −0.22 vertical per tick of jump / sneak, 0.6 vertical drag, 0.91 horizontal drag, no sprint bonus, and an
    extra × 0.375 damping without input (flight stops within a few ticks);
  - double-tapping jump (two presses a few ticks apart) also toggles flight on the server;
  - double-tapping forward makes BDS sprint-fly (at about twice the speed), and BDS stops flight when the player
    touches the ground.
- **bedboo:**
  - `bot.creative.startFlying` / `stopFlying` call `bot._bedrock.physics.setFlying(on)`, which sends `request_ability`
    right before the next input (+ `start_flying` / `stop_flying`), and leave `bot.physics.gravity` untouched (a
    gravity of 0 would outlive a flight that the server refused or ended — on a game mode change or death — and break all later
    movement and pathfinder simulations). Without the physics plugin's flight hook, upstream's gravity handling
    applies;
  - the engine follows `bot.abilities` (parsed from `update_abilities`, from which game mode changes are also derived);
    server-side changes send no request back (see [abilities](survival.md#abilities));
  - `bot.creative.flyTo(destination)` delegates to `bot._bedrock.physics.flyTo` (or falls back to upstream's step loop without it) and
    flies using real inputs: every tick it chooses between forward-toward-the-target × jump / sneak / nothing by simulating each
    choice (then idling until stopped) with the engine; it never re-presses jump within 12 ticks (a guard kept across
    consecutive `flyTo` calls), never re-presses forward within 10 ticks of releasing it (preventing double-tap sprint
    flight), and never lands short of a destination above the landing spot; it resolves once stopped within 0.15
    block (upstream: exactly at the destination) and rejects when flight stops, on a teleport, or when blocked for 60
    ticks;
  - measured: a 15 s hover and `flyTo` flights with zero corrections. Real flight is slower than upstream's
    teleport steps: the 11 short legs of mineflayer's bee example take about 15.5 s (Java: about 3 s).

## Elytra  {#elytra}

- **Affects:** `bot.elytraFly`, `bot.entity.elytraFlying`, firework boosts while gliding.
- **Java:** `entity_action start_elytra_flying`.
- **Bedrock:** `start_gliding` in `player_auth_input`; BDS accepts it only together with a jump press
  (`jump_pressed_raw`, `jumping`, `start_jumping`, …) and confirms it with the `gliding` actor flag; it can end the glide
  by clearing the flag. The glide itself follows the Java formula. During continuous rocket use, BDS fires about one rocket
  every 2 ticks (20 uses → about 10 rockets) and corrects a boosted glide about every 6 ticks.
- **bedboo:** uses the same checks and errors as upstream (reading the chest slot from `bot.inventory`, or from the raw armor
  window without the inventory plugin); gliding is predicted starting from the next input and dropped when the server clears
  the flag (rewinding from that tick) or has not confirmed it after 20 ticks. The start of a boost is recorded in that
  tick's input and replayed so that a correction does not erase it. For rocket detection (`usedFirework`,
  `bot.fireworkRocketDuration`), see [firework boosts](entities.md#fireworks); a plain `firework_rocket` from the
  creative inventory receives its default `Fireworks {Flight: 1}` variant ([creative
  defaults](inventory.md#creative-defaults)).

## Vehicles  {#vehicles}

- **Affects:** `bot.moveVehicle`.
- **Java:** `steer_vehicle` / `player_input`.
- **Bedrock:** the rider's `player_auth_input` carries the move vector, `client_predicted_vehicle` with the vehicle's
  unique ID and rotation, and paddle flags for boats.
- **bedboo:** `moveVehicle(left, forward)` retains the input until changed (upstream semantics), and the provider sends
  it every tick while `bot.vehicle` is set; no player physics run while riding. For mounting and links, see
  [vehicles](entities.md#vehicle-entities).

## Riding control  {#riding-control}

- **Affects:** `bot.moveVehicle` with `bot.mount` / `bot.dismount`.
- **Java:** the client simulates the ridden vehicle and sends `vehicle_move` / `steer_vehicle`.
- **Bedrock:** the rider's `player_auth_input` carries the move vector (plus paddle flags for boats) and the predicted vehicle ID and rotation. From this, BDS simulates the boat or horse (a boat moves at about 7 blocks/s on water and turns with one paddle; a horse follows the rider's yaw). The client does not predict vehicle physics. BDS reconciles the vehicle with a `correct_player_move_prediction { prediction_type: 'vehicle' }` every 6 ticks, while the rider receives no player correction. Dismounting a horse teleports the rider next to it; for a boat, BDS may keep the position the rider reported. Measured: boat 20.8 blocks in 3 s, horse 25–29 blocks in 3 s, 0 player corrections, vehicle corrections exactly 6 ticks apart.
- **bedboo:** like upstream, `physicsTick` does not fire while mounted. The physics plugin reports the rider at the vehicle's seat in every `player_auth_input` and moves `bot.entity.position` with it, so a boat rider dismounts next to the boat: see [the rider's position](entities.md#rider-position), [the rider's seat](entities.md#rider-seat), and [getting off](entities.md#dismount).

## Known residuals  {#residuals}

- Approximate (a correction is possible, in which case the client adopts and replays the server state): landing on honey while jumping, slime bounce heights (within 0.01 block), bubble column surfaces, powder snow (\< 2 mm per 6 ticks), and taking off from the ground in creative flight (one 3 cm correction at the default threshold; the strict probe agrees).
- Not modelled: swimming (sprinting in water does not start swimming), crawling and gliding poses (box height), being pushed out of blocks (BDS pushes 0.1/tick), scaffolding, entity collisions (boats, shulkers), double-tap-jump flight toggles in creative (the client follows the server's `update_abilities`), and float32 precision far from the origin.
- Bubble columns: BDS forms a column when soul sand or magma is placed under existing water; replacing the base later did not convert it.
- `bot._bedrock.input` (`input_queue.js`): corrections do not re-anchor the clock. Tick numbers only identify inputs for the server's rewind, and one engine step runs per sent tick, so both sides skip any skipped (catch-up) tick.
