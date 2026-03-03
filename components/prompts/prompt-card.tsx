"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { PromptStatus, AIModel, SharedPrompt } from "@/types/prisma";
import { cn } from "@/lib/utils";

interface PromptCardProps {
  prompt: SharedPrompt;
}

const statusColors: Record<PromptStatus, string> = {
  draft: "bg-pip-800 text-pip-300 border-pip-700",
  active: "bg-green-950/30 text-green-400 border-green-800",
  deprecated: "bg-yellow-950/30 text-yellow-500 border-yellow-800",
  archived: "bg-red-950/30 text-red-500 border-red-800",
  featured: "bg-accent/10 text-accent border-accent/20",
};

export function PromptCard({ prompt }: PromptCardProps) {
  const authorName = prompt.author.profile?.full_name || prompt.author.email;

  return (
    <Card className="group relative overflow-hidden bg-glass-900/40 border-glass-700 backdrop-blur-sm transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider font-bold", statusColors[prompt.status])}>
            {prompt.status}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-pip-500">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            <span>8.4</span>
          </div>
        </div>
        <CardTitle className="line-clamp-1 text-lg font-bold text-white group-hover:text-accent transition-colors">
          {prompt.title}
        </CardTitle>
        {prompt.category && (
          <span className="text-[10px] font-medium text-accent uppercase tracking-widest">
            {prompt.category.name}
          </span>
        )}
      </CardHeader>
      <CardContent className="pb-4">
        <p className="line-clamp-2 text-sm text-pip-400 min-h-[40px]">
          {prompt.description || "Sin descripción proporcionada."}
        </p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-pip-900/50 text-pip-300 border-pip-800 text-[10px]">
            {prompt.model.replace(/_/g, " ")}
          </Badge>
          <Badge variant="secondary" className="bg-pip-900/50 text-pip-300 border-pip-800 text-[10px]">
            {prompt._count.versions} {prompt._count.versions === 1 ? "versión" : "versiones"}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-glass-800 pt-4 text-xs text-pip-500">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-pip-800 flex items-center justify-center">
            <User className="h-3 w-3 text-pip-300" />
          </div>
          <span className="truncate max-w-[100px]">{authorName}</span>
        </div>
        <Link 
          href={`/prompts/${prompt.slug}`}
          className="flex items-center text-accent hover:underline font-medium"
        >
          Detalles <ChevronRight className="ml-1 h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  );
}
