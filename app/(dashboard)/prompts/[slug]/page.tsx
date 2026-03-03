import { getPromptBySlugAction } from "@/lib/actions/prompts";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PromptEditor } from "@/components/prompts/prompt-editor";
import { VersionTimeline } from "@/components/prompts/version-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChevronLeft, 
  Settings, 
  History, 
  Beaker, 
  FileEdit,
  Globe,
  Lock,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PromptDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const prompt = await getPromptBySlugAction(slug);

  if (!prompt) {
    notFound();
  }

  const latestVersion = prompt.versions[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-pip-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-pip-500">
            <Link href="/prompts" className="hover:text-accent flex items-center transition-colors">
              <ChevronLeft className="h-3 w-3 mr-1" /> Proyectos
            </Link>
            <span>/</span>
            <span className="text-pip-300">{prompt.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{prompt.title}</h1>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 font-bold uppercase text-[10px]">
              v{latestVersion?.version || 1}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-pip-500">
            <span className="flex items-center gap-1">
              {prompt.is_public ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
              {prompt.is_public ? "Público" : "Privado"}
            </span>
            <span className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              {prompt.model.replace(/_/g, " ")}
            </span>
            <span className="flex items-center gap-1">
              Último cambio: {format(new Date(prompt.updated_at), "d 'de' MMMM, HH:mm", { locale: es })}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-pip-800 bg-pip-900/40 text-pip-300 hover:bg-pip-900">
            <ExternalLink className="mr-2 h-4 w-4" /> Playground
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
            Publicar v{ (latestVersion?.version || 0) + 1 }
          </Button>
        </div>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="bg-glass-950 border border-pip-800 p-1 mb-6">
          <TabsTrigger value="editor" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <FileEdit className="mr-2 h-4 w-4" /> Editor de Prompt
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <History className="mr-2 h-4 w-4" /> Historial (Versions)
          </TabsTrigger>
          <TabsTrigger value="eval" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <Beaker className="mr-2 h-4 w-4" /> Evaluaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="mt-0 focus-visible:outline-none">
          <PromptEditor 
            promptId={prompt.id} 
            initialContent={prompt.content} 
            initialSystemPrompt={prompt.system_prompt} 
          />
        </TabsContent>

        <TabsContent value="history" className="mt-0 focus-visible:outline-none">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="bg-glass-900/40 border-glass-700">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">Log de Versiones</CardTitle>
                </CardHeader>
                <CardContent>
                  <VersionTimeline versions={prompt.versions} />
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="bg-pip-900/20 border-pip-800">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-pip-300">Resumen Git-Style</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded bg-pip-950/50 border border-pip-800 space-y-2">
                    <p className="text-[10px] uppercase font-bold text-pip-500 tracking-wider">HEAD Commit</p>
                    <p className="text-xs font-mono text-accent">{latestVersion?.sha}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-pip-500 tracking-wider">Contribuyentes</p>
                    <div className="flex -space-x-2">
                      <div className="h-7 w-7 rounded-full border border-pip-950 bg-pip-800 flex items-center justify-center text-[10px] font-bold">AD</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="eval" className="mt-0 focus-visible:outline-none">
          <div className="flex flex-col items-center justify-center py-20 text-center bg-pip-900/10 border border-dashed border-pip-800 rounded-xl">
             <Beaker className="h-10 w-10 text-pip-700 mb-4" />
             <h3 className="text-lg font-semibold text-pip-300">Módulo de Evaluación Pendiente</h3>
             <p className="text-sm text-pip-500 max-w-sm mt-2">
               Configura un dataset para empezar a medir la calidad de esta versión contra casos reales.
             </p>
             <Button className="mt-6 bg-pip-800 hover:bg-pip-700 text-pip-200" disabled>
               Configurar Evaluación
             </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Re-using Button component specifically here if needed, but it's already in components/ui/
import { Button } from "@/components/ui/button";
