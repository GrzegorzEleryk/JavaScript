// in, round, out
const roundTests = [
    [1, 1, 1],
    [1.1, 1, 1.1],
    [1e+100, 1, 1e+100],
    [1234.56789, 3, 1234.568],
    [1e-100, 1, 0]
];

roundTests.forEach(test => {

    const toTest = test[0];
    const precision= test[1];
    const shouldBe = test[2];

    const result = toTest.round(precision);

    console.log('number: ' + toTest + '\nprecision: ' + precision + '\nresult:   ' + result + '\nshouldBe: ' + shouldBe + '\npassed: '+(result === shouldBe)+'\n');

});