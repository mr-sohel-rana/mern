const app = require("./app");
const dotenv = require("dotenv");

dotenv.config();

const port =5000;

app.listen(port, (err) => {
    if (err) {
        console.error("Server failed to start:", err);
    } else {
        console.log(`Server running at http://localhost:${port}`);
    }
});
