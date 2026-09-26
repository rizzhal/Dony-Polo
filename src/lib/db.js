import { promises as fs } from 'fs';
import path from 'path';

// Content lives in data/site.json. Swap these two functions for a database later.
const file = path.join(process.cwd(), 'data', 'site.json');
export const readSite = async () => JSON.parse(await fs.readFile(file, 'utf8'));
export const writeSite = async (d) => fs.writeFile(file, JSON.stringify(d, null, 2));
