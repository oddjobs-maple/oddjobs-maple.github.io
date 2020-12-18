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
    constructor(str, dex, int, luk) {
        this.str = str;
        this.dex = dex;
        this.int = int;
        this.luk = luk;
    }
}
export var WeaponType;
(function (WeaponType) {
    WeaponType[WeaponType["None"] = 0] = "None";
    WeaponType[WeaponType["OneHandedSword"] = 30] = "OneHandedSword";
    WeaponType[WeaponType["OneHandedAxe"] = 31] = "OneHandedAxe";
    WeaponType[WeaponType["OneHandedMace"] = 32] = "OneHandedMace";
    WeaponType[WeaponType["Dagger"] = 33] = "Dagger";
    WeaponType[WeaponType["Wand"] = 37] = "Wand";
    WeaponType[WeaponType["Staff"] = 38] = "Staff";
    WeaponType[WeaponType["TwoHandedSword"] = 40] = "TwoHandedSword";
    WeaponType[WeaponType["TwoHandedAxe"] = 41] = "TwoHandedAxe";
    WeaponType[WeaponType["TwoHandedMace"] = 42] = "TwoHandedMace";
    WeaponType[WeaponType["Spear"] = 43] = "Spear";
    WeaponType[WeaponType["Polearm"] = 44] = "Polearm";
    WeaponType[WeaponType["Bow"] = 45] = "Bow";
    WeaponType[WeaponType["Crossbow"] = 46] = "Crossbow";
    WeaponType[WeaponType["Claw"] = 47] = "Claw";
    WeaponType[WeaponType["Knuckler"] = 48] = "Knuckler";
    WeaponType[WeaponType["Gun"] = 49] = "Gun";
})(WeaponType || (WeaponType = {}));
export var Attack;
(function (Attack) {
    Attack[Attack["Other"] = 0] = "Other";
    Attack[Attack["BowWhack"] = -1] = "BowWhack";
    Attack[Attack["ClawPunch"] = -2] = "ClawPunch";
    Attack[Attack["Panic"] = 1111003] = "Panic";
    Attack[Attack["Coma"] = 1111005] = "Coma";
    Attack[Attack["DragonRoar"] = 1311006] = "DragonRoar";
    Attack[Attack["PowerKnockBack"] = 3101003] = "PowerKnockBack";
    Attack[Attack["Phoenix"] = 3121006] = "Phoenix";
    Attack[Attack["Frostprey"] = 3221005] = "Frostprey";
    Attack[Attack["LuckySeven"] = 4001344] = "LuckySeven";
    Attack[Attack["TripleThrow"] = 4121007] = "TripleThrow";
    Attack[Attack["Assaulter"] = 4211002] = "Assaulter";
    Attack[Attack["NinjaAmbush"] = 4121004] = "NinjaAmbush";
    Attack[Attack["VenomousStar"] = 4120005] = "VenomousStar";
    Attack[Attack["VenomousStab"] = 4220005] = "VenomousStab";
    Attack[Attack["SomersaultKick"] = 5001002] = "SomersaultKick";
    Attack[Attack["Octopus"] = 5211001] = "Octopus";
    Attack[Attack["Gaviota"] = 5211002] = "Gaviota";
    Attack[Attack["WrathOfTheOctopi"] = 5220002] = "WrathOfTheOctopi";
})(Attack || (Attack = {}));
export var Spell;
(function (Spell) {
    Spell[Spell["Other"] = 0] = "Other";
    Spell[Spell["Explosion"] = 2111002] = "Explosion";
    Spell[Spell["PoisonMist"] = 2111003] = "PoisonMist";
    Spell[Spell["ElementCompositionFP"] = 2111006] = "ElementCompositionFP";
    Spell[Spell["MeteorShower"] = 2121007] = "MeteorShower";
    Spell[Spell["IceStrike"] = 2211002] = "IceStrike";
    Spell[Spell["ThunderSpear"] = 2211003] = "ThunderSpear";
    Spell[Spell["ElementCompositionIL"] = 2211006] = "ElementCompositionIL";
    Spell[Spell["ChainLightning"] = 2221006] = "ChainLightning";
    Spell[Spell["Blizzard"] = 2221007] = "Blizzard";
    Spell[Spell["Heal"] = 2301002] = "Heal";
    Spell[Spell["ShiningRay"] = 2311004] = "ShiningRay";
    Spell[Spell["Genesis"] = 2321008] = "Genesis";
})(Spell || (Spell = {}));
export var Class;
(function (Class) {
    Class[Class["Beginner"] = 0] = "Beginner";
    Class[Class["Warrior"] = 100] = "Warrior";
    Class[Class["Magician"] = 200] = "Magician";
    Class[Class["Archer"] = 300] = "Archer";
    Class[Class["Rogue"] = 400] = "Rogue";
    Class[Class["Pirate"] = 500] = "Pirate";
    Class[Class["Pirate2nd"] = 510] = "Pirate2nd";
})(Class || (Class = {}));
export class InputData {
    constructor(stats, totalWatk, totalMatk, mastery, skillDmgMulti, skillBasicAtk, skillLines, critProb, critDmg, clazz, level, wepType, attack, spell, speed, spellBooster, eleAmp, caActive, caDmg, caLevel, caOrbs, enemyWdef, enemyMdef, eleSus, enemyLevel, enemyCount) {
        this.stats = stats;
        this.totalWatk = totalWatk;
        this.totalMatk = totalMatk;
        this.mastery = mastery;
        this.skillDmgMulti = skillDmgMulti;
        this.skillBasicAtk = skillBasicAtk;
        this.skillLines = skillLines;
        this.critProb = critProb;
        this.critDmg = critDmg;
        this.clazz = clazz;
        this.level = level;
        this.wepType = wepType;
        this.attack = attack;
        this.spell = spell;
        this.speed = speed;
        this.spellBooster = spellBooster;
        this.eleAmp = eleAmp;
        this.caActive = caActive;
        this.caDmg = caDmg;
        this.caLevel = caLevel;
        this.caOrbs = caOrbs;
        this.enemyWdef = enemyWdef;
        this.enemyMdef = enemyMdef;
        this.eleSus = eleSus;
        this.enemyLevel = enemyLevel;
        this.enemyCount = enemyCount;
    }
}
