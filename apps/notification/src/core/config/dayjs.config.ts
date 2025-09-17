// src/common/config/dayjs.config.ts
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// extend utc plugin globally
dayjs.extend(utc);

export default dayjs;
