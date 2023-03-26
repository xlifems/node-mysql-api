import { Router } from "express";
import {
  addMatter,
  addMatters,
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
router.post("/books/matter", addMatter);
router.post("/books/matters", addMatters);

export default router;
