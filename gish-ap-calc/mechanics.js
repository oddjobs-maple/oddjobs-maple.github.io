/*
 * @licstart  The following is the entire license notice for the JavaScript
 * code in this page.
 *
 * This file is part of gish-ap-calc.
 *
 * gish-ap-calc is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * gish-ap-calc is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with gish-ap-calc.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @licend  The above is the entire license notice for the JavaScript code in
 * this page.
 */
import { SpellType, WeaponType, } from "./types.js";
export function wacc(dex, luk, rawWacc) {
    return 0.8 * dex + 0.5 * luk + rawWacc;
}
export function wHitRate(wacc, avoid, d) {
    return Math.min(Math.max(wacc / ((1.84 + 0.07 * d) * avoid) - 1, 0), 1);
}
/**
 * Special-sauce formula: "Magical Accuracy: Thikket and Nekonecat's version",
 * due to Technolink/Russt/AyumiLove.
 *
 * <https://ayumilovemaple.wordpress.com/2009/09/06/maplestory-formula-compilation/>
 */
export function mHitRate(int, luk, avoid, d) {
    const preMacc = ((Math.trunc(int / 10) + Math.trunc(luk / 10)) / (avoid + 1)) *
        (1 + 0.0415 * d);
    return Math.min(Math.max(-2.5795 * preMacc * preMacc + 5.2343 * preMacc - 1.6749, 0), 1);
}
export function rawWDmg(str, dex, totalWatk, psm) {
    const adjustedStr = str * psm;
    const adjustedWatk = totalWatk / 100;
    return [
        (adjustedStr * 0.09 + dex) * adjustedWatk,
        (adjustedStr + dex) * adjustedWatk,
    ];
}
export function wDmgAfterDef(rawMin, rawMax, wdef, d) {
    const lvlFactor = 1 - 0.01 * d;
    return [
        Math.max(rawMin * lvlFactor - wdef * 0.6, 1),
        Math.max(rawMax * lvlFactor - wdef * 0.5, 1),
    ];
}
export function rawMDmg(tma, int, basicAtk, mastery) {
    const quadraticTerm = (tma * tma) / 1000;
    const intTerm = int / 200;
    return [
        ((quadraticTerm + tma * mastery * 0.9) / 30 + intTerm) * basicAtk,
        ((quadraticTerm + tma) / 30 + intTerm) * basicAtk,
    ];
}
export function mDmgAfterDef(rawMin, rawMax, mdef, d) {
    const adjustedMdef = mdef * (1 + 0.01 * d);
    return [
        Math.max(rawMin - adjustedMdef * 0.6, 1),
        Math.max(rawMax - adjustedMdef * 0.5, 1),
    ];
}
export function wDps(stats, rawWacc, totalWatk, weapon, monster, d) {
    const physHitRate = wHitRate(wacc(stats.dex, stats.luk, rawWacc), monster.avoid, d);
    const [rawMeleeMin, rawMeleeMax] = rawWDmg(stats.str, stats.dex, totalWatk, weapon.psm);
    const [meleeMin, meleeMax] = wDmgAfterDef(rawMeleeMin, rawMeleeMax, monster.wdef, d);
    const meleeAvg = (meleeMax + meleeMin) / 2;
    return (meleeAvg / weapon.period) * physHitRate;
}
export function mDps(stats, rawMatk, spell, monster, d) {
    const tma = stats.int + rawMatk;
    const magicHitRate = mHitRate(stats.int, stats.luk, monster.avoid, d);
    const [rawSpellMin, rawSpellMax] = rawMDmg(tma, stats.int, spell.basicAtk, spell.mastery);
    const [spellMin, spellMax] = mDmgAfterDef(rawSpellMin, rawSpellMax, monster.mdef, d);
    const spellAvg = (spellMin + spellMax) / 2;
    return (spellAvg / spell.period) * magicHitRate * spell.lines;
}
export function psm(wepType) {
    switch (wepType) {
        case WeaponType.OneHandedSword:
        case WeaponType.Dagger:
            return 4;
        case WeaponType.TwoHandedSword:
            return 4.6;
        case WeaponType.OneHandedAxe:
        case WeaponType.OneHandedMace:
            // TODO: actually handle swing probabilities instead of using
            // average PSM.
            return 3.92;
        case WeaponType.TwoHandedAxe:
        case WeaponType.TwoHandedMace:
            // TODO: actually handle swing probabilities instead of using
            // average PSM.
            return 4.24;
        case WeaponType.Spear:
            // TODO: actually handle swing probabilities instead of using
            // average PSM.
            return 3.8;
        case WeaponType.Polearm:
            // TODO: actually handle swing probabilities instead of using
            // average PSM.
            return 4.2;
        case WeaponType.Wand:
        case WeaponType.Staff:
            return 4.4;
    }
}
/** In seconds. */
export function meleePeriod(wepType, speed) {
    switch (wepType) {
        case WeaponType.OneHandedSword:
        case WeaponType.OneHandedAxe:
        case WeaponType.OneHandedMace:
        case WeaponType.Dagger:
        case WeaponType.Wand:
        case WeaponType.Staff:
        case WeaponType.TwoHandedSword:
        case WeaponType.TwoHandedAxe:
        case WeaponType.TwoHandedMace: {
            switch (speed) {
                case 2 /* Faster2 */:
                    return 0.6;
                case 3 /* Faster3 */:
                    return 0.66;
                case 4 /* Fast4 */:
                    return 0.72;
                case 5 /* Fast5 */:
                    return 0.75;
                case 6 /* Normal */:
                    return 0.81;
                case 7 /* Slow7 */:
                    return 0.87;
                case 8 /* Slow8 */:
                    return 0.9;
                case 9 /* Slower */:
                    return 0.93; // Not actually possible in-game.
            }
        }
        case WeaponType.Spear:
        case WeaponType.Polearm: {
            switch (speed) {
                case 2 /* Faster2 */:
                    return 0.57;
                case 3 /* Faster3 */:
                    return 0.63;
                case 4 /* Fast4 */:
                    return 0.66;
                case 5 /* Fast5 */:
                    return 0.72;
                case 6 /* Normal */:
                    return 0.75;
                case 7 /* Slow7 */:
                    return 0.81;
                case 8 /* Slow8 */:
                    return 0.87;
                case 9 /* Slower */:
                    return 0.9;
            }
        }
    }
}
/** In seconds. */
export function spellPeriod(spellBooster, spell, speed) {
    switch (spell) {
        case SpellType.Other:
        case SpellType.HolyArrow:
        case SpellType.AngelRay: {
            switch (spellBooster) {
                case -2:
                    return 0.72;
                case -1:
                    return 0.75;
                case 0:
                    return 0.81;
                default:
                    return;
            }
        }
        case SpellType.Heal:
            return 0.6;
        case SpellType.ChainLightning: {
            switch (spellBooster) {
                case -2:
                    return 0.69;
                case -1:
                    return 0.75;
                case 0:
                    return 0.78;
                default:
                    return;
            }
        }
        case SpellType.ShiningRay:
        case SpellType.IceStrike: {
            switch (spellBooster) {
                case -2:
                    return 0.93;
                case -1:
                    return 0.99;
                case 0:
                    return 1.05;
                default:
                    return;
            }
        }
        case SpellType.PoisonMist: {
            switch (spellBooster) {
                case -2:
                    return 1.32;
                case -1:
                    return 1.41;
                case 0:
                    return 1.5;
                default:
                    return;
            }
        }
        case SpellType.ElementCompositionFP:
        case SpellType.ElementCompositionIL: {
            switch (spellBooster) {
                case -2:
                    return 0.81;
                case -1:
                    return 0.87;
                case 0:
                    return 0.9;
                default:
                    return;
            }
        }
        case SpellType.Explosion: {
            switch (spellBooster) {
                case -2: {
                    switch (speed) {
                        case 4 /* Fast4 */:
                            return 1.5;
                        case 5 /* Fast5 */:
                            return 1.56;
                        case 6 /* Normal */:
                            return 1.62;
                        case 7 /* Slow7 */:
                            return 1.68;
                        case 8 /* Slow8 */:
                            return 1.71;
                        default:
                            return;
                    }
                }
                case -1: {
                    switch (speed) {
                        case 4 /* Fast4 */:
                            return 1.62;
                        case 5 /* Fast5 */:
                            return 1.68;
                        case 6 /* Normal */:
                            return 1.74;
                        case 7 /* Slow7 */:
                            return 1.77;
                        case 8 /* Slow8 */:
                            return 1.83;
                        default:
                            return;
                    }
                }
                case 0: {
                    switch (speed) {
                        case 4 /* Fast4 */:
                            return 1.71;
                        case 5 /* Fast5 */:
                            return 1.77;
                        case 6 /* Normal */:
                            return 1.8;
                        case 7 /* Slow7 */:
                            return 1.86;
                        case 8 /* Slow8 */:
                            return 1.92;
                        default:
                            return;
                    }
                }
                default:
                    return;
            }
        }
        case SpellType.Elquines:
        case SpellType.Ifrit:
        case SpellType.SummonDragon:
        case SpellType.Bahamut:
            return 3.03;
        case SpellType.Genesis:
            return 2.7;
        case SpellType.MeteorShower:
        case SpellType.Blizzard: {
            switch (spellBooster) {
                case -2:
                    return 3.06;
                case -1:
                    return 3.27;
                case 0:
                    return 3.48;
                default:
                    return;
            }
        }
        case SpellType.ThunderSpear: {
            switch (spellBooster) {
                case -2:
                    return 1.14;
                case -1:
                    return 1.23;
                case 0:
                    return 1.32;
                default:
                    return;
            }
        }
    }
}
