#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(`Failed to fetch ${url}`);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err.message));
    });
  });
};

const downloadComponent = async () => {
  const files = [
    'row-type/data-table-row-badge.tsx',
    'row-type/data-table-row-boolean.tsx',
    'index.ts'
  ];

  const baseUrl = 'https://github.com/LaCapitainerie/CaptainUI/blob/main/data-table/';
  const destDir = path.resolve(process.cwd(), 'data-table');

  fs.mkdirSync(destDir, { recursive: true });

  for (const file of files) {
    const url = `${baseUrl}${file}`;
    const dest = path.join(destDir, file);
    const dir = path.dirname(dest);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    try {
      console.log(`Downloading ${file}...`);
      await downloadFile(url, dest);
    } catch (err) {
      console.error(`Failed to download ${file}:`, err);
    }
  }
};

downloadComponent();
