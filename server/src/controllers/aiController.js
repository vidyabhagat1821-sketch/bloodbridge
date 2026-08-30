import { AIParserService } from '../services/aiParserService.js';

export class AIController {
  static async parseBloodRequest(req, res, next) {
    try {
      const { text } = req.body;
      if (!text || !text.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Please provide prompt text to parse (e.g. "Need 3 units of O+ blood at General Hospital").'
        });
      }

      const extracted = await AIParserService.parseBloodRequest(text);
      res.json({
        success: true,
        extracted
      });
    } catch (err) {
      next(err);
    }
  }
}
