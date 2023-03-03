import { pool } from "../db.js";

export const getBooks = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM book");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const getBook = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM book WHERE id = ? ", [id]);

    if (rows.length <= 0) {
      res.status(400).json({ message: "Book not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const createBook = async (req, res) => {
  try {
    const { school_id, name, year, type } = req.body;

    const [rows] = await pool.query(
      "INSERT INTO book ( school_id, name, year, type ) VALUES( ?, ?, ?, ? )",
      [school_id, name, year, type]
    );

    res.status(201).send({
      id: rows.insertId,
      school_id,
      name,
      year,
      type,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { school_id, name, year, type } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE book 
         SET school_id = IFNULL( ? , school_id), name = IFNULL( ? , name), year = IFNULL( ? , year), 
         type = IFNULL( ? , type)
         WHERE id = ?`,
      [school_id, name, year, type, id]
    );

    if (result.affectedRows <= 0)
      return res.status(400).json({ message: "book not found" });

    const [rows] = await pool.query("SELECT * FROM book WHERE id = ? ", [id]);
    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
export const deleteBook = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM book WHERE id = ? ", [
      req.params.id,
    ]);

    if (result.affectedRows <= 0)
      return res.status(400).json({ message: "book not found" });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
