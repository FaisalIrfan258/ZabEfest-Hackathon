const fs = require('fs');
const path = require('path');
const YAML = require('yamljs');

// Base OpenAPI document
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'EcoTracker API',
    description: 'API for EcoTracker - Community Environmental Reporting Platform',
    version: '1.0.0',
    contact: {
      email: 'info@ecotracker.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Development server',
    },
    {
      url: 'https://api.ecotracker.com',
      description: 'Production server',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Incidents', description: 'Environmental incident management' },
    { name: 'Comments', description: 'Comments on incidents' },
    { name: 'Dashboard', description: 'Dashboard data and statistics' },
    { name: 'Events', description: 'Community events management' },
    { name: 'Users', description: 'User management (admin only)' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      // Schema definitions would go here
    },
  },
  paths: {
    // Path definitions would go here
  },
};

// Helper to add paths from individual files
const addPathsFromFile = (docFile) => {
  try {
    const filePath = path.join(__dirname, 'swagger-docs', docFile);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Merge paths
    if (content.paths) {
      swaggerDocument.paths = { ...swaggerDocument.paths, ...content.paths };
    }
    
    // Merge schemas
    if (content.components && content.components.schemas) {
      swaggerDocument.components.schemas = { 
        ...swaggerDocument.components.schemas, 
        ...content.components.schemas 
      };
    }
    
    console.log(`Added paths from ${docFile}`);
  } catch (err) {
    console.error(`Error processing ${docFile}: ${err.message}`);
  }
};

// Ensure directory exists
const docsDir = path.join(__dirname, 'swagger-docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
  console.log('Created swagger-docs directory');
}

// Create placeholder files if they don't exist
const docFiles = [
  'auth.json',
  'incidents.json',
  'comments.json',
  'dashboard.json',
  'events.json',
  'users.json',
];

docFiles.forEach(file => {
  const filePath = path.join(docsDir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({
      paths: {},
      components: { schemas: {} }
    }, null, 2));
    console.log(`Created placeholder ${file}`);
  }
});

// Add paths from individual files
docFiles.forEach(addPathsFromFile);

// Write the generated YAML file
const outputPath = path.join(__dirname, '..', 'swagger.yaml');
const yamlString = YAML.stringify(swaggerDocument, 10, 2);
fs.writeFileSync(outputPath, yamlString);

console.log(`Generated Swagger documentation at ${outputPath}`);
console.log('You can now add more detailed documentation in the individual files in the swagger-docs directory'); 