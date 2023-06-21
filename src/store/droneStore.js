import { defineStore } from "pinia";

export const useDroneStore = defineStore("droneStore", {
  state: {
    number: 10,
    name: "Ricardo Passinho",
  },
});
