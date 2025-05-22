import bcrypt from 'bcryptjs';
import { Hash } from './env';
// Hash a password and return the hashed version
export async function hashPassword(password: string): Promise<string> {
  const saltNumber: number = parseInt(Hash.SALT);
  const hashedPassword = await bcrypt.hash(password, saltNumber); // Use 10 salt rounds for hashing
  return hashedPassword;
}

// Verify a password against its hashed version
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
