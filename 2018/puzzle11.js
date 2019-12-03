(function() {
  function findFuelLevel(cell, serial) {
    const [x, y] = cell.split(',').map(item => Number(item));
    let rackID = x + 10;
    let fuel = rackID * y + serial;
    fuel *= rackID;
    let hundreds = fuel.toString().length - 3;
    let number = 0;
    if (hundreds >= 0) {
      number = fuel.toString().split('')[hundreds];
    }
    number -= 5;
    return number;
  }

  function makeGrid() {
    const fabric = [];
    for (let i = 0; i < 300; i++) {
      fabric[i] = [];
      for (let z = 0; z < 300; z++) {
        fabric[i][z] = { coord: `${z + 1}, ${i + 1}`, power: null };
      }
    }
    return fabric;
  }

  function checkSquare(grid, y, x, size) {
    let currentPower = 0;
    for (let i = 0; i < size; i++) {
      for (let z = 0; z < size; z++) {
        currentPower += grid[y + i][x + z].power;
      }
    }
    return currentPower;
  }

  function findAnswer(puzzleInput) {
    const grid = makeGrid();
    grid.forEach(row => {
      row.forEach(value => {
        const fuel = findFuelLevel(value.coord, puzzleInput);
        value.power = fuel;
      });
    });

    function checkIt(size) {
      let maxTotalPower = -Infinity;
      let currentIndex = { x: null, y: null };
      let answer;
      grid.forEach((row, yIndex) => {
        row.forEach((value, xIndex) => {
          let currentPower = 0;
          if (
            grid[yIndex + size - 1] !== undefined &&
            grid[yIndex][xIndex + size - 1] !== undefined
          ) {
            currentPower = checkSquare(grid, yIndex, xIndex, size);
          }
          if (currentPower > maxTotalPower) {
            maxTotalPower = currentPower;
            currentIndex.x = xIndex + 1;
            currentIndex.y = yIndex + 1;
            answer = grid[yIndex][xIndex].coord;
          }
        });
      });
      return { answer, power: maxTotalPower };
    }
    const firstAnswer = checkIt(3);
    let secondAnswer = { power: 0 };
    let i = 1;
    // ? how to make it fast??
    while (i < 15) {
      let testSecondAnswer = checkIt(i);
      if (
        testSecondAnswer.answer &&
        testSecondAnswer.power > secondAnswer.power
      ) {
        secondAnswer = testSecondAnswer;
        secondAnswer.size = i;
      }
      i++;
    }
    console.log(firstAnswer, secondAnswer);
  }

  const answer = findAnswer(6392);
})();
