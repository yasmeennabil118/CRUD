var productName = document.getElementById("productName");
var productPrice = document.getElementById("productPrice");
var productCategory = document.getElementById("productCategory");
var productDescription = document.getElementById("productDescription");
var productImage = document.getElementById("productImage");
var productList = [];
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var currentIndex;
var regex = {
    productName: {
        value: /^[A-Z][A-Za-z0-9\s]*$/,
        isValid: false
    },
    productPrice: {
        value: /^([1-4][0-9]{4}|50000)$/,
        isValid: false
    },
    productDescription: {
        value: /^.{5,20}$/,
        isValid: false
    },
    productCategory: {
        value: /(tv|mobile|laptop|others)/i,
        isValid: false
    }
};
if (localStorage.getItem("productList") != null) {
    productList = JSON.parse(localStorage.getItem("productList"));
    display(productList);
}

function addProduct() {
    var product = {
        name: productName.value,
        price: productPrice.value,
        category: productCategory.value,
        description: productDescription.value,
        image: `images/${productImage.files[0]?.name}`,
        id: productList.length
    };
    productList.push(product);
    updateLocalStorage();
    display(productList);
    updateInputsValue();
    addBtn.disabled = true;
    removeClass();
}

function display(list) {
    var productsBox = ``;
    for (var i = 0; i < list.length; i++) {
        productsBox += `<div class="col-md-4">
                <div class="item border border-dark rounded-3 overflow-hidden">
                    <img src=${list[i].image} class="w-100" alt="">
                    <div class="p-3">
                        <h2 class="h4"><b>Product Name: </b>${list[i].newName ? list[i].newName : list[i].name}</h2>
                        <p class="mb-2"><b>Product Description: </b>${list[i].description}</p>
                        <h3 class="h5"><b>Product Price: </b>${list[i].price}</h3>
                        <h3 class="h5"><b>Product Category: </b>${list[i].category}</h3>
                        <button class="btn btn-danger w-100 mb-2" onclick="deleteProduct(${i})">Delete</button>
                        <button class="btn btn-warning w-100" onclick="getDataToUpdate(${i})">Update</button>
                    </div>
                </div>
            </div>`;
    }
    document.getElementById("myData").innerHTML = productsBox;
}

function deleteProduct(id) {
    productList.splice(id, 1);
    updateLocalStorage();
    display(productList);
}

function updateInputsValue(config) {
    productName.value = config ? config.name : null;
    productPrice.value = config ? config.price : null;
    productCategory.value = config ? config.category : null;
    productDescription.value = config ? config.description : null;
    productImage.value = null;
}

function getDataToUpdate(id) {
    currentIndex = id;
    updateInputsValue(productList[id]);
    addBtn.classList.add('d-none');
    updateBtn.classList.remove('d-none');
}

function updateProduct() {
    productList[currentIndex].name = productName.value;
    productList[currentIndex].price = productPrice.value;
    productList[currentIndex].category = productCategory.value;
    productList[currentIndex].description = productDescription.value;
    display(productList);
    updateBtn.classList.add('d-none');
    addBtn.classList.remove('d-none');
    updateLocalStorage();
    updateInputsValue();
    addBtn.disabled = true;
    updateBtn.disabled = false;
    removeClass();
}

function updateLocalStorage() {
    localStorage.setItem("productList", JSON.stringify(productList));
}

function search(searchKey) {
    if (searchKey == "") {
        display(productList);
        return;
    }
    var searchItem = [];
    for (var i = 0; i < productList.length; i++) {
        if (productList[i].name.toLowerCase().includes(searchKey.toLowerCase())) {
            productList[i].newName = productList[i].name.toLowerCase().replace(searchKey.toLowerCase(), `<span class="text-danger">${searchKey}</span>`);
            capitalize(productList[i].newName);
            searchItem.push(productList[i]);
        }
    }
    console.log(searchItem);
    display(searchItem);
}

function validateProductInput(element) {
    if (regex[element.id].value.test(element.value) == true) {
        element.classList.add("is-valid");
        element.classList.remove("is-invalid");
        element.nextElementSibling.classList.add("d-none");
        regex[element.id].isValid = true;
    }
    else {
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");
        element.nextElementSibling.classList.remove("d-none");
        regex[element.id].isValid = false;
    }
    toggleUpdateBtn();
    toggleAddBtn();
}

function toggleAddBtn() {
    if (regex.productName.isValid && regex.productPrice.isValid && regex.productCategory.isValid && regex.productDescription.isValid) {
        addBtn.disabled = false;
        updateBtn.disabled = false;
    }
    else {
        addBtn.disabled = true;
        updateBtn.disabled = true;
    }
}

function toggleUpdateBtn() {
    if (regex.productName.isValid || regex.productPrice.isValid || regex.productCategory.isValid || regex.productDescription.isValid) {
        updateBtn.disabled = false;
    }
    else {
        updateBtn.disabled = true;
    }
}

function removeClass() {
    productName.classList.remove("is-invalid", "is-valid");
    productPrice.classList.remove("is-invalid", "is-valid");
    productCategory.classList.remove("is-invalid", "is-valid");
    productDescription.classList.remove("is-invalid", "is-valid");
}