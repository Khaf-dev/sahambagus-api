export class AnalysisNotFoundException extends Error {
    constructor(identifier: string) {
        super(`Analysis not found: ${identifier}`);
        this.name = 'AnalysisNotFoundException';
    }
}