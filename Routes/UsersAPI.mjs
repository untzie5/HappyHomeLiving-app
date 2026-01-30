import express from "express"
import createUser, { generateID, saveUser, getUserById, deleteUserById } from "../dataObjects/users.mjs";


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
    saveUser(newUser);

    res.json(newUser);
});

userRouter.get("/:id", (req, res, next) => {
    const user = getUserById(req.params.id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
});

userRouter.delete("/:id", (req, res) => {
    const id = req.params.id;

    const deleted = deleteUserById(id);

    if (!deleted) {
        return res.status(404).json({ error: "User not found"});
    }

    res.json({
        deleted: true, 
        message: "Account deleted and consent withdrawn"
    });
});

export default userRouter;