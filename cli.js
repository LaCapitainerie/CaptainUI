#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(response.statusCode);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(`${err.message}`));
    });
  });
};

const downloadComponent = async () => {

  const files = {
    "file-dialog": {
      'src/components/captainui/': [
        "file-dialog/file-dialog.tsx",
      ],
    },
    "data-table": {
      'src/components/captainui/': [
        "data-table/row-type/data-table-row-badge.tsx",
        "data-table/row-type/data-table-row-boolean.tsx",
        "data-table/row-type/data-table-row-currency.tsx",
        "data-table/row-type/data-table-row-date.tsx",
        "data-table/row-type/data-table-row-enum.tsx",
        "data-table/row-type/data-table-row-image.tsx",

        "data-table/data-table-column-header.tsx",
        "data-table/data-table-faceted-filter.tsx",
        "data-table/data-table-form.tsx",
        "data-table/data-table-pagination.tsx",
        "data-table/data-table-row-actions.tsx",
        "data-table/data-table-skeleton.tsx",
        "data-table/data-table-toolbar.tsx",
        "data-table/data-table-view-options.tsx",
        "data-table/data-table.tsx",
      ],

      "src/components/captainui/": [
        "utils.ts",
      ],
    },

    "stripe": {
      'src/components/captainui/': [
        "stripe/stripe/checkout-session.tsx",
        "stripe/stripe/pay-button.tsx",
      ],

      'src/app/payment': [
        'stripe/page.tsx',
      ],

      'src/app/payment/_components': [
        'stripe/payment/_components/failed.tsx',
        'stripe/payment/_components/success.tsx',
      ],

      'src/app/payment/process': [
        'stripe/payment/process/page.tsx'
      ],
    }

  }

  const args = process.argv.slice(2);
  const componentName = args.slice(1);

  for (const component of componentName) {

    const baseUrl = `https://raw.githubusercontent.com/LaCapitainerie/CaptainUI/refs/heads/main/components/`;

    if (!files[component]) {
      console.error(`Component ${component} not found`);
      return;
    }

    for (const [destDirValue, listFiles] of Object.entries(files[component])) {
      if (typeof destDirValue[1] === 'string') {
        const destDir = path.resolve(process.cwd(), destDirValue);

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
            await downloadFile(url, dest);
          } catch (error) {
            console.error(`\r❌ Error on shipping component at ${url}, reason : ${error}\n`);
          }
        }
      }
    }
  }

  return '⚓ Components downloaded successfully ⚔️';

};

function spinner() {
  let current = 0;

  const loader = [
    `\r⚓ Shipping components 📦    `,
    `\r⚓ Shipping components 📦📦  `,
    `\r⚓ Shipping components 📦📦📦`,
  ]

  const interval = setInterval(() => {
      process.stdout.write(loader[current % loader.length]);
      current++;
  }, 500);

  return interval;
}

(async function run() {
  const spinnerInterval = spinner();

  const result = await downloadComponent();
  clearInterval(spinnerInterval);

  process.stdout.write('\r');
  console.log(result);
})();
