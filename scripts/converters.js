/**
 * Babele 转换器（正体中文）。
 *
 * 对照表的 mapping 区会指名 converter，Babele 找不到就整个栏位不翻。
 * pf1.spells / pf1.items / pf1.buffs / pf1.class-abilities 共用到五个：
 *   actions, contextNotes, containerItems, subSchool, learnedAt, descriptors
 *
 * 这里是自行实作，不沿用来源模组的 scripts/（那份是上游的程式码，
 * 授权未明；见 README「授权现况」）。行为以「对得上 mapping 的栏位形状」为准。
 */

/** 把翻译后的 actions 并回原始 action 阵列。 */
export function actions(value, translations) {
  if (!translations || !Array.isArray(value)) return value;

  value.forEach((action, index) => {
    const data = translations[index];
    if (!data) return;

    if (data.name) action.name = data.name;
    if (action.range?.value && data.range) action.range.value = data.range;
    if (action.save?.description && data.savingThrow) {
      action.save.description = data.savingThrow;
    }
    if (action.duration?.value && data.duration) {
      action.duration.value = data.duration;
    }
    if (action.target?.value && data.target) {
      action.target.value = data.target;
    }
    if (data.spellArea) action.spellArea = data.spellArea;
    if (data.spellEffect) action.spellEffect = data.spellEffect;
    if (data.effectNotes?.length) action.effectNotes = data.effectNotes;
  });

  return value;
}

/** 情境注记：逐项换掉 text，数量对不上就整组不动（宁可留英文也不要错位）。 */
export function contextNotes(original, translated) {
  if (!Array.isArray(original) || !Array.isArray(translated)) return original;

  const withText = original.filter((n) =>
    Object.prototype.hasOwnProperty.call(n, 'text')
  );
  if (translated.length !== withText.length) {
    console.warn(
      `pf1e-compendium-zhtw | 情境注记数量不符 ${translated.length}/${withText.length}，该项不翻`
    );
    return original;
  }

  original.forEach((note, i) => {
    if (translated[i]?.text) note.text = translated[i].text;
  });
  return original;
}

/** 容器内的物品：沿用合集包里已翻好的同一件物品。 */
export function containerItems(items) {
  if (!items) return items;

  Object.values(items).forEach((item) => {
    const uuid = item.flags?.core?.sourceId;
    if (!uuid) return;

    const source = fromUuidSync(uuid);
    if (!source?.flags?.babele?.translated) return;

    item.name = source.name;
    if (source.system?.description?.value) {
      item.system.description.value = source.system.description.value;
    }
  });
  return items;
}

const SUB_SCHOOL = new Map([
  ['calling', '呼唤'],
  ['charm', '魅惑'],
  ['compulsion', '胁迫'],
  ['creation', '创造'],
  ['figment', '虚假幻觉'],
  ['glamer', '五官幻觉'],
  ['haunted', '作祟'],
  ['healing', '医疗'],
  ['pattern', '心灵幻觉'],
  ['phantasm', '魅影幻觉'],
  ['polymorph', '变形'],
  ['scrying', '探知'],
  ['shadow', '幽影幻觉'],
  ['summoning', '召唤'],
  ['teleportation', '传送'],
]);

export function subSchool(value) {
  if (!value || typeof value !== 'string') return value;
  let out = value;
  SUB_SCHOOL.forEach((zh, en) => {
    out = out.replace(en, zh);
  });
  return out;
}

/**
 * 法术可用职业／领域／血脉的键名。
 * 这些键是显示在法术资讯面板上的字串，不是系统识别字，翻了不影响查找。
 */
const DOMAIN = new Map([
  ['Air', '气领域'], ['Animal', '动物领域'], ['Artifice', '手艺领域'],
  ['Chaos', '混乱领域'], ['Charm', '魅惑领域'], ['Community', '团队领域'],
  ['Darkness', '黑暗领域'], ['Death', '死亡领域'], ['Destruction', '毁灭领域'],
  ['Earth', '土领域'], ['Evil', '邪恶领域'], ['Fire', '火领域'],
  ['Glory', '荣耀领域'], ['Good', '善良领域'], ['Healing', '医疗领域'],
  ['Knowledge', '知识领域'], ['Law', '秩序领域'], ['Liberation', '解放领域'],
  ['Luck', '机运领域'], ['Madness', '狂乱领域'], ['Magic', '魔法领域'],
  ['Nobility', '高贵领域'], ['Plant', '植物领域'], ['Protection', '保护领域'],
  ['Repose', '安眠领域'], ['Rune', '符文领域'], ['Scalykind', '鳞类领域'],
  ['Strength', '力量领域'], ['Sun', '太阳领域'], ['Travel', '旅行领域'],
  ['Trickery', '诡术领域'], ['Void', '虚空领域'], ['War', '战争领域'],
  ['Water', '水领域'], ['Weather', '天气领域'],
]);

const CLASS = new Map([
  ['adept', '导师'], ['alchemist', '炼金术士'], ['antipaladin', '反圣骑士'],
  ['arcanist', '奥能师'], ['barbarian', '野蛮人'], ['bard', '吟游诗人'],
  ['bloodrager', '血脉狂怒者'], ['brawler', '拳师'], ['cavalier', '骑将'],
  ['cleric', '牧师'], ['druid', '德鲁伊'], ['hunter', '猎人'],
  ['inquisitor', '审判者'], ['investigator', '调查员'], ['kineticist', '操念使'],
  ['magus', '魔战士'], ['medium', '通灵者'], ['mesmerist', '催眠师'],
  ['monk', '武僧'], ['ninja', '忍者'], ['oracle', '先知'],
  ['occultist', '秘学士'], ['paladin', '圣骑士'], ['psychic', '异能者'],
  ['ranger', '游侠'], ['rogue', '游荡者'], ['samurai', '武士'],
  ['shaman', '萨满'], ['skald', '歌者'], ['slayer', '杀手'],
  ['sorcerer', '术士'], ['spiritualist', '唤魂师'], ['summoner', '召唤师'],
  ['summonerUnchained', '掉链召唤师'], ['swashbuckler', '游荡剑客'],
  ['vigilante', '侠客'], ['warpriest', '战斗祭司'], ['witch', '女巫'],
  ['wizard', '法师'],
]);

/** 就地把物件的键换成中文（值不动）。 */
function renameKeys(obj, map) {
  if (!obj) return;
  map.forEach((zh, en) => {
    if (Object.prototype.hasOwnProperty.call(obj, en)) {
      obj[zh] = obj[en];
      delete obj[en];
    }
  });
}

export function learnedAt(value) {
  if (!value) return value;
  renameKeys(value.domain, DOMAIN);
  renameKeys(value.class, CLASS);
  return value;
}

/** 描述符：目前不转换，保留原值（上游同样停用）。 */
export function descriptors(value) {
  return value;
}

export default {
  actions,
  contextNotes,
  containerItems,
  subSchool,
  learnedAt,
  descriptors,
};
