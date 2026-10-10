# PF1e 合集包 简体中文（CHM 版）

Pathfinder 1e 系统合集包内容（法术、专长、物品、怪物等）的简体中文翻译。

**需要 [Babele](https://gitlab.com/riccisi/foundryvtt-babele)。**

## 译文来源

1. **纯美苹果园 PF1 CHM 大全集**（优先）：CHM 收录的条目，名称与内文直接采用 CHM 简体版。
   每条结尾附出处行：译者、书目、果园原帖、AoN。目前涵盖专长。
2. **FVTT-CN 的译稿**：CHM 没有的条目，沿用 [fvtt-cn/pf1e_compendium_chn](https://github.com/fvtt-cn/pf1e_compendium_chn) 的译文。

感谢 FVTT-CN 制作组。署名与授权说明见 [`NOTICE.md`](NOTICE.md)。

## 安装

```
https://github.com/quasiidem-lab/pf1e-compendium-zhcn/releases/latest/download/module.json
```

安装后启用本模组与 Babele，界面语言设为中文（`cn`）。

**请勿与 `pf1e_compendium_chn` 或繁体版 `pf1e-compendium-zhtw` 同时启用**——三者翻译的是同一批合集包。

## 与上游的差异

- CHM 收录的专长改用 CHM 译文（附出处）
- 修正 `pf-content.pf-tables.json` 的 JSON 语法错误
- 程序代码改为自行实作，支持 Babele 2.9（上游在 Babele 2.9 下会因转换器注册失败而完全不载入）

## 繁体中文版

[`pf1e-compendium-zhtw`](https://github.com/quasiidem-lab/pf1e-compendium-zhtw)

## 授权

程序代码（`scripts/`）为 GPL-3.0；译文权利归原译者（纯美苹果园 CHM 各译者、FVTT-CN），不在 GPL 范围内。
详见 [`NOTICE.md`](NOTICE.md)。
