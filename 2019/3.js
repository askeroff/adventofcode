(function () {

  const directions = {L: [-1, 0], R: [1, 0], U: [0, 1], D: [0, -1]};

  function step(direction, current, path) {
    current.y += directions[direction][1];
    current.x += directions[direction][0];
    current.steps += 1;
    const markCrossed = path[`${current.x}, ${current.y}`] && current.cross;
    path[`${current.x}, ${current.y}`] = markCrossed ? 'crossed' : true;
    current[`${current.x}, ${current.y}steps`] = current.steps;
  }

  function move(coord, current, path) {
    const steps = coord.slice(1);
    const direction = coord[0];
    for (let i = 0; i < +steps; i++) {
      step(direction, current, path);
    }
  }

  function manhattanDistance(coord) {
    const split = coord.split(", ");
    return Math.abs(split[0]) + Math.abs(split[1]);
  }

  function solveDay3(data) {
    let twoWires = (data && data.split('\n')) || document.getElementsByTagName('pre')[0].innerHTML.split('\n');
    let firstWire = twoWires[0].split(',');
    let secondWire = twoWires[1].split(',');
    const path = {};
    let current = {x: 0, y: 0, steps: 0};

    firstWire.forEach(coord => {
      move(coord, current, path);
    });

    let current2 = {x: 0, y: 0, steps: 0, cross: true};

    secondWire.forEach(coord => {
      move(coord, current2, path);
    });

    let minimumDistance = Infinity;
    let bestSum = Infinity;

    for (let key in path) {
      if (path[key] === 'crossed') {
        const sum = current[`${key}steps`] + current2[`${key}steps`];
        const mDistance = manhattanDistance(key);
        if (sum < bestSum) {
          bestSum = sum;
        }

        if (mDistance < minimumDistance) {
          minimumDistance = mDistance;
        }
      }
    }

    console.log(minimumDistance, bestSum);

  }


  // let str = 'R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83';
  // let str = 'R8,U5,L5,D3\nU7,R6,D4,L4';
  // let str = 'R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83';
  solveDay3();

})();

