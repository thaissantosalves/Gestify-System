import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "./errors";

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  if (
    err &&
    typeof err === "object" &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
  ) {
    return (err as { message: string }).message;
  }
  return "Erro interno do servidor";
}

export function handleRouteError(err: unknown) {
  if (err instanceof ApiError) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode },
    );
  }
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: "Dados inválidos", details: err.flatten() },
      { status: 400 },
    );
  }
  console.error(err);
  const message = errorMessage(err);
  const status =
    message.toLowerCase().includes("invalid api key") ||
    message.includes("JWT")
      ? 401
      : 500;
  return NextResponse.json({ error: message }, { status });
}
