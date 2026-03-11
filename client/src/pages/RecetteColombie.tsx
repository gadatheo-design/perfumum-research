import { useState } from 'react';
import { useRoute } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Leaf, Droplet, Clock, Flame } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const recettesData = {
  'colombie-i': {
    id: 1,
    name: 'Colombie I',
    title: 'Origan Sacré',
    description: 'Hommage à Lippia Origanoides, l\'origan sauvage des Andes colombiennes. Une exploration de l\'intensité épicée et herbacée.',
    profile: 'Épicé herbacé avec notes boisées et chocolatées',
    intensity: 8,
    texture: 'Sec',
    color: 'from-amber-600 to-amber-700',
    region: 'Cali, Vallée du Cauca',
    
    composition: [
      { name: 'Lippia Origanoides', percentage: 40, role: 'Note dominante' },
      { name: 'Palo Santo', percentage: 30, role: 'Note de cœur' },
      { name: 'Café Geisha', percentage: 20, role: 'Note de fond' },
      { name: 'Cacao Colombien', percentage: 10, role: 'Fixatif' },
    ],
    
    protocol: {
      extraction: 'Hydrodistillation de Lippia à 95°C pendant 3h',
      maceration: '2 semaines en alcool à 70°',
      maturation: '4 semaines à température ambiante',
      dilution: 'Dilution à 15% en alcool dénaturé',
      stability: 'Stable 12 mois à l\'abri de la lumière',
    },
    
    olfactiveNotes: {
      top: 'Épices chaudes, herbes fraîches, poivre noir',
      heart: 'Bois de santal, cacao, notes florales subtiles',
      base: 'Vanille, ambre gris, musc blanc',
    },
    
    emotionalResonance: [
      'Énergisant et tonifiant',
      'Rituel et introspection',
      'Force et ancrage',
      'Connexion à la terre',
    ],
    
    applications: [
      'Parfum de jour pour les hommes',
      'Diffusion atmosphérique en automne/hiver',
      'Rituels de méditation et de grounding',
      'Accord de base pour compositions personnelles',
    ],
    
    history: 'Lippia Origanoides, connue localement sous le nom d\'origan sauvage, est utilisée depuis des siècles par les peuples andins pour ses propriétés énergisantes et rituelles. Cette recette rend hommage à cette tradition millénaire.',
    
    suppliers: [
      { name: 'Fournisseur Cali', region: 'Vallée du Cauca', contact: 'contact@cali-supplier.co' },
      { name: 'Hermitage Oils', region: 'Colombie', contact: 'info@hermitage-oils.com' },
    ],
  },
  'colombie-ii': {
    id: 2,
    name: 'Colombie II',
    title: 'Damiana Tropicale',
    description: 'Exploration de Turnera Diffusa, la damiana tropicale de Cali. Un accord floral tropical avec notes citrus et épicées.',
    profile: 'Floral tropical avec notes citrus et épicées',
    intensity: 7,
    texture: 'Humide',
    color: 'from-pink-500 to-rose-600',
    region: 'Cali, Vallée du Cauca',
    
    composition: [
      { name: 'Turnera Diffusa', percentage: 45, role: 'Note dominante' },
      { name: 'Calycolpus Moritzianus', percentage: 25, role: 'Note de tête' },
      { name: 'Fleur de Café', percentage: 20, role: 'Note de cœur' },
      { name: 'Piper Aduncum', percentage: 10, role: 'Fixatif' },
    ],
    
    protocol: {
      extraction: 'Hydrodistillation de Turnera à 90°C pendant 2h30',
      maceration: '3 semaines en alcool à 70°',
      maturation: '3 semaines à température ambiante',
      dilution: 'Dilution à 12% en alcool dénaturé',
      stability: 'Stable 10 mois à l\'abri de la lumière',
    },
    
    olfactiveNotes: {
      top: 'Citrus frais, herbes tropicales, poivre blanc',
      heart: 'Fleur d\'oranger, jasmin, notes florales douces',
      base: 'Vanille, bois de santal, musc blanc',
    },
    
    emotionalResonance: [
      'Apaisante et relaxante',
      'Sensualité tropicale',
      'Légèreté et joie',
      'Connexion à la nature',
    ],
    
    applications: [
      'Parfum de jour pour les femmes',
      'Diffusion atmosphérique en printemps/été',
      'Rituels de relaxation et de bien-être',
      'Accord floral pour compositions personnelles',
    ],
    
    history: 'Turnera Diffusa, appelée damiana en Amérique latine, est traditionnellement utilisée pour ses propriétés apaisantes et sensuelles. Cette recette célèbre la richesse florale de cette plante tropicale.',
    
    suppliers: [
      { name: 'Fournisseur Cali', region: 'Vallée du Cauca', contact: 'contact@cali-supplier.co' },
      { name: 'Hermitage Oils', region: 'Colombie', contact: 'info@hermitage-oils.com' },
    ],
  },
  'colombie-iii': {
    id: 3,
    name: 'Colombie III',
    title: 'Guayabita Citrus',
    description: 'Célébration de Calycolpus Moritzianus, la guayabita d\'Armenia. Un accord citrus frais et pétillant avec notes boisées.',
    profile: 'Citrus frais et pétillant avec notes boisées',
    intensity: 7,
    texture: 'Sec',
    color: 'from-yellow-400 to-orange-500',
    region: 'Armenia, Quindío',
    
    composition: [
      { name: 'Calycolpus Moritzianus', percentage: 50, role: 'Note dominante' },
      { name: 'Café Geisha', percentage: 25, role: 'Note de tête' },
      { name: 'Steiractinia Aspera', percentage: 15, role: 'Note de cœur' },
      { name: 'Palo Santo', percentage: 10, role: 'Fixatif' },
    ],
    
    protocol: {
      extraction: 'Expression à froid de Calycolpus + hydrodistillation',
      maceration: '2 semaines en alcool à 70°',
      maturation: '2 semaines à température ambiante',
      dilution: 'Dilution à 14% en alcool dénaturé',
      stability: 'Stable 8 mois (citrus volatiles)',
    },
    
    olfactiveNotes: {
      top: 'Citrus frais, bergamote, notes vertes',
      heart: 'Bois léger, herbes aromatiques, notes florales',
      base: 'Bois de santal, ambre, musc blanc',
    },
    
    emotionalResonance: [
      'Énergisant et clarifiant',
      'Stimulant mental',
      'Fraîcheur et légèreté',
      'Optimisme et vitalité',
    ],
    
    applications: [
      'Parfum de jour unisexe',
      'Diffusion atmosphérique toute l\'année',
      'Rituels de clarté mentale',
      'Accord citrus pour compositions personnelles',
    ],
    
    history: 'Calycolpus Moritzianus, ou guayabita, est un fruit tropical colombien apprécié pour sa fraîcheur naturelle. Cette recette capture l\'essence de la montagne d\'Armenia.',
    
    suppliers: [
      { name: 'Fournisseur Armenia', region: 'Quindío', contact: 'contact@armenia-supplier.co' },
      { name: 'Hermitage Oils', region: 'Colombie', contact: 'info@hermitage-oils.com' },
    ],
  },
  'colombie-iv': {
    id: 4,
    name: 'Colombie IV',
    title: 'Café Floral',
    description: 'Harmonie entre Café Geisha et Fleur de Café. Un accord floral blanc avec notes fruitées et chocolatées.',
    profile: 'Floral blanc avec notes fruitées et chocolatées',
    intensity: 6,
    texture: 'Lactone',
    color: 'from-amber-100 to-amber-200',
    region: 'Armenia, Quindío',
    
    composition: [
      { name: 'Café Geisha', percentage: 35, role: 'Note de tête' },
      { name: 'Fleur de Café', percentage: 35, role: 'Note dominante' },
      { name: 'Turnera Diffusa', percentage: 20, role: 'Note de cœur' },
      { name: 'Cacao Colombien', percentage: 10, role: 'Fixatif' },
    ],
    
    protocol: {
      extraction: 'Hydrodistillation douce de fleurs de café',
      maceration: '3 semaines en alcool à 60°',
      maturation: '4 semaines à température ambiante',
      dilution: 'Dilution à 10% en alcool dénaturé',
      stability: 'Stable 12 mois à l\'abri de la lumière',
    },
    
    olfactiveNotes: {
      top: 'Fleur de café, jasmin, notes fruitées',
      heart: 'Rose blanche, fleur d\'oranger, vanille',
      base: 'Cacao, bois de santal, musc blanc',
    },
    
    emotionalResonance: [
      'Apaisante et sensuelle',
      'Élégance et raffinement',
      'Douceur et confort',
      'Féminité douce',
    ],
    
    applications: [
      'Parfum de jour pour les femmes',
      'Diffusion atmosphérique en toute saison',
      'Rituels de relaxation et de bien-être',
      'Accord floral blanc pour compositions',
    ],
    
    history: 'Le café Geisha d\'Armenia est l\'un des plus rares et précieux au monde. Cette recette honore à la fois le grain et la fleur de cette plante extraordinaire.',
    
    suppliers: [
      { name: 'Fournisseur Armenia', region: 'Quindío', contact: 'contact@armenia-supplier.co' },
      { name: 'Hermitage Oils', region: 'Colombie', contact: 'info@hermitage-oils.com' },
    ],
  },
  'colombie-v': {
    id: 5,
    name: 'Colombie V',
    title: 'Poivre Sauvage',
    description: 'Intensité de Piper Aduncum, le poivre sauvage colombien. Un accord poivré intense avec notes épicées et boisées.',
    profile: 'Poivré intense avec notes épicées et boisées',
    intensity: 9,
    texture: 'Sec',
    color: 'from-red-600 to-red-700',
    region: 'Cali, Vallée du Cauca',
    
    composition: [
      { name: 'Piper Aduncum', percentage: 45, role: 'Note dominante' },
      { name: 'Lippia Origanoides', percentage: 25, role: 'Note de cœur' },
      { name: 'Palo Santo', percentage: 20, role: 'Note de fond' },
      { name: 'Café Geisha', percentage: 10, role: 'Fixatif' },
    ],
    
    protocol: {
      extraction: 'Hydrodistillation de Piper à 100°C pendant 3h',
      maceration: '4 semaines en alcool à 75°',
      maturation: '5 semaines à température ambiante',
      dilution: 'Dilution à 16% en alcool dénaturé',
      stability: 'Stable 14 mois à l\'abri de la lumière',
    },
    
    olfactiveNotes: {
      top: 'Poivre noir intense, épices chaudes, herbes',
      heart: 'Bois de santal, cacao, notes florales',
      base: 'Vanille, ambre gris, musc blanc',
    },
    
    emotionalResonance: [
      'Énergisant et stimulant',
      'Force et puissance',
      'Tonification masculine',
      'Ancrage et présence',
    ],
    
    applications: [
      'Parfum de jour pour les hommes',
      'Diffusion atmosphérique en automne/hiver',
      'Rituels de tonification et d\'énergie',
      'Accord épicé pour compositions personnelles',
    ],
    
    history: 'Piper Aduncum, le poivre sauvage colombien, est l\'une des épices les plus intenses de la région. Cette recette capture toute la puissance de cette plante remarquable.',
    
    suppliers: [
      { name: 'Fournisseur Cali', region: 'Vallée du Cauca', contact: 'contact@cali-supplier.co' },
      { name: 'Hermitage Oils', region: 'Colombie', contact: 'info@hermitage-oils.com' },
    ],
  },
  'colombie-vi': {
    id: 6,
    name: 'Colombie VI',
    title: 'Cacao Sacré',
    description: 'Profondeur du Cacao Colombien fermenté. Un accord chocolaté riche avec notes florales tropicales.',
    profile: 'Chocolat riche avec notes florales tropicales',
    intensity: 7,
    texture: 'Résine',
    color: 'from-amber-900 to-amber-950',
    region: 'Cali, Vallée du Cauca',
    
    composition: [
      { name: 'Cacao Colombien', percentage: 40, role: 'Note dominante' },
      { name: 'Turnera Diffusa', percentage: 30, role: 'Note de cœur' },
      { name: 'Palo Santo', percentage: 20, role: 'Note de fond' },
      { name: 'Steiractinia Aspera', percentage: 10, role: 'Fixatif' },
    ],
    
    protocol: {
      extraction: 'Macération de cacao fermenté en alcool',
      maceration: '6 semaines en alcool à 70°',
      maturation: '6 semaines à température ambiante',
      dilution: 'Dilution à 13% en alcool dénaturé',
      stability: 'Stable 12 mois à l\'abri de la lumière',
    },
    
    olfactiveNotes: {
      top: 'Cacao frais, notes fruitées, épices douces',
      heart: 'Fleur tropicale, vanille, bois léger',
      base: 'Bois de santal, ambre, musc blanc',
    },
    
    emotionalResonance: [
      'Réconfortante et apaisante',
      'Sensualité douce',
      'Luxe et indulgence',
      'Bien-être et confort',
    ],
    
    applications: [
      'Parfum de jour unisexe',
      'Diffusion atmosphérique en automne/hiver',
      'Rituels de bien-être et de relaxation',
      'Accord chocolaté pour compositions',
    ],
    
    history: 'Le cacao colombien est réputé pour sa complexité aromatique exceptionnelle. Cette recette célèbre la richesse du cacao fermenté de Cali.',
    
    suppliers: [
      { name: 'Fournisseur Cali', region: 'Vallée du Cauca', contact: 'contact@cali-supplier.co' },
      { name: 'Hermitage Oils', region: 'Colombie', contact: 'info@hermitage-oils.com' },
    ],
  },
  'colombie-vii': {
    id: 7,
    name: 'Colombie VII',
    title: 'Endémique Rare',
    description: 'Hommage à Steiractinia Aspera, l\'endémique rare d\'Armenia. Un accord boisé résineux avec notes citrus et florales.',
    profile: 'Boisé résineux avec notes citrus et florales',
    intensity: 7,
    texture: 'Pierre',
    color: 'from-green-700 to-emerald-800',
    region: 'Armenia, Quindío',
    
    composition: [
      { name: 'Steiractinia Aspera', percentage: 40, role: 'Note dominante' },
      { name: 'Calycolpus Moritzianus', percentage: 30, role: 'Note de tête' },
      { name: 'Piper Aduncum', percentage: 20, role: 'Note de cœur' },
      { name: 'Fleur de Café', percentage: 10, role: 'Fixatif' },
    ],
    
    protocol: {
      extraction: 'Hydrodistillation de Steiractinia à 95°C',
      maceration: '3 semaines en alcool à 70°',
      maturation: '3 semaines à température ambiante',
      dilution: 'Dilution à 12% en alcool dénaturé',
      stability: 'Stable 10 mois à l\'abri de la lumière',
    },
    
    olfactiveNotes: {
      top: 'Citrus frais, herbes aromatiques, poivre blanc',
      heart: 'Bois léger, résine, notes florales',
      base: 'Bois de santal, ambre, musc blanc',
    },
    
    emotionalResonance: [
      'Énergisant et clarifiant',
      'Connexion à la nature rare',
      'Rareté et exclusivité',
      'Tonification naturelle',
    ],
    
    applications: [
      'Parfum de jour unisexe',
      'Diffusion atmosphérique toute l\'année',
      'Rituels de clarté et de connexion',
      'Accord boisé pour compositions',
    ],
    
    history: 'Steiractinia Aspera est une plante endémique extrêmement rare d\'Armenia. Cette recette rend hommage à la biodiversité unique de la région du Quindío.',
    
    suppliers: [
      { name: 'Fournisseur Armenia', region: 'Quindío', contact: 'contact@armenia-supplier.co' },
      { name: 'Hermitage Oils', region: 'Colombie', contact: 'info@hermitage-oils.com' },
    ],
  },
  'colombie-viii': {
    id: 8,
    name: 'Colombie VIII',
    title: 'Harmonie Complète',
    description: 'Fusion de toutes les molécules colombiennes en une harmonie parfaite. Un accord complexe et équilibré.',
    profile: 'Harmonie complexe de tous les profils colombiens',
    intensity: 8,
    texture: 'Air',
    color: 'from-slate-700 to-slate-900',
    region: 'Cali & Armenia',
    
    composition: [
      { name: 'Lippia Origanoides', percentage: 15, role: 'Note de tête' },
      { name: 'Turnera Diffusa', percentage: 15, role: 'Note de tête' },
      { name: 'Calycolpus Moritzianus', percentage: 15, role: 'Note de cœur' },
      { name: 'Piper Aduncum', percentage: 12, role: 'Note de cœur' },
      { name: 'Steiractinia Aspera', percentage: 12, role: 'Note de cœur' },
      { name: 'Café Geisha', percentage: 15, role: 'Note de fond' },
      { name: 'Fleur de Café', percentage: 10, role: 'Note de fond' },
      { name: 'Cacao Colombien', percentage: 6, role: 'Fixatif' },
    ],
    
    protocol: {
      extraction: 'Assemblage de 8 hydrodistillats et macérations',
      maceration: '4 semaines en alcool à 70°',
      maturation: '6 semaines à température ambiante',
      dilution: 'Dilution à 14% en alcool dénaturé',
      stability: 'Stable 14 mois à l\'abri de la lumière',
    },
    
    olfactiveNotes: {
      top: 'Épices, citrus, herbes fraîches, poivre',
      heart: 'Fleur d\'oranger, cacao, bois léger, vanille',
      base: 'Bois de santal, ambre, musc blanc, cacao',
    },
    
    emotionalResonance: [
      'Harmonie et équilibre',
      'Complexité et profondeur',
      'Connexion à la Colombie',
      'Transformation et unité',
    ],
    
    applications: [
      'Parfum signature unisexe',
      'Diffusion atmosphérique toute l\'année',
      'Rituels de célébration et d\'harmonie',
      'Accord maître pour compositions avancées',
    ],
    
    history: 'Colombie VIII est l\'aboutissement de la gamme Colombie, fusionnant toutes les molécules endémiques en une harmonie parfaite. C\'est la signature olfactive du projet PERFUMUM.',
    
    suppliers: [
      { name: 'Fournisseur Cali', region: 'Vallée du Cauca', contact: 'contact@cali-supplier.co' },
      { name: 'Fournisseur Armenia', region: 'Quindío', contact: 'contact@armenia-supplier.co' },
      { name: 'Hermitage Oils', region: 'Colombie', contact: 'info@hermitage-oils.com' },
    ],
  },
};

