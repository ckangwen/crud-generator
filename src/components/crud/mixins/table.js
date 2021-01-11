export default {
  props: {
    /* el-table的props */
    tableProps: Object,
    /* 如果是boolean，表示启用多选模式，如果是一个对象，表示多选列的props */
    selection: [Boolean, Object],
    /* 如果是boolean，表示启用详细模式，如果是一个数组，表示详细区域需要展示的列 */
    expand: [Array, Boolean],
    loading: Boolean,
    loadingOptions: Boolean,
    /* 详细区域的props */
    expandOptions: Object,
    /* 额外的列的props */
    extraColumnProps: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * 如果是boolean，表示启用索引
     * 如果是一个Function，表示自定义索引,它提供当前行的行号（从 0 开始）作为参数，返回值将作为索引展示
     * 该属性传入数字时，将作为索引的起始值
     */
    index: [Function, Boolean, Number],
    /**
     * 用于自定义渲染表头数据
     * 第一个参数为渲染函数
     * 剩余参数为当前列的表头信息和位置索引(同el-table的header插槽)$index, column
     */
    theadContent: Function,
    /**
     * 用于自定义渲染行数据
     * 第一个参数为渲染函数
     * 剩余参数为row, $index, label, prop
     */
    cellContent: Function
  },
  data() {
    return {
      events: {}
    };
  },
  computed: {
    computedColumn() {
      if (
        Array.isArray(this.expand) &&
        this.expand.length < this.columns.length
      ) {
        return this.columns
          .map(item => {
            if (this.expand.indexOf(item.prop) > -1) {
              return item;
            }
          })
          .filter(item => item);
      } else {
        return this.columns;
      }
    },
    computedIndex() {
      if (typeof this.index === "number" || typeof this.index === "function") {
        return this.index;
      }
      return undefined;
    }
  },
  methods: {
    toggleRowSelection(rowIndex, selected) {
      this.$refs.elTable.toggleRowSelection(this.crudData[rowIndex], selected);
    },
    setCurrentRow(rowIndex) {
      this.$refs.elTable.setCurrentRow(this.crudData[rowIndex]);
    },
    toggleRowExpansion(rowIndex, expanded) {
      this.$refs.elTable.toggleRowExpansion(this.crudData[rowIndex], expanded);
    }
  },
  created() {
    [
      "select",
      "select-all",
      "selection-change",
      "cell-mouse-enter",
      "cell-mouse-leave",
      "cell-click",
      "cell-dblclick",
      "row-click",
      "row-contextmenu",
      "row-dblclick",
      "header-click",
      "header-contextmenu",
      "sort-change",
      "filter-change",
      "current-change",
      "header-dragend",
      "expand-change"
    ].forEach(item => {
      this.events[item] = (...args) => {
        this.$emit(item, ...args);
      };
    });
  },
  mounted() {
    /**
     * 将table的方法代理到当前组件上
     */
    [
      "clearSelection",
      "toggleAllSelection",
      "clearSort",
      "clearFilter",
      "doLayout",
      "sort"
    ].forEach(item => {
      this[item] = (...args) => {
        this.$refs.elTable[item](...args);
      };
    });
  }
};
