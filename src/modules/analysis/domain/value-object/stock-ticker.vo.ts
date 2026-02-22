/**
 * StockTicker Value Object
 * 
 * Represent a stock ticker symbol (e.g., BBRI, TLKM, BBCA)
 */
export class StockTicker {
    private constructor(private readonly value: string) {
        this.validate();
    }

    static create(value: string): StockTicker {
        const cleanValue = value.trim().toUpperCase();
        return new StockTicker(cleanValue);
    }

    toString(): string {
        return this.value;
    }

    private validate(): void {
        if (!this.value || this.value.trim().length === 0) {
            throw new Error('Stock ticker is required');
        }

        if (this.value.length > 20) {
            throw new Error('Stock ticker must be 20 characters or less');
        }

        // Only alphanumeric characters allowed
        if (!/^[A-Z0-9]+$/.test(this.value)) {
            throw new Error('Stock ticker must contain only alphanumeric characters');
        }
    }
}