export default function RecetteColombie() {
  const [, params] = useRoute('/recette/colombie/:id');
  const [isFavorite, setIsFavorite] = useState(false);
  
  const recetteId = params?.id as string;
  const recette = recettesData[recetteId as keyof typeof recettesData];
  
  if (!recette) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-slate-900">Recette non trouvée</h1>
          <p className="mt-4 text-slate-600">La recette que vous recherchez n\'existe pas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Breadcrumbs />
      
      {/* Header */}
      <div className={`relative overflow-hidden bg-gradient-to-r ${recette.color} py-20 text-white`}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-4xl">🇨🇴</span>
            <h1 className="text-4xl font-bold">{recette.name}</h1>
          </div>
          <h2 className="mb-4 text-2xl font-semibold text-white/90">{recette.title}</h2>
          <p className="mb-6 max-w-2xl text-lg text-white/80">{recette.description}</p>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setIsFavorite(!isFavorite)}
            className="text-white hover:bg-white/20"
          >
            <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Ajouté aux favoris' : 'Ajouter aux favoris'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Composition */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Composition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recette.composition.map((ingredient, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{ingredient.name}</span>
                    <span className="text-amber-600">{ingredient.percentage}%</span>
                  </div>
                  <p className="text-xs text-slate-600">{ingredient.role}</p>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-700"
                      style={{ width: `${ingredient.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Profil & Caractéristiques */}
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Profil olfactif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-2 font-semibold text-slate-900">Note de tête</h3>
                  <p className="text-slate-600">{recette.olfactiveNotes.top}</p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-slate-900">Note de cœur</h3>
                  <p className="text-slate-600">{recette.olfactiveNotes.heart}</p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-slate-900">Note de fond</h3>
                  <p className="text-slate-600">{recette.olfactiveNotes.base}</p>
                </div>
              </CardContent>
            </Card>

            {/* Protocole */}
            <Card>
              <CardHeader>
                <CardTitle>Protocole de formulation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-1 font-semibold text-slate-900">Extraction</h3>
                  <p className="text-sm text-slate-600">{recette.protocol.extraction}</p>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-slate-900">Macération</h3>
                  <p className="text-sm text-slate-600">{recette.protocol.maceration}</p>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-slate-900">Maturation</h3>
                  <p className="text-sm text-slate-600">{recette.protocol.maturation}</p>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-slate-900">Dilution</h3>
                  <p className="text-sm text-slate-600">{recette.protocol.dilution}</p>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-slate-900">Stabilité</h3>
                  <p className="text-sm text-slate-600">{recette.protocol.stability}</p>
                </div>
              </CardContent>
            </Card>

            {/* Résonance émotionnelle */}
            <Card>
              <CardHeader>
                <CardTitle>Résonance émotionnelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recette.emotionalResonance.map((resonance, idx) => (
                    <Badge key={idx} variant="secondary">{resonance}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recette.applications.map((app, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-600" />
                      {app}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Historique */}
            <Card>
              <CardHeader>
                <CardTitle>Historique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{recette.history}</p>
              </CardContent>
            </Card>

            {/* Fournisseurs */}
            <Card>
              <CardHeader>
                <CardTitle>Fournisseurs partenaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recette.suppliers.map((supplier, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-200 p-4">
                    <h3 className="mb-1 font-semibold text-slate-900">{supplier.name}</h3>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {supplier.region}
                    </p>
                    <p className="mt-2 text-sm text-amber-600">{supplier.contact}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
