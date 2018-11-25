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

const editButton = (function() {
    var privateElement;
    return {
        store: function(element) {
          privateElement = element;
        },
        state: function() {
          return privateElement;
        },
        clear: function() {
            privateElement = null;
        }
    };
})();

initalizeListForm();
initializeCardForm()
initializeDeleteList();
initializeDeleteCard();
initializeEditCard();
initializeUpdateCard();

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
                var newCardElement = `<div class="fill" draggable="true">
                <div>
                    ${newCardText}
                </div>
                <div>
                    <button class="edit-card-button">edit</button>
                    <button class="delete-card-button">${deleteIcon}</button>
                </div>
                </div>`;
                listElement.insertAdjacentHTML("beforeend", newCardElement);
                listElement.lastElementChild.addEventListener("dragstart", dragStart);
                listElement.lastElementChild.addEventListener("dragend", dragEnd);
            }
        }
    })
}

function initializeEditCard() {
    document.addEventListener("click", function(e) {
        if(e.target && e.target.className == "edit-card-button"){
            if(!editButton.state()) {
                var getCardText = e.target.parentElement.previousElementSibling.textContent.trim();
                var cardElement = e.target.parentElement.previousElementSibling;
                editButton.store(e.target);
                cardElement.innerHTML = `<form class="update-card-form">
                <input name="card-list" type="text" value=${getCardText} autocomplete="off"/><button>finish</button>
                </form>`
                e.target.classList.add("invisible");
            } else {
                return
            }
        }
    })
}

function initializeUpdateCard() {
    document.addEventListener("submit", function(e) {
        e.preventDefault()
        if(e.target && e.target.className == "update-card-form") {
            var cardElement = e.target.parentElement
            var updatedCard = e.target.firstElementChild.value
            cardElement.innerHTML = updatedCard
            editButton.state().classList.remove("invisible");
            editButton.clear();
            
        }
    })
}

function initializeDeleteList() {
    document.addEventListener("click", function(e) {
        if(e.target && e.target.className == "delete-list"){
            if(editButton.state()) {
                return
            } else {
                var getList = e.target.parentElement.parentElement;
                getList.remove();
            }
        }
    })
}

function initializeDeleteCard() {
    document.addEventListener("click", function(e) {
        if(e.target && e.target.className == "delete-card-button"){
            if(editButton.state()) {
                return
            } else {
                var getCard = e.target.parentElement.parentElement;
                getCard.remove();
            }

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



