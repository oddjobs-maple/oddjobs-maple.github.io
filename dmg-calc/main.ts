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
    ATTACK_LINES,
    ATTACK_REQS,
    attackName,
    attackPeriod,
    BAD_WEPS,
    className,
    isHolySpell,
    JOB_LVL_REQS,
    magicAttackPeriod,
    primaryStat,
    secondaryStat,
    SPELL_LINES,
    SPELL_LVL_REQS,
    spellName,
    weaponTypeName,
} from "./data.js";
import { truncClampedExpectation, truncClampedVariance } from "./math.js";
import {
    Attack,
    Class,
    InputData,
    Speed,
    Spell,
    Stats,
    WeaponType,
} from "./types.js";
import { indefinite } from "./util.js";

document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
        main();
    }
});

function main(): void {
    const strInput = document.getElementById("str") as HTMLInputElement;
    const dexInput = document.getElementById("dex") as HTMLInputElement;
    const intInput = document.getElementById("int") as HTMLInputElement;
    const lukInput = document.getElementById("luk") as HTMLInputElement;

    const totalWatkInput = document.getElementById(
        "total-watk",
    ) as HTMLInputElement;
    const totalMatkInput = document.getElementById(
        "total-matk",
    ) as HTMLInputElement;

    const masteryInput = document.getElementById(
        "mastery",
    ) as HTMLInputElement;

    const skillDmgMultiInput = document.getElementById(
        "skill-dmg-multi",
    ) as HTMLInputElement;
    const skillBasicAtkInput = document.getElementById(
        "skill-basic-atk",
    ) as HTMLInputElement;
    const skillLinesInput = document.getElementById(
        "skill-lines",
    ) as HTMLInputElement;

    const critProbInput = document.getElementById(
        "crit-prob",
    ) as HTMLInputElement;
    const critDmgInput = document.getElementById(
        "crit-dmg",
    ) as HTMLInputElement;

    const classInput = document.getElementById("class") as HTMLSelectElement;
    const levelInput = document.getElementById("level") as HTMLInputElement;

    const weaponTypeInput = document.getElementById(
        "weapon-type",
    ) as HTMLSelectElement;
    const attackInput = document.getElementById("attack") as HTMLSelectElement;
    const spellInput = document.getElementById("spell") as HTMLSelectElement;
    const speedInput = document.getElementById("speed") as HTMLSelectElement;
    const spellBoosterInput = document.getElementById(
        "spell-booster",
    ) as HTMLInputElement;

    const eleAmpInput = document.getElementById("ele-amp") as HTMLInputElement;

    const enemyWdefInput = document.getElementById(
        "enemy-wdef",
    ) as HTMLInputElement;
    const enemyMdefInput = document.getElementById(
        "enemy-mdef",
    ) as HTMLInputElement;
    const eleSusInput = document.getElementById(
        "ele-sus",
    ) as HTMLSelectElement;

    const rangeOutput = document.getElementById("range") as HTMLSpanElement;
    const critRangeOutput = document.getElementById(
        "crit-range",
    ) as HTMLSpanElement;
    const expectedPerHitOutput = document.getElementById(
        "expected-per-hit",
    ) as HTMLSpanElement;
    const sdPerHitOutput = document.getElementById(
        "sd-per-hit",
    ) as HTMLSpanElement;
    const cvPerHitOutput = document.getElementById(
        "cv-per-hit",
    ) as HTMLSpanElement;
    const totalRangeOutput = document.getElementById(
        "total-range",
    ) as HTMLSpanElement;
    const expectedPerHitTotalOutput = document.getElementById(
        "expected-per-hit-total",
    ) as HTMLSpanElement;
    const sdPerHitTotalOutput = document.getElementById(
        "sd-per-hit-total",
    ) as HTMLSpanElement;
    const cvPerHitTotalOutput = document.getElementById(
        "cv-per-hit-total",
    ) as HTMLSpanElement;
    const expectedDpsOutput = document.getElementById(
        "expected-dps",
    ) as HTMLSpanElement;
    const sdDpsOutput = document.getElementById("sd-dps") as HTMLSpanElement;
    const cvDpsOutput = document.getElementById("cv-dps") as HTMLSpanElement;

    const rangeMagicOutput = document.getElementById(
        "range-magic",
    ) as HTMLSpanElement;
    const critRangeMagicOutput = document.getElementById(
        "crit-range-magic",
    ) as HTMLSpanElement;
    const expectedPerHitMagicOutput = document.getElementById(
        "expected-per-hit-magic",
    ) as HTMLSpanElement;
    const sdPerHitMagicOutput = document.getElementById(
        "sd-per-hit-magic",
    ) as HTMLSpanElement;
    const cvPerHitMagicOutput = document.getElementById(
        "cv-per-hit-magic",
    ) as HTMLSpanElement;
    const totalRangeMagicOutput = document.getElementById(
        "total-range-magic",
    ) as HTMLSpanElement;
    const expectedPerHitTotalMagicOutput = document.getElementById(
        "expected-per-hit-total-magic",
    ) as HTMLSpanElement;
    const sdPerHitTotalMagicOutput = document.getElementById(
        "sd-per-hit-total-magic",
    ) as HTMLSpanElement;
    const cvPerHitTotalMagicOutput = document.getElementById(
        "cv-per-hit-total-magic",
    ) as HTMLSpanElement;
    const expectedDpsMagicOutput = document.getElementById(
        "expected-dps-magic",
    ) as HTMLSpanElement;
    const sdDpsMagicOutput = document.getElementById(
        "sd-dps-magic",
    ) as HTMLSpanElement;
    const cvDpsMagicOutput = document.getElementById(
        "cv-dps-magic",
    ) as HTMLSpanElement;

    const warningsDiv = document.getElementById(
        "warnings-div",
    ) as HTMLDivElement;

    function readInputData(): InputData {
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

        let mastery = Math.min(
            Math.max(parseInt(masteryInput.value, 10), 10),
            90,
        );
        if (!Number.isFinite(mastery)) {
            mastery = 10;
        }
        mastery -= mastery % 5;
        masteryInput.value = "" + mastery;

        let skillDmgMulti = Math.max(
            parseInt(skillDmgMultiInput.value, 10),
            0,
        );
        if (!Number.isFinite(skillDmgMulti)) {
            skillDmgMulti = 100;
        }
        skillDmgMultiInput.value = "" + skillDmgMulti;
        let skillBasicAtk = Math.max(
            parseInt(skillBasicAtkInput.value, 10),
            0,
        );
        if (!Number.isFinite(skillBasicAtk)) {
            skillBasicAtk = 10;
        }
        skillBasicAtkInput.value = "" + skillBasicAtk;
        let skillLines = Math.max(parseInt(skillLinesInput.value, 10), 1);
        if (!Number.isFinite(skillLines)) {
            skillLines = 1;
        }
        skillLinesInput.value = "" + skillLines;

        let critProb = Math.min(
            Math.max(parseInt(critProbInput.value, 10), 0),
            100,
        );
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
        let spellBooster = Math.min(
            Math.max(parseInt(spellBoosterInput.value, 10), -2),
            0,
        );
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
        if (
            !Number.isFinite(eleSus) ||
            !(eleSus === 0 || eleSus === 0.5 || eleSus === 1 || eleSus === 1.5)
        ) {
            eleSus = 1;
        }
        eleSusInput.value = "" + eleSus;

        return new InputData(
            new Stats(str, dex, int, luk),
            totalWatk,
            totalMatk,
            mastery / 100,
            skillDmgMulti / 100,
            skillBasicAtk,
            skillLines,
            critProb / 100,
            critDmg / 100,
            clazz,
            level,
            wepType,
            attack,
            spell,
            speed,
            spellBooster,
            eleAmp / 100,
            enemyWdef,
            enemyMdef,
            eleSus,
        );
    }

    function recalculate(): void {
        const inputData = readInputData();
        const critQ = 1 - inputData.critProb;

        recalculatePhys(inputData, critQ);

        recalculateMagic(inputData, critQ);

        recalculateWarnings(inputData);
    }

    function recalculatePhys(inputData: InputData, critQ: number): void {
        const [minDmgPhysBad, maxDmgPhysGood] = [
            (() => {
                switch (inputData.attack) {
                    case Attack.LuckySeven:
                    case Attack.TripleThrow:
                        return minDmgLuckySeven(inputData);
                    case Attack.NinjaAmbush:
                        return dmgNinjaAmbush(inputData);
                    case Attack.VenomousStar:
                    case Attack.VenomousStab:
                        return minDmgVenom(inputData);
                    case Attack.SomersaultKick:
                        return minDmgSomersaultKick(inputData);
                    default:
                        return minDmgPhys(inputData, false);
                }
            })(),
            (() => {
                switch (inputData.attack) {
                    case Attack.LuckySeven:
                    case Attack.TripleThrow:
                        return maxDmgLuckySeven(inputData);
                    case Attack.NinjaAmbush:
                        return dmgNinjaAmbush(inputData);
                    case Attack.VenomousStar:
                    case Attack.VenomousStab:
                        return maxDmgVenom(inputData);
                    case Attack.SomersaultKick:
                        return maxDmgSomersaultKick(inputData);
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
                    case Attack.NinjaAmbush:
                    case Attack.VenomousStar:
                    case Attack.VenomousStab:
                    case Attack.SomersaultKick:
                        return minDmgPhysBad;
                    default:
                        return minDmgPhys(inputData, true);
                }
            })(),
            (() => {
                switch (inputData.attack) {
                    case Attack.LuckySeven:
                    case Attack.TripleThrow:
                    case Attack.NinjaAmbush:
                    case Attack.VenomousStar:
                    case Attack.VenomousStab:
                    case Attack.SomersaultKick:
                        return maxDmgPhysGood;
                    default:
                        return maxDmgPhys(inputData, false);
                }
            })(),
        ];

        const [
            minDmgPhysBadAdjusted,
            maxDmgPhysGoodAdjusted,
        ] = adjustRangeForDef(
            [minDmgPhysBad, maxDmgPhysGood],
            inputData.enemyWdef,
        );
        const [
            minDmgPhysGoodAdjusted,
            maxDmgPhysBadAdjusted,
        ] = adjustRangeForDef(
            [minDmgPhysGood, maxDmgPhysBad],
            inputData.enemyWdef,
        );

        const [dmgMultiNoCrit, dmgMultiCrit] = [
            dmgMulti(inputData, false),
            dmgMulti(inputData, true),
        ];
        const [
            minDmgPhysBadNoCrit,
            maxDmgPhysGoodNoCrit,
            minDmgPhysGoodNoCrit,
            maxDmgPhysBadNoCrit,
        ] = [
            minDmgPhysBadAdjusted,
            maxDmgPhysGoodAdjusted,
            minDmgPhysGoodAdjusted,
            maxDmgPhysBadAdjusted,
        ].map(x => x * dmgMultiNoCrit);
        const [
            minDmgPhysBadCrit,
            maxDmgPhysGoodCrit,
            minDmgPhysGoodCrit,
            maxDmgPhysBadCrit,
        ] = [
            minDmgPhysBadAdjusted,
            maxDmgPhysGoodAdjusted,
            minDmgPhysGoodAdjusted,
            maxDmgPhysBadAdjusted,
        ].map(x => x * dmgMultiCrit);

        const range = [minDmgPhysBadNoCrit, maxDmgPhysGoodNoCrit].map(x =>
            Math.max(Math.trunc(x), 1),
        );
        const critRange = [minDmgPhysBadCrit, maxDmgPhysGoodCrit].map(x =>
            Math.max(Math.trunc(x), 1),
        );
        rangeOutput.textContent = `${range[0]} ~ ${range[1]}${
            range[1] === maxDmgPhysGoodNoCrit && range[1] !== 1 ? "*" : ""
        }`;
        critRangeOutput.textContent = `${critRange[0]} ~ ${critRange[1]}${
            critRange[1] === maxDmgPhysGoodCrit && critRange[1] !== 1
                ? "*"
                : ""
        }`;
        const combinedRangeTop =
            inputData.critProb > 0 ? critRange[1] : range[1];
        totalRangeOutput.textContent = `${range[0] * inputData.skillLines} ~ ${
            combinedRangeTop * inputData.skillLines
        }${
            combinedRangeTop ===
                (inputData.critProb > 0
                    ? maxDmgPhysGoodCrit
                    : maxDmgPhysGoodNoCrit) && combinedRangeTop !== 1
                ? "*"
                : ""
        }`;

        const [expectedPerHitBadNoCrit, expectedPerHitBadCrit] = [
            truncClampedExpectation(minDmgPhysBadNoCrit, maxDmgPhysBadNoCrit),
            truncClampedExpectation(minDmgPhysBadCrit, maxDmgPhysBadCrit),
        ];
        const [expectedPerHitGoodNoCrit, expectedPerHitGoodCrit] = [
            truncClampedExpectation(
                minDmgPhysGoodNoCrit,
                maxDmgPhysGoodNoCrit,
            ),
            truncClampedExpectation(minDmgPhysGoodCrit, maxDmgPhysGoodCrit),
        ];
        const expectedPerHitBad =
            critQ * expectedPerHitBadNoCrit +
            inputData.critProb * expectedPerHitBadCrit;
        const expectedPerHitGood =
            critQ * expectedPerHitGoodNoCrit +
            inputData.critProb * expectedPerHitGoodCrit;
        const expectedPerHit = (expectedPerHitBad + expectedPerHitGood) / 2;
        const expectedPerHitTotal = expectedPerHit * inputData.skillLines;

        expectedPerHitOutput.textContent = expectedPerHit.toFixed(3);
        expectedPerHitTotalOutput.textContent = expectedPerHitTotal.toFixed(3);

        // The "mainVariance" in the following variable names is intended to
        // indicate that this is a variance against the expectation across
        // _all_ cases (`expectedPerHit`), not against the expected value of
        // the particular case in question.
        const mainVariancePerHitBadNoCrit = truncClampedVariance(
            minDmgPhysBadNoCrit,
            maxDmgPhysBadNoCrit,
            expectedPerHit,
        );
        const mainVariancePerHitGoodNoCrit = truncClampedVariance(
            minDmgPhysGoodNoCrit,
            maxDmgPhysGoodNoCrit,
            expectedPerHit,
        );
        const mainVariancePerHitBadCrit = truncClampedVariance(
            minDmgPhysBadCrit,
            maxDmgPhysBadCrit,
            expectedPerHit,
        );
        const mainVariancePerHitGoodCrit = truncClampedVariance(
            minDmgPhysGoodCrit,
            maxDmgPhysGoodCrit,
            expectedPerHit,
        );
        const variancePerHit = (() => {
            if (
                mainVariancePerHitBadNoCrit !== undefined &&
                mainVariancePerHitGoodNoCrit !== undefined &&
                mainVariancePerHitBadCrit !== undefined &&
                mainVariancePerHitGoodCrit !== undefined
            ) {
                const mainVariancePerHitBad =
                    critQ * mainVariancePerHitBadNoCrit +
                    inputData.critProb * mainVariancePerHitBadCrit;
                const mainVariancePerHitGood =
                    critQ * mainVariancePerHitGoodNoCrit +
                    inputData.critProb * mainVariancePerHitGoodCrit;

                return (mainVariancePerHitBad + mainVariancePerHitGood) / 2;
            }

            return;
        })();

        let sdPerHitTotal: number | undefined = undefined;
        if (variancePerHit !== undefined) {
            sdPerHitOutput.classList.remove("error");
            cvPerHitOutput.classList.remove("error");
            sdPerHitTotalOutput.classList.remove("error");
            cvPerHitTotalOutput.classList.remove("error");

            const sdPerHit = Math.sqrt(variancePerHit);
            // This is mathematically valid because the damage/outcome of each
            // hit is independent of the damage of any other hit, thus implying
            // uncorrelatedness.  Furthermore, this implies that the variance
            // of the sum of hits is the sum of the variance of said hits (see
            // the Bienaymé formula/identity).
            sdPerHitTotal = Math.sqrt(variancePerHit * inputData.skillLines);

            sdPerHitOutput.textContent = sdPerHit.toFixed(3);
            cvPerHitOutput.textContent = (sdPerHit / expectedPerHit).toFixed(
                5,
            );
            sdPerHitTotalOutput.textContent = sdPerHitTotal.toFixed(3);
            cvPerHitTotalOutput.textContent = (
                sdPerHitTotal / expectedPerHitTotal
            ).toFixed(5);
        } else {
            sdPerHitOutput.classList.add("error");
            cvPerHitOutput.classList.add("error");
            sdPerHitTotalOutput.classList.add("error");
            cvPerHitTotalOutput.classList.add("error");

            sdPerHitOutput.textContent = "[undefined]";
            cvPerHitOutput.textContent = "[undefined]";
            sdPerHitTotalOutput.textContent = "[undefined]";
            cvPerHitTotalOutput.textContent = "[undefined]";
        }

        const period = attackPeriod(
            inputData.wepType,
            inputData.speed,
            inputData.attack,
        );
        if (period !== undefined) {
            expectedDpsOutput.classList.remove("error");

            const attackHz = 1000 / period;
            const expectedDps = attackHz * expectedPerHitTotal;
            expectedDpsOutput.textContent = expectedDps.toFixed(3);

            if (sdPerHitTotal !== undefined) {
                sdDpsOutput.classList.remove("error");
                cvDpsOutput.classList.remove("error");

                // This is mathematically valid because the damage/outcome of
                // each hit is independent of the damage of any other hit, thus
                // implying uncorrelatedness.  Furthermore, this implies that
                // the variance of the sum of hits is the sum of the variance
                // of said hits (see the Bienaymé formula/identity).
                const sdDps =
                    Math.sqrt(attackHz) *
                    sdPerHitTotal; /*
                  = sqrt(attackHz) * sqrt(variancePerHitTotal)
                  = sqrt(attackHz * variancePerHitTotal)
                  = sqrt(varianceDps). */
                sdDpsOutput.textContent = sdDps.toFixed(3);
                cvDpsOutput.textContent = (sdDps / expectedDps).toFixed(5);
            } else {
                sdDpsOutput.classList.add("error");
                cvDpsOutput.classList.add("error");

                sdDpsOutput.textContent = "[undefined]";
                cvDpsOutput.textContent = "[undefined]";
            }
        } else {
            expectedDpsOutput.classList.add("error");
            sdDpsOutput.classList.add("error");
            cvDpsOutput.classList.add("error");

            expectedDpsOutput.textContent = "[unknown attack speed value]";
            sdDpsOutput.textContent = "[undefined]";
            cvDpsOutput.textContent = "[undefined]";
        }
    }

    function recalculateMagic(inputData: InputData, critQ: number): void {
        const [minDmg, maxDmg] = [
            minDmgMagic(inputData) * inputData.eleAmp * inputData.eleSus,
            maxDmgMagic(inputData) * inputData.eleAmp * inputData.eleSus,
        ];

        const [minDmgNoCrit, maxDmgNoCrit] = adjustRangeForDef(
            [minDmg, maxDmg],
            inputData.enemyMdef,
        );
        const [minDmgCrit, maxDmgCrit] = [minDmgNoCrit, maxDmgNoCrit].map(
            x => x * inputData.critDmg,
        );

        const range = [minDmgNoCrit, maxDmgNoCrit].map(x =>
            Math.max(Math.trunc(x), 1),
        );
        const critRange = [minDmgCrit, maxDmgCrit].map(x =>
            Math.max(Math.trunc(x), 1),
        );
        rangeMagicOutput.textContent = `${range[0]} ~ ${range[1]}${
            range[1] === maxDmgNoCrit && range[1] !== 1 ? "*" : ""
        }`;
        critRangeMagicOutput.textContent = `${critRange[0]} ~ ${critRange[1]}${
            critRange[1] === maxDmgCrit && critRange[1] !== 1 ? "*" : ""
        }`;
        const combinedRangeTop =
            inputData.critProb > 0 ? critRange[1] : range[1];
        totalRangeMagicOutput.textContent = `${
            range[0] * inputData.skillLines
        } ~ ${combinedRangeTop * inputData.skillLines}${
            combinedRangeTop ===
                (inputData.critProb > 0 ? maxDmgCrit : maxDmgNoCrit) &&
            combinedRangeTop !== 1
                ? "*"
                : ""
        }`;

        const [expectedPerHitNoCrit, expectedPerHitCrit] = [
            truncClampedExpectation(minDmgNoCrit, maxDmgNoCrit),
            truncClampedExpectation(minDmgCrit, maxDmgCrit),
        ];
        const expectedPerHit =
            critQ * expectedPerHitNoCrit +
            inputData.critProb * expectedPerHitCrit;
        const expectedPerHitTotal = expectedPerHit * inputData.skillLines;

        expectedPerHitMagicOutput.textContent = expectedPerHit.toFixed(3);
        expectedPerHitTotalMagicOutput.textContent = expectedPerHitTotal.toFixed(
            3,
        );

        // The "mainVariance" in the following variable names is intended to
        // indicate that this is a variance against the expectation across
        // _all_ cases (`expectedPerHit`), not against the expected value of
        // the particular case in question.
        const mainVariancePerHitNoCrit = truncClampedVariance(
            minDmgNoCrit,
            maxDmgNoCrit,
            expectedPerHit,
        );
        const mainVariancePerHitCrit = truncClampedVariance(
            minDmgCrit,
            maxDmgCrit,
            expectedPerHit,
        );
        const variancePerHit =
            mainVariancePerHitNoCrit !== undefined &&
            mainVariancePerHitCrit !== undefined
                ? critQ * mainVariancePerHitNoCrit +
                  inputData.critProb * mainVariancePerHitCrit
                : undefined;

        let sdPerHitTotal: number | undefined = undefined;
        if (variancePerHit !== undefined) {
            sdPerHitMagicOutput.classList.remove("error");
            cvPerHitMagicOutput.classList.remove("error");
            sdPerHitTotalMagicOutput.classList.remove("error");
            cvPerHitTotalMagicOutput.classList.remove("error");

            const sdPerHit = Math.sqrt(variancePerHit);
            // This is mathematically valid because the damage/outcome of each
            // hit is independent of the damage of any other hit, thus implying
            // uncorrelatedness.  Furthermore, this implies that the variance
            // of the sum of hits is the sum of the variance of said hits (see
            // the Bienaymé formula/identity).
            sdPerHitTotal = Math.sqrt(variancePerHit * inputData.skillLines);

            sdPerHitMagicOutput.textContent = sdPerHit.toFixed(3);
            cvPerHitMagicOutput.textContent = (
                sdPerHit / expectedPerHit
            ).toFixed(5);
            sdPerHitTotalMagicOutput.textContent = sdPerHitTotal.toFixed(3);
            cvPerHitTotalMagicOutput.textContent = (
                sdPerHitTotal / expectedPerHitTotal
            ).toFixed(5);
        } else {
            sdPerHitMagicOutput.classList.add("error");
            cvPerHitMagicOutput.classList.add("error");
            sdPerHitTotalMagicOutput.classList.add("error");
            cvPerHitTotalMagicOutput.classList.add("error");

            sdPerHitMagicOutput.textContent = "[undefined]";
            cvPerHitMagicOutput.textContent = "[undefined]";
            sdPerHitTotalMagicOutput.textContent = "[undefined]";
            cvPerHitTotalMagicOutput.textContent = "[undefined]";
        }

        const period = magicAttackPeriod(
            inputData.spellBooster,
            inputData.spell,
            inputData.speed,
        );
        if (period !== undefined) {
            expectedDpsMagicOutput.classList.remove("error");

            const attackHz = 1000 / period;
            const expectedDps = attackHz * expectedPerHitTotal;
            expectedDpsMagicOutput.textContent = expectedDps.toFixed(3);

            if (sdPerHitTotal !== undefined) {
                sdDpsMagicOutput.classList.remove("error");
                cvDpsMagicOutput.classList.remove("error");

                // This is mathematically valid because the damage/outcome of
                // each hit is independent of the damage of any other hit, thus
                // implying uncorrelatedness.  Furthermore, this implies that
                // the variance of the sum of hits is the sum of the variance
                // of said hits.
                const sdDps =
                    Math.sqrt(attackHz) *
                    sdPerHitTotal; /*
                  = sqrt(attackHz) * sqrt(variancePerHitTotal)
                  = sqrt(attackHz * variancePerHitTotal)
                  = sqrt(varianceDps). */
                sdDpsMagicOutput.textContent = sdDps.toFixed(3);
                cvDpsMagicOutput.textContent = (sdDps / expectedDps).toFixed(
                    5,
                );
            } else {
                sdDpsMagicOutput.classList.add("error");
                cvDpsMagicOutput.classList.add("error");

                sdDpsMagicOutput.textContent = "[undefined]";
                cvDpsMagicOutput.textContent = "[undefined]";
            }
        } else {
            expectedDpsMagicOutput.classList.add("error");
            sdDpsMagicOutput.classList.add("error");
            cvDpsMagicOutput.classList.add("error");

            expectedDpsMagicOutput.textContent =
                "[unknown attack speed value]";
            sdDpsMagicOutput.textContent = "[undefined]";
            cvDpsMagicOutput.textContent = "[undefined]";
        }
    }

    function recalculateWarnings(inputData: InputData): void {
        const warnings: string[] = [];

        /*======== Accumulate warnings ========*/

        if (
            inputData.totalWatk === 0 &&
            inputData.wepType !== WeaponType.None
        ) {
            warnings.push(
                "Your total WATK is zero, but you have a weapon equipped.",
            );
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
                if (
                    inputData.mastery > 0.1 &&
                    inputData.clazz !== Class.Warrior
                ) {
                    warnings.push(
                        `You have >10% mastery with a ${weaponTypeName(
                            inputData.wepType,
                        )}, but you\u{2019}re not a warrior.`,
                    );
                }

                break;
            }
            case WeaponType.Dagger:
            case WeaponType.Claw: {
                if (
                    inputData.mastery > 0.1 &&
                    inputData.clazz !== Class.Rogue
                ) {
                    warnings.push(
                        `You have >10% mastery with a ${weaponTypeName(
                            inputData.wepType,
                        )}, but you\u{2019}re not a rogue.`,
                    );
                }

                break;
            }
            case WeaponType.Bow:
            case WeaponType.Crossbow: {
                if (
                    inputData.mastery > 0.1 &&
                    inputData.clazz !== Class.Archer
                ) {
                    warnings.push(
                        `You have >10% mastery with a ${weaponTypeName(
                            inputData.wepType,
                        )}, but you\u{2019}re not an archer.`,
                    );
                }

                break;
            }
            case WeaponType.Knuckler:
            case WeaponType.Gun: {
                if (
                    inputData.mastery > 0.1 &&
                    inputData.clazz !== Class.Pirate2nd
                ) {
                    warnings.push(
                        `You have >10% mastery with a ${weaponTypeName(
                            inputData.wepType,
                        )}, but you\u{2019}re not a \u{2265}2\u{207f}\u{1d48} \
                        job pirate.`,
                    );
                }

                break;
            }
            default:
                break;
        }

        if (
            inputData.mastery > 0.6 &&
            inputData.wepType !== WeaponType.Bow &&
            inputData.wepType !== WeaponType.Crossbow &&
            inputData.wepType !== WeaponType.None
        ) {
            warnings.push(
                `You have >60% mastery with a ${weaponTypeName(
                    inputData.wepType,
                )}.`,
            );
        }

        if (
            !(
                inputData.clazz === Class.Rogue &&
                inputData.wepType === WeaponType.Claw
            ) &&
            !(
                inputData.clazz === Class.Archer &&
                (inputData.wepType === WeaponType.Bow ||
                    inputData.wepType === WeaponType.Crossbow)
            ) &&
            !(
                inputData.clazz === Class.Pirate2nd &&
                (inputData.wepType === WeaponType.None ||
                    inputData.wepType === WeaponType.Knuckler)
            )
        ) {
            if (inputData.critProb > 0.15) {
                warnings.push(
                    "You have a >15% probability of critting, but you do not \
                    have a class & weapon combo that has access to crits. You \
                    can only crit due to Sharp Eyes, which normally grants a \
                    15% crit probably at best.",
                );
            }
            if (inputData.critDmg > 1.4) {
                warnings.push(
                    "You have a >140% probability of critical multi, but you \
                    do not have a class & weapon combo that has access to \
                    crits. You can only crit due to Sharp Eyes, which \
                    normally grants a 140% critical multi at best.",
                );
            }
        }

        const badWeps = BAD_WEPS.get(inputData.clazz);
        if (badWeps === undefined) {
            console.error(
                `Logic error: ${inputData.clazz} is not a key in BAD_WEPS`,
            );
        } else if (badWeps.has(inputData.wepType)) {
            switch (inputData.wepType) {
                case WeaponType.None: {
                    warnings.push(
                        `You\u{2019}re not wielding a weapon, but ${className(
                            inputData.clazz,
                        )}s normally cannot attack that way.`,
                    );

                    break;
                }
                case WeaponType.Staff: {
                    warnings.push(
                        `You\u{2019}re wielding a staff, but staves that are \
                        equippable by ${className(
                            inputData.clazz,
                        )}s don\u{2019}t usually exist.`,
                    );

                    break;
                }
                case WeaponType.TwoHandedAxe:
                case WeaponType.Bow:
                case WeaponType.Crossbow:
                case WeaponType.Knuckler:
                case WeaponType.Gun: {
                    const wepName = weaponTypeName(inputData.wepType);
                    warnings.push(
                        `You\u{2019}re wielding a ${wepName}, but \
                        ${wepName}s that are equippable by ${className(
                            inputData.clazz,
                        )}s don\u{2019}t usually exist.`,
                    );

                    break;
                }
                default:
                    break;
            }
        }

        switch (inputData.clazz) {
            case Class.Beginner: {
                if (inputData.skillDmgMulti !== 1) {
                    warnings.push(
                        "Your damage multi \u{2260}100%, but you\u{2019}re a \
                        beginner.",
                    );
                }

                if (inputData.skillLines !== 1) {
                    warnings.push(
                        "You\u{2019}re attacking with a number of lines \
                        \u{2260}1, but you\u{2019}re a beginner.",
                    );
                }

                break;
            }
            case Class.Warrior: {
                if (inputData.stats.str < 35) {
                    warnings.push(
                        "Your total STR <35, but you\u{2019}re a warrior.",
                    );
                }

                if (inputData.skillDmgMulti !== 1) {
                    if (inputData.wepType === WeaponType.Claw) {
                        warnings.push(
                            "Your damage multi \u{2260}100%, but \
                            you\u{2019}re a warrior using a claw.",
                        );
                    }
                }

                break;
            }
            case Class.Magician: {
                if (inputData.stats.int < 20) {
                    warnings.push(
                        "Your total INT <20, but you\u{2019}re a magician.",
                    );
                }

                if (inputData.skillDmgMulti !== 1) {
                    warnings.push(
                        "Your damage multi \u{2260}100%, but you\u{2019}re a \
                        magician.",
                    );
                }

                break;
            }
            case Class.Archer: {
                if (inputData.stats.dex < 25) {
                    warnings.push(
                        "Your total DEX <25, but you\u{2019}re an archer.",
                    );
                }

                if (inputData.skillDmgMulti !== 1) {
                    if (
                        inputData.wepType !== WeaponType.Bow &&
                        inputData.wepType !== WeaponType.Crossbow
                    ) {
                        warnings.push(
                            `Your damage multi \u{2260}100%, but \
                            you\u{2019}re an archer using a ${weaponTypeName(
                                inputData.wepType,
                            )}.`,
                        );
                    }
                }

                break;
            }
            case Class.Rogue: {
                if (inputData.stats.dex < 25) {
                    warnings.push(
                        "Your total DEX <25, but you\u{2019}re a rogue.",
                    );
                }

                break;
            }
            case Class.Pirate:
            case Class.Pirate2nd: {
                if (inputData.stats.dex < 20) {
                    warnings.push(
                        "Your total DEX <20, but you\u{2019}re a pirate.",
                    );
                }

                if (inputData.skillDmgMulti !== 1) {
                    if (inputData.wepType === WeaponType.Claw) {
                        warnings.push(
                            "Your damage multi \u{2260}100%, but \
                            you\u{2019}re a pirate using a claw. \
                            Claws\u{2019} interaction with Somersault Kick is \
                            poorly understood.",
                        );
                    }
                }

                break;
            }
        }

        const attackReqs = ATTACK_REQS.get(inputData.attack);
        if (attackReqs === undefined) {
            console.error(
                `Logic error: ${inputData.attack} is not a key in ATTACK_REQS`,
            );
        } else {
            const [
                attackReqClasses,
                attackReqLvl,
                attackReqWepTypes,
            ] = attackReqs;
            if (!attackReqClasses.has(inputData.clazz)) {
                warnings.push(
                    `You\u{2019}re attacking with ${attackName(
                        inputData.attack,
                    )}, but you\u{2019}re not ${indefinite(
                        Array.from(attackReqClasses).map(className).join("/"),
                    )}.`,
                );
            }
            if (inputData.level < attackReqLvl) {
                warnings.push(
                    `You\u{2019}re attacking with ${attackName(
                        inputData.attack,
                    )}, but your level <${attackReqLvl}.`,
                );
            }
            if (!attackReqWepTypes.has(inputData.wepType)) {
                warnings.push(
                    `You\u{2019}re attacking with ${attackName(
                        inputData.attack,
                    )}, but you don\u{2019}t have ${indefinite(
                        Array.from(attackReqWepTypes)
                            .map(weaponTypeName)
                            .join("/"),
                    )} equipped.`,
                );
            }
        }

        if (
            inputData.spell !== Spell.Other &&
            inputData.clazz !== Class.Magician
        ) {
            warnings.push(
                "You have a specific spell selected, but you\u{2019}re not a \
                magician.",
            );
        }
        const spellLvlReq = SPELL_LVL_REQS.get(inputData.spell);
        if (spellLvlReq === undefined) {
            console.error(
                `Logic error: ${inputData.spell} is not a key in \
                SPELL_LVL_REQS`,
            );
        } else if (inputData.level < spellLvlReq) {
            warnings.push(
                `You\u{2019}re casting ${spellName(
                    inputData.spell,
                )}, but your level <${spellLvlReq}.`,
            );
        }

        if (
            inputData.speed > Speed.Fast4 &&
            inputData.wepType === WeaponType.None
        ) {
            warnings.push(
                "You have no weapon equipped, but your speed >4. Bare fists \
                have speed 4 when unbuffed.",
            );
        }

        if (inputData.spellBooster !== 0) {
            if (isHolySpell(inputData.spell)) {
                warnings.push(
                    "Your spell booster value is nonzero, but you\u{2019}re \
                    casting a cleric/priest/bishop spell.",
                );
            }

            if (
                inputData.wepType !== WeaponType.Wand &&
                inputData.wepType !== WeaponType.Staff
            ) {
                warnings.push(
                    "Your spell booster value is nonzero, but you \
                    don\u{2019}t have a wand/staff equipped (Spell Booster \
                    doesn\u{2019}t work with swords).",
                );
            }

            if (inputData.clazz !== Class.Magician) {
                warnings.push(
                    "Your spell booster value is nonzero, but you\u{2019}re \
                    not a magician.",
                );
            }

            if (inputData.spellBooster < -1 && inputData.level < 75) {
                warnings.push(
                    "Your spell booster value <\u{2212}1, but your level <75.",
                );
            } else if (inputData.level < 71) {
                warnings.push(
                    "Your spell booster value is nonzero, but your level <71.",
                );
            }
        }

        if (inputData.eleAmp !== 1) {
            if (inputData.clazz !== Class.Magician) {
                warnings.push(
                    "Your element amplification >100%, but you\u{2019}re not \
                    a magician.",
                );
            }

            if (inputData.eleAmp > 1.5) {
                warnings.push(
                    "Your element amplification >150%, but Element \
                    Amplification usually goes up to 150% at best.",
                );
            }

            if (isHolySpell(inputData.spell)) {
                warnings.push(
                    "Your element amplification >100%, but you\u{2019}re \
                    casting a cleric/priest/bishop spell.",
                );
            }

            if (inputData.level < 70) {
                warnings.push(
                    "Your element amplification >100%, but your level <70.",
                );
            }
        }

        const jobLvlReq = JOB_LVL_REQS.get(inputData.clazz);
        if (jobLvlReq === undefined) {
            console.error(
                `Logic error: ${inputData.clazz} is not a key in JOB_LVL_REQS`,
            );
        } else if (inputData.level < jobLvlReq) {
            warnings.push(
                `You\u{2019}re ${indefinite(
                    className(inputData.clazz),
                )}, but your level <${jobLvlReq}.`,
            );
        }

        const attackLines = ATTACK_LINES.get(inputData.attack);
        if (attackLines === undefined) {
            console.error(
                `Logic error: ${inputData.attack} is not a key in \
                ATTACK_LINES`,
            );
        } else {
            const [minLines, maxLines] = attackLines;
            if (inputData.skillLines < minLines) {
                warnings.push(
                    `You\u{2019}re attacking with ${attackName(
                        inputData.attack,
                    )}, but its number of lines <${minLines}.`,
                );
            }
            if (inputData.skillLines > maxLines) {
                warnings.push(
                    `You\u{2019}re attacking with ${attackName(
                        inputData.attack,
                    )}, but its number of lines >${maxLines}.`,
                );
            }
        }

        const spellLines = SPELL_LINES.get(inputData.spell);
        if (spellLines === undefined) {
            console.error(
                `Logic error: ${inputData.spell} is not a key in SPELL_LINES`,
            );
        } else {
            const [minLines, maxLines] = spellLines;
            if (inputData.skillLines < minLines) {
                warnings.push(
                    `You\u{2019}re casting ${spellName(
                        inputData.spell,
                    )}, but its number of lines <${minLines}.`,
                );
            }
            if (inputData.skillLines > maxLines) {
                warnings.push(
                    `You\u{2019}re casting ${spellName(
                        inputData.spell,
                    )}, but its number of lines >${maxLines}.`,
                );
            }
        }

        if (inputData.attack === Attack.SomersaultKick) {
            if (
                inputData.wepType !== WeaponType.Knuckler &&
                inputData.wepType !== WeaponType.None
            ) {
                warnings.push(
                    "You\u{2019}re attacking with Somersault Kick, and have a \
                    weapon equipped that isn\u{2019}t a knuckler; the attack \
                    period is given on a best-effort basis that may or may \
                    not be accurate.",
                );
            }

            switch (inputData.wepType) {
                case WeaponType.Bow:
                case WeaponType.Crossbow:
                case WeaponType.Claw:
                case WeaponType.Gun:
                    warnings.push(
                        `You\u{2019}re using Somersault Kick with ${indefinite(
                            weaponTypeName(inputData.wepType),
                        )} equipped; the damage calculation is done on a \
                        best-effort basis that may or may not be accurate.`,
                    );

                    break;
                default:
                    break;
            }
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
        } else {
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
        skillLinesInput,
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

function dmgMulti(inputData: InputData, crit: boolean): number {
    return inputData.skillDmgMulti + (crit ? inputData.critDmg : 0);
}

function maxDmgMagic(inputData: InputData): number {
    return (
        ((inputData.totalMatk ** 2 / 1000 + inputData.totalMatk) / 30 +
            inputData.stats.int / 200) *
        inputData.skillBasicAtk
    );
}

function minDmgMagic(inputData: InputData): number {
    return (
        ((inputData.totalMatk ** 2 / 1000 +
            inputData.totalMatk * inputData.mastery * 0.9) /
            30 +
            inputData.stats.int / 200) *
        inputData.skillBasicAtk
    );
}

function maxDmgPhys(inputData: InputData, goodAnim: boolean): number {
    return (
        ((primaryStat(
            inputData.stats,
            inputData.wepType,
            goodAnim,
            inputData.clazz,
        ) +
            secondaryStat(
                inputData.stats,
                inputData.wepType,
                inputData.clazz,
            )) *
            effectiveWatk(inputData)) /
        100
    );
}

function minDmgPhys(inputData: InputData, goodAnim: boolean): number {
    return (
        ((primaryStat(
            inputData.stats,
            inputData.wepType,
            goodAnim,
            inputData.clazz,
        ) *
            0.9 *
            effectiveMastery(inputData) +
            secondaryStat(
                inputData.stats,
                inputData.wepType,
                inputData.clazz,
            )) *
            effectiveWatk(inputData)) /
        100
    );
}

function maxDmgLuckySeven(inputData: InputData): number {
    return (inputData.stats.luk * 5 * inputData.totalWatk) / 100;
}

function minDmgLuckySeven(inputData: InputData): number {
    return (inputData.stats.luk * 2.5 * inputData.totalWatk) / 100;
}

function dmgNinjaAmbush(inputData: InputData): number {
    return (
        2 *
        (inputData.stats.str + inputData.stats.luk) *
        inputData.skillDmgMulti
    );
}

function maxDmgVenom(inputData: InputData): number {
    return (
        ((18.5 * (inputData.stats.str + inputData.stats.luk) +
            inputData.stats.dex * 2) /
            100) *
        inputData.skillBasicAtk
    );
}

function minDmgVenom(inputData: InputData): number {
    return (
        ((8 * (inputData.stats.str + inputData.stats.luk) +
            inputData.stats.dex * 2) /
            100) *
        inputData.skillBasicAtk
    );
}

/**
 * Somersault Kick always "stabs".
 */
function maxDmgSomersaultKick(inputData: InputData): number {
    switch (inputData.wepType) {
        case WeaponType.OneHandedAxe:
        case WeaponType.OneHandedMace:
        case WeaponType.Wand:
        case WeaponType.Staff:
        case WeaponType.TwoHandedAxe:
        case WeaponType.TwoHandedMace:
        case WeaponType.Polearm:
            return maxDmgPhys(inputData, false);
        default:
            return maxDmgPhys(inputData, true);
    }
}

/**
 * Somersault Kick always "stabs".
 */
function minDmgSomersaultKick(inputData: InputData): number {
    switch (inputData.wepType) {
        case WeaponType.OneHandedAxe:
        case WeaponType.OneHandedMace:
        case WeaponType.Wand:
        case WeaponType.Staff:
        case WeaponType.TwoHandedAxe:
        case WeaponType.TwoHandedMace:
        case WeaponType.Polearm:
            return minDmgPhys(inputData, false);
        default:
            return minDmgPhys(inputData, true);
    }
}

function adjustRangeForDef(
    range: [number, number],
    def: number,
): [number, number] {
    const [min, max] = range;

    return [min - def * 0.6, max - def * 0.5];
}

function effectiveMastery(inputData: InputData): number {
    if (inputData.wepType === WeaponType.None) {
        return 0.1;
    }

    return inputData.mastery;
}

function effectiveWatk(inputData: InputData): number {
    if (inputData.wepType === WeaponType.None) {
        switch (inputData.clazz) {
            case Class.Pirate:
            case Class.Pirate2nd:
                return Math.min(
                    Math.trunc((2 * inputData.level + 31) / 3),
                    31,
                );
            default:
                return 0;
        }
    }

    return inputData.totalWatk;
}
