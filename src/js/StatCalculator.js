// 数值计算模块 - StatCalculator.js

import { CombatConfig } from "../config/CombatConfig.js";

export const StatCalculator = {
  // 主属性特殊效果系数
  HP_PER_STR: 5, // 每点力量增加 5 点生命值
  ATK_PER_AGI: 2, // 每点敏捷增加 2 点攻击力
  RESOURCE_PER_INT: 5, // 每点智力增加 5 点魔法值/真气等

  // 怪物伤害系数（调整为 40%）
  MONSTER_DAMAGE_MULTIPLIER: 0.4,

  calculatePhysicalAttack: function (baseAtk, str, level) {
    return (
      baseAtk + str * CombatConfig.K_STR_ATK + level * CombatConfig.K_LV_ATK
    );
  },

  calculateMagicAttack: function (baseAtk, int, level) {
    return (
      baseAtk + int * CombatConfig.K_INT_ATK + level * CombatConfig.K_LV_ATK
    );
  },

  calculateDefense: function (baseDef, con, level) {
    return (
      baseDef + con * CombatConfig.K_CON_DEF + level * CombatConfig.K_LV_DEF
    );
  },

  calculateCritRate: function (baseCrit, agi) {
    const critRate = baseCrit + agi * CombatConfig.K_AGI_CRIT;
    return Math.min(critRate, CombatConfig.CRIT_RATE_CAP);
  },

  calculateCritDamage: function (baseCritDmg, agi) {
    return CombatConfig.CRIT_BASE_DMG + agi * CombatConfig.K_AGI_CRITDMG;
  },

  calculateSpeed: function (baseSpeed, agi) {
    return baseSpeed + agi * CombatConfig.K_AGI_SPD;
  },

  calculateMaxHp: function (baseHp, con, level, str = 0) {
    // 基础 HP + 体质加成 + 等级加成 + 力量特殊效果
    return baseHp + level * CombatConfig.HP_PER_LEVEL + str * this.HP_PER_STR;
  },

  calculateMaxResource: function (baseResource, int, level) {
    // 基础资源 + 智力加成 + 等级加成 + 智力特殊效果
    return (
      baseResource +
      int * CombatConfig.RESOURCE_PER_INT +
      level * CombatConfig.RESOURCE_PER_LEVEL +
      int * this.RESOURCE_PER_INT
    );
  },

  calculatePhysicalDamage: function (
    pAtk,
    skillCoeff,
    targetDef,
    critRate,
    critDmg,
    hitRate = 1.0,
    isMonster = false,
  ) {
    if (Math.random() > hitRate)
      return { damage: 0, isCrit: false, isHit: false };

    let baseDamage = pAtk * skillCoeff - targetDef;
    baseDamage = Math.max(1, baseDamage);

    const isCrit = Math.random() <= critRate;
    if (isCrit) baseDamage *= critDmg;

    const floatFactor =
      Math.random() *
        (CombatConfig.DAMAGE_FLOAT_MAX - CombatConfig.DAMAGE_FLOAT_MIN) +
      CombatConfig.DAMAGE_FLOAT_MIN;

    // 如果是怪物造成的伤害，应用 40% 系数
    if (isMonster) {
      baseDamage *= this.MONSTER_DAMAGE_MULTIPLIER;
    }

    return {
      damage: Math.max(1, Math.floor(baseDamage * floatFactor)),
      isCrit,
      isHit: true,
    };
  },

  calculateMagicDamage: function (
    mAtk,
    skillCoeff,
    targetRes,
    critRate,
    critDmg,
    hitRate = 1.0,
    isMonster = false,
  ) {
    if (Math.random() > hitRate)
      return { damage: 0, isCrit: false, isHit: false };

    let baseDamage = mAtk * skillCoeff - targetRes;
    baseDamage = Math.max(1, baseDamage);

    const isCrit = Math.random() <= critRate;
    if (isCrit) baseDamage *= critDmg;

    const floatFactor =
      Math.random() *
        (CombatConfig.DAMAGE_FLOAT_MAX - CombatConfig.DAMAGE_FLOAT_MIN) +
      CombatConfig.DAMAGE_FLOAT_MIN;

    // 如果是怪物造成的伤害，应用 40% 系数
    if (isMonster) {
      baseDamage *= this.MONSTER_DAMAGE_MULTIPLIER;
    }

    return {
      damage: Math.max(1, Math.floor(baseDamage * floatFactor)),
      isCrit,
      isHit: true,
    };
  },

  calculateHeal: function (mAtk, skillCoeff, int) {
    const baseHeal = mAtk * skillCoeff;
    const bonus = int * 0.5;
    const floatFactor = Math.random() * 0.2 + 0.9;
    return Math.floor((baseHeal + bonus) * floatFactor);
  },

  calculateFullStats: function (entity) {
    const baseStats = entity.baseStats || entity;
    const level = baseStats.level || 1;
    const str = baseStats.str || 0;
    const int = baseStats.int || 0;
    const con = baseStats.con || 0;
    const agi = baseStats.agi || 0;

    return {
      level,
      maxHp: this.calculateMaxHp(CombatConfig.BASE_HP, con, level, str),
      maxResource: this.calculateMaxResource(
        CombatConfig.BASE_RESOURCE,
        int,
        level,
      ),
      pAtk:
        this.calculatePhysicalAttack(0, str, level) + agi * this.ATK_PER_AGI, // 敏捷特殊效果：+2 攻击/点
      mAtk: this.calculateMagicAttack(0, int, level),
      def: this.calculateDefense(0, con, level),
      res: this.calculateDefense(0, int, level),
      critRate: this.calculateCritRate(CombatConfig.CRIT_BASE_RATE, agi),
      critDmg: this.calculateCritDamage(CombatConfig.CRIT_BASE_DMG, agi),
      speed: this.calculateSpeed(CombatConfig.BASE_SPEED, agi),
      str,
      int,
      con,
      agi,
    };
  },
};
