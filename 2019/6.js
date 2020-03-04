(function () {
  let data = document.getElementsByTagName('pre')[0].innerHTML.split('\n');
  data.pop();

  const orbits = {};

  data.forEach(item => {
    const items = item.split(")");
    if (orbits[items[1]] === undefined) {
      orbits[items[1]] = {direct: items[0]};
    }
  });

  function countOrbits(prop, obj = orbits) {
    let i = 0;
    let p = prop;
    while (obj[p]) {
      p = obj[p].direct;
      if (obj[prop]) {
        obj[prop].indirect = obj[prop].indirect ? obj[prop].indirect : [];
        obj[prop].indirect.push(p);
      }
      i += 1;
    }
    return i;
  }

  function part1() {
    let sum = 0;
    for (let key in orbits) {
      if (orbits[key]) {
        const test = countOrbits(key);
        sum += test;
      }
    }
    console.log(sum, 'answer to part 1');
  }

  part1();

  function part2() {
    let min = 0;
    orbits['YOU'].indirect.forEach((item, index) => {
      orbits['SAN'].indirect.forEach((secondItem, secondIndex) => {
        if (item === secondItem && min === 0) {
          min = index + secondIndex
        }
      })
    });
    console.log(min, 'answer to second part');
  }

  part2();
})();
