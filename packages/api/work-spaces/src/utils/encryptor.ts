import jwt from 'jsonwebtoken';

const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

export const encrypt = (userId: number, email: string) => {
  return jwt.sign({ id: userId, email }, secretKey, {
    expiresIn: '90d',
  });
};

export const dencrypt = token => {
  const decodedToken = jwt.verify(token, secretKey);
  return decodedToken;
};
