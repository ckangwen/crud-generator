export default {
  name: "single-select",
  props: {
    schema: Object,
    value: [Number, String, Array, Object, Boolean]
  },
  data() {
    return {
      options: []
    };
  },
  methods: {
    onInput(val) {
      this.$emit("input", val);
    }
  },
  created() {
    this.options = (this.schema.enums || []).map(item => {
      if (typeof item === "string" || typeof item === "number") {
        return {
          label: item,
          value: item
        };
      }
      return item;
    });
  },
  render() {
    return (
      <el-select value={this.value} onInput={this.onInput}>
        {this.options.map(item => {
          return (
            <el-option key={item.value} label={item.label} value={item.label}>
              {item.render || ""}
            </el-option>
          );
        })}
      </el-select>
    );
  }
};
