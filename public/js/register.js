const createUser = document.querySelector(".create-user");

createUser.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = createUser.querySelector(".username").value;
    const password = createUser.querySelector(".password").value;
    const response = await request("POST", "/register", {username, password});
    if (response.status === 200) {
        await request("POST", "/login", {username, password});
        console.log("Register success!")
        window.location.assign("/trello");
    }
    else {
        console.log("Register failed!");
    }
})

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