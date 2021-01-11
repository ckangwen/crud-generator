import { deepClone } from "./utils";
import SchemaField from "./SchemaField";
import { registerWidget } from "./register";

export default {
  name: "SchemaForm",
  components: {
    SchemaField
  },
  props: {
    schema: {
      type: Object,
      required: true,
      default() {
        return {};
      }
    },
    value: {
      type: Object,
      required: true
    },
    widgets: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      formData: {}
    };
  },
  computed: {
    computedFields() {
      return Object.keys(this.schema).map(k => {
        return {
          property: k,
          ...this.schema[k]
        };
      });
    }
  },
  watch: {
    formData: {
      handler(cur) {
        const cloneValue = deepClone(cur);
        this.$emit("input", cloneValue);
        this.$emit("change", cloneValue);
      },
      deep: true
    }
  },
  methods: {
    setCurrentValue() {
      if (!(this.formData && this.value === this.formData)) {
        if (this.value) {
          this.formData = deepClone(this.value);
        } else {
          this.formData = {};
        }
      }
    },
    onFormInput() {
      //
    },
    onInput(key, value) {
      this.$set(this.formData, key, value);
    }
  },
  created() {
    Object.keys(this.schema).forEach(k => {
      this.$set(this.formData, k, "");
    });
    Object.keys(this.widgets).forEach(key => {
      registerWidget(key, this.widgets[key]);
    });
  },
  render() {
    return (
      <el-form model={this.formData} onInput={this.onFormInput}>
        <el-row>
          {this.computedFields.map(item => {
            return (
              <schema-field
                key={item.property}
                schema={item}
                value={this.formData[item.property]}
                onInput={this.onInput}
              ></schema-field>
            );
          })}
        </el-row>
      </el-form>
    );
  }
};
