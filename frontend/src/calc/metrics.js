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

export function linearInterpolation(array, key) {
    let return_obj = []
    for (let i = 0; i < array.length; i++) {
        const currentObj = Object.assign(array[i]);
        const prevObjWithKey = findPrevWithKey(array, key, i);
        const nextObjWithKey = findNextWithKey(array, key, i);
        console.log(nextObjWithKey)
        console.log(prevObjWithKey)
        
        let val;
        if (prevObjWithKey === null) val = array[nextObjWithKey][key]
        else if (nextObjWithKey === null) val = array[prevObjWithKey][key]
        else {
            console.log(nextObjWithKey)
            console.log(prevObjWithKey)
            val = 100
        }
        currentObj[key] = val

        return_obj.push(currentObj)
    }
    console.log(return_obj)
    return return_obj
}

function findNextWithKey(array, key, startIndex) {
    for (let i = startIndex + 1; i < array.length; i++) {
        if (key in array[i]) {
            return i
        }
    }
    return null; // If no next object with the key is found
}

function findPrevWithKey(array, key, startIndex) {
    // for (let i = startIndex; i >= 0; i--) {
    //     if (key in array[i]) {
    //         return i
    //     }
    // }
    return null; // If no next object with the key is found
}