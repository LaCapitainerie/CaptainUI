export function updatePrismaSchema(prismaSchemaPath, jsonSchema) {
    // Check if the Prisma schema file exists
    if (!existsSync(prismaSchemaPath)) {
        // If it doesn't exist, create a new schema file
        const initialSchema = `datasource db {
            provider = "postgresql"
            url      = env("DATABASE_URL")
        }

        generator client {
            provider = "prisma-client-js"
        }`;

        writeFileSync(prismaSchemaPath, initialSchema);
        console.log("Prisma schema file created.");
    }

    // Read the Prisma schema file
    const prismaSchema = readFileSync(prismaSchemaPath, "utf-8");

    // Parse the Prisma schema
    const ast = parsePrismaSchema(prismaSchema);

    // Iterate over the models in the JSON schema
    jsonSchema.model.forEach((model) => {
        const { name, fields } = model;

        // Check if the model exists in the Prisma schema
        const modelExists = ast.models.some((m) => m.name === name);

        // If the model doesn't exist, add it to the schema
        if (!modelExists) {
            ast.models.push({
                name,
                fields: fields.map((field) => ({
                    name: field.name,
                    type: field.type,
                })),
            });
            console.log(`Model '${name}' added to the Prisma schema.`);
        }
    });

    // Format the updated schema
    const updatedSchema = formatAst(ast);

    // Write the updated schema to the file
    writeFileSync(prismaSchemaPath, updatedSchema);
    console.log("Prisma schema updated.");

    // Run the Prisma CLI command to generate the client
    console.log("Running Prisma generate...");
    // Add your code to run the Prisma generate command here
}
