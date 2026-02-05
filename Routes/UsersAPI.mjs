import express from "express"
import createUser, { generateID, saveUser, getUserById, deleteUserById, findUserByUsername, updateUserById } from "../dataObjects/users.mjs";


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

userRouter.post("/login", (req, res) => {
    const { username, password } = req.body ?? {};
    
    const user = findUserByUsername (username);
    if (!user || user.password !== password) {
        return res.status(401).json({error: "Invalid username or password"});
        }

        res.json(user);
});

userRouter.get("/:id", (req, res, next) => {
    const user = getUserById(req.params.id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
});

userRouter.patch("/:id", (req,res) => {
    const updated = updateUserById( req.params.id, req.body ?? {});
    if (!updated) return res.status(404).json({error: "User not found " });
    res.json(updated);
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