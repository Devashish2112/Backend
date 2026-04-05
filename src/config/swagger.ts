import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const getServerUrls = () => {
  const servers: Array<{ url: string; description: string }> = [];

  const appUrl = process.env.APP_URL;
  const vercelUrl = process.env.VERCEL_URL;

  if (appUrl) {
    servers.push({
      url: appUrl,
      description: 'Production server',
    });
  } else if (vercelUrl) {
    servers.push({
      url: `https://${vercelUrl}`,
      description: 'Vercel deployment',
    });
  }

  servers.push({
    url: `http://localhost:${config.port}`,
    description: 'Development server',
  });

  return servers;
};

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Backend API',
      version: '1.0.0',
      description: 'A comprehensive backend system for managing financial records with role-based access control',
      contact: {
        name: 'API Support',
        email: 'support@finance-backend.com',
      },
    },
    servers: getServerUrls(),
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'ERROR_CODE',
                },
                message: {
                  type: 'string',
                  example: 'Error message',
                },
                details: {
                  type: 'object',
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            fullName: {
              type: 'string',
            },
            role: {
              type: 'string',
              enum: ['VIEWER', 'ANALYST', 'ADMIN'],
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'INACTIVE'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        FinancialRecord: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            amount: {
              type: 'number',
              format: 'decimal',
            },
            type: {
              type: 'string',
              enum: ['INCOME', 'EXPENSE'],
            },
            category: {
              type: 'string',
            },
            date: {
              type: 'string',
              format: 'date-time',
            },
            description: {
              type: 'string',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to API routes
};

export const swaggerSpec = swaggerJsdoc(options);
