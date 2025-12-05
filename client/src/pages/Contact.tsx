import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Contact
              </h1>
              <p className="text-xl text-muted-foreground">
                Pour toute collaboration artistique, scientifique ou institutionnelle
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <CardTitle>Email</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <a
                    href="mailto:contact@perfumum.ch"
                    className="text-lg text-primary hover:underline"
                  >
                    contact@perfumum.ch
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle>Localisation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Laboratoire ABSORBE
                    <br />
                    Berne, Suisse
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Collaborations */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                Collaborations Ouvertes
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                ABSORBE / PERFUMUM est ouvert aux collaborations artistiques, scientifiques et institutionnelles. 
                Les projets peuvent prendre la forme d'installations, de performances, de recherches académiques, 
                ou de créations olfactives sur mesure.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
