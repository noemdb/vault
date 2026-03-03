"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, RotateCcw } from "lucide-react";
import { commitVersionAction } from "@/lib/actions/prompts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PromptEditorProps {
  promptId: string;
  initialContent: string;
  initialSystemPrompt: string | null;
}

export function PromptEditor({ promptId, initialContent, initialSystemPrompt }: PromptEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [systemPrompt, setSystemPrompt] = useState(initialSystemPrompt || "");
  const [changeNote, setChangeNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const isDirty = content !== initialContent || systemPrompt !== (initialSystemPrompt || "");

  async function handleSave() {
    if (!changeNote) {
      toast.error("Por favor, introduce una nota de cambios para la versión.");
      return;
    }

    setIsSaving(true);
    try {
      await commitVersionAction(promptId, {
        content,
        system_prompt: systemPrompt,
        change_note: changeNote,
      });
      toast.success("Nueva versión guardada correctamente");
      setChangeNote("");
      router.refresh();
    } catch (error) {
      toast.error("Error al guardar la nueva versión");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setContent(initialContent);
    setSystemPrompt(initialSystemPrompt || "");
    setChangeNote("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-glass-900/40 border-glass-700">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-pip-300">System Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="min-h-[150px] bg-pip-900 border-pip-800 font-mono text-xs focus:border-accent/50"
              placeholder="Instrucciones de comportamiento del sistema..."
            />
          </CardContent>
        </Card>

        <Card className="bg-glass-900/40 border-glass-700">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-pip-300">User Prompt Template</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] bg-pip-900 border-pip-800 font-mono text-sm focus:border-accent/50"
              placeholder="Escribe tu prompt aquí... usa {{variable}} para parámetros dinámicos."
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-accent">Guardar Cambios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-pip-400">Nota de Cambios (Commit Message)</Label>
              <Input
                placeholder="Ej: Ajuste de tono, corrección de variables..."
                value={changeNote}
                onChange={(e) => setChangeNote(e.target.value)}
                className="bg-pip-900 border-pip-800"
              />
            </div>
            
            <div className="flex flex-col gap-2 pt-2">
              <Button 
                onClick={handleSave} 
                disabled={!isDirty || isSaving}
                className="bg-accent hover:bg-accent/90 text-accent-foreground w-full font-bold"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Commit Nueva Versión
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleReset} 
                disabled={!isDirty || isSaving}
                className="text-pip-500 hover:text-pip-200"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Descartar
              </Button>
            </div>
            {!isDirty && (
              <p className="text-[10px] text-pip-500 text-center italic">
                No hay cambios pendientes de commit.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-pip-900/20 border-pip-800">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-pip-300">Variables Detectadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[...content.matchAll(/\{\{(.*?)\}\}/g)].length > 0 ? (
                Array.from(new Set([...content.matchAll(/\{\{(.*?)\}\}/g)].map(m => m[1]))).map(variable => (
                  <div key={variable} className="px-2 py-1 rounded bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono font-bold">
                    {variable}
                  </div>
                ))
              ) : (
                <p className="text-xs text-pip-500">Ninguna variable detectada.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
