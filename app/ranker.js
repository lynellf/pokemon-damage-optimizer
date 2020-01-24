const path = require("path");
const fs = require("fs");

function stringCheck({ arg, msg }) {
  if (typeof arg !== "string") {
    throw new Error(msg);
  }

  if (arg.length === 0) {
    throw new Error(msg);
  }
}

function resultCheck(result) {
  const hasTopMoves = result.hasOwnProperty("topMoves");
  const hasWins = result.hasOwnProperty("wins");
  const hasLosses = result.hasOwnProperty("losses");
  const hasName = result.hasOwnProperty("name");
  const hasPoints = result.hasOwnProperty("points");
  const hasResult = hasTopMoves && hasWins && hasLosses && hasName && hasPoints;
  if (!hasResult) {
    throw new Error("Invalid result parameter");
  }
}

function outputCheck(output){
  const hasBattles = output.hasOwnProperty('battles')
  const hasPokemon = output.hasOwnProperty('pokemon')
  const hasOutput = hasBattles && hasPokemon
  if (!hasOutput) {
    throw new Error('Invalid output parameter')
  }
}

/**
 * @param {string} dir
 */
function getDirectory(dir) {
  stringCheck({ arg: dir, msg: "Invalid directory" });
  const directory = path.join(__dirname, dir);
  return directory;
}

/**
 * @param {import("fs").PathLike} directory
 */
function getFileNames(directory) {
  stringCheck({ arg: directory, msg: "Invalid Directory" });
  const output = fs.readdirSync(directory);
  return output;
}

/**
 * @param {string} path
 * @param {string} filename
 */
function openFile(path, filename) {
  stringCheck({ arg: path, msg: "Invalid path" });
  stringCheck({ arg: filename, msg: "Invalid Filename" });

  const fullPath = `${path}\\${filename}`;
  console.log(`Now reading ${fullPath}`);

  return fs.readFileSync(fullPath, "utf8");
}

/**
 * @param {string} file
 */
function parseFile(file) {
  stringCheck({ arg: file, msg: "No file found" });
  return JSON.parse(file);
}

function getPointTotal({ wins, losses, name }) {
  const winTotal = wins.reduce((sum, win) => {
    const {
      move: { defenderHp }
    } = win;
    return defenderHp < 140
      ? sum + Math.floor(defenderHp * 0.5)
      : sum + defenderHp;
  }, 0);

  const points = losses.reduce((sum, loss) => {
    const {
      move: { defenderHp }
    } = loss;
    return sum - defenderHp;
  }, winTotal);

  return { name, points };
}

function getTopMoves(win, output) {
  const {
    move: { name }
  } = win;
  const moveQuery = output.find(item => item[0] === name);
  if (!moveQuery) {
    output.push([name, 0]);
    return output;
  }
  moveQuery[1] = moveQuery[1] + 1;
  return output;
}

function sortMovesByFreq(a, b) {
  return a[1] < b[1] ? 1 : -1;
}

function sortMonsByPoints(a, b) {
  return a.points < b.points ? 1 : -1;
}

function filterMovesByIndex(_item, index) {
  return index < 4;
}

function getResults({ mon, index, fileNames }) {
  const { wins, losses } = mon;
  const name = fileNames[index].split(".json")[0];
  const pointTotal = getPointTotal({ wins, losses, name });
  const topMoves = wins
    .reduce((output, win) => getTopMoves(win, output), [])
    .sort(sortMovesByFreq)
    .filter(filterMovesByIndex);
  return { ...pointTotal, topMoves };
}

function mapBattle(battle, output) {

}

function mapResult(result, output){
  resultCheck(result)
  outputCheck(output)
  const { topMoves, wins, losses, name, points } = result
}

function writeJson({ directory, filename, json }){
  stringCheck({ arg: directory, msg: "Invalid Filename" });
  stringCheck({ arg: filename, msg: "Invalid Filename" });
  return fs.writeFileSync(`${directory}/${filename}`, JSON.stringify(json));
}

function rank() {
  const dir = getDirectory("out");
  const fileNames = getFileNames(dir);
  const rawFiles = fileNames.map(fileName => openFile(dir, fileName));
  const pokemon = rawFiles.map(file => parseFile(file));
  const results = pokemon
    .map((mon, index) => getResults({ mon, index, fileNames }))
    .sort(sortMonsByPoints);
  const outDir = getDirectory('rank')
  writeJson({ directory: outDir, filename: 'tierList.json', json: results })
}

module.exports = rank