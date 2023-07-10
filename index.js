const { ContainerClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

// Load the .env file if it exists
require("dotenv").config();
const fs = require('fs').promises;
const { BlobServiceClient } = require("@azure/storage-blob");


async function main() {
    // Enter your storage account name and shared key
    // const account = process.env.ACCOUNT_NAME || "";
    // const accountKey = process.env.ACCOUNT_KEY || "";

    // const connectionString = getInput('connection-string');
    // const containerName = (enableStaticWebSite) ? "$web" : getInput('blob-container-name') ;

    const connectionString = process.env.CONNECTION_STRING || "";
    const containerName =  '$web' ;
    // if dev site home - set to $web

    console.log('running')
    
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

// for await (const blob of containerService.listBlobsFlat({prefix: targetUID})){
//     // get the split after targetUID
//     let blobNameTargetUIDSplit =  blob.name.split(targetUID)[1];
//     let copyBackToOriginalPath = path.join(target, blobNameTargetUIDSplit);
//     if(!target) {
//         if (blobNameTargetUIDSplit.startsWith('/')) blobNameTargetUIDSplit = blobNameTargetUIDSplit.slice(1);
//         copyBackToOriginalPath = blobNameTargetUIDSplit;
//     }
//     await copyBlob(blobServiceClient, containerName, blob.name, containerName, copyBackToOriginalPath);
// }

main();