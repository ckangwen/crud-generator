export default {
  props: {
    pagination: [Boolean, Object]
  },
  methods: {
    handlePaginationSizeChange (pageSize) {
      this.$emit('pagination-size-change', pageSize)
    },
    handlePaginationCurrentChange (currentPage) {
      this.$emit('pagination-current-change', currentPage)
    },
    handlePaginationPrevClick (currentPage) {
      this.$emit('pagination-prev-click', currentPage)
    },
    handlePaginationNextClick (currentPage) {
      this.$emit('pagination-next-click', currentPage)
    }
  }
}
