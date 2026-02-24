import { StockTicker } from '../stock-ticker.vo';

describe('StockTicker Value Object', () => {
  describe('create', () => {
    it('should create valid stock ticker', () => {
      const ticker = StockTicker.create('BBRI');
      expect(ticker.toString()).toBe('BBRI');
    });

    it('should convert to uppercase', () => {
      const ticker = StockTicker.create('bbri');
      expect(ticker.toString()).toBe('BBRI');
    });

    it('should trim whitespace', () => {
      const ticker = StockTicker.create('  BBCA  ');
      expect(ticker.toString()).toBe('BBCA');
    });

    it('should throw error for empty ticker', () => {
      expect(() => StockTicker.create('')).toThrow('Stock ticker is required');
    });

    it('should throw error for whitespace only', () => {
      expect(() => StockTicker.create('   ')).toThrow('Stock ticker is required');
    });

    it('should throw error for ticker longer than 20 chars', () => {
      expect(() => StockTicker.create('A'.repeat(21))).toThrow(
        'Stock ticker must be 20 characters or less',
      );
    });

    it('should throw error for non-alphanumeric characters', () => {
      expect(() => StockTicker.create('BBR-I')).toThrow(
        'Stock ticker must contain only alphanumeric characters',
      );
      expect(() => StockTicker.create('BBR.I')).toThrow(
        'Stock ticker must contain only alphanumeric characters',
      );
      expect(() => StockTicker.create('BBR I')).toThrow(
        'Stock ticker must contain only alphanumeric characters',
      );
    });

    it('should allow alphanumeric tickers', () => {
      const ticker1 = StockTicker.create('BBRI');
      expect(ticker1.toString()).toBe('BBRI');

      const ticker2 = StockTicker.create('ABC123');
      expect(ticker2.toString()).toBe('ABC123');
    });
  });
});