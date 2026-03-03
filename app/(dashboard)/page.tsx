import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileCode2, 
  Database, 
  Beaker, 
  TrendingUp,
  Clock,
  ArrowUpRight
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Informativo</h1>
        <p className="text-pip-400 mt-1">Bienvenido a PromptVault Intelligence Platform, el núcleo de automatización de inteligencia.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Prompts Totales", value: "124", icon: FileCode2, trend: "+12%" },
          { title: "Datasets", value: "12", icon: Database, trend: "+2" },
          { title: "Evals Ejecutadas", value: "842", icon: Beaker, trend: "+156" },
          { title: "Score Promedio", value: "8.4", icon: TrendingUp, trend: "+0.2" },
        ].map((stat) => (
          <Card key={stat.title} className="bg-glass-900/40 border-glass-700 backdrop-blur-sm hover:border-accent/40 transition-colors group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-pip-300">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-accent flex items-center mt-1 font-medium">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {stat.trend} desde el mes pasado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-glass-900/40 border-glass-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="mt-1 h-2 w-2 rounded-full bg-accent ring-4 ring-accent/10 group-hover:scale-125 transition-transform" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-pip-100 group-hover:text-accent transition-colors">
                      Prompt &quot;Customer Support v2&quot; actualizado
                    </p>
                    <p className="text-xs text-pip-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Hace {i * 2} horas por Admin
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass-900/40 border-glass-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Evaluaciones Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: "Legal Analyzer - GPT-4o", progress: 75, status: "En progreso" },
                { name: "Sentiment Core - Claude 3.5", progress: 30, status: "En cola" }
              ].map((job, i) => (
                <div key={i} className="rounded-lg border border-pip-800 bg-pip-900/30 p-4 hover:border-pip-700 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-pip-200">{job.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      job.status === "En progreso" 
                        ? "bg-accent/10 text-accent border-accent/20" 
                        : "bg-pip-800/30 text-pip-400 border-pip-700"
                    }`}>
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-pip-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent transition-all duration-1000" 
                      style={{ width: `${job.progress}%` }} 
                    />
                  </div>
                  <div className="mt-2 text-[10px] text-pip-500 text-right">
                    {job.progress}% completado
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
