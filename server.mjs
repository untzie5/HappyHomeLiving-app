import app from "./app/app.mjs";
import quietHours from "./modules/QuietHours.mjs";

const PORT = 3000;


app.listen (PORT, () => {
    console.log ('Server is running on port ${PORT}')
});