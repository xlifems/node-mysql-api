import { Router } from "express";
import {
  createBook,
  deleteBook,
  getBook,
  getBooks,
  updateBook,
} from "../controllers/books.controller.js";

const router = Router();

router.get("/books", getBooks);
router.get("/books/:id", getBook);
router.post("/books", createBook);
router.patch("/books/:id", updateBook);
router.delete("/books/id", deleteBook);

export default router;
