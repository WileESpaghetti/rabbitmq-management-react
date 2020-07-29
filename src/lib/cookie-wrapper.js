import Cookies from 'universal-cookie';
import {hashCode} from "./string-utils";

class CookieWrapper {
    static #COOKIE_NAME = 'm';
    #data = {};

    constructor() {
        this.cookies = new Cookies();
    }

    /**
     * @return {{}}
     */
    getAll() {
        let doNotParse = {doNotParse: true}; // XXX: we use a custom cookie format to save space so we need the raw value
        let rawCookie = this.cookies.get(CookieWrapper.#COOKIE_NAME, doNotParse) // cookie dough! ^_^

        if (typeof rawCookie === 'undefined') {
            // either we haven't saved the cookie, or it expired
            return {};
        }

        return this.parse(rawCookie);
    }

    /**
     * Lookup a value from the cookie
     *
     * The key must be the human readable version and not the hash code.
     * null is returned if the value is not found. Otherwise a string is returned due to the encoding process
     *
     * Using this function is preferred over just looking at the cookie because the cookie uses a custom format to save
     * space. This function allows you to work with that format a bit easier.
     *
     * @param key
     * @return string|null
     */
    get(key) {
        // TODO rabbitmq management get_cookie_value() will return a default value for certain fields, but these are mostly UI related and should be in the settings class
        let keyHashCode;
        let value;
        let parsed = this.getAll();

        keyHashCode = this.getShortKey(key);
        value = parsed[keyHashCode];
        if (typeof value === 'undefined') {
            value = null;
        }

        return value;
    }

    /**
     * Set a cookie value
     *
     * The key must be the human readable version and not the hash code
     * The type of value should be either boolean, number, or string
     *
     * @param key
     * @param value
     */
    set(key, value) {
        let parsed = this.getAll() || {};
        let keyHashCode = this.getShortKey(key);

        parsed[keyHashCode] = escape(value);
        this.#data = parsed;
        this._saveCookie();
    }

    /**
     * Remove a value from the cookie
     *
     * The key must be the human readable version and not the hash code
     *
     * @param key
     */
    remove(key) {
        let keyHashCode = this.getShortKey(key);
        delete this.#data[keyHashCode];
    }

    _saveCookie() {
        let cookieValue = this.toString();
        this.cookies.set(CookieWrapper.#COOKIE_NAME, cookieValue);
    }

    /**
     * Get the hash code for a string
     *
     * Try to economise on space since cookies have limited length.
     *
     * @param key {string}
     *
     * @return {string}
     */
    getShortKey(key) {
        let res = Math.abs(hashCode(key) << 16 >> 16);
        res = res.toString(16);
        return res;
    }

    /**
     * Convert string value of the cookie into an object
     *
     * You should prefer using `get` instead of using this function directly. The object returned from this function
     * is difficult to work with directly since the keys that it uses are the has codes rather than a human readable
     * string.
     *
     * @param rawCookieData
     *
     * @return {{}}
     *
     * @see get
     * @see getShortKey
     */
    parse(rawCookieData) {
        let items = rawCookieData.length === 0 ? [] : rawCookieData.split('|');
        let dict = {};
        for (let i in items) {
            let [key,val] = items[i].split(':');
            dict[key] = unescape(val);
        }

        return dict;
    }

    /**
     * Encode the cookie in a custom format that is used to save spave
     *
     * format ${key}:${value}|${key}/${value}|...
     *
     * @return {string}
     */
    toString() {
        return Object.entries(this.#data)
            .map(kv => kv.join(':'))
            .join('|');
    }
}

export default CookieWrapper;