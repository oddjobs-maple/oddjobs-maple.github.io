/*
 * @licstart  The following is the entire license notice for the JavaScript
 * code in this page.
 *
 * This file is part of oddjobs-dmg-calc.
 *
 * oddjobs-dmg-calc is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * oddjobs-dmg-calc is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public
 * License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with oddjobs-dmg-calc.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @licend  The above is the entire license notice for the JavaScript code in
 * this page.
 */
import { Spell, WeaponType } from "./types.js";
export function primaryStat(stats, wepType, goodAnim, clazz) {
    switch (wepType) {
        case WeaponType.OneHandedSword:
            return stats.str * 4;
        case WeaponType.OneHandedAxe:
            return stats.str * (goodAnim ? 4.4 : 3.2);
        case WeaponType.OneHandedMace:
            return stats.str * (goodAnim ? 4.4 : 3.2);
        case WeaponType.Dagger:
            return clazz === 400 /* Rogue */ ? stats.luk * 3.6 : stats.str * 4;
        case WeaponType.Wand:
            return stats.str * (goodAnim ? 4.4 : 3.2);
        case WeaponType.Staff:
            return stats.str * (goodAnim ? 4.4 : 3.2);
        case WeaponType.TwoHandedSword:
            return stats.str * 4.6;
        case WeaponType.TwoHandedAxe:
            return stats.str * (goodAnim ? 4.8 : 3.4);
        case WeaponType.TwoHandedMace:
            return stats.str * (goodAnim ? 4.8 : 3.4);
        case WeaponType.Spear:
            return stats.str * (goodAnim ? 5 : 3);
        case WeaponType.Polearm:
            return stats.str * (goodAnim ? 5 : 3);
        case WeaponType.Bow:
            return stats.dex * 3.4;
        case WeaponType.Crossbow:
            return stats.dex * 3.6;
        case WeaponType.Claw:
            return stats.luk * 3.6;
        case WeaponType.Knuckler:
            return stats.str * 4.8;
        case WeaponType.Gun:
            return stats.dex * 3.6;
    }
}
export function secondaryStat(stats, wepType, clazz) {
    switch (wepType) {
        case WeaponType.OneHandedSword:
            return stats.dex;
        case WeaponType.OneHandedAxe:
            return stats.dex;
        case WeaponType.OneHandedMace:
            return stats.dex;
        case WeaponType.Dagger:
            return clazz === 400 /* Rogue */ ? stats.str + stats.dex : stats.dex;
        case WeaponType.Wand:
            return stats.dex;
        case WeaponType.Staff:
            return stats.dex;
        case WeaponType.TwoHandedSword:
            return stats.dex;
        case WeaponType.TwoHandedAxe:
            return stats.dex;
        case WeaponType.TwoHandedMace:
            return stats.dex;
        case WeaponType.Spear:
            return stats.dex;
        case WeaponType.Polearm:
            return stats.dex;
        case WeaponType.Bow:
            return stats.str;
        case WeaponType.Crossbow:
            return stats.str;
        case WeaponType.Claw:
            return stats.str + stats.dex;
        case WeaponType.Knuckler:
            return stats.dex;
        case WeaponType.Gun:
            return stats.str;
    }
}
/**
 * The return value of this function is a natural number of milliseconds, or
 * else `undefined`.
 *
 * The values here were extracted from:
 * <http://www.southperry.net/showthread.php?t=3217>
 */
