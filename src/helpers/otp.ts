export function generateOTP(): string {
  // return Math.floor(100000 + Math.random() * 999999);
  return '613444';
}

export function generateRandomToken(): string {
  return Math.random().toString(36).substring(2, 22);
}
