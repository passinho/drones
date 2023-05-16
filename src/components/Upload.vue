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
                     <span>{{ content }}</span>
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
      content: null,
      drones: null,
      locations: null
    };
  },
  props: {
    content: 'Hello'
  },
  methods: {
    upload($event) {
      this.is_dragover = false;

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
            processInput(res.target.result);
          };
          reader.onerror = (err) => console.log(err);
          reader.readAsText(file);

        } else {

          console.war("Format file not permit");

        }
     });

      // separa as informações do input em arrays distintos
      function processInput(input) {

      //  // divide a string de entrada em linhas
        const names = input.match(/\[(.*?)\]/g).filter((_, i) => i % 2 === 0);
        const weight = input.match(/\[(.*?)\]/g).filter((_, i) => i % 2 === 1);

        //cria um objeto para armazenar os drones e seus pesos
        const AllElements = {};
        names.forEach( function (value, i) { 
            AllElements[i] = { name: names[i], value: weight[i], weight: weight[i].replace('[', '').replace(']', '') }
        })

      //   // Extrai informações dos drones e das localizações
        const drones = Object.values(AllElements).filter(x => x.name.includes("Drone"));
        let locations = Object.values(AllElements).filter(x => x.name.includes("Location"));


        // Custom comparison function
        function compareByName(a, b) {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();

          if (nameA < nameB) {
            return -1;
          }

          if (nameA > nameB) {
            return 1;
          }

          return 0;
        }


        // Step 2: Sort drones by maximum weight capacity
        drones.sort((a, b) => b.weight - a.weight);

        // Step 3: Sort locations by weight
        locations.sort((a, b) => b.weight - a.weight);

        // Step 4: Create list of trips for each drone
        drones.forEach(drone => {
          let currentTrip = [];
          drone.trips = [];
          drone.trips.push(currentTrip);
        });

        let remainingLocations = [...locations]; // Criando uma cópia da lista original de locais

        // Step 5: Add locations to trips
        const getDrone = () => {
             
          drones.sort(compareByName);

          while (remainingLocations.length > 0) {
            let drone = processNextDrone();
            let remainingCapacity = drone.weight;
            let tripIndex = 1;

              // Inicie o processamento chamando a função para o primeiro drone
            
              const currentTrip = [];
              let locationsToRemove = [];
              
              remainingLocations.forEach((location, index) => {
                if (remainingCapacity >= location.weight) {
                  currentTrip.push(location);
                  remainingCapacity -= location.weight;
                  locationsToRemove.push(index);
                }
              });

              // Removendo os locais adicionados à viagem atual
              locationsToRemove.reverse().forEach(index => {
                remainingLocations.splice(index, 1);
              });

              if (currentTrip.length > 0) {
                  drone.trips.push({
                    tripNumber: tripIndex,
                    locations: currentTrip
                  });
                
                remainingCapacity = drone.weight;
                tripIndex++;

              } else {
                break; // Sai do loop se não houver locais suficientes para uma viagem
              }
            }
          }
      
        let currentIndex = 0;

        function processNextDrone() {
          const currentDrone = drones[currentIndex];

          // Faça o processamento necessário para o drone atual aqui
          console.log('Processando o drone:', currentDrone);
            // Atualize o índice para avançar para o próximo drone
          ++currentIndex;

          // Atualize o índice para avançar para o próximo drone
          

          // Verifique se todos os drones foram processados e ainda há locais restantes
          if (currentIndex >= drones.length && remainingLocations.length > 0) {
            // Reinicie a iteração dos drones
            currentIndex = 0;
            console.log('Reiniciando a iteração dos drones.');
          }

          // Verifique se ainda há drones para processar e locais restantes
          if (currentIndex <= drones.length && remainingLocations.length > 0) {
            // Aguarde um intervalo de tempo antes de chamar o próximo drone (opcional)
            return drones[currentIndex];
          } else {
            console.log('Não há mais locais.');
          }
        }

          getDrone()


        // Step 6: Output trips for each drone
        const show = () => {
     
        drones.forEach(drone => {
          let loca = '';
          console.log(`${drone.name}`);
       //   drone.trips.splice(0, 1);
          drone.trips.forEach((trips, index) => {
            console.log(`Trip #${index + 1}`);
            trips.locations.forEach(location => { 
              loca = loca  + ' ' + location.name ;
            });
            console.log(loca);
          });
        });
      }

      show();

        // Step 7: Output the result
        // The result will be printed in the console



          // while ( locations.length > 0 ){
          //   deliveryList = [];
          //   locations.forEach(function (value, i) {
          //       if (parseFloat(value.weight) <= remainingWeight) {
          //         deliveryList.push({ trip: tripNum++ , route: value });
          //         remainingWeight -= parseFloat(value.weight);
          //       }
          //     });

          //   locations = locations.filter(
          //     (obj) => !deliveryList.includes(obj)
          //   );

          //   if (deliveryList.length >= 3) {
          //       ListLocation.push(deliveryList);
          //       remainingWeight = parseFloat(drone.weight);
          //       continue;
          //   } else {
          //       DroneList.push({ drone: drone, deliveryList: deliveryList });
          //       break;
          //   }
          //}
          
        //});

        // Imprime a lista de entregas
        //this.content = DroneList;
       // console.log(DroneList);
    
      }
      
    },
  },
};
</script>
