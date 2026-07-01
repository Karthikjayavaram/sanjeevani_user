import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.join(__dirname, '..', 'public', 'models');

if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Using Khronos Group sample models as placeholders for the cinematic warehouse
const files = [
  {
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxTextured/glTF-Binary/BoxTextured.glb',
    filename: 'crate.glb'
  },
  {
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb',
    filename: 'camera.glb'
  }
];

async function downloadModels() {
  for (const file of files) {
    const filePath = path.join(modelsDir, file.filename);
    console.log(`Downloading ${file.filename}...`);
    try {
      const response = await fetch(file.url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(filePath, buffer);
      console.log(`Successfully downloaded ${file.filename}`);
    } catch (error) {
      console.error(`Failed to download ${file.filename}:`, error);
    }
  }
}

downloadModels();
