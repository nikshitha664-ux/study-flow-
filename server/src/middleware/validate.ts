import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const ChatMessageSchema = z.object({
  chatId: z.string().uuid().optional(),
  message: z.string().min(1, "Message cannot be empty"),
  folderId: z.string().uuid().optional(),
  customApiKey: z.string().optional()
});

export const CodeAssistSchema = z.object({
  code: z.string(),
  language: z.string(),
  action: z.enum(["generate", "explain", "debug", "optimize"]),
  instruction: z.string().optional(),
  customApiKey: z.string().optional()
});

export const TranslationSchema = z.object({
  text: z.string().min(1, "Text required"),
  targetLanguage: z.enum(["English", "Hindi", "Telugu", "French", "German", "Japanese"]),
  customApiKey: z.string().optional()
});

export const TaskCreateSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1, "Task title required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  dueDate: z.string().optional()
});

export const TaskUpdateSchema = z.object({
  status: z.enum(["todo", "in_progress", "review", "done"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().optional()
});

export const NoteSchema = z.object({
  title: z.string().min(1, "Note title required"),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  is_favorite: z.boolean().optional()
});

export const ProjectSchema = z.object({
  title: z.string().min(1, "Project title required"),
  description: z.string().optional(),
  color: z.string().optional()
});

export const ImageGenSchema = z.object({
  prompt: z.string().min(1, "Prompt required"),
  customApiKey: z.string().optional()
});

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation Error",
        details: result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    req.body = result.data;
    next();
  };
};
