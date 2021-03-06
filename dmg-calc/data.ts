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

import {
    Attack,
    ChargeType,
    Class,
    Speed,
    Spell,
    Stats,
    WeaponType,
} from "./types.js";

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
        case Spell.Other:
        case Spell.HolyArrow:
        case Spell.AngelRay: {
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
        case Spell.Elquines:
        case Spell.Ifrit:
        case Spell.SummonDragon:
        case Spell.Bahamut:
            return 3030;
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
    attack: Attack,
): number | undefined {
    /*======== Attacking skills with special attack periods ========*/

    switch (attack) {
        case Attack.Panic:
        case Attack.Coma:
        case Attack.HeavensHammerXiuz:
        case Attack.HeavensHammerXiuzCorrected:
        case Attack.Grenade:
            return;
        case Attack.Rush:
            return 1770;
        case Attack.Brandish:
        case Attack.Blast: {
            switch (speed) {
                case Speed.Faster2:
                    return 630;
                case Speed.Faster3:
                    return 690;
                case Speed.Fast4:
                    return 750;
                case Speed.Fast5:
                    return 810;
                case Speed.Normal:
                    return 840;
                case Speed.Slow7:
                    return 900;
                case Speed.Slow8:
                    return 960;
                default:
                    return;
            }
        }
        case Attack.CrusherHigh: {
            switch (speed) {
                case Speed.Faster2:
                    return 810;
                case Speed.Faster3:
                    return 870;
                case Speed.Fast4:
                    return 930;
                case Speed.Fast5:
                    return 990;
                case Speed.Normal:
                    return 1050;
                case Speed.Slow7:
                    return 1140;
                case Speed.Slow8:
                    return 1200;
                case Speed.Slower:
                    return 1260;
            }
        }
        case Attack.CrusherLow: {
            switch (speed) {
                case Speed.Faster2:
                    return 690;
                case Speed.Faster3:
                    return 750;
                case Speed.Fast4:
                    return 810;
                case Speed.Fast5:
                    return 870;
                case Speed.Normal:
                    return 900;
                case Speed.Slow7:
                    return 960;
                case Speed.Slow8:
                    return 1020;
                case Speed.Slower:
                    return 1080;
            }
        }
        case Attack.Fury: {
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
                case Speed.Slower:
                    return 960;
            }
        }
        case Attack.DragonRoar: {
            switch (speed) {
                case Speed.Faster2:
                    return 1140;
                case Speed.Faster3:
                    return 1230;
                case Speed.Fast4:
                    return 1320;
                case Speed.Fast5:
                    return 1410;
                case Speed.Normal:
                    return 1500;
                case Speed.Slow7:
                    return 1620;
                case Speed.Slow8:
                    return 1710;
                case Speed.Slower:
                    return 1800;
            }
        }
        case Attack.Hurricane:
        case Attack.RapidFire:
            return 120;
        case Attack.Phoenix:
        case Attack.Frostprey:
            return 3030;
        case Attack.Avenger: {
            switch (speed) {
                case Speed.Faster2:
                    return 630;
                case Speed.Faster3:
                    return 690;
                case Speed.Fast4:
                    return 750;
                case Speed.Fast5:
                    return 810;
                case Speed.Normal:
                    return 840;
                default:
                    return;
            }
        }
        case Attack.Assaulter: {
            switch (speed) {
                case Speed.Faster2:
                    return 900;
                case Speed.Faster3:
                    return 990;
                case Speed.Fast4:
                    return 1050;
                case Speed.Fast5:
                    return 1140;
                default:
                    return;
            }
        }
        case Attack.NinjaAmbush:
        case Attack.VenomousStar:
        case Attack.VenomousStab:
            return 1000;
        case Attack.NinjaStorm:
            return 1440;
        case Attack.SavageBlow: {
            switch (speed) {
                case Speed.Faster2:
                    return 720;
                case Speed.Faster3:
                    return 780;
                case Speed.Fast4:
                    return 840;
                case Speed.Fast5:
                    return 900;
                default:
                    return;
            }
        }
        case Attack.BoomerangStep:
            return 1950;
        case Attack.FlashFist:
        case Attack.EnergyDrain: {
            switch (speed) {
                case Speed.Faster2:
                    return 450;
                case Speed.Faster3:
                    return 510;
                case Speed.Fast4:
                    return 540;
                case Speed.Fast5:
                    return 570;
                case Speed.Normal:
                    return 600;
                default:
                    return;
            }
        }
        case Attack.SomersaultKick: {
            switch (speed) {
                case Speed.Faster2:
                    return 660;
                case Speed.Faster3:
                    return 720;
                case Speed.Fast4:
                    return 780;
                case Speed.Fast5:
                    return 840;
                case Speed.Normal:
                    return 870;
                default:
                    return;
            }
        }
        case Attack.DoubleShot: {
            switch (speed) {
                case Speed.Faster2:
                    return 390;
                case Speed.Faster3:
                    return 420;
                case Speed.Fast4:
                    return 450;
                case Speed.Fast5:
                case Speed.Normal:
                    return 480;
                default:
                    return;
            }
        }
        case Attack.BackspinBlow:
            return 1980;
        case Attack.DoubleUppercut:
            return 2160;
        case Attack.EnergyBlast:
            return 1140;
        case Attack.Shockwave: {
            switch (speed) {
                case Speed.Faster2:
                    return 1500;
                case Speed.Faster3:
                    return 1620;
                case Speed.Fast4:
                    return 1740;
                case Speed.Fast5:
                    return 1860;
                case Speed.Normal:
                    return 1980;
                default:
                    return;
            }
        }
        case Attack.DragonStrike:
            return 2250;
        case Attack.EnergyOrb: {
            switch (speed) {
                case Speed.Faster2:
                    return 930;
                case Speed.Faster3:
                    return 990;
                case Speed.Fast4:
                    return 1050;
                case Speed.Fast5:
                    return 1140;
                case Speed.Normal:
                    return 1200;
                default:
                    return;
            }
        }
        case Attack.Demolition: {
            switch (speed) {
                case Speed.Faster2:
                    return 2340;
                case Speed.Faster3:
                    return 2550;
                case Speed.Fast4:
                    return 2730;
                case Speed.Fast5:
                    return 2940;
                case Speed.Normal:
                    return 3120;
                default:
                    return;
            }
        }
        case Attack.Snatch:
            return 1320;
        case Attack.Barrage:
            return 3240;
        case Attack.InvisibleShot: {
            switch (speed) {
                case Speed.Faster2:
                    return 630;
                case Speed.Faster3:
                    return 660;
                case Speed.Fast4:
                    return 720;
                case Speed.Fast5:
                    return 750;
                case Speed.Normal:
                    return 810;
                default:
                    return;
            }
        }
        case Attack.BlankShot:
        case Attack.BurstFire: {
            switch (speed) {
                case Speed.Faster2:
                    return 660;
                case Speed.Faster3:
                    return 690;
                case Speed.Fast4:
                    return 750;
                case Speed.Fast5:
                    return 810;
                case Speed.Normal:
                    return 840;
                default:
                    return;
            }
        }
        case Attack.RecoilShot:
            return 2310;
        case Attack.Octopus:
        case Attack.Gaviota:
        case Attack.WrathOfTheOctopi:
            return 1530;
        case Attack.Flamethrower:
        case Attack.IceSplitter:
            return 1050;
        case Attack.AerialStrike:
            return 5000;
        case Attack.HomingBeacon:
        case Attack.BattleshipTorpedo: {
            switch (speed) {
                case Speed.Faster2:
                    return 720;
                case Speed.Faster3:
                    return 780;
                case Speed.Fast4:
                    return 840;
                case Speed.Fast5:
                    return 900;
                case Speed.Normal:
                    return 960;
                default:
                    return;
            }
        }
        case Attack.BattleshipCannon: {
            switch (speed) {
                case Speed.Faster2:
                    return 600;
                case Speed.Faster3:
                    return 630;
                case Speed.Fast4:
                    return 690;
                case Speed.Fast5:
                    return 750;
                case Speed.Normal:
                    return 780;
                default:
                    return;
            }
        }
        default:
            break;
    }

    /*======== Basic attack periods ========*/

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

