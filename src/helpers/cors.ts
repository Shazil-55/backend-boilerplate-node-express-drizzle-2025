import cors from 'cors';

const allowedOrigins = [
  'http://localhost:4000',
  'https://localhost:4000',
];

export const internalOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};
