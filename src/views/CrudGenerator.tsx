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

export default defineComponent({
  components: {
    Crud
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
          columns.value.push(createColumnState.formData);

          Vue.set(
            columnMock.value,
            createColumnState.formData.prop,
            createColumnState.formData.mockType
          );
        }
        createColumnState.visible = !createColumnState.visible;
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
    const cellSlot = ref<
      {
        [K in string]: {
          actived: boolean;
          componentName: string;
          componentProps: Record<string, any>;
        };
      }
    >({});
    watch(
      columnKeys,
      val => {
        cellSlot.value = val.reduce((acc: Record<string, any>, cur: string) => {
          acc[cur] = {
            actived: false,
            componentName: "span",
            componentProps: {
              __slot__: ""
            }
          };
          return acc;
        }, {});
      },
      {
        immediate: true
      }
    );
    const onUpdateCellComponent = (data: CellDialogConfirmType) => {
      cellSlot.value[cellContentState.value.prop].actived = true;
      cellSlot.value[cellContentState.value.prop].componentName =
        data.componentName;
      cellSlot.value[cellContentState.value.prop].componentProps =
        data.componentProps;
    };
    const crudScopedSlots = computed(() =>
      columnKeys.value.reduce((acc: Record<string, any>, cur: string) => {
        acc[cur] = ({ scope }: any) => {
          const { row, column } = scope;
          if (cellSlot.value[column.property].actived) {
            return (
              <Preview
                componentName={cellSlot.value[column.property].componentName}
                componentProps={cellSlot.value[column.property].componentProps}
              />
            );
          }
          return <span>{row[column.property]}</span>;
        };
        return acc;
      }, {})
    );

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
      crudScopedSlots
    };
  },
  render() {
    return (
      <div>
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
            slot="reference"
            size="mini"
            icon="el-icon-circle-plus-outline"
            circle={true}
            style="margin-left: 10px;transition: all .3s;"
            onClick={this.createColumnState.create}
          ></el-button>
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
            cellContent={this.cellContent}
            scopedSlots={this.crudScopedSlots}
          ></Crud>
        </div>
        <el-dialog
          visible={this.createColumnState.visible}
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
            <el-form-item label="Label" prop="label">
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
            <el-form-item label="Prop" prop="prop">
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

        <CellDialog
          visible={this.cellContentState.visible}
          row={this.cellContentState.row}
          column={this.cellContentState.column}
          {...{
            on: {
              "update:visible": () => {
                this.cellContentState.visible = !this.cellContentState.visible;
              }
            }
          }}
          onConfirm={this.onUpdateCellComponent}
        />
      </div>
    );
  }
});
