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

blogRouter.use("/*", async (c, next) => {
  const jwt = c.req.header("authorization");
  console.log(jwt);
  if (!jwt) {
    c.status(401);
    return c.json({ message: "You are not logged in" });
  }
  // const token = jwt.split(" ")[1];
  try {
    const user = await verify(jwt, c.env.JWT_SECRET);
    if (!user || !user.id) {
      c.status(401);
      return c.json({ error: "unauthorized" });
    } else {
      c.set("userId", user.id);
      await next();
    }
  } catch (e) {
    c.status(403);
    return c.json({
      message: `You are not logged in ${e}`,
    });
  }
});

blogRouter.post("/", async (c) => {
  const userId = c.get("userId");
  console.log(userId);

  const body = await c.req.json();
  console.log(body, userId);
  if (!createPostInput.safeParse(body)) {
    return c.json({ message: "invalid data" });
  }
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env?.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());
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
  const body = await c.req.json();
  if (!updatePostInput.safeParse(body)) {
    c.status(411);
    return c.json({ message: "invalid data" });
  }
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env?.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());
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
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: c.env?.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());
  const allBlogs = await prisma.post.findMany({
    select: {
      content: true,
      title: true,
      id: true,
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
blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
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
        id: true,
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
