const { writeFileSync } = require("fs");
const { Worker } = require("worker_threads");
// @ts-ignore
const dataSource = require("./output.json");

function main() {
  try {
    console.time("benchmark");
    let testData = {
      Venusaur: {
        wins: [],
        losses: [],
        evs: []
      },
      Blastoise: {
        wins: [],
        losses: [],
        evs: []
      },
      Charizard: {
        wins: [],
        losses: [],
        evs: []
      }
    };

    testData = Object.keys(dataSource.pokemon).reduce((output, mon) => {
      output[mon] = { wins: [], losses: [], evs: [] };
      return output;
    }, testData);

    function chunkArray(myArray, chunk_size) {
      let index = 0;
      let arrayLength = myArray.length;
      let tempArray = [];

      for (index = 0; index < arrayLength; index += chunk_size) {
        let myChunk = myArray.slice(index, index + chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
      }

      return tempArray;
    }

    const pokemonNames = Object.keys(testData).filter(
      n =>
        n !== "Ditto" &&
        n !== "Wobbuffet" &&
        n !== "Wynaut" &&
        n !== "Pyukumuku" &&
        n !== "Cosmog" &&
        n !== "Cosmoem"
    );
    const chunks = chunkArray(pokemonNames, 8);

    function runSim(arr, page) {
      let chunk = arr[page];
      console.log(`Chunk size is ${chunk.length}`);
      if (chunk !== undefined) {
        chunk.forEach((name, i) => {
          const worker = new Worker("./worker.js", {});
          worker.postMessage({ name, data: testData });
          worker.on("message", result => {
            writeFileSync(`out/${name}.json`, JSON.stringify(result[name]));
            console.log(`Finished ${name}`);
            if (i === chunk.length - 1) {
              runSim(arr, page + 1);
            }
            worker.terminate();
          });
        });
      }
    }

    runSim(chunks, 0);

    console.timeEnd("benchmark");
  } catch (error) {
    console.warn(error);
  }
}

main();
