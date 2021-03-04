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
    Rush = 1121006,
    Brandish = 1121008,
    Blast = 1221009,
    HeavensHammerXiuz = 1221011,
    HeavensHammerXiuzCorrected = 1221111,
    CrusherHigh = 1311001,
    CrusherLow = 1311101,
    Fury = 1311004,
    DragonRoar = 1311006,
    PowerKnockBack = 3101003,
    ArrowBombImpact = 3101005,
    ArrowBombSplash = 3101105,
    IronArrow = 3201005,
    Inferno = 3111003,
    Blizzard = 3211003,
    Hurricane = 3121004,
    Phoenix = 3121006,
    Frostprey = 3221005,
    PiercingArrow = 3221001,
    LuckySeven = 4001344,
    Avenger = 4111005,
    TripleThrow = 4121007,
    Assaulter = 4211002,
    NinjaAmbush = 4121004,
    VenomousStar = 4120005,
    VenomousStab = 4220005,
    NinjaStorm = 4121008,
    SavageBlow = 4201005,
    BoomerangStep = 4221007,
    FlashFist = 5001001,
    SomersaultKick = 5001002,
    DoubleShot = 5001003,
    BackspinBlow = 5101002,
    DoubleUppercut = 5101003,
    EnergyBlast = 5111002,
    EnergyDrain = 5111004,
    Shockwave = 5111006,
    DragonStrike = 5121001,
    EnergyOrb = 5121002,
    Demolition = 5121004,
    Snatch = 5121005,
    Barrage = 5121007,
    InvisibleShot = 5201001,
    Grenade = 5201002,
    BlankShot = 5201004,
    RecoilShot = 5201006,
    BurstFire = 5210000,
    Octopus = 5211001,
    Gaviota = 5211002,
    Flamethrower = 5211004,
    IceSplitter = 5211005,
    HomingBeacon = 5211006,
    WrathOfTheOctopi = 5220002,
    AerialStrike = 5221003,
    RapidFire = 5221004,
    BattleshipCannon = 5221007,
    BattleshipTorpedo = 5221008,
}

export enum Spell {
    Other = 0,
    Explosion = 2111002,
    PoisonMist = 2111003,
    ElementCompositionFP = 2111006,
    Elquines = 2121005,
    MeteorShower = 2121007,
    IceStrike = 2211002,
    ThunderSpear = 2211003,
    ElementCompositionIL = 2211006,
    Ifrit = 2221005,
    ChainLightning = 2221006,
    Blizzard = 2221007,
    Heal = 2301002,
    HolyArrow = 2301005,
    ShiningRay = 2311004,
    SummonDragon = 2311006,
    Bahamut = 2321003,
    AngelRay = 2321007,
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

export const enum ChargeType {
    None,
    Holy,
    Other,
}

export class InputData {
    public constructor(
        public stats: Stats,
        public totalWatk: number,
        public totalMatk: number,
        public echo: number,
        public mastery: number,
        public skillDmgMulti: number,
        public skillBasicAtk: number,
        public skillLines: number,
        public critProb: number,
        public critDmg: number,
        public clazz: Class,
        public level: number,
        public wepType: WeaponType,
        public goodAnimProb: number,
        public attack: Attack,
        public spell: Spell,
        public speed: Speed,
        public spellBooster: number,
        public eleAmp: number,
        public eleBoost: number,
        public eleWep: number,
        public eleChargeType: ChargeType,
        public eleChargeDmg: number,
        public eleChargeLevel: number,
        public caActive: boolean,
        public caDmg: number,
        public caLevel: number,
        public caOrbs: number,
        public zerkActive: boolean,
        public zerkDmg: number,
        public enemyWdef: number,
        public enemyMdef: number,
        public eleSus: number,
        public enemyLevel: number,
        public enemyCount: number,
        public hitOrd: number,
    ) {}
}
