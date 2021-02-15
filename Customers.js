const { workerData, parentPort } = require('worker_threads')

var NumberOfItems;

module.exports = {
    getNumberOfItems: function(){
        return NumberOfItems;
    },
    setNumberOfItems: function(controlNumber){
        if(controlNumber == 0){
            Items = GenerateRandomCustomerItems(20);
        }
        else {
            NumberOfItems = controlNumber;
        }
    }
}

function GenerateRandomCustomerItems(highValue) {
    return Math.ceil(Math.random() * highValue)
}