export function attackIsElemental(attack: Attack): boolean {
    switch (attack) {
        case Attack.Inferno:
        case Attack.Blizzard:
        case Attack.Phoenix:
        case Attack.Frostprey:
        case Attack.VenomousStar:
        case Attack.VenomousStab:
        case Attack.Flamethrower:
        case Attack.IceSplitter:
            return true;
        default:
            return false;
    }
}

export function isHolySpell(spell: Spell): boolean {
    switch (spell) {
        case Spell.Heal:
        case Spell.HolyArrow:
        case Spell.ShiningRay:
        case Spell.SummonDragon:
        case Spell.Bahamut:
        case Spell.AngelRay:
        case Spell.Genesis:
            return true;
        default:
            return false;
    }
}

export function isSummon(attack: Attack): boolean {
    switch (attack) {
        case Attack.Phoenix:
        case Attack.Frostprey:
        case Attack.Octopus:
        case Attack.Gaviota:
        case Attack.WrathOfTheOctopi:
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
        case Attack.BowWhack:
            return "bow whack";
        case Attack.ClawPunch:
            return "claw punch";
        case Attack.Panic:
            return "Panic";
        case Attack.Coma:
            return "Coma";
        case Attack.Rush:
            return "Rush";
        case Attack.Brandish:
            return "Brandish";
        case Attack.Blast:
            return "Blast";
        case Attack.HeavensHammerXiuz:
            return "Heaven\u{2019}s Hammer (original Xiuz)";
        case Attack.HeavensHammerXiuzCorrected:
            return "Heaven\u{2019}s Hammer (corrected Xiuz)";
        case Attack.CrusherHigh:
            return "Crusher (lvl 16~30)";
        case Attack.CrusherLow:
            return "Crusher (lvl 1~15)";
        case Attack.Fury:
            return "Fury";
        case Attack.DragonRoar:
            return "Dragon Roar";
        case Attack.PowerKnockBack:
            return "Power Knock-Back";
        case Attack.ArrowBombImpact:
            return "Arrow Bomb (impact)";
        case Attack.ArrowBombSplash:
            return "Arrow Bomb (splash)";
        case Attack.IronArrow:
            return "Iron Arrow";
        case Attack.Inferno:
            return "Inferno";
        case Attack.Blizzard:
            return "Blizzard";
        case Attack.Hurricane:
            return "Hurricane";
        case Attack.Phoenix:
            return "Phoenix";
        case Attack.Frostprey:
            return "Frostprey";
        case Attack.PiercingArrow:
            return "Piercing Arrow";
        case Attack.LuckySeven:
            return "Lucky Seven";
        case Attack.Avenger:
            return "Avenger";
        case Attack.TripleThrow:
            return "Triple Throw";
        case Attack.Assaulter:
            return "Assaulter";
        case Attack.NinjaAmbush:
            return "Ninja Ambush";
        case Attack.VenomousStar:
            return "Venomous Star";
        case Attack.VenomousStab:
            return "Venomous Stab";
        case Attack.NinjaStorm:
            return "Ninja Storm";
        case Attack.SavageBlow:
            return "Savage Blow";
        case Attack.BoomerangStep:
            return "Boomerang Step";
        case Attack.FlashFist:
            return "Flash Fist";
        case Attack.SomersaultKick:
            return "Somersault Kick";
        case Attack.DoubleShot:
            return "Double Shot";
        case Attack.BackspinBlow:
            return "Backspin Blow";
        case Attack.DoubleUppercut:
            return "Double Uppercut";
        case Attack.EnergyDrain:
            return "Energy Drain";
        case Attack.EnergyBlast:
            return "Energy Blast";
        case Attack.Shockwave:
            return "Shockwave";
        case Attack.DragonStrike:
            return "Dragon Strike";
        case Attack.EnergyOrb:
            return "Energy Orb";
        case Attack.Demolition:
            return "Demolition";
        case Attack.Snatch:
            return "Snatch";
        case Attack.Barrage:
            return "Barrage";
        case Attack.InvisibleShot:
            return "Invisible Shot";
        case Attack.Grenade:
            return "Grenade";
        case Attack.BlankShot:
            return "Blank Shot";
        case Attack.RecoilShot:
            return "Recoil Shot";
        case Attack.BurstFire:
            return "Burst Fire";
        case Attack.Octopus:
            return "Octopus";
        case Attack.Gaviota:
            return "Gaviota";
        case Attack.Flamethrower:
            return "Flamethrower";
        case Attack.IceSplitter:
            return "Ice Splitter";
        case Attack.HomingBeacon:
            return "Homing Beacon";
        case Attack.WrathOfTheOctopi:
            return "Wrath of the Octopi";
        case Attack.AerialStrike:
            return "Aerial Strike";
        case Attack.RapidFire:
            return "Rapid Fire";
        case Attack.BattleshipCannon:
            return "Battleship Cannon";
        case Attack.BattleshipTorpedo:
            return "Battleship Torpedo";
    }
}

