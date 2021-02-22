<template>
  <div>
    <div class="style-control-container">
      <div class="flex" v-for="(style, index) in data" :key="index">
        <el-select
          v-model="style.key"
          :size="size"
          placeholder="请选择"
          filterable
        >
          <el-option
            v-for="(item, index) in styleKeys"
            :key="item + index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <el-input
          v-model="style.value"
          class="input-control"
          :size="size"
        ></el-input>
      </div>
    </div>
    <div class="input-control-footer">
      <el-button
        :size="size"
        circle
        icon="el-icon-plus"
        @click="addStyle"
      ></el-button>
      <el-button
        size="small"
        type="primary"
        style="width: 120px"
        @click="onSubmit"
        >确定</el-button
      >
    </div>
  </div>
</template>
<script>
const styleKeys = [
  "align-content",
  "align-items",
  "align-self",
  "background-attachment",
  "background-clip",
  "background-color",
  "background-image",
  "background-origin",
  "background-position",
  "background-repeat",
  "background-size",
  "background",
  "border-bottom",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-color",
  "border-left",
  "border-radius",
  "border-right",
  "border-style",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-top",
  "border-width",
  "border",
  "bottom",
  "box-shadow",
  "box-sizing",
  "clear",
  "color",
  "column-count",
  "column-gap",
  "column-width",
  "content",
  "cursor",
  "display",
  "flex-basis",
  "flex-direction",
  "flex-flow",
  "flex-grow",
  "flex-shrink",
  "flex-wrap",
  "float",
  "font-size",
  "font-style",
  "font-variant",
  "font-weight",
  "grid",
  "height",
  "justify-content",
  "left",
  "letter-spacing",
  "line-height",
  "list-style-image",
  "list-style-position",
  "list-style-type",
  "list-style",
  "margin-bottom",
  "margin-left",
  "margin-right",
  "margin-top",
  "margin",
  "max-height",
  "max-width",
  "min-height",
  "min-width",
  "mix-blend-mode",
  "opacity",
  "order",
  "outline",
  "overflow-wrap",
  "overflow-x",
  "overflow-y",
  "overflow",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "padding-top",
  "padding",
  "pointer-events",
  "position",
  "resize",
  "right",
  "text-align",
  "text-decoration",
  "text-indent",
  "text-overflow",
  "text-shadow",
  "text-transform",
  "top",
  "transform-origin",
  "transform",
  "transition-delay",
  "transition-duration",
  "transition-property",
  "transition-timing-function",
  "transition",
  "vertical-align",
  "white-space",
  "width",
  "will-change",
  "word-break",
  "word-spacing",
  "z-index"
];
export default {
  name: "style-form",
  props: {
    size: {
      type: String,
      default: "small"
    }
  },
  data() {
    return {
      data: [{ key: "", value: "" }],
      styleKeys
    };
  },
  methods: {
    addStyle() {
      this.data.push({
        key: "",
        value: ""
      });
    },
    onSubmit() {
      const value = this.data.reduce((acc, cur) => {
        if (cur.key && cur.value) {
          acc[cur.key] = cur.value
        }
        return acc
      }, {})
      this.$emit("input", value);
    }
  }
};
</script>
<style scoped>
.flex {
  display: flex;
}
.input-control {
  margin-bottom: 10px;
}
.input-control-footer {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}
</style>
