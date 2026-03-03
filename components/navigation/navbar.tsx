"use client";

import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-pip-800 bg-pip-950/50 px-8 backdrop-blur-sm">
      <div className="flex w-full max-w-md items-center gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pip-500" />
          <Input
            placeholder="Buscar prompts, datasets, modelos..."
            className="w-full bg-pip-900/30 border-pip-800 pl-10 focus:border-accent/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-pip-400 hover:text-pip-100">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-pip-900 border border-pip-800">
              <User className="h-5 w-5 text-pip-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-pip-900 border-pip-800 text-pip-100">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-pip-800" />
            <DropdownMenuItem className="hover:bg-pip-800 cursor-pointer">Perfil</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-pip-800 cursor-pointer">Ajustes</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-pip-800" />
            <DropdownMenuItem className="text-red-400 hover:bg-red-950/30 cursor-pointer">
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
