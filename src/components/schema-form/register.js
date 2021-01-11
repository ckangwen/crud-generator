import { componentMap } from "./widgets";

export const registerWidget = (type, component, overwrite = false) => {
  if (componentMap.has(type) && !overwrite) {
    return;
    // throw new Error(`${type}类型的字段已存在`);
  }

  componentMap.set(type, component);
};
