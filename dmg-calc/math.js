/**
 * Returns the sum of the set {`n`, `n`+1, `n`+2, ..., `m`-3, `m`-2, `m`-1}.
 * Note that the upper bound is exclusive.  Another way of saying this is: the
 * sum of all of the integers in the interval [`n`, `m`).
 *
 * This function assumes that `m >= n`, and that both `m` and `n` are integers,
 * but usable results are still returned even if these assumptions are
 * violated.  Swapping `n` and `m` just flips the sign of the result, and
 * non-integral values for `n` and/or `m` will yield intermediate values, as
 * expected.
 *
 * This function is so called because it computes the difference between a
 * larger triangular number and a smaller triangular number.
 */
export function trapezoid(n, m) {
    return (m * (m - 1) - n * (n - 1)) / 2;
}
/**
 * Returns the sum of the set {`n`^2, (`n`+1)^2, (`n`+2)^2, ..., (`m`-3)^2,
 * (`m`-2)^2, (`m`-1)^2}. Note that the upper bound is exclusive.  Another way
 * of saying this is: the sum of the squares of all of the integers in the
 * interval [`n`, `m`).
 *
 * This function assumes that `m >= n`, and that both `m` and `n` are integers,
 * but usable results are still returned even if these assumptions are
 * violated.  Swapping `n` and `m` just flips the sign of the result, and
 * non-integral values for `n` and/or `m` will yield intermediate values, as
 * expected.
 *
 * This function is so called because it computes the difference between a
 * larger square pyramidal number and a smaller square pyramidal number. It
 * should probably be called `squareFrustum`, but `frustum` is cuter.
 */
export function frustum(n, m) {
    return (m * (m - 1) * (2 * m - 1) - n * (n - 1) * (2 * n - 1)) / 6;
}
/**
 * Gets the expected value for a uniform distribution over the interval
 * [`min`, `max`] that is **_actually not uniform_**, because the outcomes are
 * clamped to a minimum of 1, **and** the outcomes' fractional parts are
 * truncated.
 */
export function truncClampedExpectation(a, b) {
    if (a === b) {
        return Math.max(Math.trunc(a), 1);
    }
    if (b >= 1) {
        const [aInt, bInt] = [Math.trunc(a), Math.trunc(b)];
        return (((a >= 1 ? aInt * (1 - (a % 1)) : 2 - a) +
            trapezoid(Math.max(aInt + 1, 2), bInt) +
            bInt * (b % 1)) /
            (b - a));
    }
    return 1;
}
/**
 * Gets the expected value for a uniform distribution over the interval
 * [`min`, `max`] that is **_actually not uniform_**, because the outcomes are
 * clamped to a minimum of 1.
 */
/*
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
*/
/**
 * Gets the variance for a uniform distribution over the interval [`a`, `b`]
 * that is **_actually not uniform_**, because the outcomes are clamped to a
 * minimum of 1, **and** the outcomes' fractional parts are truncated.  The
 * `mu` parameter is the expectation of the distribution, which can be obtained
 * from the `truncClampedExpectation` function.
 *
 * This function assumes that `b >= a`.
 *
 * This function computes the variance based on its definition.  In LaTeX:
 *
 * ```latex
 * \operatorname{Var}(X) = \operatorname{E}[\left(X - \mu\right)^2]
 * ```
 */
export function truncClampedVariance(a, b, mu) {
    if (a === b || b <= 1) {
        return 0;
    }
    const [aInt, bInt] = [Math.trunc(a), Math.trunc(b)];
    const oneMinusMu = 1 - mu;
    const bIntMinusMu = bInt - mu;
    return (((a >= 1
        ? (aInt - mu) ** 2 * (1 - (a % 1))
        : (2 - a) * oneMinusMu ** 2) +
        frustum(Math.max(aInt + oneMinusMu, 2 - mu), bIntMinusMu) +
        bIntMinusMu ** 2 * (b % 1)) /
        (b - a));
}
/**
 * Gets the variance for a uniform distribution over the interval [`a`, `b`]
 * that is **_actually not uniform_**, because the outcomes are clamped to a
 * minimum of 1.  The `mu` parameter is the expectation of the distribution,
 * which can be obtained from the `clampedExpectation` function.
 *
 * This function assumes that `b >= a`, so if `b < a && b > 1`, you will get
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
/*
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

    const bMinusA = b - a;

    return (
        ((b - mu) ** 3 - (Math.max(a, 1) - mu) ** 3) / (3 * bMinusA) +
        (1 - mu) ** 2 * Math.max((1 - a) / bMinusA, 0)
    );
}
*/
