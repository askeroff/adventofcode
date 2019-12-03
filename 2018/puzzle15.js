(function() {
  // let data = document.getElementsByTagName('pre')[0].innerHTML.split('\n');
  // data.pop();
  // data = data.map(item => item.split(''));
  const data = [
    '#######',
    '#.G...#',
    '#...EG#',
    '#.#.#G#',
    '#..G#E#',
    '#.....#',
    '#######'
  ].map(item => item.split(''));

  function Unit(x, y, type) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.isDead = false;
    this.hitPoints = 200;
    this.startingPoint = `${x}, ${y}`;
  }

  function createUnits(data) {
    let units = [];
    data.forEach((row, yIndex) => {
      row.forEach((value, xIndex) => {
        if (value === 'E' || value === 'G') {
          const unit = new Unit(xIndex, yIndex, value);
          units.push(unit);
        }
      });
    });
    return units;
  }

  function isBattleFinished(units) {
    const allElvesDead = units
      .filter(unit => unit.type === 'E')
      .every(item => item.isDead === true);
    const allGoblinsDead = units
      .filter(unit => unit.type === 'G')
      .every(item => item.isDead === true);
    return allElvesDead || allGoblinsDead;
  }

  function getOrderedUnits(units) {
    return units
      .sort((unit, other) => {
        if (unit.y === other.y) {
          return unit.x - other.x;
        }
        return unit.y - other.y;
      })
      .filter(item => item.isDead !== true);
  }

  function startRound(myUnits, data) {
    const units = getOrderedUnits(myUnits);
    units.forEach(unit => {
      makeAMove(unit, data, units);
    });
    return isBattleFinished(myUnits);
  }

  function identifyTargets(unit, data) {
    let result = [];
    const enemy = unit.type === 'G' ? 'E' : 'G';
    data.forEach((row, yIndex) => {
      row.forEach((value, xIndex) => {
        const isSelf = xIndex === unit.x && yIndex === unit.y;
        const isEnemy = value === enemy;
        if (!isSelf && isEnemy) {
          result.push({ x: xIndex, y: yIndex });
        }
      });
    });
    return result;
  }

  function getAdjacentPoints(target) {
    return {
      right: { y: target.y, x: target.x + 1 },
      left: { y: target.y, x: target.x - 1 },
      up: { y: target.y - 1, x: target.x },
      down: { y: target.y + 1, x: target.x }
    };
  }

  function inRange(targets, data) {
    let result = [];
    targets.forEach(target => {
      let enemy = { x: target.x, y: target.y };
      const adjacentPoints = getAdjacentPoints(target);
      Object.values(adjacentPoints).forEach(point => {
        if (data[point.y] && data[point.y][point.x] === '.') {
          point.enemy = enemy;
          result.push(point);
        }
      });
    });
    return getOrderedUnits(result);
  }

  function addCoords(arr, x, y) {
    if (!arr[y]) {
      arr[y] = [];
    }
    arr[y][x] = '.';
  }

  function findDistance(point1, point2) {
    const diff1 = point2.x - point1.x;
    const diff2 = point2.y - point1.y;
    return Math.abs(diff1) + Math.abs(diff2);
  }

  // function reachable(myUnit, whereTo, data) {
  //   let visited = [];
  //   const counts = [];
  //   addCoords(visited, myUnit.x, myUnit.y);
  //   const notVisited = (x, y) => visited[y] && visited[y][x];
  //   let found = false;
  //   let count = 0;
  //   if (myUnit.x === whereTo.x && myUnit.y === whereTo.y) {
  //     return 0;
  //   }
  //   function recursive(unit, to) {
  //     const adjacents = Object.values(getAdjacentPoints(unit))
  //       .map(item => {
  //         item.distance = findDistance(item, whereTo);
  //         return item;
  //       })
  //       .sort((a, b) => a.distance - b.distance);
  //     adjacents.forEach(point => {
  //       const coord = data[point.y] && data[point.y][point.x];
  //       if (point.y === to.y && point.x === to.x) {
  //         found = true;
  //       }
  //       const shouldCheckIt = notVisited(point.x, point.y) !== '.';
  //       if (!found && coord === '.' && shouldCheckIt) {
  //         addCoords(visited, point.x, point.y);
  //         if (recursive(point, to) === true) {
  //           count += 1;
  //         }
  //       }
  //     });
  //     if (found === true) {
  //       return true;
  //     }
  //   }

  //   recursive(myUnit, whereTo);

  //   console.log(counts);

  //   if (found) {
  //     return count;
  //   }
  //   return false;
  // }

  function reachable(myUnit, whereTo, data) {
    const unvisited = new Set();
    const distances = new Map();

    data.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === '.') {
          unvisited.add(`${y}-${x}`);
          distances.set(`${y}-${x}`, { distance: Infinity });
        }
      });
    });
    let current = `${myUnit.y}-${myUnit.x}`;
    distances.set(current, { distance: 0 });
    i = 0;
    while (current) {
      const nextDistance = distances.get(current).distance + 1;
      const unit = current.split('-');
      Object.values(getAdjacentPoints({ y: +unit[0], x: +unit[1] }))
        .filter(point => unvisited.has(`${point.y}-${point.x}`))
        .forEach(point => {
          const distance = distances.get(`${point.y}-${point.x}`).distance;
          const min = Math.min(distance, nextDistance);
          distances.set(`${point.y}-${point.x}`, { distance: min });
        });
      unvisited.delete(current);

      current =
        unvisited.size > 0
          ? [...unvisited].reduce((minimum, square) => {
              if (
                distances.get(minimum).distance <=
                distances.get(square).distance
              ) {
                return minimum;
              }
              return square;
            })
          : undefined;
    }

    const x = Object.values(getAdjacentPoints(whereTo))
      .map(point => {
        if (distances.get(`${point.y}-${point.x}`)) {
          return distances.get(`${point.y}-${point.x}`).distance;
        }
        return Infinity;
      })
      .filter(item => item);
    const endDistance = Math.min(...x);
    if (endDistance === Infinity) {
      return false;
    }
    return endDistance;
  }

  function findFewestSteps(distances) {
    let min = Infinity;
    distances.forEach(item => {
      if (item.distance < min) {
        min = item.distance;
      }
    });
    const filtered = distances.filter(item => item.distance === min);
    return getOrderedUnits(filtered)[0];
  }

  function findShortest(squares, unit, data) {
    const distances = squares
      .map(point => {
        point.distance = reachable(unit, point, data);
        return point;
      })
      .filter(item => item.distance !== false);
    return findFewestSteps(distances);
  }

  function checkEnemiesInRange(unit) {
    const adjacents = getAdjacentPoints(unit);
    let result = false;
    const enemy = unit.type === 'G' ? 'E' : 'G';
    Object.values(adjacents).forEach(point => {
      if (data[point.y] && data[point.y][point.x] === enemy) {
        result = true;
      }
    });
    return result;
  }

  function findUnit(x, y, units) {
    return units.find(item => item.x === x && item.y === y);
  }

  function toAttack(unit, units) {
    const adjacents = getAdjacentPoints(unit);
    const enemy = unit.type === 'G' ? 'E' : 'G';
    let minHP = Infinity;
    let enemies = [];
    Object.values(adjacents).forEach(unit => {
      if (data[unit.y] && data[unit.y][unit.x] === enemy) {
        const foundUnit = findUnit(unit.x, unit.y, units);
        if (foundUnit && foundUnit.hitPoints < minHP) {
          minHP = foundUnit.hitPoints;
          enemies.push(foundUnit);
        }
      }
    });
    return getOrderedUnits(enemies.filter(item => item.hitPoints === minHP))[0];
  }

  function didUnitDie(unit) {
    if (unit.hitPoints <= 0) {
      unit.isDead = true;
      data[unit.y][unit.x] = '.';
    }
  }

  function attack(unit, units) {
    let attackHappened = false;
    let attackPower = 3;
    const attacked = toAttack(unit, units);
    if (attacked) {
      attacked.hitPoints -= attackPower;
      didUnitDie(attacked);
      attackHappened = true;
    }
    return attackHappened;
  }

  function makeAMove(unit, data, units) {
    const wasInRangeAndAttacked = attack(unit, units);
    if (unit.isDead || wasInRangeAndAttacked) {
      return;
    }

    const targets = identifyTargets(unit, data);

    const openSquares = inRange(targets, data);

    const canReach = openSquares.filter(
      square => reachable(unit, square, data) !== false
    );
    const shortest = findShortest(canReach, unit, data);
    if (shortest && data[shortest.y] && data[shortest.y][shortest.x]) {
      const adjacentPoints = Object.values(getAdjacentPoints(unit));
      const distances = adjacentPoints
        .map(point => {
          if (data[point.y][point.x] !== '.') {
            point.cantMove = true;
          } else {
            point.distance = reachable(point, shortest, data);
          }
          if (point.y === shortest.y && point.x === shortest.x) {
            point.distance = 0;
          }
          return point;
        })
        .filter(item => item.cantMove !== true && item.distance !== false);
      const nextStep = findFewestSteps(distances);
      if (nextStep) {
        data[unit.y][unit.x] = '.';
        data[nextStep.y][nextStep.x] = unit.type;
        unit.y = nextStep.y;
        unit.x = nextStep.x;
      }
      attack(unit, units);
    }
  }

  function findAnswer(data) {
    let units = createUnits(data);
    let x = 0;
    let stop = false;
    while (stop !== true && x < 2) {
      x += 1;
      if (startRound(units, data) === true) {
        console.log('BATTLE IS FINISHED', x);
        stop = true;
      }
    }

    const unitsScore = units
      .filter(unit => unit.isDead !== true)
      .reduce((acc, value) => {
        return acc + value.hitPoints;
      }, 0);

    console.log(unitsScore);
    console.log(unitsScore * x);
    data.forEach(row => {
      console.log(row.join(''));
    });

    console.log(getOrderedUnits(units));

    // const test = [
    //   '########',
    //   '#......#',
    //   '#...E#.#',
    //   '#....#.#',
    //   '#.######',
    //   '##..G..#',
    //   '########'
    // ].map(item => item.split(''));
    // const firstLength = reachable(
    //   {
    //     y: 2,
    //     x: 4,
    //     type: 'E'
    //   },
    //   {
    //     y: 5,
    //     x: 5
    //   },
    //   test
    // );
    // console.log(firstLength, 'FIND LENGTH');
  }

  const answer = findAnswer(data);
})();
