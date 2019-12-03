// FIRST PART OF THE PUZZLE

function howManyTimes(str) {
  const split = str.split('');
  let howMany = {};
  split.forEach((item, index) => {
    if (howMany[item]) {
      howMany[item] += 1;
    } else {
      howMany[item] = 1;
    }
  });
  const result = [false, false]; // 2 and threes
  for (key in howMany) {
    if (howMany[key] === 3) {
      result[1] = true;
    } else if (howMany[key] === 2) {
      result[0] = true;
    }
  }
  return result;
}

let twoS = 0;
let threeS = 0;
data.forEach(item => {
  const answer = howManyTimes(item);
  if (answer[0] === true) twoS += 1;
  if (answer[1] === true) threeS += 1;
});

// SECOND PART OF THE PUZZLE

function diffString(str, mystr) {
  const split = str.split('');
  let howManyCharsDiff = { number: 0, index: 0 };
  let i = 0;

  do {
    if (str[i] !== mystr[i]) {
      howManyCharsDiff.number += 1;
      howManyCharsDiff.index = i;
    }
    i++;
  } while (howManyCharsDiff.number <= 1 && i < str.length);
  howManyCharsDiff.string = [str, mystr];
  return howManyCharsDiff;
}

function findTheString(data) {
  const myData = [...data];
  let str = myData[0];
  let answer;
  for (let i = 1; i < myData.length; i++) {
    if (!answer || (answer && answer.number !== 1)) {
      answer = diffString(str, myData[i]);
    }
  }
  let found;
  if (answer && answer.number === 1) {
    found =
      str.slice(0, answer.index) + str.slice(answer.index + 1, str.length);
    return [found, answer];
  } else if (myData.slice(1).length > 1) {
    return findTheString(myData.slice(1));
  }

  return [found, answer];
}
