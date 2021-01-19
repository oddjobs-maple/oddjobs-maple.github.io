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
    attackIsElemental,
    attackName,
    attackPeriod,
    BAD_WEPS,
    chargeTypeFromValue,
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
    ChargeType,
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
    const echoInput = document.getElementById("echo") as HTMLInputElement;

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
    const goodAnimProbInput = document.getElementById(
        "good-anim-prob",
    ) as HTMLInputElement;
    const attackInput = document.getElementById("attack") as HTMLSelectElement;
    const spellInput = document.getElementById("spell") as HTMLSelectElement;
    const speedInput = document.getElementById("speed") as HTMLSelectElement;
    const spellBoosterInput = document.getElementById(
        "spell-booster",
    ) as HTMLInputElement;

    const eleAmpInput = document.getElementById("ele-amp") as HTMLInputElement;
    const eleBoostInput = document.getElementById(
        "ele-boost",
    ) as HTMLInputElement;
    const eleWepInput = document.getElementById("ele-wep") as HTMLInputElement;
    const eleChargeInputs = Array.from(
        document.getElementsByName(
            "ele-charge",
        ) as NodeListOf<HTMLInputElement>,
    );
    const eleChargeDmgInput = document.getElementById(
        "ele-charge-dmg",
    ) as HTMLInputElement;
    const eleChargeLevelInput = document.getElementById(
        "ele-charge-level",
    ) as HTMLInputElement;

    const caActiveInput = document.getElementById(
        "ca-active",
    ) as HTMLInputElement;
    const caDmgInput = document.getElementById("ca-dmg") as HTMLInputElement;
    const caLevelInput = document.getElementById(
        "ca-level",
    ) as HTMLInputElement;
    const caOrbsInput = document.getElementById("ca-orbs") as HTMLInputElement;

    const enemyWdefInput = document.getElementById(
        "enemy-wdef",
    ) as HTMLInputElement;
    const enemyMdefInput = document.getElementById(
        "enemy-mdef",
    ) as HTMLInputElement;
    const eleSusInput = document.getElementById(
        "ele-sus",
    ) as HTMLSelectElement;
    const enemyLevelInput = document.getElementById(
        "enemy-level",
    ) as HTMLInputElement;
    const enemyCountInput = document.getElementById(
        "enemy-count",
    ) as HTMLInputElement;
    const hitOrdInput = document.getElementById("hit-ord") as HTMLInputElement;

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
        let echo = Math.max(parseInt(echoInput.value, 10), 0);
        if (!Number.isFinite(echo)) {
            echo = 0;
        }
        echoInput.value = "" + echo;

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
        let goodAnimProb = Math.min(
            Math.max(parseFloat(goodAnimProbInput.value), 0),
            100,
        );
        if (!Number.isFinite(goodAnimProb)) {
            goodAnimProb = 50;
        }
        goodAnimProbInput.value = "" + goodAnimProb;
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
        let eleBoost = Math.max(parseInt(eleBoostInput.value, 10), 0);
        if (!Number.isFinite(eleBoost)) {
            eleBoost = 0;
        }
        eleBoostInput.value = "" + eleBoost;
        let eleWep = Math.max(parseInt(eleWepInput.value, 10), 0);
        if (!Number.isFinite(eleWep)) {
            eleWep = 0;
        }
        eleWepInput.value = "" + eleWep;
        const eleChargeType: ChargeType = (() => {
            let eleChargeType: ChargeType | undefined = undefined;
            for (const eleChargeInput of eleChargeInputs) {
                if (eleChargeInput.checked) {
                    eleChargeType = chargeTypeFromValue(eleChargeInput.value);
                    break;
                }
            }

            if (eleChargeType === undefined) {
                eleChargeInputs.forEach(inp => (inp.checked = false));

                const noEleChargeInput = document.getElementById(
                    "no-ele-charge",
                ) as HTMLInputElement;
                noEleChargeInput.checked = true;

                return ChargeType.None;
            }

            return eleChargeType;
        })();
        let eleChargeDmg = Math.max(
            parseInt(eleChargeDmgInput.value, 10),
            100,
        );
        if (!Number.isFinite(eleChargeDmg)) {
            eleChargeDmg = 100;
        }
        eleChargeDmgInput.value = "" + eleChargeDmg;
        let eleChargeLevel = Math.min(
            Math.max(parseInt(eleChargeLevelInput.value, 10), 1),
            30,
        );
        if (!Number.isFinite(eleChargeLevel)) {
            eleChargeLevel = 1;
        }
        eleChargeLevelInput.value = "" + eleChargeLevel;

        const caActive = caActiveInput.checked;
        let caDmg = Math.max(parseInt(caDmgInput.value, 10), 100);
        if (!Number.isFinite(caDmg)) {
            caDmg = 104;
        }
        caDmgInput.value = "" + caDmg;
        let caLevel = Math.min(
            Math.max(parseInt(caLevelInput.value, 10), 1),
            30,
        );
        if (!Number.isFinite(caLevel)) {
            caLevel = 1;
        }
        caLevelInput.value = "" + caLevel;
        let caOrbs = Math.min(
            Math.max(parseInt(caOrbsInput.value, 10), 1),
            10,
        );
        if (!Number.isFinite(caOrbs)) {
            caOrbs = 1;
        }
        caOrbsInput.value = "" + caOrbs;

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
        let enemyLevel = Math.max(parseInt(enemyLevelInput.value, 10), 1);
        if (!Number.isFinite(enemyLevel)) {
            enemyLevel = 1;
        }
        enemyLevelInput.value = "" + enemyLevel;
        let enemyCount = Math.min(
            Math.max(parseInt(enemyCountInput.value, 10), 1),
            15,
        );
        if (!Number.isFinite(enemyCount)) {
            enemyCount = 1;
        }
        enemyCountInput.value = "" + enemyCount;
        let hitOrd = Math.min(Math.max(parseInt(hitOrdInput.value, 10), 1), 6);
        if (!Number.isFinite(hitOrd)) {
            hitOrd = 1;
        }
        hitOrdInput.value = "" + hitOrd;

        return new InputData(
            new Stats(str, dex, int, luk),
            totalWatk,
            totalMatk,
            echo / 100,
            mastery / 100,
            skillDmgMulti / 100,
            skillBasicAtk,
            skillLines,
            critProb / 100,
            critDmg / 100,
            clazz,
            level,
            wepType,
            goodAnimProb / 100,
            attack,
            spell,
            speed,
            spellBooster,
            eleAmp / 100,
            eleBoost / 100,
            eleWep / 100,
            eleChargeType,
            eleChargeDmg / 100,
            eleChargeLevel,
            caActive,
            caDmg,
            caLevel,
            caOrbs,
            enemyWdef,
            enemyMdef,
            eleSus,
            enemyLevel,
            enemyCount,
            hitOrd,
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
        const goodAnimProb = (() => {
            switch (inputData.attack) {
                case Attack.Rush:
                case Attack.CrusherLow:
                case Attack.CrusherHigh:
                case Attack.SomersaultKick:
                case Attack.AerialStrike:
                    return swingProbToGoodAnimProb(inputData, 0);
                case Attack.Brandish:
                    return 0.5;
                case Attack.Blast:
                    return swingProbToGoodAnimProb(inputData, 0.6);
                case Attack.HeavensHammerXiuz:
                case Attack.HeavensHammerXiuzCorrected:
                    return 1;
                case Attack.Fury:
                    return swingProbToGoodAnimProb(inputData, 1);
                default:
                    return inputData.goodAnimProb;
            }
        })();
        const badAnimProb = 1 - goodAnimProb;

        const caMod = caModifier(inputData);
        const eleChargeMod = eleChargeModifier(inputData);
        const eleSus = attackEffectiveEleSus(inputData);

        const [minDmgPhysBad, maxDmgPhysGood] = [
            (() => {
                const goodAnim = goodAnimProb >= 1;

                switch (inputData.attack) {
                    case Attack.BowWhack:
                    case Attack.PowerKnockBack:
                        return minDmgBowWhack(inputData);
                    case Attack.ClawPunch:
                        return minDmgClawPunch(inputData);
                    case Attack.Panic:
                    case Attack.Coma:
                        return minDmgCaFinisher(inputData, goodAnim);
                    case Attack.HeavensHammerXiuz:
                        return minDmgHhXiuz(inputData);
                    case Attack.HeavensHammerXiuzCorrected:
                        return minDmgPhys(inputData, true);
                    case Attack.DragonRoar:
                        return minDmgDragonRoar(inputData);
                    // Massive hack to make Arrow Bomb easier to work with...
                    case Attack.ArrowBombImpact:
                        return minDmgArrowBombImpact(inputData, false);
                    case Attack.ArrowBombSplash:
                        return minDmgArrowBombSplash(inputData, false);
                    case Attack.Phoenix:
                    case Attack.Frostprey:
                    case Attack.Octopus:
                    case Attack.Gaviota:
                    case Attack.WrathOfTheOctopi:
                        return minDmgDexSummon(inputData);
                    case Attack.LuckySeven:
                    case Attack.TripleThrow:
                        return minDmgLuckySeven(inputData);
                    case Attack.NinjaAmbush:
                        return dmgNinjaAmbush(inputData);
                    case Attack.VenomousStar:
                    case Attack.VenomousStab:
                        return minDmgVenom(inputData);
                    default:
                        return minDmgPhys(inputData, goodAnim);
                }
            })(),
            (() => {
                const goodAnim = goodAnimProb > 0;

                switch (inputData.attack) {
                    case Attack.BowWhack:
                    case Attack.PowerKnockBack:
                        return maxDmgBowWhack(inputData);
                    case Attack.ClawPunch:
                        return maxDmgClawPunch(inputData);
                    case Attack.Panic:
                    case Attack.Coma:
                        return maxDmgCaFinisher(inputData, goodAnim);
                    case Attack.HeavensHammerXiuz:
                    case Attack.HeavensHammerXiuzCorrected:
                        return maxDmgPhys(inputData, true);
                    case Attack.DragonRoar:
                        return maxDmgDragonRoar(inputData);
                    // Massive hack to make Arrow Bomb easier to work with...
                    case Attack.ArrowBombImpact:
                        return maxDmgArrowBombImpact(inputData, true);
                    case Attack.ArrowBombSplash:
                        return maxDmgArrowBombSplash(inputData, true);
                    case Attack.Phoenix:
                    case Attack.Frostprey:
                    case Attack.Octopus:
                    case Attack.Gaviota:
                    case Attack.WrathOfTheOctopi:
                        return maxDmgDexSummon(inputData);
                    case Attack.LuckySeven:
                    case Attack.TripleThrow:
                        return maxDmgLuckySeven(inputData);
                    case Attack.NinjaAmbush:
                        return dmgNinjaAmbush(inputData);
                    case Attack.VenomousStar:
                    case Attack.VenomousStab:
                        return maxDmgVenom(inputData);
                    default:
                        return maxDmgPhys(inputData, goodAnim);
                }
            })(),
        ].map(dmg => dmg * eleSus * caMod * eleChargeMod);
        const [minDmgPhysGood, maxDmgPhysBad] = [
            (() => {
                if (goodAnimProb <= 0) {
                    return minDmgPhysBad;
                }

                switch (inputData.attack) {
                    case Attack.BowWhack:
                    case Attack.PowerKnockBack:
                    case Attack.ClawPunch:
                    case Attack.Rush:
                    case Attack.Blast:
                    case Attack.HeavensHammerXiuz:
                    case Attack.HeavensHammerXiuzCorrected:
                    case Attack.CrusherHigh:
                    case Attack.CrusherLow:
                    case Attack.Fury:
                    case Attack.DragonRoar:
                    case Attack.Phoenix:
                    case Attack.Frostprey:
                    case Attack.Octopus:
                    case Attack.Gaviota:
                    case Attack.WrathOfTheOctopi:
                    case Attack.LuckySeven:
                    case Attack.TripleThrow:
                    case Attack.NinjaAmbush:
                    case Attack.VenomousStar:
                    case Attack.VenomousStab:
                    case Attack.SomersaultKick:
                    case Attack.AerialStrike:
                        return minDmgPhysBad;
                    case Attack.Panic:
                    case Attack.Coma:
                        return minDmgCaFinisher(inputData, true);
                    // Massive hack to make Arrow Bomb easier to work with...
                    case Attack.ArrowBombImpact:
                        return minDmgArrowBombImpact(inputData, true);
                    case Attack.ArrowBombSplash:
                        return minDmgArrowBombSplash(inputData, true);
                    default:
                        return minDmgPhys(inputData, true);
                }
            })(),
            (() => {
                if (goodAnimProb >= 1) {
                    return maxDmgPhysGood;
                }

                switch (inputData.attack) {
                    case Attack.BowWhack:
                    case Attack.PowerKnockBack:
                    case Attack.ClawPunch:
                    case Attack.Rush:
                    case Attack.Blast:
                    case Attack.HeavensHammerXiuz:
                    case Attack.HeavensHammerXiuzCorrected:
                    case Attack.CrusherHigh:
                    case Attack.CrusherLow:
                    case Attack.Fury:
                    case Attack.DragonRoar:
                    case Attack.Phoenix:
                    case Attack.Frostprey:
                    case Attack.Octopus:
                    case Attack.Gaviota:
                    case Attack.WrathOfTheOctopi:
                    case Attack.LuckySeven:
                    case Attack.TripleThrow:
                    case Attack.NinjaAmbush:
                    case Attack.VenomousStar:
                    case Attack.VenomousStab:
                    case Attack.SomersaultKick:
                    case Attack.AerialStrike:
                        return maxDmgPhysGood;
                    case Attack.Panic:
                    case Attack.Coma:
                        return maxDmgCaFinisher(inputData, false);
                    // Massive hack to make Arrow Bomb easier to work with...
                    case Attack.ArrowBombImpact:
                        return maxDmgArrowBombImpact(inputData, false);
                    case Attack.ArrowBombSplash:
                        return maxDmgArrowBombSplash(inputData, false);
                    default:
                        return maxDmgPhys(inputData, false);
                }
            })(),
        ].map(dmg => dmg * eleSus * caMod * eleChargeMod);

        const [minDmgPhysBadAdjusted, maxDmgPhysGoodAdjusted] = (() => {
            switch (inputData.attack) {
                case Attack.HeavensHammerXiuz:
                case Attack.HeavensHammerXiuzCorrected:
                case Attack.Phoenix:
                case Attack.Frostprey:
                case Attack.Octopus:
                case Attack.Gaviota:
                case Attack.WrathOfTheOctopi:
                    return [minDmgPhysBad, maxDmgPhysGood];
                case Attack.Assaulter:
                    return inputData.level >= inputData.enemyLevel
                        ? [minDmgPhysBad, maxDmgPhysGood]
                        : adjustRangeForWdef(inputData, [
                              minDmgPhysBad,
                              maxDmgPhysGood,
                          ]);
                default:
                    return adjustRangeForWdef(inputData, [
                        minDmgPhysBad,
                        maxDmgPhysGood,
                    ]);
            }
        })();
        const [minDmgPhysGoodAdjusted, maxDmgPhysBadAdjusted] = (() => {
            switch (inputData.attack) {
                case Attack.HeavensHammerXiuz:
                case Attack.HeavensHammerXiuzCorrected:
                case Attack.Phoenix:
                case Attack.Frostprey:
                case Attack.Octopus:
                case Attack.Gaviota:
                case Attack.WrathOfTheOctopi:
                    return [minDmgPhysGood, maxDmgPhysBad];
                case Attack.Assaulter:
                    return inputData.level >= inputData.enemyLevel
                        ? [minDmgPhysGood, maxDmgPhysBad]
                        : adjustRangeForWdef(inputData, [
                              minDmgPhysGood,
                              maxDmgPhysBad,
                          ]);
                default:
                    return adjustRangeForWdef(inputData, [
                        minDmgPhysGood,
                        maxDmgPhysBad,
                    ]);
            }
        })();

        const [dmgMultiNoCrit, dmgMultiCrit] = [
            dmgMulti(inputData, false),
            dmgMulti(
                inputData,
                inputData.attack !== Attack.HeavensHammerXiuz &&
                    inputData.attack !== Attack.HeavensHammerXiuzCorrected &&
                    inputData.attack !== Attack.Phoenix &&
                    inputData.attack !== Attack.Frostprey &&
                    inputData.attack !== Attack.Octopus &&
                    inputData.attack !== Attack.Gaviota &&
                    inputData.attack !== Attack.WrathOfTheOctopi &&
                    inputData.attack !== Attack.VenomousStar &&
                    inputData.attack !== Attack.VenomousStab,
            ),
        ];
        const afterModifier = afterModPhys(inputData);
        const [
            minDmgPhysBadNoCrit,
            maxDmgPhysGoodNoCrit,
            minDmgPhysGoodNoCrit,
            maxDmgPhysBadNoCrit,
        ] =
            // Massive hack to make Arrow Bomb easier to work with...
            inputData.attack === Attack.ArrowBombImpact ||
            inputData.attack === Attack.ArrowBombSplash
                ? [
                      minDmgPhysBadAdjusted,
                      maxDmgPhysBadAdjusted,
                      minDmgPhysBadAdjusted,
                      maxDmgPhysBadAdjusted,
                  ]
                : [
                      minDmgPhysBadAdjusted,
                      maxDmgPhysGoodAdjusted,
                      minDmgPhysGoodAdjusted,
                      maxDmgPhysBadAdjusted,
                  ].map(x => Math.max(x * dmgMultiNoCrit, 1) * afterModifier);
        const [
            minDmgPhysBadCrit,
            maxDmgPhysGoodCrit,
            minDmgPhysGoodCrit,
            maxDmgPhysBadCrit,
        ] =
            // Massive hack to make Arrow Bomb easier to work with...
            inputData.attack === Attack.ArrowBombImpact ||
            inputData.attack === Attack.ArrowBombSplash
                ? [
                      minDmgPhysGoodAdjusted,
                      maxDmgPhysGoodAdjusted,
                      minDmgPhysGoodAdjusted,
                      maxDmgPhysGoodAdjusted,
                  ]
                : [
                      minDmgPhysBadAdjusted,
                      maxDmgPhysGoodAdjusted,
                      minDmgPhysGoodAdjusted,
                      maxDmgPhysBadAdjusted,
                  ].map(x => Math.max(x * dmgMultiCrit, 1) * afterModifier);

        // Lots of special-casing for Barrage, the only goddamn attack that
        // does this...
        const [maxDmgNoCritBarrage, maxDmgCritBarrage] = [
            maxDmgPhysGoodNoCrit,
            maxDmgPhysGoodCrit,
        ].map(
            x =>
                x *
                (inputData.attack === Attack.Barrage
                    ? afterModBarrage(inputData.skillLines)
                    : 0),
        );

        const range =
            inputData.attack === Attack.Barrage
                ? [
                      Math.max(Math.trunc(minDmgPhysBadNoCrit), 1),
                      Math.max(Math.trunc(maxDmgNoCritBarrage), 1),
                  ]
                : [minDmgPhysBadNoCrit, maxDmgPhysGoodNoCrit].map(x =>
                      Math.max(Math.trunc(x), 1),
                  );
        const critRange =
            inputData.attack === Attack.Barrage
                ? [
                      Math.max(Math.trunc(minDmgPhysBadCrit), 1),
                      Math.max(Math.trunc(maxDmgCritBarrage), 1),
                  ]
                : [minDmgPhysBadCrit, maxDmgPhysGoodCrit].map(x =>
                      Math.max(Math.trunc(x), 1),
                  );
        rangeOutput.textContent = `${range[0]} ~ ${range[1]}${
            range[1] ===
                (inputData.attack === Attack.Barrage
                    ? maxDmgNoCritBarrage
                    : maxDmgPhysGoodNoCrit) && range[1] !== 1
                ? "*"
                : ""
        }`;
        critRangeOutput.textContent = `${critRange[0]} ~ ${critRange[1]}${
            critRange[1] ===
                (inputData.attack === Attack.Barrage
                    ? maxDmgCritBarrage
                    : maxDmgPhysGoodCrit) && critRange[1] !== 1
                ? "*"
                : ""
        }`;
        const [combinedRangeTop, combinedRangeTopOneLine] =
            inputData.critProb > 0
                ? [critRange[1], maxDmgPhysGoodCrit]
                : [range[1], maxDmgPhysGoodNoCrit];
        if (inputData.attack === Attack.Barrage) {
            let totalRangeBottom =
                range[0] * Math.min(inputData.skillLines, 4);
            for (let i = 5; i <= inputData.skillLines; ++i) {
                totalRangeBottom += Math.max(
                    Math.trunc(minDmgPhysBadNoCrit * afterModBarrage(i)),
                    1,
                );
            }

            let totalRangeTop =
                combinedRangeTop * Math.min(inputData.skillLines, 4);
            for (let i = 5; i <= inputData.skillLines; ++i) {
                totalRangeTop += Math.max(
                    Math.trunc(combinedRangeTopOneLine * afterModBarrage(i)),
                    1,
                );
            }

            totalRangeOutput.textContent = `${totalRangeBottom} ~ \
                                           ${totalRangeTop}${
                combinedRangeTop === combinedRangeTopOneLine &&
                combinedRangeTop !== 1
                    ? "*"
                    : ""
            }`;
        } else {
            totalRangeOutput.textContent = `${
                range[0] * inputData.skillLines
            } ~ ${combinedRangeTop * inputData.skillLines}${
                combinedRangeTop === combinedRangeTopOneLine &&
                combinedRangeTop !== 1
                    ? "*"
                    : ""
            }`;
        }

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
        const expectedPerHit =
            expectedPerHitBad * badAnimProb +
            expectedPerHitGood * goodAnimProb;
        const expectedPerHitTotal =
            inputData.attack === Attack.Barrage
                ? (() => {
                      let accum =
                          expectedPerHit * Math.min(inputData.skillLines, 4);
                      for (let i = 5; i <= inputData.skillLines; ++i) {
                          accum += expectedPerHit * afterModBarrage(i);
                      }

                      return accum;
                  })()
                : expectedPerHit * inputData.skillLines;

        expectedPerHitOutput.textContent = (
            expectedPerHit *
            (inputData.attack === Attack.Barrage
                ? barrageEffectiveMulti(inputData.skillLines) /
                  inputData.skillLines
                : 1)
        ).toFixed(3);
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

                return (
                    mainVariancePerHitBad * badAnimProb +
                    mainVariancePerHitGood * goodAnimProb
                );
            }

            return;
        })();

        let sdPerHitTotal: number | undefined = undefined;
        if (variancePerHit !== undefined) {
            sdPerHitOutput.classList.remove("error");
            cvPerHitOutput.classList.remove("error");
            sdPerHitTotalOutput.classList.remove("error");
            cvPerHitTotalOutput.classList.remove("error");

            const sdPerHit = Math.sqrt(
                inputData.attack === Attack.Barrage
                    ? variancePerHit *
                          (barrageEffectiveMulti(inputData.skillLines) /
                              inputData.skillLines)
                    : variancePerHit,
            );
            // This is mathematically valid because the damage/outcome of each
            // line is independent of the damage of any other line, thus
            // implying uncorrelatedness.  Furthermore, this implies that the
            // variance of the sum of lines is the sum of the variance of said
            // lines (see the Bienaymé formula/identity).
            sdPerHitTotal = Math.sqrt(
                variancePerHit *
                    (inputData.attack === Attack.Barrage
                        ? barrageEffectiveMulti(inputData.skillLines)
                        : inputData.skillLines),
            );

            sdPerHitOutput.textContent = sdPerHit.toFixed(3);
            cvPerHitOutput.textContent = (
                sdPerHit /
                (expectedPerHit *
                    (inputData.attack === Attack.Barrage
                        ? barrageEffectiveMulti(inputData.skillLines) /
                          inputData.skillLines
                        : 1))
            ).toFixed(5);
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
                // each line is independent of the damage of any other line,
                // thus implying uncorrelatedness.  Furthermore, this implies
                // that the variance of the sum of lines is the sum of the
                // variance of said lines (see the Bienaymé formula/identity).
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
        const eleWepBonus =
            1 + (isHolySpell(inputData.spell) ? 0 : inputData.eleWep);

        const [minDmg, maxDmg] = [
            (() => {
                switch (inputData.spell) {
                    case Spell.Heal:
                        return minDmgHeal(inputData);
                    default:
                        return minDmgMagic(inputData);
                }
            })() *
                inputData.eleAmp *
                eleWepBonus *
                inputData.eleSus,
            (() => {
                switch (inputData.spell) {
                    case Spell.Heal:
                        return maxDmgHeal(inputData);
                    default:
                        return maxDmgMagic(inputData);
                }
            })() *
                inputData.eleAmp *
                eleWepBonus *
                inputData.eleSus,
        ];

        const [minDmgNoCrit, maxDmgNoCrit] = adjustRangeForMdef(inputData, [
            minDmg,
            maxDmg,
        ]);
        const [minDmgCrit, maxDmgCrit] = [minDmgNoCrit, maxDmgNoCrit].map(
            x => x * inputData.critDmg,
        );

        const [
            minDmgNoCritAfter,
            maxDmgNoCritAfter,
            minDmgCritAfter,
            maxDmgCritAfter,
        ] = [minDmgNoCrit, maxDmgNoCrit, minDmgCrit, maxDmgCrit].map(
            x => Math.max(x, 1) * afterModMagic(inputData),
        );

        const range = [minDmgNoCritAfter, maxDmgNoCritAfter].map(x =>
            Math.max(Math.trunc(x), 1),
        );
        const critRange = [minDmgCritAfter, maxDmgCritAfter].map(x =>
            Math.max(Math.trunc(x), 1),
        );
        rangeMagicOutput.textContent = `${range[0]} ~ ${range[1]}${
            range[1] === maxDmgNoCritAfter && range[1] !== 1 ? "*" : ""
        }`;
        critRangeMagicOutput.textContent = `${critRange[0]} ~ ${critRange[1]}${
            critRange[1] === maxDmgCritAfter && critRange[1] !== 1 ? "*" : ""
        }`;
        const combinedRangeTop =
            inputData.critProb > 0 ? critRange[1] : range[1];
        totalRangeMagicOutput.textContent = `${
            range[0] * inputData.skillLines
        } ~ ${combinedRangeTop * inputData.skillLines}${
            combinedRangeTop ===
                (inputData.critProb > 0
                    ? maxDmgCritAfter
                    : maxDmgNoCritAfter) && combinedRangeTop !== 1
                ? "*"
                : ""
        }`;

        const [expectedPerHitNoCrit, expectedPerHitCrit] = [
            truncClampedExpectation(minDmgNoCritAfter, maxDmgNoCritAfter),
            truncClampedExpectation(minDmgCritAfter, maxDmgCritAfter),
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
            minDmgNoCritAfter,
            maxDmgNoCritAfter,
            expectedPerHit,
        );
        const mainVariancePerHitCrit = truncClampedVariance(
            minDmgCritAfter,
            maxDmgCritAfter,
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

                if (
                    inputData.skillDmgMulti !== 1 &&
                    inputData.spell !== Spell.Heal
                ) {
                    warnings.push(
                        "Your damage multi \u{2260}100%, but you\u{2019}re a \
                        magician who is not casting Heal.",
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
                            Claws\u{2019} interaction with Somersault \
                            Kick/Aerial Strike is poorly understood.",
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
            const [minLines, maxLines, maxTargets] = attackLines;
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
            if (inputData.enemyCount > maxTargets) {
                warnings.push(
                    `You\u{2019}re attacking with ${attackName(
                        inputData.attack,
                    )}, but your number of targets >${maxTargets}.`,
                );
            }
        }

        const spellLines = SPELL_LINES.get(inputData.spell);
        if (spellLines === undefined) {
            console.error(
                `Logic error: ${inputData.spell} is not a key in SPELL_LINES`,
            );
        } else {
            const [minLines, maxLines, maxTargets] = spellLines;
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
            if (inputData.enemyCount > maxTargets) {
                warnings.push(
                    `You\u{2019}re casting ${spellName(
                        inputData.spell,
                    )}, but your number of targets >${maxTargets}.`,
                );
            }
        }

        if (
            inputData.attack === Attack.SomersaultKick ||
            inputData.attack === Attack.AerialStrike
        ) {
            if (
                inputData.attack === Attack.SomersaultKick &&
                inputData.wepType !== WeaponType.None &&
                inputData.wepType !== WeaponType.Knuckler
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
                        `You\u{2019}re using ${attackName(
                            inputData.attack,
                        )} with ${indefinite(
                            weaponTypeName(inputData.wepType),
                        )} equipped; the damage calculation is done on a \
                        best-effort basis that may or may not be accurate.`,
                    );
                    break;
                default:
                    break;
            }
        }

        if (inputData.attack === Attack.BowWhack) {
            warnings.push(
                "You\u{2019}re whacking with a (cross)bow; the damage \
                calculation is done on a best-effort basis that may or may \
                not be accurate.",
            );

            if (inputData.skillDmgMulti !== 1) {
                warnings.push(
                    "You\u{2019}re whacking with a (cross)bow, but your \
                    damage multi \u{2260}100%. Maybe you meant to use Power \
                    Knock-Back?",
                );
            }
        }

        if (
            inputData.attack === Attack.ClawPunch &&
            inputData.skillDmgMulti !== 1
        ) {
            warnings.push(
                "You\u{2019}re punching with a claw, but your damage multi \
                \u{2260}100%.",
            );
        }

        if (inputData.attack === Attack.Gaviota) {
            warnings.push(
                "Gaviota\u{2019}s attack period is based on an idealization; \
                actual usage will almost certainly have a larger attack \
                period and thus lower DPS.",
            );
        }

        if (inputData.attack === Attack.WrathOfTheOctopi) {
            warnings.push(
                "The attack period for Wrath of the Octopi is unmeasured, so \
                the slower attack period of Octopus (the skill which it \
                upgrades) is used instead.",
            );
        }

        if (inputData.caActive) {
            if (inputData.clazz !== Class.Warrior) {
                warnings.push(
                    "You have (Advanced) Combo Attack active, but \
                    you\u{2019}re not a warrior.",
                );
            }
            if (inputData.level < 70) {
                warnings.push(
                    "You have (Advanced) Combo Attack active, but your level \
                    <70.",
                );
            }

            if (1 + (inputData.level - 70) * 3 < inputData.caLevel) {
                warnings.push(
                    `You have ${inputData.caLevel} SP in the Combo Attack \
                    skill, but you\u{2019}re not high enough level to have \
                    that many third job SP.`,
                );
            }
            if (inputData.caOrbs > 5 && inputData.level < 120) {
                warnings.push(
                    "You have >5 (Advanced) Combo Attack orbs, but your level \
                    <120.",
                );
            }
        } else {
            if (
                inputData.attack === Attack.Panic ||
                inputData.attack === Attack.Coma
            ) {
                warnings.push(
                    `You\u{2019}re attacking with ${attackName(
                        inputData.attack,
                    )}, but (Advanced) Combo Attack is inactive.`,
                );
            }
        }

        if (inputData.hitOrd > inputData.enemyCount) {
            warnings.push(
                "The ordinal # of your hit is greater than the total number \
                of enemies being targeted.",
            );
        }

        function delayWarn(jobName: string) {
            const atkName = attackName(inputData.attack);
            warnings.push(
                `You\u{2019}re attacking with ${atkName}; the attack period \
                (and thus DPS value) is based on the spamming of solely \
                ${atkName}. The projected DPS will thus be less than that of \
                a hypothetical ${jobName}, who would be attacking in between \
                ${atkName}s.`,
            );
        }
        switch (inputData.attack) {
            case Attack.NinjaStorm:
                delayWarn("nightlord");
                break;
            case Attack.BoomerangStep:
                delayWarn("shadower");
                break;
            case Attack.BackspinBlow:
            case Attack.DoubleUppercut:
                delayWarn("brawler");
                break;
            case Attack.EnergyBlast:
                delayWarn("marauder");
                break;
            case Attack.DragonStrike:
            case Attack.Snatch:
            case Attack.Barrage:
                delayWarn("buccaneer");
                break;
            case Attack.RecoilShot:
                delayWarn("gunslinger");
                break;
            case Attack.Flamethrower:
            case Attack.IceSplitter:
                delayWarn("outlaw");
                break;
            case Attack.AerialStrike:
                delayWarn("corsair");
                break;
        }

        if (
            inputData.attack === Attack.Flamethrower ||
            inputData.attack === Attack.Inferno
        ) {
            warnings.push(
                `The damage calculation used here for ${inputData.attack} \
                does not take into account the flaming/burning damage over \
                time.`,
            );
        }

        if (inputData.echo !== 0 && inputData.echo !== 4 / 100) {
            warnings.push(
                "You have specified a nonzero value for Echo of Hero that is \
                not exactly 4%.",
            );
        }

        switch (inputData.eleChargeType) {
            case ChargeType.None: {
                if (inputData.eleChargeDmg !== 1) {
                    warnings.push(
                        "You have no elemental charge, but your elemental \
                        charge damage \u{2260}100%.",
                    );
                }
                break;
            }
            case ChargeType.Holy: {
                if (
                    1 + (inputData.level - 120) * 3 <
                    inputData.eleChargeLevel
                ) {
                    warnings.push(
                        `You have level ${inputData.eleChargeLevel} \
                        Holy/Divine Charge selected, but you aren\u{2019}t a \
                        high enough level to have that much fourth job SP.`,
                    );
                }
                if (inputData.eleChargeLevel > 20) {
                    warnings.push("You have a Holy/Divine Charge level >20.");
                }
                break;
            }
            case ChargeType.Other: {
                if (
                    1 + (inputData.level - 70) * 3 <
                    inputData.eleChargeLevel
                ) {
                    warnings.push(
                        `You have a level ${inputData.eleChargeLevel} \
                        non-Holy/Divine Charge selected, but you \
                        aren\u{2019}t a high enough level to have that much \
                        third job SP.`,
                    );
                }
                break;
            }
        }
        if (inputData.eleChargeType !== ChargeType.None) {
            if (inputData.clazz !== Class.Warrior) {
                warnings.push(
                    "You have an elemental charge selected, but you\u{2019}re \
                    not a warrior.",
                );
            }
            switch (inputData.wepType) {
                case WeaponType.OneHandedSword:
                case WeaponType.OneHandedMace:
                case WeaponType.TwoHandedSword:
                case WeaponType.TwoHandedMace:
                    break;
                default:
                    warnings.push(
                        "You have an elemental charge selected, but \
                        you\u{2019}re not using a sword nor a blunt weapon.",
                    );
                    break;
            }
        }

        if (inputData.eleBoost !== 0) {
            if (inputData.clazz !== Class.Pirate2nd) {
                warnings.push(
                    "Your Elemental Boost \u{2260}0%, but you\u{2019}re not a \
                    \u{2265}2\u{207f}\u{1d48} job pirate.",
                );
            }
            if (inputData.level < 120) {
                warnings.push(
                    "Your Elemental Boost \u{2260}0%, but your level <120.",
                );
            }
        }

        if (inputData.eleWep !== 0) {
            if (
                inputData.wepType !== WeaponType.Wand &&
                inputData.wepType !== WeaponType.Staff
            ) {
                warnings.push(
                    "You are getting a nonzero elemental bonus from your \
                    weapon, but you aren\u{2019}t wielding a wand nor a \
                    staff.",
                );
            } else if (inputData.clazz !== Class.Magician) {
                warnings.push(
                    `You\u{2019}re using an Elemental ${
                        inputData.wepType === WeaponType.Wand
                            ? "Wand"
                            : "Staff"
                    }, but you\u{2019}re not a magician.`,
                );
            }

            if (inputData.eleWep !== 25 / 100) {
                warnings.push(
                    "Your Elemental Wand/Staff is giving an elemental bonus \
                    \u{2260}25%.",
                );
            }
        }

        switch (inputData.wepType) {
            case WeaponType.Polearm: {
                if (inputData.goodAnimProb !== 60 / 100) {
                    warnings.push(
                        "You\u{2019}re using a polearm, but your good \
                        animation probability \u{2260}60%. It is currently \
                        suspected that the actual probability is 60% in \
                        pre-BB GMS.",
                    );
                }
                break;
            }
            case WeaponType.Spear: {
                if (inputData.goodAnimProb !== 40 / 100) {
                    warnings.push(
                        "You\u{2019}re using a spear, but your good \
                        animation probability \u{2260}40%. It is currently \
                        suspected that the actual probability is 40% in \
                        pre-BB GMS.",
                    );
                }
                break;
            }
            case WeaponType.Wand:
            case WeaponType.Staff: {
                if (inputData.goodAnimProb !== 1) {
                    warnings.push(
                        `You\u{2019}re using ${indefinite(
                            weaponTypeName(inputData.wepType),
                        )}, but your good animation probability \u{2260}100%.
                        It is currently suspected that the actual probability
                        is 100% in pre-BB GMS.`,
                    );
                }
                break;
            }
            case WeaponType.OneHandedAxe:
            case WeaponType.TwoHandedAxe:
            case WeaponType.OneHandedMace:
            case WeaponType.TwoHandedMace: {
                if (inputData.goodAnimProb <= 0) {
                    warnings.push(
                        `You\u{2019}re using ${indefinite(
                            weaponTypeName(inputData.wepType),
                        )}, but your good animation probability is 0%. This \
                        is known to not be the true probability in pre-BB \
                        GMS.`,
                    );
                }
                if (inputData.goodAnimProb >= 1) {
                    warnings.push(
                        `You\u{2019}re using ${indefinite(
                            weaponTypeName(inputData.wepType),
                        )}, but your good animation probability is 100%. This \
                        is known to not be the true probability in pre-BB \
                        GMS.`,
                    );
                }
                break;
            }
            default:
                break;
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
        echoInput,
        masteryInput,
        skillDmgMultiInput,
        skillBasicAtkInput,
        skillLinesInput,
        critProbInput,
        critDmgInput,
        classInput,
        levelInput,
        weaponTypeInput,
        goodAnimProbInput,
        attackInput,
        spellInput,
        speedInput,
        spellBoosterInput,
        eleAmpInput,
        eleBoostInput,
        eleWepInput,
        eleChargeDmgInput,
        eleChargeLevelInput,
        caActiveInput,
        caDmgInput,
        caLevelInput,
        caOrbsInput,
        enemyWdefInput,
        enemyMdefInput,
        eleSusInput,
        enemyLevelInput,
        enemyCountInput,
        hitOrdInput,
    ]) {
        input.addEventListener("change", recalculate);
    }

    for (const eleChargeInput of eleChargeInputs) {
        eleChargeInput.addEventListener("change", () =>
            eleChargeInput.checked ? recalculate() : undefined,
        );
    }

    recalculate();
}