export function spellName(spell: Spell): string {
    switch (spell) {
        case Spell.Other:
            return "a spell";
        case Spell.Explosion:
            return "Explosion";
        case Spell.PoisonMist:
            return "Poison Mist";
        case Spell.ElementCompositionFP:
            return "Element Composition [F/P]";
        case Spell.Elquines:
            return "Elquines";
        case Spell.MeteorShower:
            return "Meteor Shower";
        case Spell.IceStrike:
            return "Ice Strike";
        case Spell.ThunderSpear:
            return "Thunder Spear";
        case Spell.ElementCompositionIL:
            return "Element Composition [I/L]";
        case Spell.Ifrit:
            return "Ifrit";
        case Spell.ChainLightning:
            return "Chain Lightning";
        case Spell.Blizzard:
            return "Blizzard";
        case Spell.Heal:
            return "Heal";
        case Spell.HolyArrow:
            return "Holy Arrow";
        case Spell.ShiningRay:
            return "Shining Ray";
        case Spell.SummonDragon:
            return "Summon Dragon";
        case Spell.Bahamut:
            return "Bahamut";
        case Spell.AngelRay:
            return "Angel Ray";
        case Spell.Genesis:
            return "Genesis";
    }
}

export function chargeTypeFromValue(val: string): ChargeType | undefined {
    switch (val) {
        case "no-ele-charge":
            return ChargeType.None;
        case "holy-ele-charge":
            return ChargeType.Holy;
        case "other-ele-charge":
            return ChargeType.Other;
        default:
            return;
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

export const ATTACK_REQS: Map<
    Attack,
    [Set<Class>, number, Set<WeaponType>]
> = new Map([
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
            0,
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
        Attack.BowWhack,
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
            0,
            new Set([WeaponType.Bow, WeaponType.Crossbow]),
        ],
    ],
    [
        Attack.ClawPunch,
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
            0,
            new Set([WeaponType.Claw]),
        ],
    ],
    [
        Attack.Panic,
        [
            new Set([Class.Warrior]),
            71,
            new Set([
                WeaponType.OneHandedSword,
                WeaponType.OneHandedAxe,
                WeaponType.TwoHandedSword,
                WeaponType.TwoHandedAxe,
            ]),
        ],
    ],
    [
        Attack.Coma,
        [
            new Set([Class.Warrior]),
            71,
            new Set([
                WeaponType.OneHandedSword,
                WeaponType.OneHandedAxe,
                WeaponType.TwoHandedSword,
                WeaponType.TwoHandedAxe,
            ]),
        ],
    ],
    [
        Attack.Rush,
        [
            new Set([Class.Warrior]),
            120,
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
        Attack.Brandish,
        [
            new Set([Class.Warrior]),
            120,
            new Set([
                WeaponType.OneHandedSword,
                WeaponType.OneHandedAxe,
                WeaponType.TwoHandedSword,
                WeaponType.TwoHandedAxe,
            ]),
        ],
    ],
    [
        Attack.Blast,
        [
            new Set([Class.Warrior]),
            120,
            new Set([
                WeaponType.OneHandedSword,
                WeaponType.OneHandedMace,
                WeaponType.TwoHandedSword,
                WeaponType.TwoHandedMace,
            ]),
        ],
    ],
    [
        Attack.HeavensHammerXiuz,
        [
            new Set([Class.Warrior]),
            120,
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
        Attack.HeavensHammerXiuzCorrected,
        [
            new Set([Class.Warrior]),
            120,
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
        Attack.CrusherHigh,
        [
            new Set([Class.Warrior]),
            75,
            new Set([WeaponType.Spear, WeaponType.Polearm]),
        ],
    ],
    [
        Attack.CrusherLow,
        [
            new Set([Class.Warrior]),
            70,
            new Set([WeaponType.Spear, WeaponType.Polearm]),
        ],
    ],
    [
        Attack.Fury,
        [
            new Set([Class.Warrior]),
            70,
            new Set([WeaponType.Spear, WeaponType.Polearm]),
        ],
    ],
    [
        Attack.DragonRoar,
        [
            new Set([Class.Warrior]),
            71,
            new Set([WeaponType.Spear, WeaponType.Polearm]),
        ],
    ],
    [
        Attack.PowerKnockBack,
        [
            new Set([Class.Archer]),
            30,
            new Set([WeaponType.Bow, WeaponType.Crossbow]),
        ],
    ],
    [
        Attack.ArrowBombImpact,
        [new Set([Class.Archer]), 30, new Set([WeaponType.Bow])],
    ],
    [
        Attack.ArrowBombSplash,
        [new Set([Class.Archer]), 30, new Set([WeaponType.Bow])],
    ],
    [
        Attack.IronArrow,
        [new Set([Class.Archer]), 30, new Set([WeaponType.Crossbow])],
    ],
    [Attack.Inferno, [new Set([Class.Archer]), 70, new Set([WeaponType.Bow])]],
    [
        Attack.Blizzard,
        [new Set([Class.Archer]), 70, new Set([WeaponType.Crossbow])],
    ],
    [
        Attack.Hurricane,
        [new Set([Class.Archer]), 120, new Set([WeaponType.Bow])],
    ],
    [
        Attack.Phoenix,
        [
            new Set([Class.Archer]),
            120,
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
        Attack.Frostprey,
        [
            new Set([Class.Archer]),
            120,
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
        Attack.PiercingArrow,
        [new Set([Class.Archer]), 120, new Set([WeaponType.Crossbow])],
    ],
    [
        Attack.LuckySeven,
        [new Set([Class.Rogue]), 10, new Set([WeaponType.Claw])],
    ],
    [Attack.Avenger, [new Set([Class.Rogue]), 70, new Set([WeaponType.Claw])]],
    [
        Attack.TripleThrow,
        [new Set([Class.Rogue]), 120, new Set([WeaponType.Claw])],
    ],
    [
        Attack.Assaulter,
        [new Set([Class.Rogue]), 70, new Set([WeaponType.Dagger])],
    ],
    [
        Attack.NinjaAmbush,
        [
            new Set([Class.Rogue]),
            122,
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
        Attack.VenomousStar,
        [new Set([Class.Rogue]), 120, new Set([WeaponType.Claw])],
    ],
    [
        Attack.VenomousStab,
        [new Set([Class.Rogue]), 120, new Set([WeaponType.Dagger])],
    ],
    [
        Attack.NinjaStorm,
        [
            new Set([Class.Rogue]),
            120,
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
        Attack.SavageBlow,
        [new Set([Class.Rogue]), 30, new Set([WeaponType.Dagger])],
    ],
    [
        Attack.BoomerangStep,
        [new Set([Class.Rogue]), 120, new Set([WeaponType.Dagger])],
    ],
    [
        Attack.FlashFist,
        [
            new Set([Class.Pirate, Class.Pirate2nd]),
            10,
            new Set([WeaponType.None, WeaponType.Knuckler]),
        ],
    ],
    [
        Attack.SomersaultKick,
        [
            new Set([Class.Pirate, Class.Pirate2nd]),
            10,
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
        Attack.DoubleShot,
        [
            new Set([Class.Pirate, Class.Pirate2nd]),
            10,
            new Set([WeaponType.Gun]),
        ],
    ],
    [
        Attack.BackspinBlow,
        [
            new Set([Class.Pirate2nd]),
            30,
            new Set([WeaponType.None, WeaponType.Knuckler]),
        ],
    ],
    [
        Attack.DoubleUppercut,
        [
            new Set([Class.Pirate2nd]),
            30,
            new Set([WeaponType.None, WeaponType.Knuckler]),
        ],
    ],
    [
        Attack.EnergyDrain,
        [
            new Set([Class.Pirate2nd]),
            71,
            new Set([WeaponType.None, WeaponType.Knuckler]),
        ],
    ],
    [
        Attack.EnergyBlast,
        [
            new Set([Class.Pirate2nd]),
            71,
            new Set([WeaponType.None, WeaponType.Knuckler]),
        ],
    ],
    [
        Attack.Shockwave,
        [
            new Set([Class.Pirate2nd]),
            71,
            new Set([WeaponType.None, WeaponType.Knuckler]),
        ],
    ],
    [
        Attack.DragonStrike,
        [
            new Set([Class.Pirate2nd]),
            120,
            new Set([WeaponType.None, WeaponType.Knuckler]),
        ],
    ],
    [
        Attack.EnergyOrb,
        [
            new Set([Class.Pirate2nd]),
            120,
            new Set([WeaponType.None, WeaponType.Knuckler]),
        ],
    ],
    [
        Attack.Demolition,
        [
            new Set([Class.Pirate2nd]),
            121,
            new Set([WeaponType.None, WeaponType.Knuckler]),
        ],
    ],
    [
        Attack.Snatch,
        [
            new Set([Class.Pirate2nd]),
            121,
            new Set([WeaponType.None, WeaponType.Knuckler]),
        ],
    ],
    [
        Attack.Barrage,
        [
            new Set([Class.Pirate2nd]),
            120,
            new Set([WeaponType.None, WeaponType.Knuckler]),
        ],
    ],
    [
        Attack.InvisibleShot,
        [new Set([Class.Pirate2nd]), 30, new Set([WeaponType.Gun])],
    ],
    [
        Attack.Grenade,
        [new Set([Class.Pirate2nd]), 30, new Set([WeaponType.Gun])],
    ],
    [
        Attack.BlankShot,
        [new Set([Class.Pirate2nd]), 30, new Set([WeaponType.Gun])],
    ],
    [
        Attack.RecoilShot,
        [new Set([Class.Pirate2nd]), 30, new Set([WeaponType.Gun])],
    ],
    [
        Attack.BurstFire,
        [new Set([Class.Pirate2nd]), 70, new Set([WeaponType.Gun])],
    ],
    [
        Attack.Octopus,
        [
            new Set([Class.Pirate2nd]),
            70,
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
        Attack.Gaviota,
        [
            new Set([Class.Pirate2nd]),
            70,
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
        Attack.Flamethrower,
        [new Set([Class.Pirate2nd]), 70, new Set([WeaponType.Gun])],
    ],
    [
        Attack.IceSplitter,
        [new Set([Class.Pirate2nd]), 70, new Set([WeaponType.Gun])],
    ],
    [
        Attack.HomingBeacon,
        [new Set([Class.Pirate2nd]), 70, new Set([WeaponType.Gun])],
    ],
    [
        Attack.WrathOfTheOctopi,
        [
            new Set([Class.Pirate2nd]),
            120,
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
        Attack.AerialStrike,
        [
            new Set([Class.Pirate2nd]),
            120,
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
        Attack.RapidFire,
        [new Set([Class.Pirate2nd]), 120, new Set([WeaponType.Gun])],
    ],
    [
        Attack.BattleshipCannon,
        [new Set([Class.Pirate2nd]), 121, new Set([WeaponType.Gun])],
    ],
    [
        Attack.BattleshipTorpedo,
        [new Set([Class.Pirate2nd]), 121, new Set([WeaponType.Gun])],
    ],
]);

export const SPELL_LVL_REQS: Map<Spell, number> = new Map([
    [Spell.Other, 0],
    [Spell.Explosion, 70],
    [Spell.PoisonMist, 70],
    [Spell.ElementCompositionFP, 70],
    [Spell.Elquines, 120],
    [Spell.MeteorShower, 120],
    [Spell.IceStrike, 70],
    [Spell.ThunderSpear, 70],
    [Spell.ElementCompositionIL, 70],
    [Spell.Ifrit, 120],
    [Spell.ChainLightning, 120],
    [Spell.Blizzard, 120],
    [Spell.Heal, 30],
    [Spell.HolyArrow, 30],
    [Spell.ShiningRay, 70],
    [Spell.SummonDragon, 70],
    [Spell.Bahamut, 120],
    [Spell.AngelRay, 120],
    [Spell.Genesis, 120],
]);

export const JOB_LVL_REQS: Map<Class, number> = new Map([
    [Class.Beginner, 0],
    [Class.Warrior, 10],
    [Class.Magician, 8],
    [Class.Archer, 10],
    [Class.Rogue, 10],
    [Class.Pirate, 10],
    [Class.Pirate2nd, 30],
]);

/**
 * The first two numbers of the 3-tuple represent the minimum and maximum
 * number of lines, respectively.  The last number represents the maximum
 * number of targets.
 */
export const ATTACK_LINES: Map<Attack, [number, number, number]> = new Map([
    [Attack.Other, [1, 32767, 15]],
    [Attack.BowWhack, [1, 1, 1]],
    [Attack.ClawPunch, [1, 1, 1]],
    [Attack.Panic, [1, 1, 1]],
    [Attack.Coma, [1, 1, 6]],
    [Attack.Rush, [1, 1, 10]],
    [Attack.Brandish, [2, 2, 3]],
    [Attack.Blast, [1, 1, 1]],
    [Attack.HeavensHammerXiuz, [1, 1, 15]],
    [Attack.HeavensHammerXiuzCorrected, [1, 1, 15]],
    [Attack.CrusherHigh, [3, 3, 3]],
    [Attack.CrusherLow, [2, 2, 3]],
    [Attack.Fury, [1, 1, 6]],
    [Attack.DragonRoar, [1, 1, 6]],
    [Attack.PowerKnockBack, [1, 1, 6]],
    [Attack.ArrowBombImpact, [1, 1, 1]],
    [Attack.ArrowBombSplash, [1, 1, 5]],
    [Attack.IronArrow, [1, 1, 6]],
    [Attack.Inferno, [1, 1, 6]],
    [Attack.Blizzard, [1, 1, 6]],
    [Attack.Hurricane, [1, 1, 1]],
    [Attack.Phoenix, [1, 1, 4]],
    [Attack.Frostprey, [1, 1, 4]],
    [Attack.PiercingArrow, [1, 1, 6]],
    [Attack.LuckySeven, [2, 2, 1]],
    [Attack.Avenger, [1, 1, 6]],
    [Attack.TripleThrow, [3, 3, 1]],
    [Attack.Assaulter, [1, 1, 1]],
    [Attack.NinjaAmbush, [1, 1, 6]],
    [Attack.VenomousStar, [1, 1, 1]],
    [Attack.VenomousStab, [1, 1, 1]],
    [Attack.NinjaStorm, [1, 1, 6]],
    [Attack.SavageBlow, [4, 6, 1]],
    [Attack.BoomerangStep, [2, 2, 4]],
    [Attack.FlashFist, [1, 1, 1]],
    [Attack.SomersaultKick, [1, 1, 6]],
    [Attack.DoubleShot, [2, 2, 1]],
    [Attack.BackspinBlow, [1, 1, 3]],
    [Attack.DoubleUppercut, [2, 2, 1]],
    [Attack.EnergyDrain, [1, 1, 1]],
    [Attack.EnergyBlast, [1, 1, 4]],
    [Attack.Shockwave, [1, 1, 6]],
    [Attack.DragonStrike, [1, 1, 6]],
    [Attack.EnergyOrb, [1, 1, 6]],
    [Attack.Demolition, [8, 8, 1]],
    [Attack.Snatch, [1, 1, 6]],
    [Attack.Barrage, [6, 6, 1]],
    [Attack.InvisibleShot, [1, 1, 3]],
    [Attack.BlankShot, [1, 1, 3]],
    [Attack.RecoilShot, [1, 1, 1]],
    [Attack.BurstFire, [3, 3, 1]],
    [Attack.Octopus, [1, 1, 1]],
    [Attack.Gaviota, [1, 1, 6]],
    [Attack.Flamethrower, [1, 1, 6]],
    [Attack.IceSplitter, [1, 1, 6]],
    [Attack.HomingBeacon, [1, 1, 1]],
    [Attack.WrathOfTheOctopi, [1, 1, 1]],
    [Attack.AerialStrike, [1, 1, 15]],
    [Attack.RapidFire, [1, 1, 1]],
    [Attack.BattleshipCannon, [3, 4, 1]],
    [Attack.BattleshipTorpedo, [1, 1, 6]],
]);

/**
 * The first two numbers of the 3-tuple represent the minimum and maximum
 * number of lines, respectively.  The last number represents the maximum
 * number of targets.
 */
export const SPELL_LINES: Map<Spell, [number, number, number]> = new Map([
    [Spell.Other, [1, 32767, 15]],
    [Spell.Explosion, [1, 1, 6]],
    [Spell.PoisonMist, [1, 1, 6]],
    [Spell.ElementCompositionFP, [1, 1, 1]],
    [Spell.Elquines, [1, 1, 3]],
    [Spell.MeteorShower, [1, 1, 15]],
    [Spell.IceStrike, [1, 1, 6]],
    [Spell.ThunderSpear, [1, 1, 1]],
    [Spell.ElementCompositionIL, [1, 1, 1]],
    [Spell.Ifrit, [1, 1, 3]],
    [Spell.ChainLightning, [1, 1, 6]],
    [Spell.Blizzard, [1, 1, 15]],
    [Spell.Heal, [1, 1, 5]],
    [Spell.HolyArrow, [1, 1, 1]],
    [Spell.ShiningRay, [1, 1, 6]],
    [Spell.SummonDragon, [1, 1, 1]],
    [Spell.Bahamut, [1, 1, 3]],
    [Spell.AngelRay, [1, 1, 1]],
    [Spell.Genesis, [1, 1, 15]],
]);
