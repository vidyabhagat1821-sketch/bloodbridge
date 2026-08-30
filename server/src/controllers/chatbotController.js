import { RAGService } from '../services/ragService.js';
import { db } from '../config/db.js';

export class ChatbotController {
  static async ask(req, res, next) {
    try {
      const { question, history = [] } = req.body;
      if (!question || !question.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Question cannot be empty.'
        });
      }

      const response = await RAGService.askQuestion(question, history);
      res.json({
        success: true,
        ...response
      });
    } catch (err) {
      next(err);
    }
  }

  static async getHistory(req, res, next) {
    try {
      const history = db.collection('conversations').find().slice(-20).reverse();
      res.json({
        success: true,
        count: history.length,
        history
      });
    } catch (err) {
      next(err);
    }
  }
}
