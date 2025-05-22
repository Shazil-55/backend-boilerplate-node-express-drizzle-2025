export function generateRandomOTP(length = 6) {
  // return "613444"
  const chars = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    otp += chars[randomIndex];
  }
  return otp;
}
