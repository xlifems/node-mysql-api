import { pool } from "../db.js";
import PDFDocument from "pdfkit-table";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Certificate crud operations is related to the page table in the database and the page table has a relationship with the student table and the book table.

export const getCertificate = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT pgm.id, s.id, s.first_name, s.last_name, pg.status, pgm.quantitative_note as note , mt.name as matter_name, mt.hours, bk.year, bk.name as book_name 
      FROM student s 
      INNER JOIN school sc ON s.school_id = sc.id 
      INNER JOIN book bk ON sc.id = bk.school_id 
      INNER JOIN page pg ON s.id = pg.student_id 
      INNER JOIN matter mt ON mt.book_id = bk.id 
      INNER JOIN page_matter pgm ON pgm.matter_id = mt.id 
      WHERE s.id = ?;`,
      [req.params.id]
    );

    if (rows.length <= 0) {
      res.status(400).json({ message: "student not found" });
    } else {
      // Create a document
      const doc = new PDFDocument({ margin: 10, size: "A4" });
      let filename = req.params.id;
      // Stripping special characters
      filename = encodeURIComponent(filename) + ".pdf";

      res.setHeader(
        "Content-disposition",
        'attachment; filename="' + filename + '"'
      );
      res.setHeader("Content-type", "application/pdf");

      const { school_id, first_name, last_name, email, phone, address } =
        rows[0];

      res.status(200).json(rows);
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const getCertificatePdfOLD = async (req, res) => {
  const { student_id, book_id } = req.body;
  try {
    const [rows] = await pool.query(
      `SELECT pgm.id, s.id, s.first_name, s.last_name, pg.status, pgm.quantitative_note as note , mt.name as matter_name, mt.hours, bk.year, bk.name as book_name 
      FROM student s 
      INNER JOIN school sc ON s.school_id = sc.id 
      INNER JOIN book bk ON sc.id = bk.school_id 
      INNER JOIN page pg ON s.id = pg.student_id 
      INNER JOIN matter mt ON mt.book_id = bk.id 
      INNER JOIN page_matter pgm ON pgm.matter_id = mt.id 
      WHERE s.id = ?;`,
      [student_id]
    );

    if (rows.length <= 0) {
      res.status(400).json({ message: "student not found" });
    } else {
      // Create a document
      const doc = new PDFDocument({ margin: 10, size: "A4" });
      let filename = "file_" + student_id + ".pdf";

      // Ruta donde se guardará el archivo PDF en el servidor
      const filePath = path.join("__dirname", "..", filename);

      // Obtén la ruta del directorio donde se encuentra el script actual
      const fileurl = fileURLToPath(import.meta.url);
      const directorio = path.join(path.dirname(fileurl), filename);

      console.log("filePath", fileurl);
      console.log("filePath", directorio);

      // Stripping special characters

      res.setHeader(
        "Content-disposition",
        'attachment; filename="' + "file_" + student_id + '"'
      );
      res.setHeader("Content-type", "application/pdf");

      const { first_name, last_name, note } = rows[0];

      // Embed a font, set the font size, and render some text
      doc
        //.font("fonts/PalatinoBold.ttf")
        .fontSize(25)
        .text(`${first_name} ${last_name} ${note} `, 100, 100);

      // -----------------------------------------------------------------------------------------------------
      // Simple Table with Array
      // -----------------------------------------------------------------------------------------------------
      const table = {
        // complex headers work with ROWS and DATAS
        headers: [
          { label: "Name", property: "name", width: 100, renderer: null },
          {
            label: "Age",
            property: "age",
            width: 100,
            renderer: (value) => `U$ ${Number(value).toFixed(1)}`,
          },
        ],
        // complex content
        datas: [
          { name: "bold:Jack", age: 32 },
          // age is object value with style options
          { name: "Maria", age: { label: 30, options: { fontSize: 12 } } },
        ],
        // simple content (works fine!)
        rows: [
          ["Jack", "32"], // row 1
          ["Maria", "30"], // row 2
        ],
      };
      doc.table(table); // A4 595.28 x 841.89 (portrait) (about width sizes)

      // Pipe its output somewhere, like to a file or HTTP response
      // See below for browser usage
      const writeStream = fs.createWriteStream(directorio); // write to PDF
      doc.pipe(writeStream); // write to PDF
      doc.pipe(res);

      // Finalize PDF file

      // Una vez que el PDF se ha escrito correctamente, configura la respuesta para descargar el archivo
      writeStream.on("finish", () => {
        res.download(directorio, (err) => {
          // Eliminar el archivo PDF después de que se complete la descarga

          fs.unlink(directorio, (err) => {
            if (err) {
              console.error("Error deleting PDF file:", err);
            }
          });
        });
      });

      // Manejar errores en el stream de escritura
      writeStream.on("error", (err) => {
        console.error("Error writing PDF file:", err);
        //res.status(500).send("Error generating PDF");
      });

      doc.end();
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const getCertificatePdf = async (req, res) => {
  const { student_id, book_id } = req.body;
  try {
    const [rows] = await pool.query(
      `SELECT pgm.id, s.id, s.first_name, s.last_name, pg.status, pgm.quantitative_note as note , mt.name as matter_name, mt.hours, bk.year, bk.name as book_name
      FROM student s
      INNER JOIN school sc ON s.school_id = sc.id
      INNER JOIN book bk ON sc.id = bk.school_id
      INNER JOIN page pg ON s.id = pg.student_id
      INNER JOIN matter mt ON mt.book_id = bk.id
      INNER JOIN page_matter pgm ON pgm.matter_id = mt.id
      WHERE s.id = ?;`,
      [student_id]
    );

    if (rows.length <= 0) {
      res.status(400).json({ message: "student not found" });
    } else {
      // Ruta del archivo
      const filePath = "./archivo.pdf";

      // Create a document
      const doc = new PDFDocument({ margin: 10, size: "A4" });

      // Pipe its output somewhere, like to a file or HTTP response
      // See below for browser usage
      const writeStream = fs.createWriteStream(filePath); // write to PDF
      doc.pipe(writeStream);

      const { first_name, last_name } = rows[0];

      // Embed a font, set the font size, and render some text
      doc
        //.font("fonts/PalatinoBold.ttf")
        .fontSize(25)
        .text(`${first_name} ${last_name} `, 100, 100);

      // -----------------------------------------------------------------------------------------------------
      // Simple Table with Array
      // -----------------------------------------------------------------------------------------------------
      const table = {
        // complex headers work with ROWS and DATAS
        headers: [
          {
            label: "Asignatura",
            property: "matter_name",
            width: 100,
            renderer: null,
          },
          {
            label: "IH",
            property: "hours",
            width: 100,
            renderer: (value) => `${Number(value)}`,
          },
          { label: "Nota", property: "nota", width: 100, renderer: null },
        ],
        // complex content
        datas: rows.map((row) => {
          return {
            matter_name: row.matter_name,
            hours: row.hours,
            nota: { label: row.note, options: { fontSize: 12 } },
          };
        }),

        // simple content (works fine!)
        // rows: [
        // ["Jack", "32"], // row 1
        // ["Maria", "30"], // row 2
        //],
      };

      doc.table(table); // A4 595.28 x 841.89 (portrait) (about width sizes)

      // Finalize PDF file
      doc.end();

      // Obtener el tamaño del archivo
      //const fileSize = fs.statSync(filePath).size;

      writeStream.on("finish", () => {
        // Establecer encabezados de respuesta

        res.download(
          filePath,
          "archivo.pdf", // Remember to include file extension
          (err) => {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Error deleting PDF file:", err);
              }
            });

            if (err) {
              res.send({
                error: err,
                msg: "Problem downloading the file",
              });
            }
          }
        );
      });

      // Manejar errores en el stream de escritura
      writeStream.on("error", (err) => {
        console.error("Error writing PDF file:", err);
        //res.status(500).send("Error generating PDF");
      });
    }
  } catch (error) {
    console.log(error);
    res.send;
  }
};

export const getBook = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM student WHERE id = ? ", [
      req.params.id,
    ]);

    if (rows.length <= 0) {
      res.status(400).json({ message: "student not found" });
    } else {
      // Create a document
      const doc = new PDFDocument();
      let filename = req.params.id;
      // Stripping special characters
      filename = encodeURIComponent(filename) + ".pdf";

      res.setHeader(
        "Content-disposition",
        'attachment; filename="' + filename + '"'
      );
      res.setHeader("Content-type", "application/pdf");

      const { school_id, first_name, last_name, email, phone, address } =
        rows[0];

      // Embed a font, set the font size, and render some text
      doc
        //.font("fonts/PalatinoBold.ttf")
        .fontSize(25)
        .text(`${first_name} ${last_name} ${email} `, 100, 100);

      // Add another page
      doc
        .addPage()
        .fontSize(25)
        .text("Here is some vector graphics...", 100, 100);

      // Draw a triangle
      doc
        .save()
        .moveTo(100, 150)
        .lineTo(100, 250)
        .lineTo(200, 250)
        .fill("#FF3300");

      // Apply some transforms and render an SVG path with the 'even-odd' fill rule
      doc
        .scale(0.6)
        .translate(470, -380)
        .path("M 250,75 L 323,301 131,161 369,161 177,301 z")
        .fill("red", "even-odd")
        .restore();

      // Add some text with annotations
      doc
        .addPage()
        .fillColor("blue")
        .text("Here is a link!", 100, 100)
        .underline(100, 100, 160, 27, { color: "#0000FF" })
        .link(100, 100, 160, 27, "http://google.com/");

      // Pipe its output somewhere, like to a file or HTTP response
      // See below for browser usage
      // doc.pipe(res);
      doc.pipe(fs.createWriteStream("/path/to/file.pdf")); // write to PDF
      doc.pipe(res);

      // Finalize PDF file

      res.json(rows);
      doc.end();
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const addPage = async (req, res) => {
  try {
    const { book_id, student_id, status, observation } = req.body;
    console.log(book_id, student_id, status, observation);
    const [rows] = await pool.query(
      "INSERT INTO page (book_id, student_id, status, observation) VALUES( ?, ?, ?, ? )",
      [book_id, student_id, status, observation]
    );

    res.status(201).send({
      id: rows.insertId,
      book_id,
      student_id,
      status,
      observation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export const updatePage = async (req, res) => {
  const { id } = req.params;
  const { book_id, student_id, status, observation } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE page 
         SET book_id = IFNULL( ? , book_id), student_id = IFNULL( ? , student_id), status = IFNULL( ? , status), 
         observation = IFNULL( ? , observation)
         WHERE id = ?`,
      [book_id, student_id, status, observation, id]
    );

    if (result.affectedRows <= 0)
      return res.status(400).json({ message: "page not found" });

    const [rows] = await pool.query("SELECT * FROM page WHERE id = ? ", [id]);
    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const deletePage = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM page WHERE id = ? ", [
      req.params.id,
    ]);

    if (result.affectedRows <= 0)
      return res.status(400).json({ message: "page not found" });

    res.json({ message: "page deleted" });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const getPages = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM page");

    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
