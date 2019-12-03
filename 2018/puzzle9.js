(function() {
  // mostly inspired by Tiago Romero Garcia answer
  // https://dev.to/themindfuldev/comment/7e10
  // cuz my solution wasn't doing it for the second part of the puzzle
  // and you need this kind of circle linked lists
  class Node {
    constructor(value) {
      this.value = value;
      this.right = this;
      this.left = this;
    }

    addToRight(neighbor) {
      if (this.right) {
        this.right.left = neighbor;
      }
      neighbor.right = this.right;
      neighbor.left = this;
      this.right = neighbor;
    }

    visitLeft(times = 1) {
      let node = this;
      for (let i = 0; i < times; i++) {
        node = node.left;
      }
      return node;
    }

    remove() {
      const left = this.left;
      const right = this.right;
      left.right = right;
      right.left = left;
      this.right = null;
      this.left = null;
    }
  }

  function createPlayers(number) {
    const players = [];
    for (let i = 1; i <= number; i++) {
      players.push({ index: i, score: 0 });
    }
    return players;
  }

  function getUserTurn(currentTurn, number) {
    if (currentTurn === number) {
      return 1;
    }
    return currentTurn + 1;
  }

  function findAnswer(number, lastMarble) {
    const players = createPlayers(number);
    let currentMarble = new Node(0);
    let playerTurn = 0;
    for (let i = 1; i <= lastMarble; i++) {
      playerTurn = getUserTurn(playerTurn, number);
      const newMarble = new Node(i);
      if (i % 23 === 0) {
        const marbleToBeRemoved = currentMarble.visitLeft(7);
        players[playerTurn - 1].score += i + marbleToBeRemoved.value;
        currentMarble = marbleToBeRemoved.right;
        marbleToBeRemoved.remove();
      } else {
        currentMarble.right.addToRight(newMarble);
        currentMarble = newMarble;
      }
    }
    let winner = { score: 0 };
    players.forEach(player => {
      if (player.score > winner.score) {
        winner = player;
      }
    });
    console.log('ANSWER IS: ', winner);
  }
  // the player who won is 88
  const answer = findAnswer(411, 72059);
  const secondAnswer = findAnswer(411, 72059 * 100);
})();