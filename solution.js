const fs = require('fs'); //Importing File System

// Converting a string into bigInt
function convertToBigInt(str, base) {
  base = BigInt(base);
  let result = 0n;
  for (let char of str) {
    let digit = char >= '0' && char <= '9' ? BigInt(char) : BigInt(char.charCodeAt(0) - 'a'.charCodeAt(0) + 10);
    result = result * base + digit;
  }
  return result;
}
// Computing the secret constant term using Lagrange interpolation at x=0.
function computeConstantTerm(data) {
  const k = Number(data.keys.k);
  // Extract, sort, and decode the first k points.
  let points = Object.entries(data)
    .filter(([key]) => key !== 'keys')
    .map(([key, val]) => ({ x: BigInt(key), y: convertToBigInt(val.value, val.base) }))
    .sort((a, b) => (a.x < b.x ? -1 : a.x > b.x ? 1 : 0))
    .slice(0, k);

  // Lagrange interpolation
  let sumNum = 0n, sumDen = 1n;
  for (let i = 0; i < points.length; i++) {
    const xi = points[i].x, yi = points[i].y;
    let num = yi, den = 1n;
    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      num *= -points[j].x;      
      den *= xi - points[j].x;  
    }
    sumNum = sumNum * den + num * sumDen;
    sumDen *= den;
  }
  return sumNum / sumDen;  // Assumes result is an integer.
}

// Main process
const files = ['testcase1.json', 'testcase2.json']; // insert files here
files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  console.log(`Output of ${file}: ${computeConstantTerm(data).toString()}`);
});