---
platforms: [windows]
---
# 世界工具

LeviLauncher 提供了一系列用于保护和检查世界数据的工具。

## 主要能力

- 将世界导出为 `.mcworld` 等格式的备份包
- 查看世界的相关信息
- 编辑 `level.dat` 中的部分字段
- 通过启动器流程更安全地修改世界名称

## 什么时候应该备份世界

建议在以下场景前先行备份：

- 测试 Minecraft 预览版（Preview）前
- 安装或更新多个模组前
- 修改重要的世界元数据前
- 在差异较大的环境之间迁移世界前

## 关于 `level.dat` 编辑

LeviLauncher 会将 `level.dat` 中的部分字段提取出来，方便你直接编辑。

::: warning 请谨慎编辑
`level.dat` 属于敏感的世界元数据。修改前请务必备份，并仅修改自己了解的字段。
:::

## 推荐备份习惯

1. 大版本更新前进行备份。
2. 引入新模组或资源包前进行备份。
3. 至少在当前版本工作区之外保留一份备份。

## 相关阅读

- [内容管理](./content-management)
- [版本管理](./version-management)
- [更新与故障排查](./update-troubleshooting)
