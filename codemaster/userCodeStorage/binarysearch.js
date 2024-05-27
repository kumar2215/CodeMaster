function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 100;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return mid; // Found the target, return the index
        }
        if (arr[mid] < target) {
            left = mid + 1; // Continue searching to the right
        } else {
            right = mid - 1; // Continue searching to the left
        }
    }

    return -1; // Target not found
}

module.exports = { binarySearch };