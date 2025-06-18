export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuthUser {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// Domain Types
export enum TypeClient {
  NORMAL = 'NORMAL',
  GRAND_COMPTE = 'GRAND_COMPTE'
}

export enum TypeService {
  CARROSSERIE = 'CARROSSERIE',
  MECANIQUE = 'MECANIQUE'
}

export enum StatutDevis {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
  EXPIRE = 'EXPIRE'
}

export enum StatutODR {
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  ANNULE = 'ANNULE'
}

export enum StatutFacture {
  EN_ATTENTE = 'EN_ATTENTE',
  PAYEE = 'PAYEE',
  PARTIELLEMENT_PAYEE = 'PARTIELLEMENT_PAYEE',
  IMPAYEE = 'IMPAYEE',
  ANNULEE = 'ANNULEE'
}

export enum ModePaiement {
  ESPECES = 'ESPECES',
  CHEQUE = 'CHEQUE',
  VIREMENT = 'VIREMENT',
  TPE_VIVAWALLET = 'TPE_VIVAWALLET',
  CREDIT_INTERNE = 'CREDIT_INTERNE',
  MIXTE = 'MIXTE'
}