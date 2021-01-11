import { defineComponent } from "@vue/composition-api";
import useCounter from "../use/useCounter";

export type CounterProps = {
  value: number;
};

export default defineComponent({
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  setup(props: CounterProps) {
    const counter = useCounter(props.value);

    return counter;
  },
  render() {
    const { count, increase, decrease, set, reset } = this;
    console.log(count);
    return (
      <div>
        <p>Count: {count}</p>
        <el-button onClick={() => increase()}>Increment</el-button>
        <el-button onClick={() => decrease()}>Decrement</el-button>
        <el-button onClick={() => increase(5)}>Increment (+5)</el-button>
        <el-button onClick={() => set(100)}>Set (100)</el-button>
        <el-button onClick={() => reset()}>Reset</el-button>
      </div>
    );
  }
});