export const getPageById = async (req, res) => {
  try {
    // Generate a pdf file with the student information and the book information and the page information and the matter information related to the page

    if (rows.length <= 0) {
      res.status(400).json({ message: "page not found" });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const getBookPages = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM page WHERE book_id = ? ", [
      req.params.book_id,
    ]);

    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const getStudentPages = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM page WHERE student_id = ? ",
      [req.params.student_id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

// Add matter to book
// page_id INT NOT NULL, matter_id INT NOT NULL, qualitative_note VARCHAR(255), quantitative_note DOUBLE,
export const addMatter = async (req, res) => {
  try {
    const { page_id, matter_id, qualitative_note, quantitative_note } =
      req.body;

    const [rows] = await pool.query(
      "INSERT INTO page_matter (page_id, matter_id, qualitative_note, quantitative_note) VALUES( ?, ?, ?, ? )",
      [page_id, matter_id, qualitative_note, quantitative_note]
    );

    res.status(201).send({
      id: rows.insertId,
      page_id,
      matter_id,
      qualitative_note,
      quantitative_note,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export const updateMatter = async (req, res) => {
  const { id } = req.params;
  const { page_id, matter_id, qualitative_note, quantitative_note } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE page_matter 
         SET page_id = IFNULL( ? , page_id), matter_id = IFNULL( ? , matter_id), qualitative_note = IFNULL( ? , qualitative_note), 
         quantitative_note = IFNULL( ? , quantitative_note)
         WHERE id = ?`,
      [page_id, matter_id, qualitative_note, quantitative_note, id]
    );

    if (result.affectedRows <= 0)
      return res.status(400).json({ message: "matter not found" });

    const [rows] = await pool.query("SELECT * FROM page_matter WHERE id = ? ", [
      id,
    ]);
    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const deleteMatter = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM page_matter WHERE id = ? ", [
      req.params.id,
    ]);

    if (result.affectedRows <= 0)
      return res.status(400).json({ message: "matter not found" });

    res.json({ message: "matter deleted" });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const getMatterForPage = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM page_matter WHERE page_id = ? ",
      [req.params.page_id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
