// Load the .env file if it exists
require("dotenv").config();
const fs = require('fs').promises;
const { BlobServiceClient } = require("@azure/storage-blob");


async function main() {
    const connectionString = process.env.CONNECTION_STRING || "";
    const containerName =  '$web' ;

    console.log('Running')
    
    const blobServiceClient = await BlobServiceClient.fromConnectionString(connectionString);
    const containerService = blobServiceClient.getContainerClient(containerName);

    let data ='';
    for await (const blob of containerService.listBlobsFlat()){

        if(blob.name.endsWith('.html') || blob.name.endsWith('.htm')) {
            console.log(blob.name);
            data += blob.name + '\n';
        }
    }
    await fs.writeFile('site_map.txt', data); // need to be in an async function

}

main();