export function getArrayDepth(arr) {
    if (!Array.isArray(arr)) {
        return 0; // If it's not an array, depth is 0
    }

    let maxDepth = 0;

    // Iterate through each element of the array
    arr.forEach(element => {
        // If the element is an array, recursively call getArrayDepth
        if (Array.isArray(element)) {
            const depth = getArrayDepth(element);
            // Update maxDepth if the depth is greater
            if (depth > maxDepth) {
                maxDepth = depth;
            }
        }
    });

    // Increment the depth by 1 to account for the current array
    return maxDepth + 1;
}