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
            console.log('Erro', event);
            outDB.innerHTML = 'Erro';
        }

        request.onsuccess = (event) => {
            db = request.result;
            console.log('online', event, db);
            outDB.innerHTML = 'online';
            readData();
        }

        request.onupgradeneeded = (event) => {
            console.log('Upgrade', event)
            outDB.innerHTML = 'Upgrade';

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
        outDB.innerHTML = 'Upgrade';
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
            let linha = document.createElement('tr');
            let linha_data_1 = document.createElement('td')

            const textItem = `Pizza: ${cursor.value.nome}  Qtd: ${cursor.value.qtd}  Val: ${cursor.value.val}`;

            listItem.textContent = textItem;
            listItem.setAttribute('data-pizza-id', cursor.value.id);

            dataList.appendChild(listItem);
            linha.appendChild(linha_data_1);

            cursor.continue();
        } else if (!dataList.firstChild) {
            const listItem = document.createElement('li');
            listItem.textContent = 'Banco de dados vazio';
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




    pizzaForm.onsubmit = addData;


    createDB();
});

/**Mostrando e escondendo a tabela dados*/

var btn = document.querySelector("#btn-mostrarocultar");

btn.addEventListener("click", function () {

    var div = document.querySelector("#data-list");

    if (div.style.display === "none") {

        div.style.display = "block";

    } else {
        div.style.display = "none";

    }
})

/**Botao Reload */

var btnReload = document.getElementById("btn-reload");

btnReload.addEventListener("click", function () {

    location.reload();
})
