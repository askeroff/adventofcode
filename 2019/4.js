(function () {
  function meetsCriteria(num) {
    const split = String(num).split('');
    let hasTwoAdjacents = false;
    let neverDecreases = true;
    for (let i = 0; i < split.length; i++) {
      if (split[i] === split[i + 1]) {
        hasTwoAdjacents = true;
      }
      if (i < split.length && split[i] > split[i + 1]) {
        neverDecreases = false;
      }
    }
    return hasTwoAdjacents && neverDecreases;
  }

  function meetsSecondCriteria(num) {
    const split = String(num).split('');
    let hasDoubles = false;
    const repeatedDigits = {};
    for (let i = 0; i < split.length; i++) {
      if (split[i] === split[i + 1]) {
        repeatedDigits[split[i]] = repeatedDigits[split[i]] ? repeatedDigits[split[i]] + 1 : 1;
      }
    }
    for (let key in repeatedDigits) {
      if (repeatedDigits[key] === 1) {
        hasDoubles = true;
      }
    }
    return hasDoubles;
  }

  function countPasswords() {
    let firstPart = [];

    for (let i = 172851; i <= 675869; i++) {
      let metCriteria = meetsCriteria(i);
      if (metCriteria) {
        firstPart.push(i);
      }
    }
    let secondRuleNum = 0;
    for (let i = 0; i < firstPart.length; i++) {
      let metCriteria = meetsSecondCriteria(firstPart[i]);
      if (metCriteria) {
        secondRuleNum += 1;
      }
    }

    console.log(firstPart.length, secondRuleNum);
    return [firstPart.length, secondRuleNum];
  }

  countPasswords();
}());
