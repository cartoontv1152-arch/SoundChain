import axios from 'axios';
import FormData from 'form-data';

const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY!;

const pinataClient = axios.create({
  baseURL: 'https://api.pinata.cloud',
  headers: {
    pinata_api_key: PINATA_API_KEY,
    pinata_secret_api_key: PINATA_SECRET_KEY,
  },
});

export async function uploadToPinata(
  fileBuffer: Buffer, 
  fileName: string, 
  metadata?: any
): Promise<{  IpfsHash: string; PinSize: number; Timestamp: string }> {
  try {
    const formData = new FormData();
    formData.append('file', fileBuffer, fileName);

    const pinataMetadata = JSON.stringify({
      name: fileName,
      keyvalues: metadata || {},
    });
    formData.append('pinataMetadata', pinataMetadata);

    const response = await pinataClient.post('/pinning/pinFileToIPFS', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return response.data;
  } catch (error: any) {
    console.error('Error uploading to Pinata:', error.response?.data || error.message);
    throw new Error(`Pinata upload failed: ${error.message}`);
  }
}

export async function uploadJSONToPinata(
  json: object, 
  name: string
): Promise<{ IpfsHash: string; PinSize: number; Timestamp: string }> {
  try {
    const response = await pinataClient.post('/pinning/pinJSONToIPFS', {
      pinataContent: json,
      pinataMetadata: {
        name,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error uploading JSON to Pinata:', error.response?.data || error.message);
    throw new Error(`Pinata JSON upload failed: ${error.message}`);
  }
}

export function getIPFSUrl(hash: string): string {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
}

export async function unpinFromPinata(hash: string): Promise<void> {
  try {
    await pinataClient.delete(`/pinning/unpin/${hash}`);
  } catch (error: any) {
    console.error('Error unpinning from Pinata:', error.response?.data || error.message);
    throw new Error(`Pinata unpin failed: ${error.message}`);
  }
}

export default {
  uploadFile: uploadToPinata,
  uploadJSON: uploadJSONToPinata,
  getUrl: getIPFSUrl,
  unpin: unpinFromPinata,
};
