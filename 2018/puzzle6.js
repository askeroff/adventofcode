(function() {
  let data = document.getElementsByTagName('pre')[0].innerHTML;
  data = data.split('\n');
  data.pop();
  // const data = ['1,1', '1,6', '8, 3', '3,4', '5,5', '8,9'];

  function makeGrid(n) {
    const fabric = [];
    for (let i = 0; i <= n; i++) {
      fabric[i] = [];
      fabric[i][n] = '.';
      fabric[i].fill('.', 0, n);
    }
    return fabric;
  }

  function findDistance(x1, x2, y1, y2) {
    const diff1 = x2 - x1;
    const diff2 = y2 - y1;
    return Math.abs(diff1) + Math.abs(diff2);
  }

  function remove_duplicates(arr) {
    var obj = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
      obj[arr[i]] = true;
    }
    for (var key in obj) {
      ret_arr.push(key);
    }
    return ret_arr;
  }

  function findAnswer(data) {
    // let grid = makeGrid(9);
    const grid = makeGrid(354);
    // const lessThan = 32;
    const lessThan = 10000;
    const lessThanLocations = [];
    const infinites = [];

    function putLocationsInGrid() {
      data.forEach((item, index) => {
        const [x, y] = item.split(',').map(str => Number(str.trim()));
        let name = `#${index}`;
        grid[y][x] = name;
      });
    }

    function putThemIn() {
      grid.forEach((row, indexY) => {
        row.forEach((item, indexX) => {
          let minIndex;
          let minValue = Infinity;
          let currentDistance = 0;
          let repeated = false;
          data.forEach((coord, coordIndex) => {
            const [x, y] = coord.split(',').map(str => Number(str.trim()));
            const distance = findDistance(indexX, x, indexY, y);
            currentDistance += distance;
            if (distance === minValue) {
              minValue = distance;
              repeated = true;
            } else if (distance < minValue) {
              minIndex = coordIndex;
              minValue = distance;
              repeated = false;
            }
          });

          let name = `#${data[minIndex]}`;
          if (currentDistance < lessThan) {
            lessThanLocations.push(`${indexY},${indexX}`);
          }
          if (repeated === true) {
            grid[indexY][indexX] = `.`;
          } else {
            grid[indexY][indexX] = name;
          }
          if (indexX === 0 || indexX === grid.length - 1) {
            infinites.push(name.slice(1));
          } else if (indexY === 0 || indexY == grid.length - 1) {
            infinites.push(name.slice(1));
          }
        });
      });
    }

    putThemIn();
    const reduceInfinites = remove_duplicates(infinites);

    let index;
    let size = 0;

    data.forEach((coord, myIndex) => {
      const goesInfinitely = reduceInfinites.indexOf(coord) !== -1;
      let newSize = 0;
      if (!goesInfinitely) {
        grid.forEach(value => {
          const filtered = value.filter(item => item === `#${coord}`);
          newSize += filtered.length;
        });
      }
      if (newSize > size) {
        size = newSize;
        index = myIndex;
      }
    });

    return { firstAnswer: size, secondAnswer: lessThanLocations.length };
  }

  const answer = findAnswer(data);

  console.log(answer);
})();
