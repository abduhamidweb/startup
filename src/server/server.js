import express from "express";
import "../utils/db.js";
import path from "path";
import fileUpload from "express-fileupload";
import cors from "cors";
import errorMiddleware from "../middleware/errorHandler.js";
import indexRouter from "../routes/index.routes.js";
// port 5000 || 3000
const PORT = process.env.PORT || 3000;
// app 
const app = express();
app.use(express.json());
app.use(cors('*'));
app.use(express.static(path.join(process.cwd(), "src", "public")));
app.use(errorMiddleware);
app.use(fileUpload({
    limits: {
        fileSize: 50 * 1024 * 1024
    }
}));
// All routes
app.use(indexRouter);
app.get('/', (req, res) => {
    res.send({
        message: "Welcome to Express",
        status: 200,
    })
});


// file size

// confirm

// router and middlewares


// server starting
app.listen(PORT, () => {
    console.log("Service listening on port " + PORT);
});