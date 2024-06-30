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

// get students pagination with limit and offset query parameters
export const getStudentsPagination = async (req, res) => {
  try {
    // Extract page and quantity parameters from the request body
    const page = parseInt(req.body.page) || 1;
    const quantity = parseInt(req.body.quantity) || 10; // Default to 10 items per page

    // Calculate offset based on the page and quantity
    const offset = (page - 1) * quantity;

    const [rows] = await pool.query("SELECT * FROM student LIMIT ?, ? ", [
      offset,
      quantity,
    ]);

    if (rows.length <= 0) {
      res.status(400).json({ message: "student not found" });
    }

    // Fetch total count of records for pagination
    const [response] = await pool.query(
      "SELECT COUNT(*) AS total FROM student"
    );

    const total = response[0].total;
    const totalPages = Math.ceil(total / quantity);

    // Send the paginated data as JSON response
    res.status(200).json({
      page: page,
      quantity: quantity,
      total,
      totalPages,
      data: rows,
    });
  } catch (error) {
    console.log(error);
    res.send;
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
      document_type,
      document,
      date_of_birth,
      gender,
      photo_url,
    } = req.body;

    // const [rows] = await pool.query('INSERT INTO students SET ?', { school_id, first_name, last_name, email, phone, address, date_of_birth, gender });
    const [rows] = await pool.query(
      "INSERT INTO student (school_id,first_name,last_name,email,phone,address,document_type,document,date_of_birth,gender,photo_url) VALUES( ?, ?, ?, ?,?, ?,?, ?, ?, ?, ? )",
      [
        school_id,
        first_name,
        last_name,
        email,
        phone,
        address,
        document_type,
        document,
        date_of_birth,
        gender,
        photo_url,
      ]
    );

    res.status(201).send({
      id: rows.insertId,
      school_id,
      first_name,
      last_name,
      email,
      phone,
      address,
      document_type,
      document,
      date_of_birth,
      gender,
      photo_url,
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
