// Load the .env file if it exists
require("dotenv").config();
const { BlobServiceClient } = require("@azure/storage-blob");

const { createWriteStream } = require("fs");
const { SitemapStream } = require("sitemap");

function excluder(filename) {
  if (filename.includes("reference-materials/6-4")) {
    return false;
  } else if (filename.includes("reference-materials/6-5")) {
    return false;
  } else if (filename.includes("reference-materials/cloud-service")) {
    return false;
  } else if (filename.includes("reference-materials/spec")) {
    return false;
  } else if (filename.includes("404")) {
    return false;
  } else {
    return true;
  }
}

async function main() {
  const connectionString = process.env.CONNECTION_STRING || "";
  const containerName = "$web";

  console.log("Running");

  const blobServiceClient = await BlobServiceClient.fromConnectionString(
    connectionString
  );
  const containerService = blobServiceClient.getContainerClient(containerName);

  let links = [];
  for await (const blob of containerService.listBlobsFlat()) {
    // exclude aem reference materials and 404 pages
    if (excluder(blob.name)) {
      if (blob.name.endsWith(".html") || blob.name.endsWith(".htm")) {
        // console.log(blob.name);
        links.push(
          blob.name.replace("index.html", "").replace("index.htm", "")
        );
      }
    }
  }
  // Create a stream to write to
  const sitemap = new SitemapStream({
    hostname: "https://developer.adobe.com/",
  });
  const writeStream = createWriteStream("./sitemap.xml");
  sitemap.pipe(writeStream);

  links.forEach((link) => {
    const linkObj = { url: link, changefreq: "monthly", priority: 0.7 };
    console.log(linkObj);
    sitemap.write(linkObj);
  });
  sitemap.end();
}

main();
