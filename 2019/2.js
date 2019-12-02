(function() {
    // let data = document.getElementsByTagName('pre')[0].innerHTML.split(',');
    // let intData = data.map(item => +item);
    // intData[1] = 12;
    // intData[2] = 2;

    function part1(intData) {   
        const operations = {
            1: sum,
            2: multiply
        };

        function sum(a, b) {
            return intData[a] + intData[b];
        }

        function multiply(a,b) {
            return intData[a] * intData[b];
        }
        
        for (let i = 0; i < intData.length; i += 4) {
            if (intData[i] !== 99 && operations[intData[i]]) {
                const operation = operations[intData[i]];
                const pos = intData[i+3] ;
                intData[pos] =  operation(intData[i+1], intData[i+2]);
            }
        }
        // console.log(intData[0]);
        return intData[0];
    }

    // part1(intData);

    function part2() {
        const myData = document.getElementsByTagName('pre')[0].innerHTML.split(',').map(item => +item);
        for(let i = 0; i <= 99; i++) {
            for(let z = 0; z <= 99; z++) {
                let copy = [...myData]
                copy[1] = i;
                copy[2] = z;
                const result = part1(copy);
                if(result === 19690720) {
                    console.log(i, z, 'ANSWER');
                    return;
                }
            }
        }
    }   

    part2();

})();