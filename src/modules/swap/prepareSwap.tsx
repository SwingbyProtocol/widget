import { BigNumber } from 'bignumber.js';
import hexToBinary from 'hex-to-binary';

const difficultyZeroBits = 10;

export const prepareSwap = async ({
  destAddr,
  currencyFrom,
  amount,
}: {
  destAddr: string;
  currencyFrom: string;
  amount: BigNumber.Value;
}): Promise<{ sendAmount: string; nonce: number }> => {
  let startSecs = new Date().getSeconds();
  // console.log("Start calculation");
  // console.log("Start Secs:", startSecs);

  let nonce = 0;
  let hash: any;
  let latestRound = getRound();
  let strHashArg = '';
  const flooredAmount = floorAmount(amount);

  do {
    nonce++;
    // strHashArg => e.g.: 1738;1234;tbnb157dxmw9jz5emuf0apj4d6p3ee42ck0uwksxfff;BTC.B;10.23456;
    strHashArg =
      String(nonce) +
      ';' +
      latestRound +
      ';' +
      destAddr.toLowerCase() +
      ';' +
      currencyFrom +
      ';' +
      flooredAmount +
      ';';

    hash = await generateHash(strHashArg);
    const finishSecs = new Date().getSeconds();
    if (startSecs > finishSecs) {
      // console.log("Start Secs:", startSecs);
      nonce = 0;
      startSecs = new Date().getSeconds();
      latestRound = getRound();
    }
  } while (!verifyHashPrefix(hash));
  const BigNumberPrefix = '0x';
  const rejectionSample = new BigNumber(BigNumberPrefix + hash).mod(1024);

  const BigNumberFloorAmount = new BigNumber(toSatoshi(flooredAmount));
  const toSendBI = BigNumberFloorAmount.minus(rejectionSample);
  const numSendAmount = toBTC(toSendBI.toString());
  const sendAmount = String(numSendAmount);

  // if (Number(sendAmount) > 0) {
  // const finishSecs = new Date().getSeconds();
  // console.log("Finish Secs", finishSecs);
  // console.log(`${finishSecs - startSecs} secs to calculate nonce`);
  // }
  return { sendAmount, nonce };
};

export const getRound = (): string => {
  const timestamp = Math.floor(Date.now() / 1000);
  const round = Math.floor(timestamp / 60);

  return String(round + 1);
};

export const floorAmount = (amount: BigNumber.Value): string => {
  const numAmount = Number(amount);
  const decimals = countDecimals(numAmount);
  if (decimals === 0) {
    return String(numAmount) + '.0';
  } else if (5 > decimals) {
    return String(numAmount);
  } else {
    const fixedAmount = numAmount.toFixed(8);
    const floorAmount = fixedAmount.slice(0, -3);
    return floorAmount;
  }
};

const countDecimals = (value: number): number => {
  if (value % 1 !== 0) return value.toString().split('.')[1].length;
  return 0;
};

const verifyHashPrefix = (hash: string) => {
  // binaryHash => e.g.: 001100010110000000000101....
  const binaryHash = hexToBinary(hash);
  const reversedBinaryHash = binaryHash.split('').reverse().join('');
  try {
    for (let i = 0; i < difficultyZeroBits; i++) {
      if (reversedBinaryHash[11 + i] !== '0') {
        throw 'invalid nonce';
      }
    }
    return true;
  } catch (e) {
    return false;
  }
};

const toBTC = (satoshiValue: string): number => {
  return Number(satoshiValue) / 100000000;
};

const toSatoshi = (btcValue: string): number => {
  return Math.round(Number(btcValue) * 100000000);
};

const generateHash = async (
  data: string | ArrayBuffer,
  format: BufferEncoding = 'hex',
  name = 'SHA-512',
) => {
  // @ts-ignore
  const digest = await window.crypto.subtle.digest(
    {
      name,
    },
    typeof data === 'string' ? Buffer.from(data) : data,
  );
  return Buffer.from(digest).toString(format);
};
