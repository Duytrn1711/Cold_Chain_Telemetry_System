const express = require("express");

const app = express();

app.use(express.json());

// Cho phép truy cập file trong thư mục public
app.use(express.static("public"));

let users = [];

let id = 1;

// ================= CREATE =================

app.post("/users", (req, res) => {
    users.push({
        id: id++,
        ...req.body
    });

    res.json(users.at(-1));
});

// ================= READ =================

app.get("/users", (req, res) => {
    res.json(users);
});

// ================= UPDATE =================

app.put("/users/:id", (req, res) => {
    const user = users.find(
        u => u.id == req.params.id
    );

    if (user) {
        Object.assign(user, req.body);
    }

    res.json(
        user ?? { error: "User not found" }
    );
});

// ================= DELETE =================

app.delete("/users/:id", (req, res) => {
    users = users.filter(
        u => u.id != req.params.id
    );

    res.json({
        message: "Deleted"
    });
});

// ================= SERVER =================

app.listen(3000, () => {
    console.log("Server đang chạy tại http://localhost:3000");
});
