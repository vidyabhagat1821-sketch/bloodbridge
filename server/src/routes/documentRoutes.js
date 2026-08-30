import { Router } from 'express';
import multer from 'multer';
import { DocumentController } from '../controllers/documentController.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = Router();

router.post('/upload', upload.single('file'), DocumentController.uploadDocument);
router.get('/', DocumentController.getAllDocuments);
router.post('/search-test', DocumentController.searchTest);
router.get('/:id', DocumentController.getDocumentById);
router.put('/:id', DocumentController.updateDocument);
router.delete('/:id', DocumentController.deleteDocument);
router.post('/:id/reprocess', DocumentController.reprocessDocument);

export default router;
