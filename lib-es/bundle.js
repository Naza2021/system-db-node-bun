import { DeepProxy } from '@qiwi/deep-proxy';
import EventEmitter from 'events';
import { debounce } from 'throttle-debounce';
import path from 'path';
import fs from 'fs';
import { parse, stringify } from 'telejson';

// @ts-nocheck
const createSysDb = (id = "default") => {
    const pathDb = `${path.join(path.resolve(__dirname, "../../"), "tmp", id)}.json`;
    let data = {};
    try {
        data = parse(fs.readFileSync(pathDb, { encoding: "utf-8" }) ?? "null");
    }
    catch { }
    const eventEmitter = new EventEmitter();
    const emitChange = debounce(1, () => eventEmitter.emit("change"));
    const db = new DeepProxy(data, ({ trapName, value, DEFAULT, PROXY }) => {
        if (trapName === "set") {
            emitChange();
        }
        if (trapName === "get") {
            if (typeof value === "object" && value !== null) {
                return PROXY;
            }
        }
        return DEFAULT;
    });
    eventEmitter.addListener("change", () => {
        try {
            fs.writeFileSync(pathDb, stringify(data), { encoding: "utf-8" });
        }
        catch (e) {
            console.error(e);
        }
    });
    return db;
};

export { createSysDb };
//# sourceMappingURL=bundle.js.map
