(function() {
  // let data = [
  //   'x=495, y=2..7',
  //   'y=7, x=495..501',
  //   'x=501, y=3..7',
  //   'x=498, y=2..4',
  //   'x=506, y=1..2',
  //   'y=11, x=500..502',
  //   'y=12, x=500..502',
  //   'x=498, y=9..13',
  //   'x=504, y=9..13',
  //   'y=13, x=498..504'
  // ];
  // let gridN = 600;

  let data = document.getElementsByTagName('pre')[0].innerHTML.split('\n');
  data.pop();
  let gridN = 3000;

  let minY = Infinity;
  let maxY = 0;
  let minX = Infinity;
  let maxX = 0;
  let types = {
    water: '~',
    dry: '|',
    clay: '#',
    sand: '.'
  };

  function getFirstValue(str) {
    if (str[0] === 'x') {
      return { x: +str.slice(2) };
    } else {
      return { y: str.slice(2) };
    }
  }

  function getSecondValue(str) {
    let values = str.slice(2).split('..');
    let start = +values[0];
    let end = +values[1];
    let result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  }

  function makeGrid(n) {
    const fabric = [];
    for (let i = 0; i <= n; i++) {
      fabric[i] = [];
      fabric[i][n] = '.';
      fabric[i].fill('.', 0, n);
    }
    return fabric;
  }

  function putValuesInGrid(first, second, grid) {
    let arr = Array.isArray(first) ? first : second;
    let x = Array.isArray(first) ? second.x : first.x;
    let y = Array.isArray(first) ? second.y : first.y;
    if (y) {
      grid[y].forEach((item, i) => {
        if (arr.indexOf(i) > 0) {
          grid[y][i] = '#';
        }
      });
    } else {
      for (let i = arr[0]; i <= arr[arr.length - 1]; i++) {
        grid[i][x] = '#';
      }
    }
  }

  function fillGrid() {
    const grid = makeGrid(gridN);
    grid[0][500] = '+';
    data.forEach(str => {
      let splitMe = str.split(', ');
      let first = getFirstValue(splitMe[0]);
      let second = getSecondValue(splitMe[1]);
      let x = first.x !== undefined ? first : second;
      let y = first.y !== undefined ? first : second;
      if (Array.isArray(y)) {
        minY = y[0] < minY ? y[0] : minY;
        maxY = y[y.length - 1] > maxY ? y[y.length - 1] : maxY;
      } else {
        minY = y < minY ? y : minY;
        maxY = y > maxY ? y : maxY;
      }
      if (Array.isArray(x)) {
        minX = x[0] < minX ? x[0] : minX;
        maxX = x[x.length - 1] > maxX ? x[x.length - 1] : maxX;
      } else {
        minX = x < minX ? x : minX;
        maxX = x > maxX ? x : maxX;
      }
      putValuesInGrid(first, second, grid);
    });
    return grid;
  }

  function goSideway(grid, x, i, value) {
    let xVal = x + value;
    let fallsThrough = false;
    while (
      (grid[i][xVal] === types.sand || grid[i][xVal] === types.dry) &&
      x >= 0 &&
      !fallsThrough
    ) {
      grid[i][xVal] = types.dry;
      const bottom = grid[i + 1][xVal];
      const isFalling = bottom === types.sand || bottom === types.dry;
      if (isFalling) {
        fallsThrough = true;
      } else {
        xVal += value;
      }
    }
    if (fallsThrough) {
      return xVal;
    }
    if (grid[i][xVal] == types.clay) {
      return null;
    }
  }

  function settleWater(grid, x, y) {
    for (let z = x; grid[y][z] !== types.clay; z++) {
      grid[y][z] = types.water;
    }
    for (let z = x; grid[y][z] !== types.clay; z--) {
      grid[y][z] = types.water;
    }
  }

  function lookDown(x, y, grid) {
    let i = y + 1;
    let canGoDown = grid[i][x] === types.sand || grid[i][x] === types.dry;
    while (canGoDown && i <= maxY) {
      grid[i][x] = types.dry;
      i++;
      canGoDown = grid[i][x] === types.sand || grid[i][x] === types.dry;
    }
    let canSettle = grid[i][x] === types.clay || grid[i][x] === types.water;

    if (canSettle && i <= maxY && grid[i - 1][x] !== types.water) {
      i = i - 1;
      let leftX = goSideway(grid, x, i, -1);
      let rightX = goSideway(grid, x, i, 1);
      if (leftX) {
        grid[i + 1][leftX] = types.dry;
        lookDown(leftX, i + 1, grid);
      }
      if (rightX) {
        grid[i + 1][rightX] = types.dry;
        lookDown(rightX, i + 1, grid);
      }
      leftX = goSideway(grid, x, i, -1);
      rightX = goSideway(grid, x, i, 1);
      if (leftX === null && rightX === null) {
        settleWater(grid, x, i);
        lookDown(x, y, grid);
      }
    }
  }

  function printData(grid) {
    let str = '';
    grid.slice(0, maxY + 1).forEach((row, index) => {
      str += row.slice(minX, maxX + 10).join('');
      str += '<br>';
    });
    document.body.style.fontSize = '18px';
    document.body.innerHTML = '<code>' + str + '</code>';

    // console.log('===========================');
    // grid.slice(0, maxY + 1).forEach((row, index) => {
    //   console.log(row.slice(minX, maxX + 10).join(''));
    // });
  }

  function calculateAnswer(grid) {
    let answer = 0;
    let secondAnswer = 0;
    grid.forEach((row, y) => {
      row.forEach(value => {
        let isWater = value === types.water || value === types.dry;
        let isSettled = value === types.water;
        if (y <= maxY && y >= minY && isWater) {
          answer += 1;
        }
        if (y <= maxY && y >= minY && isSettled) {
          secondAnswer += 1;
        }
      });
    });
    console.log(answer, 'answer');
    console.log(secondAnswer, 'second answer');
  }

  function findAnswer() {
    const grid = fillGrid();
    lookDown(500, 0, grid);
    calculateAnswer(grid);
    printData(grid);
  }

  const answer = findAnswer();
})();
// 39557 first answer
// 32984 second answer
