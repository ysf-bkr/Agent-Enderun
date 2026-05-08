/**
 * Shared Types — AI-Enderun v0.0.9
 * All types in this package define the contract between backend and frontend.
 * Only @backend modifies this file; @frontend only reads/imports.
 */

// ─── Branded Types (All IDs must follow this pattern) ─────────────────────
// Why: Prevents raw string IDs from being mixed up (UserID ≠ ProductID).
export type Brand<T, B> = T & { readonly _brand: B };

// ─── ULID Generator (Lightweight) ──────────────────────────────────────────────
const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const ENCODING_LEN = ENCODING.length;

export const createULID = (seedTime: number = Date.now()): string => {
  let time = seedTime;
  const timeChars = new Array(10);
  for (let i = 9; i >= 0; i--) {
    timeChars[i] = ENCODING.charAt(time % ENCODING_LEN);
    time = Math.floor(time / ENCODING_LEN);
  }
  const randomChars = new Array(16);
  for (let i = 0; i < 16; i++) {
    randomChars[i] = ENCODING.charAt(Math.floor(Math.random() * ENCODING_LEN));
  }
  return timeChars.join("") + randomChars.join("");
};

export type UserID = Brand<string, 'UserID'>;
export type SessionID = Brand<string, 'SessionID'>;

// ─── ID Generators (Runtime) ──────────────────────────────────────────────────
export const createUserID = (): UserID => createULID() as UserID;
export const createSessionID = (): SessionID => createULID() as SessionID;

// ─── Pagination ────────────────────────────────────────────────────────────────
export interface PaginationQuery {
  page: number;       // 1-indexed
  limit: number;      // max 100
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ─── API Response Wrapper ──────────────────────────────────────────────────────
// Why: All API responses must follow a consistent structure.
// IMPORTANT: Returning 200 OK with "success: false" for errors is FORBIDDEN.
// Real HTTP status codes (400, 401, 404, etc.) must be used.
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  code: string;        // 'NOT_FOUND' | 'VALIDATION_ERROR' | 'UNAUTHORIZED' etc.
  message: string;     // User-facing error message
  statusCode: number;  // Must match the HTTP status code
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Domain Types (Add here when project development starts) ──────────────────
// Example:
// export interface User {
//   id: UserID;
//   email: string;
//   name: string;
//   createdAt: string; // ISO-8601
// }
//
// export interface CreateUserDTO {
//   email: string;
//   name: string;
//   password: string;
// }
//
// export interface UpdateUserDTO {
//   name?: string;
// }
