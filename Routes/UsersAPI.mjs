import express from "express"
import user from "../dataObjects/users.mjs";
import { generateID } from "../dataObjects/users.mjs";

const userRouter = express.Router();

userRouter.use(express.json());

userRouter.post("/", (req, res, next) => {

    let newUser = user();
    newUser.id = generateID();


    res.json(newUser);
});

export default userRouter;