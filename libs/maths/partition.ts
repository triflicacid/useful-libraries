/**
 * Given a number, return the number of possible partitions of a number `n` (ways it can be summed)
 * 
 * E.g. p(4) = 5 (1+1+1+1, 1+1+2, 1+3, 2+2, 4)
 * 
 * !BUG!
*/
export const partitionCount = (function () {
  const cache: { [n: number]: number } = { 0: 1 }; // n : p(n)
  return function p(n: number) {
    if (n in cache) return cache[n];
    if (n < 0) return 0; // p(-k) = 0

    let S = 0;
    const l = -Math.floor((Math.sqrt(24 * n + 1) - 1) / 6), u = Math.floor((Math.sqrt(24 * n + 1) + 1) / 6);
    for (let k = l; k <= u; ++k) {
      S += k === 0 ? 0 : Math.pow(-1, k + 1) * p(n - k * (3 * k - 1) / 2);
    }
    return (cache[n] = S);
  };
})();

/**
 * Given a number, return all the possible partitions of a number `n` (ways it can be summed)
 * 
 * E.g. p(4) = [[1,1,1,1], [1,1,2], [1,3], [2,2], [4]]
 */
export const partition = (function () {
  const cache: { [n: number]: number[][] } = {
    1: [[1]],
  };
  return function p(n: number) {
    if (n in cache) {
      return cache[n];
    }
    const S = [[n]];
    for (let i = 1; i < n; i++) {
      p(n - i)
        .map(s => s.concat([i]).sort((a, b) => b - a))
        // .map(s => {
        //   let j = sortedIndex(s, i);
        //   let ns = [...s];
        //   ns.splice(j, 0, i);
        //   return ns;
        // })
        .forEach(r => S.filter(s => s.every((sx, i) => sx === r[i])).length === 0 && S.push(r));
    }

    return (cache[n] = S);
  }
})();

/** Get index where <value> should be inserted, into a sorted array */
function sortedIndex(array, value) {
  let low = 0, high = array.length;
  while (low < high) {
    let mid = (low + high) >> 1;
    if (array[mid] < value) low = mid + 1;
    else high = mid;
  }
  return low;
}