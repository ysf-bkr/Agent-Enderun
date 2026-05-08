/**
 * Shared Types — AI-Enderun v0.1.0
 * Bu paketteki tüm tipler backend ve frontend arasındaki kontratı tanımlar.
 * Sadece @backend düzenler, @frontend okur/import eder.
 */

// ─── Branded Types (Tüm ID'ler bu pattern ile tanımlanır) ─────────────────────
// Neden: Ham string ID'lerin birbirine karışmasını engeller (UserID ≠ ProductID)
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

// ─── ID Üreticiler (Runtime) ──────────────────────────────────────────────────
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
// Neden: Tüm API yanıtları tutarlı yapıda olmalı. 
// ÖNEMLİ: Hatalarda 200 OK dönüp içinde "success: false" dönmek YASAKTIR. 
// Gerçek HTTP status kodları (400, 401, 404 vb.) kullanılmalıdır.
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  code: string;        // 'NOT_FOUND' | 'VALIDATION_ERROR' | 'UNAUTHORIZED' vb.
  message: string;     // Kullanıcıya gösterilecek mesaj
  statusCode: number;  // HTTP status kodu ile eşleşmeli
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Domain Types (Proje başladığında buraya ekle) ────────────────────────────
// Örnek:
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
