import {
  BlobSASPermissions,
  BlobServiceClient,
  SASProtocol,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

export async function generateSASUrl(
  storageName: string,
  accessKey: string,
  containerName: string,
  fileName: string,
  durationInMinutes = 1
): Promise<string> {
  if (!storageName || !accessKey || !fileName || !containerName) {
    return "Generate SAS function missing parameters";
  }
  const sharedKeyCredential = new StorageSharedKeyCredential(
    storageName,
    accessKey
  );

  const blobServiceClient = new BlobServiceClient(
    `https://${storageName}.blob.core.windows.net`,
    sharedKeyCredential
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  const duration = durationInMinutes * 60 * 1000;
  const startsOn = new Date();
  const expiresOn = new Date(startsOn.valueOf() + duration);
  const permissions = BlobSASPermissions.parse("w");

  return blockBlobClient.generateSasUrl({
    startsOn,
    expiresOn,
    permissions,
    protocol: SASProtocol.Https,
  });
}
