import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateBody, ChatMessageSchema, CodeAssistSchema, TranslationSchema, ImageGenSchema } from '../middleware/validate.js';
import { handleChatStream, handlePdfProcess, handlePdfQuiz, handleCodeAssist, handleTranslate, handleImageGenerate } from '../controllers/ai.controller.js';

const router = Router();

router.use(requireAuth);

router.post('/chat/stream', validateBody(ChatMessageSchema), handleChatStream);
router.post('/pdf/process', handlePdfProcess);
router.post('/pdf/quiz', handlePdfQuiz);
router.post('/code/assist', validateBody(CodeAssistSchema), handleCodeAssist);
router.post('/translate', validateBody(TranslationSchema), handleTranslate);
router.post('/image/generate', validateBody(ImageGenSchema), handleImageGenerate);

export default router;
