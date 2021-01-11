import { ref } from "@vue/composition-api";

export default function useCounter(initialValue: number) {
  const count = ref(initialValue);

  const increase = (delta = 1) => (count.value += delta);
  const decrease = (delta = 1) => (count.value -= delta);
  const get = () => count.value;
  const set = (val: number) => (count.value = val);
  const reset = (val: number = initialValue) => {
    initialValue = val;
    return set(val);
  };

  return {
    count,
    increase,
    decrease,
    get,
    set,
    reset
  };
}
