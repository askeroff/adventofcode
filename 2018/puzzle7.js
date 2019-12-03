(function() {
  let data = [
    'Step C must be finished before step A can begin.',
    'Step C must be finished before step F can begin.',
    'Step A must be finished before step B can begin.',
    'Step A must be finished before step D can begin.',
    'Step B must be finished before step E can begin.',
    'Step D must be finished before step E can begin.',
    'Step F must be finished before step E can begin.'
  ];
  // let data = document.getElementsByTagName('pre')[0].innerHTML;
  // data = data.split('\n');
  // data.pop();

  function genCharArray(charA, charZ) {
    var a = [],
      i = charA.charCodeAt(0),
      j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
      a.push(String.fromCharCode(i));
    }
    return a;
  }
  const alphabet = genCharArray('a', 'z');

  function getTime(value) {
    const index = alphabet.findIndex(
      letter => letter.toLowerCase() === value.toLowerCase()
    );
    return index + 61;
  }

  function isNext(obj, value) {
    let result;
    for (let prop in obj) {
      if (result !== true) {
        const found = obj[prop].find(item => item === value);
        result = found !== undefined;
      }
    }
    return !result;
  }

  function getSteps(str) {
    const regex = /Step\s(.{1}) must be finished before step (.{1}) can begin/;
    const parsed = str.match(regex);
    return [parsed[1], parsed[2]];
  }

  function findAnswer(data) {
    let obj = {};
    const order = [];
    const stepNames = [];
    const needBefore = {};
    let lookedAt = [];
    let gate = 0;
    while (order.length < 26 && gate < 300) {
      data.forEach((item, index) => {
        // debugger;
        const [stepName, beforeStep] = getSteps(item);
        if (order.indexOf(stepName) === -1) {
          obj[`stepname-${stepName}`] = obj[`stepname-${stepName}`] || [];
          obj[`stepname-${stepName}`].push(beforeStep);
        }
        needBefore[`${beforeStep}`] = needBefore[`${beforeStep}`] || [];
        if (needBefore[`${beforeStep}`].indexOf(stepName) === -1) {
          needBefore[`${beforeStep}`].push(stepName);
        }
        if (stepNames.indexOf(beforeStep) === -1) {
          stepNames.push(beforeStep);
        } else if (stepNames.indexOf(stepName) === -1) {
          stepNames.push(stepName);
        }
      });

      let newStuff = [];
      data.forEach((item, index) => {
        const [stepName, beforeStep] = getSteps(item);
        if (order.indexOf(stepName) === -1) {
          const shouldAdd = isNext(obj, stepName);
          if (shouldAdd && newStuff.indexOf(stepName) === -1) {
            newStuff.push(stepName);
          }
        }
      });
      if (newStuff.length) {
        order.push(newStuff.sort()[0]);
      }
      obj = {};
      gate++;
    }
    const filtered = stepNames.filter(item => order.indexOf(item) === -1);
    order.push(filtered[0]);
    return { firstAnswer: order.join(''), inThisOrder: needBefore };
  }

  /// SECOND PART **************************************

  function getSecondAnswer(order, answer) {
    console.log(order, 'order');
    let seconds = 0;
    let result;
    let processed = [];
    let schedule = {};
    let workers = [
      { willBeFree: 0 },
      { willBeFree: 0 },
      { willBeFree: 0 },
      { willBeFree: 0 },
      { willBeFree: 0 }
    ];

    function getFreeWorker(seconds) {
      let minFree = Infinity;
      let worker;
      let howManyFree = workers.filter((item, index) => {
        if (item.willBeFree < minFree && seconds >= item.willBeFree) {
          minFree = item.willBeFree;
          worker = item;
        }
        return seconds >= item.willBeFree;
      });
      return worker;
    }

    function isFirst(letter) {
      let found = false;
      for (let prop in order) {
        if (prop === letter) {
          found = true;
        }
      }
      return !found;
    }

    function processedAllBefore(letter) {
      let result = true;
      order[letter].forEach(item => {
        if (processed.indexOf(item) === -1) {
          result = false;
        }
      });
      return result;
    }

    while (!result) {
      answer.split('').forEach((letter, index) => {
        const time = getTime(letter);
        const isReady = isFirst(letter) || processedAllBefore(letter);
        const freeWorker = isReady && getFreeWorker(seconds);
        const notScheduled = schedule[letter] === undefined;
        if (isReady && freeWorker && notScheduled) {
          freeWorker.willBeFree += time;
          schedule[letter] = freeWorker.willBeFree;
          if (index === answer.length - 1) {
            result = seconds + time;
          }
        }
        if (schedule[letter] === seconds) {
          processed.push(letter);
        }
      });

      workers.forEach(worker => {
        if (worker.willBeFree <= seconds) {
          worker.willBeFree += 1;
        }
      });

      seconds++;
    }
    console.log(result);
  }

  const answer = findAnswer(data);

  getSecondAnswer(answer.inThisOrder, answer.firstAnswer);
})();
