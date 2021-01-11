import { defineComponent, computed, ref } from "@vue/composition-api";
import Preview from "./Preview";

export type CellDialogProps = {
  row: Record<string, any>;
  column: any;
  visible: boolean;
};
export type CellDialogConfirmType = {
  componentName: string;
  componentProps: Record<string, any>;
};

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

    const supportedTagsState = ref<{
      tagEnums: string[];
      propEnums: Record<string, any>;
      componentName: string;
    }>({
      tagEnums: ["el-tag", "el-image", "el-switch", "el-input"],
      propEnums: {
        span: "__slot__",
        "el-tag": "__slot__",
        "el-image": "src",
        "el-switch": "value",
        "el-input": "value"
      },
      componentName: "span"
    });
    /**
     * 将单元格的值应用到组件的哪个prop
     */
    const componentProps = computed(() => {
      return {
        [supportedTagsState.value.propEnums[
          supportedTagsState.value.componentName
        ]]: props.row[prop.value]
      };
    });

    const onConfirm = () => {
      ctx.emit("update:visible", !props.visible);
      ctx.emit("confirm", {
        componentName: supportedTagsState.value.componentName,
        componentProps: componentProps.value
      });
    };
    const onCancel = () => {
      ctx.emit("update:visible", !props.visible);
    };

    return {
      prop,
      supportedTagsState,
      onConfirm,
      onCancel,
      componentProps
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
              <el-select vModel={this.supportedTagsState.componentName}>
                {this.supportedTagsState.tagEnums.map(item => {
                  return (
                    <el-option key={item} label={item} value={item}></el-option>
                  );
                })}
              </el-select>
            </div>
            <div style="text-align: left;">
              <div>预览</div>
              <Preview
                componentName={this.supportedTagsState.componentName}
                componentProps={this.componentProps}
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
