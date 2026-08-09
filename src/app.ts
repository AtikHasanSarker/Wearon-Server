import express from "express";
import cors from "cors";
import authRouter from "./services/auth/auth.route";
import categoriesRouter from "./services/category/category.route";
import productsRouter from "./services/product/product.route";
import reviewsRouter from "./services/review/review.route";
import ordersRouter from "./services/order/order.route";
import errorHandler from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/orders", ordersRouter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hello, World!",
  });
});

// Register global error handler (must be last)
app.use(errorHandler);

export default app;
