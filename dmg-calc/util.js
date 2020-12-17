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
/**
 * This is how English works, right?  Probably?
 */
export function indefinite(s) {
    switch (s.toLowerCase().codePointAt(0)) {
        case "a".codePointAt(0):
        case "e".codePointAt(0):
        case "i".codePointAt(0):
        case "o".codePointAt(0):
        case "u".codePointAt(0):
            return `an ${s}`;
        default:
            return `a ${s}`;
    }
}
