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
export class Monster {
    constructor(level, avoid, wdef, mdef) {
        this.level = level;
        this.avoid = avoid;
        this.wdef = wdef;
        this.mdef = mdef;
    }
}
export class Spell {
    constructor(basicAtk, mastery, period, lines) {
        this.basicAtk = basicAtk;
        this.mastery = mastery;
        this.period = period;
        this.lines = lines;
    }
}
export class Stats {
    constructor(str, dex, int, luk) {
        this.str = str;
        this.dex = dex;
        this.int = int;
        this.luk = luk;
    }
    clone() {
        return new Stats(this.str, this.dex, this.int, this.luk);
    }
    /** Operates **in-place** and then returns `this`. */
    add(other) {
        this.str += other.str;
        this.dex += other.dex;
        this.int += other.int;
        this.luk += other.luk;
        return this;
    }
    /** Operates **in-place** and then returns `this`. */
    sub(other) {
        this.str -= other.str;
        this.dex -= other.dex;
        this.int -= other.int;
        this.luk -= other.luk;
        return this;
    }
}
export class Weapon {
    constructor(psm, period) {
        this.psm = psm;
        this.period = period;
    }
}
export var WeaponType;
(function (WeaponType) {
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
})(WeaponType || (WeaponType = {}));
export var SpellType;
(function (SpellType) {
    SpellType[SpellType["Other"] = 0] = "Other";
    SpellType[SpellType["Explosion"] = 2111002] = "Explosion";
    SpellType[SpellType["PoisonMist"] = 2111003] = "PoisonMist";
    SpellType[SpellType["ElementCompositionFP"] = 2111006] = "ElementCompositionFP";
    SpellType[SpellType["Elquines"] = 2121005] = "Elquines";
    SpellType[SpellType["MeteorShower"] = 2121007] = "MeteorShower";
    SpellType[SpellType["IceStrike"] = 2211002] = "IceStrike";
    SpellType[SpellType["ThunderSpear"] = 2211003] = "ThunderSpear";
    SpellType[SpellType["ElementCompositionIL"] = 2211006] = "ElementCompositionIL";
    SpellType[SpellType["Ifrit"] = 2221005] = "Ifrit";
    SpellType[SpellType["ChainLightning"] = 2221006] = "ChainLightning";
    SpellType[SpellType["Blizzard"] = 2221007] = "Blizzard";
    SpellType[SpellType["Heal"] = 2301002] = "Heal";
    SpellType[SpellType["HolyArrow"] = 2301005] = "HolyArrow";
    SpellType[SpellType["ShiningRay"] = 2311004] = "ShiningRay";
    SpellType[SpellType["SummonDragon"] = 2311006] = "SummonDragon";
    SpellType[SpellType["Bahamut"] = 2321003] = "Bahamut";
    SpellType[SpellType["AngelRay"] = 2321007] = "AngelRay";
    SpellType[SpellType["Genesis"] = 2321008] = "Genesis";
})(SpellType || (SpellType = {}));
