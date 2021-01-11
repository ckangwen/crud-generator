<template>
  <el-dialog title="收货地址" :visible.sync="visible">
    <el-tabs type="border-card">
      <el-tab-pane label="Select">
        <div class="flex cross-center main-around">
          <div>选择需要替换称为的组件</div>
          <el-select v-model="supportedTagsState.value.tag">
            <el-option
              v-for="(item, index) in supportedTagsState.enums"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </div>
        <div class="flex dir-top">
          <div>预览</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Config">配置管理</el-tab-pane>
    </el-tabs>

    <span slot="footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from "@vue/composition-api";

export default defineComponent({
  props: {
    row: {
      type: Object,
      required: true
    },
    column: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    //

    const prop = computed(() => {
      return props.column.property;
    });

    const supportedTagsState = ref({
      enums: ["el-tag", "el-image", "el-switch", "el-input"],
      usedProp: {
        span: "__slot__",
        "el-tag": "__slot__",
        "el-image": "src",
        "el-switch": "value",
        "el-input": "value"
      },
      value: {
        tag: "span",
        prop: "__slot__"
      }
    });

    const onConfirm = () => {
      ctx.emit("update:visible", !props.visible);
    };
    const onCancel = () => {
      ctx.emit("update:visible", !props.visible);
    };

    return {
      prop,
      supportedTagsState,
      onConfirm,
      onCancel
    };
  }
});
</script>
