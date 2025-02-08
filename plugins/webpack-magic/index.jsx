/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import {runtimeHashMessageKey} from "./intlHash.jsx";

let wreq;
let cache;

// Capture Webpack require function
window.webpackChunkdiscord_app.push([[Symbol()], {}, (x) => (wreq = x)]);
window.webpackChunkdiscord_app.pop();
cache = wreq.c;

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function canonicalizeMatch(match) {
    const isString = typeof match === "string";
    let partialCanon = isString ? match : match.source;

    partialCanon = partialCanon.replaceAll(/#{intl::([\w$+/]*)(?:::(\w+))?}/g, (_, key, modifier) => {
        const hashed = modifier === "raw" ? key : runtimeHashMessageKey(key);
        const escaped = escapeRegex(hashed);
        const hasSpecialChars = !/^[a-zA-Z_$]/.test(escaped) || /[+/]/.test(escaped);

        if (hasSpecialChars) {
            return isString
                ? `["${escaped}"]`
                : String.raw`(?:\["${escaped}"\])`;
        }

        return isString ? `.${escaped}` : String.raw`(?:\.${escaped})`;
    });

    if (isString) return partialCanon;

    const canonSource = partialCanon.replaceAll("\\i", String.raw`(?:[A-Za-z_$][\w$]*)`);
    return new RegExp(canonSource, match.flags);
}

const stringMatches = (s, filters) => filters.every(f => {
    if (typeof f === "string") return s.includes(f);

    // Clone regex to avoid mutating original lastIndex
    const clone = new RegExp(f.source, f.flags);
    return clone.test(s);
});

export const filters = {
    byProps: (...props) => (m) => m && props.every(p => Object.hasOwn(m, p)),
    byCode: (...code) => {
        const parsed = code.map(canonicalizeMatch);
        return (m) => {
            if (typeof m !== "function") return false;
            return stringMatches(Function.prototype.toString.call(m), parsed);
        };
    },
};

function handleModuleNotFound(method, ...args) {
    const err = new Error(`webpack.${method} found no module. Filter: ${args}`);
    console.error(err);
    return { error: err.message };
}

function findModule(filter, { isWaitFor = false } = {}) {
    for (const key in cache) {
        const mod = cache[key];
        if (!mod?.exports || !mod.loaded) continue;

        const exports = mod.exports;
        const check = (target) => target && filter(target);

        if (check(exports)) return isWaitFor ? [exports, key] : exports;
        if (check(exports.default)) return isWaitFor ? [exports.default, key] : exports.default;

        if (typeof exports === "object" && !Array.isArray(exports)) {
            for (const nestedKey in exports) {
                if (check(exports[nestedKey])) {
                    return isWaitFor ? [exports[nestedKey, key]] : exports[nestedKey];
                }
            }
        }
    }

    return isWaitFor ? [null, null] : null;
}

export function findByProps(...props) {
    const result = findModule(filters.byProps(...props));
    return result || handleModuleNotFound("findByProps", ...props);
}

export function findByCode(...code) {
    const result = findModule(filters.byCode(...code));
    return result || handleModuleNotFound("findByCode", ...code);
}

window.webpackMagic = {
    findByProps,
    findByCode,
    find: findModule,
};