# ✨ ParticleSpawner Object

!!! warning
    ParticleSpawner has been deprecated since version 0.15.0. All APIs except spawnParticle are unavailable.

   A `ParticleSpawner` variable ps has the following members:

   | Member           | Type      |
   | ---------------- | --------- |
   | ps.displayRadius | `Integer` |
   | ps.highDetial    | `Boolean` |
   | ps.doubleSide    | `Boolean` |

## Particle Spawner Object

`mc.newParticleSpawner(displayRadius = 4294967295, highDetial = true, doubleSide = true)`

- Return value type: `ParticleSpawner`

## Particle Color Enums

| Particle Color Enums     |
| ------------------------ |
| `ParticleColor.Black`    |
| `ParticleColor.Indigo`   |
| `ParticleColor.Lavender` |
| `ParticleColor.Teal`     |
| `ParticleColor.Cocoa`    |
| `ParticleColor.Dark`     |
| `ParticleColor.Oatmeal`  |
| `ParticleColor.White`    |
| `ParticleColor.Red`      |
| `ParticleColor.Apricot`  |
| `ParticleColor.Yellow`   |
| `ParticleColor.Green`    |
| `ParticleColor.Vatblue`  |
| `ParticleColor.Slate`    |
| `ParticleColor.Pink`     |
| `ParticleColor.Fawn`     |

## Direction Enums

| Direction Enums   |
| ----------------- |
| `Direction.NEG_Y` |
| `Direction.POS_Y` |
| `Direction.NEG_Z` |
| `Direction.POS_Z` |
| `Direction.NEG_X` |
| `Direction.POS_X` |

## Generate named particles

`ps.spawnParticle(pos, name)`

- Parameters:
  - pos : FloatPos or IntPos (IntPos uses the center of the block)
  - name : `String`
- Return value: true
- Return value type: `Boolean`

> All particles below are displayed for 2s.

## Generate point particles

`ps.drawPoint(pos, pointSize = 4, color = ParticleColor.White)`

- Parameters:
  - pos : FloatPos or IntPos (IntPos uses the center of the block)
  - pointSize : `Number`
    - Valid sizes: 1, 2, 4, 8, or 16
  - color : `String` (use a `ParticleColor` value)
- Return value: true
- Return value type: `Boolean`

## Generate digital particles

`ps.drawNumber(pos, num, color = ParticleColor.White)`

- Parameters:
  - pos : FloatPos or IntPos (IntPos uses the center of the block)
  - num : If `Number`, must be 0~16; if `String`, must be `0`~`16` or `A`~`F`
  - color : `String` (use a `ParticleColor` value)
- Return value: true
- Return value type: `Boolean`

## Generate Axial Segments

`ps.drawAxialLine(pos, direction, length, color = ParticleColor.White)`

- Parameters:
  - pos : Segment start point; FloatPos or IntPos (IntPos uses the center of the block)
  - direction : `Number` (use a `Direction` value)
  - length : `Number` (any real number)
  - color : `String` (use a `ParticleColor` value)
- Return value: true
- Return value type: `Boolean`

## Generate directed line segments

`ps.drawOrientedLine(start, end, lineWidth = 4, minSpacing = 1, maxParticlesNum = 64, color = ParticleColor.White)`

- Parameters:
  - start : Segment start point; FloatPos or IntPos (IntPos uses the center of the block)
  - end : Segment end point; FloatPos or IntPos (IntPos uses the center of the block)
  - lineWidth : `Number`
    - Valid sizes: 1, 2, 4, 8, or 16
  - minSpacing : `Number` (any real number). Minimum spacing between points along the line segment
  - maxParticlesNum : `Number` (Integer). Maximum number of particles in the line segment; once reached, the spacing increases automatically
  - color : `String` (use a `ParticleColor` value)
- Return value: true
- Return value type: `Boolean`

## Generate circle

`ps.drawCircle(pos, facing, radius, lineWidth = 4, minSpacing = 1, maxParticlesNum = 64, color = ParticleColor.White)`

- Parameters:
  - pos : Center of the circle; FloatPos or IntPos (IntPos uses the center of the block)
  - facing : `Number` (use a `Direction` value)
  - radius : `Number` (any real number)
  - lineWidth : `Number`
    - Valid sizes: 1, 2, 4, 8, or 16
  - minSpacing : `Number` (any real number). Minimum spacing between points along the line segment
  - maxParticlesNum : `Number` (Integer). Maximum number of particles in the line segment; once reached, the spacing increases automatically
  - color : `String` (use a `ParticleColor` value)
- Return value: true
- Return value type: `Boolean`

## generate cube

`ps.drawCuboid(pos[,pos2], color = ParticleColor.White)`

- Parameters:
  - pos : Floating-point or integer coordinates (integer coordinates use the lower corner of the block). If only one coordinate is provided, draws a 1×1×1 cube
  - pos2 : Floating-point or integer coordinates (integer coordinates use the upper corner of the block). Draws a cuboid from the minimum corner pos to the maximum corner pos2
  - color : `String` (use a `ParticleColor` value)
- Return value: true
- Return value type: `Boolean`
