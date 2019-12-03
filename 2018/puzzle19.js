(function() {
  let commandsList = [
    'seti 5 0 1',
    'seti 6 0 2',
    'addi 0 1 0',
    'addr 1 2 3',
    'setr 1 0 0',
    'seti 9 0 5'
  ];

  let actualInput = [
    'addi 4 16 4',
    'seti 1 9 3',
    'seti 1 6 2',
    'mulr 3 2 5',
    'eqrr 5 1 5',
    'addr 5 4 4',
    'addi 4 1 4',
    'addr 3 0 0',
    'addi 2 1 2',
    'gtrr 2 1 5',
    'addr 4 5 4',
    'seti 2 9 4',
    'addi 3 1 3',
    'gtrr 3 1 5',
    'addr 5 4 4',
    'seti 1 0 4',
    'mulr 4 4 4',
    'addi 1 2 1',
    'mulr 1 1 1',
    'mulr 4 1 1',
    'muli 1 11 1',
    'addi 5 1 5',
    'mulr 5 4 5',
    'addi 5 2 5',
    'addr 1 5 1',
    'addr 4 0 4',
    'seti 0 1 4',
    'setr 4 3 5',
    'mulr 5 4 5',
    'addr 4 5 5',
    'mulr 4 5 5',
    'muli 5 14 5',
    'mulr 5 4 5',
    'addr 1 5 1',
    'seti 0 6 0',
    'seti 0 7 4'
  ];

  function getABC(instr) {
    return {
      A: instr[0],
      B: instr[1],
      C: instr[2]
      // opcode: instr[0]
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

  function getInstructions(command) {
    return command
      .slice(5)
      .split(' ')
      .map(i => +i);
  }

  function findAnswer(commands) {
    let input = [0, 0, 0, 0, 0, 0];
    let ip = 4;
    let pointer = input[4];
    let i = 0;
    while (pointer < commands.length) {
      const command = commands[pointer];
      input[ip] = pointer;
      const method = command.slice(0, 4);
      const instr = getInstructions(command);
      input = ops[method](instr, input);
      pointer = input[ip] + 1;
      i++;
    }
    console.log(input[0], 'first answr');
  }

  function findSecondAnswer(commands) {
    /*
    [1, 0, 0, 0, 0, 0]
    */
    let input = [1, 0, 0, 0, 0, 0];
    let ip = 4;
    let pointer = 0;
    let i = 0;
    while (pointer < commands.length && i < 10000) {
      const command = commands[pointer];
      input[ip] = pointer;
      const method = command.slice(0, 4);
      const instr = getInstructions(command);
      input = ops[method](instr, input);
      pointer = input[ip] + 1;
      i++;
      console.log(input, pointer, command, method, i);
    }
  }

  // const answer = findAnswer(commandsList);
  // const answer = findAnswer(actualInput);
  const answer2 = findSecondAnswer(actualInput);
})();

