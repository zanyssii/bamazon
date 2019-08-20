require('dotenv').config(); 
var inquirer = require('inquirer');
var mysql = require('mysql');
var colors = require('colors/safe');
var Table = require('cli-table');


var keys = require('./keys.js');


var connection = mysql.createConnection({
    host: keys.mysql.host,
    port: keys.mysql.port,
    user: keys.mysql.user,
    password: keys.mysql.password,
    database: keys.mysql.database
});

function exit() {

    
    consoleOutput = '';

    
    consoleOutput = '';
    consoleOutput += '\n\n';
    consoleOutput += colors.red('******************************************\n');
    consoleOutput += colors.red('*                                        *\n');
    consoleOutput += colors.red('*') + colors.white('   Thank you for shopping at ') + colors.magenta('b') + colors.grey('Amazon') + colors.white('!   ') + colors.red('*\n');
    consoleOutput += colors.red('*                                        *\n');
    consoleOutput += colors.red('******************************************\n');

   
    console.log(consoleOutput);

    
    connection.end();
   
    process.exit();

}

function placeOrder(selectedProduct, selectedUnits) {
    
    connection.query('SELECT product_name, stock_quantity, price FROM products WHERE item_id=?', [selectedProduct], function(err, res) {

        
        if (err) throw err;

        
        if (res[0].stock_quantity < selectedUnits) {

            consoleOutput = '';
            consoleOutput += '\n\n';
            consoleOutput += colors.red('Insufficient quantity in stock!');
            consoleOutput += '\n\n';
            console.log(consoleOutput);

        } else {

            consoleOutput = '';
            consoleOutput += '\n\n';
            consoleOutput += colors.white('Invoice: \n');
            consoleOutput += colors.gray('____________________________________\n\n');
            consoleOutput += colors.yellow('Product:    ') + colors.white(res[0].product_name + '\n');
            consoleOutput += colors.yellow('Quantity:   ') + colors.white(selectedUnits + '\n');
            consoleOutput += colors.yellow('Unit Price: ') + colors.green('$') + colors.white(res[0].price + '\n');
            consoleOutput += '\n';
            consoleOutput += colors.yellow('Total cost: ') + colors.green('$') + colors.white((res[0].price * selectedUnits).toFixed(2) + '\n'); // toFixed to round to 2 decimal points
            consoleOutput += colors.gray('____________________________________\n\n');
            consoleOutput += '\n\n';
            console.log(consoleOutput);

        }

       
        inquirer.prompt([
            {
                type: 'list',
                message: 'Would you like to purchase something else?',
                choices: ['Yes', 'No'],
                name: 'newPurchase'
            }
        ]).then(function(answers){

            
            if (answers.newPurchase === "Yes") {

               
                console.log('\033c');
            
                displayProducts();
            }
            else {

               
                exit();
            }
        });
    });
}

function purchaseProduct(productList) {

    function validateNumber(currentUnits) {
        var reg = /^\d+$/;
        return reg.test(currentUnits) || 'Units should be a integer number!';
    }

    inquirer.prompt([
        {
            type: 'list',
            message: 'Which product would you like to buy?',
            choices: productList.toString().split(','),
            name: 'currentProduct'
        },
        {
            type: 'input',
            message: 'Great! How many units?',
            name: 'currentUnits',
            validate: validateNumber
        }
    ]).then(function(answers){

        
        var selectedProduct = answers.currentProduct.toString().split(' ')[0].trim();
        
        var selectedUnits = answers.currentUnits;

        placeOrder(selectedProduct, selectedUnits);

    });
}

function displayProducts() {

    
    connection.query('SELECT item_id, product_name, price FROM products', function(err, res) {
        if (err) throw err;

        
        var table = new Table({
            head: [colors.white('ID'), colors.white('Product'), colors.white('Price')],
            colWidths: [10, 50, 15]
        });

      
        var productList = [];

        for (var i=0; i<res.length; i++) {
            
         
            table.push([colors.yellow(res[i].item_id), colors.cyan(res[i].product_name), colors.green('$') + colors.white(res[i].price)]);

          
            productList.push(res[i].item_id + ' ' + res[i].product_name);
            
        }

        consoleOutput = '';
        consoleOutput = '\n';
        consoleOutput += colors.gray('__________________________\n\n');
        consoleOutput += colors.magenta('b') + colors.grey('Amazon') + colors.yellow(' Products for Sale\n');
        consoleOutput += table.toString();
        console.log(consoleOutput);
        
        purchaseProduct(productList);

    });
}

function customerAction (selection) {

  
    switch (selection) {
        case 'Purchase Product':
            
            displayProducts();
            break;
        case 'Exit':
            
            exit();
            break;
    }
}

function displayOptions() {

    inquirer.prompt([
        {
            type: 'list',
            message: 'Select Admin Action',
            choices: ['Purchase Product', 'Exit'],
            name: 'selectedAction'
        }
    ]).then(function(answers){

        customerAction(answers.selectedAction);

    });
}

function initialize() {

    console.log('\033c');
    
   
    consoleOutput = '';
    
    
    consoleOutput += colors.red('******************************************\n');
    consoleOutput += colors.red('*                                        *\n');
    consoleOutput += colors.red('*') + colors.white('          Welcome to ') + colors.magenta('b') + colors.grey('Amazon') + colors.white('!           ') + colors.red('*\n');
    consoleOutput += colors.red('*                                        *\n');
    consoleOutput += colors.red('*') + colors.yellow('      Author') + colors.green('  :  ') + colors.white('Argiris Balomenos      ') + colors.red('*\n');
    consoleOutput += colors.red('*') + colors.yellow('      Date') + colors.green('    :  ') + colors.white('March 11, 2019         ') + colors.red('*\n');
    consoleOutput += colors.red('*                                        *\n');
    consoleOutput += colors.red('******************************************\n\n');
    console.log(consoleOutput);

  
    displayOptions();

}


// Everything starts here
initialize();
