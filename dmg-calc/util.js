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
