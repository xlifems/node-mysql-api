import { pool } from "../db.js";

export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM employee");
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const getEmployee = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM employee WHERE id = ? ", [
      req.params.id,
    ]);
    if (rows.length <= 0) {
      res.status(400).json({ message: "Employee not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, salary } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO employee (name, salary ) VALUES( ?, ? )",
      [name, salary]
    );
    res.status(201).send({
      id: rows.insertId,
      name,
      salary,
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, salary } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE employee SET name = IFNULL( ? , name), salary = IFNULL( ? , salary) WHERE id = ? ",
      [name, salary, id]
    );

    if (result.affectedRows <= 0)
      return res.status(400).json({ message: "Employee not found" });

    const [rows] = await pool.query("SELECT * FROM employee WHERE id = ? ", [
      id,
    ]);
    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
export const deleteEmployee = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM employee WHERE id = ? ", [
      req.params.id,
    ]);

    if (result.affectedRows <= 0)
      return res.status(400).json({ message: "Employee not found" });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
