import { signupinput, signininput } from "@gourishmarkan/medium-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  // const { email };
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env?.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());
  const body = await c.req.json();
  if (!signupinput.safeParse(body)) {
    return c.json({ message: "invalid data" });
  }
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });
    console.log(user);

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.text(jwt);
  } catch (e) {
    c.status(403);

    return c.json({ message: e });
  }
});
// signin--
userRouter.post("/signin", async (c) => {
  console.log("here 1");
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env?.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());
  const body = await c.req.json();
  // console.log(body.email);
  if (!signininput.safeParse(body)) {
    return c.json({ message: "invalid data" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password,
      },
    });
    if (user) {
      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
      return c.text(jwt);
    } else {
      c.status(403);
      return c.json({ message: "user not found" });
    }
  } catch (e) {
    c.status(403);
    c.json({ message: e });
  }
});
