export interface DashboardMetrics {
  totalClients: number
  grandsComptes: number
  odrJour: number
  odrMois: number
  odrAnnee: number
  montantJour: number
  montantMois: number
  montantAnnee: number
  facturesEnCours: number
  facturesImpayees: number
}

export interface AlerteFacture {
  id: string
  numeroFacture: string
  clientNom: string
  montant: number
  dateEcheance: Date
  joursRestants: number
  type: 'WARNING' | 'OVERDUE'
}

export interface ClientFormData {
  prenom: string
  nom: string
  entreprise?: string
  telephone: string
  email: string
  adresse: string
  ville: string
  codePostal: string
  typeClient: 'NORMAL' | 'GRAND_COMPTE'
}

export interface VehiculeFormData {
  immatriculation: string
  marque: string
  modele: string
  annee: number
  numeroSerie?: string
  kilometrage?: number
  clientId: string
}

export interface PrestationFormData {
  nom: string
  description: string
  typeService: 'CARROSSERIE' | 'MECANIQUE'
  prixDeBase: number
}

export interface DevisFormData {
  clientId: string
  vehiculeId: string
  typeService: 'CARROSSERIE' | 'MECANIQUE'
  dateValidite: Date
  conditionsPaiement?: string
  pourcentageAcompte?: number
  moyensPaiementAcceptes: string[]
  compteBancaire?: string
  articles: ArticleFormData[]
}

export interface ArticleFormData {
  designation: string
  prixUnitaireTTC: number
  quantite: number
  prestationId?: string
}