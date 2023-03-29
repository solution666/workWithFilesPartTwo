const csv = require('csv-parser');
const fs = require('fs');

const shoppingListFile = 'shopping-list.csv';

function addProduct(id, name, price, quantity) {
  const newRow = `${id},${name},${price},${quantity}\n`;
  fs.appendFile(shoppingListFile, newRow, (err) => {
    if (err) throw err;
    console.log(`Продукт ${name} додано до списку.`);
  });
}

function getProductById(id) {
  fs.createReadStream(shoppingListFile)
    .pipe(csv())
    .on('data', (row) => {
      if (row.id === id) {
        console.log(`Продукт: ${row.name}, Ціна: ${row.price}, Кількість: ${row.quantity}`);
      }
    })
    .on('end', () => {
      console.log(`Продукт з id ${id} не знайдено.`);
    });
}

function deleteProductById(id) {
  const tempFile = 'shopping-list.csv';
  const writeStream = fs.createWriteStream(tempFile);

  fs.createReadStream(shoppingListFile)
    .pipe(csv())
    .on('data', (row) => {
      if (row.id !== id) {
        const newRow = `${row.name},${row.price},${row.quantity}\n`;
        writeStream.write(newRow);
      } else {
        console.log(`Продукт з id ${id} видалено зі списку.`);
      }
    })
    .on('end', () => {
      writeStream.end();
      fs.unlinkSync(shoppingListFile);
      fs.renameSync(tempFile, shoppingListFile);
      console.log(`Продукт з id ${id} не знайдено.`);
    });
}

function updateProductById(id, newName, newPrice, newQuantity) {
  const tempFile = 'temp.csv';
  const writeStream = fs.createWriteStream(tempFile);

  fs.createReadStream(shoppingListFile)
    .pipe(csv())
    .on('data', (row) => {
      if (row.id === id) {
        row.name = newName;
        row.price = newPrice;
        row.quantity = newQuantity;
      }
      const newRow = `${row.name},${row.price},${row.quantity}\n`;
      writeStream.write(newRow);
    })
    .on('end', () => {
      writeStream.end();
      fs.unlinkSync(shoppingListFile);
      fs.renameSync(tempFile, shoppingListFile);
      console.log(`Продукт з id ${id} змінено.`);
    });
}

addProduct(1, 'apple', 4, 'red');
addProduct(2, 'orange', 12, 'orange');

const elem = getProductById(1);
console.log(elem);

deleteProductById(2);

updateProductById(1, 'banana', 16, 'yellow');