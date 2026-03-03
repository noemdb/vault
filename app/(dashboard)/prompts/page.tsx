import { getPromptsAction } from "@/lib/actions/prompts";
import { PromptCard } from "@/components/prompts/prompt-card";
import { CreatePromptDialog } from "@/components/prompts/create-prompt-dialog";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function PromptsPage() {
  const prompts = await getPromptsAction();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestión de Proyectos</h1>
          <p className="text-pip-400 mt-1">
            Administra, versiona y optimiza tus activos de inteligencia.
          </p>
        </div>
        <CreatePromptDialog />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pip-500" />
          <Input 
            placeholder="Buscar por título, descripción o etiquetas..." 
            className="bg-pip-900/30 border-pip-800 pl-10 focus:border-accent/40"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-pip-800 bg-pip-900/20 text-pip-300 hover:bg-pip-900">
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
          <div className="h-8 w-[1px] bg-pip-800 mx-2 hidden md:block" />
          <p className="text-xs text-pip-500 whitespace-nowrap">
            Mostrando <span className="text-pip-200 font-bold">{prompts.length}</span> proyectos
          </p>
        </div>
      </div>

      {prompts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-pip-800 p-20 text-center bg-pip-900/10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pip-900/50">
            <Search className="h-8 w-8 text-pip-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-pip-200">No se encontraron proyectos</h3>
          <p className="mt-2 text-sm text-pip-500 max-w-xs">
            Comienza creando tu primer proyecto de prompt para empezar a medir su calidad.
          </p>
          <div className="mt-6">
            <CreatePromptDialog />
          </div>
        </div>
      )}
    </div>
  );
}
