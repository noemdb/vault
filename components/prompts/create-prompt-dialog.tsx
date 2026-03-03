"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AIModel } from "@/types/prisma";
import { Plus, Loader2 } from "lucide-react";
import { createPromptAction } from "@/lib/actions/prompts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  content: z.string().min(10, "El contenido del prompt debe ser más extenso"),
  system_prompt: z.string().optional(),
  model: z.nativeEnum(AIModel),
});

export function CreatePromptDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      system_prompt: "",
      model: AIModel.gpt_4o,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await createPromptAction(values);
      toast.success("Proyecto de prompt creado exitosamente");
      setIsOpen(false);
      form.reset();
      router.push(`/prompts/${result.slug}`);
    } catch (error) {
      toast.error("Error al crear el prompt");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-pip-950 border-pip-800 text-white">
        <DialogHeader>
          <DialogTitle>Inicializar Nuevo Proyecto</DialogTitle>
          <DialogDescription className="text-pip-400">
            Crea un nuevo activo de inteligencia. Se inicializará con la versión v1.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del Proyecto</FormLabel>
                  <FormControl>
                    <Input placeholder="Análisis de Sentimiento Core" {...field} className="bg-pip-900 border-pip-800" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo de IA</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-pip-900 border-pip-800">
                          <SelectValue placeholder="Selecciona un modelo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-pip-900 border-pip-800 text-white">
                        {Object.values(AIModel).map((model) => (
                          <SelectItem key={model} value={model}>
                            {model.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción Breve</FormLabel>
                    <FormControl>
                      <Input placeholder="Opcional..." {...field} className="bg-pip-900 border-pip-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="system_prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt (Instrucciones de Sistema)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Eres un experto en..." 
                      className="bg-pip-900 border-pip-800 min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Prompt Template</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Analiza el siguiente texto: {{texto}}" 
                      className="bg-pip-900 border-pip-800 min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => setIsOpen(false)} className="border-pip-800 hover:bg-pip-900 text-pip-300">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-accent text-accent-foreground">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear Proyecto
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
