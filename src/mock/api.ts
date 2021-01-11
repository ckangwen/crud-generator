import faker from "faker";
import map from "lodash/map";
import random from "lodash/random";

import { mock, request } from "./mock";

export function response(data = {}, msg = "", code = 0) {
  return [200, { code, msg, data }];
}

/**
 * @description 接口请求返回 正确返回
 * @param {Any} data 返回值
 * @param {String} msg 状态信息
 */
export function responseSuccess(data = {}, msg = "成功") {
  return response(data, msg);
}

export const getTableData = (params = {}) => {
  mock.onAny("/demo/business/table/1/fetch").reply(config =>
    responseSuccess({
      page: {
        total: 1000
      },
      list: map(Array(config.params.pageSize), () => ({
        key: faker.random.uuid(),
        value: [10, 100, 200, 500][random(0, 3)],
        type: faker.random.boolean(),
        admin: faker.name.firstName() + faker.name.lastName(),
        adminNote: faker.random.words(),
        dateTimeCreat: faker.date.past(),
        used: faker.random.boolean(),
        dateTimeUse: faker.date.past()
      }))
    })
  );
  // 接口请求
  return request({
    url: "/demo/business/table/1/fetch",
    method: "get",
    params
  });
};
