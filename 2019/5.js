(function () {
  let data = document.getElementsByTagName('pre')[0].innerHTML.split(',');
  let intData = data.map(item => +item);
  let pointer = 0;
  function part1(intData) {
    const operations = {
      1: {func: sum, increment: 4},
      2: {func: multiply, increment: 4},
      3: {func: saveToPos, increment: 2},
      4: {func: output, increment: 2},
      5: {func: trueJump, increment: 3},
      6: {func: falseJump, increment: 3},
      7: {func: lessThan, increment: 4},
      8: {func: equals, increment: 4},
    };

    function getValue(i, mode) {
      if (+mode === 1) {
        return intData[i];
      } else if (+mode === 0) {
        return intData[intData[i]];
      }
    }

    function sum(i, instruction) {
      const a = getValue(i + 1, instruction[2]);
      const b = getValue(i + 2, instruction[1]);
      const pos = intData[i + 3];
      intData[pos] = a + b;
      return true;
    }

    function multiply(i, instruction) {
      const a = getValue(i + 1, instruction[2]);
      const b = getValue(i + 2, instruction[1]);
      const pos = intData[i + 3];
      intData[pos] = a * b;
      return true;
    }

    function trueJump(i, instruction) {
      const a = getValue(i + 1, instruction[2]);
      const b = getValue(i + 2, instruction[1]);
      if (a !== 0) {
        pointer = b;
        return false;
      }
      return true;
    }

    function falseJump(i, instruction) {
      const a = getValue(i + 1, instruction[2]);
      const b = getValue(i + 2, instruction[1]);
      if (a === 0) {
        pointer = b;
        return false;
      }
      return true;
    }

    function lessThan(i, instruction) {
      const a = getValue(i + 1, instruction[2]);
      const b = getValue(i + 2, instruction[1]);
      const pos = intData[i + 3];
      intData[pos] = a < b ? 1 : 0;
      return true;
    }

    function equals(i, instruction) {
      const a = getValue(i + 1, instruction[2]);
      const b = getValue(i + 2, instruction[1]);
      const pos = intData[i + 3];
      intData[pos] = a === b ? 1 : 0;
      return true;
    }


    function saveToPos(i, instruction) {
      const pos = intData[i + 1];
      intData[pos] = 5;
      intData[pos] = 1; // FOR THE FIRST PART OF THE PUZZLE
      return true;
    }

    function output(i, instruction) {
      const code = intData[intData[i + 1]];
      console.log(code, 'DIAGNOSTIC CODE');
      return true;
    }

    while (intData[pointer] !== 99 && pointer < intData.length) {
      const instruction = String(intData[pointer]).padStart(5, '0');
      const operationFunc = instruction[4];
      const increasePointer = operations[operationFunc].func(pointer, instruction);
      pointer += increasePointer ? operations[instruction[4]].increment : 0;
    }

  }

  part1(intData);

})();
