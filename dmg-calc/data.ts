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

import { Attack, Class, Speed, Spell, Stats, WeaponType } from "./types.js";

export function primaryStat(
    stats: Stats,
    wepType: WeaponType,
    goodAnim: boolean,
    clazz: Class,
): number {
    switch (wepType) {
        case WeaponType.None: {
            switch (clazz) {
                case Class.Pirate:
                    return stats.str * 3;
                case Class.Pirate2nd:
                    return stats.str * 4.2;
                default:
                    return 0;
            }
        }
        case WeaponType.OneHandedSword:
            return stats.str * 4;
        case WeaponType.OneHandedAxe:
            return stats.str * (goodAnim ? 4.4 : 3.2);
        case WeaponType.OneHandedMace:
            return stats.str * (goodAnim ? 4.4 : 3.2);
        case WeaponType.Dagger:
            return clazz === Class.Rogue ? stats.luk * 3.6 : stats.str * 4;
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

export function secondaryStat(
    stats: Stats,
    wepType: WeaponType,
    clazz: Class,
): number {
    switch (wepType) {
        case WeaponType.None:
            return stats.dex;
        case WeaponType.OneHandedSword:
            return stats.dex;
        case WeaponType.OneHandedAxe:
            return stats.dex;
        case WeaponType.OneHandedMace:
            return stats.dex;
        case WeaponType.Dagger:
            return clazz === Class.Rogue ? stats.str + stats.dex : stats.dex;
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
export function magicAttackPeriod(
    spellBooster: number,
    spell: Spell,
    speed: Speed,
): number | undefined {
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
                        case Speed.Fast4:
                            return 1500;
                        case Speed.Fast5:
                            return 1560;
                        case Speed.Normal:
                            return 1620;
                        case Speed.Slow7:
                            return 1680;
                        case Speed.Slow8:
                            return 1710;
                        default:
                            return;
                    }
                }
                case -1: {
                    switch (speed) {
                        case Speed.Fast4:
                            return 1620;
                        case Speed.Fast5:
                            return 1680;
                        case Speed.Normal:
                            return 1740;
                        case Speed.Slow7:
                            return 1770;
                        case Speed.Slow8:
                            return 1830;
                        default:
                            return;
                    }
                }
                case 0: {
                    switch (speed) {
                        case Speed.Fast4:
                            return 1710;
                        case Speed.Fast5:
                            return 1770;
                        case Speed.Normal:
                            return 1800;
                        case Speed.Slow7:
                            return 1860;
                        case Speed.Slow8:
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
export function attackPeriod(
    wepType: WeaponType,
    speed: Speed,
): number | undefined {
    switch (wepType) {
        case WeaponType.None:
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
                case Speed.Faster2:
                    return 600;
                case Speed.Faster3:
                    return 660;
                case Speed.Fast4:
                    return 720;
                case Speed.Fast5:
                    return 750;
                case Speed.Normal:
                    return 810;
                case Speed.Slow7:
                    return 870;
                case Speed.Slow8:
                    return 900;
                default:
                    return;
            }
        }
        case WeaponType.Spear:
        case WeaponType.Polearm: {
            switch (speed) {
                case Speed.Faster2:
                    return 570;
                case Speed.Faster3:
                    return 630;
                case Speed.Fast4:
                    return 660;
                case Speed.Fast5:
                    return 720;
                case Speed.Normal:
                    return 750;
                case Speed.Slow7:
                    return 810;
                case Speed.Slow8:
                    return 870;
                case Speed.Slower:
                    return 900;
            }
        }
        case WeaponType.Crossbow: {
            switch (speed) {
                case Speed.Faster2:
                    return 630;
                case Speed.Faster3:
                    return 690;
                case Speed.Fast4:
                    return 720;
                case Speed.Fast5:
                    return 780;
                case Speed.Normal:
                    return 870;
                default:
                    return;
            }
        }
        case WeaponType.Gun: {
            switch (speed) {
                case Speed.Faster2:
                    return 630;
                case Speed.Faster3:
                    return 690;
                case Speed.Fast4:
                    return 750;
                case Speed.Fast5:
                    return 780;
                case Speed.Normal:
                    return 810;
                default:
                    return;
            }
        }
    }
}

export function isHolySpell(spell: Spell): boolean {
    switch (spell) {
        case Spell.Heal:
        case Spell.ShiningRay:
        case Spell.Genesis:
            return true;
        default:
            return false;
    }
}

export function weaponTypeName(wepType: WeaponType): string {
    switch (wepType) {
        case WeaponType.None:
            return "no weapon";
        case WeaponType.OneHandedSword:
            return "one-handed sword";
        case WeaponType.OneHandedAxe:
            return "one-handed axe";
        case WeaponType.OneHandedMace:
            return "one-handed blunt weapon";
        case WeaponType.Dagger:
            return "dagger";
        case WeaponType.Wand:
            return "wand";
        case WeaponType.Staff:
            return "staff";
        case WeaponType.TwoHandedSword:
            return "two-handed sword";
        case WeaponType.TwoHandedAxe:
            return "two-handed axe";
        case WeaponType.TwoHandedMace:
            return "two-handed blunt weapon";
        case WeaponType.Spear:
            return "spear";
        case WeaponType.Polearm:
            return "polearm";
        case WeaponType.Bow:
            return "bow";
        case WeaponType.Crossbow:
            return "crossbow";
        case WeaponType.Claw:
            return "claw";
        case WeaponType.Knuckler:
            return "knuckler";
        case WeaponType.Gun:
            return "gun";
    }
}

export function className(clazz: Class): string {
    switch (clazz) {
        case Class.Beginner:
            return "beginner";
        case Class.Warrior:
            return "warrior";
        case Class.Magician:
            return "magician";
        case Class.Archer:
            return "archer";
        case Class.Rogue:
            return "rogue";
        case Class.Pirate:
            return "pirate";
        case Class.Pirate2nd:
            return "\u{2265}2\u{207f}\u{1d48} job pirate";
    }
}

export function attackName(attack: Attack): string {
    switch (attack) {
        case Attack.Other:
            return "basic attack";
        case Attack.LuckySeven:
            return "Lucky Seven";
        case Attack.TripleThrow:
            return "Triple Throw";
    }
}

export const BAD_WEPS = new Map([
    [
        Class.Beginner,
        new Set([
            WeaponType.None,
            WeaponType.TwoHandedAxe,
            WeaponType.Staff,
            WeaponType.Bow,
            WeaponType.Crossbow,
            WeaponType.Knuckler,
            WeaponType.Gun,
        ]),
    ],
    [
        Class.Warrior,
        new Set([
            WeaponType.None,
            WeaponType.Staff,
            WeaponType.Bow,
            WeaponType.Crossbow,
            WeaponType.Knuckler,
            WeaponType.Gun,
        ]),
    ],
    [
        Class.Magician,
        new Set([
            WeaponType.None,
            WeaponType.TwoHandedAxe,
            WeaponType.Bow,
            WeaponType.Crossbow,
            WeaponType.Knuckler,
            WeaponType.Gun,
        ]),
    ],
    [
        Class.Archer,
        new Set([
            WeaponType.None,
            WeaponType.Staff,
            WeaponType.Knuckler,
            WeaponType.Gun,
        ]),
    ],
    [
        Class.Rogue,
        new Set([
            WeaponType.None,
            WeaponType.Staff,
            WeaponType.Bow,
            WeaponType.Crossbow,
            WeaponType.Knuckler,
            WeaponType.Gun,
        ]),
    ],
    [
        Class.Pirate,
        new Set([
            WeaponType.TwoHandedAxe,
            WeaponType.Staff,
            WeaponType.Bow,
            WeaponType.Crossbow,
        ]),
    ],
    [
        Class.Pirate2nd,
        new Set([
            WeaponType.TwoHandedAxe,
            WeaponType.Staff,
            WeaponType.Bow,
            WeaponType.Crossbow,
        ]),
    ],
]);

export const ATTACK_REQS: Map<Attack, [Set<Class>, Set<WeaponType>]> = new Map(
    [
        [
            Attack.Other,
            [
                new Set([
                    Class.Beginner,
                    Class.Warrior,
                    Class.Magician,
                    Class.Archer,
                    Class.Rogue,
                    Class.Pirate,
                    Class.Pirate2nd,
                ]),
                new Set([
                    WeaponType.None,
                    WeaponType.OneHandedSword,
                    WeaponType.OneHandedAxe,
                    WeaponType.OneHandedMace,
                    WeaponType.Dagger,
                    WeaponType.Wand,
                    WeaponType.Staff,
                    WeaponType.TwoHandedSword,
                    WeaponType.TwoHandedAxe,
                    WeaponType.TwoHandedMace,
                    WeaponType.Spear,
                    WeaponType.Polearm,
                    WeaponType.Bow,
                    WeaponType.Crossbow,
                    WeaponType.Claw,
                    WeaponType.Knuckler,
                    WeaponType.Gun,
                ]),
            ],
        ],
        [
            Attack.LuckySeven,
            [new Set([Class.Rogue]), new Set([WeaponType.Claw])],
        ],
        [
            Attack.TripleThrow,
            [new Set([Class.Rogue]), new Set([WeaponType.Claw])],
        ],
    ],
);
