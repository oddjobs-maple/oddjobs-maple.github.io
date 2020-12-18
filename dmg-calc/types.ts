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

export class Stats {
    public constructor(
        public str: number,
        public dex: number,
        public int: number,
        public luk: number,
    ) {}
}

export enum WeaponType {
    None = 0,
    OneHandedSword = 30,
    OneHandedAxe = 31,
    OneHandedMace = 32,
    Dagger = 33,
    Wand = 37,
    Staff = 38,
    TwoHandedSword = 40,
    TwoHandedAxe = 41,
    TwoHandedMace = 42,
    Spear = 43,
    Polearm = 44,
    Bow = 45,
    Crossbow = 46,
    Claw = 47,
    Knuckler = 48,
    Gun = 49,
}

export enum Attack {
    Other = 0,
    BowWhack = -1,
    ClawPunch = -2,
    Panic = 1111003,
    Coma = 1111005,
    HeavensHammerXiuz = 1221011,
    HeavensHammerXiuzCorrected = 1221111,
    DragonRoar = 1311006,
    PowerKnockBack = 3101003,
    ArrowBombImpact = 3101005,
    ArrowBombSplash = 3101105,
    Phoenix = 3121006,
    Frostprey = 3221005,
    LuckySeven = 4001344,
    TripleThrow = 4121007,
    Assaulter = 4211002,
    NinjaAmbush = 4121004,
    VenomousStar = 4120005,
    VenomousStab = 4220005,
    SomersaultKick = 5001002,
    Octopus = 5211001,
    Gaviota = 5211002,
    WrathOfTheOctopi = 5220002,
}

export enum Spell {
    Other = 0,
    Explosion = 2111002,
    PoisonMist = 2111003,
    ElementCompositionFP = 2111006,
    MeteorShower = 2121007,
    IceStrike = 2211002,
    ThunderSpear = 2211003,
    ElementCompositionIL = 2211006,
    ChainLightning = 2221006,
    Blizzard = 2221007,
    Heal = 2301002,
    ShiningRay = 2311004,
    Genesis = 2321008,
}

export enum Class {
    Beginner = 0,
    Warrior = 100,
    Magician = 200,
    Archer = 300,
    Rogue = 400,
    Pirate = 500,
    Pirate2nd = 510,
}

export const enum Speed {
    Faster2 = 2,
    Faster3 = 3,
    Fast4 = 4,
    Fast5 = 5,
    Normal = 6,
    Slow7 = 7,
    Slow8 = 8,
    Slower = 9,
}

export class InputData {
    public constructor(
        public stats: Stats,
        public totalWatk: number,
        public totalMatk: number,
        public mastery: number,
        public skillDmgMulti: number,
        public skillBasicAtk: number,
        public skillLines: number,
        public critProb: number,
        public critDmg: number,
        public clazz: Class,
        public level: number,
        public wepType: WeaponType,
        public attack: Attack,
        public spell: Spell,
        public speed: Speed,
        public spellBooster: number,
        public eleAmp: number,
        public caActive: boolean,
        public caDmg: number,
        public caLevel: number,
        public caOrbs: number,
        public enemyWdef: number,
        public enemyMdef: number,
        public eleSus: number,
        public enemyLevel: number,
        public enemyCount: number,
    ) {}
}
