import express from "express";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("views"));

app.get("/", (req, result) => {
    result.sendFile(process.cwd() + "/views/login.html");
});

app.get("/register", (req, result) => {
    result.sendFile(process.cwd() + "/views/register.html");
});

app.post("/register", (req, result) => {

    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    let users = JSON.parse(fs.readFileSync("database.json"));

    if (!username || !password || !confirmPassword) {
        return result.send("Please fill all the fields.");
    }

    if (password !== confirmPassword) {
        return result.send("Passwords do not match.<br><a href='/register'>Go Back</a>");
    }

    let found = users.find(user => user.username === username);

    if (found) {
        return result.send("Username already exists.<br><a href='/register'>Go Back</a>");
    }

    users.push({
        username: username,
        password: password
    });

    fs.writeFileSync("database.json", JSON.stringify(users, null, 2));
    result.send("Registration Successful!<br><a href='/'>Login</a>");

});

app.post("/login", (req, result) => {

    const username = req.body.username;
    const password = req.body.password;

    let users = JSON.parse(fs.readFileSync("database.json"));

    let found = users.find(user => user.username === username && user.password === password);

    if (found) {
        result.sendFile(process.cwd() + "/views/dashboard.html");
    } else {
        result.send("Invalid Username or Password.<br><a href='/'>Try Again</a>");
    }

});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});