import { createPostInput, updatePostInput } from "@gourishmarkan/medium-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();
// middleware--
// extracting the user details and parsing to the routes
// blogRouter.use("/*", async (c, next) => {
//   const authHeader = c.req.header("authorization") || "";
//   const user = await verify(authHeader, c.env.JWT_SECRET);
//   try {
//     if (user) {
//       c.set("userId", user.id as string);
//       await next();
//     }
//   } catch (e) {
//     c.status(403);
//     return c.json({ message: e });
//   }
// });

blogRouter.use(async (c, next) => {
  const jwt = c.req.header("Authorization");
  console.log(jwt);
  if (!jwt) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }
  // const token = jwt.split(" ")[1];
  const payload = await verify(jwt, c.env.JWT_SECRET);
  if (!payload || !payload.id) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }

  c.set("userId", payload.id);
  await next();
});

blogRouter.post("/", async (c) => {
  const userId = c.get("userId");
  console.log(userId);
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  console.log(body, userId);
  if (!createPostInput.safeParse(body)) {
    return c.json({ message: "invalid data" });
  }
  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: userId,
    },
  });
  return c.json({
    id: post.id,
  });
});

// update blog--
blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env?.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());
  const body = await c.req.json();
  if (!updatePostInput.safeParse(body)) {
    return c.json({ message: "invalid data" });
  }
  const updatedBlog = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return c.json({ id: updatedBlog.id });
});
// get blog for all id--
// TODO:ADD padgination
blogRouter.get("/bulk", async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env?.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());
  const allBlogs = await prisma.post.findMany({
    select: {
      // id:true
      content: true,
      title: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });
  return c.json({ allBlogs });
});

// get blog for one id--
blogRouter.get("/get/:id", async (c) => {
  const id = await c.req.param("id");
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env?.DATABASE_URL,
      },
    },
  });

  try {
    const blog = await prisma.post.findFirst({
      where: {
        id: id,
      },
      select: {
        // id:true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return c.json({ blog });
  } catch (e) {
    c.status(411);
    return c.json({ message: e });
  }
});
