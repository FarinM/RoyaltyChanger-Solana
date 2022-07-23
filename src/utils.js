export async function doUpload(arweave, data, fileType, jwk) {
    let isUploadByChunk = false
    const tx = await arweave.createTransaction({ data: data }, jwk);
    tx.addTag('Content-Type', fileType);
    await arweave.transactions.sign(tx, jwk);
    if (isUploadByChunk) {
        const uploader = await arweave.transactions.getUploader(tx);
        while (!uploader.isComplete) {
            await uploader.uploadChunk();
            console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
        }
    }
    await arweave.transactions.post(tx);
    return tx;
};