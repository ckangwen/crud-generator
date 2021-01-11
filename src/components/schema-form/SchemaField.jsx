import { componentMap } from "./widgets";
export default {
  name: "SchemaField",
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: [Object, String, Number, Array, Boolean]
  },
  data() {
    return {
      currentValue: ""
    };
  },
  watch: {
    currentValue(cur) {
      if (this.value !== cur) {
        this.$emit("input", this.schema.property, cur);
        this.$emit("change", this.schema.property, cur);
      }
    },
    value(cur) {
      if (this.value !== cur) {
        this.currentValue = cur;
      }
    }
  },
  methods: {
    onInput(value) {
      if (this.currentValue !== value) {
        this.currentValue = value;
      }
    },
    getComponentName() {
      const type = componentMap.get(this.schema.type);
      if (!type) {
        throw new Error(`尚未注册${this.schema.type}类型的组件`);
      }
      return type;
    }
  },
  created() {
    if (this.schema.default && !this.value) {
      this.currentValue = this.schema.default;
    } else {
      this.currentValue = this.value;
    }
  },
  render() {
    const formItemProps = {
      required: this.schema.required,
      label: this.schema.title,
      prop: this.schema.property,
      size: this.schema.size
    };
    const extra = this.schema.extra || "";

    const inputProps = Object.assign({}, this.schema["ui-props"], {
      schema: this.schema
    });
    const inputAttrs = Object.assign({}, this.schema["ui-attrs"], {
      placeholder: this.schema.placeholder
    });
    inputProps.value = this.currentValue;
    const CompnentName = this.getComponentName();
    const InputNode = (
      <CompnentName
        props={inputProps}
        class={this.schema.class}
        style={this.schema.style}
        attrs={inputAttrs}
        onInput={this.onInput}
      />
    );

    const noWrap = !this.schema.title;

    let content = noWrap ? (
      InputNode
    ) : (
      <el-form-item {...formItemProps}>
        {<span slot="label">{formItemProps.label}</span>}
        {InputNode}
        {extra}
      </el-form-item>
    );

    if (this.schema.span) {
      content = <el-col span={this.schema.span}>{content}</el-col>;
    }

    return content;
  }
};
