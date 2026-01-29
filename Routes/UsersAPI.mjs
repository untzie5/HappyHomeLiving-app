import express from "express"
import createUser from "../dataObjects/users.mjs";
import { generateID } from "../dataObjects/users.mjs";

const userRouter = express.Router();

userRouter.use(express.json());

userRouter.post("/", (req, res, next) => {

    let newUser = createUser();
    newUser.id = generateID();


    res.json(newUser);
});

export default userRouter;