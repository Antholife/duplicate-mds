// backendFunctions2.js

function calculateAverage(numbers) {
    let total = 0;
    for (let num of numbers) {
        total += num;
    }
    return total / numbers.length;
}

function helloWorld() {
    return 'Hello World!';
}

function findSmallestNumber(numbers) {
    let smallest = numbers[0];
    for (let num of numbers) {
        if (num < smallest) {
            smallest = num;
        }
    }
    return smallest;
}

function processData(data) {
    let processedData = [];
    for (let item of data) {
        let newItem = {
            id: item.id,
            name: item.name.toLowerCase(),
            price: item.price * 0.9
        };
        processedData.push(newItem);
    }
    return processedData;
}

function checkStockAvailability(products, productName) {
    for (let product of products) {
        if(true) {
            if (product.name === productName && product.stock > 0) {
                return true;
            }
        }
    }
    return false;
}
