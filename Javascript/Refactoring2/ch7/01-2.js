import { readJSON } from "../fileController.js";
import cloneDeep from "lodash/cloneDeep.js";
class CustomerData {
  #data;
  constructor(data) {
    this.#data = data;
  }
  usage(customerId, year, month) {
    return this.#data[customerId].usages[year][month];
  }
  setUsage = (customerId, year, month, amount) => {
    const newData = cloneDeep(this.#data);
    newData[customerId].usages[year][month] = amount;
    this.#data = newData;
  };
  get rawData() {
    return cloneDeep(this.#data);
  }
}

const customerData = new CustomerData(readJSON("ch7/01-2.json"));

export const getCustomerData = () => customerData;

export const writeData = (customerId, year, month, amount) => {
  getCustomerData().setUsage(customerId, year, month, amount);
};

export const compareUsage = (customerId, laterYear, month) => {
  const later = getCustomerData().usage(customerId, laterYear, month);
  const earlier = getCustomerData().usage(customerId, laterYear - 1, month);
  return { laterAmount: later, change: later - earlier };
};
export const getCustomer = () => customerData;
