/**
 * pf1e-compendium-zhcn — 向 Babele 注册简体中文合集包对照表（由繁中版 make_zhcn.py 产生，勿直接修改）。
 *
 * 注册时机走 `babele.init` 钩子。
 *
 * Babele 2.9 起，register/registerConverters 一旦过了 runtime session 建立
 * 就直接 throw（"must be called during the babele.init hook"）。而 Babele 是
 * 在它自己的 Hooks.once('init') 里才 callAll('babele.init')，模组之间的载入
 * 顺序没有保证——挂 Foundry 的 init 是碰运气，排在 Babele 后面就整个不注册，
 * 合集包一个字都不会翻。挂 `babele.init` 两种顺序都对。
 *
 * 旧版 Babele（2.6.x）没有这个钩子，因此保留一段 init 后援；
 * 已经注册过就不重复做。
 */
import converters from "./converters.js";
import { OriginalNameFilter } from "./filters.mjs";

const MODULE_ID = "pf1e-compendium-zhcn";

let registered = false;

function registerWith(babele) {
  if (registered || !babele) return;

  try {
    babele.registerConverters({
      actions: converters.actions,
      contextNotes: converters.contextNotes,
      containerItems: converters.containerItems,
      subSchool: converters.subSchool,
      learnedAt: converters.learnedAt,
      descriptors: converters.descriptors,
    });

    babele.register({
      module: MODULE_ID,
      lang: "cn",
      dir: "translations",
    });

    registered = true;
  } catch (err) {
    console.error(`${MODULE_ID} | 向 Babele 注册失败`, err);
  }
}

// Babele 2.7+ 的正规时机
Hooks.once("babele.init", (babele) => registerWith(babele));

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "enableDebug", {
    name: "显示翻译错误通知",
    hint: "除了主控台讯息外，翻译过程中的错误也会以通知显示。",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  if (registered) return;

  // 后援：旧版 Babele 没有 babele.init
  const babele =
    (typeof Babele !== "undefined" && Babele.get?.()) || game.babele;

  if (!babele) {
    console.error(`${MODULE_ID} | 找不到 Babele，合集包不会被翻译`);
    return;
  }

  registerWith(babele);
});

// 合集包浏览器加一个「以英文原名搜寻」的筛选器。
// 原本这里用了 OriginalNameFilter 却没有 import，载入后会丢 ReferenceError。
Hooks.once("ready", () => {
  if (game.settings.get("core", "language") !== "cn") return;

  const browsers = [
    pf1.applications.compendiumBrowser.ClassBrowser,
    pf1.applications.compendiumBrowser.ItemBrowser,
    pf1.applications.compendiumBrowser.SpellBrowser,
    pf1.applications.compendiumBrowser.FeatBrowser,
    pf1.applications.compendiumBrowser.RaceBrowser,
    pf1.applications.compendiumBrowser.CreatureBrowser,
    pf1.applications.compendiumBrowser.BuffBrowser,
  ];

  for (const browser of browsers) {
    if (!browser?.filterClasses) continue;
    if (browser.filterClasses.includes(OriginalNameFilter)) continue;
    browser.filterClasses.splice(0, 0, OriginalNameFilter);
  }
});
