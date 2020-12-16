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
import { Attack, Class, InputData, Spell, Stats, WeaponType, } from "./types.js";
import { ATTACK_REQS, attackName, attackPeriod, BAD_WEPS, className, isHolySpell, JOB_LVL_REQS, magicAttackPeriod, primaryStat, secondaryStat, SPELL_LVL_REQS, spellName, weaponTypeName, } from "./data.js";
document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
        main();
    }
});
function main() {
    const strInput = document.getElementById("str");
    const dexInput = document.getElementById("dex");
    const intInput = document.getElementById("int");
    const lukInput = document.getElementById("luk");
    const totalWatkInput = document.getElementById("total-watk");
    const totalMatkInput = document.getElementById("total-matk");
    const masteryInput = document.getElementById("mastery");
    const skillDmgMultiInput = document.getElementById("skill-dmg-multi");
    const skillBasicAtkInput = document.getElementById("skill-basic-atk");
    const critProbInput = document.getElementById("crit-prob");
    const critDmgInput = document.getElementById("crit-dmg");
    const classInput = document.getElementById("class");
    const levelInput = document.getElementById("level");
    const weaponTypeInput = document.getElementById("weapon-type");
    const attackInput = document.getElementById("attack");
    const spellInput = document.getElementById("spell");
    const speedInput = document.getElementById("speed");
    const spellBoosterInput = document.getElementById("spell-booster");
    const eleAmpInput = document.getElementById("ele-amp");
    const enemyWdefInput = document.getElementById("enemy-wdef");
    const enemyMdefInput = document.getElementById("enemy-mdef");
    const eleSusInput = document.getElementById("ele-sus");
    const rangeOutput = document.getElementById("range");
    const critRangeOutput = document.getElementById("crit-range");
    const expectedPerHitOutput = document.getElementById("expected-per-hit");
    const sdPerHitOutput = document.getElementById("sd-per-hit");
    const cvPerHitOutput = document.getElementById("cv-per-hit");
    const expectedDpsOutput = document.getElementById("expected-dps");
    const sdDpsOutput = document.getElementById("sd-dps");
    const cvDpsOutput = document.getElementById("cv-dps");
    const rangeMagicOutput = document.getElementById("range-magic");
    const critRangeMagicOutput = document.getElementById("crit-range-magic");
    const expectedPerHitMagicOutput = document.getElementById("expected-per-hit-magic");
    const sdPerHitMagicOutput = document.getElementById("sd-per-hit-magic");
    const cvPerHitMagicOutput = document.getElementById("cv-per-hit-magic");
    const expectedDpsMagicOutput = document.getElementById("expected-dps-magic");
    const sdDpsMagicOutput = document.getElementById("sd-dps-magic");
    const cvDpsMagicOutput = document.getElementById("cv-dps-magic");
    const warningsDiv = document.getElementById("warnings-div");
    function readInputData() {
        let str = Math.max(parseInt(strInput.value, 10), 4);
        if (!Number.isFinite(str)) {
            str = 4;
        }
        strInput.value = "" + str;
        let dex = Math.max(parseInt(dexInput.value, 10), 4);
        if (!Number.isFinite(dex)) {
            dex = 4;
        }
        dexInput.value = "" + dex;
        let int = Math.max(parseInt(intInput.value, 10), 4);
        if (!Number.isFinite(int)) {
            int = 4;
        }
        intInput.value = "" + int;
        let luk = Math.max(parseInt(lukInput.value, 10), 4);
        if (!Number.isFinite(luk)) {
            luk = 4;
        }
        lukInput.value = "" + luk;
        let totalWatk = Math.max(parseInt(totalWatkInput.value, 10), 0);
        if (!Number.isFinite(totalWatk)) {
            totalWatk = 0;
        }
        totalWatkInput.value = "" + totalWatk;
        let totalMatk = Math.max(parseInt(totalMatkInput.value, 10), 0);
        if (!Number.isFinite(totalMatk)) {
            totalMatk = 0;
        }
        totalMatkInput.value = "" + totalMatk;
        let mastery = Math.min(Math.max(parseInt(masteryInput.value, 10), 10), 90);
        if (!Number.isFinite(mastery)) {
            mastery = 10;
        }
        mastery -= mastery % 5;
        masteryInput.value = "" + mastery;
        let skillDmgMulti = Math.max(parseInt(skillDmgMultiInput.value, 10), 0);
        if (!Number.isFinite(skillDmgMulti)) {
            skillDmgMulti = 100;
        }
        skillDmgMultiInput.value = "" + skillDmgMulti;
        let skillBasicAtk = Math.max(parseInt(skillBasicAtkInput.value, 10), 0);
        if (!Number.isFinite(skillBasicAtk)) {
            skillBasicAtk = 10;
        }
        skillBasicAtkInput.value = "" + skillBasicAtk;
        let critProb = Math.min(Math.max(parseInt(critProbInput.value, 10), 0), 100);
        if (!Number.isFinite(critProb)) {
            critProb = 0;
        }
        critProbInput.value = "" + critProb;
        let critDmg = Math.max(parseInt(critDmgInput.value, 10), 0);
        if (!Number.isFinite(critDmg)) {
            critDmg = 100;
        }
        critDmgInput.value = "" + critDmg;
        let clazz = parseInt(classInput.value, 10);
        if (!Number.isFinite(clazz) || !(clazz in Class)) {
            clazz = 0;
        }
        classInput.value = "" + clazz;
        let level = Math.min(Math.max(parseInt(levelInput.value, 10), 1), 200);
        if (!Number.isFinite(level)) {
            level = 30;
        }
        levelInput.value = "" + level;
        let wepType = parseInt(weaponTypeInput.value, 10);
        if (!Number.isFinite(wepType) || !(wepType in WeaponType)) {
            wepType = 30;
        }
        weaponTypeInput.value = "" + wepType;
        let attack = parseInt(attackInput.value, 10);
        if (!Number.isFinite(attack) || !(attack in Attack)) {
            attack = 0;
        }
        attackInput.value = "" + attack;
        let spell = parseInt(spellInput.value, 10);
        if (!Number.isFinite(spell) || !(spell in Spell)) {
            spell = 0;
        }
        spellInput.value = "" + spell;
        let speed = Math.min(Math.max(parseInt(speedInput.value, 10), 2), 9);
        if (!Number.isFinite(speed)) {
            speed = 6;
        }
        speedInput.value = "" + speed;
        let spellBooster = Math.min(Math.max(parseInt(spellBoosterInput.value, 10), -2), 0);
        if (!Number.isFinite(spellBooster)) {
            spellBooster = 0;
        }
        spellBoosterInput.value = "" + spellBooster;
        let eleAmp = Math.max(parseInt(eleAmpInput.value, 10), 100);
        if (!Number.isFinite(eleAmp)) {
            eleAmp = 100;
        }
        eleAmpInput.value = "" + eleAmp;
        let enemyWdef = parseInt(enemyWdefInput.value, 10);
        if (!Number.isFinite(enemyWdef)) {
            enemyWdef = 0;
        }
        enemyWdefInput.value = "" + enemyWdef;
        let enemyMdef = parseInt(enemyMdefInput.value, 10);
        if (!Number.isFinite(enemyMdef)) {
            enemyMdef = 0;
        }
        enemyMdefInput.value = "" + enemyMdef;
        let eleSus = Math.min(Math.max(parseFloat(eleSusInput.value), 0), 1.5);
        if (!Number.isFinite(eleSus) ||
            !(eleSus === 0 || eleSus === 0.5 || eleSus === 1 || eleSus === 1.5)) {
            eleSus = 1;
        }
        eleSusInput.value = "" + eleSus;
        return new InputData(new Stats(str, dex, int, luk), totalWatk, totalMatk, mastery / 100, skillDmgMulti / 100, skillBasicAtk, critProb / 100, critDmg / 100, clazz, level, wepType, attack, spell, speed, spellBooster, eleAmp / 100, enemyWdef, enemyMdef, eleSus);
    }
    function recalculate() {
        const inputData = readInputData();
        const critQ = 1 - inputData.critProb;
        recalculatePhys(inputData, critQ);
        recalculateMagic(inputData, critQ);
        recalculateWarnings(inputData);
    }
    function recalculatePhys(inputData, critQ) {
        const [minDmgPhysBad, maxDmgPhysGood] = [
            (() => {
                switch (inputData.attack) {
                    case Attack.LuckySeven:
                    case Attack.TripleThrow:
                        return minDmgLuckySeven(inputData);
                    default:
                        return minDmgPhys(inputData, false);
                }
            })(),
            (() => {
                switch (inputData.attack) {
                    case Attack.LuckySeven:
                    case Attack.TripleThrow:
                        return maxDmgLuckySeven(inputData);
                    default:
                        return maxDmgPhys(inputData, true);
                }
            })(),
        ];
        const [minDmgPhysGood, maxDmgPhysBad] = [
            (() => {
                switch (inputData.attack) {
                    case Attack.LuckySeven:
                    case Attack.TripleThrow:
                        return minDmgPhysBad;
                    default:
                        return minDmgPhys(inputData, true);
                }
            })(),
            (() => {
                switch (inputData.attack) {
                    case Attack.LuckySeven:
                    case Attack.TripleThrow:
                        return maxDmgPhysGood;
                    default:
                        return maxDmgPhys(inputData, false);
                }
            })(),
        ];
        const [minDmgPhysBadAdjusted, maxDmgPhysGoodAdjusted,] = adjustRangeForDef([minDmgPhysBad, maxDmgPhysGood], inputData.enemyWdef);
        const [minDmgPhysGoodAdjusted, maxDmgPhysBadAdjusted,] = adjustRangeForDef([minDmgPhysGood, maxDmgPhysBad], inputData.enemyWdef);
        const [dmgMultiNoCrit, dmgMultiCrit] = [
            dmgMulti(inputData, false),
            dmgMulti(inputData, true),
        ];
        const [minDmgPhysBadNoCrit, maxDmgPhysGoodNoCrit, minDmgPhysGoodNoCrit, maxDmgPhysBadNoCrit,] = [
            minDmgPhysBadAdjusted,
            maxDmgPhysGoodAdjusted,
            minDmgPhysGoodAdjusted,
            maxDmgPhysBadAdjusted,
        ].map(x => x * dmgMultiNoCrit);
        const [minDmgPhysBadCrit, maxDmgPhysGoodCrit, minDmgPhysGoodCrit, maxDmgPhysBadCrit,] = [
            minDmgPhysBadAdjusted,
            maxDmgPhysGoodAdjusted,
            minDmgPhysGoodAdjusted,
            maxDmgPhysBadAdjusted,
        ].map(x => x * dmgMultiCrit);
        const range = [minDmgPhysBadNoCrit, maxDmgPhysGoodNoCrit].map(x => Math.max(Math.trunc(x), 1));
        const critRange = [minDmgPhysBadCrit, maxDmgPhysGoodCrit].map(x => Math.max(Math.trunc(x), 1));
        rangeOutput.textContent = `${range[0]} ~ ${range[1]}`;
        critRangeOutput.textContent = `${critRange[0]} ~ ${critRange[1]}`;
        const [expectedPerHitBadNoCrit, expectedPerHitBadCrit] = [
            clampedExpectation(minDmgPhysBadNoCrit, maxDmgPhysBadNoCrit),
            clampedExpectation(minDmgPhysBadCrit, maxDmgPhysBadCrit),
        ];
        const [expectedPerHitGoodNoCrit, expectedPerHitGoodCrit] = [
            clampedExpectation(minDmgPhysGoodNoCrit, maxDmgPhysGoodNoCrit),
            clampedExpectation(minDmgPhysGoodCrit, maxDmgPhysGoodCrit),
        ];
        const expectedPerHitBad = critQ * expectedPerHitBadNoCrit +
            inputData.critProb * expectedPerHitBadCrit;
        const expectedPerHitGood = critQ * expectedPerHitGoodNoCrit +
            inputData.critProb * expectedPerHitGoodCrit;
        const expectedPerHit = (expectedPerHitBad + expectedPerHitGood) / 2;
        expectedPerHitOutput.textContent = expectedPerHit.toFixed(3);
        // The "mainVariance" in the following variable names is intended to
        // indicate that this is a variance against the expectation across
        // _all_ cases (`expectedPerHit`), not against the expected value of
        // the particular case in question.
        const mainVariancePerHitBadNoCrit = clampedVariance(minDmgPhysBadNoCrit, maxDmgPhysBadNoCrit, expectedPerHit);
        const mainVariancePerHitGoodNoCrit = clampedVariance(minDmgPhysGoodNoCrit, maxDmgPhysGoodNoCrit, expectedPerHit);
        const mainVariancePerHitBadCrit = clampedVariance(minDmgPhysBadCrit, maxDmgPhysBadCrit, expectedPerHit);
        const mainVariancePerHitGoodCrit = clampedVariance(minDmgPhysGoodCrit, maxDmgPhysGoodCrit, expectedPerHit);
        const variancePerHit = (() => {
            if (mainVariancePerHitBadNoCrit !== undefined &&
                mainVariancePerHitGoodNoCrit !== undefined &&
                mainVariancePerHitBadCrit !== undefined &&
                mainVariancePerHitGoodCrit !== undefined) {
                const mainVariancePerHitBad = critQ * mainVariancePerHitBadNoCrit +
                    inputData.critProb * mainVariancePerHitBadCrit;
                const mainVariancePerHitGood = critQ * mainVariancePerHitGoodNoCrit +
                    inputData.critProb * mainVariancePerHitGoodCrit;
                return (mainVariancePerHitBad + mainVariancePerHitGood) / 2;
            }
            return;
        })();
        let sdPerHit = undefined;
        if (variancePerHit !== undefined) {
            sdPerHitOutput.classList.remove("error");
            sdPerHit = Math.sqrt(variancePerHit);
            sdPerHitOutput.textContent = sdPerHit.toFixed(3);
            cvPerHitOutput.textContent = (sdPerHit / expectedPerHit).toFixed(5);
        }
        else {
            sdPerHitOutput.classList.add("error");
            sdPerHitOutput.textContent = "[undefined]";
        }
        const period = attackPeriod(inputData.wepType, inputData.speed);
        if (period !== undefined) {
            expectedDpsOutput.classList.remove("error");
            const attackHz = 1000 / period;
            const expectedDps = attackHz * expectedPerHit;
            expectedDpsOutput.textContent = expectedDps.toFixed(3);
            if (sdPerHit !== undefined) {
                sdDpsOutput.classList.remove("error");
                // This is mathematically valid because the damage/outcome of
                // each hit is independent of the damage of any other hit, thus
                // implying uncorrelatedness.  Furthermore, this implies that
                // the variance of the sum of hits is the sum of the variance
                // of said hits.
                const sdDps = Math.sqrt(attackHz) *
                    sdPerHit; /* = sqrt(attackHz) * sqrt(variancePerHit)
                             = sqrt(attackHz * variancePerHit)
                             = sqrt(varianceDps). */
                sdDpsOutput.textContent = sdDps.toFixed(3);
                cvDpsOutput.textContent = (sdDps / expectedDps).toFixed(5);
            }
            else {
                sdDpsOutput.classList.add("error");
                sdDpsOutput.textContent = "[undefined]";
            }
        }
        else {
            expectedDpsOutput.classList.add("error");
            expectedDpsOutput.textContent = "[unknown attack speed value]";
            sdDpsOutput.classList.add("error");
            sdDpsOutput.textContent = "[undefined]";
        }
    }
    function recalculateMagic(inputData, critQ) {
        const [minDmg, maxDmg] = [
            minDmgMagic(inputData) * inputData.eleAmp * inputData.eleSus,
            maxDmgMagic(inputData) * inputData.eleAmp * inputData.eleSus,
        ];
        const [minDmgNoCrit, maxDmgNoCrit] = adjustRangeForDef([minDmg, maxDmg], inputData.enemyMdef);
        const [minDmgCrit, maxDmgCrit] = [minDmgNoCrit, maxDmgNoCrit].map(x => x * inputData.critDmg);
        const range = [minDmgNoCrit, maxDmgNoCrit].map(x => Math.max(Math.trunc(x), 1));
        const critRange = [minDmgCrit, maxDmgCrit].map(x => Math.max(Math.trunc(x), 1));
        rangeMagicOutput.textContent = `${range[0]} ~ ${range[1]}`;
        critRangeMagicOutput.textContent = `${critRange[0]} ~ ${critRange[1]}`;
        const [expectedPerHitNoCrit, expectedPerHitCrit] = [
            clampedExpectation(minDmgNoCrit, maxDmgNoCrit),
            clampedExpectation(minDmgCrit, maxDmgCrit),
        ];
        const expectedPerHit = critQ * expectedPerHitNoCrit +
            inputData.critProb * expectedPerHitCrit;
        expectedPerHitMagicOutput.textContent = expectedPerHit.toFixed(3);
        // The "mainVariance" in the following variable names is intended to
        // indicate that this is a variance against the expectation across
        // _all_ cases (`expectedPerHit`), not against the expected value of
        // the particular case in question.
        const mainVariancePerHitNoCrit = clampedVariance(minDmgNoCrit, maxDmgNoCrit, expectedPerHit);
        const mainVariancePerHitCrit = clampedVariance(minDmgCrit, maxDmgCrit, expectedPerHit);
        const variancePerHit = mainVariancePerHitNoCrit !== undefined &&
            mainVariancePerHitCrit !== undefined
            ? critQ * mainVariancePerHitNoCrit +
                inputData.critProb * mainVariancePerHitCrit
            : undefined;
        let sdPerHit = undefined;
        if (variancePerHit !== undefined) {
            sdPerHitMagicOutput.classList.remove("error");
            sdPerHit = Math.sqrt(variancePerHit);
            sdPerHitMagicOutput.textContent = sdPerHit.toFixed(3);
            cvPerHitMagicOutput.textContent = (sdPerHit / expectedPerHit).toFixed(5);
        }
        else {
            sdPerHitMagicOutput.classList.add("error");
            sdPerHitMagicOutput.textContent = "[undefined]";
        }
        const period = magicAttackPeriod(inputData.spellBooster, inputData.spell, inputData.speed);
        if (period !== undefined) {
            expectedDpsMagicOutput.classList.remove("error");
            const attackHz = 1000 / period;
            const expectedDps = attackHz * expectedPerHit;
            expectedDpsMagicOutput.textContent = expectedDps.toFixed(3);
            if (sdPerHit !== undefined) {
                sdDpsMagicOutput.classList.remove("error");
                // This is mathematically valid because the damage/outcome of
                // each hit is independent of the damage of any other hit, thus
                // implying uncorrelatedness.  Furthermore, this implies that
                // the variance of the sum of hits is the sum of the variance
                // of said hits.
                const sdDps = Math.sqrt(attackHz) *
                    sdPerHit; /* = sqrt(attackHz) * sqrt(variancePerHit)
                             = sqrt(attackHz * variancePerHit)
                             = sqrt(varianceDps). */
                sdDpsMagicOutput.textContent = sdDps.toFixed(3);
                cvDpsMagicOutput.textContent = (sdDps / expectedDps).toFixed(5);
            }
            else {
                sdDpsMagicOutput.classList.add("error");
                sdDpsMagicOutput.textContent = "[undefined]";
            }
        }
        else {
            expectedDpsMagicOutput.classList.add("error");
            expectedDpsMagicOutput.textContent =
                "[unknown attack speed value]";
            sdDpsMagicOutput.classList.add("error");
            sdDpsMagicOutput.textContent = "[undefined]";
        }
    }
    function recalculateWarnings(inputData) {
        const warnings = [];
        /*======== Accumulate warnings ========*/
        if (inputData.totalWatk === 0 &&
            inputData.wepType !== WeaponType.None) {
            warnings.push("Your total WATK is zero, but you have a weapon equipped.");
        }
        if (inputData.totalMatk < inputData.stats.int) {
            warnings.push("Your total MATK is less than your total INT.");
        }
        switch (inputData.wepType) {
            case WeaponType.OneHandedSword:
            case WeaponType.OneHandedAxe:
            case WeaponType.OneHandedMace:
            case WeaponType.TwoHandedSword:
            case WeaponType.TwoHandedAxe:
            case WeaponType.TwoHandedMace:
            case WeaponType.Spear:
            case WeaponType.Polearm: {
                if (inputData.mastery > 0.1 &&
                    inputData.clazz !== Class.Warrior) {
                    warnings.push(`You have >10% mastery with a ${weaponTypeName(inputData.wepType)}, but you\u{2019}re not a warrior.`);
                }
                break;
            }
            case WeaponType.Dagger:
            case WeaponType.Claw: {
                if (inputData.mastery > 0.1 &&
                    inputData.clazz !== Class.Rogue) {
                    warnings.push(`You have >10% mastery with a ${weaponTypeName(inputData.wepType)}, but you\u{2019}re not a rogue.`);
                }
                break;
            }
            case WeaponType.Bow:
            case WeaponType.Crossbow: {
                if (inputData.mastery > 0.1 &&
                    inputData.clazz !== Class.Archer) {
                    warnings.push(`You have >10% mastery with a ${weaponTypeName(inputData.wepType)}, but you\u{2019}re not an archer.`);
                }
                break;
            }
            case WeaponType.Knuckler:
            case WeaponType.Gun: {
                if (inputData.mastery > 0.1 &&
                    inputData.clazz !== Class.Pirate2nd) {
                    warnings.push(`You have >10% mastery with a ${weaponTypeName(inputData.wepType)}, but you\u{2019}re not a \u{2265}2\u{207f}\u{1d48} \
                        job pirate.`);
                }
                break;
            }
            default:
                break;
        }
        if (inputData.mastery > 0.6 &&
            inputData.wepType !== WeaponType.Bow &&
            inputData.wepType !== WeaponType.Crossbow &&
            inputData.wepType !== WeaponType.None) {
            warnings.push(`You have >60% mastery with a ${weaponTypeName(inputData.wepType)}.`);
        }
        if (!(inputData.clazz === Class.Rogue &&
            inputData.wepType === WeaponType.Claw) &&
            !(inputData.clazz === Class.Archer &&
                (inputData.wepType === WeaponType.Bow ||
                    inputData.wepType === WeaponType.Crossbow)) &&
            !(inputData.clazz === Class.Pirate2nd &&
                (inputData.wepType === WeaponType.None ||
                    inputData.wepType === WeaponType.Knuckler))) {
            if (inputData.critProb > 0.15) {
                warnings.push("You have a >15% probability of critting, but you do not \
                    have a class & weapon combo that has access to crits. You \
                    can only crit due to Sharp Eyes, which normally grants a \
                    15% crit probably at best.");
            }
            if (inputData.critDmg > 1.4) {
                warnings.push("You have a >140% probability of critical multi, but you \
                    do not have a class & weapon combo that has access to \
                    crits. You can only crit due to Sharp Eyes, which \
                    normally grants a 140% critical multi at best.");
            }
        }
        const badWeps = BAD_WEPS.get(inputData.clazz);
        if (badWeps === undefined) {
            throw `Logic error: ${inputData.clazz} is not a key in BAD_WEPS`;
        }
        if (badWeps.has(inputData.wepType)) {
            switch (inputData.wepType) {
                case WeaponType.None: {
                    warnings.push(`You\u{2019}re not wielding a weapon, but ${className(inputData.clazz)}s normally cannot attack that way.`);
                    break;
                }
                case WeaponType.Staff: {
                    warnings.push(`You\u{2019}re wielding a staff, but staves that are \
                        equippable by ${className(inputData.clazz)}s don\u{2019}t usually exist.`);
                    break;
                }
                case WeaponType.TwoHandedAxe:
                case WeaponType.Bow:
                case WeaponType.Crossbow:
                case WeaponType.Knuckler:
                case WeaponType.Gun: {
                    const wepName = weaponTypeName(inputData.wepType);
                    warnings.push(`You\u{2019}re wielding a ${wepName}, but \
                        ${wepName}s that are equippable by ${className(inputData.clazz)}s don\u{2019}t usually exist.`);
                    break;
                }
                default:
                    break;
            }
        }
        switch (inputData.clazz) {
            case Class.Beginner: {
                if (inputData.skillDmgMulti !== 1) {
                    warnings.push("Your damage multi \u{2260}100%, but you\u{2019}re a \
                        beginner.");
                }
                break;
            }
            case Class.Warrior: {
                if (inputData.stats.str < 35) {
                    warnings.push("Your total STR <35, but you\u{2019}re a warrior.");
                }
                if (inputData.skillDmgMulti !== 1) {
                    if (inputData.wepType === WeaponType.Claw) {
                        warnings.push("Your damage multi \u{2260}100%, but \
                            you\u{2019}re a warrior using a claw.");
                    }
                }
                break;
            }
            case Class.Magician: {
                if (inputData.stats.int < 20) {
                    warnings.push("Your total INT <20, but you\u{2019}re a magician.");
                }
                if (inputData.skillDmgMulti !== 1) {
                    warnings.push("Your damage multi \u{2260}100%, but you\u{2019}re a \
                        magician.");
                }
                break;
            }
            case Class.Archer: {
                if (inputData.stats.dex < 25) {
                    warnings.push("Your total DEX <25, but you\u{2019}re an archer.");
                }
                if (inputData.skillDmgMulti !== 1) {
                    if (inputData.wepType !== WeaponType.Bow &&
                        inputData.wepType !== WeaponType.Crossbow) {
                        warnings.push(`Your damage multi \u{2260}100%, but \
                            you\u{2019}re an archer using a ${weaponTypeName(inputData.wepType)}.`);
                    }
                }
                break;
            }
            case Class.Rogue: {
                if (inputData.stats.dex < 25) {
                    warnings.push("Your total DEX <25, but you\u{2019}re a rogue.");
                }
                break;
            }
            case Class.Pirate:
            case Class.Pirate2nd: {
                if (inputData.stats.dex < 20) {
                    warnings.push("Your total DEX <20, but you\u{2019}re a pirate.");
                }
                if (inputData.skillDmgMulti !== 1) {
                    if (inputData.wepType === WeaponType.Claw) {
                        warnings.push("Your damage multi \u{2260}100%, but \
                            you\u{2019}re a pirate using a claw. \
                            Claws\u{2019} interaction with Somersault Kick is \
                            poorly understood.");
                    }
                }
                break;
            }
        }
        const attackReqs = ATTACK_REQS.get(inputData.attack);
        if (attackReqs === undefined) {
            throw `Logic error: ${inputData.attack} is not a key in \
                  ATTACK_REQS`;
        }
        const [attackReqClasses, attackReqLvl, attackReqWepTypes] = attackReqs;
        if (!attackReqClasses.has(inputData.clazz)) {
            warnings.push(`You\u{2019}re attacking with ${attackName(inputData.attack)}, but you\u{2019}re not ${indefinite(Array.from(attackReqClasses).map(className).join("/"))}.`);
        }
        if (inputData.level < attackReqLvl) {
            warnings.push(`You\u{2019}re attacking with ${attackName(inputData.attack)}, but your level <${attackReqLvl}.`);
        }
        if (!attackReqWepTypes.has(inputData.wepType)) {
            warnings.push(`You\u{2019}re attacking with ${attackName(inputData.attack)}, but you don\u{2019}t have ${indefinite(Array.from(attackReqWepTypes)
                .map(weaponTypeName)
                .join("/"))} equipped.`);
        }
        if (inputData.spell !== Spell.Other &&
            inputData.clazz !== Class.Magician) {
            warnings.push("You have a specific spell selected, but you\u{2019}re not a \
                magician.");
        }
        const spellLvlReq = SPELL_LVL_REQS.get(inputData.spell);
        if (spellLvlReq === undefined) {
            throw `Logic error: ${inputData.spell} is not a key in \
                  SPELL_LVL_REQS`;
        }
        if (inputData.level < spellLvlReq) {
            warnings.push(`You\u{2019}re casting ${spellName(inputData.spell)}, but your level <${spellLvlReq}.`);
        }
        if (inputData.speed > 4 /* Fast4 */ &&
            inputData.wepType === WeaponType.None) {
            warnings.push("You have no weapon equipped, but your speed >4. Bare fists \
                have speed 4 when unbuffed.");
        }
        if (inputData.spellBooster !== 0) {
            if (isHolySpell(inputData.spell)) {
                warnings.push("Your spell booster value is nonzero, but you\u{2019}re \
                    casting a cleric/priest/bishop spell.");
            }
            if (inputData.wepType !== WeaponType.Wand &&
                inputData.wepType !== WeaponType.Staff) {
                warnings.push("Your spell booster value is nonzero, but you \
                    don\u{2019}t have a wand/staff equipped (Spell Booster \
                    doesn\u{2019}t work with swords).");
            }
            if (inputData.clazz !== Class.Magician) {
                warnings.push("Your spell booster value is nonzero, but you\u{2019}re \
                    not a magician.");
            }
            if (inputData.spellBooster < -1 && inputData.level < 75) {
                warnings.push("Your spell booster value <\u{2212}1, but your level <75.");
            }
            else if (inputData.level < 71) {
                warnings.push("Your spell booster value is nonzero, but your level <71.");
            }
        }
        if (inputData.eleAmp !== 1) {
            if (inputData.clazz !== Class.Magician) {
                warnings.push("Your element amplification >100%, but you\u{2019}re not \
                    a magician.");
            }
            if (inputData.eleAmp > 1.5) {
                warnings.push("Your element amplification >150%, but Element \
                    Amplification usually goes up to 150% at best.");
            }
            if (isHolySpell(inputData.spell)) {
                warnings.push("Your element amplification >100%, but you\u{2019}re \
                    casting a cleric/priest/bishop spell.");
            }
            if (inputData.level < 70) {
                warnings.push("Your element amplification >100%, but your level <70.");
            }
        }
        const jobLvlReq = JOB_LVL_REQS.get(inputData.clazz);
        if (jobLvlReq === undefined) {
            throw `Logic error: ${inputData.clazz} is not a key in \
                  JOB_LVL_REQS`;
        }
        if (inputData.level < jobLvlReq) {
            warnings.push(`You\u{2019}re ${indefinite(className(inputData.clazz))}, but your level <${jobLvlReq}.`);
        }
        /*======== Remove old warnings display ========*/
        {
            const warningsElem = document.getElementById("warnings");
            if (warningsElem) {
                warningsDiv.removeChild(warningsElem);
            }
        }
        /*======== Display warnings ========*/
        if (warnings.length === 0) {
            const warningsSpan = document.createElement("span");
            warningsSpan.id = "warnings";
            warningsSpan.classList.add("success");
            const warningsTextNode = document.createTextNode("No warnings.");
            warningsSpan.appendChild(warningsTextNode);
            warningsDiv.appendChild(warningsSpan);
        }
        else {
            const warningsUl = document.createElement("ul");
            warningsUl.id = "warnings";
            warningsUl.classList.add("warning");
            for (const warningText of warnings) {
                const warningLi = document.createElement("li");
                const warningTextNode = document.createTextNode(warningText);
                warningLi.appendChild(warningTextNode);
                warningsUl.appendChild(warningLi);
            }
            warningsDiv.appendChild(warningsUl);
        }
    }
    for (const input of [
        strInput,
        dexInput,
        intInput,
        lukInput,
        totalWatkInput,
        totalMatkInput,
        masteryInput,
        skillDmgMultiInput,
        skillBasicAtkInput,
        critProbInput,
        critDmgInput,
        classInput,
        levelInput,
        weaponTypeInput,
        attackInput,
        spellInput,
        speedInput,
        spellBoosterInput,
        eleAmpInput,
        enemyWdefInput,
        enemyMdefInput,
        eleSusInput,
    ]) {
        input.addEventListener("change", recalculate);
    }
    recalculate();
}
/**
 * Gets the variance for a uniform distribution over the range `[a, b]` that is
 * **_actually not uniform_**, because the outcomes are clamped to a minimum
 * of 1.  The `mu` parameter is the expectation of the distribution, which can
 * be obtained from the `clampedExpectation` function.
 *
 * This function assumes that `b >= a`, so if `b < a`, you will get
 * `undefined`.
 *
 * In LaTeX:
 *
 * ```latex
 * \sigma^2 = \begin{cases}
 *   0 & \text{when } a = b \lor b \leq 1 \\
 *   \frac{(b - \mu)^3 - (\text{max}\left\{a, 1\right\} - \mu)^3}{3(b - a)} +
 *     (1 - \mu)^2\,\text{max}\!\left\{\frac{1 - a}{b - a}, 0\right\} &
 *     \text{when } b > \text{max}\!\left\{a, 1\right\}
 * \end{cases}
 * ```
 */
