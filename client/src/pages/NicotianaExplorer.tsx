import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NicotianaPhylogeny } from '@/components/NicotianaPhylogeny';
import { NicotianaPhylogenyInteractive } from '@/components/NicotianaPhylogenyInteractive';

export default function NicotianaExplorer() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Explorateur Nicotiana</h1>
        <p className="text-lg text-muted-foreground">
          Explorez l'arbre phylogénétique complet du genre Nicotiana avec 60 espèces
        </p>
      </div>

      <Tabs defaultValue="phylogeny" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="phylogeny">Arbre Phylogénétique</TabsTrigger>
          <TabsTrigger value="species">Parcourir les Espèces</TabsTrigger>
        </TabsList>

        <TabsContent value="phylogeny" className="space-y-4">
          <NicotianaPhylogeny />
        </TabsContent>

        <TabsContent value="species" className="space-y-4">
          <NicotianaPhylogenyInteractive />
        </TabsContent>
      </Tabs>
    </div>
  );
}
