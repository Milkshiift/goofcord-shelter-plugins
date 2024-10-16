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

let wreq;
let cache;

window.webpackChunkdiscord_app.push([[Symbol()], {}, (x) => (wreq = x)]);
window.webpackChunkdiscord_app.pop();
cache = wreq.c;

export const filters = {
    byProps: (...props) =>
        (m) => props.every((p) => m[p] !== void 0),
};

export function handleModuleNotFound(method, ...filter) {
    const errMsg = `webpack.${method} found no module. Filter: ${filter}`;
    console.error(new Error(errMsg));
    return { error: errMsg };
}

function find(filter, { isIndirect = false, isWaitFor = false } = {}) {
    if (typeof filter !== "function") {
        return handleModuleNotFound("find", "Invalid filter function");
    }

    for (const key in cache) {
        const mod = cache[key];
        if (!mod.loaded || !mod?.exports) continue;

        const exports = mod.exports;

        if (filter(exports)) return isWaitFor ? [exports, key] : exports;

        if (exports.default && filter(exports.default)) {
            const found = exports.default;
            return isWaitFor ? [found, key] : found;
        }

        if (typeof exports === "object") {
            for (const nestedKey in exports) {
                if (nestedKey.length > 3) continue;

                const nested = exports[nestedKey];
                if (nested && filter(nested)) {
                    return isWaitFor ? [nested, key] : nested;
                }
            }
        }
    }

    if (!isIndirect) {
        return handleModuleNotFound("find", filter);
    }

    return isWaitFor ? [null, null] : null;
}

function findByProps(...props) {
    const result = find(filters.byProps(...props), { isIndirect: true });
    if (!result || result.error) {
        return handleModuleNotFound("findByProps", ...props);
    }
    return result;
}

window.webpackMagic = {
    findByProps,
    find
};