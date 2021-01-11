<script>
export default {
  functional: true,
  name: 'mutli-column',
  props: {
    item: Object
  },
  render (h, ctx) {
    const item = ctx.props.item
    const children = (item.children && Array.isArray(item.children) && item.children.length > 0) ? item.children.map(item => {
      return h('mutli-column', { attrs: { item } })
    }) : null
    return h('el-table-column', {
      attrs: {
        label: item.label,
        prop: item.prop,
        ...(item.attrs || {})
      }
    }, children)
  }
}
</script>
