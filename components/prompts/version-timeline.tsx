"use client";

import { Badge } from "@/components/ui/badge";
import { User, Clock, GitBranch, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface VersionTimelineProps {
  versions: Array<{
    id: string;
    version: number;
    sha: string;
    change_note: string | null;
    created_at: Date;
    author: {
      email: string;
      profile?: {
        full_name: string;
      } | null;
    };
  }>;
}

export function VersionTimeline({ versions }: VersionTimelineProps) {
  return (
    <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-pip-800">
      {versions.map((v, i) => (
        <div key={v.id} className="relative pl-10">
          <div className={cn(
            "absolute left-0 top-1 h-6 w-6 rounded-full border-2 border-pip-950 flex items-center justify-center z-10",
            i === 0 ? "bg-accent" : "bg-pip-800"
          )}>
            <GitBranch className={cn("h-3 w-3", i === 0 ? "text-accent-foreground" : "text-pip-400")} />
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">v{v.version}</span>
                <Badge variant="outline" className="text-[9px] font-mono bg-pip-900 border-pip-800 text-pip-500">
                  {v.sha.substring(0, 7)}
                </Badge>
              </div>
              <time className="text-[10px] text-pip-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDistanceToNow(new Date(v.created_at), { addSuffix: true, locale: es })}
              </time>
            </div>
            
            <p className="text-sm text-pip-200 mt-1">{v.change_note || "Sin nota de cambios"}</p>
            
            <div className="flex items-center gap-3 mt-2 text-[10px] text-pip-500">
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {v.author.profile?.full_name || v.author.email}
              </div>
              <div className="flex items-center">
                <Terminal className="h-3 w-3 mr-1" />
                Commit inmovilizado
              </div>
            </div>
            
            {i === 0 && (
              <Badge className="w-fit mt-2 bg-accent/10 border-accent/20 text-accent text-[9px] font-bold">
                VERSIÓN ACTUAL (HEAD)
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
