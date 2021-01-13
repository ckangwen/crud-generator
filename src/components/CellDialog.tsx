import { defineComponent, computed, ref } from '@vue/composition-api';
import Preview from "./Preview";

export type CellDialogProps = {
  row: Record<string, any>;
  column: any;
  visible: boolean;
};
export type CellDialogConfirmType = {
  componentName: string;
  componentProps: Record<string, any>;
  usedProp: string
};

const supportElements = ["el-tag", "el-image", "el-switch", "el-input"]
const tagAndUsedPropMapping: Record<string, any> = {
  span: "__slot__",
  "el-tag": "__slot__",
  "el-image": "src",
  "el-switch": "value",
  "el-input": "value"
}

export default defineComponent({
  name: "CellDialog",
  components: {
    Preview
  },
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
  setup(props: CellDialogProps, ctx) {
    const prop = computed(() => {
      return props.column.property;
    });

    const scopedSlotPropState = ref<{
      componentName: string
      usedProp: string
    }>({
      componentName: "span",
      usedProp: '__slot__'
    });
    const onComponentNameChange = (val: string) => {
      scopedSlotPropState.value.usedProp = tagAndUsedPropMapping[val]
    }

    /**
     * 将单元格的值应用到组件的哪个prop
     */
    const componentProps = ref({});

    const onConfirm = () => {
      ctx.emit("update:visible", !props.visible);
      ctx.emit("confirm", {
        componentName: scopedSlotPropState.value.componentName,
        componentProps: componentProps.value,
        usedProp: scopedSlotPropState.value.usedProp
      });
    };
    const onCancel = () => {
      ctx.emit("update:visible", !props.visible);
    };

    return {
      prop,
      scopedSlotPropState,
      onConfirm,
      onCancel,
      componentProps,
      onComponentNameChange,
    };
  },
  render() {
    return (
      <el-dialog
        title=""
        visible={this.visible}
        {...{ on: { "update:visible": this.onCancel } }}
      >
        <el-tabs type="border-card">
          <el-tab-pane label="Select">
            <div class="flex cross-center main-around">
              <div>选择需要替换称为的组件</div>
              <el-select vModel={this.scopedSlotPropState.componentName} onChange={this.onComponentNameChange}>
                {supportElements.map(item => {
                  return (
                    <el-option key={item} label={item} value={item}></el-option>
                  );
                })}
              </el-select>
            </div>
            <div style="text-align: left;">
              <div>预览</div>
              <Preview
                componentName={this.scopedSlotPropState.componentName}
                componentProps={
                  {
                    ...this.componentProps,
                    [this.scopedSlotPropState.usedProp]: this.row[this.column.property]
                  }
                }
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="Config">配置管理</el-tab-pane>
        </el-tabs>

        <span slot="footer">
          <el-button onClick={this.onCancel}>取 消</el-button>
          <el-button type="primary" onClick={this.onConfirm}>
            确 定
          </el-button>
        </span>
      </el-dialog>
    );
  }
});