export function magicAttackPeriod(spellBooster, spell, speed) {
    switch (spell) {
        case Spell.Other: {
            switch (spellBooster) {
                case -2:
                    return 720;
                case -1:
                    return 750;
                case 0:
                    return 810;
                default:
                    return;
            }
        }
        case Spell.Heal:
            return 600;
        case Spell.ChainLightning: {
            switch (spellBooster) {
                case -2:
                    return 690;
                case -1:
                    return 750;
                case 0:
                    return 780;
                default:
                    return;
            }
        }
        case Spell.ShiningRay:
        case Spell.IceStrike: {
            switch (spellBooster) {
                case -2:
                    return 930;
                case -1:
                    return 990;
                case 0:
                    return 1050;
                default:
                    return;
            }
        }
        case Spell.PoisonMist: {
            switch (spellBooster) {
                case -2:
                    return 1320;
                case -1:
                    return 1410;
                case 0:
                    return 1500;
                default:
                    return;
            }
        }
        case Spell.ElementCompositionFP:
        case Spell.ElementCompositionIL: {
            switch (spellBooster) {
                case -2:
                    return 810;
                case -1:
                    return 870;
                case 0:
                    return 900;
                default:
                    return;
            }
        }
        case Spell.Explosion: {
            switch (spellBooster) {
                case -2: {
                    switch (speed) {
                        case 4 /* Fast4 */:
                            return 1500;
                        case 5 /* Fast5 */:
                            return 1560;
                        case 6 /* Normal */:
                            return 1620;
                        case 7 /* Slow7 */:
                            return 1680;
                        case 8 /* Slow8 */:
                            return 1710;
                        default:
                            return;
                    }
                }
                case -1: {
                    switch (speed) {
                        case 4 /* Fast4 */:
                            return 1620;
                        case 5 /* Fast5 */:
                            return 1680;
                        case 6 /* Normal */:
                            return 1740;
                        case 7 /* Slow7 */:
                            return 1770;
                        case 8 /* Slow8 */:
                            return 1830;
                        default:
                            return;
                    }
                }
                case 0: {
                    switch (speed) {
                        case 4 /* Fast4 */:
                            return 1710;
                        case 5 /* Fast5 */:
                            return 1770;
                        case 6 /* Normal */:
                            return 1800;
                        case 7 /* Slow7 */:
                            return 1860;
                        case 8 /* Slow8 */:
                            return 1920;
                        default:
                            return;
                    }
                }
                default:
                    return;
            }
        }
        case Spell.Genesis:
            return 2700;
        case Spell.MeteorShower:
        case Spell.Blizzard: {
            switch (spellBooster) {
                case -2:
                    return 3060;
                case -1:
                    return 3270;
                case 0:
                    return 3480;
                default:
                    return;
            }
        }
        case Spell.ThunderSpear: {
            switch (spellBooster) {
                case -2:
                    return 1140;
                case -1:
                    return 1230;
                case 0:
                    return 1320;
                default:
                    return;
            }
        }
    }
}
/**
 * The return value of this function is a natural number of milliseconds, or
 * else `undefined`.
 *
 * Not all combinations of weapon type & speed have an associated value.  For
 * example, crossbows cannot have a "Slower" speed.
 *
 * The values here were extracted from:
 * <http://www.southperry.net/showthread.php?t=3217>
 */
export function attackPeriod(wepType, speed) {
    switch (wepType) {
        case WeaponType.OneHandedSword:
        case WeaponType.OneHandedAxe:
        case WeaponType.OneHandedMace:
        case WeaponType.Dagger:
        case WeaponType.Wand:
        case WeaponType.Staff:
        case WeaponType.TwoHandedSword:
        case WeaponType.TwoHandedAxe:
        case WeaponType.TwoHandedMace:
        case WeaponType.Bow:
        case WeaponType.Claw:
        case WeaponType.Knuckler: {
            switch (speed) {
                case 2 /* Faster2 */:
                    return 600;
                case 3 /* Faster3 */:
                    return 660;
                case 4 /* Fast4 */:
                    return 720;
                case 5 /* Fast5 */:
                    return 750;
                case 6 /* Normal */:
                    return 810;
                case 7 /* Slow7 */:
                    return 870;
                case 8 /* Slow8 */:
                    return 900;
                default:
                    return;
            }
        }
        case WeaponType.Spear:
        case WeaponType.Polearm: {
            switch (speed) {
                case 2 /* Faster2 */:
                    return 570;
                case 3 /* Faster3 */:
                    return 630;
                case 4 /* Fast4 */:
                    return 660;
                case 5 /* Fast5 */:
                    return 720;
                case 6 /* Normal */:
                    return 750;
                case 7 /* Slow7 */:
                    return 810;
                case 8 /* Slow8 */:
                    return 870;
                case 9 /* Slower */:
                    return 900;
            }
        }
        case WeaponType.Crossbow: {
            switch (speed) {
                case 2 /* Faster2 */:
                    return 630;
                case 3 /* Faster3 */:
                    return 690;
                case 4 /* Fast4 */:
                    return 720;
                case 5 /* Fast5 */:
                    return 780;
                case 6 /* Normal */:
                    return 870;
                default:
                    return;
            }
        }
        case WeaponType.Gun: {
            switch (speed) {
                case 2 /* Faster2 */:
                    return 630;
                case 3 /* Faster3 */:
                    return 690;
                case 4 /* Fast4 */:
                    return 750;
                case 5 /* Fast5 */:
                    return 780;
                case 6 /* Normal */:
                    return 810;
                default:
                    return;
            }
        }
    }
}
