import { pool } from "../db.js";

export const getSchools = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM school");
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const getSchool = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM school WHERE id = ? ", [
      req.params.id,
    ]);
    if (rows.length <= 0) {
      res.status(400).json({ message: "school not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const createSchool = async (req, res) => {
  try {
    const {
      name,
      address,
      department,
      city,
      phone,
      email,
      shield,
      dane_code,
      nit,
      resolution,
    } = req.body;

    // const [rows] = await pool.query('INSERT INTO schools SET ?', { school_id, first_name, last_name, email, phone, address, date_of_birth, gender });
    const [rows] = await pool.query(
      `INSERT INTO school ( name, address,department,city,phone,email,shield,dane_code,nit,resolution
        ) VALUES( ?, ?, ?, ?,?, ?,?, ?, ?, ?)`,
      [
        name,
        address,
        department,
        city,
        phone,
        email,
        shield,
        dane_code,
        nit,
        resolution,
      ]
    );

    res.status(201).send({
      id: rows.insertId,
      name,
      address,
      department,
      city,
      phone,
      email,
      shield,
      dane_code,
      nit,
      resolution,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert school" });
  }
};

export const updateSchool = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    address,
    department,
    city,
    phone,
    email,
    shield,
    dane_code,
    nit,
    resolution,
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE school 
       SET name = IFNULL( ? , name), address = IFNULL( ? , address), department = IFNULL( ? , department), 
       city = IFNULL( ? , city), phone = IFNULL( ? , phone), email = IFNULL( ? , email),  shield = IFNULL( ? , shield), 
       dane_code = IFNULL( ? , dane_code), nit = IFNULL( ? , nit) , resolution = IFNULL( ? , resolution)
       WHERE id = ?`,
      [
        name,
        address,
        department,
        city,
        phone,
        email,
        shield,
        dane_code,
        nit,
        resolution,
        id,
      ]
    );

    if (result.affectedRows <= 0)
      return res.status(400).json({ message: "school not found" });

    const [rows] = await pool.query("SELECT * FROM school WHERE id = ? ", [id]);
    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const deleteSchool = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM school WHERE id = ? ", [
      req.params.id,
    ]);

    if (result.affectedRows <= 0)
      return res.status(400).json({ message: "school not found" });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
