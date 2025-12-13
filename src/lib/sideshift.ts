import axios from 'axios';

const SIDESHIFT_API = 'https://sideshift.ai/api/v2';
const SIDESHIFT_SECRET = process.env.SIDESHIFT_SECRET;
const SIDESHIFT_AFFILIATE_ID = process.env.SIDESHIFT_AFFILIATE_ID;

const sideshiftClient = axios.create({
  baseURL: SIDESHIFT_API,
  headers: {
    'x-sideshift-secret': SIDESHIFT_SECRET,
  },
});

export interface ShiftQuote {
  id: string;
  depositCoin: string;
  settleCoin: string;
  depositAmount: string;
  settleAmount: string;
  rate: string;
  expiresAt: string;
}

export interface ShiftOrder {
  id: string;
  depositAddress: string;
  depositCoin: string;
  settleCoin: string;
  settleAddress: string;
  depositAmount: string;
  settleAmount: string;
  status: string;
  createdAt: string;
}

export async function getQuote(
  depositCoin: string,
  settleCoin: string,
  settleAmount: string
): Promise<ShiftQuote> {
  const response = await sideshiftClient.post('/quotes', {
    depositCoin,
    settleCoin,
    settleAmount,
    affiliateId: SIDESHIFT_AFFILIATE_ID,
  });
  
  return response.data;
}

export async function createShift(
  quoteId: string,
  settleAddress: string,
  refundAddress: string
): Promise<ShiftOrder> {
  const response = await sideshiftClient.post('/shifts/fixed', {
    quoteId,
    settleAddress,
    refundAddress,
    affiliateId: SIDESHIFT_AFFILIATE_ID,
  });
  
  return response.data;
}

export async function getShiftStatus(shiftId: string): Promise<ShiftOrder> {
  const response = await sideshiftClient.get(`/shifts/${shiftId}`);
  return response.data;
}

export async function getSupportedCoins(): Promise<string[]> {
  const response = await sideshiftClient.get('/coins');
  return Object.keys(response.data);
}

export async function getPair(depositCoin: string, settleCoin: string) {
  const response = await sideshiftClient.get(`/pair/${depositCoin}/${settleCoin}`);
  return response.data;
}

export default {
  getQuote,
  createShift,
  getShiftStatus,
  getSupportedCoins,
  getPair,
};
