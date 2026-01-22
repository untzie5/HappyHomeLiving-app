import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
    try {
        const envFile = path.join(__dirname, '.env');
        const data = fs.readFileSync(envFile, 'utf8');
        
        data.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
    } catch (err) {
        console.warn('No .env file found');
    }
}

export default loadEnv;