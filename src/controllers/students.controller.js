import { pool } from "../db.js";

export const getStudents = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM student");
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const getStudent = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM student WHERE id = ? ", [
      req.params.id,
    ]);
    if (rows.length <= 0) {
      res.status(400).json({ message: "student not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const createStudent = async (req, res) => {
  try {
    const {
      school_id,
      first_name,
      last_name,
      email,
      phone,
      address,
      date_of_birth,
      gender,
    } = req.body;

    // const [rows] = await pool.query('INSERT INTO students SET ?', { school_id, first_name, last_name, email, phone, address, date_of_birth, gender });
    const [rows] = await pool.query(
      "INSERT INTO student ( school_id, first_name, last_name, email, phone, address, date_of_birth, gender ) VALUES( ?, ?, ?, ?,?, ?,?, ? )",
      [
        school_id,
        first_name,
        last_name,
        email,
        phone,
        address,
        date_of_birth,
        gender,
      ]
    );

    res.status(201).send({
      id: rows.insertId,
      first_name,
      first_name,
      last_name,
      email,
      phone,
      address,
      date_of_birth,
      gender,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert student" });
  }
};

export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const {
    school_id,
    first_name,
    last_name,
    email,
    phone,
    address,
    date_of_birth,
    gender,
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE student 
       SET school_id = IFNULL( ? , school_id), first_name = IFNULL( ? , first_name), last_name = IFNULL( ? , last_name), 
       email = IFNULL( ? , email), phone = IFNULL( ? , phone),address = IFNULL( ? , address), 
       date_of_birth = IFNULL( ? , date_of_birth), gender = IFNULL( ? , gender)
       WHERE id = ?`,
      [
        school_id,
        first_name,
        last_name,
        email,
        phone,
        address,
        date_of_birth,
        gender,
        id,
      ]
    );

    if (result.affectedRows <= 0)
      return res.status(400).json({ message: "student not found" });

    const [rows] = await pool.query("SELECT * FROM student WHERE id = ? ", [
      id,
    ]);
    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
export const deleteStudent = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM student WHERE id = ? ", [
      req.params.id,
    ]);

    if (result.affectedRows <= 0)
      return res.status(400).json({ message: "student not found" });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
