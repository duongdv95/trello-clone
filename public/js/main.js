const cardForm = document.getElementById("card-form-template").innerHTML;
const listContainer = document.getElementById("list-container");
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
                var newCardElement = `<div class="fill" draggable="true">${newCardText}<i class="fas fa-trash-alt"></i></div>`;
                listElement.insertAdjacentHTML("beforeend", newCardElement);
                listElement.lastElementChild.addEventListener("dragstart", dragStart);
                listElement.lastElementChild.addEventListener("dragend", dragEnd);
            }
        }
    })
}

function createList(listTitle) {
    const newList = document.createElement("div");
    newList.innerHTML = `<h2>${listTitle}</h2>`
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



