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

  const files = {
    "file-dialog": [
      "file-dialog.tsx",
    ],
    "data-table": {
      'src/components/captainui/': [
        "row-type/data-table-row-badge.tsx",
        "row-type/data-table-row-boolean.tsx",
        "row-type/data-table-row-currency.tsx",
        "row-type/data-table-row-date.tsx",
        "row-type/data-table-row-enum.tsx",

        "data-table-column-header.tsx",
        "data-table-faceted-filter.tsx",
        "data-table-form.tsx",
        "data-table-pagination.tsx",
        "data-table-row-actions.tsx",
        "data-table-skeleton.tsx",
        "data-table-toolbar.tsx",
        "data-table-view-options.tsx",
        "data-table.tsx",

      ],

      'utils/': [
        "utils.ts",
      ],
    }

  }

  const args = process.argv.slice(2);
  const componentName = args.slice(1);

  for (const component of componentName) {

    const baseUrl = `https://raw.githubusercontent.com/LaCapitainerie/CaptainUI/refs/heads/main/${component}/`;

    if (!files[component]) {
      console.error(`Component ${component} not found`);
      return;
    }

    for (const [destDirValue, listFiles] of Object.entries(files[component])) {
      if (typeof destDirValue[1] === 'string') {
        const destDir = path.resolve(process.cwd(), destDirValue + component);

        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        for (const file of listFiles) {
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
      }
    }

  }


};

downloadComponent();
