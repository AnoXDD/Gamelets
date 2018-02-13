import seedrandom from "seedrandom";

export default function generateFlipIt(size = 5, seed = Date.now()) {
  let rng = seedrandom(seed);
  let switches = [];
  let interval = Math.pow(2, size) - 1;

  // Generate switches
  while (switches.length < size) {
    let val = Math.floor(rng() * interval) + 1;
    while (switches.includes(val)) {
      val = Math.floor(rng() * interval) + 1;
    }

    switches.push(val);
  }

  // Generate farthest possible problem
  // This array stores a map of bulb - the number of switches toggled, both in
  // binary form
  let arr = new Array(Math.pow(2, size));

  // Use BFS to get the farthest state
  arr[0] = 0;
  let stack = [[0, []]];

  while (stack.length) {
    let top = stack.shift();
    let [bulb, usedSwitches] = top;
    let prevResult = arr[bulb];

    for (let i = 0; i < size; ++i) {
      let s = switches[i];
      if (usedSwitches.includes(s)) {
        continue;
      }

      let nextBulb = bulb ^ s;
      let nextResult = arr[nextBulb];

      if (nextResult !== undefined && nextResult < prevResult + 1) {
        continue;
      }

      arr[nextBulb] = prevResult + 1;
      stack.push([nextBulb, [...usedSwitches, s]]);
    }
  }

  // Find the best solution
  let max = -1;
  let bulbs = [];

  for (let i = 0; i < arr.length; ++i) {
    if (arr[i] > max) {
      bulbs = [];
      max = arr[i];
    }

    if (max === arr[i]) {
      bulbs.push(i);
    }
  }

  return {
    switches,
    bulbs: bulbs[Math.floor(rng() * bulbs.length)],
  }
};