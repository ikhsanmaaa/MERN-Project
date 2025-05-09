import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v0.0.1",
    title: "dokumentasi API MERN-Stack",
    description: "dokumentasi API MERN-Stack",
  },
  servers: [
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
      activation: {
        code: "abcde",
      },
      CreateCategoryRequest: {
        name: "",
        description: "",
        icon: "",
      },
      CreateEventRequest: {
        name: "",
        banner: "fileUrl",
        category: "category ObjectID",
        description: "",
        startDate: "yyyy-mm-dd hh:mm:ss",
        endDate: "yyyy-mm-dd hh:mm:ss",
        location: {
          region: "region id",
          coordinates: [0, 0],
        },
        isOnline: false,
        isFeatured: false,
      },
      RemoveMediaRequest: {
        fileUrl: "",
      },
    },
  },
};
const OutputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(OutputFile, endpointsFiles, doc);
