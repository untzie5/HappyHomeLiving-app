import app from "./app/app.mjs";

const PORT = 3000;


app.listen (PORT, () => {
    console.log ('Server is running on port ${PORT}')
});