import Vue from "vue";
import {
  defineComponent,
  reactive,
  ref,
  watch,
  computed
} from "@vue/composition-api";
import useTable, { fakerDataMap } from "@/use/useTable";

import Crud from "@/components/crud/crud.vue";
import CellDialog, { CellDialogConfirmType } from "@/components/CellDialog";
import Preview from "@/components/Preview";

import styles from "./index.module.scss";

export type CellSlotType = {
  [K in string]: {
    actived: boolean;
    componentName: string;
    componentProps: Record<string, any>;
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
      default: false
    }
  },
  setup(props, ctx) {
    const dialogForm = ref({
      text: "",
      action: ""
    });
    const buttonClickAction = ref([
      { label: "唤起弹窗", value: "dialog" },
      { label: "页面跳转", value: "link" },
      { label: "无操作", value: "none" }
    ]);
    const dialogState = ref({
      visible: false,
      onConfirm() {
        ctx.emit("update:visible", !props.visible);
        ctx.emit("confirm", {
          text: dialogForm.value.text,
          type: dialogForm.value.action
        });
      },
      onCancel() {
        ctx.emit("update:visible", !props.visible);
      }
    });
    return {
      dialogState,
      dialogForm,
      buttonClickAction
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
              {this.buttonClickAction.map(item => {
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
  }
});

const CreateColumnDialog = defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const createColumnState = reactive({
      formData: {
        label: "",
        prop: "",
        mockType: "string"
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
      }
    });
    const fakerTypes = Object.keys(fakerDataMap);

    return {
      createColumnState,
      fakerTypes
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
              {this.fakerTypes.map(item => {
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
  }
});

export default defineComponent({
  components: {
    Crud,
    CrudActionDialog,
    CreateColumnDialog
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
        deep: true
      }
    );

    const onColumnKeyChange = (val: any) => {
      columns.value = columns.value.filter(item => {
        return val.indexOf(item.prop) > -1;
      });
    };

    const createColumnState = reactive({
      visible: false,
      onConfirm(data: any) {
        Vue.set(columnMock.value, data.prop, data.mockType);
        columns.value.push(data);
      }
    });
    const tableProps = {
      "cell-class-name": ({ row, column, rowIndex, columnIndex }: any) => {
        row.$index = rowIndex;
        column.$index = columnIndex;
      }
    };

    const cellContentState = ref({
      prop: "",
      row: {},
      column: {},
      visible: false
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
      val => {
        cellSlotState.value = val.reduce(
          (acc: Record<string, any>, cur: string) => {
            acc[cur] = {
              actived: false,
              componentName: "span",
              componentProps: {
                __slot__: ""
              }
            };
            return acc;
          },
          {}
        );
      },
      {
        immediate: true
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
                  cellSlotState.value[column.property].componentProps
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
    };

    const actionButtonState = ref<ActionButtonState[]>([]);
    const actionColumnState = ref({
      visible: false,
      onConfirm({ text, action }: ActionButtonState) {
        actionButtonState.value.push({
          text,
          action
        });
      }
    });
    /**
     * 渲染操作列表头
     */
    const actionHeadContent = () => {
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
            {actionButtonState.value.map(item => {
              return <el-button type="text">{item.text}</el-button>;
            })}
          </div>
        );
      }
    };

    return {
      columns,
      tableData,
      columnKeys,
      fetch,
      fakerTypes,
      onColumnKeyChange,
      createColumnState,
      onCellDblclick,
      cellContentState,
      tableProps,
      onUpdateCellComponent,
      cellScopedSlots,
      actionScopedSlots,
      actionHeadContent,
      actionColumnState
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
              {this.columns.map(item => {
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
            <el-dropdown>
              <el-button
                size="small"
                icon="el-icon-more"
                circle={true}
              ></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>预览</el-dropdown-item>
                <el-dropdown-item>导出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

        <div>
          <Crud
            {...{
              on: {
                "cell-dblclick": this.onCellDblclick
              }
            }}
            columns={this.columns}
            data={this.tableData}
            tableProps={this.tableProps}
            actionHeadContent={this.actionHeadContent}
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
              }
            }
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
              }
            }
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
              }
            }
          }}
        />
      </div>
    );
  }
});
