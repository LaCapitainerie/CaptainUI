const fs = require("fs");

// Fonction pour générer les datasources
const generateDatasource = (datasources) => {
  return datasources
    .map(
      (ds) =>
        `datasource ${ds.name} {
  provider = "${ds.provider}"
  url      = ${ds.url}
}`
    )
    .join("\n\n");
};

// Fonction pour générer les générateurs
const generateGenerators = (generators) => {
  return generators
    .map(
      (gen) =>
        `generator ${gen.name} {
  provider = "${gen.provider}"
}`
    )
    .join("\n\n");
};

// Fonction pour générer les modèles
const generateModels = (models) => {
  return models
    .map(
      (model) =>
        `model ${model.name} {
  ${model.fields
    .map((field) => `${field.name} ${field.type} ${field.attributes.join(" ")}`)
    .join("\n  ")}
}`
    )
    .join("\n\n");
};

// Fonction pour générer les enums
const generateEnums = (enums) => {
  return enums
    .map(
      (enm) =>
        `enum ${enm.name} {
  ${enm.values.join("\n  ")}
}`
    )
    .join("\n\n");
};

// Fonction principale
const generatePrismaSchema = (json) => {
  const { datasources, generators, models, enums } = json;

  const datasourceSection = generateDatasource(datasources);
  const generatorSection = generateGenerators(generators);
  const modelsSection = generateModels(models);
  const enumsSection = generateEnums(enums);

  return [datasourceSection, generatorSection, modelsSection, enumsSection]
    .filter((section) => section)
    .join("\n\n");
};

// Exemple d'entrée JSON
const jsonInput = {
  datasources: [
    {
      name: "db",
      provider: "postgresql",
      url: "env('DATABASE_URL')"
    }
  ],
  generators: [
    {
      name: "client",
      provider: "prisma-client-js"
    }
  ],
  models: [
    {
      name: "User",
      fields: [
        { name: "id", type: "Int", attributes: ["@id", "@default(autoincrement())"] },
        { name: "email", type: "String", attributes: ["@unique"] },
        { name: "name", type: "String?", attributes: [] },
        { name: "createdAt", type: "DateTime", attributes: ["@default(now())"] }
      ]
    }
  ],
  enums: [
    {
      name: "Role",
      values: ["USER", "ADMIN"]
    }
  ]
};