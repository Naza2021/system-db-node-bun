// @ts-nocheck
import { DeepProxy } from "@qiwi/deep-proxy";
import EventEmitter from "events";
import fs from "fs";
import path from "path";
import { parse, stringify } from "telejson";
import { debounce } from "throttle-debounce";

export const createSysDb = <T extends Record<string, any>>(
  id?: string = "default"
) => {
  const pathDb = `${path.join(
    path.resolve(__dirname, process.env.ENV === "local" ? "../../" : "./"),
    "tmp",
    id
  )}.json`;

  let data: T = {};

  try {
    data = parse(fs.readFileSync(pathDb, { encoding: "utf-8" }) ?? "null");
  } catch {}

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
    } catch (e) {
      console.error(e);
    }
  });

  return db;
};
