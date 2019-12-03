(function() {
  let data = document.getElementsByTagName('pre')[0].innerHTML.split('\n');

  function getABC(instr) {
    return {
      A: instr[1],
      B: instr[2],
      C: instr[3],
      opcode: instr[0]
    };
  }
  const ops = {
    addr(instr, input) {
      const copy = [...input];
      const obj = getABC(instr);
      copy[obj.C] = copy[obj.A] + copy[obj.B];
      return copy;
    },
    addi(instr, input) {
      const copy = [...input];
      const obj = getABC(instr);
      copy[obj.C] = copy[obj.A] + obj.B;
      return copy;
    },
    mulr(instr, input) {
      const copy = [...input];
      const obj = getABC(instr);
      copy[obj.C] = copy[obj.A] * copy[obj.B];
      return copy;
    },
    muli(instr, input) {
      const copy = [...input];
      const obj = getABC(instr);
      copy[obj.C] = copy[obj.A] * obj.B;
      return copy;
    },
    banr(instr, input) {
      const copy = [...input];
      const obj = getABC(instr);
      copy[obj.C] = copy[obj.A] & copy[obj.B];
      return copy;
    },
    bani(instr, input) {
      const copy = [...input];
      const obj = getABC(instr);
      copy[obj.C] = copy[obj.A] & obj.B;
      return copy;
    },
    borr(instr, input) {
      const copy = [...input];
      const obj = getABC(instr);
      copy[obj.C] = copy[obj.A] | copy[obj.B];
      return copy;
    },
    bori(instr, input) {
      const copy = [...input];
      const obj = getABC(instr);
      copy[obj.C] = copy[obj.A] | obj.B;
      return copy;
    },
    setr(instr, input) {
      const copy = [...input];
      const obj = getABC(instr);
      copy[obj.C] = copy[obj.A];
      return copy;
    },
    seti(instr, input) {
      const copy = [...input];
      const obj = getABC(instr);
      copy[obj.C] = obj.A;
      return copy;
    },
    gtir(instr, input) {
      const copy = [...input];
      const obj = getABC(instr);
      copy[obj.C] = obj.A > copy[obj.B] ? 1 : 0;
      return copy;
    },
    gtri(instr, input) {
      const copy = [...input];
      const obj = getABC(instr);
      copy[obj.C] = copy[obj.A] > obj.B ? 1 : 0;
      return copy;
    },
    gtrr(instr, input) {
      const copy = [...input];
      const obj = getABC(instr);
      copy[obj.C] = copy[obj.A] > copy[obj.B] ? 1 : 0;
      return copy;
    },
    eqir(instr, input) {
      const copy = [...input];
      const obj = getABC(instr);
      copy[obj.C] = obj.A === copy[obj.B] ? 1 : 0;
      return copy;
    },
    eqri(instr, input) {
      const copy = [...input];
      const obj = getABC(instr);
      copy[obj.C] = copy[obj.A] === obj.B ? 1 : 0;
      return copy;
    },
    eqrr(instr, input) {
      const copy = [...input];
      const obj = getABC(instr);
      copy[obj.C] = copy[obj.A] === copy[obj.B] ? 1 : 0;
      return copy;
    }
  };
  const keepTrack = {};

  function equal(output, after) {
    let result = true;
    output.forEach((item, index) => {
      if (item !== after[index]) {
        result = false;
      }
    });
    return result;
  }

  function checkInput(before, after, instr) {
    let i = 0;
    for (let key in ops) {
      const result = ops[key](instr, before);
      if (equal(result, after)) {
        ops[key].optCodes = ops[key].optCodes ? ops[key].optCodes : [];
        ops[key].optCodes.push(instr[0]);
        i++;
      }
    }
    return i;
  }

  let currentValues = [];
  let nextValue = {};
  data.slice(0, 3127).forEach(row => {
    if (row.slice(0, 6) === 'Before') {
      const str = row.split('Before: ');
      const arrStr = str[1].trim();
      const before = arrStr
        .substring(1, arrStr.length - 1)
        .split(', ')
        .map(i => +i);
      nextValue.before = before;
    } else if (row[0] !== 'B' && row[0] !== 'A') {
      const instr = row.split(' ').map(i => +i);
      nextValue.instr = instr;
    } else if (row.slice(0, 5) === 'After') {
      const str = row.split('After: ');
      const arrStr = str[1].trim();
      const after = arrStr
        .substring(1, arrStr.length - 1)
        .split(', ')
        .map(i => +i);
      nextValue.after = after;
      currentValues.push(nextValue);
      nextValue = {};
    }
  });

  let counter = 0;
  currentValues.forEach(value => {
    const result = checkInput(value.before, value.after, value.instr);
    if (result >= 3) {
      counter += 1;
    }
  });
  console.log('FIRST ANSWER', counter);
  //first check those who always corresponded to one number
  const checked = {};
  function checkDefOnes() {
    for (let key in ops) {
      const optCode = ops[key].optCodes[0];
      if (ops[key].optCodes.every(item => item === optCode)) {
        checked[key] = optCode;
      }
    }
  }
  // then filter out those we know from other ones
  function filterValues() {
    const determined = Object.values(checked);
    for (let key in ops) {
      if (!checked.hasOwnProperty(key)) {
        ops[key].optCodes = ops[key].optCodes.filter(
          item => determined.indexOf(item) === -1
        );
      }
    }
  }

  while (Object.keys(checked).length !== 16) {
    checkDefOnes();
    filterValues();
  }

  function findMethod(opcode) {
    let result;
    for (let key in checked) {
      if (checked[key] === opcode) {
        result = key;
      }
    }
    return result;
  }

  const secondInput = data
    .slice(3130)
    .map(item => item.split(' ').map(i => +i));
  let registers = [0, 0, 0, 0];

  secondInput.forEach(instructions => {
    const method = findMethod(instructions[0]);
    const check = ops[method](instructions, registers);
    registers = check;
  });
  console.log(checked);
  console.log('SECOND ANSWER', registers[0]);
})();
