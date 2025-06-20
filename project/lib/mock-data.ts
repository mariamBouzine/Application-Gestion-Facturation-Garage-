// Centralized mock data store
export interface Client {
  id: string
  numeroClient: string
  prenom: string
  nom: string
  entreprise?: string
  telephone: string
  email: string
  adresse: string
  ville: string
  codePostal: string
  typeClient: 'NORMAL' | 'GRAND_COMPTE'
  createdAt: Date
  updatedAt: Date
}

export interface Vehicule {
  couleur: ReactNode
  id: string
  immatriculation: string
  marque: string
  modele: string
  annee: number
  numeroSerie?: string
  kilometrage?: number
  clientId: string
  createdAt: Date
  updatedAt: Date
}

// Mock data stores
let mockClients: Client[] = [
  {
    id: '1',
    numeroClient: 'CLI-001',
    prenom: 'Martin',
    nom: 'Dubois',
    entreprise: null,
    telephone: '06.12.34.56.78',
    email: 'martin.dubois@email.com',
    adresse: '123 Rue de la Paix',
    ville: 'Paris',
    codePostal: '75001',
    typeClient: 'NORMAL',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: '2',
    numeroClient: 'CLI-002',
    prenom: 'Sophie',
    nom: 'Lambert',
    entreprise: 'Transport Lambert SARL',
    telephone: '01.23.45.67.89',
    email: 'contact@transport-lambert.fr',
    adresse: '45 Avenue des Champs',
    ville: 'Lyon',
    codePostal: '69000',
    typeClient: 'GRAND_COMPTE',
    createdAt: new Date('2024-01-16T14:30:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z')
  },
  {
    id: '3',
    numeroClient: 'CLI-003',
    prenom: 'Pierre',
    nom: 'Martin',
    entreprise: 'Garage Centrale SARL',
    telephone: '04.56.78.90.12',
    email: 'pierre.martin@garage-centrale.fr',
    adresse: '78 Boulevard de la République',
    ville: 'Marseille',
    codePostal: '13000',
    typeClient: 'GRAND_COMPTE',
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-10T09:00:00Z')
  },
  {
    id: '4',
    numeroClient: 'CLI-004',
    prenom: 'Marie',
    nom: 'Durand',
    entreprise: null,
    telephone: '02.34.56.78.90',
    email: 'marie.durand@email.com',
    adresse: '15 Rue des Fleurs',
    ville: 'Nantes',
    codePostal: '44000',
    typeClient: 'NORMAL',
    createdAt: new Date('2024-01-18T16:00:00Z'),
    updatedAt: new Date('2024-01-18T16:00:00Z')
  }
]

let mockVehicules: Vehicule[] = [
  {
    id: '1',
    immatriculation: 'AB-123-CD',
    marque: 'Peugeot',
    modele: '308',
    annee: 2020,
    numeroSerie: 'VF3XXXXX',
    kilometrage: 45000,
    clientId: '1',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: '2',
    immatriculation: 'EF-456-GH',
    marque: 'Renault',
    modele: 'Clio',
    annee: 2019,
    numeroSerie: 'VF1XXXXX',
    kilometrage: 62000,
    clientId: '2',
    createdAt: new Date('2024-01-16T14:30:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z')
  },
  {
    id: '3',
    immatriculation: 'IJ-789-KL',
    marque: 'Citroën',
    modele: 'C3',
    annee: 2021,
    numeroSerie: 'VF7XXXXX',
    kilometrage: 28000,
    clientId: '3',
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-10T09:00:00Z')
  },
  {
    id: '4',
    immatriculation: 'MN-012-OP',
    marque: 'Volkswagen',
    modele: 'Golf',
    annee: 2018,
    numeroSerie: 'WVW XXXXX',
    kilometrage: 85000,
    clientId: '4',
    createdAt: new Date('2024-01-18T16:00:00Z'),
    updatedAt: new Date('2024-01-18T16:00:00Z')
  }
]

// Client operations
export const getClients = (): Client[] => {
  return [...mockClients]
}

export const addClient = (clientData: Omit<Client, 'id' | 'numeroClient' | 'createdAt' | 'updatedAt'>): Client => {
  const newClient: Client = {
    ...clientData,
    id: (mockClients.length + 1).toString(),
    numeroClient: `CLI-${String(mockClients.length + 1).padStart(3, '0')}`,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  mockClients.push(newClient)
  return newClient
}

export const updateClient = (id: string, updates: Partial<Client>): Client | null => {
  const index = mockClients.findIndex(c => c.id === id)
  if (index === -1) return null
  
  mockClients[index] = {
    ...mockClients[index],
    ...updates,
    updatedAt: new Date()
  }
  
  return mockClients[index]
}

export const deleteClient = (id: string): boolean => {
  const index = mockClients.findIndex(c => c.id === id)
  if (index === -1) return false
  
  mockClients.splice(index, 1)
  return true
}

// Vehicule operations
export const getVehicules = (): Vehicule[] => {
  return [...mockVehicules]
}

export const addVehicule = (vehiculeData: Omit<Vehicule, 'id' | 'createdAt' | 'updatedAt'>): Vehicule => {
  const newVehicule: Vehicule = {
    ...vehiculeData,
    id: (mockVehicules.length + 1).toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  mockVehicules.push(newVehicule)
  return newVehicule
}

export const updateVehicule = (id: string, updates: Partial<Vehicule>): Vehicule | null => {
  const index = mockVehicules.findIndex(v => v.id === id)
  if (index === -1) return null
  
  mockVehicules[index] = {
    ...mockVehicules[index],
    ...updates,
    updatedAt: new Date()
  }
  
  return mockVehicules[index]
}

export const deleteVehicule = (id: string): boolean => {
  const index = mockVehicules.findIndex(v => v.id === id)
  if (index === -1) return false
  
  mockVehicules.splice(index, 1)
  return true
}

// Statistics
export const getClientStats = () => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  return {
    totalClients: mockClients.length,
    grandsComptes: mockClients.filter(c => c.typeClient === 'GRAND_COMPTE').length,
    nouveauxClientsMois: mockClients.filter(c => c.createdAt >= startOfMonth).length
  }
}

export const getVehiculeStats = () => {
  return {
    totalVehicules: mockVehicules.length,
    anneesMoyenne: Math.round(mockVehicules.reduce((sum, v) => sum + v.annee, 0) / mockVehicules.length),
    kilometrageMoyen: Math.round(mockVehicules.reduce((sum, v) => sum + (v.kilometrage || 0), 0) / mockVehicules.length)
  }
}

export const getDashboardMetrics = () => {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)

  // Enhanced realistic metrics for French automotive garage
  return {
    totalClients: mockClients.length,
    grandsComptes: mockClients.filter(c => c.typeClient === 'GRAND_COMPTE').length,
    odrJour: 8, // Daily repair orders
    odrMois: 156, // Monthly repair orders
    odrAnnee: 1847, // Yearly repair orders
    montantJour: 3247.80, // Daily revenue in EUR
    montantMois: 67150.90, // Monthly revenue in EUR
    montantAnnee: 487650.45, // Yearly revenue in EUR
    facturesEnCours: 23, // Pending invoices
    facturesImpayees: 7 // Overdue invoices
  }
}