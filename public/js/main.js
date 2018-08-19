const cardForm = document.getElementById("card-form-template").innerHTML;
const listContainer = document.getElementById("list-container");

document.getElementById("list-form").addEventListener("submit", (e) => {
    e.preventDefault();
    var newList = document.createElement("div");
    newList.insertAdjacentHTML("beforeend", cardForm);
    newList.addEventListener("dragover", dragOver);
    newList.addEventListener("dragenter", dragEnter);
    newList.addEventListener("dragleave", dragLeave);
    newList.addEventListener("drop", dragDrop);
    newList.className = "empty";
    listContainer.appendChild(newList);
})

document.addEventListener("submit", function(e) {
    const listElement = e.target.parentElement;
    e.preventDefault();
    if(e.target && e.target.className == "card-form") {
        var newCardText = e.target.firstElementChild.value;
        e.target.firstElementChild.value = "";
        var newCardElement = `<div class="card" draggable="true">${newCardText}</div>`;
        listElement.insertAdjacentHTML("beforeend", newCardElement);

        listElement.lastElementChild.addEventListener("dragstart", dragStart);
        listElement.lastElementChild.addEventListener("dragend", dragEnd);
    }
})
 
var element = (function() {
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
    var currentElementDragged = element.state();
    console.log(currentElementDragged);
    this.append(currentElementDragged);
}



