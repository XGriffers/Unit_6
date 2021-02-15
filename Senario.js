var changingRoom = require('./ChangingRooms.js');
var customer = require('./Customers.js');

const { Worker } = require('worker_threads')

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})


//We need User Input
readline.question('How many clothing Items would you like? (0 = random)' , (items) => {
    readline.question('How many customers are waiting?' , (customers) => {
        readline.question("How many changing rooms are available? ", (rooms) => {
            console.log('${items} items entered and ${customers} customers entered and ${rooms} rooms entered');
            readline.close();

            var count = 0;
            var totalWaitTime = 0;
            var totalRunTime = 0;
            var runTime = 0;
            var totalNumberOfItems = 0;

            for (var i = 0; i < customers; i++){

                customerName = "Customer" + (i+1);
                customer.setNumberOfItems('${items}');
                var numberOfCustomerItems = customer.getNumberOfItems();
                totalNumberOfItems = totalNumberOfItems + numberOfCustomerItems;
                var roomWaitTime = changingRoom.RequestRoom();

                function runService(workerData){

                    if (i < '${rooms}') {
                        var waitTime = 0;
                        runTime = totalNumberOfCustomerItems * roomWaitTime;
                        console.log(customerName + " Changed in the room.");
                    }
                    else {
                        var waitTime = roomWaitTime;
                        console.log('${waitTime} wait time determined and ${NumberOfCustomerItems} customer items determined');
                        console.log(customerName + " is Waiting for Vacancy.");
                        wait(waitTime * 10);
                    }
                    totalRunTime = runTime + totalRunTime;

                    var adjustedWaitTime = waitTime * numberOfCustomerItems;

                    totalWaitTime = adjustedWaitTime + totalWaitTime;

                    if (count == rooms) {
                        wait(adjustedWaitTime * 10);
                        console.log(customerName + " changed in the room.");
                        count = 0;
                    }

                    return new Promise((resolve, reject) => {
                        const worker = new Worker('./Customer.js', {workerData});
                        worker.on('message', resolve);
                        worker.on('error', reject);
                        worker.on('exit', (code) => {
                            if (code !== 0)
                            reject(new Error('Worker stopped with exit code ${code}'));
                        });
                    });
                }
                async function run() {
                    const result = await runService('Running Worker Treads');
                    wait(100);
                    console.log(result);
                }
                run().catch(err => console.error(err));

                count = count + 1;

            }

            console.log("There were " + customers + " customers total");
            console.log(totalRunTime/customers + " milliseconds average run time.");
            console.log(totalWaitTime/customers + " milliseconds average wait time.");
            console.log("There were " + totalNumberOfItems/customers + " average number of items");

            process.exit(0);

        })
    })
})
function wait(ms)
{
    var d = new Date();
    var d2 = null;
    do {d2 = new Date();  }
    while(d2 - d < ms);
}
