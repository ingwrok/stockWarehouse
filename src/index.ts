import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import PostgresTypeORMConnection from "./utils/postgresDB/connector/typeorm/index";
import zodValidation from "./utils/fastify/validators/zod";
import autoLoad from "@fastify/autoload";
import path from "node:path";
import fastifyCookie from "@fastify/cookie";

(async () => {
  await PostgresTypeORMConnection.connection();

  const fastify = Fastify({
    bodyLimit: 1024 * 1024 * 20,
    logger: false,
  });

  fastify.setValidatorCompiler(({ schema }) => {
    if (zodValidation.indentityCheck(schema)) {
      return zodValidation.validation(schema);
    }
    throw new Error(`Unsupported schema: ${JSON.stringify(schema)}`);
  });

  await fastify.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    preflight: false,
  });

  await fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET
  });

  await fastify.register(fastifyMultipart, {
    attachFieldsToBody: "keyValues",
    limits: { fileSize: 20 * 1024 * 1024 },
    onFile: async (part: any) => {
      part.value = {
        filename: part.filename,
        mimetype: part.mimetype,
        file: part.file,
        buffer: await part.toBuffer(),
      };
    },
  });

  await fastify.register(autoLoad, {
    dir: path.join(__dirname, "routes"),
    options: { prefix: "/api" },
  });

  const port = Number(process.env.CONFIG__SERVERPORT);
  const host = "0.0.0.0";

  await fastify.listen({ port, host });
  console.log(`Server started at http://${host}:${port}`);
})();