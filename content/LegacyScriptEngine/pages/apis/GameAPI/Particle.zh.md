# ✨ ParticleSpawner 对象

!!! warning
    ParticleSpawner 已在 0.15.0 中废弃，除 spawnParticle 外的所有 API 均不可用。

   `ParticleSpawner` 类型的变量 ps 包含以下成员：

   | 成员             | 含义           | 类型      |
   | ---------------- | -------------- | --------- |
   | ps.displayRadius | 粒子显示半径   | `Integer` |
   | ps.highDetial    | 需要高细节线条 | `Boolean` |
   | ps.doubleSide    | 需要双面粒子   | `Boolean` |

## 生成一个粒子生成器对象

`mc.newParticleSpawner(displayRadius = 4294967295, highDetial = true, doubleSide = true)`

- 返回值：一个粒子生成器对象
- 返回值类型：`ParticleSpawner`

## 粒子颜色枚举

| 粒子颜色枚举             |
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

## 方向枚举

| 方向枚举          |
| ----------------- |
| `Direction.NEG_Y` |
| `Direction.POS_Y` |
| `Direction.NEG_Z` |
| `Direction.POS_Z` |
| `Direction.NEG_X` |
| `Direction.POS_X` |

## 生成指定名称粒子

`ps.spawnParticle(pos, name)`

- 参数：
  - pos：浮点坐标或整数坐标，整数坐标会取方块中心点位置
  - name：`String`
- 返回值：true
- 返回值类型：`Boolean`

> 以下粒子显示时间均为 2s

## 生成点粒子

`ps.drawPoint(pos, pointSize = 4, color = ParticleColor.White)`

- 参数：
  - pos：浮点坐标或整数坐标，整数坐标会取方块中心点位置
  - pointSize：`Number`
    - 仅可取 1、2、4、8、16
  - color：`String`，应使用 `ParticleColor` 枚举值填充
- 返回值：true
- 返回值类型：`Boolean`

## 生成数字粒子

`ps.drawNumber(pos, num, color = ParticleColor.White)`

- 参数：
  - pos：浮点坐标或整数坐标，整数坐标会取方块中心点位置
  - num：若为 `Number` 则仅可填 0~16，若为 `String` 则可填 `0`~`16` 或 `A`~`F`
  - color：`String`，应使用 `ParticleColor` 枚举值填充
- 返回值：true
- 返回值类型：`Boolean`

## 生成轴向线段

`ps.drawAxialLine(pos, direction, length, color = ParticleColor.White)`

- 参数：
  - pos：线段起点，可为浮点坐标或整数坐标，整数坐标会取方块中心点位置
  - direction：`Number`，应使用 `Direction` 枚举值填充
  - length：`Number`，任意实数
  - color：`String`，应使用 `ParticleColor` 枚举值填充
- 返回值：true
- 返回值类型：`Boolean`

## 生成有向线段

`ps.drawOrientedLine(start, end, lineWidth = 4, minSpacing = 1, maxParticlesNum = 64, color = ParticleColor.White)`

- 参数：
  - start：线段起点，可为浮点坐标或整数坐标，整数坐标会取方块中心点位置
  - end：线段终点，可为浮点坐标或整数坐标，整数坐标会取方块中心点位置
  - lineWidth：`Number`
    - 仅可取 1、2、4、8、16
  - minSpacing：`Number`，任意实数，此线段的最小粒子间距
  - maxParticlesNum：`Number`，整数，此线段的最大粒子数，达到上限后会自动增大间距
  - color：`String`，应使用 `ParticleColor` 枚举值填充
- 返回值：true
- 返回值类型：`Boolean`

## 生成圆

`ps.drawCircle(pos, facing, radius, lineWidth = 4, minSpacing = 1, maxParticlesNum = 64, color = ParticleColor.White)`

- 参数：
  - pos：圆心，可为浮点坐标或整数坐标，整数坐标会取方块中心点位置
  - facing：`Number`，应使用 `Direction` 枚举值填充
  - radius：`Number`，任意实数，半径
  - lineWidth：`Number`
    - 仅可取 1、2、4、8、16
  - minSpacing：`Number`，任意实数，此圆的最小粒子间距
  - maxParticlesNum：`Number`，整数，此圆的最大粒子数，达到上限后会自动增大间距
  - color：`String`，应使用 `ParticleColor` 枚举值填充
- 返回值：true
- 返回值类型：`Boolean`

## 生成立方体

`ps.drawCuboid(pos[,pos2], color = ParticleColor.White)`

- 参数：
  - pos：浮点坐标或整数坐标，整数坐标会取方块底部顶点位置。若只传入一个坐标，则会绘制 1×1×1 大小的立方体
  - pos2：浮点坐标或整数坐标，整数坐标会取方块顶部顶点位置，用于绘制从最小顶点 pos 到最大顶点 pos2 的立方体
  - color：`String`，应使用 `ParticleColor` 枚举值填充
- 返回值：true
- 返回值类型：`Boolean`
