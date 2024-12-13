import { NextResponse } from "next/server";
import { createZodRoute } from 'next-zod-route';
import { PrismaClient } from "@prisma/client";
import { userType } from "@/types/types";

export type CustomResponse<T> =
  | ResponseError
  | ResponseSuccess<T>

type ResponseError = {
  success: false
  error: string
}

type ResponseSuccess<T> = {
  success: true
  data: T
}

export class RouteError extends Error {
    status?: number;
    constructor(message: string, status?: number) {
      super(message);
      this.status = status;
    }
  }
  
export const route = createZodRoute({
  handleServerError: (e: Error) => {
    if (e instanceof RouteError) {
      return NextResponse.json(
        { message: e.message, status: e.status },
        { status: e.status },
      );
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  },
});

export const authRoute = route.use(async ({ request }) => {

  const prisma = new PrismaClient();

  const token = request.headers.get('Authorization');
  if (!token) {
    throw new RouteError('Unauthorized', 401);
  };

  if (!token.startsWith('Bearer ')) {
    throw new RouteError('Unauthorized', 401);
  }

  const tokenValue = token.split('Bearer ')[1];

  const user = await prisma.user.findFirst({
    where: {
      token: tokenValue,
    },
  }) as userType | null 

  if (!user) {
    throw new RouteError('Unauthorized', 401);
  };

  return user;
});

export function ResponseCustom(data: CustomResponse<unknown>, status: number) {
  return NextResponse.json(data, { status });
}