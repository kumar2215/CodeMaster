function binarySearch(arr, target) {
    let left = 0;
  	let right = arr.length - 1;
	let mid = 0;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] < target) {
            left = mid + 1; // Continue searching to the right
        } else if (arr[mid] > target) {
            right = mid - 1; // Continue searching to the left
        } else {
          while (mid > 0 && arr[mid-1] === target) {
            mid -= 1;
          }
		  return mid;
		}
    }

    return -1; // Target not found
}

module.exports = { binarySearch };
module.exports = { binarySearch };