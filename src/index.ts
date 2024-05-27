import {startServer} from "./app"

async function initializeServer() {
    const app = await startServer();
    app.listen(4000, () => {
        console.log("Server is running on port 4000");
    });
}

initializeServer();