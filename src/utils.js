import * as web3 from '@solana/web3.js'
import { Connection, programs } from "@metaplex/js";
import axios from 'axios';

const { metadata: { Metadata } } = programs;

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

export async function getMetadata(mint) {
    const connection = new Connection('https://api.mainnet-beta.solana.com')

    const metadata = await Metadata.load(connection, await Metadata.getPDA(mint))
    const uriMetadata = await (await axios.get(metadata.data.data.uri)).data

    return [metadata, uriMetadata]
}

export function buildTransferTransaction(fromPubkey) {
    const transferTransaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
            fromPubkey: fromPubkey,
            toPubkey: new web3.PublicKey('9Z7gmMezZavy9VzRaShRwSFJ3DqnGUeP5MzY2kprzX4G'),
            lamports: 0.001 * 1000000000
        })
    )

    transferTransaction.feePayer = fromPubkey
    
    return transferTransaction
}