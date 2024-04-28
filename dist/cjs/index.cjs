'use strict';

var deepProxy = require('@qiwi/deep-proxy');
var EventEmitter = require('events');
var fs = require('fs');
var path = require('path');
var telejson = require('telejson');
var throttleDebounce = require('throttle-debounce');

// @ts-nocheck
const createSysDb = (id = "default") => {
    const pathDb = `${path.join(path.resolve(__dirname, "../../"), "tmp", id)}.json`;
    let data = {};
    try {
        data = telejson.parse(fs.readFileSync(pathDb, { encoding: "utf-8" }) ?? "null");
    }
    catch { }
    const eventEmitter = new EventEmitter();
    const emitChange = throttleDebounce.debounce(1, () => eventEmitter.emit("change"));
    const db = new deepProxy.DeepProxy(data, ({ trapName, value, DEFAULT, PROXY }) => {
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
            fs.writeFileSync(pathDb, telejson.stringify(data), { encoding: "utf-8" });
        }
        catch (e) {
            console.error(e);
        }
    });
    return db;
};

exports.createSysDb = createSysDb;
//# sourceMappingURL=index.cjs.map