function dmgMulti(inputData: InputData, crit: boolean): number {
    return (
        inputData.skillDmgMulti +
        (crit ? inputData.critDmg : 0) +
        (inputData.attack === Attack.Flamethrower ||
        inputData.attack === Attack.IceSplitter
            ? inputData.eleBoost
            : 0)
    );
}

function attackEffectiveEleSus(inputData: InputData): number {
    if (!attackIsElemental(inputData.attack)) {
        return 1;
    }

    return inputData.eleSus;
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

function afterModPhys(inputData: InputData): number {
    switch (inputData.attack) {
        case Attack.IronArrow:
            return 0.9 ** (inputData.hitOrd - 1);
        case Attack.PiercingArrow:
            return 1.2 ** (inputData.hitOrd - 1);
        case Attack.EnergyOrb:
            return (2 / 3) ** (inputData.hitOrd - 1);
        default:
            return 1;
    }
}

function afterModBarrage(ord: number): number {
    return 2 ** Math.max(ord - 4, 0);
}

function barrageEffectiveMulti(lines: number): number {
    return Math.min(lines + 1, 4) + 2 ** Math.max(lines - 3, 0) - 2;
}

function caModifier(inputData: InputData): number {
    if (!inputData.caActive) {
        return 1;
    }

    if (inputData.caOrbs < 6) {
        return (
            (inputData.caDmg +
                Math.floor((inputData.caOrbs - 1) * (inputData.caLevel / 6))) /
            100
        );
    }

    return (inputData.caDmg + 20 + (inputData.caOrbs - 5) * 4) / 100;
}

function eleChargeModifier(inputData: InputData): number {
    switch (inputData.eleChargeType) {
        case ChargeType.None:
            return 1;
        case ChargeType.Holy: {
            if (inputData.eleSus === 1) {
                return inputData.eleChargeDmg;
            } else if (inputData.eleSus === 0) {
                return 0;
            } else if (inputData.eleSus < 1) {
                return (
                    (inputData.eleChargeDmg *
                        (80 - inputData.eleChargeLevel * 1.5)) /
                    100
                );
            }

            return (
                (inputData.eleChargeDmg *
                    (120 + inputData.eleChargeLevel * 1.5)) /
                100
            );
        }
        case ChargeType.Other: {
            if (inputData.eleSus === 1) {
                return inputData.eleChargeDmg;
            } else if (inputData.eleSus === 0) {
                return 0;
            } else if (inputData.eleSus < 1) {
                return (
                    (inputData.eleChargeDmg *
                        (95 - inputData.eleChargeLevel * 1.5)) /
                    100
                );
            }

            return (
                (inputData.eleChargeDmg *
                    (105 + inputData.eleChargeLevel * 1.5)) /
                100
            );
        }
    }
}

function maxDmgBowWhack(inputData: InputData): number {
    return (
        ((inputData.stats.dex * 3.4 + inputData.stats.str) *
            effectiveWatk(inputData)) /
        150
    );
}

function minDmgBowWhack(inputData: InputData): number {
    return (
        ((inputData.stats.dex * 3.4 * 0.1 * 0.9 + inputData.stats.str) *
            effectiveWatk(inputData)) /
        150
    );
}

function maxDmgClawPunch(inputData: InputData): number {
    return (
        ((inputData.stats.luk + inputData.stats.str + inputData.stats.dex) *
            effectiveWatk(inputData)) /
        150
    );
}

function minDmgClawPunch(inputData: InputData): number {
    return (
        ((inputData.stats.luk * 0.1 +
            inputData.stats.str +
            inputData.stats.dex) *
            effectiveWatk(inputData)) /
        150
    );
}

function orbMulti(inputData: InputData): number {
    switch (inputData.caOrbs) {
        case 1:
            return 1;
        case 2:
            return 1.2;
        case 3:
            return 1.54;
        case 4:
            return 2;
        default:
            return 2.5;
    }
}

function maxDmgCaFinisher(inputData: InputData, goodAnim: boolean): number {
    return maxDmgPhys(inputData, goodAnim) * orbMulti(inputData);
}

function minDmgCaFinisher(inputData: InputData, goodAnim: boolean): number {
    return minDmgPhys(inputData, goodAnim) * orbMulti(inputData);
}

function minDmgHhXiuz(inputData: InputData): number {
    return maxDmgPhys(inputData, true) * 0.8;
}

function maxDmgDragonRoar(inputData: InputData): number {
    return (
        ((inputData.stats.str * 4 + inputData.stats.dex) *
            effectiveWatk(inputData)) /
        100
    );
}

function minDmgDragonRoar(inputData: InputData): number {
    return (
        ((inputData.stats.str * 4 * inputData.mastery * 0.9 +
            inputData.stats.dex) *
            effectiveWatk(inputData)) /
        100
    );
}

function maxDmgArrowBombImpact(inputData: InputData, crit: boolean): number {
    return 0.5 * maxDmgPhys(inputData, true) * (crit ? inputData.critDmg : 1);
}

function minDmgArrowBombImpact(inputData: InputData, crit: boolean): number {
    return 0.5 * minDmgPhys(inputData, true) * (crit ? inputData.critDmg : 1);
}

function maxDmgArrowBombSplash(inputData: InputData, crit: boolean): number {
    return (
        inputData.skillDmgMulti *
        maxDmgPhys(inputData, true) *
        (crit ? inputData.critDmg : 1)
    );
}

function minDmgArrowBombSplash(inputData: InputData, crit: boolean): number {
    return (
        inputData.skillDmgMulti *
        minDmgPhys(inputData, true) *
        (crit ? inputData.critDmg : 1)
    );
}

function maxDmgDexSummon(inputData: InputData): number {
    return (
        ((inputData.stats.dex * 2.5 + inputData.stats.str) *
            inputData.skillBasicAtk) /
        100
    );
}

function minDmgDexSummon(inputData: InputData): number {
    return (
        ((inputData.stats.dex * 2.5 * 0.7 + inputData.stats.str) *
            inputData.skillBasicAtk) /
        100
    );
}

function maxDmgLuckySeven(inputData: InputData): number {
    return (inputData.stats.luk * 5 * effectiveWatk(inputData)) / 100;
}

function minDmgLuckySeven(inputData: InputData): number {
    return (inputData.stats.luk * 2.5 * effectiveWatk(inputData)) / 100;
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

function swingProbToGoodAnimProb(
    inputData: InputData,
    swingProb: number,
): number {
    switch (inputData.wepType) {
        case WeaponType.OneHandedAxe:
        case WeaponType.OneHandedMace:
        case WeaponType.Wand:
        case WeaponType.Staff:
        case WeaponType.TwoHandedAxe:
        case WeaponType.TwoHandedMace:
        case WeaponType.Polearm:
            return swingProb;
        default:
            return 1 - swingProb;
    }
}

function maxDmgMagic(inputData: InputData): number {
    const matk = effectiveMatk(inputData);

    return (
        ((matk ** 2 / 1000 + matk) / 30 + inputData.stats.int / 200) *
        inputData.skillBasicAtk
    );
}

function minDmgMagic(inputData: InputData): number {
    const matk = effectiveMatk(inputData);

    return (
        ((matk ** 2 / 1000 + matk * inputData.mastery * 0.9) / 30 +
            inputData.stats.int / 200) *
        inputData.skillBasicAtk
    );
}

function afterModMagic(inputData: InputData): number {
    switch (inputData.spell) {
        case Spell.ChainLightning:
            return 0.7 ** (inputData.hitOrd - 1);
        default:
            return 1;
    }
}

function healTargetMulti(enemyCount: number): number {
    return 1.5 + 5 / (enemyCount + 1);
}

function maxDmgHeal(inputData: InputData): number {
    return (
        (((inputData.stats.int * 1.2 + inputData.stats.luk) *
            effectiveMatk(inputData)) /
            1000) *
        healTargetMulti(inputData.enemyCount) *
        inputData.skillDmgMulti
    );
}

function minDmgHeal(inputData: InputData): number {
    return (
        (((inputData.stats.int * 0.3 + inputData.stats.luk) *
            effectiveMatk(inputData)) /
            1000) *
        healTargetMulti(inputData.enemyCount) *
        inputData.skillDmgMulti
    );
}

function adjustRangeForWdef(
    inputData: InputData,
    range: [number, number],
): [number, number] {
    const [min, max] = range;
    const levelDelta = Math.max(inputData.enemyLevel - inputData.level, 0);
    const levelDeltaSlope = 1 - 0.01 * levelDelta;

    return [
        min * levelDeltaSlope - inputData.enemyWdef * 0.6,
        max * levelDeltaSlope - inputData.enemyWdef * 0.5,
    ];
}

function adjustRangeForMdef(
    inputData: InputData,
    range: [number, number],
): [number, number] {
    const [min, max] = range;
    const levelDelta = Math.max(inputData.enemyLevel - inputData.level, 0);
    const levelDeltaSlope = 1 + 0.01 * levelDelta;

    return [
        min - inputData.enemyMdef * 0.6 * levelDeltaSlope,
        max - inputData.enemyMdef * 0.5 * levelDeltaSlope,
    ];
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
            case Class.Pirate2nd: {
                const totalWatk =
                    inputData.totalWatk +
                    Math.min(Math.trunc((2 * inputData.level + 31) / 3), 31);
                return totalWatk + totalWatk * inputData.echo;
            }
            default:
                return 0;
        }
    }

    return inputData.totalWatk + inputData.totalWatk * inputData.echo;
}

function effectiveMatk(inputData: InputData): number {
    return inputData.totalMatk + inputData.totalMatk * inputData.echo;
}
