import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v0.0.1",
    title: "dokumentasi API MERN-Stack",
    description: "dokumentasi API MERN-Stack",
  },
  server: [
    {
      url: "http://localhost:3000/api",
      description: "Local Server",
    },
    {
      url: "https://mern-project-gamma-jet.vercel.app/api",
      description: "Deploy Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      LoginRequest: {
        identifier: "kucung",
        password: "kucung123",
      },
    },
  },
};
const OutputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(OutputFile, endpointsFiles, doc);
