/**
 * AnalysisType Valeu Object
 * 
 * Represent the type of stock analysis
 */
export class AnalysisType {
    private constructor(private readonly value: string) {
        this.validate();
    }

    private static readonly VALID_TYPES = [
        'TECHNICAL',
        'FUNDAMENTAL',
        'SENTIMENT',
        'MARKET_UPDATE',
    ] as const;

    static readonly TECHNICAL = new AnalysisType('TECHNICAL');
    static readonly FUNDAMENTAL = new AnalysisType('FUNDAMENTAL');
    static readonly SENTIMENT = new AnalysisType('SENTIMENT');
    static readonly MARKET_UPDATE = new AnalysisType('MARKET_UPDATE');

    static fromString(value: string): AnalysisType {
        const upperValue = value.toUpperCase();

        if (!this.VALID_TYPES.includes(upperValue as any)) {
            throw new Error(
                `Invalid analysis type: ${value}. Must be one of: ${this.VALID_TYPES.join(', ')}`
            );
        }

        return new AnalysisType(upperValue);
    }

    toString(): string {
        return this.value;
    }

    isTechnical(): boolean {
        return this.value === 'TECHNICAL';
    }

    ifFundamental(): boolean {
        return this.value === 'FUNDAMENTAL';
    }

    isSentiment(): boolean {
        return this.value === 'SENTIMENT';
    }

    isMarketUpdate(): boolean {
        return this.value === 'MARKET_UPDATE';
    }

    private validate(): void {
        if (!AnalysisType.VALID_TYPES.includes(this.value as any)) {
            throw new Error(`Invalid analysis type: ${this.value}`);
        }
    }
}