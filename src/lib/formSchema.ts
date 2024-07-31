import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(100),
});

export const postFormSchema = z.object({
  title: z.string().min(5).max(100),
  body: z.string().min(10, {
    message: "Bio must be at least 10 characters.",
  }),
  category: z.string({
    message: "Category is required.",
  }),
});

export const profileSchema = z.object({
  name: z.string().min(4).max(50).optional(),
  password: z.string().min(4).optional(),
});

export type Category = {
  id: number;
  name: string;
};

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
export type PostFormSchema = z.infer<typeof postFormSchema>;
export type ProfileSchema = z.infer<typeof profileSchema>;
