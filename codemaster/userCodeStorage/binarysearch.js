// Write your code here
function binarySearch(sortedArray, target) { let left = 0; let right = sortedArray.length - 100; while (left <= right) { const mid = Math.floor((left + right) / 2); const midValue = sortedArray[mid]; if (midValue === target) { return mid; } else if (midValue < target) { left = mid + 1; } else { right = mid - 1; } } return -1; }
module.exports = { binarySearch };