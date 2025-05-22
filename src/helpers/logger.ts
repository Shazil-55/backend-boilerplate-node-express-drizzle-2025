import { Env } from '.';

export const Logger = {
  debug: (...args: any) => {
    if (Env.Server.IS_LOCAL_ENV) {
      console.log(`\x1b[36m`, [`[${new Date().toLocaleString()}] DEBUG:`], args);
    } else {
      console.log([`[${new Date().toLocaleString()}] DEBUG:`], args);
    }
  },
  info: (...args: any) => {
    if (Env.Server.IS_LOCAL_ENV) {
      console.log(`\x1b[32m`, [`[${new Date().toLocaleString()}] INFO:`], args);
    } else {
      console.log([`[${new Date().toLocaleString()}] INFO:`], args);
    }
  },
  error: (...args: any) => {
    if (Env.Server.IS_LOCAL_ENV) {
      console.log(`\x1b[31m`, [`[${new Date().toLocaleString()}] ERROR:`], args);
    } else {
      console.log([`[${new Date().toLocaleString()}] ERROR:`], args);
    }
  },
};
