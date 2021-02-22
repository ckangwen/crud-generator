import { defineComponent, computed, ref, watch } from '@vue/composition-api';
import SchemaForm from '@ckangwen/schema-form'
import StyleWidget from '@/components/StyleWidget.vue'
import Preview from "./Preview";
import "./CellDialog.css";

const ComponentSchema: Record<string, any> = {
  'el-tag': {
    type: {
      type: 'string',
      title: '类型',
      'ui-widget': 'select',
      enums: ['success', 'info', 'warning', 'danger']
    },
    closable: {
      type: 'boolean',
      title: '是否可关闭'
    },
    'disable-transitions': {
      type: 'boolean',
      title: '是否禁用渐变动画'
    },
    hit: {
      type: 'boolean',
      title: '是否有边框描边'
    },
    color: {
      type: 'string',
      title: '背景色'
    },
    size: {
      type: 'string',
      title: '尺寸',
      'ui-widget': 'select',
      enums: ['medium', 'small', 'mini']
    },
    effect: {
      type: 'string',
      title: '主题',
      'ui-widget': 'select',
      enums: ['dark', 'light', 'plain']
    },
  },
  'el-image': {
    src: {
      title: '图片源',
      type: 'string',
    },
    fit: {
      title: 'fit',
      type: 'string',
      'ui-widget': 'select',
      enums: ['fill', 'contain', 'cover', 'none', 'scale-down']
    },
    lazy: {
      title: '是否开启懒加载',
      type: 'boolean',
      default: false
    },
  },
  'el-switch': {
    value: {
      title: '绑定值',
      type: 'string'
    },
    disabled: {
      title: '是否禁用',
      type: 'boolean',
      default: false
    },
    width: {
      title: 'switch 的宽度',
      type: 'number',
      default: 40
    },
    'active-icon-class': {
      title: 'switch 打开时所显示图标的类名',
      type: 'string',
    },
    'inactive-icon-class': {
      title: 'switch 关闭时所显示图标的类名',
      type: 'string',
    },
    'active-text': {
      title: 'switch 打开时的文字描述',
      type: 'string',
    },
    'inactive-text': {
      title: 'switch 关闭时的文字描述',
      type: 'string',
    },
  }
}

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
  "el-switch": "value"
}

export default defineComponent({
  name: "CellDialog",
  components: {
    Preview,
    SchemaForm
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

    const formSchema = ref<Record<string, any>>({})
    const formValue = ref<Record<string, any>>({})
    const activeName = ref<'Select' | 'Config'>('Select')
    watch(activeName, (val) => {
      if (val === 'Config') {
        const common = {
          class: {
            type: 'string',
            title: 'ClassName'
          },
          style: {
            type: 'style',
            title: 'Style'
          }
        }

        formSchema.value = Object.assign(common, ComponentSchema[scopedSlotPropState.value.componentName])
        console.log(formSchema.value)
      }
    })

    /**
     * 将单元格的值应用到组件的哪个prop
     */
    const componentProps = ref({});

    watch(formValue, (val) => {
      if (val) {
        componentProps.value = val
      }
    })

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
      activeName,
      prop,
      scopedSlotPropState,
      onConfirm,
      onCancel,
      componentProps,
      onComponentNameChange,
      formSchema,
      formValue
    };
  },
  render() {
    return (
      <el-dialog
        title=""
        visible={this.visible}
        {...{ on: { "update:visible": this.onCancel } }}
      >
        <el-tabs type="border-card"  vModel={this.activeName}>
          <el-tab-pane label="Select" name="Select">
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
          <el-tab-pane label="Config" name="Config" class="config-tab">
            <div class="config-title">配置管理</div>
            <SchemaForm
              vModel={this.formValue}
              schema={this.formSchema}
              layout={false}
              formProps={{
                labelWidth: '130px'
              }}
              widgets={{
                style: StyleWidget
              }}
            />
          </el-tab-pane>
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
