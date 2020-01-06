const { parentPort } = require("worker_threads");
const Monster = require('../lib/pokemon/pokemon').default

function startSim({ name, data }){
  const mon = new Monster({ name })
  return mon.optimizeEVs(data)
}

parentPort.on('message', msg => {
  const { name, data } = msg
  console.log(`Now optimizing ${name}`);
  parentPort.postMessage(startSim({ name, data }));
})
