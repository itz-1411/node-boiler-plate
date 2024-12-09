import fs   from 'fs';
import path from 'path';

Array.prototype.cycle = function (str) {
    const i = this.indexOf(str);
    if (i === -1) return undefined;
    return this[(i + 1) % this.length];
};

Array.prototype.sixCount = function () {
    return this.filter((element) => element == 6).length;
};

Array.prototype.first = function () {
    return this.find((e) => true);
};

Array.prototype.last = function () {
    return this[this.length - 1];
}

// Object.prototype.pluck = function (keys) {
//     const currentObj  = this;
//     return Object.fromEntries(
//         keys
//         .filter(key => key in currentObj)
//         .map(key => [key, currentObj[key]])
//     );
// }

export const pluckObjectValues = function (object, keys) {
    return Object.fromEntries(
        keys
        .filter(key => key in object)
        .map(key => [key, object[key]])
    );
}

export let iterateObject  = function* (obj) {
    for (let k in obj) yield [k, obj[k]];
};

export const randomNumber = (min = 10, max = 20) => Math.random() * (max - min) + min;
export const randomString = (length = 10) => new Array(length).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(x => (function(chars) { let umax = Math.pow(2, 32), r = new Uint32Array(1), max = umax - (umax % chars.length); do { crypto.getRandomValues(r); } while(r[0] > max); return chars[r[0] % chars.length]; })(x)).join('');
export const fileExists   = async path => !!(await fs.promises.stat(path).catch(e => false));
export const toHostUrl    = (req, url) => req.protocol + '://' + req.get('host') + url
export const toBoolean    = (dataStr) => !!(dataStr?.toLowerCase?.() === 'true' || dataStr === true || Number.parseInt(dataStr, 10) === 0);

export function toSnakeCase(str) {
    str    = str || '';
    str    = str[0].toLowerCase() + str.slice(1, str.length).replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    str    = str.replaceAll(" _", "_")
    return str.replaceAll(" ", "_").replace(/(^_*|_*$)/g, '');;
}

export function rootPath() {
    // let rootPath = process.env.PWD;
    // return rootPath.replace('/bin', '');
    return path.resolve()
}

export function getPath(path = false) {
    if (path) {
        return rootPath() + '/' + path;
    }
    return rootPath();
}

export function timeConversion(millisec) {
    const seconds = (millisec / 1000).toFixed(1);
    const minutes = (millisec / (1000 * 60)).toFixed(1);
    const hours   = (millisec / (1000 * 60 * 60)).toFixed(1);
    const days    = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

    if (seconds < 60) {
        return seconds + " Sec";
    } else if (minutes < 60) {
        return minutes + " Min";
    } else if (hours < 24) {
        return hours + " Hrs";
    } else {
        return days + " Days"
    }
}

export default {
    rootPath, getPath, toBoolean, iterateObject, toSnakeCase, fileExists, toHostUrl, randomNumber, randomString
};
