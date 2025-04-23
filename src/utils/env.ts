import dotenv from "dotenv";

dotenv.config();

export const SECRET: string = process.env.SECRET || "";
