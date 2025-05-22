import { OAuth2Client } from 'google-auth-library';
import { AppError } from './errors';
import { Logger } from './logger';

// Initialize Google OAuth client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

export interface GoogleUserInfo {
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  googleId: string;
}

export async function handleGoogleCallback(code: string): Promise<any> {
  Logger.info('AuthService.handleGoogleCallback');

  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const userInfoResponse = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
    });

    Logger.info('userInfoResponse', userInfoResponse);

    const googleUser = userInfoResponse.data;
    return googleUser;
  } catch (error) {
    throw new AppError(400, `Failed to verify Google token: ${error}`);
  }
}

export function getGoogleAuthUrl(): string {
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  });
}
