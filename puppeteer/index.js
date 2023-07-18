const puppeteer = require("puppeteer"),
  fs = require("fs"),
  hbs = require("handlebars"),
  express = require("express"),
  app = express(),
  { PORT, CERTIFICATE_UPLOAD } = require("./config/env");

app.use(express.static("./assets"));

app.listen(PORT, function (err) {
  if (err) console.log("Error in Webserver setup");
  console.log(`Webserver listening at http://localhost:${PORT}`);
});

const getTemplate = async function (templateName, data) {
  return new Promise((resolve, rejects) => {
    fs.readFile(
      process.cwd() + "/templates/" + `${templateName}/index.html`,
      function (err, fileData) {
        if (!err) {
          const template = fileData.toString();
          resolve(hbs.compile(template)(data));
        } else {
          logger.error(err.message);
          rejects(err);
        }
      }
    );
  });
};

(async function () {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-gpu"],
    });
    const page = await browser.newPage();

    const dataForPdf = {
      name: "Harry Styles",
      amount: 20,
      projectName: "Flood in Nambia",
      certificateId: "lhjkijb75ukut4o782b",
      date: "July 18th, 2023",
      host: `http://beta-api.greenuniverse.io`,
    };

    const content = await getTemplate("newCerti", dataForPdf);

    await page.setContent(content, { waitUntil: "load" });
    await page.emulateMediaType("screen");

    await page.pdf({
      path: process.cwd() + `${CERTIFICATE_UPLOAD}` + `${Date.now()}.pdf`,
      format: "A4",
      printBackground: true,
      landscape: true,
    });
    console.log("PDF succesfully generated!");
    await browser.close();
  } catch (error) {
    console.log("Faced an error whilst generating the PDF: ", error);
  }
})();
