#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { parsePrismaSchema } = require('@loancrate/prisma-schema-parser');

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

function generatePrismaSchema(json) {
  let schema = '';

  // Generate datasource
  const datasource = json.datasource[0];
  schema += `datasource db {\n  provider = "${datasource.provider}"\n  url      = "${datasource.url}"\n}\n\n`;

  // Generate generator
  const generator = json.generator[0];
  schema += `generator client {\n  provider = "${generator.provider}"\n  output   = "${generator.output}"\n}\n\n`;

  // Generate models
  json.model.forEach((model) => {
    schema += `model ${model.name} {\n`;
    model.fields.forEach((field) => {
      schema += `  ${field.name} ${field.type}`;
      if (field.id) schema += ' @id';
      if (field.unique) schema += ' @unique';
      if (field.default) schema += ` @default(${field.default})`;
      if (field.updatedAt) schema += ' @updatedAt';
      if (field.optional) schema += '?';
      if (field.relation) {
        schema += ` @relation(fields: [${field.relation.fields.join(', ')}], references: [${field.relation.references.join(', ')}]`;
        if (field.relation.onDelete) schema += `, onDelete: ${field.relation.onDelete}`;
        schema += ')';
      }
      schema += '\n';
    });
    
    schema +=  model["@@id"] ? `  @@id([${model["@@id"].join(', ')}])\n` : '';

    schema += `}\n\n`;
  });

  return schema;
}

function updatePrismaSchema(prismaSchemaPath, jsonSchema) {

  // Check if the Prisma schema file exists
  if (!fs.existsSync(prismaSchemaPath)) {
    fs.mkdirSync(path.resolve(process.cwd(), "prisma"), { recursive: true });
    fs.writeFileSync(prismaSchemaPath, "");
    console.log("Prisma schema file created.");
  }

  // Read the Prisma schema file
  const prismaSchema = fs.readFileSync(prismaSchemaPath, "utf-8");

  // Parse the Prisma schema
  const CurrentSchema = parsePrismaSchema(prismaSchema);

  // Merge the new schema with the current schema
  const NewSchema = { ...CurrentSchema, ...jsonSchema };

  // Write the new schema to the Prisma schema file
  fs.writeFileSync(prismaSchemaPath, generatePrismaSchema(NewSchema));

  console.log("Prisma schema updated.");
}

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
  const installPrisma = flags['prisma'] || false;

  // if (secretFlag !== secret)return '⚔️ Unauthorized access';

  const files = await fetch('https://raw.githubusercontent.com/LaCapitainerie/CaptainUI/refs/heads/main/path.json').then(res => res.json());

  // npx @hugoant/captainui add data-table --secure=...

  const Components = process.argv.slice(3).filter(arg => !arg.startsWith('-'));

  console.log(`\r📦 Shipping components ${Components.join(', ')}\n`);
  console.log();


  const NpmList = Components.map(componentName => files[componentName]["npm"] || []).flat();
  const ShadcnList = Components.map(componentName => files[componentName]["shadcn"] || []).flat();
  const PrismaList = Components.map(componentName => files[componentName]["prisma"] || []).flat();
  const FilesList = Components.map(componentName => files[componentName]["files"] || []).flat();


  // Dependencies installation
  // npm i ...
  for (const dept of NpmList) {

    const { exec } = require('child_process');

    exec(`npm i ${dept}`, (error, stdout, stderr) => {
      if (error) {
        process.stdout.write(`❌ Error on installing ${dept} dependency`);
        return;
      }
      process.stdout.write(`📦 ${dept} dependency installed`);
    })

  }

  // Shadcn installation
  // npx shadcn@latest add ...
  if (installShadcn) {
    for (const shadcn of ShadcnList) {
      console.log(`\r📦 Installing ${shadcn} from shadcn`);
      if (isFactice) continue;

      const { exec } = require('child_process');

      exec(`npx shadcn add ${shadcn}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`\r❌ Error on installing ${shadcn} shadcn`);
          return;
        }
        console.log(`\r📦 ${shadcn} shadcn installed`);
      })
    }
  } else {
    console.log(`📦 Shadcn installation skipped`)
    console.log(`📦 To install shadcn dependencies, use the --shadcn flag`);
    console.log(`📦 Or install it manually with : npx shadcn add ${ShadcnList.join(' ')}`);
  }

  // Prisma installation
  if (installPrisma) {
    console.log(`📦 Prisma installation`);
    console.log(path.resolve(process.cwd(), 'prisma/schema.prisma'));
    updatePrismaSchema(path.resolve(process.cwd(), 'prisma/schema.prisma'), PrismaList[0]);
  }

  // Files installation
  if (FilesList.length > 0) {
    console.log(`📦 Files installation`);
    if (isFactice) return '📦 Factice mode activated, no files will be downloaded';
    for (const componentName of Components) {

      const GithubUrl = `https://raw.githubusercontent.com/LaCapitainerie/CaptainUI/refs/heads/main/components`;

      if (!files[componentName]) {
        console.error(`Component ${componentName} not found`);
        return;
      }

      // Files installation
      // fetch ...
      for (const [ClientFolderInstallation, listFiles] of Object.entries(files[componentName]["files"])) {
        if (typeof ClientFolderInstallation[1] === 'string') {
          if (isFactice) continue;
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
