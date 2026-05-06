/**
 * Shared Types — AI Agent Framework v1.0.2
 * Bu paketteki tüm tipler backend ve frontend arasındaki kontratı tanımlar.
 * Sadece @backend düzenler, @frontend okur/import eder.
 */

// ─── Branded Types (Tüm ID'ler bu pattern ile tanımlanır) ─────────────────────
// Neden: Ham string ID'lerin birbirine karışmasını engeller (UserID ≠ ProductID)
export type Brand<T, B> = T & { readonly _brand: B };

export type UserID = Brand<string, 'UserID'>;
export type SessionID = Brand<string, 'SessionID'>;
// Yeni ID tipleri buraya ekle: export type XxxID = Brand<string, 'XxxID'>;

// ─── ID Üretici (Runtime) ──────────────────────────────────────────────────────
// Neden: crypto.randomUUID() tarayıcı + Node.js'te çalışır, uuid paketi gereksiz
export const createUserID = (): UserID => crypto.randomUUID() as UserID;
export const createSessionID = (): SessionID => crypto.randomUUID() as SessionID;

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
// Neden: Tüm API yanıtları tutarlı yapıda olmalı
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  code: string;        // 'NOT_FOUND' | 'VALIDATION_ERROR' | 'UNAUTHORIZED' vb.
  message: string;     // Kullanıcıya gösterilecek mesaj
  statusCode: number;
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
