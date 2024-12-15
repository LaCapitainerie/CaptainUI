#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { createHmac } = require('crypto')

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

  const secret = "b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad";

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

  const flags = getArgs();
  // const secretFlag = createHmac('sha256', flags['secret'] || '').digest('hex');
  // console.log({ secretFlag, secret });
  const Exemple = `npx @hugoant/captainui add data-table --secure=${secret}`;
  const isFactice = flags['factice'] || false;
  const installNpm = flags['npm'] || false;
  const installShadcn = flags['shadcn'] || false;
  
  // if (secretFlag !== secret)return '⚔️ Unauthorized access';

  const files = await fetch('https://raw.githubusercontent.com/LaCapitainerie/CaptainUI/refs/heads/main/path.json').then(res => res.json());

  // npx @hugoant/captainui add data-table --secure=...

  const Components = process.argv.slice(3);

  console.log();
  

  console.log(`\r📦 Shipping components ${Components.join(', ')}\n`);
  

  for (const componentName of Components) {

    const GithubUrl = `https://raw.githubusercontent.com/LaCapitainerie/CaptainUI/refs/heads/main/components`;

    if (!files[componentName]) {
      console.error(`Component ${componentName} not found`);
      return;
    }

    // Dependencies installation
    // npm i ...
    if(installNpm){
      for (const dept of files[componentName]["npm"] || []) {
        console.log(`\r📦 Installing ${dept} dependency for ${componentName}`);
        if(isFactice) continue;
      
        const { exec } = require('child_process');

        exec(`npm i ${dept}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`\r❌ Error on installing ${dept} dependency for ${componentName}, reason : ${error.message}\n`);
            return;
          }
          console.log(`\r📦 ${dept} dependency installed for ${componentName}`);
        })
      }
    }
    
    // Shadcn installation
    // npx shadcn@latest add ...
    if(installShadcn){
      for (const shadcn of files[componentName]["shadcn"] || []) {
        console.log(`\r📦 Installing ${shadcn} from shadcn for ${componentName}`);
        if(isFactice) continue;
        
        const { exec } = require('child_process');

        exec(`npx shadcn add ${shadcn}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`\r❌ Error on installing ${shadcn} shadcn for ${componentName}, reason : ${error.message}\n`);
            return;
          }
          console.log(`\r📦 ${shadcn} shadcn installed for ${componentName}`);
        })
      }
    }

    // Files installation
    // fetch ...
    for (const [ClientFolderInstallation, listFiles] of Object.entries(files[componentName]["files"])) {
      if (typeof ClientFolderInstallation[1] === 'string') {
        if(isFactice) continue;
        const PwdClientFolderInstallation = path.resolve(process.cwd(), ClientFolderInstallation);

        if (!fs.existsSync(PwdClientFolderInstallation)) {
          fs.mkdirSync(PwdClientFolderInstallation, { recursive: true });
        }

        for (const RepoFileURL of listFiles) {

          const fetchUrl = `${GithubUrl}/${RepoFileURL}`;
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
