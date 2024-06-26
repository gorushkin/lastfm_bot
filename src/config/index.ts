import * as dotenv from 'dotenv';

dotenv.config();

const TELEGRAM_API = process.env.TELEGRAM_API ?? '';
const LAST_FM_API = process.env.LAST_FM_API ?? '';
const DATABASE = process.env.DATABASE ?? '';

export const config = { TELEGRAM_API, LAST_FM_API, DATABASE };
