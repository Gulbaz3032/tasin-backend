import express from "express"
const app = express();
import dotenv from "dotenv"
import cors from "cors"
import { dbConnection } from "./src/Utils/db";
dotenv.config();

app.use(express.json());

const port = process.env.PORT 
app.use(cors({
    origin: process.env.BASE_URL,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true
}));

dbConnection


app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Server created successfully"
    })
})

app.listen(port, ()=> {
    console.log(`Server is running on PORT ${port}`);
})