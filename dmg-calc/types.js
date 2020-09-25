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
export class InputData {
    constructor(stats, totalWatk, mastery, clazz, wepType, speed, enemyWdef) {
        this.stats = stats;
        this.totalWatk = totalWatk;
        this.mastery = mastery;
        this.clazz = clazz;
        this.wepType = wepType;
        this.speed = speed;
        this.enemyWdef = enemyWdef;
    }
}
