import { deepClone } from '../utils'
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    removeConfirmOptions: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      crudData: []
    }
  },
  watch: {
    data () {
      this.handleDataChange()
    }
  },
  methods: {
    /** 同步外部表格数据到crudData内部 */
    handleDataChange () {
      this.crudData = deepClone(this.data)
    },
    async handleRemoveConfirm (index, row) {
      try {
        await this.$confirm(
          '确定删除吗？',
          '删除',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            ...this.removeConfirmOptions
          }
        )
        if (typeof this.beforeRowRemove === 'function') {
          this.beforeRowRemove({ index, row }, this.deleteRow)
        } else {
          this.deleteRow(index)
        }
      } catch (error) {
        this.$emit('remove-error', error)
      }
    },
    /**
     * 删除行
     * @param {Object} index 被删除行索引
     */
    deleteRow (index) {
      this.$delete(this.crudData, index)
    },
    addRow (row, index) {
      if (!index) {
        // 需要深复制，因为所有row参数的引用都是指向同一个对象(dialogFormData)，
        // 所以传入的值会被dialogFormData所影响，导致每次传入的值最终都是一样的
        this.crudData.push({ ...row })
      } else {
        this.crudData.splice(index, 0, { ...row })
      }
    },
    updateRow (index, row) {
      this.$set(this.crudData, index, row)
    },
    /** 更新某一行的具体列 */
    updateCell (index, key, value) {
      this.$set(this.crudData, index, {
        ...this.crudData[index],
        [key]: value
      })
    },
    findRow (index) {
      return deepClone(this.crudData[index])
    },
    handleRowAdd (rowData, index) {
      this.addRow(rowData, index)
      this.handleSortDataChange()
    },
    handleUpdateRow (index, rowData) {
      this.updateRow(index, rowData)
      this.handleSortDataChange()
    },
    handleSortDataChange () {
      if (this.options && this.options.defaultSort) {
        const { prop, order } = this.options.defaultSort
        this.$nextTick(() => {
          this.$refs.elTable.sort(prop, order)
        })
      }
    }
  },
  mounted () {
    this.handleDataChange()
  }
}
