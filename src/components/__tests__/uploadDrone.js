import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import Hello from "../Header.vue";

describe("inital", () => {
  it("renders properly", () => {
    const wrapper = mount(Hello, {
      props: { msg: "msn at head is working" },
    });
    expect(wrapper.text()).toContain("TEST DRONES RICARDO PASSINHO");
  });
});
