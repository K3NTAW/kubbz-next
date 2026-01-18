import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Trophy, Heart, Mail, MapPin, Instagram, Twitter, Facebook } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            Über uns
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Die Zürcher Kubb-Community – von Spielern für Spieler entwickelt
          </p>
        </div>

        {/* Mission Section */}
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 mb-12">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              Unsere Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
              Wir bringen Menschen zusammen, die ihre Leidenschaft für Kubb teilen. Unser Ziel ist es, eine
              lebendige Community zu schaffen, in der Spieler aller Niveaus willkommen sind – von Anfängern bis zu
              erfahrenen Turnierspielern.
            </p>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Aktive Spieler</CardTitle>
              <Users className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">400+</div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Registrierte Mitglieder</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Turniere</CardTitle>
              <Trophy className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">7+</div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Jahre Turnier-Erfahrung</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Community</CardTitle>
              <Calendar className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">2013</div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Seit wann wir spielen</p>
            </CardContent>
          </Card>
        </div>

        {/* History Section */}
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 mb-12">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-zinc-50">Unsere Geschichte</CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">
              Von informellen Treffen zu organisierten Turnieren
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">2013 – Die Anfänge</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Alles begann mit informellen Treffen im Park. Eine kleine Gruppe von Freunden entdeckte Kubb und
                  begann regelmässig zu spielen.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">2017 – Das erste Turnier</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Nach vier Jahren des gemeinsamen Spielens organisierten wir unser erstes offizielles Turnier. Es
                  war ein voller Erfolg und wurde zu einer jährlichen Tradition.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">Heute – Eine wachsende Community</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Heute zählen wir über 400 aktive Spieler und organisieren mehrere Turniere pro Jahr. Unsere
                  Community wächst stetig und wir freuen uns über jeden neuen Spieler!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-900 dark:text-zinc-50">Unsere Werte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">Gemeinschaft</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Wir glauben an die Kraft der Gemeinschaft und daran, dass Kubb Menschen zusammenbringt.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">Fairplay</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Fairplay steht im Mittelpunkt. Wir spielen um zu gewinnen, aber immer mit Respekt und
                  Sportsgeist.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">Inklusivität</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Jeder ist willkommen – unabhängig von Alter, Geschlecht oder Spielniveau.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-900 dark:text-zinc-50">Kontakt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">E-Mail</p>
                  <a
                    href="mailto:info@kubbz.ch"
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                  >
                    info@kubbz.ch
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">Standort</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Zürich, Schweiz</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <Link
                  href="#"
                  className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 border-zinc-700 text-white">
          <CardHeader>
            <CardTitle className="text-white">Werde Teil der Community</CardTitle>
            <CardDescription className="text-zinc-300">
              Melde dich an und nimm an unseren Turnieren teil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="bg-white text-zinc-900 px-6 py-3 rounded-lg font-medium hover:bg-zinc-100 transition-colors text-center"
              >
                Jetzt registrieren
              </Link>
              <Link
                href="/tournaments"
                className="bg-zinc-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-zinc-700 transition-colors text-center border border-zinc-700"
              >
                Turniere ansehen
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

