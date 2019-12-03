(function() {
  let data = document
    .getElementsByTagName('pre')[0]
    .innerHTML.split('\n')
    .map(item => {
      return convertHTMLSymbols(item).split('');
    });

  function convertHTMLSymbols(str) {
    return str.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
  }

  const backDirChange = {
    ['moves>']: 'v',
    ['moves<']: '^',
    ['movesv']: '>',
    ['moves^']: '<'
  };

  const forwDirChange = {
    ['moves>']: '^',
    ['moves<']: 'v',
    ['movesv']: '<',
    ['moves^']: '>'
  };

  const curves = [`\\`, `/`];

  const moveMe = {
    goRight(car) {
      car.position += 1;
      return car;
    },
    goLeft(car) {
      car.position -= 1;
      return car;
    },
    goUp(car) {
      car.row -= 1;
      return car;
    },
    goDown(car) {
      car.row += 1;
      return car;
    }
  };

  function shouldChangeDirection(car, data) {
    if (data[car.row] && data[car.row][car.position] === curves[0]) {
      car.moves = backDirChange[`moves${car.moves}`];
    } else if (data[car.row] && data[car.row][car.position] === curves[1]) {
      car.moves = forwDirChange[`moves${car.moves}`];
    }
  }

  function isAtIntersection(car) {
    if (car.nextIntersection === 'straight') {
      car.nextIntersection = 'right';
      return;
    }
    if (car.nextIntersection === 'left' && car.moves === 'v') {
      car.moves = '>';
      car.nextIntersection = 'straight';
    } else if (car.nextIntersection === 'right' && car.moves === 'v') {
      car.moves = '<';
      car.nextIntersection = 'left';
    } else if (car.nextIntersection === 'left' && car.moves === '^') {
      car.moves = '<';
      car.nextIntersection = 'straight';
    } else if (car.nextIntersection === 'right' && car.moves === '^') {
      car.moves = '>';
      car.nextIntersection = 'left';
    } else if (car.nextIntersection === 'left' && car.moves === '<') {
      car.moves = 'v';
      car.nextIntersection = 'straight';
    } else if (car.nextIntersection === 'right' && car.moves === '<') {
      car.moves = '^';
      car.nextIntersection = 'left';
    } else if (car.nextIntersection === 'left' && car.moves === '>') {
      car.moves = '^';
      car.nextIntersection = 'straight';
    } else if (car.nextIntersection === 'right' && car.moves === '>') {
      car.moves = 'v';
      car.nextIntersection = 'left';
    }
  }

  function makeMove(car, data) {
    if (car.moves === '<') {
      moveMe.goLeft(car);
    } else if (car.moves === '>') {
      moveMe.goRight(car);
    } else if (car.moves === 'v') {
      moveMe.goDown(car);
    } else if (car.moves === '^') {
      moveMe.goUp(car);
    }
    if (data[car.row][car.position] === '+') {
      isAtIntersection(car);
    } else {
      shouldChangeDirection(car, data);
    }
  }

  function carHasSameCoords(car, cars) {
    let result = false;
    cars.forEach(myCar => {
      if (myCar.crashed === true || myCar.crashed === true) {
        return;
      } else if (
        myCar.row === car.row &&
        car.position === myCar.position &&
        car.firstPosition !== myCar.firstPosition
      ) {
        car.crashed = true;
        myCar.crashed = true;
        result = true;
      }
    });
    return result;
  }

  function arrangeOrderOfMoves(cars) {
    return cars
      .sort((a, b) => {
        if (a.row === b.row) {
          return a.position - b.position;
        }
        return a.row - b.row;
      })
      .filter(car => car.crashed === false);
  }

  function howManyCartsLeft(cars) {
    let i = 0;
    let myCar;
    cars.forEach(car => {
      if (!car.crashed) {
        i += 1;
        myCar = car;
      }
    });
    return { number: i, car: myCar };
  }

  function findAnswer(data) {
    const carPositions = [];
    const carMoves = ['>', '<', '^', 'v'];
    data.forEach((row, yIndex) => {
      row.forEach((value, xIndex) => {
        if (carMoves.indexOf(value) !== -1) {
          carPositions.push({
            firstPosition: `${xIndex}, ${yIndex}`,
            row: yIndex,
            position: xIndex,
            moves: value,
            crashed: false,
            nextIntersection: 'left'
          });
        }
      });
    });
    let firstAnswer = [];
    let secondAnswer = [];
    for (let i = 0; i < 20000; i++) {
      arrangeOrderOfMoves(carPositions).forEach(car => {
        if (!car.crashed) {
          makeMove(car, data);
        }
        let check = carHasSameCoords(car, carPositions);
        if (check && firstAnswer.length === 0) {
          firstAnswer = [car.position, car.row];
        }
        let remaining = howManyCartsLeft(carPositions);
        if (remaining.number === 1) {
          secondAnswer = [remaining.car.position, remaining.car.row];
          i = Infinity;
        }
      });
    }
    console.log(firstAnswer, secondAnswer);
    return {
      firstAnswer,
      secondAnswer
    };
  }

  const answer = findAnswer(data);
})();
