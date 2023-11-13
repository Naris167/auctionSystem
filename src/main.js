const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let auction = {}; // Global object to hold items

const buyers = [ //Buyer list
    {
        name: "John",
        ID: 1001
    },
    {
        name: "Mark",
        ID: 1002
    },
    {
        name: "Jane",
        ID: 1003
    }
];

// Function to get user input and store it in the object
function getUserInput(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

// Create the object for each item
async function createItem(itemNumber) {
    const description = await getUserInput('Description: ');
    let reservePrice = await getUserInput('Reserve price: $');
    reservePrice = parseFloat(reservePrice);
    let currentBid = 0;
    let currentBuyer = 'none';
  
    if (isNaN(reservePrice)) {
      console.log('Please enter a valid number for the reserve price.');
      return null;
    }
  
    return {
      itemNumber,
      description,
      reservePrice,
      currentBid,
      currentBuyer
    };
  }

// Function to show all items in a table-like format
function displayItems(items) {
    console.log('\nCurrent items and their status:');
    console.log('Item Number    | Description            | Reserve Price    | Current Bid   | Current Buyer   ');
    console.log('---------------|------------------------|------------------|---------------|-----------------');

    for (const key in items) {
        if (items.hasOwnProperty(key)) {
            const item = items[key];
            const itemNumberStr = item.itemNumber.toString().padEnd(15, ' ');
            const descriptionStr = item.description.padEnd(22, ' ');
            const reservePriceStr = item.reservePrice.toFixed(2).padStart(16, ' ');
            const currentBidStr = item.currentBid.toFixed(2).padStart(13, ' ');
            const currentBuyerStr = item.currentBuyer.padStart(14, ' ');

            console.log(`${itemNumberStr}| ${descriptionStr} | ${reservePriceStr} | ${currentBidStr} | ${currentBuyerStr}`);
        }
    }
}

// Function to show all finalized items in a table-like format
function finalizedItems(items) {
    console.log('\nAuction result and items status:');
    console.log('Item Number    | Description            | Reserve Price    | Final Bid     | Final Buyer     | Status            | Final Price     ');
    console.log('---------------|------------------------|------------------|---------------|-----------------|-------------------|-----------------');

    let soldCount = 0, unsoldCount = 0, noBidCount = 0;

    for (const key in items) {
        if (items.hasOwnProperty(key)) {
            const item = items[key];
            const itemNumberStr = item.itemNumber.toString().padEnd(15, ' ');
            const descriptionStr = item.description.padEnd(22, ' ');
            const reservePriceStr = item.reservePrice.toFixed(2).padStart(16, ' ');
            const currentBidStr = item.currentBid.toFixed(2).padStart(13, ' ');
            const currentBuyerStr = item.currentBuyer.padStart(15, ' ');
            let statusStr, finalPriceStr;

            if (item.currentBid >= item.reservePrice && item.currentBid > 0) {
                const finalPrice = item.currentBid * 1.1; // Calculate final price including 10% tax
                finalPriceStr = finalPrice.toFixed(2).padStart(14, ' ');
                statusStr = 'Sold'.padEnd(17, ' ');
                soldCount++;
            } else if (item.currentBid > 0) {
                finalPriceStr = '---'.padStart(14, ' ');
                statusStr = 'Not Met Reserve'.padEnd(17, ' ');
                unsoldCount++;
            } else {
                finalPriceStr = '---'.padStart(14, ' ');
                statusStr = 'No Bids'.padEnd(17, ' ');
                noBidCount++;
            }

            console.log(`${itemNumberStr}| ${descriptionStr} | ${reservePriceStr} | ${currentBidStr} | ${currentBuyerStr} | ${statusStr} | ${finalPriceStr}`);
        }
    }

    console.log(`\nAuction Summary:`);
    console.log(`Items Sold: ${soldCount}`);
    console.log(`Items Unsold (Bids not meeting reserve): ${unsoldCount}`);
    console.log(`Items with No Bids: ${noBidCount}`);
}

// Function to automatically add test data
function addTestData() {
    const testData = [
        { itemNumber: 101, description: "Antique Chair", reservePrice: 200 },
        { itemNumber: 102, description: "Painting", reservePrice: 500 },
        { itemNumber: 103, description: "Collectible Toy", reservePrice: 100 },
        { itemNumber: 104, description: "Vintage Watch", reservePrice: 800 },
        { itemNumber: 105, description: "Jewelry Set", reservePrice: 750 },
        { itemNumber: 106, description: "Rare Coin", reservePrice: 300 },
        { itemNumber: 107, description: "Antique Book", reservePrice: 150 },
        { itemNumber: 108, description: "Vintage Camera", reservePrice: 250 },
        { itemNumber: 109, description: "Art Sculpture", reservePrice: 1000 },
        { itemNumber: 110, description: "Classic Car", reservePrice: 15000 }
    ];

    testData.forEach(itemData => {
      auction[`item${itemData.itemNumber}`] = {
        itemNumber: itemData.itemNumber,
        description: itemData.description,
        reservePrice: itemData.reservePrice,
        currentBid: 0,
        currentBuyer: 'none'
      };
    });
  
    console.log('\nTest data has been added to the auction.');
}


// Main function to run the input collection process
async function setup() {

    const useTestData = await getUserInput('Do you want to use test data? (yes/no): ');
  
    if (useTestData.trim().toLowerCase() === 'yes') {
        addTestData();
        displayItems(auction);
        return;
    } else if (useTestData.trim().toLowerCase() === 'no'){
        let numberOfItems = await getUserInput('How many items do you want to enter? ');
        numberOfItems = parseInt(numberOfItems, 10);

        if (isNaN(numberOfItems) || numberOfItems < 10) {
            console.log('There must be at least 10 items in the auction.');
            rl.close();
            return;
        }

        for (let i = 0; i < numberOfItems; i++) {
            let itemNumber = await getUserInput('\nItem number: ');
            itemNumber = parseInt(itemNumber, 10);

            if (isNaN(itemNumber)) {
            console.log('Please enter a valid number for the item number.');
            i--; // Decrement i to retry this iteration
            continue;
            }

            // Check if the item number is already used
            if (auction[`item${itemNumber}`]) {
            console.log(`An item with number ${itemNumber} already exists. Please enter a different number.`);
            i--; // Decrement i to retry this iteration
            continue;
            }

            const item = await createItem(itemNumber);
            if (item) {
                auction[`item${itemNumber}`] = item;
            } else {
            i--; // Decrement i to retry this iteration
            }
        }
    }
    console.log('\nAll items have been entered');
    displayItems(auction);
}


// Function to bid on a specific item
async function bidOnItem(itemKey) {
    let satisfied = false;
    while (!satisfied) {
        console.log(`\n\n---------------------------------------------------------------------------------------------`)
        console.log(`\nBidding on item: ${auction[itemKey].description} (Item Number: ${auction[itemKey].itemNumber}, Current Bid: $${auction[itemKey].currentBid})`);
        console.log(`\n---------------------------------------------------------------------------------------------`)
        await placeBid(itemKey);
        
        const moreBids = await getUserInput('Is there another bid? (yes/no): ');
        satisfied = moreBids.trim().toLowerCase() !== 'yes';
    }
}

// Updated placeBid function to work with specific item
async function placeBid(itemKey) {
    let buyerID = await getUserInput('\nEnter your buyer ID: ');
    buyerID = parseInt(buyerID, 10);
    const buyer = buyers.find(b => b.ID === buyerID);

    if (!buyer) {
        console.log('Invalid buyer ID. Please try again.');
        return;
    }

    let bidAmount = await getUserInput('Enter your bid amount: $');
    bidAmount = parseFloat(bidAmount);

    if (isNaN(bidAmount) || bidAmount <= auction[itemKey].currentBid) {
        console.log('Invalid bid. It must be higher than the current bid. Please try again.');
        return;
    }

    // Update the item with the new bid and buyer
    auction[itemKey].currentBid = bidAmount;
    auction[itemKey].currentBuyer = buyer.name;

    console.log(`Bid placed successfully. Current bid for item ${auction[itemKey].itemNumber} is now $${bidAmount} by ${buyer.name}`);
}

// Main function to run the auction process
async function runAuction() {
    await setup();

    for (const key in auction) {
        if (auction.hasOwnProperty(key)) {
            await bidOnItem(key);
        }
    }

    console.log('\nFinal auction status:');
    finalizedItems(auction);
    rl.close();
}

runAuction();

