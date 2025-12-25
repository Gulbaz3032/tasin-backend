import express from "express"
const app = express();
import dotenv from "dotenv"
dotenv.config();

app.use(express.json());

const port = process.env.PORT 

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Server created successfully"
    })
})

app.listen(port, ()=> {
    console.log(`Server is running on PORT ${port}`);
})