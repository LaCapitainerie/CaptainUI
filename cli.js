#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { createHmac } = require('crypto')

const secret = "49B191CF813FA62A2A280CA07B6812DF23BE3F3C2437604E7FCD2DEE72F1F527";

const getArgs = () =>
  process.argv.reduce((args, arg) => {
    // long arg
    if (arg.slice(0, 2) === "--") {
      const longArg = arg.split("=");
      const longArgFlag = longArg[0].slice(2);
      const longArgValue = longArg.length > 1 ? longArg[1] : true;
      args[longArgFlag] = longArgValue;
    }
    // flags
    else if (arg[0] === "-") {
      const flags = arg.slice(1).split("");
      flags.forEach((flag) => {
        args[flag] = true;
      });
    }
    return args;
  }, {});

const args = getArgs();

if (args['secret'] && createHmac('sha256', args['secret'] || '').digest('hex') !== secret) {
  console.error('❌ Unauthorized access');
  return;
}

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
      fs.unlink(dest, () => {
        reject(`${err.message}`);
        return;
      });
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
        "stripe/checkout-session.tsx",
        "stripe/pay-button.tsx",
      ],

      'src/app/': [
        'payment/page.tsx',
        'payment/_components/failed.tsx',
        'payment/_components/success.tsx',
        'payment/process/page.tsx'
      ],
    }
  }

  const args = process.argv.slice(2);
  const Components = args.slice(1);

  for (const componentName of Components) {

    const GithubUrl = `https://raw.githubusercontent.com/LaCapitainerie/CaptainUI/refs/heads/main/components`;

    if (!files[componentName]) {
      console.error(`Component ${componentName} not found`);
      return;
    }

    for (const [ClientFolderInstallation, listFiles] of Object.entries(files[componentName])) {
      if (typeof ClientFolderInstallation[1] === 'string') {
        const PwdClientFolderInstallation = path.resolve(process.cwd(), ClientFolderInstallation);

        if (!fs.existsSync(PwdClientFolderInstallation)) {
          fs.mkdirSync(PwdClientFolderInstallation, { recursive: true });
        }

        for (const RepoFileURL of listFiles) {
          const fetchUrl = `${GithubUrl}/${componentName}/${RepoFileURL}`;
          const ClientFinalDestination = path.join(PwdClientFolderInstallation, RepoFileURL);
          const dir = path.dirname(ClientFinalDestination);

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          // console.log({
          //   "ClientFinalDestination": ClientFinalDestination, 
          //   "Pwd": process.cwd(),
          //   "ClientFolderInstallation": ClientFolderInstallation,
          //   "RepoFileURL": RepoFileURL,

          //   "ComponentName": componentName,
          //   "PwdClientFolderInstallation": PwdClientFolderInstallation,
          // });

          try {
            await downloadFile(fetchUrl, ClientFinalDestination);
          } catch (error) {
            console.error(`\r❌ Error on shipping component at ${fetchUrl}, reason : ${error}\n`);
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
    `\r\x1b[K⚓ Shipping components 📦    `,
    `\r\x1b[K⚓ Shipping components 📦📦  `,
    `\r\x1b[K⚓ Shipping components 📦📦📦`,
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

  return;
})();
