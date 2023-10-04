const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();
const PORT = 8000;

// Middleware - Plugin
app.use(express.urlencoded({ extended: false}));

app.get("/user", (req, res) => {
    const html = `
    <ul>
       ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
})

// REST API

app.get("/api/users", (req, res) => {
    return res.json(users);
});

app.route("/api/users/:id")
.get((req, res) => {
     const id =Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
})
.patch((req, res) => {
    // edit the user with id
    return res.json({status: "pending"});
})
.delete((req, res) =>{
    // todo: delete the user with id
    return res.json({status: "pending"});
});




app.post("/api/users", (req, res) =>{
    const body = req.body;
    // console.log("Body", body);
    users.push({...body, id: users.length + 1});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) =>{
        return res.json({status: "success", id: users.length});
    })
    
});

// PATCH /api/users/:id - Update a user with a specific ID
app.patch("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const updatedUser = req.body; // Assuming the request body contains the updated user data

    // Find the user with the specified ID
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    // Update the user's data
    users[userIndex] = { ...users[userIndex], ...updatedUser };

    // Save the updated user data to the JSON file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to update user" });
        }

        return res.json({ status: "success", id });
    });
});

// DELETE /api/users/:id - Delete a user with a specific ID
app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);

    // Find the user with the specified ID
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    // Remove the user from the users array
    users.splice(userIndex, 1);

    // Save the updated user data to the JSON file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to delete user" });
        }

        return res.json({ status: "success", id });
    });
});


app.listen(PORT, () => console.log(`Server Started at PORT: ${ PORT }`));
