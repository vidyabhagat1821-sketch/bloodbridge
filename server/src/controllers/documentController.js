import { RAGService } from '../services/ragService.js';
import { db } from '../config/db.js';

export class DocumentController {
  static async uploadDocument(req, res, next) {
    try {
      if (!req.file && !req.body.content) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a document file (PDF, TXT, MD) or raw text content.'
        });
      }

      let buffer;
      let originalName;
      let mimeType;

      if (req.file) {
        buffer = req.file.buffer;
        originalName = req.file.originalname;
        mimeType = req.file.mimetype;
      } else {
        buffer = Buffer.from(req.body.content, 'utf-8');
        originalName = `${req.body.title || 'manual_doc'}.txt`;
        mimeType = 'text/plain';
      }

      const result = await RAGService.ingestDocument({
        originalName,
        buffer,
        mimeType,
        title: req.body.title
      });

      res.status(201).json({
        success: true,
        message: `Document "${result.document.title}" uploaded and indexed into ${result.chunksCreated} semantic chunks.`,
        ...result
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAllDocuments(req, res, next) {
    try {
      const documents = db.collection('documents').find();
      const chunks = db.collection('documentChunks').find();

      const docsWithStats = documents.map((doc) => {
        const docChunks = chunks.filter((c) => c.documentId === doc.id);
        return {
          ...doc,
          contentPreview: doc.content ? doc.content.substring(0, 200) + '...' : '',
          chunksCount: docChunks.length
        };
      });

      res.json({
        success: true,
        count: docsWithStats.length,
        totalVectorChunks: chunks.length,
        documents: docsWithStats
      });
    } catch (err) {
      next(err);
    }
  }

  static async getDocumentById(req, res, next) {
    try {
      const doc = db.collection('documents').findById(req.params.id);
      if (!doc) {
        return res.status(404).json({ success: false, message: 'Document not found.' });
      }

      const chunks = db.collection('documentChunks').find((c) => c.documentId === req.params.id);

      res.json({
        success: true,
        document: doc,
        chunksCount: chunks.length,
        chunks
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateDocument(req, res, next) {
    try {
      const doc = db.collection('documents').findById(req.params.id);
      if (!doc) {
        return res.status(404).json({ success: false, message: 'Document not found.' });
      }

      const updated = db.collection('documents').update(req.params.id, {
        title: req.body.title || doc.title,
        content: req.body.content || doc.content
      });

      // Auto-reprocess if content changed
      if (req.body.content) {
        RAGService.reprocessDocument(req.params.id);
      }

      res.json({ success: true, document: updated, message: 'Document updated successfully.' });
    } catch (err) {
      next(err);
    }
  }

  static async deleteDocument(req, res, next) {
    try {
      const result = RAGService.deleteDocument(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async reprocessDocument(req, res, next) {
    try {
      const result = RAGService.reprocessDocument(req.params.id);
      res.json({
        success: true,
        message: 'Document successfully re-chunked and re-indexed in vector store.',
        ...result
      });
    } catch (err) {
      next(err);
    }
  }

  static async searchTest(req, res, next) {
    try {
      const { query, topK = 5 } = req.body;
      if (!query) {
        return res.status(400).json({ success: false, message: 'Search query required.' });
      }

      const results = RAGService.searchChunks(query, Number(topK));
      res.json({
        success: true,
        query,
        count: results.length,
        results
      });
    } catch (err) {
      next(err);
    }
  }
}
