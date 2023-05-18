import { describe, it, expect } from "vitest";

import { shallowMount } from "@vue/test-utils";
import Upload from "@/components/Upload.vue";

describe("Upload", () => {
  it('should render the "Drop your files here" message', () => {
    const wrapper = shallowMount(Upload);
    const dropMessage = wrapper.find(".w-full");
    expect(dropMessage.text()).toBe("Drop your files here");
  });

  // it("should process input and populate drones and locations", () => {
  //   const wrapper = shallowMount(Upload);
  //   const input =
  //     "[Drone 1]\n[Location 1]\n[Location 2]\n[Drone 2]\n[Location 3]";
  //   wrapper.vm.processInput(input);

  //   const drones = wrapper.vm.drones;
  //   const locations = wrapper.vm.locations;

  //   expect(drones[0].name).toBe("[Drone 1]");
  //   expect(drones[1].name).toBe("[Drone 2]");
  //   expect(drones).toHaveLength(2);

  //   expect(locations[0].name).toBe("[Location 1]");
  //   expect(locations[1].name).toBe("[Location 2]");
  //   expect(locations[2].name).toBe("[Location 3]");
  //   expect(locations).toHaveLength(3);
  // });

  it("should filter locations based on drone weight", () => {
    const wrapper = shallowMount(Upload);
    wrapper.setData({
      newLocations: [
        { name: "[Location 1]", weight: 3 },
        { name: "[Location 2]", weight: 5 },
        { name: "[Location 3]", weight: 2 },
        { name: "[Location 4]", weight: 4 },
      ],
    });

    const drone = { weight: 7 };
    const { filteredLocations } = wrapper.vm.filterLocations(drone.weight);

    expect(filteredLocations).toHaveLength(2);
    expect(filteredLocations[0].name).toBe("[Location 1]");
    expect(filteredLocations[1].name).toBe("[Location 3]");
  });

  it("should have less than 100 drones in the array", () => {
    const wrapper = shallowMount(Upload);
    wrapper.setData({
      drones: [
        { name: "Drone 1" },
        { name: "Drone 2" },
        // Add more drones here as needed...
      ],
    });
    const drones = wrapper.vm.drones;

    expect(drones.length).toBeLessThan(100);
  });

  it("should sort drones by name", () => {
    const wrapper = shallowMount(Upload);
    wrapper.setData({
      drones: [
        { name: "[Drone 2]" },
        { name: "[Drone 1]" },
        { name: "[Drone 3]" },
      ],
    });

    wrapper.vm.drones.sort(wrapper.vm.compareByName);

    const sortedDrones = wrapper.vm.drones;

    expect(sortedDrones[0].name).toBe("[Drone 1]");
    expect(sortedDrones[1].name).toBe("[Drone 2]");
    expect(sortedDrones[2].name).toBe("[Drone 3]");
  });
});
