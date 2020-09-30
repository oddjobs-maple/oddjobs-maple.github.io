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

export const enum Class {
    Beginner = 0,
    Warrior = 100,
    Magician = 200,
    Archer = 300,
    Rogue = 400,
    Pirate = 500,
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
        public mastery: number,
        public critProb: number,
        public critDmg: number,
        public clazz: Class,
        public wepType: WeaponType,
        public speed: Speed,
        public enemyWdef: number,
    ) {}
}
