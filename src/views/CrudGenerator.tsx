import Vue from "vue";
import {
  defineComponent,
  reactive,
  ref,
  watch,
  computed,
} from "@vue/composition-api";
import useTable, { fakerDataMap } from "@/use/useTable";

import Crud from "@ckangwen/crud";
import CellDialog, { CellDialogConfirmType } from "@/components/CellDialog";
import Preview from "@/components/Preview";
import Codemirror from '@/components/codemirror.vue'
import copy from 'clipboard-copy'

import styles from "./index.module.scss";
import { generateSFC, SlotType, generateCode } from '../lib/generator.sfc';
import { Message } from 'element-ui';

export type CellSlotType = {
  [K in string]: {
    actived: boolean;
    componentName: string;
    componentProps: Record<string, any>;
    usedProp: string
  };
};
type ActionButtonTypeEnums = "dialog" | "link" | "none";
export type ActionButtonState = {
  text: string;
  action: ActionButtonTypeEnums;
};

const CrudActionDialog = defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const dialogForm = ref({
      text: "",
      action: "",
    });
    const buttonClickAction = ref([
      { label: "唤起弹窗", value: "dialog" },
      { label: "页面跳转", value: "link" },
      { label: "无操作", value: "none" },
    ]);
    const dialogState = ref({
      visible: false,
      onConfirm() {
        ctx.emit("update:visible", !props.visible);
        ctx.emit("confirm", {
          text: dialogForm.value.text,
          type: dialogForm.value.action,
        });
      },
      onCancel() {
        ctx.emit("update:visible", !props.visible);
      },
    });
    return {
      dialogState,
      dialogForm,
      buttonClickAction,
    };
  },
  render() {
    return (
      <el-dialog
        visible={this.visible}
        placement="right"
        title="添加表格操作列的按钮"
        width="400px"
        {...{ on: { "update:visible": this.dialogState.onCancel } }}
      >
        <el-form
          labelPosition="left"
          size="small"
          labelWidth="80px"
          onInput={() => {
            //
          }}
        >
          <el-form-item label="按钮文本" prop="text">
            <el-input
              style="width: 200px;"
              vModel={this.dialogForm.text}
              placeholder="按钮文本"
            ></el-input>
          </el-form-item>
          <el-form-item label="点击操作" prop="type">
            <el-select style="width: 200px;" vModel={this.dialogForm.action}>
              {this.buttonClickAction.map((item) => {
                return (
                  <el-option
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  ></el-option>
                );
              })}
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              onClick={this.dialogState.onCancel}
            >
              取消
            </el-button>
            <el-button
              type="primary"
              size="mini"
              onClick={this.dialogState.onConfirm}
            >
              确定
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    );
  },
});

const CreateColumnDialog = defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const createColumnState = reactive({
      formData: {
        label: "",
        prop: "",
        mockType: "string",
      },
      visible: false,
      create() {
        if (
          createColumnState.formData.label &&
          createColumnState.formData.prop &&
          createColumnState.formData.mockType
        ) {
          ctx.emit("confirm", createColumnState.formData);
        }
        ctx.emit("update:visible", !createColumnState.visible);
      },
    });
    const fakerTypes = Object.keys(fakerDataMap);

    return {
      createColumnState,
      fakerTypes,
    };
  },
  render() {
    return (
      <el-dialog
        visible={this.visible}
        placement="right"
        title="添加新的表格列"
        width="400px"
        {...{ on: { "update:visible": this.createColumnState.create } }}
      >
        <el-form
          labelPosition="left"
          size="small"
          labelWidth="60px"
          onInput={() => {
            //
          }}
        >
          <el-form-item label="列名" prop="label">
            <el-input
              style="width: 200px;"
              vModel={this.createColumnState.formData.label}
              placeholder="label"
            ></el-input>
          </el-form-item>
          <el-form-item label="Mock" prop="mockType">
            <el-select
              style="width: 200px;"
              vModel={this.createColumnState.formData.mockType}
            >
              {this.fakerTypes.map((item) => {
                return (
                  <el-option key={item} label={item} value={item}></el-option>
                );
              })}
            </el-select>
          </el-form-item>
          <el-form-item label="列属性" prop="prop">
            <el-input
              style="width: 200px;"
              vModel={this.createColumnState.formData.prop}
              placeholder="prop"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini">
              取消
            </el-button>
            <el-button
              type="primary"
              size="mini"
              onClick={this.createColumnState.create}
            >
              确定
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    );
  },
});

