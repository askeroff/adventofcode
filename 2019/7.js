(function () {
  let data = document.getElementsByTagName('pre')[0].innerHTML.split(',');
  let puzzleData = data.map(item => +item);
  let currentOutput = 0;


  const permutations = inputArr => {
    let result = [];

    const permute = (arr, m = []) => {
      if (arr.length === 0) {
        result.push(m);
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next));
        }
      }
    };

    permute(inputArr);

    return result;
  };

  function Computer(settings) {
    this.pointer = 0;
    this.name = settings.name;
    this.phaseSetting = settings.input;
    this.intData = [...settings.data];
    this.pause = false;
    this.stopMode = settings.stopMode;

    this.getValue = (i, mode) => {
      if (+mode === 1) {
        return this.intData[i];
      } else if (+mode === 0) {
        return this.intData[this.intData[i]];
      }
    };

    this.sum = (i, instruction) => {
      const a = this.getValue(i + 1, instruction[2]);
      const b = this.getValue(i + 2, instruction[1]);
      const pos = this.intData[i + 3];
      this.intData[pos] = a + b;
      return true;
    };

    this.multiply = (i, instruction) => {
      const a = this.getValue(i + 1, instruction[2]);
      const b = this.getValue(i + 2, instruction[1]);
      const pos = this.intData[i + 3];
      this.intData[pos] = a * b;
      return true;
    };

    this.trueJump = (i, instruction) => {
      const a = this.getValue(i + 1, instruction[2]);
      const b = this.getValue(i + 2, instruction[1]);
      if (a !== 0) {
        this.pointer = b;
        return false;
      }
      return true;
    };

    this.falseJump = (i, instruction) => {
      const a = this.getValue(i + 1, instruction[2]);
      const b = this.getValue(i + 2, instruction[1]);
      if (a === 0) {
        this.pointer = b;
        return false;
      }
      return true;
    };

    this.lessThan = (i, instruction) => {
      const a = this.getValue(i + 1, instruction[2]);
      const b = this.getValue(i + 2, instruction[1]);
      const pos = this.intData[i + 3];
      this.intData[pos] = a < b ? 1 : 0;
      return true;
    };

    this.equals = (i, instruction) => {
      const a = this.getValue(i + 1, instruction[2]);
      const b = this.getValue(i + 2, instruction[1]);
      const pos = this.intData[i + 3];
      this.intData[pos] = a === b ? 1 : 0;
      return true;
    };


    this.saveToPos = (i, instruction) => {
      const pos = this.intData[i + 1];
      if (this.phaseSetting !== undefined) {
        this.intData[pos] = this.phaseSetting;
        this.phaseSetting = undefined;
      } else {
        this.intData[pos] = currentOutput;
      }
      return true;
    };

    this.output = (i, instruction) => {
      currentOutput = this.intData[this.intData[i + 1]];
      this.pause = this.stopMode;
      return true;
    };

    this.operations = {
      1: {func: this.sum, increment: 4},
      2: {func: this.multiply, increment: 4},
      3: {func: this.saveToPos, increment: 2},
      4: {func: this.output, increment: 2},
      5: {func: this.trueJump, increment: 3},
      6: {func: this.falseJump, increment: 3},
      7: {func: this.lessThan, increment: 4},
      8: {func: this.equals, increment: 4},
    };


    this.kickStart = () => {
      this.pause = false;
      while (this.intData[this.pointer] !== 99 && this.pointer < this.intData.length && !this.pause) {
        const instruction = String(this.intData[this.pointer]).padStart(5, '0');
        const operationFunc = instruction[4];
        const increasePointer = this.operations[operationFunc].func(this.pointer, instruction);
        this.pointer += increasePointer ? this.operations[instruction[4]].increment : 0;
      }
      if (this.intData[this.pointer] === 99 && this.name === 'e') {
        return 99;
      }
      return currentOutput;
    };
  }

  function runAmplifiers(initPhase) {
    const phaseSettings = initPhase;
    let finalOutput = 0;
    const amplifiers = [];
    const names = ['a', 'b', 'c', 'd', 'e'];
    phaseSettings.forEach((setting, index) => {
      // input, data, name, stopMode
      const ampSettings = {
        input: setting,
        data: puzzleData,
        name: names[index],
        stopMode: false
      };
      amplifiers.push(new Computer(ampSettings));
    });
    amplifiers.forEach(amp => {
      finalOutput = amp.kickStart();
    });

    return finalOutput;
  }


  function runAmplifiersInLoop(initPhase) {
    const phaseSettings = initPhase;
    const amplifiers = [];
    const names = ['a', 'b', 'c', 'd', 'e'];
    phaseSettings.forEach((setting, index) => {
      const ampSettings = {
        input: setting,
        data: puzzleData,
        name: names[index],
        stopMode: true
      };
      amplifiers.push(new Computer(ampSettings));
    });
    let finalOutput = 0;
    let stop = false;
    while (!stop) {
      amplifiers.forEach((amp) => {
        let outputValue = amp.kickStart();
        finalOutput = outputValue !== 99 ? outputValue : finalOutput;
        if (outputValue === 99 && amp.name === 'e') {
          stop = true;
        }
      });
    }
    return finalOutput;
  }


  function solveFirstPart() {
    const firstPartRange = [0, 1, 2, 3, 4];
    const perms = permutations(firstPartRange);
    let max = 0;
    perms.forEach((arr) => {
      runAmplifiers(arr);
      if (currentOutput > max) {
        max = currentOutput;
      }
      currentOutput = 0;
    });
    console.log(max, 'MAX');
  }


  solveFirstPart();

  function solveSecondPart() {
    const secondPartRange = [5, 6, 7, 8, 9];
    const perms = permutations(secondPartRange);
    let max = 0;
    perms.forEach((arr) => {
      runAmplifiersInLoop(arr);
      if (currentOutput > max) {
        max = currentOutput;
      }
      currentOutput = 0;
    });
    console.log(max, 'MAX');
  }

  solveSecondPart();
})();

// 14902 FIRST PART
// 6489132 SECOND PART

