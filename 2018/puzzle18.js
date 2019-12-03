(function() {
  // let data = [
  //   '.#.#...|#.',
  //   '.....#|##|',
  //   '.|..|...#.',
  //   '..|#.....#',
  //   '#.#|||#|#|',
  //   '...#.||...',
  //   '.|....|...',
  //   '||...#|.#|',
  //   '|.||||..|.',
  //   '...#.|..|.'
  // ].map(item => item.split(''));

  let data = document
    .getElementsByTagName('pre')[0]
    .innerHTML.split('\n')
    .map(item => item.split(''));
  data.pop();

  function clone(arr) {
    let result = arr.map(item => item.slice());
    return result;
  }

  let types = {
    open: '.',
    trees: '|',
    lumberyard: '#'
  };

  function getAdjacents(point) {
    // point = {x, y}
    return [
      { x: point.x, y: point.y - 1 },
      { x: point.x - 1, y: point.y - 1 },
      { x: point.x + 1, y: point.y - 1 },
      { x: point.x, y: point.y + 1 },
      { x: point.x - 1, y: point.y + 1 },
      { x: point.x + 1, y: point.y + 1 },
      { x: point.x - 1, y: point.y },
      { x: point.x + 1, y: point.y }
    ];
  }

  function checkSurroundings(point, compare, data) {
    const adjacents = getAdjacents(point);
    let n = 0;
    adjacents.forEach(adjacent => {
      if (data[adjacent.y] && data[adjacent.y][adjacent.x] === compare) {
        n += 1;
      }
    });
    return n;
  }

  function checkOpen(point, data, current) {
    if (checkSurroundings(point, types.trees, data) >= 3) {
      current[point.y][point.x] = types.trees;
    }
  }

  function checkTrees(point, data, current) {
    if (checkSurroundings(point, types.lumberyard, data) >= 3) {
      current[point.y][point.x] = types.lumberyard;
    }
  }

  function checkLumberyard(point, data, current) {
    const oneOtherLumberyard = checkSurroundings(point, types.lumberyard, data);
    const oneOtherTree = checkSurroundings(point, types.trees, data);
    if (oneOtherLumberyard < 1 || oneOtherTree < 1) {
      current[point.y][point.x] = '.';
    }
  }

  function checkPoint(point, data, current) {
    if (data[point.y][point.x] === types.open) {
      checkOpen(point, data, current);
    } else if (data[point.y][point.x] === types.trees) {
      checkTrees(point, data, current);
    } else if (data[point.y][point.x] === types.lumberyard) {
      checkLumberyard(point, data, current);
    }
  }

  function print(data) {
    data.forEach((row, y) => {
      console.log(row.join(''));
    });
  }

  function firstAnswer(data) {
    let trees = 0;
    let lumber = 0;
    data.forEach(row => {
      row.forEach(value => {
        if (value === types.trees) {
          trees += 1;
        } else if (value === types.lumberyard) {
          lumber += 1;
        }
      });
    });
    return trees * lumber;
  }

  function findAnswer(data) {
    let minutes = 0;
    let prevAnswer = 0;
    while (minutes < 1000) {
      const stateAtBeginning = clone(data);
      data.forEach((row, y) => {
        row.forEach((point, x) => {
          const coords = { x, y };
          checkPoint(coords, stateAtBeginning, data);
        });
      });
      minutes++;
    }
    // first answer put the minutes at 10 and find answer with firstAnswer
    // second answer look for patterns and for when first repeated, look at the values
    // in the next thousands element, for me it was to check the minute 1000th answer and it was
    // the right one

    let newAnswer = firstAnswer(data);
    console.log(newAnswer, ' :on minute ', minutes);
    prevAnswer = newAnswer;
  }

  const answer = findAnswer(data);

  // puzzle 18
})();
