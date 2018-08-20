const cardForm = document.getElementById("card-form-template").innerHTML;
const listContainer = document.getElementById("list-container");
const deleteIcon = 'x'

const element = (function() {
    var privateElement;
    return {
        store: function(element) {
          privateElement = element;
        },
        state: function() {
          return privateElement;
        }
    };
})();

initalizeListForm();
initializeCardForm()
initializeDeleteList();
initializeDeleteCard();

function initalizeListForm() {
    document.getElementById("list-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const listTitle = e.target.firstElementChild.value;
        if(listTitle) {
            createList(listTitle);
            e.target.firstElementChild.value = "";  
        }
    })
}

function initializeCardForm() {
    document.addEventListener("submit", function(e) {
        const listElement = e.target.parentElement;
        e.preventDefault();
        if(e.target && e.target.className == "card-form") {
            var newCardText = e.target.firstElementChild.value;
            if(newCardText) {
                e.target.firstElementChild.value = "";
                var newCardElement = `<div class="fill" draggable="true">${newCardText}<button class="delete-card">${deleteIcon}</button></div>`;
                listElement.insertAdjacentHTML("beforeend", newCardElement);
                listElement.lastElementChild.addEventListener("dragstart", dragStart);
                listElement.lastElementChild.addEventListener("dragend", dragEnd);
            }
        }
    })
}

function initializeDeleteList() {
    document.addEventListener("click", function(e) {
        if(e.target && e.target.className == "delete-list"){
            var getList = e.target.parentElement.parentElement;
            getList.remove();
        }
    })
}

function initializeDeleteCard() {
    document.addEventListener("click", function(e) {
        if(e.target && e.target.className == "delete-card"){
            var getCard = e.target.parentElement;
            getCard.remove();
        }
    })
}

function createList(listTitle) {
    const newList = document.createElement("div");
    newList.innerHTML = `<div class="list-title">${listTitle}<button class="delete-list">${deleteIcon}</button></div>`
    newList.insertAdjacentHTML("beforeend", cardForm);
    newList.addEventListener("dragover", dragOver);
    newList.addEventListener("dragenter", dragEnter);
    newList.addEventListener("dragleave", dragLeave);
    newList.addEventListener("drop", dragDrop);
    newList.className = "empty";
    listContainer.appendChild(newList);
}

function dragStart() {
    element.store(this);
    this.className += " hold";
    setTimeout(() => (this.className = "invisible"), 0);
}

function dragEnd() {
    this.className = "fill";
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    this.className += " hovered";
}

function dragLeave() {
    this.className = "empty";
}

function dragDrop() {
    this.className = "empty";
    const currentElementDragged = element.state();
    this.append(currentElementDragged);
}



