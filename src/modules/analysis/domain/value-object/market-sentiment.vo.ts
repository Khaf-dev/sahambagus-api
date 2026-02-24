/**
 * MarketSentiment Value Object
 * 
 * Represents market sentiment for analysis.
 * BULLISH (Hijau) | BEARISH (Merah) | NEUTRAL (Kuning)
 */

export class MarketSentiment {
  private constructor(private readonly value: string) {
    this.validate();
  }

  private static readonly VALID_SENTIMENTS = [
    'BULLISH',
    'BEARISH',
    'NEUTRAL',
  ] as const;

  static readonly BULLISH = new MarketSentiment('BULLISH');
  static readonly BEARISH = new MarketSentiment('BEARISH');
  static readonly NEUTRAL = new MarketSentiment('NEUTRAL');

  static fromString(value: string): MarketSentiment {
    const upperValue = value.toUpperCase();
    
    if (!this.VALID_SENTIMENTS.includes(upperValue as any)) {
      throw new Error(
        `Invalid market sentiment: ${value}. Must be one of: ${this.VALID_SENTIMENTS.join(', ')}`
      );
    }

    return new MarketSentiment(upperValue);
  }

  toString(): string {
    return this.value;
  }

  isBullish(): boolean {
    return this.value === 'BULLISH';
  }

  isBearish(): boolean {
    return this.value === 'BEARISH';
  }

  isNeutral(): boolean {
    return this.value === 'NEUTRAL';
  }

  /**
   * Get color code for UI
   * BULLISH: green, BEARISH: red, NEUTRAL: yellow
   */
  getColor(): string {
    switch (this.value) {
      case 'BULLISH':
        return '#22c55e'; // green-500
      case 'BEARISH':
        return '#ef4444'; // red-500
      case 'NEUTRAL':
        return '#eab308'; // yellow-500
      default:
        return '#6b7280'; // gray-500
    }
  }

  /**
   * Get emoji for display
   */
  getEmoji(): string {
    switch (this.value) {
      case 'BULLISH':
        return '🟢';
      case 'BEARISH':
        return '🔴';
      case 'NEUTRAL':
        return '🟡';
      default:
        return '⚪';
    }
  }

  private validate(): void {
    if (!MarketSentiment.VALID_SENTIMENTS.includes(this.value as any)) {
      throw new Error(`Invalid market sentiment: ${this.value}`);
    }
  }
}