const CodePreview = defineComponent({
  name: 'CodePreview',
  components: {
    Codemirror
  },
  props: {
    code: String,
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const onClose = () => {
      ctx.emit('update:visible', !props.visible)
    }
    const onCopy = () => {
      if (!props.code) {
        Message({
          type: 'warning',
          message: '代码为空'
        })
        return
      }
      Message({
        type: 'success',
        message: '代码复制成功'
      })
      copy(props.code)
    }

    return {
      onClose,
      onCopy
    }
  },
  render() {
    return (
      <el-dialog
        visible={this.visible}
        placement="right"
        title="代码"
        width="80%"
        {...{ on: { "update:visible": this.onClose } }}
      >
        <Codemirror code={this.code} />
        <el-button style="margin-top: 20px; width: 120px" type="primary" size="small" onClick={this.onCopy}>复制</el-button>
      </el-dialog>
    )
  }
})

export default defineComponent({
  components: {
    Crud,
    CrudActionDialog,
    CreateColumnDialog,
    CodePreview
  },
  setup() {
    const { columns, columnKeys, fetch, columnMock } = useTable();
    const tableData = ref<any[]>([]);
    const fakerTypes = Object.keys(fakerDataMap);
    watch(
      columns,
      () => {
        fetch("/table/list", {}).then((res: any) => {
          tableData.value = res.data.list;
        });
      },
      {
        immediate: true,
        deep: true,
      }
    );

    const onColumnKeyChange = (val: any) => {
      columns.value = columns.value.filter((item) => {
        return val.indexOf(item.prop) > -1;
      });
    };

    const createColumnState = reactive({
      visible: false,
      onConfirm(data: any) {
        Vue.set(columnMock.value, data.prop, data.mockType);
        columns.value.push({
          label: data.label,
          prop: data.prop
        });
      },
    });
    const tableProps = {
      "cell-class-name": ({ row, column, rowIndex, columnIndex }: any) => {
        row.$index = rowIndex;
        column.$index = columnIndex;
      },
    };

    const cellContentState = ref({
      prop: "",
      row: {},
      column: {},
      visible: false,
    });
    const onCellDblclick = (row: any, col: any) => {
      cellContentState.value.visible = true;
      cellContentState.value.prop = col.property;
      cellContentState.value.row = row;
      cellContentState.value.column = col;
    };
    const cellSlotState = ref<CellSlotType>({});

    /**
     * 表格列增减之后，需要添加或删除对应列的插槽状态
     */
    watch(
      columnKeys,
      (val) => {
        cellSlotState.value = val.reduce(
          (acc: Record<string, any>, cur: string) => {
            console.log(cellSlotState.value)
            if (cellSlotState.value[cur] && cellSlotState.value[cur].actived) {
              acc[cur] = cellSlotState.value[cur]
            } else {
              acc[cur] = {
                actived: false,
                componentName: "span",
                usedProp: '__slot__',
                componentProps: {},
              };
            }
            return acc;
          },
          {}
        );
      },
      {
        immediate: true,
      }
    );

    /**
     * crud组件的单元格作用域插槽列表
     * 如果编辑了该列，则更新该列展示的组件类型
     */
    const cellScopedSlots = computed(() =>
      columnKeys.value.reduce((acc: Record<string, any>, cur: string) => {
        acc[cur] = ({ scope }: any) => {
          const { row, column } = scope;
          if (!cellSlotState.value[column.property]) return;
          if (cellSlotState.value[column.property].actived) {
            return (
              <Preview
                componentName={
                  cellSlotState.value[column.property].componentName
                }
                componentProps={
                  {
                    [cellSlotState.value[column.property].usedProp]: row[column.property],
                    ...cellSlotState.value[cellContentState.value.prop].componentProps
                  }
                }
              />
            );
          }
          return <span>{row[column.property]}</span>;
        };
        return acc;
      }, {})
    );

    /**
     * 更新单元格插槽的状态
     */
    const onUpdateCellComponent = (data: CellDialogConfirmType) => {
      cellSlotState.value[cellContentState.value.prop].actived = true;
      cellSlotState.value[cellContentState.value.prop].componentName =
        data.componentName;
      cellSlotState.value[cellContentState.value.prop].componentProps =
        data.componentProps;
      cellSlotState.value[cellContentState.value.prop].usedProp = data.usedProp
    };

    const actionButtonState = ref<ActionButtonState[]>([]);
    const actionColumnState = ref({
      visible: false,
      onConfirm({ text, action }: ActionButtonState) {
        actionButtonState.value.push({
          text,
          action,
        });
      },
    });
    /**
     * 渲染操作列表头
     */
    const extraHeadContent = () => {
      return (
        <div>
          操作
          <el-button
            slot="reference"
            size="mini"
            icon="el-icon-circle-plus-outline"
            circle={true}
            style="margin-left: 10px;transition: all .3s;"
            onClick={() => {
              actionColumnState.value.visible = !actionColumnState.value
                .visible;
            }}
          ></el-button>
        </div>
      );
    };
    /**
     * 操作列插槽
     */
    const actionScopedSlots = {
      actions: () => {
        return (
          <div>
            <el-button type="text">添加</el-button>
            {actionButtonState.value.map((item) => {
              return <el-button type="text">{item.text}</el-button>;
            })}
          </div>
        );
      },
    };

    /**
     * 导出为文件
     */
    const exportAsFile = () => {
      const slots: SlotType[] = Object.keys(cellSlotState.value).map(key => {
        return {
          name: key,
          tag: cellSlotState.value[key].componentName,
          mainProp: cellSlotState.value[key].usedProp,
          componentProps: cellSlotState.value[key].componentProps
        }
      })

      generateSFC({
        slots,
        componentProps: {
          column: columns.value
        },
      })
    }

    const codePreviewState = ref({
      visible: false,
      code: ''
    })

    const getCode = () => {
      const slots: SlotType[] = Object.keys(cellSlotState.value).map(key => {
        return {
          name: key,
          tag: cellSlotState.value[key].componentName,
          mainProp: cellSlotState.value[key].usedProp,
          componentProps: cellSlotState.value[key].componentProps
        }
      })

      const code = generateCode({
        slots,
        componentProps: {
          column: columns.value
        },
      })
      codePreviewState.value.code = code
      return code
    }


    const handleCommand = (command: string) => {
      if (command === 'export') {
        exportAsFile()
      }
      if (command === 'code') {
        getCode()
        codePreviewState.value.visible = true
      }
      if (command === 'message') {
        const code = getCode()
        window.parent.postMessage({
          cmd: 'writeFile',
          data: {
            code: code,
            fileName: `${Date.now()}.vue`
          }
        }, '*')
      }
    }

    return {
      columns,
      tableData,
      columnKeys,
      fetch,
      fakerTypes,
      onColumnKeyChange,
      createColumnState,
      onCellDblclick,
      cellSlotState,
      cellContentState,
      tableProps,
      onUpdateCellComponent,
      cellScopedSlots,
      actionScopedSlots,
      extraHeadContent,
      actionColumnState,
      handleCommand,
      codePreviewState
    };
  },
  render() {
    return (
      <div class={styles["crud-generator-container"]}>
        <div
          class={`flex cross-center main-between ${styles["crud-generator-top"]}`}
        >
          <div class="flex cross-center">
            <el-checkbox-group
              vModel={this.columnKeys}
              onChange={this.onColumnKeyChange}
            >
              {this.columns.map((item) => {
                return (
                  <el-checkbox
                    key={item.prop}
                    label={item.prop}
                    value={item.prop}
                  >
                    {item.label}
                  </el-checkbox>
                );
              })}
            </el-checkbox-group>

            <el-button
              size="mini"
              icon="el-icon-circle-plus-outline"
              circle={true}
              style="margin-left: 10px;transition: all .3s;"
              onClick={() => {
                this.createColumnState.visible = !this.createColumnState
                  .visible;
              }}
            ></el-button>
          </div>
          <div>
            <el-dropdown onCommand={this.handleCommand} trigger="click">
              <el-button
                size="small"
                icon="el-icon-more"
                circle={true}
              ></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="code">查看代码</el-dropdown-item>
                <el-dropdown-item  command="export">导出</el-dropdown-item>
                <el-dropdown-item  command="message">postMessage</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

        <div>
          <Crud
            {...{
              on: {
                "cell-dblclick": this.onCellDblclick,
              },
            }}
            columns={this.columns}
            data={this.tableData}
            tableProps={this.tableProps}
            extraHeadContent={this.extraHeadContent}
            scopedSlots={{ ...this.cellScopedSlots, ...this.actionScopedSlots }}
          ></Crud>
        </div>

        <CreateColumnDialog
          visible={this.createColumnState.visible}
          onConfirm={this.createColumnState.onConfirm}
          {...{
            on: {
              "update:visible": () => {
                this.createColumnState.visible = !this.createColumnState
                  .visible;
              },
            },
          }}
        />
        <CrudActionDialog
          visible={this.actionColumnState.visible}
          onConfirm={this.actionColumnState.onConfirm}
          {...{
            on: {
              "update:visible": () => {
                this.actionColumnState.visible = !this.actionColumnState
                  .visible;
              },
            },
          }}
        />

        <CellDialog
          visible={this.cellContentState.visible}
          row={this.cellContentState.row}
          column={this.cellContentState.column}
          onConfirm={this.onUpdateCellComponent}
          {...{
            on: {
              "update:visible": () => {
                this.cellContentState.visible = !this.cellContentState.visible;
              },
            },
          }}
        />
        <CodePreview
          visible={this.codePreviewState.visible}
          code={this.codePreviewState.code}
          {...{
            on: {
              "update:visible": () => {
                this.codePreviewState.visible = !this.codePreviewState.visible;
              },
            },
          }}
        />
      </div>
    );
  },
});
