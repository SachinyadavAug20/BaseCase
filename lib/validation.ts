import { filter } from "@mdxeditor/editor";
import z from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(50, { message: "Username must be at most 50 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be at most 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces."),

  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must be at most 30 characters" })
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores.",
    ),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(50, { message: "Username must be at most 50 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title is required" })
    .max(100, { message: "Title must be at most 100 characters" }),
  content: z.string().min(10, { message: "Content is required" }),
  tags: z
    .array(
      z
        .string()
        .min(2, { message: "Tag must be at least 2 characters" })
        .max(25, { message: "Tag must be at most 25 characters" }),
    )
    .min(1, { message: "At least one tag is required" })
    .max(5, { message: "Maximum of 5 tags allowed" }),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required" }),
})
export const getQuestionSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required" }),
})

export const UserSchema = z.object({
  // making same as DB schema
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(500, { message: "Name must be at most 500 characters" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(1000, { message: "Username must be at most 1000 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email" }),
  bio: z.string().optional(),
  image: z
    .string()
    .url({ message: "Please enter a valid image URL" })
    .optional(),
  location: z.string().optional(),
  resumelink: z
    .string()
    .url({ message: "Please enter a valid resume URL" })
    .optional(),
  portfolio: z
    .string()
    .url({ message: "Please enter a valid portfolio URL" })
    .optional(),
  reputation: z.number().default(0).optional(),
});

export const AccountSchema = z.object({
  // making same as DB schema
  userId: z.string().min(1, { message: "User ID is required" }),
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(500, { message: "Name must be at most 500 characters" }),
  image: z
    .string()
    .url({ message: "Please enter a valid image URL" })
    .optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(50, { message: "Username must be at most 50 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    }).optional(),
  provider: z.string().min(1, { message: "Provider is required" }),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required" }),
});

export const SigInWithOAuthSchema=z.object({
  provider:z.enum(["github","google","apple"]),
  providerAccountId:z.string().min(1,{message:"Provider Account ID is required"}),
  user:z.object({
    name:z.string().min(1,{message:"Username is required"}),
    username:z.string().min(3,{message:"Username is required"}),
    email:z.string().email({message:"Please enter a valid email"}),
    image:z.string().url({message:"Enter a valid image URL"}).optional(),
  })
})

export const PaginatedSearchParamsSchema = UserSchema.extend({
  page: z.number().int().positive().default(1),
  pageSize:z.number().int().positive().default(10),
  query:z.string().optional(),
  filter:z.string().optional(),
  sort:z.string().optional(),
})

