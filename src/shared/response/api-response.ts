/**
 * Standard API response
 * 
 * Sukses: {data, meta, error: null}
 * Gagal: {data: null, meta: null, error: { code, message } }
 */

export interface ApiMeta {
    timestamp: string,
    path?: string,
    version?: string,
}

export interface ApiError {
    code: string,
    message: string,
}

export class ApiResponse<T> {
    data: T | null;
    meta: ApiMeta | null;
    error: ApiError | null;

    private constructor(
        data: T | null,
        meta: ApiMeta | null,
        error: ApiError | null,
    ) {
        this.data = data;
        this.meta = meta;
        this.error = error;
    }

    /**
     * Buat untuk sukses respon
     */
    static success<T>(data: T, meta?: Partial<ApiMeta>): ApiResponse<T> {
        return new ApiResponse<T>(
            data,
            {
                timestamp: new Date().toISOString(),
                version: 'v1',
                ...meta
            },
            null,
        );
    }

    /**
     * Buat untuk error respon
     */
    static error(code: string, message: string): ApiResponse<null> {
        return new ApiResponse<null>(
            null,
            null,
            {
                code,
                message
            },
        );
    }
}