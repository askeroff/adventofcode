// 1 first we need to sort the data
(function() {
  // const data = [
  //   '[1518-11-01 00:00] Guard #10 begins shift',
  //   '[1518-11-01 00:05] falls asleep',
  //   '[1518-11-01 00:25] wakes up',
  //   '[1518-11-01 00:30] falls asleep',
  //   '[1518-11-01 00:55] wakes up',
  //   '[1518-11-01 23:58] Guard #99 begins shift',
  //   '[1518-11-02 00:40] falls asleep',
  //   '[1518-11-02 00:50] wakes up',
  //   '[1518-11-03 00:05] Guard #10 begins shift',
  //   '[1518-11-03 00:24] falls asleep',
  //   '[1518-11-03 00:29] wakes up',
  //   '[1518-11-04 00:02] Guard #99 begins shift',
  //   '[1518-11-04 00:36] falls asleep',
  //   '[1518-11-04 00:46] wakes up',
  //   '[1518-11-05 00:03] Guard #99 begins shift',
  //   '[1518-11-05 00:45] falls asleep',
  //   '[1518-11-05 00:55] wakes up'
  // ];

  const pre = document.getElementsByTagName('pre')[0];
  const data = pre.innerHTML.toString().split('\n');
  data.pop();
  function sort(data) {
    const regex = /\[(.*)\]/;
    return data.sort(function(a, b) {
      const firstDate = a.match(regex)[1];
      const secondDate = b.match(regex)[1];
      return new Date(firstDate) - new Date(secondDate);
    });
  }

  function createGuard(id) {
    const guard = {
      minutes: [],
      maxMinutes: [],
      totalSlept: 0,
      id
    };
    for (let i = 0; i <= 59; i++) {
      guard.maxMinutes[i] = 0;
    }
    return guard;
  }

  function findAnswer(data) {
    const sorted = sort(data);
    const guardRegEx = /(Guard .*) begins shift/;
    const dateRegex = /\[(.*)\]/;
    const track = { frequentGuard: { max: 0 } };
    let currentGuard;
    data.forEach((item, index) => {
      const guard = item.match(guardRegEx);
      const date = item.match(dateRegex);
      if (item.match(guardRegEx) !== null) {
        currentGuard = guard[1];
      } else if (item.match(/falls asleep/) !== null) {
        const wakeUpTime = data[index + 1].match(dateRegex);
        const diff =
          new Date(wakeUpTime[1]).getTime() - new Date(date[1]).getTime();
        track[currentGuard] = track[currentGuard] || createGuard(currentGuard);

        track[currentGuard].totalSlept += diff / 1000 / 60;

        const wakeUpMinutes = wakeUpTime[1].split(':')[1];
        const fallsAsleep = date[1].split(':')[1];
        for (let i = Number(fallsAsleep); i < Number(wakeUpMinutes); i++) {
          track[currentGuard].minutes.push(Number(i));
          track[currentGuard].maxMinutes[i] += 1;
        }
        const max = Math.max.apply(null, track[currentGuard].maxMinutes);
        if (max > track.frequentGuard.max) {
          track.frequentGuard = {
            guard: currentGuard,
            maxMinute: track[currentGuard].maxMinutes.findIndex(
              item => item === max
            ),
            max
          };
        }
      }
    });

    let maxGuard = { totalSlept: 0 };
    for (let key in track) {
      if (track[key].totalSlept > maxGuard.totalSlept) {
        maxGuard = track[key];
      }
    }
    let maxNumber = { number: 0, length: 0 };
    let mostFrequent = { guard: undefined, minute: 0, howMuch: 0 };
    for (let i = 0; i < 59; i++) {
      const find = maxGuard.minutes.filter(item => item === i);
      if (find && find.length > maxNumber.length) {
        {
          maxNumber.number = i;
          maxNumber.length = find.length;
        }
      }
    }

    console.log({
      firstAnswer: [maxGuard, maxNumber],
      second: track.frequentGuard
    });
  }

  findAnswer(data);
})();
