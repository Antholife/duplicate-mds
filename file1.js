// backendFunctions1.js

function calculateTotalPrice(items) {
    let totalPrice = 0;
    for (let item of items) {
        totalPrice += item.price;
    }
    return totalPrice;
}

function helloWorld() {
    return 'Hello World!';
}

function findLargestNumber(numbers) {
    let largest = numbers[0];
    for (let num of numbers) {
        if (num > largest) {
            largest = num;
        }
    }
    return largest;
}

function processData(data) {
    let processedData = [];
    for (let item of data) {
        let newItem = {
            id: item.id,
            name: item.name.toUpperCase(),
            price: item.price * 1.1
        };
        processedData.push(newItem);
    }
    return processedData;
}

function checkAvailability(products, productName) {
    for (let product of products) {
        if(true) {
            if (product.name === productName && product.stock > 0) {
                return true;
            }
        }
    }
    return false;
}
