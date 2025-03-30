
/**
 * Utility function to fetch the Edenz Consultants logo from the original source
 * and save it to the public directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../../public');
const LOGO_URL = 'https://www.edenzconsultant.org/static/frontend/img/logo.webp';
const LOGO_PATH = path.join(PUBLIC_DIR, 'edenz-logo.webp');

async function fetchAndSaveLogo() {
  try {
    console.log('Fetching logo from:', LOGO_URL);
    
    const response = await fetch(LOGO_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch logo: ${response.status} ${response.statusText}`);
    }
    
    const buffer = await response.buffer();
    
    fs.writeFileSync(LOGO_PATH, buffer);
    
    console.log('Logo saved successfully to:', LOGO_PATH);
  } catch (error) {
    console.error('Error fetching logo:', error);
  }
}

// Run this script from the command line with: node --experimental-modules src/utils/fetchLogo.mjs
fetchAndSaveLogo();
