import z from "zod";

export const signupinput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string(),
});

// type inference in zod
export type SignupInput = z.infer<typeof signupinput>;

export const signininput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// type inference in zod
export type SigninInput = z.infer<typeof signininput>;

export const createPostInput = z.object({
  title: z.string(),
  content: z.string(),
});

export type CreatePostType = z.infer<typeof createPostInput>;

export const updatePostInput = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  id: z.string(),
});

export type UpdatePostType = z.infer<typeof updatePostInput>;
