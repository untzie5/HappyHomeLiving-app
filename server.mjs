import app from "./app/app.mjs";
import contentRouter from "./Routes/contentAPI.mjs"


const PORT = 3000;
const app = express();

app.use(express.json());

app.use("/content", contentRouter);


app.listen (PORT, () => {
    console.log ('Server is running on port ${PORT}')
});