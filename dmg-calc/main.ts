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

import { InputData, Stats, WeaponType } from "./types.js";
import { attackPeriod, primaryStat, secondaryStat } from "./data.js";

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

    const masteryInput = document.getElementById(
        "mastery",
    ) as HTMLInputElement;

    const classInput = document.getElementById("class") as HTMLSelectElement;

    const weaponTypeInput = document.getElementById(
        "weapon-type",
    ) as HTMLSelectElement;
    const speedInput = document.getElementById("speed") as HTMLSelectElement;

    const enemyWdefInput = document.getElementById(
        "enemy-wdef",
    ) as HTMLInputElement;

    const rangeOutput = document.getElementById("range") as HTMLSpanElement;
    const expectedPerHitOutput = document.getElementById(
        "expected-per-hit",
    ) as HTMLSpanElement;
    const sdPerHitOutput = document.getElementById(
        "sd-per-hit",
    ) as HTMLSpanElement;
    const expectedDpsOutput = document.getElementById(
        "expected-dps",
    ) as HTMLSpanElement;
    const sdDpsOutput = document.getElementById("sd-dps") as HTMLSpanElement;

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

        let mastery = Math.min(
            Math.max(parseInt(masteryInput.value, 10), 10),
            90,
        );
        if (!Number.isFinite(mastery)) {
            mastery = 10;
        }
        mastery -= mastery % 5;
        masteryInput.value = "" + mastery;

        let clazz = Math.min(Math.max(parseInt(classInput.value, 10), 0), 500);
        if (!Number.isFinite(clazz) || clazz % 100 !== 0) {
            clazz = 0;
        }
        classInput.value = "" + clazz;

        let wepType = parseInt(weaponTypeInput.value, 10);
        if (!Number.isFinite(wepType) || !(wepType in WeaponType)) {
            wepType = 30;
        }
        weaponTypeInput.value = "" + wepType;
        let speed = Math.min(Math.max(parseInt(speedInput.value, 10), 2), 9);
        if (!Number.isFinite(speed)) {
            speed = 6;
        }
        speedInput.value = "" + speed;

        let enemyWdef = parseInt(enemyWdefInput.value, 10);
        if (!Number.isFinite(enemyWdef)) {
            enemyWdef = 0;
        }
        enemyWdefInput.value = "" + enemyWdef;

        return new InputData(
            new Stats(str, dex, int, luk),
            totalWatk,
            mastery / 100,
            clazz,
            wepType,
            speed,
            enemyWdef,
        );
    }

    function recalculate(): void {
        const inputData = readInputData();

        const [minDmgPhysBad, maxDmgPhysGood] = [
            minDmgPhys(inputData, false),
            maxDmgPhys(inputData, true),
        ];
        const [minDmgPhysGood, maxDmgPhysBad] = [
            minDmgPhys(inputData, true),
            maxDmgPhys(inputData, false),
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

        const range = [minDmgPhysBadAdjusted, maxDmgPhysGoodAdjusted].map(x =>
            Math.max(Math.trunc(x), 1),
        );
        rangeOutput.textContent = `${range[0]} ~ ${range[1]}`;

        const expectedPerHitBad = clampedExpectation(
            minDmgPhysBadAdjusted,
            maxDmgPhysBadAdjusted,
        );
        const expectedPerHitGood = clampedExpectation(
            minDmgPhysGoodAdjusted,
            maxDmgPhysGoodAdjusted,
        );
        const expectedPerHit = (expectedPerHitBad + expectedPerHitGood) / 2;

        expectedPerHitOutput.textContent = expectedPerHit.toFixed(3);

        const mainVariancePerHitBad = clampedVariance(
            minDmgPhysBadAdjusted,
            maxDmgPhysBadAdjusted,
            expectedPerHit,
        );
        const mainVariancePerHitGood = clampedVariance(
            minDmgPhysGoodAdjusted,
            maxDmgPhysGoodAdjusted,
            expectedPerHit,
        );
        let sdPerHit = undefined;
        if (
            mainVariancePerHitBad !== undefined &&
            mainVariancePerHitGood !== undefined
        ) {
            sdPerHitOutput.classList.remove("error");

            sdPerHit = Math.sqrt(
                (mainVariancePerHitBad + mainVariancePerHitGood) / 2,
            );
            sdPerHitOutput.textContent = sdPerHit.toFixed(3);
        } else {
            sdPerHitOutput.classList.add("error");

            sdPerHitOutput.textContent = "[undefined]";
        }

        const period = attackPeriod(inputData.wepType, inputData.speed);
        if (period !== undefined) {
            expectedDpsOutput.classList.remove("error");

            const attackHz = 1000 / period;
            expectedDpsOutput.textContent = (
                attackHz * expectedPerHit
            ).toFixed(3);

            if (sdPerHit !== undefined) {
                sdDpsOutput.classList.remove("error");

                // This is mathematically valid because the damage/outcome of
                // each hit is independent of the damage of any other hit, thus
                // implying uncorrelatedness.  Furthermore, this implies that
                // the variance of the sum of hits is the sum of the variance
                // of said hits.
                sdDpsOutput.textContent = (Math.sqrt(attackHz) * sdPerHit)
                    /* = sqrt(attackHz) * sqrt(variancePerHit)
                       = sqrt(attackHz * variancePerHit). */
                    .toFixed(3);
            } else {
                sdDpsOutput.classList.add("error");

                sdDpsOutput.textContent = "[undefined]";
            }
        } else {
            expectedDpsOutput.classList.add("error");

            expectedDpsOutput.textContent = "[unknown attack speed value]";

            sdDpsOutput.classList.add("error");

            sdDpsOutput.textContent = "[undefined]";
        }
    }

    for (const input of [
        strInput,
        dexInput,
        intInput,
        lukInput,
        totalWatkInput,
        masteryInput,
        classInput,
        weaponTypeInput,
        speedInput,
        enemyWdefInput,
    ]) {
        input.addEventListener("change", () => {
            recalculate();
        });
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
function clampedVariance(
    a: number,
    b: number,
    mu: number,
): number | undefined {
    if (a === b || b <= 1) {
        return 0;
    }
    if (a > b) {
        return;
    }

    return (
        ((b - mu) ** 3 - (Math.max(a, 1) - mu) ** 3) / (3 * (b - a)) +
        (1 - mu) ** 2 * Math.max((1 - a) / (b - a), 0)
    );
}

/**
 * Gets the expected value for a uniform distribution over the range
 * `[min, max]` that is **_actually not uniform_**, because the outcomes are
 * clamped to a minimum of 1.
 */
function clampedExpectation(min: number, max: number): number {
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
            inputData.totalWatk) /
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
            inputData.mastery +
            secondaryStat(
                inputData.stats,
                inputData.wepType,
                inputData.clazz,
            )) *
            inputData.totalWatk) /
        100
    );
}

function adjustRangeForDef(
    range: [number, number],
    wdef: number,
): [number, number] {
    const [min, max] = range;

    return [min - wdef * 0.6, max - wdef * 0.5];
}
