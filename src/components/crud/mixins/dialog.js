export default {
  props: {
    rules: Object,
    dialogOptions: {
      type: Object,
      default () {
        return {}
      }
    },
    showDelete: Boolean,
    showUpdate: Boolean,
    deleteContent: Function,
    updateContent: Function,
    beforeRowRemove: Function,
    beforeRowAdd: Function,
    beforeRowUpdate: Function,
    dialogFormItemRender: Function
  },
  data () {
    return {
      /** 控制模态框显隐  */
      dialogVisible: false,
      updateIndex: 0,
      addIndex: undefined,
      dialogFormData: {},
      dialogMode: ''
    }
  },
  methods: {
    openDialog ({ mode, index }) {
      if (mode === 'add') {
        // 这里的index是一个事件属性
        this.openAddDialog(parseInt(index) ? parseInt(index) : undefined)
      }
      if (mode === 'update') {
        this.openUpdateDialog({ $index: index })
      }
    },
    openUpdateDialog ({ row, $index }) {
      this.dialogVisible = true
      this.dialogMode = 'update'
      this.updateIndex = $index
      /* 将当前行的数据保存到dialogFormData */
      this.columns.map(item => item.prop).forEach((prop, idx) => {
        // 需要使用$set，因为vue2无法对对象属性的增删做出响应式操作
        this.$set(this.dialogFormData, prop, this.data[$index][prop])
      })
    },
    openAddDialog (index) {
      this.dialogVisible = true
      this.addIndex = index
      this.dialogMode = 'add'
      /* 初始化dialogFormData */
      this.columns.map(item => item.prop).forEach((prop, idx) => {
        this.$set(this.dialogFormData, prop, '')
      })
    },
    onDialogSave () {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.dialogMode === 'update') {
          const done = (param) => {
            if (param === false) {
              this.closeDialog()
              return
            }
            this.handleUpdateRow(this.updateIndex, this.dialogFormData)
            this.closeDialog()
          }
          if (typeof this.beforeRowUpdate === 'function') {
            this.beforeRowUpdate(this.dialogFormData, done)
          } else {
            done()
          }
        }
        if (this.dialogMode === 'add') {
          const done = (param) => {
            if (param === false) {
              this.closeDialog()
              return
            }
            this.handleRowAdd(this.dialogFormData, this.addIndex)
            this.closeDialog()
          }
          if (typeof this.beforeRowAdd === 'function') {
            this.beforeRowAdd(this.dialogFormData, done)
          } else {
            done()
          }
        }
      })
    },
    onDialogCancel () {
      this.$emit('dialog-cancel')
      this.closeDialog()
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
