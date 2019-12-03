(function() {
  // let data = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2';
  const nodes = [];

  let data = document.getElementsByTagName('pre')[0].innerHTML;
  data = data.slice(0, data.length - 1);

  function Node(data, parent) {
    this.children = data.shift();
    this.metadata = data.shift();
    this.sum = 0;
    // for the second part
    this.parent = parent;
    this.metadataData = [];
    this.kids = [];
    this.value = 0;
    for (let i = 0; i < this.children; i++) {
      let child = new Node(data, this);
      this.kids.push(child);
      nodes.push(child);
    }
    for (let i = 0; i < this.metadata; i++) {
      let value = data.shift();
      this.sum += value;
      this.metadataData.push(value);
    }
    if (this.children === 0) {
      this.value = this.sum;
    } else {
      this.metadataData.forEach(value => {
        if (this.kids[value - 1]) {
          this.value += this.kids[value - 1].value;
        }
      });
    }
  }

  function findAnswer(data) {
    const myNode = new Node(data, null);
    nodes.push(myNode);
    // first part of the answer
    const result = nodes.reduce((accum, item) => item.sum + accum, 0);
    console.log(result);
    // second part of the answer
    const root = nodes.find(item => item.parent === null);
    console.log(root.value);
  }

  const answer = findAnswer(data.split(' ').map(v => +v));
})();

/* ++++++++++++++++++++++++++++++++++++++
  2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2
  A----------------------------------
     B-----------  C-----------
                      D-----
*************************************/
