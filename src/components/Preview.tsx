import { defineComponent } from "@vue/composition-api";

type PreviewProps = {
  componentName: string;
  componentProps: Record<string, any>;
};

export default defineComponent({
  name: "Preview",
  props: {
    componentName: {
      type: String,
      default: "span"
    },
    componentProps: {
      type: Object,
      required: true
    }
  },
  render() {
    const ComponentName = this.componentName;
    const { __slot__, ...others } = this.componentProps;
    return (
      <div>
        <ComponentName
          {...{
            props: { ...others }
          }}
        >
          {__slot__}
        </ComponentName>
      </div>
    );
  }
});
