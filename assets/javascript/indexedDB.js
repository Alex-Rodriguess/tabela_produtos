let outDB,
    inputPizza,
    inputQtd,
    inputValor,
    pizzaForm,
    dataList,
    db;


const dbName = 'pizzaDB';
const storeName = 'cardapio';

// function to create database
const createDB = () => {
    if (window.indexedDB) {
        const request = window.indexedDB.open(dbName, 4);

        request.onerror = (event) => {
            console.log('Erro de requerimento', event);
            outDB.innerHTML = 'Erro de requerimento';
        }

        request.onsuccess = (event) => {
            db = request.result;
            console.log('Successo no requerimento', event, db);
            outDB.innerHTML = 'Successo no requerimento';
            readData();
        }

        request.onupgradeneeded = (event) => {
            console.log('Upgrade de requerimento', event)
            outDB.innerHTML = 'Upgrade de requerimento';

            //saving the database
            let db = event.target.result;

            //
            let objectStore = db.createObjectStore(storeName,
                {
                    keyPath: 'id',
                    autoIncrement: true
                });

            // creating a index it can repeat if we pass the value unique as false
            objectStore.createIndex('nome', 'nome', { unique: false });

            // creating a second index the objectStore can have more than one
            objectStore.createIndex('qtd', 'qtd', { unique: false });

            objectStore.createIndex('val', 'val', { unique: false });

            console.log('Config completed');
        }

    } else {
        console.log('You don\'t have support');
        outDB.innerHTML = 'Upgrade de requerimento';
    }
}

const addData = (event) => {
    event.preventDefault();

    const newPizza = {
        nome: inputPizza.value,
        qtd: inputQtd.value,
        val: inputValor.value
    };

    let transaction = db.transaction([storeName], 'readwrite');
    let objectStore = transaction.objectStore(storeName);
    let request = objectStore.add(newPizza);

    request.onsuccess = () => {
        inputPizza.value = '';
        inputQtd.value = '';
        inputValor.value = '';
    };

    transaction.oncomplete = (event) => {
        console.log('transaction completed', event)
    }

    transaction.onerror = (event) => {
        console.log('transaction error', event)
    }
}

//Lendo os dados e escrevendo na tela

const readData = () => {
    cleanList();
    let transaction = db.transaction(storeName);
    let objectStore = transaction.objectStore(storeName);
    objectStore.openCursor().onsuccess = (event) => {
        let cursor = event.target.result;

        if (cursor) {
            const listItem = document.createElement('table');
            const btn = document.createElement('button');
            btn.classList.add("btn-excluir");


            btn.innerHTML = "Excluir";
            const textItem = `Pizza: ${cursor.value.nome} |  Qtd: ${cursor.value.qtd} |  Val: ${cursor.value.val}`;

            listItem.textContent = textItem;
            listItem.setAttribute('data-pizza-id', cursor.value.id);

            dataList.appendChild(listItem);
            dataList.append(btn);


            cursor.continue();
        } else if (!dataList.firstChild) {
            const listItem = document.createElement('li');
            listItem.textContent = 'No location saved';
            dataList.appendChild(listItem);
        }

    }
}

const cleanList = () => {
    dataList.innerHTML = '';
}


// execute script when the DOM is loaded
document.addEventListener('DOMContentLoaded', (event) => {
    outDB = document.getElementById('outputdb');
    inputPizza = document.getElementById('inputPizza');
    inputQtd = document.getElementById('inputQtd');
    inputValor = document.getElementById('inputValor');
    pizzaForm = document.getElementById('pizzaForm');
    dataList = document.getElementById('data-list');

    if (pizzaForm == "") return;
    pizzaForm.onsubmit = addData;


    createDB();
});

