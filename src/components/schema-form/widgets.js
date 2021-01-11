import Select from "./widgets/select/index";

const baseMap = {
  checkbox: "el-checkbox",
  button: "el-button",
  row: "el-row",
  col: "el-col",
  form: "el-form",
  formItem: "el-form-item",
  layout: "el-container",
  text: "el-input",
  string: "el-input",
  boolean: "el-switch",
  number: "el-input-number",
  radio: "el-radio",
  select: Select,
  enum: Select
};

export const componentMap = new Map();

Object.keys(baseMap).forEach(key => {
  componentMap.set(key, baseMap[key]);
});
