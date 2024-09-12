// Original code taken from https://github.com/Vendicated/Vencord under GPLv3 license

let wreq;
let cache;

window.webpackChunkdiscord_app.push([[Symbol()], {}, (x) => (wreq = x)]);
window.webpackChunkdiscord_app.pop();
cache = wreq.c;

export const filters = {
    byProps: (...props) =>
        (m) => props.every((p) => m[p] !== void 0),
    byExport: (exportt) => {
        return m => {
            const e = m[exportt];
            if (!e) return false;
            return e;
        };
    }
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

function findByExport(exportt) {
    const result = find(filters.byExport(exportt), { isIndirect: true });
    if (!result || result.error) {
        return handleModuleNotFound("findByExport", exportt);
    }
    return result;
}

window.webpackMagic = {
    findByProps,
    findByExport,
    find
};