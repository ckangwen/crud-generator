<template>
  <div
    class="wen-crud"
    v-loading="loading"
    :element-loading-text="loadingOptions && loadingOptions.text"
    :element-loading-spinner="loadingOptions && loadingOptions.spinner"
    :element-loading-background="loadingOptions && loadingOptions.background"
  >
    <div class="wen-crud__header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="wen-crud__body">
      <el-table
        ref="elTable"
        :data="crudData"
        v-bind="tableProps"
        v-on="events"
      >
        <!-- 可展开的 -->
        <el-table-column v-if="expand" type="expand">
          <template slot-scope="props">
            <!-- 自定义可展开内容 -->
            <template v-if="$scopedSlots['expand']">
              <vnodes :render="$scopedSlots['expand']({ ...props, columns })" />
            </template>
            <template v-else>
              <el-form v-bind="expandOptions">
                <el-form-item
                  v-for="(item, index) in columns"
                  :key="index"
                  :label="item.label"
                  >{{ props.row[item.prop] }}</el-form-item
                >
              </el-form>
            </template>
          </template>
        </el-table-column>

        <!-- 多选操作 -->
        <el-table-column
          v-if="selection"
          type="selection"
          v-bind="typeof selection === 'boolean' ? {} : selection"
        />

        <!-- 表格首列之前显示索引 -->
        <el-table-column v-if="index" type="index" :index="computedIndex" />

        <!-- 遍历columns，渲染行数据 -->
        <el-table-column
          v-for="(item, index) in computedColumn"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          v-bind="item.attrs"
        >
          <!-- 自定义表头 -->
          <template slot="header" slot-scope="scope">
            <!-- TODO 通过 thead-content 渲染表头，传入当前 -->
            <template v-if="theadContent">
              <vnodes :render="theadContent" :props="{ ...scope, ...item }" />
            </template>
            <span v-else>{{ item.label }}</span>
          </template>

          <!-- 自定义单元格 -->
          <template slot-scope="scope">
            <div
              class="cell-wrapper"
              @contextmenu.prevent="handleRowContextMenu(scope)"
            >
              <!-- 通过cell-content渲染单元格数据 -->
              <template v-if="cellContent">
                <vnodes :render="cellContent" :props="{ ...scope, ...item }" />
              </template>
              <template v-else-if="$scopedSlots[item.prop]">
                <!-- 作用域插槽 -->
                <slot :name="item.prop" v-bind:scope="scope"></slot>
              </template>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </div>
          </template>
          <!-- 多级表头 -->
          <template v-if="item.children">
            <mutli-column
              v-for="(child, idx) in item.children || []"
              :key="idx"
              :item="child"
            />
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column
          v-if="showDelete || deleteContent || showUpdate || updateContent"
          label="操作"
          v-bind="extraColumnProps"
        >
          <!-- 删除操作 -->
          <template slot-scope="scope">
            <template v-if="showDelete || deleteContent">
              <!-- 通过delete-content 自定义删除组件 -->
              <template v-if="deleteContent">
                <vnodes
                  :render="deleteContent"
                  :props="scope"
                  :on="{
                    click: () => handleRemoveConfirm(scope.$index, scope.row)
                  }"
                />
              </template>
              <el-button
                v-else
                type="danger"
                size="mini"
                @click="handleRemoveConfirm(scope.$index, scope.row)"
              >
                删除
              </el-button>
            </template>

            <!-- 编辑操作 -->
            <template v-if="showUpdate || updateContent">
              <template v-if="updateContent">
                <vnodes
                  :render="updateContent"
                  :props="scope"
                  :on="{
                    click: () => openUpdateDialog(scope)
                  }"
                />
              </template>
              <el-button
                v-else
                type="primary"
                size="mini"
                @click="openUpdateDialog(scope)"
              >
                编辑
              </el-button>
            </template>

            <!-- 提供插槽，展示其他的内容 -->
            <slot name="actions" v-bind:scope="scope"></slot>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="wen-crud-pagination-wrapper" v-if="pagination">
        <el-pagination
          v-bind="typeof pagination === 'boolean' ? {} : pagination"
          @size-change="handlePaginationSizeChange"
          @current-change="handlePaginationCurrentChange"
          @prev-click="handlePaginationPrevClick"
          @next-click="handlePaginationNextClick"
        >
        </el-pagination>
      </div>

      <!-- 模态框 -->
      <el-dialog
        v-if="dialogVisible"
        :title="dialogOptions.title || '操作'"
        v-bind="dialogOptions"
        :visible.sync="dialogVisible"
      >
        <el-form
          ref="form"
          :model="dialogFormData"
          :rules="rules"
          label-width="100px"
        >
          <el-row>
            <template v-for="(value, index) in columns">
              <el-col :key="value.prop">
                <el-form-item :label="value.label" :prop="value.prop">
                  <template v-if="dialogFormItemRender">
                    <vnodes
                      :render="dialogFormItemRender"
                      :props="{ ...value, index, data: dialogFormData }"
                      :on="{
                        input: val => (dialogFormData[value.prop] = val)
                      }"
                    />
                  </template>
                  <el-input
                    v-else
                    v-model="dialogFormData[value.prop]"
                  ></el-input>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </el-form>
        <div slot="footer">
          <el-button @click="onDialogCancel">{{
            dialogOptions.cancelText || "取消"
          }}</el-button>
          <el-button type="primary" @click="onDialogSave">{{
            dialogOptions.confirmText || "确认"
          }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import VnodesMixin from "./mixins/vnodes";
import TableMixin from "./mixins/table";
import DataMixin from "./mixins/data";
import PaginationMixin from "./mixins/pagination";
import DialogMixin from "./mixins/dialog";
export default {
  mixins: [VnodesMixin, TableMixin, DataMixin, PaginationMixin, DialogMixin]
};
</script>
