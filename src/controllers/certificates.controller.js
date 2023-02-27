import { pool } from "../db.js";
import PDFDocument from "pdfkit";
import fs from "fs";

export const getCertificate = async (req, res) => {
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

      const {
        school_id,
        first_name,
        last_name,
        email,
        phone,
        address,
        date_of_birth,
        gender,
      } = rows[0];

      // Embed a font, set the font size, and render some text
      doc
        //.font("fonts/PalatinoBold.ttf")
        .fontSize(25)
        .text(`${first_name} ${last_name}`, 100, 100);

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
      doc.pipe(fs.createWriteStream('/path/to/file.pdf')); // write to PDF
      doc.pipe(res); 

      // Finalize PDF file
      doc.end();
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
