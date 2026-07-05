import "express";

declare module "express" {
  interface Request {
    session?: {
      admin?: boolean;
      [key: string]: unknown;
    } | null;
  }
}
