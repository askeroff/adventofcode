(function() {
  let data = document
    .getElementsByTagName('pre')[0]
    .innerHTML.split('\n')
    .map(item => item.split(''));
  const firstData = [
    '#######',
    '#.G...#',
    '#...EG#',
    '#.#.#G#',
    '#..G#E#',
    '#.....#',
    '#######'
  ].map(item => item.split(''));

  const secondData = [
    '#######',
    '#G..#E#',
    '#E#E.E#',
    '#G.##.#',
    '#...#E#',
    '#...E.#',
    '#######'
  ].map(item => item.split(''));

  function Unit(x, y, type) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.hitPoints = 200;
    this.dmg = 3;
    this.isDead = false;
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

  function getAdjacentPoints(target, data, compare = '.') {
    const obj = {
      right: { y: target.y, x: target.x + 1 },
      left: { y: target.y, x: target.x - 1 },
      up: { y: target.y - 1, x: target.x },
      down: { y: target.y + 1, x: target.x }
    };
    return Object.values(obj).filter(
      item => data[item.y] && data[item.y][item.x] === compare
    );
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

  function findAllOpenSquares(data) {
    const unvisited = new Set();
    const distances = new Map();
    data.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === '.') {
          const key = `${x}-${y}`;
          unvisited.add(key);
          distances.set(key, Infinity);
        }
      });
    });
    return { unvisited, distances };
  }

  function findPath(unit, enemy, data) {
    const { unvisited, distances } = findAllOpenSquares(data);
    // debugger;
    let current = `${unit.x}-${unit.y}`;
    distances.set(current, 0);
    while (current) {
      const nextDistance = distances.get(current) + 1;
      const unit = current.split('-');
      const points = getAdjacentPoints({ x: +unit[0], y: +unit[1] }, data);
      points
        .filter(point => unvisited.has(`${point.x}-${point.y}`))
        .forEach(point => {
          const distance = distances.get(`${point.x}-${point.y}`);
          const min = Math.min(distance, nextDistance);
          distances.set(`${point.x}-${point.y}`, min);
        });
      unvisited.delete(current);

      current =
        unvisited.size > 0
          ? [...unvisited].reduce((minimum, square) => {
              if (distances.get(minimum) <= distances.get(square)) {
                return minimum;
              }
              return square;
            })
          : undefined;
    }
    // if (enemy.startingPoint === '4, 4') {
    //   debugger;
    // }
    const x = getAdjacentPoints(enemy, data)
      .map(point => {
        const distance = distances.get(`${point.x}-${point.y}`);
        if (distance !== undefined) {
          const item = {
            x: point.x,
            y: point.y,
            distance
          };
          return item;
        }
        return Infinity;
      })
      .filter(item => item !== Infinity);
    const min = Math.min(...x.map(item => item.distance));
    let filtered = getOrderedUnits(x.filter(item => item.distance === min));

    return { filtered, distances };
  }

  function attack(unit, units, enemies, data) {
    let minHP = Infinity;
    let foundEnemies = [];
    enemies.forEach(item => {
      const find = units.find(u => u.x === item.x && u.y === item.y);
      foundEnemies.push(find);
    });
    foundEnemies.forEach(item => {
      if (item.hitPoints < minHP) {
        minHP = item.hitPoints;
      }
    });
    const enemyToAttack = getOrderedUnits(
      foundEnemies.filter(item => item.hitPoints === minHP)
    )[0];
    enemyToAttack.hitPoints -= unit.dmg;
    if (enemyToAttack.hitPoints <= 0) {
      data[enemyToAttack.y][enemyToAttack.x] = '.';
      enemyToAttack.isDead = true;
    }
  }

  function enemiesInRange(unit, units, data) {
    const enemy = unit.type === 'G' ? 'E' : 'G';
    const adjacents = getAdjacentPoints(unit, data, enemy);
    adjacents.length && attack(unit, units, adjacents, data);
    return adjacents.length;
  }

  function makeAMove(unit, data, units) {
    if (unit.isDead === true || enemiesInRange(unit, units, data) > 0) {
      return;
    }
    const targets = identifyTargets(unit, data);
    const reachable = [];
    targets.forEach(target => {
      // const adjacents = getAdjacentPoints(target, data);
      const distance = findPath(unit, target, data).filtered;
      distance[0] && reachable.push(distance[0]);
    });

    if (reachable.filter(item => item.distance !== Infinity).length > 0) {
      // if (unit.type === 'E') debugger;
      let min = Infinity;
      const nearest = getOrderedUnits(
        reachable
          .map(item => {
            if (item.distance < min) {
              min = item.distance;
            }
            return item;
          })
          .filter(item => item.distance === min)
      )[0];
      const next = findPath(nearest, unit, data).filtered[0];
      // if (next === undefined) debugger;
      data[unit.y][unit.x] = '.';
      data[next.y][next.x] = unit.type;
      unit.y = next.y;
      unit.x = next.x;
      enemiesInRange(unit, units, data);
    }
  }

  function isBattleFinished(units) {
    const allElvesDead = units
      .filter(unit => unit.type === 'E')
      .every(item => item.isDead === true);
    const allGoblinsDead = units
      .filter(unit => unit.type === 'G')
      .every(item => item.isDead === true);
    return {
      allElvesDead,
      allGoblinsDead
    };
  }

  function startRound(myUnits, data) {
    const units = getOrderedUnits(myUnits);
    units.forEach(unit => {
      makeAMove(unit, data, units);
    });
  }

  function printData(data) {
    data.forEach(row => {
      console.log(row.join(''));
    });
  }

  function findAnswer(data) {
    let units = createUnits(data);
    let roundsNumber = 0;
    let stop = false;
    while (stop !== true && roundsNumber < 100) {
      startRound(units, data);
      const battleFinished = isBattleFinished(units);
      roundsNumber += 1;
      if (battleFinished.allElvesDead) {
        console.log('Goblins Won!', roundsNumber);
        stop = true;
      } else if (battleFinished.allGoblinsDead) {
        console.log('Elves won', roundsNumber);
        stop = true;
      }
    }
    // PART ONE
    printData(data);
    const unitsScore = units
      .filter(unit => unit.isDead !== true)
      .reduce((acc, value) => {
        return acc + value.hitPoints;
      }, 0);
    console.log('score', unitsScore);
    console.log(unitsScore * roundsNumber);
    console.log(units);
  }

  // to find the right answer I might want to subtract one from roundsNumber
  // since I didn't want to bother with tracking full rounds
  const answer1 = findAnswer(data);
  // console.log('=======================================');
  // console.log('RESULT SHOULD BE 37 rounds * 982 score 36334');
  // const answer2 = findAnswer(secondData);
})();
