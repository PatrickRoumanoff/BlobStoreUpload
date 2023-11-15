async function getSasUrl(name) {
  const result = await fetch(`/sas?name=${name}`, { method: "POST" });
  const payload = await result.json();
  return payload.sasUrl;
}

async function uploadFiles(files) {
  console.log(files);
  const p = [];
  for (const file of files) {
    p.push(uploadFile(file));
  }
  const result = await Promise.all(p);
  console.log(result);
  alert(result.join("\n"));
}

async function uploadFile(file) {
  console.log(file.name);
  const blobName = file.name;
  const url = await getSasUrl(blobName);
  console.log(url);

  try {
    const result = await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": "application/octet-stream",
      },
    });
    console.log(result);
    return `${result.status < 400 ? "✅" : "⛔️"}${blobName} => ${
      result.status
    }: ${result.statusText}`;
  } catch (e) {
    console.error(e);
    return `⛔️ ${e.getMessage()}`;
  }
}

window.addEventListener("load", (event) => {
  const button = document.getElementById("submit");
  button?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const input = document.getElementById("files");
    if (input?.files?.length > 0) {
      uploadFiles(input?.files);
    }

    return false;
  });
});
