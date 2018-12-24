const cardForm = document.getElementById("card-form-template").innerHTML;
const listContainer = document.getElementById("list-container");
const empty = document.getElementsByClassName("empty");
const fill = document.getElementsByClassName("fill");

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
initializeRenderedListsAndCards();

function initializeRenderedListsAndCards() {
    if(empty) {
        for(var i = 0; i < empty.length; i++) {
            addDragProperties(empty[i]);
        }
    }    
    if(fill) {
        for(var k = 0; k < fill.length; k++) {
            fill[k].addEventListener("dragstart", dragStart);
            fill[k].addEventListener("dragend", dragEnd);  
        }
    }
}

function initalizeListForm() {
    document.getElementById("list-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const listTitle = e.target.firstElementChild.value;
        if(listTitle) {
            const response = await request("POST", "/trello", {listTitle})
            const responseJSON = await response.json();
            const listID = responseJSON.listID;
            createList({listTitle, listID});
            e.target.firstElementChild.value = "";  
        }
    })
}

function initializeCardForm() {
    document.addEventListener("submit", async function(e) {
        const listElement = e.target.parentElement;
        const listID = listElement.dataset.listId;
        e.preventDefault();
        if(e.target && e.target.className == "card-form") {
            var newCardText = e.target.firstElementChild.value;
            if(newCardText) {
                const response = await request("POST", `/trello/${listID}`, {newCardText, listID});
                const responseJSON = await response.json();
                const cardID = responseJSON.cardID;
                e.target.firstElementChild.value = ""
                createCard(cardID, newCardText, listElement)
            }
        }
    })
}

function createCard(cardID, newCardText, listElement) {
    var newCardElement = `<div class="fill" draggable="true" data-card-id="${cardID}">
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

function initializeEditCard() {
    document.addEventListener("click", function(e) {
        if(e.target && e.target.className == "edit-card-button"){
            if(!editButton.state()) {
                var getCardText = e.target.parentElement.previousElementSibling.textContent.trim();
                var cardElement = e.target.parentElement.previousElementSibling;
                e.target.parentElement.previousElementSibling.parentElement.setAttribute("draggable", false)
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
    document.addEventListener("submit", async function(e) {
        e.preventDefault()
        if(e.target && e.target.className == "update-card-form") {
            var cardElement = e.target.parentElement.parentElement
            var cardID = cardElement.dataset.cardId;
            var listID = cardElement.parentElement.dataset.listId;
            var cardText = e.target.parentElement
            var updatedCard = e.target.firstElementChild.value
            cardText.innerHTML = updatedCard
            const response = await request("PUT", `/trello/${listID}/${cardID}`, {cardID, listID, updatedCard});
            const responseJSON = await response.json();
            const updateStatus = responseJSON.updateStatus;
            if(updateStatus) {
                editButton.state().classList.remove("invisible");
                editButton.clear();
                cardElement.setAttribute("draggable", true)
            }
        }
    })
}

function initializeDeleteList() {
    document.addEventListener("click", async function(e) {
        if(e.target && e.target.className == "delete-list"){
            if(editButton.state()) {
                return
            } else {
                var getList = e.target.parentElement.parentElement;
                var listID = getList.dataset.listId;
                const response = await request("DELETE", `/trello/${listID}`, {listID})
                const responseJSON = await response.json();
                const deleteStatus = responseJSON.deleteStatus;
                if (deleteStatus){
                    getList.remove()
                }
            }
        }
    })
}

function initializeDeleteCard() {
    document.addEventListener("click", async function(e) {
        if(e.target && e.target.className == "delete-card-button"){
            if(editButton.state()) {
                return
            } else {
                var getCard = e.target.parentElement.parentElement;
                var cardID = getCard.dataset.cardId;
                var getList = getCard.parentElement;
                var listID = getList.dataset.listId;
                const response = await request("DELETE", `/trello/${listID}/${cardID}`, {listID, cardID});
                const responseJSON = await response.json();
                const deleteStatus = responseJSON.deleteStatus;
                if (deleteStatus) {
                    getCard.remove();
                }
            }

        }
    })
}

function createList({listTitle, listID}) {
    const newList = document.createElement("div");
    newList.innerHTML = `<div class="list-title">${listTitle}<button class="delete-list">${deleteIcon}</button></div>`
    newList.insertAdjacentHTML("beforeend", cardForm);
    addDragProperties(newList);
    newList.className = "empty";
    newList.setAttribute("data-list-id", listID)
    listContainer.appendChild(newList);
}

function addDragProperties(element) {
        element.addEventListener("dragover", dragOver);
        element.addEventListener("dragenter", dragEnter);
        element.addEventListener("dragleave", dragLeave);
        element.addEventListener("drop", dragDrop);
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

function request (type, path, data) {
    return window.fetch(path, {
        method: type,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

