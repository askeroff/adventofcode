(function() {
  // let data = [
  //   'position=< 9,  1> velocity=< 0,  2>',
  //   'position=< 7,  0> velocity=<-1,  0>',
  //   'position=< 3, -2> velocity=<-1,  1>',
  //   'position=< 6, 10> velocity=<-2, -1>',
  //   'position=< 2, -4> velocity=< 2,  2>',
  //   'position=<-6, 10> velocity=< 2, -2>',
  //   'position=< 1,  8> velocity=< 1, -1>',
  //   'position=< 1,  7> velocity=< 1,  0>',
  //   'position=<-3, 11> velocity=< 1, -2>',
  //   'position=< 7,  6> velocity=<-1, -1>',
  //   'position=<-2,  3> velocity=< 1,  0>',
  //   'position=<-4,  3> velocity=< 2,  0>',
  //   'position=<10, -3> velocity=<-1,  1>',
  //   'position=< 5, 11> velocity=< 1, -2>',
  //   'position=< 4,  7> velocity=< 0, -1>',
  //   'position=< 8, -2> velocity=< 0,  1>',
  //   'position=<15,  0> velocity=<-2,  0>',
  //   'position=< 1,  6> velocity=< 1,  0>',
  //   'position=< 8,  9> velocity=< 0, -1>',
  //   'position=< 3,  3> velocity=<-1,  1>',
  //   'position=< 0,  5> velocity=< 0, -1>',
  //   'position=<-2,  2> velocity=< 2,  0>',
  //   'position=< 5, -2> velocity=< 1,  2>',
  //   'position=< 1,  4> velocity=< 2,  1>',
  //   'position=<-2,  7> velocity=< 2, -2>',
  //   'position=< 3,  6> velocity=<-1, -1>',
  //   'position=< 5,  0> velocity=< 1,  0>',
  //   'position=<-6,  0> velocity=< 2,  0>',
  //   'position=< 5,  9> velocity=< 1, -2>',
  //   'position=<14,  7> velocity=<-2,  0>',
  //   'position=<-3,  6> velocity=< 2, -1>'
  // ];
  let data = document
    .getElementsByTagName('pre')[0]
    .innerHTML.split('\n')
    .map(item => {
      let str = item.replace(/\&lt;/gm, '<').replace(/\&gt;/gm, '>');
      return str.trim();
    });
  data.pop();

  function Coord(str) {
    const regex = /position=<(\s?-?\d*),(\s\s?-?\d*)> velocity=<(\s?-?\d*),(\s\s?-?\d*)>/;
    const test = regex.exec(str);
    this.x1 = Number(test[1]); // how far left or right (negative or positive)
    this.x2 = Number(test[2]); // how far up or down (negative or positive)
    this.v1 = Number(test[3]);
    this.v2 = Number(test[4]);
  }

  function createCoords(data) {
    return data.map(item => new Coord(item));
  }

  function getDistance(coords, maxVal) {
    let min = { x1: Infinity, x2: Infinity };
    let max = { x1: 0, x2: 0 };
    coords.forEach(coord => {
      if (coord.x1 < min.x1) {
        min.x1 = coord.x1;
      } else if (coord.x1 > max.x1) {
        max.x1 = coord.x1;
      }
      if (coord.x2 < min.x2) {
        min.x2 = coord.x2;
      } else if (coord.x2 > max.x2) {
        max.x2 = coord.x2;
      }
    });
    if (max.x1 - min.x1 < maxVal) {
      return { max, min };
    }
    return false;
  }

  function findAnswer(data) {
    const coords = createCoords(data);
    let seconds = 0;
    let farAway = false;
    while (!farAway && seconds < 2000000) {
      coords.forEach(coord => {
        coord.x1 = coord.x1 + coord.v1;
        coord.x2 = coord.x2 + coord.v2;
      });
      farAway = getDistance(coords, 62);
      seconds++;
    }
    if (farAway) {
      console.log('SECONDS TOOK: ', seconds);
      let strings = [];
      for (let i = 0; i <= farAway.max.x2 + 1; i++) {
        let s = '.'.repeat(farAway.max.x1 + 2);
        strings.push(s);
      }
      coords.forEach(coord => {
        let s = strings[coord.x2];
        s = s.substr(0, coord.x1) + '#' + s.substr(coord.x1 + 1);
        strings[coord.x2] = s;
      });
      document.getElementsByTagName('pre')[0].innerHTML = '';
      strings.forEach(value => {
        if ('.'.repeat(value.length) !== value) {
          document.getElementsByTagName('pre')[0].innerHTML += value;
          document.getElementsByTagName('pre')[0].innerHTML += '<br>';
        }
      });
    } else {
      console.log('NOTHING THAT CLOSE');
    }
  }

  const answer = findAnswer(data);
})();
