(function() {
  function getNewRecipe(recipes, index1, index2) {
    let sum = recipes[index1] + recipes[index2];
    return sum
      .toString()
      .split('')
      .map(item => +item);
  }

  function getNextPosition(elf, recipes) {
    let steps = recipes[elf.current] + 1;
    let index = elf.current;
    for (let i = 0; i < steps; i++) {
      index += 1;
      if (index > recipes.length - 1) {
        index = 0;
      }
    }
    return index;
  }

  function findAnswer(limit) {
    let recipes = [3, 7];
    let firstElf = { current: 0 };
    let secondElf = { current: 1 };
    let meScore = limit.toString();
    let firstAnswer;
    let secondAnswer;
    for (let i = 0; i < 5800000 * 5; i++) {
      {
        firstElf.current = getNextPosition(firstElf, recipes);
        secondElf.current = getNextPosition(secondElf, recipes);
        recipes.push(
          ...getNewRecipe(recipes, firstElf.current, secondElf.current)
        );
      }
      if (
        recipes
          .slice(recipes.length - meScore.length, recipes.length)
          .join('') === meScore
      ) {
        i = Infinity;
        secondAnswer = recipes.length - meScore.length;
      } else if (
        recipes
          .slice(recipes.length - meScore.length - 1, recipes.length - 1)
          .join('') === meScore
      ) {
        i = Infinity;
        secondAnswer = recipes.length - meScore.length - 1;
      }

      if (recipes.length >= limit + 10 && firstAnswer === undefined) {
        firstAnswer = recipes.slice(limit, limit + 10).join('');
      }
    }
    console.log('FINISHED!', firstAnswer, secondAnswer);
    return { firstAnswer, secondAnswer };
  }
  const answer = findAnswer(765071); // your puzzle input
})();
