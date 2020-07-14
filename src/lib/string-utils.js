import base64 from "./base64";

/**
 * encodeURIComponent handles utf-8, unescape does not. Neat!
 *
 * @param str {string}
 *
 * @return {string}
 */
export function encodeUtf8(str) {
    return unescape(encodeURIComponent(str));
}

/**
 * Our base64 library takes a string that is really a byte sequence,
 * and will throw if given a string with chars > 255 (and hence not
 * DTRT for chars > 127). So encode a unicode string as a UTF-8
 * sequence of "bytes".
 *
 * @param str {string}
 *
 * @return {string}
 */
export function saferBase64(str) {
    return base64.encode(encodeUtf8(str));
}

/**
 * JavaScript does not provide an default implementation of the hashCode function
 *
 * @param str {string}
 *
 * @return {number}
 */
export function hashCode(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        let char = this.charCodeAt(i);
        hash = 31*hash+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
