import crypto from 'crypto';

const ALGORITHM = 'aes-256-ctr';
const SECRETKEY = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

export type EncryptedText = {
  iv: string;
  content: string;
};

export const encryptText = (text: string): EncryptedText => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(ALGORITHM, SECRETKEY, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

export const parseEncryptedText = (encryptedString: string) => {
  const [iv, content] = encryptedString.split('-');
  return { iv, content };
};

export const stringifyEncryptedText = (encryptedText: EncryptedText) => {
  return `${encryptedText.iv}-${encryptedText.content}`;
};

export const decryptText = (hasedText: EncryptedText): string => {
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRETKEY, Buffer.from(hasedText.iv, 'hex'));

  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hasedText.content, 'hex')), decipher.final()]);

  return decrpyted.toString();
};
