import { AnalysisType } from '../analysis-type.vo';

describe('AnalysisType Value Object', () => {
  describe('fromString', () => {
    it('should create TECHNICAL analysis type', () => {
      const type = AnalysisType.fromString('TECHNICAL');
      expect(type.toString()).toBe('TECHNICAL');
      expect(type.isTechnical()).toBe(true);
      expect(type.isFundamental()).toBe(false);
    });

    it('should create FUNDAMENTAL analysis type', () => {
      const type = AnalysisType.fromString('FUNDAMENTAL');
      expect(type.toString()).toBe('FUNDAMENTAL');
      expect(type.isFundamental()).toBe(true);
      expect(type.isTechnical()).toBe(false);
    });

    it('should create SENTIMENT analysis type', () => {
      const type = AnalysisType.fromString('SENTIMENT');
      expect(type.toString()).toBe('SENTIMENT');
      expect(type.isSentiment()).toBe(true);
    });

    it('should create MARKET_UPDATE analysis type', () => {
      const type = AnalysisType.fromString('MARKET_UPDATE');
      expect(type.toString()).toBe('MARKET_UPDATE');
      expect(type.isMarketUpdate()).toBe(true);
    });

    it('should accept lowercase input', () => {
      const type = AnalysisType.fromString('technical');
      expect(type.toString()).toBe('TECHNICAL');
    });

    it('should throw error for invalid type', () => {
      expect(() => AnalysisType.fromString('INVALID')).toThrow(
        'Invalid analysis type: INVALID',
      );
    });

    it('should throw error for empty string', () => {
      expect(() => AnalysisType.fromString('')).toThrow('Invalid analysis type');
    });
  });

  describe('static constants', () => {
    it('should have TECHNICAL constant', () => {
      expect(AnalysisType.TECHNICAL.toString()).toBe('TECHNICAL');
      expect(AnalysisType.TECHNICAL.isTechnical()).toBe(true);
    });

    it('should have FUNDAMENTAL constant', () => {
      expect(AnalysisType.FUNDAMENTAL.toString()).toBe('FUNDAMENTAL');
      expect(AnalysisType.FUNDAMENTAL.isFundamental()).toBe(true);
    });

    it('should have SENTIMENT constant', () => {
      expect(AnalysisType.SENTIMENT.toString()).toBe('SENTIMENT');
      expect(AnalysisType.SENTIMENT.isSentiment()).toBe(true);
    });

    it('should have MARKET_UPDATE constant', () => {
      expect(AnalysisType.MARKET_UPDATE.toString()).toBe('MARKET_UPDATE');
      expect(AnalysisType.MARKET_UPDATE.isMarketUpdate()).toBe(true);
    });
  });
});