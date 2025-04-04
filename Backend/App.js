import express from 'express';
import cors from 'cors';
import router from './route/route.js';
import categoryRoutes from './route/categoryRoute.js';
import brandRoutes from "./route/brandRoute.js";
import productRouter from "./route/productRouter.js"
import path from 'path'
import { dirname } from 'path';

const app = express();
app.use(cors());
app.use(express.json());


app.use("/", router);
app.use('/category', categoryRoutes)
app.use('/brand', brandRoutes )
app.use('/product',productRouter)

const __dirname=path.resolve()
app.use('/uploads' , express.static(path.join(__dirname, 'uploads/')))
console.log(__dirname)

app.listen(7000, () => {
    console.log("Server is running on port 7000");
});
