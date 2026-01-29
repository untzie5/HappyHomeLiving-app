import express from "express"
import createUser from "../dataObjects/users.mjs";
import { generateID } from "../dataObjects/users.mjs";

const userRouter = express.Router();

userRouter.use(express.json());

userRouter.post("/", (req, res, next) => {

    const { acceptToS } = req.body ?? {}; 
    
    if (acceptToS !== true) {
        return res.status(400).json({
            error: "You must accept the Terms of Service to create an account"
        });
    }

    let newUser = createUser();
    newUser.id = generateID();
    newUser.tosAccepted = true;
    newUser.tosAcceptedAt = new Date().toISOString();


    res.json(newUser);
});

export default userRouter;