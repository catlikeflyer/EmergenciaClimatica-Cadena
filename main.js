const numKg = document.getElementById("num-kg");
const numKm = document.getElementById("num-km");
const numPeople = document.getElementById("num-people");
const longStart = document.getElementById("num-longstart");
const latStart = document.getElementById("num-latstart");
const longEnd = document.getElementById("num-longend");
const latEnd = document.getElementById("num-latend");
const resultRender = document.getElementById("results");

const vehicleData = [
  {
    id: "car",
    name: "Auto",
    emission: 120.1,
    maxPeople: 5,
    maxCargo: 400,
    image:
      "https://seetech-corp.com/wp-content/uploads/2016/10/Car-PNG-File.png",
  },
  {
    id: "bus",
    name: "Autobús",
    emission: 1300,
    maxPeople: 40,
    maxCargo: 1280,
    image: "https://www.pngmart.com/files/6/Bus-Transparent-Images-PNG.png",
  },
  {
    id: "van",
    name: "Van",
    emission: 180.5,
    maxPeople: 13,
    maxCargo: 750,
    image:
      "https://vans.mercedes-benz.com.mx/vans/es/sprinter/quick-access/body-types/sprinter-tourer/_jcr_content/parsysmeta/meta/image.mq6.png/1647914985000.png",
  },
  {
    id: "trailer",
    name: "Trailer",
    emission: 1540,
    maxPeople: 2,
    maxCargo: 24000,
    image: "https://www.picng.com/upload/truck/png_truck_23632.png",
  },
  {
    id: "plane",
    name: "Avión",
    emission: 285,
    maxPeople: 150,
    maxCargo: 4800,
    image:
      "https://www.pngmart.com/files/13/Vector-Flying-Airplane-PNG-Free-Download.png",
  },
];

// CO2 Absortion of a single tree in a 10 year period in grams
const treeAbsortion = 60000;

const valueChange = (km) => {
  const people = numPeople.value;
  const kg = numKg.value;

  const suggestion = returnSuggestion(people, km, kg);
  console.log(suggestion);

  let addString = "";

  let minVehicle = suggestion.reduce(function (prev, curr) {
    return prev.totalEmissions < curr.totalEmissions ? prev : curr;
  });

  suggestion.forEach((vehicle) => {
    addString += `
    <div class="col-md-4 col-sm-12 flexer-col">
    <img src=${vehicle.image} alt="" width="100" />
    <h3 ${
      vehicle.totalEmissions === minVehicle.totalEmissions
        ? 'class="min-emission"'
        : ""
    }>${vehicle.name}</h3>
    <p>Se ocupan <strong>${vehicle.total}</strong> flete(s)</p>
    <p>Su emision de CO2 total por el viaje es de <strong>${
      vehicle.totalEmissions
    }</strong> g CO2 en el trayecto</p>
    <p>Se necesitan plantar <strong>${
      vehicle.trees
    }</strong> arboles para absorber las emisiones en un periodo de 10 años<p>
  </div>
  `;
  });

  resultRender.innerHTML =
    `<p>Kilometros: ${km.toFixed(2)} km</p>` + addString;
};

const calculateEmission = (vehicles, km, em) => {
  const emissions = vehicles * km * em;
  return emissions;
};

const calculateTrees = (emissions) => {
  const trees = emissions / treeAbsortion;
  return parseInt(trees + 1);
};

const howMuchWeNeed = (maxPeople, maxCargo, people, cargo) => {
  totalVehiclesByCargo = Math.ceil(cargo / maxCargo);
  totalVehiclesByPeople = Math.ceil(people / maxPeople);

  return Math.max(totalVehiclesByCargo, totalVehiclesByPeople);
};

const returnSuggestion = (people, km, kg) => {
  let vehicles = [];

  vehicleData.forEach((vehicle) => {
    const totalVehicles = howMuchWeNeed(
      vehicle.maxPeople,
      vehicle.maxCargo,
      people,
      kg
    );

    if (totalVehicles > 0) {
      vehicles.push({
        name: vehicle.name,
        total: totalVehicles,
        totalEmissions: calculateEmission(totalVehicles, km, vehicle.emission),
        image: vehicle.image,
        trees: calculateTrees(
          calculateEmission(totalVehicles, km, vehicle.emission)
        ),
      });
    }
  });

  return vehicles;
};

const onButtonClick = () => {
  const latStartRad = latStart.value * (Math.PI / 180);
  const longStartRad = longStart.value * (Math.PI / 180);
  const latEndRad = latEnd.value * (Math.PI / 180);
  const longEndRad = longEnd.value * (Math.PI / 180);

  const distance =
    3963 *
    Math.acos(
      Math.sin(latStartRad) * Math.sin(latEndRad) +
        Math.cos(latStartRad) *
          Math.cos(latEndRad) *
          Math.cos(longEndRad - longStartRad)
    );

  if (latStart.value && longStart.value && latEnd.value && longEnd.value) {
    valueChange(distance);
  } else {
    resultRender.innerHTML =
      "<h3 class='alert'>Por favor ingrese un todos los datos</h3>";
  }
};
