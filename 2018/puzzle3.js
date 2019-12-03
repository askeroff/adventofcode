(function() {
  const pre = document.getElementsByTagName('pre')[0];
  const data = pre.innerHTML.toString().split('\n');
  data.pop();

  function findAnswer(data) {
    const fabric = [];
    for (let i = 0; i < 1000; i++) {
      fabric[i] = [];
      fabric[i][1000] = '.';
      fabric[i].fill('.', 0, 1000);
    }

    let answer = 0;

    let ids = [];

    function addId(item) {
      if (ids.indexOf(item) === -1) {
        ids.push(item);
      }
    }

    data.forEach((item, index) => {
      const [id, secondPart] = item.split('@ ');
      const [points, dimensions] = secondPart.split(': ');
      const [left, top] = points.split(',').map(item => Number(item));
      const [width, height] = dimensions.split('x').map(item => Number(item));
      for (let i = top; i < top + height; i++) {
        for (let z = left; z < left + width; z++) {
          value = fabric[i][z];
          if (value === '.') {
            fabric[i][z] = item;
          } else if (value !== 'X') {
            fabric[i][z] = 'X';
            answer += 1;
            addId(item);
            addId(value);
          } else if (value === 'X') {
            addId(item);
            addId(value);
          }
        }
      }
    });

    const notOverlappingOne = data.filter(item => ids.indexOf(item) === -1);
    return [answer, notOverlappingOne];
  }

  const answer = findAnswer(data);
  console.log(answer);
})();
