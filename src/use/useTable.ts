import { computed, ref, watch } from "@vue/composition-api";
import faker from "faker";
import { request, mock } from "@/mock/mock";
import map from "lodash/map";
import { formatTime } from "../utils/time";

export const fakerDataMap: Record<string, Function> = {
  image: faker.image.image,
  email: faker.internet.email,
  userName: faker.internet.userName,
  passowrd: faker.internet.password,
  text: faker.lorem.text,
  phone: faker.phone.phoneNumber,
  boolean: faker.random.boolean,
  number: faker.random.number,
  string: faker.random.words,
  url: faker.internet.url,
  date: () => formatTime(faker.date.future(), "{y}-{m}-{d} {h}:{i}"),
  futureTime: () => formatTime(faker.date.future.toString()),
  pastTime: () => formatTime(faker.date.past.toString()),
  color: faker.internet.color
};

const basicMockMapping = {
  date: "date",
  name: "userName",
  address: "string"
};

const basicColumns = [
  {
    label: "日期",
    prop: "date"
  },
  {
    label: "姓名",
    prop: "name"
  },
  {
    label: "地址",
    prop: "address"
  }
];

export default function useTable(
  _columns = basicColumns,
  _mockDataMapping: Record<string, string> = basicMockMapping
) {
  const columns = ref(_columns);
  const columnKeys = ref<string[]>([]);
  const columnMock = ref<Record<string, any>>(_mockDataMapping);

  const mockData = computed(() => {
    return Object.keys(columnMock.value).reduce(
      (acc: Record<string, any>, cur: string) => {
        const mockType = columnMock.value[cur];
        acc[cur] = fakerDataMap[mockType].call(null);
        return acc;
      },
      {}
    );
  });

  const fetch = (url: string, data: any) => {
    mock.onAny("/table/list").reply(() => {
      return [
        200,
        {
          state: 1,
          msg: "列表获取成功",
          data: {
            page: 1,
            total: 100,
            list: map(Array(10), () => ({
              ...mockData.value
            }))
          }
        }
      ];
    });

    return request({
      url,
      method: "POST",
      data
    });
  };

  watch(
    columns,
    val => {
      columnKeys.value = val.map(item => item.prop) || [];
    },
    {
      immediate: true
    }
  );

  return {
    columns,
    columnKeys,
    columnMock,
    fetch
  };
}
