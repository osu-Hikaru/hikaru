import { randomBytes } from 'crypto';

export const genSecureHexString = (length: number) => {
    const bytes = Math.ceil(length / 2);
    const buffer = randomBytes(bytes);
    const hexString = buffer.toString('hex').slice(0, length);
    return hexString;
};