function clampedVariance(a, b, mu) {
    if (a === b || b <= 1) {
        return 0;
    }
    if (a > b) {
        return;
    }
    const bMinusA = b - a;
    return (((b - mu) ** 3 - (Math.max(a, 1) - mu) ** 3) / (3 * bMinusA) +
        (1 - mu) ** 2 * Math.max((1 - a) / bMinusA, 0));
}
/**
 * Gets the expected value for a uniform distribution over the range
 * `[min, max]` that is **_actually not uniform_**, because the outcomes are
 * clamped to a minimum of 1.
 */
function clampedExpectation(min, max) {
    if (min >= 1) {
        return (min + max) / 2;
    }
    // The logic below is there because it's possible that the lower end of the
    // damage range (and possibly the higher end as well) is strictly less than
    // 1, in which case we no longer have a uniform distribution!  This means
    // no simple `(minValue + maxValue) / 2` will calculate the expectation for
    // us.  Instead, we have to split the distribution out into two parts: the
    // clamped bit (everything at or below 1), which is always clamped to an
    // outcome of 1, and the uniform bit (everything above 1).  These are then
    // weighted and summed.  Note that it's possible for the uniform bit to
    // have a measure/norm of zero (particularly, in the case that
    // `maxValue <= 1`).
    if (min >= max) {
        return 1;
    }
    const rawRangeNorm = max - min;
    const rawClampedNorm = Math.min(1 - min, rawRangeNorm);
    const uniformExpected = (1 + max) / 2;
    const clampedWeight = Math.min(rawClampedNorm / rawRangeNorm, 1);
    const uniformWeight = 1 - clampedWeight;
    return clampedWeight + uniformWeight * uniformExpected;
}
function dmgMulti(inputData, crit) {
    return inputData.skillDmgMulti + (crit ? inputData.critDmg : 0);
}
function maxDmgMagic(inputData) {
    return (((inputData.totalMatk ** 2 / 1000 + inputData.totalMatk) / 30 +
        inputData.stats.int / 200) *
        inputData.skillBasicAtk);
}
function minDmgMagic(inputData) {
    return (((inputData.totalMatk ** 2 / 1000 +
        inputData.totalMatk * inputData.mastery * 0.9) /
        30 +
        inputData.stats.int / 200) *
        inputData.skillBasicAtk);
}
function maxDmgPhys(inputData, goodAnim) {
    return (((primaryStat(inputData.stats, inputData.wepType, goodAnim, inputData.clazz) +
        secondaryStat(inputData.stats, inputData.wepType, inputData.clazz)) *
        effectiveWatk(inputData)) /
        100);
}
function minDmgPhys(inputData, goodAnim) {
    return (((primaryStat(inputData.stats, inputData.wepType, goodAnim, inputData.clazz) *
        0.9 *
        effectiveMastery(inputData) +
        secondaryStat(inputData.stats, inputData.wepType, inputData.clazz)) *
        effectiveWatk(inputData)) /
        100);
}
function maxDmgLuckySeven(inputData) {
    return (inputData.stats.luk * 5 * inputData.totalWatk) / 100;
}
function minDmgLuckySeven(inputData) {
    return (inputData.stats.luk * 2.5 * inputData.totalWatk) / 100;
}
function adjustRangeForDef(range, def) {
    const [min, max] = range;
    return [min - def * 0.6, max - def * 0.5];
}
function effectiveMastery(inputData) {
    if (inputData.wepType === WeaponType.None) {
        return 0.1;
    }
    return inputData.mastery;
}
function effectiveWatk(inputData) {
    if (inputData.wepType === WeaponType.None) {
        switch (inputData.clazz) {
            case Class.Pirate:
            case Class.Pirate2nd:
                return Math.min(Math.trunc((2 * inputData.level + 31) / 3), 31);
            default:
                return 0;
        }
    }
    return inputData.totalWatk;
}
/**
 * This is how English works, right? Probably?
 */
function indefinite(s) {
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
