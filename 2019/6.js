(function () {
  let data = document.getElementsByTagName('pre')[0].innerHTML.split('\n');
  data.pop();
  console.log(data);

  const orbits = {};

  data.forEach(item => {
    const items = item.split(")");
    if (orbits[items[1]] === undefined) {
      orbits[items[1]] = items[0];
    }
  });

  function getOrbit(prop) {
    let i = 0;
    let p = prop;
    while (orbits[p]) {
      p = orbits[p];
      i += 1;
    }
    return i;
  }

  let sum = 0;

  for (let key in orbits) {
    if (orbits[key]) {
      const test = getOrbit(key);
      sum += test;
    }
  }

  console.log(sum, orbits);
})();
