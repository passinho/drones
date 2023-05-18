<template>
     <section class="container mx-auto mt-6">
        <div class="md:grid md:grid-cols-3 md:gap-4">
          <div class="col-span-1">
            <div class="bg-white rounded border border-gray-200 relative flex flex-col">
              <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                <span class="card-title">Upload</span>
                <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
              </div>
              <div class="p-6">
                <!-- Upload Dropbox -->
                <div
                  class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
                  :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
                  @drag.prevent.stop=""
                  @dragstart.prevent.stop=""
                  @dragend.prevent.stop="is_dragover = false"
                  @dragover.prevent.stop="is_dragover = true"
                  @dragenter.prevent.stop="is_dragover = true"
                  @dragleave.prevent.stop="is_dragover = false"
                  @drop.prevent.stop="upload($event)"
                >
                  <h5>Drop your files here</h5>
                </div>
                <input type="file" multiple @change="upload($event)" />
                <hr class="my-6" />
              </div>
            </div>

            </div>
            <div class="col-span-2">
              <div
                class="bg-white rounded border border-gray-200 relative flex flex-col"
              >
                <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                  <span class="card-title">Drones On-line</span>
              
                </div>
                <div class="p-6">
                  <!-- Drones Items -->
                 <div v-for="(value) in drones" :key="drones">
                      <h1 class="drone"> {{ value.name  }}</h1>
                      <ul class="trip">
                        <li v-for="(item, index) in value.trips" :key="index">
                          <span>Trip #{{ item.tripNumber }} </span>
                          <div > {{ even(item.locations) }} </div> 
                        </li>
                      </ul>
                    </div>
                     
                </div>
              </div>
            </div>
          </div>
        </section>
</template>

<script>

export default {
  name: "Upload",
  data() {
    return {
      is_dragover: false,
      file: null, 
      drones: [],
      locations: [],
      newlocations: []
    };
  },
  mounted() {

    this.drones = [{ name:'Carregue a lista de drones' },];

  },
  methods: {

    even(array) {
         return array.map(objeto => objeto['name']).join(",");
    },

    upload($event) {
      this.is_dragover = false;
      this.drones = [];
      
       this.file = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];

       const reader = new FileReader();

       this.file.forEach((file) => {
        if (file.type !== "text/plain") {
          return;
        }

        if (file.name.includes(".txt")) {

          reader.onload = (res) => {
            this.processInput(res.target.result);
          };
          reader.onerror = (err) => console.log(err);
          reader.readAsText(file);

        } else {
          console.war("Format file not permit");
        }
     });
    },

    // separates input information into distinct arrays
    processInput(input) {

      // splits the input string into lines
      const names = input.match(/\[(.*?)\]/g).filter((_, i) => i % 2 === 0);
      const weight = input.match(/\[(.*?)\]/g).filter((_, i) => i % 2 === 1);

      // creates an object to store the drones and their weights
      const AllElements = {};
      names.forEach( function (value, i) { 
          AllElements[i] = { name: names[i], value: weight[i], weight: parseFloat(weight[i].replace('[', '').replace(']', '')), }
      })

      // Extract information from drones and locations
      this.drones = Object.values(AllElements).filter(x => x.name.includes("Drone"));
      this.locations = Object.values(AllElements).filter(x => x.name.includes("Location"));

      if( this.locations.length > 100 )
        this.drones = [{ name: 'Não é possivel processa uma lista com mais de 100 drones' },];
        
      
      // Sort locations by weight
      this.locations.sort((a, b) => b.weight - a.weight);

      // Create list of trips for each drone
      this.drones.forEach(drone => {
        drone.trips = [];
      });

      // Creating a copy of the original list of locations
      this.newLocations = [...this.locations]; 
      let currentIndex = 0;

      while (this.newLocations.length > 0  &&  this.newLocations.length <= 100) {
        if (currentIndex == this.drones.length)
          currentIndex = 0;

        let drone = this.processNextDrone(currentIndex++);

        let { filteredLocations } = this.filterLocations(drone.weight);

        drone.trips.push({
          tripNumber: drone.trips.length + 1,
          locations: filteredLocations
        });

        if (this.newLocations.length == 0) break;

      }

      this.drones.sort(this.compareByName);

      },

      // Custom comparison function
      compareByName(a, b) {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();

          if (nameA < nameB) {
            return -1;
          }

          if (nameA > nameB) {
            return 1;
          }

          return 0;
        },

      filterLocations(targetValue) {
          //filter list location to get all location able to target
          const filteredLocations = this.newLocations.reduce((accumulator, location) => {
            let totalWeight = accumulator.reduce((sum, loc) => sum + loc.weight, 0);
            if (totalWeight + location.weight <= targetValue) {
              accumulator.push(location);
            }
            return accumulator;
          }, []);

            this.newLocations = this.newLocations.filter(location => !filteredLocations.includes(location));

          return { filteredLocations };
        },


        processNextDrone(currentIndex) {
            // get drone by index
            return this.drones[currentIndex];
        }
    
  },
};
</script>

<style scoped>
    .drone{
      margin: 15px 0 0 0;
    }
</style>
