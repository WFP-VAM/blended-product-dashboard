export function mean(data, key) {
    return data.reduce((acc, obj) => {
        return acc + obj[key];
    }, 0) / data.length;
}

export function min(data, key) {
    return data.reduce((max, obj) => {
        return obj[key] < max ? obj[key] : max;
    }, data[0][key]);
}

export function max(data, key) {
    return data.reduce((max, obj) => {
        return obj[key] > max ? obj[key] : max;
    }, data[0][key]);
}

export function sum(data, key) {
    return data.reduce((acc, obj) => {
        return acc + obj[key];
    }, 0);
}

export function median(data, key) {
    // assumes already sorted
    return data[parseInt(data.length / 2)][key];
}

export function joinArraysByKey(arr1, arr2, key1, key2) {
    return arr1.map(item1 => {
        const matchingItem = arr2.find(item2 => item2[key2] === item1[key1]);
        return { ...item1, ...matchingItem };
    });
}

export function countLongestConsecutiveWithCriteria(array, accessor, threshold, op) {
    let maxCount = 0;
    let currentCount = 0;

    for (let i = 0; i < array.length; i++) {
        const val = accessor(array[i])
        if (op === ">" ? val > threshold : val < threshold) {
            currentCount = currentCount + 1;
            if (currentCount > maxCount) {
                maxCount = currentCount;
            }
        } else {
            currentCount = 0;
        }
    }
    return maxCount;
}