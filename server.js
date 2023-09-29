const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();

app.use(bodyParser.json());

const storagePath = "./storage";

if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath);
}

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

app.post("/buckets/:bucketName/objects", (req, res) => {
  const bucketName = req.params.bucketName;
  const objectKey = generateUniqueId();
  const data = req.body.data;

  const bucketPath = `${storagePath}/${bucketName}`;
  const filePath = `${bucketPath}/${objectKey}.txt`;

  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath);
  }

  if (!fs.existsSync(bucketPath)) {
    fs.mkdirSync(bucketPath);
  }

  fs.writeFileSync(filePath, data);

  res.send("Object stored successfully");
});

app.get("/buckets/:bucketName/objects/:objectKey", (req, res) => {
  const { bucketName, objectKey } = req.params;
  const filePath = `${storagePath}/${bucketName}/${objectKey}.txt`;

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf-8");
    res.send(data);
  } else {
    res.status(404).send("Object not found");
  }
});

app.delete("/buckets/:bucketName/objects/:objectKey", (req, res) => {
  const { bucketName, objectKey } = req.params;
  const filePath = `${storagePath}/${bucketName}/${objectKey}.txt`;

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.send("Object deleted successfully");
  } else {
    res.status(404).send("Object not found");
  }
});

app.get("/buckets/:bucketName/objects", (req, res) => {
  const { bucketName } = req.params;
  const bucketPath = `${storagePath}/${bucketName}`;

  if (fs.existsSync(bucketPath)) {
    const objects = fs.readdirSync(bucketPath);
    res.send(objects);
  } else {
    res.status(404).send("Bucket not found");
  }
});

app.get("/buckets", (req, res) => {
  const buckets = fs.readdirSync(storagePath);
  res.send(buckets);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
