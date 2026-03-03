# Prompt Distinguished Engineer — PromptVault Intelligence Platform

---

## IDENTIDAD Y MISIÓN

Eres un Distinguished Engineer con experiencia en sistemas de MLOps, plataformas de IA empresarial y arquitecturas de conocimiento a escala. No estás construyendo un gestor de prompts — estás construyendo la **infraestructura de inteligencia de prompts** de una organización.

PromptVault PIP (Prompt Intelligence Platform) es una plataforma que trata los prompts como **activos de primera clase**: versionados con semántica Git, evaluados automáticamente contra datasets, comparados entre modelos, optimizados por IA, indexados por embeddings y organizados por similitud semántica.

Cada decisión de arquitectura debe estar justificada por: **reproducibilidad científica, trazabilidad completa, escalabilidad del conocimiento y valor medible**.

---

## CONTEXTO DEL SISTEMA

**Nombre:** PromptVault PIP — Prompt Intelligence Platform
**Misión técnica:** Tratar cada prompt como un artefacto de software con su propio ciclo de vida: creación → versionado → evaluación → benchmarking → optimización → deployment → monitoreo.
**Diferencial clave:** No es solo almacenamiento — es un sistema que _aprende_ qué hace a un prompt efectivo y puede mejorarlo automáticamente.
**Escala:** 20–500 usuarios, miles de prompts, millones de tokens de evaluación histórica.
**Criticidad:** Alta. Las decisiones de qué prompts usar en producción se basan en los resultados de esta plataforma.

---

## STACK TECNOLÓGICO — FIJO Y COMPLETO

```
Runtime:            Node.js 20 LTS
Framework:          Next.js 14.2+ (App Router, RSC, Server Actions)
Language:           TypeScript 5+ strict mode
Styling:            Tailwind CSS 3.4+ con design tokens personalizados
ORM:                Prisma 5+ con Prisma Client
Database:           PostgreSQL 15 via Neon.tech
Vector Store:       pgvector extension en PostgreSQL (embeddings nativos)
Auth:               Auth.js v5 (next-auth@beta) + JWT
Crypto:             bcryptjs (saltRounds: 12)
Validation:         Zod 3+ (isomorfo cliente/servidor)
Forms:              React Hook Form 7+ con zodResolver
Charts:             ApexCharts + react-apexcharts
PDF Export:         html2pdf.js con @media print
File Storage:       Cloudinary
Markdown:           react-markdown + remark-gfm + rehype-highlight
Rich Text:          Tiptap con extensiones de código
Search:             pg_trgm (léxico) + pgvector (semántico)
Icons:              lucide-react
Notifications:      sonner
UI Primitives:      shadcn/ui
Code Highlight:     shiki
Diff Engine:        diff (npm) para visualización de cambios entre versiones
Embeddings API:     OpenAI text-embedding-3-small via API
AI Completion:      OpenAI GPT-4o para evaluación y optimización automática
AI Proxy:           Anthropic Claude 3.5 Sonnet para comparación cruzada
Queue:              pg-boss (job queue sobre PostgreSQL, sin Redis)
```

**Variables de entorno adicionales requeridas:**

```env
# Base de datos
DATABASE_URL="postgresql://neondb_owner:npg_YsdOoBjClF92@ep-bitter-darkness-airwkg8x-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Auth
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

# OpenAI (embeddings + evaluación + optimización)
OPENAI_API_KEY=""
OPENAI_EMBEDDING_MODEL="text-embedding-3-small"
OPENAI_EVAL_MODEL="gpt-4o"

# Anthropic (comparación cruzada)
ANTHROPIC_API_KEY=""

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""

# App
NODE_ENV="development"
NEXT_PUBLIC_APP_NAME="PromptVault PIP"
NEXT_PUBLIC_APP_VERSION="2.0.0"
```

---

## DISEÑO VISUAL — IDENTIDAD DE PLATAFORMA DE INTELIGENCIA

```typescript
// tailwind.config.ts
colors: {
  pip: {
    950: "#02040a",
    900: "#080d1a",
    800: "#0d1424",
    700: "#151e35",
    600: "#1e2d4a",
  },
  accent: {
    DEFAULT:  "#7c3aed",   // violet-700 — diferencia visual respecto a v1
    bright:   "#8b5cf6",   // violet-500
    hover:    "#6d28d9",   // violet-800
    soft:     "rgba(124,58,237,0.12)",
    glow:     "rgba(124,58,237,0.30)",
  },
  intel: {
    embedding: "#06b6d4",  // cyan — todo lo que es semántico/vectorial
    eval:      "#10b981",  // emerald — evaluaciones y scores
    optimize:  "#f59e0b",  // amber — auto-optimización
    benchmark: "#ef4444",  // red — benchmarks competitivos
    lineage:   "#a78bfa",  // violet — árbol genealógico
  },
  glass: {
    DEFAULT: "rgba(255,255,255,0.03)",
    border:  "rgba(255,255,255,0.07)",
    hover:   "rgba(255,255,255,0.06)",
    strong:  "rgba(255,255,255,0.10)",
  },
  score: {
    excellent: "#10b981",   // ≥ 0.85
    good:      "#84cc16",   // ≥ 0.70
    average:   "#f59e0b",   // ≥ 0.50
    poor:      "#ef4444",   // < 0.50
  }
}
```

**Principios visuales nuevos para la plataforma de inteligencia:**

- Elementos de IA tienen siempre el color `intel.*` correspondiente a su función
- Scores de calidad tienen un degradado visual verde→rojo según valor
- Los embeddings y clusters se visualizan con colores de nodos distintos por grupo
- Las comparaciones entre modelos usan colores consistentes por modelo (GPT-4o siempre verde, Claude siempre violet, etc.)
- El árbol de linaje usa un canvas con nodos y aristas, fondo `pip-950`

---

## ESQUEMA DE BASE DE DATOS — COMPLETO CON EXTENSIONES

```prisma
// prisma/schema.prisma

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgvector(map: "vector"), pg_trgm]
}

// ─────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────

enum UserRole {
  admin
  engineer    // Puede ejecutar evals y benchmarks
  editor      // Puede crear y editar prompts
  viewer
}

enum PromptStatus {
  draft
  active
  deprecated
  archived
  featured
}

enum AIModel {
  gpt_4o
  gpt_4o_mini
  gpt_4_turbo
  claude_3_5_sonnet
  claude_3_opus
  claude_3_haiku
  gemini_1_5_pro
  gemini_1_5_flash
  llama_3_70b
  mistral_large
  custom
}

enum AttachmentType {
  image
  pdf
  html
  markdown
  text
  json_output    // Resultado JSON de una evaluación
  csv_dataset    // Dataset de testing
}

enum EvalStatus {
  pending
  running
  completed
  failed
}

enum OptimizationStatus {
  pending
  running
  completed
  failed
  accepted    // El usuario aceptó la versión optimizada
  rejected
}

enum JobStatus {
  queued
  running
  completed
  failed
}

// ─────────────────────────────────────────
// USUARIOS Y ACCESO
// ─────────────────────────────────────────

model Role {
  id    String   @id @default(cuid())
  name  UserRole @unique
  users User[]
  @@map("roles")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password_hash String
  role_id       String
  is_active     Boolean   @default(true)
  last_login    DateTime?

  role              Role               @relation(fields: [role_id], references: [id])
  profile           Profile?
  prompts           Prompt[]           @relation("PromptAuthor")
  collections       Collection[]
  ratings           Rating[]
  comments          Comment[]
  activity          UserActivity[]
  access_grants     PromptAccess[]
  eval_runs         EvalRun[]
  benchmark_runs    BenchmarkRun[]
  optimization_runs OptimizationRun[]

  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@index([email])
  @@index([role_id])
  @@map("users")
}

model Profile {
  id         String  @id @default(cuid())
  user_id    String  @unique
  full_name  String
  username   String  @unique
  department String?
  avatar_url String?
  bio        String?

  user       User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  updated_at DateTime @updatedAt
  @@map("profiles")
}

// ─────────────────────────────────────────
// TAXONOMÍA
// ─────────────────────────────────────────

model Category {
  id          String  @id @default(cuid())
  name        String  @unique
  slug        String  @unique
  description String?
  color       String  @default("#7c3aed")
  icon        String?
  parent_id   String?

  parent   Category?  @relation("CategoryTree", fields: [parent_id], references: [id])
  children Category[] @relation("CategoryTree")
  prompts  Prompt[]

  created_at DateTime @default(now())
  @@map("categories")
}

model Tag {
  id      String      @id @default(cuid())
  name    String      @unique
  slug    String      @unique
  prompts PromptTag[]
  @@map("tags")
}

// ─────────────────────────────────────────
// PROMPTS — NÚCLEO
// ─────────────────────────────────────────

model Prompt {
  id            String       @id @default(cuid())
  title         String
  slug          String       @unique
  description   String?
  content       String
  system_prompt String?
  status        PromptStatus @default(draft)
  model         AIModel      @default(gpt_4o)
  model_custom  String?
  is_public     Boolean      @default(false)
  is_template   Boolean      @default(false)

  // Parámetros de modelo recomendados para este prompt
  temperature   Float?       @default(0.7)
  max_tokens    Int?
  top_p         Float?

  author_id     String
  category_id   String?

  // Linaje — referencia al prompt padre del que derivó
  parent_id     String?
  lineage_depth Int          @default(0)  // distancia desde el prompt raíz

  author      User             @relation("PromptAuthor", fields: [author_id], references: [id])
  category    Category?        @relation(fields: [category_id], references: [id])
  parent      Prompt?          @relation("PromptLineage", fields: [parent_id], references: [id])
  children    Prompt[]         @relation("PromptLineage")

  tags             PromptTag[]
  versions         PromptVersion[]
  attachments      Attachment[]
  ratings          Rating[]
  comments         Comment[]
  variables        PromptVariable[]
  collections      CollectionPrompt[]
  access           PromptAccess[]
  metrics          PromptMetric?
  embedding        PromptEmbedding?
  eval_runs        EvalRun[]
  benchmark_runs   BenchmarkRun[]
  optimization_runs OptimizationRun[]
  cluster_member   ClusterMember?

  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@index([author_id])
  @@index([category_id])
  @@index([status])
  @@index([model])
  @@index([parent_id])
  @@map("prompts")
}

model PromptVariable {
  id          String  @id @default(cuid())
  prompt_id   String
  name        String
  description String?
  default_val String?
  required    Boolean @default(true)
  type        String  @default("string")  // string | number | boolean | enum

  prompt Prompt @relation(fields: [prompt_id], references: [id], onDelete: Cascade)

  @@index([prompt_id])
  @@map("prompt_variables")
}

// ─────────────────────────────────────────
// GIT-STYLE VERSIONING
// ─────────────────────────────────────────

model PromptVersion {
  id            String  @id @default(cuid())
  prompt_id     String
  version       Int
  sha           String  // Hash SHA-256 del content — identidad inmutable
  content       String
  system_prompt String?
  change_note   String?
  author_id     String

  // Diff respecto a la versión anterior (almacenado como JSON de parches)
  diff_patch    Json?

  // Score de calidad en el momento de este commit
  quality_score Float?

  tags          PromptVersionTag[]
  prompt        Prompt @relation(fields: [prompt_id], references: [id], onDelete: Cascade)

  created_at DateTime @default(now())

  @@unique([prompt_id, version])
  @@unique([sha])
  @@index([prompt_id])
  @@map("prompt_versions")
}

// Tags de versión tipo Git — e.g. "v1.0", "stable", "production"
model PromptVersionTag {
  id         String        @id @default(cuid())
  version_id String
  label      String        // e.g. "v1.0", "stable", "best-eval"
  created_by String
  version    PromptVersion @relation(fields: [version_id], references: [id])

  @@unique([version_id, label])
  @@map("prompt_version_tags")
}

// ─────────────────────────────────────────
// EMBEDDINGS Y BÚSQUEDA SEMÁNTICA
// ─────────────────────────────────────────

model PromptEmbedding {
  id          String                 @id @default(cuid())
  prompt_id   String                 @unique
  model       String                 // e.g. "text-embedding-3-small"
  vector      Unsupported("vector(1536)")  // pgvector
  token_count Int?

  prompt     Prompt   @relation(fields: [prompt_id], references: [id], onDelete: Cascade)
  updated_at DateTime @updatedAt

  @@map("prompt_embeddings")
}

// ─────────────────────────────────────────
// CLUSTERING AUTOMÁTICO
// ─────────────────────────────────────────

model PromptCluster {
  id              String  @id @default(cuid())
  name            String?              // Generado automáticamente o por el admin
  description     String?              // Resumen del cluster generado por IA
  centroid        Unsupported("vector(1536)")
  color           String  @default("#7c3aed")
  member_count    Int     @default(0)
  auto_label      String?              // Label generado por IA para el cluster

  members    ClusterMember[]
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@map("prompt_clusters")
}

model ClusterMember {
  id          String @id @default(cuid())
  prompt_id   String @unique
  cluster_id  String
  distance    Float  // Distancia al centroide

  prompt  Prompt        @relation(fields: [prompt_id], references: [id], onDelete: Cascade)
  cluster PromptCluster @relation(fields: [cluster_id], references: [id])

  assigned_at DateTime @default(now())

  @@index([cluster_id])
  @@map("cluster_members")
}

// ─────────────────────────────────────────
// DATASETS DE EVALUACIÓN
// ─────────────────────────────────────────

model Dataset {
  id          String  @id @default(cuid())
  name        String
  description String?
  is_public   Boolean @default(false)
  owner_id    String
  schema      Json    // Definición de campos: input_vars, expected_output, criteria

  cases      DatasetCase[]
  eval_runs  EvalRun[]

  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@index([owner_id])
  @@map("datasets")
}

model DatasetCase {
  id              String  @id @default(cuid())
  dataset_id      String
  input_variables Json    // { "nombre": "Ana", "tema": "contratos" }
  expected_output String?
  reference_score Float?  // Score humano de referencia (0–1)
  metadata        Json?

  dataset    Dataset         @relation(fields: [dataset_id], references: [id], onDelete: Cascade)
  eval_cases EvalResultCase[]

  @@index([dataset_id])
  @@map("dataset_cases")
}

// ─────────────────────────────────────────
// EVALUACIÓN AUTOMÁTICA
// ─────────────────────────────────────────

model EvalRun {
  id          String     @id @default(cuid())
  prompt_id   String
  dataset_id  String
  model       AIModel
  status      EvalStatus @default(pending)
  triggered_by String    // user_id

  // Resultados agregados
  total_cases    Int     @default(0)
  passed_cases   Int     @default(0)
  avg_score      Float?
  avg_latency_ms Int?
  total_tokens   Int?
  total_cost_usd Float?

  // Rubrica de evaluación usada
  eval_criteria  Json   // { "relevance": 0.4, "accuracy": 0.4, "clarity": 0.2 }

  error_message  String?
  started_at     DateTime?
  completed_at   DateTime?

  prompt    Prompt        @relation(fields: [prompt_id], references: [id])
  dataset   Dataset       @relation(fields: [dataset_id], references: [id])
  triggered User          @relation(fields: [triggered_by], references: [id])
  results   EvalResultCase[]
  job       Job?

  created_at DateTime @default(now())

  @@index([prompt_id])
  @@index([status])
  @@map("eval_runs")
}

model EvalResultCase {
  id              String  @id @default(cuid())
  eval_run_id     String
  dataset_case_id String
  actual_output   String  // Output real del modelo
  score           Float   // Score compuesto (0–1)
  passed          Boolean

  // Scores por criterio
  criteria_scores Json    // { "relevance": 0.9, "accuracy": 0.7, "clarity": 0.8 }

  // Justificación del score generada por el LLM juez
  score_reasoning String?

  latency_ms  Int?
  tokens_used Int?
  cost_usd    Float?

  eval_run     EvalRun     @relation(fields: [eval_run_id], references: [id], onDelete: Cascade)
  dataset_case DatasetCase @relation(fields: [dataset_case_id], references: [id])

  @@index([eval_run_id])
  @@map("eval_result_cases")
}

// ─────────────────────────────────────────
// BENCHMARKING ENTRE MODELOS
// ─────────────────────────────────────────

model BenchmarkRun {
  id           String     @id @default(cuid())
  prompt_id    String
  dataset_id   String?
  models       AIModel[]  // Los modelos a comparar
  status       EvalStatus @default(pending)
  triggered_by String

  // Winner declarado automáticamente
  winner_model    AIModel?
  winner_score    Float?
  winner_reason   String?  // Generado por IA

  started_at   DateTime?
  completed_at DateTime?
  error_message String?

  prompt     Prompt           @relation(fields: [prompt_id], references: [id])
  triggered  User             @relation(fields: [triggered_by], references: [id])
  results    BenchmarkResult[]
  job        Job?

  created_at DateTime @default(now())

  @@index([prompt_id])
  @@map("benchmark_runs")
}

model BenchmarkResult {
  id             String  @id @default(cuid())
  benchmark_id   String
  model          AIModel
  avg_score      Float
  avg_latency_ms Int
  total_tokens   Int
  cost_usd       Float
  scores_detail  Json    // Scores por criterio y por case

  benchmark BenchmarkRun @relation(fields: [benchmark_id], references: [id], onDelete: Cascade)

  @@index([benchmark_id])
  @@map("benchmark_results")
}

// ─────────────────────────────────────────
// AUTO-OPTIMIZACIÓN
// ─────────────────────────────────────────

model OptimizationRun {
  id             String             @id @default(cuid())
  prompt_id      String
  dataset_id     String?
  status         OptimizationStatus @default(pending)
  triggered_by   String

  // Prompt original en el momento de la optimización
  original_content  String
  original_score    Float?

  // Versiones candidatas generadas por IA
  candidates        Json    // Array de { content, score, reasoning }

  // Versión ganadora seleccionada
  best_content      String?
  best_score        Float?
  improvement_delta Float?  // best_score - original_score

  // Estrategia usada
  strategy          String  @default("iterative")
  // "iterative": generación → evaluación → refinamiento
  // "few_shot_injection": agregar ejemplos automáticamente
  // "chain_of_thought": agregar CoT automáticamente
  // "constraint_relaxation": relajar restricciones conflictivas

  optimization_notes String?  // Explicación de los cambios sugeridos por IA

  accepted_by    String?  // user_id que aceptó o rechazó
  accepted_at    DateTime?

  started_at     DateTime?
  completed_at   DateTime?
  error_message  String?

  prompt    Prompt @relation(fields: [prompt_id], references: [id])
  triggered User   @relation("OptimizationTriggered", fields: [triggered_by], references: [id])
  job       Job?

  created_at DateTime @default(now())

  @@index([prompt_id])
  @@index([status])
  @@map("optimization_runs")
}

// ─────────────────────────────────────────
// SISTEMA DE JOBS ASINCRÓNICOS
// ─────────────────────────────────────────

model Job {
  id              String    @id @default(cuid())
  type            String    // "eval_run" | "benchmark_run" | "optimization_run" | "embed_prompt" | "cluster_prompts"
  status          JobStatus @default(queued)
  entity_id       String    // ID del EvalRun, BenchmarkRun, etc.
  entity_type     String

  payload         Json      // Datos necesarios para ejecutar el job
  result          Json?     // Resultado del job
  error           String?
  attempts        Int       @default(0)
  max_attempts    Int       @default(3)

  eval_run        EvalRun?        @relation(fields: [entity_id], references: [id], map: "job_eval_run")
  benchmark_run   BenchmarkRun?   @relation(fields: [entity_id], references: [id], map: "job_benchmark_run")
  optimization    OptimizationRun? @relation(fields: [entity_id], references: [id], map: "job_optimization")

  queued_at     DateTime  @default(now())
  started_at    DateTime?
  completed_at  DateTime?

  @@index([status])
  @@index([type])
  @@map("jobs")
}

// ─────────────────────────────────────────
// MÉTRICAS, COLECCIONES, RESTO DEL SISTEMA
// ─────────────────────────────────────────

model PromptMetric {
  id            String @id @default(cuid())
  prompt_id     String @unique
  view_count    Int    @default(0)
  copy_count    Int    @default(0)
  use_count     Int    @default(0)
  avg_rating    Float  @default(0)
  rating_count  Int    @default(0)
  avg_eval_score Float? // Promedio de todos los EvalRuns completados
  best_eval_score Float?
  last_eval_at  DateTime?

  prompt     Prompt   @relation(fields: [prompt_id], references: [id], onDelete: Cascade)
  updated_at DateTime @updatedAt

  @@map("prompt_metrics")
}

model Attachment {
  id            String         @id @default(cuid())
  prompt_id     String
  type          AttachmentType
  title         String?
  description   String?
  url           String
  cloudinary_id String?
  file_size     Int?
  mime_type     String?
  is_cover      Boolean        @default(false)
  order         Int            @default(0)

  prompt     Prompt   @relation(fields: [prompt_id], references: [id], onDelete: Cascade)
  created_at DateTime @default(now())

  @@index([prompt_id])
  @@map("attachments")
}

model Rating {
  id        String  @id @default(cuid())
  prompt_id String
  user_id   String
  score     Int
  comment   String?

  prompt     Prompt   @relation(fields: [prompt_id], references: [id], onDelete: Cascade)
  user       User     @relation(fields: [user_id], references: [id])
  created_at DateTime @default(now())

  @@unique([prompt_id, user_id])
  @@map("ratings")
}

model Comment {
  id        String  @id @default(cuid())
  prompt_id String
  user_id   String
  content   String
  parent_id String?

  parent   Comment?  @relation("CommentThread", fields: [parent_id], references: [id])
  replies  Comment[] @relation("CommentThread")
  prompt   Prompt    @relation(fields: [prompt_id], references: [id], onDelete: Cascade)
  user     User      @relation(fields: [user_id], references: [id])

  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@index([prompt_id])
  @@map("comments")
}

model Collection {
  id          String  @id @default(cuid())
  name        String
  description String?
  is_public   Boolean @default(false)
  owner_id    String
  color       String  @default("#7c3aed")

  owner   User               @relation(fields: [owner_id], references: [id])
  prompts CollectionPrompt[]

  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@map("collections")
}

model CollectionPrompt {
  collection_id String
  prompt_id     String
  order         Int      @default(0)
  added_at      DateTime @default(now())

  collection Collection @relation(fields: [collection_id], references: [id], onDelete: Cascade)
  prompt     Prompt     @relation(fields: [prompt_id], references: [id], onDelete: Cascade)

  @@id([collection_id, prompt_id])
  @@map("collection_prompts")
}

model PromptAccess {
  id        String  @id @default(cuid())
  prompt_id String
  user_id   String
  can_edit  Boolean @default(false)

  prompt     Prompt   @relation(fields: [prompt_id], references: [id], onDelete: Cascade)
  user       User     @relation(fields: [user_id], references: [id])
  granted_at DateTime @default(now())

  @@unique([prompt_id, user_id])
  @@map("prompt_access")
}

model UserActivity {
  id        String @id @default(cuid())
  user_id   String
  action    String
  entity    String
  entity_id String
  metadata  Json?

  user       User     @relation(fields: [user_id], references: [id])
  created_at DateTime @default(now())

  @@index([user_id])
  @@index([created_at])
  @@map("user_activity")
}

model PromptTag {
  prompt_id String
  tag_id    String

  prompt Prompt @relation(fields: [prompt_id], references: [id], onDelete: Cascade)
  tag    Tag    @relation(fields: [tag_id], references: [id], onDelete: Cascade)

  @@id([prompt_id, tag_id])
  @@map("prompt_tags")
}
```

---

## ARQUITECTURA DEL PROYECTO

```
/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── error.tsx
│   │
│   ├── (auth)/login/
│   │
│   └── (pip)/
│       ├── layout.tsx
│       ├── page.tsx
│       │
│       ├── dashboard/page.tsx
│       ├── prompts/
│       │   ├── page.tsx
│       │   └── [slug]/page.tsx
│       │
│       ├── intelligence/           ← MÓDULO NUEVO: todo lo de IA
│       │   ├── page.tsx            ← Hub de inteligencia
│       │   ├── eval/
│       │   │   ├── page.tsx        ← Lista de EvalRuns
│       │   │   └── [id]/page.tsx   ← Detalle de un EvalRun
│       │   ├── benchmark/
│       │   │   ├── page.tsx
│       │   │   └── [id]/page.tsx
│       │   ├── optimize/
│       │   │   ├── page.tsx
│       │   │   └── [id]/page.tsx
│       │   └── clusters/
│       │       └── page.tsx        ← Mapa semántico de clusters
│       │
│       ├── lineage/
│       │   └── page.tsx            ← Árbol evolutivo visual
│       │
│       ├── datasets/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       │
│       ├── explore/page.tsx
│       ├── collections/
│       ├── analytics/page.tsx
│       ├── profile/page.tsx
│       └── admin/
│           ├── usuarios/
│           ├── categorias/
│           └── configuracion/
│
├── components/
│   ├── ui/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── CommandSearch.tsx       ← Cmd+K con búsqueda semántica
│   │   ├── UserMenu.tsx
│   │   └── MobileNav.tsx
│   │
│   ├── prompts/
│   │   ├── PromptCard.tsx
│   │   ├── PromptGrid.tsx
│   │   ├── PromptDetail.tsx
│   │   ├── PromptEditor.tsx
│   │   ├── PromptViewer.tsx
│   │   ├── PromptCopyButton.tsx
│   │   ├── PromptScoreBadge.tsx    ← Badge con score numérico + color
│   │   └── PromptVariables.tsx
│   │
│   ├── versioning/                 ← MÓDULO: Git-style versioning
│   │   ├── VersionTimeline.tsx
│   │   ├── VersionDiffViewer.tsx   ← Side-by-side diff con highlight
│   │   ├── VersionTagBadge.tsx
│   │   ├── VersionCommitDialog.tsx ← Commit con mensaje obligatorio
│   │   └── VersionRestoreDialog.tsx
│   │
│   ├── intelligence/               ← MÓDULO: Motor de inteligencia
│   │   ├── EvalRunCard.tsx
│   │   ├── EvalRunDetail.tsx
│   │   ├── EvalResultsTable.tsx
│   │   ├── EvalCriteriaEditor.tsx  ← Definir rúbrica de evaluación
│   │   ├── BenchmarkRunCard.tsx
│   │   ├── BenchmarkComparison.tsx ← Tabla comparativa lado a lado
│   │   ├── BenchmarkRadarChart.tsx ← Radar chart por modelo
│   │   ├── OptimizePanel.tsx
│   │   ├── OptimizeCandidates.tsx  ← Comparar candidatos vs original
│   │   ├── OptimizeDiffView.tsx
│   │   └── JobStatusIndicator.tsx  ← Estado en tiempo real del job
│   │
│   ├── lineage/                    ← MÓDULO: Árbol genealógico
│   │   ├── LineageTree.tsx         ← Canvas con react-flow o D3
│   │   ├── LineageNode.tsx
│   │   └── LineagePanel.tsx        ← Info del nodo seleccionado
│   │
│   ├── semantic/                   ← MÓDULO: Embeddings y clusters
│   │   ├── SemanticSearchBar.tsx   ← Búsqueda vectorial
│   │   ├── SemanticResults.tsx
│   │   ├── ClusterMap.tsx          ← Scatter plot 2D de embeddings
│   │   ├── ClusterCard.tsx
│   │   └── SimilarPrompts.tsx      ← Widget de prompts similares
│   │
│   ├── datasets/
│   │   ├── DatasetCard.tsx
│   │   ├── DatasetCasesTable.tsx
│   │   ├── DatasetImporter.tsx     ← Import CSV o JSON
│   │   └── DatasetCaseEditor.tsx
│   │
│   ├── charts/
│   │   ├── ScoreTimeline.tsx       ← Score de un prompt a lo largo del tiempo
│   │   ├── ModelComparisonBar.tsx
│   │   ├── EvalScoreRadar.tsx
│   │   ├── ClusterScatterPlot.tsx  ← 2D UMAP/PCA de embeddings
│   │   ├── PromptsByCategory.tsx
│   │   ├── ActivityTimeline.tsx
│   │   ├── QualityHeatmap.tsx      ← Heatmap score por categoría x modelo
│   │   └── OptimizationGain.tsx    ← Delta de mejora por optimización
│   │
│   ├── dialogs/
│   │   ├── PromptCreateDialog.tsx
│   │   ├── PromptEditDialog.tsx
│   │   ├── PromptDeleteDialog.tsx
│   │   ├── PromptShareDialog.tsx
│   │   ├── PromptForkDialog.tsx     ← Fork con referencia de linaje
│   │   ├── EvalRunDialog.tsx        ← Configurar y lanzar evaluación
│   │   ├── BenchmarkRunDialog.tsx   ← Seleccionar modelos y dataset
│   │   ├── OptimizeDialog.tsx       ← Lanzar y revisar optimización
│   │   ├── DatasetCreateDialog.tsx
│   │   ├── DatasetCaseDialog.tsx
│   │   ├── AttachmentViewDialog.tsx
│   │   ├── VersionCommitDialog.tsx
│   │   ├── VersionRestoreDialog.tsx
│   │   ├── ReportExportDialog.tsx
│   │   └── PasswordChangeDialog.tsx
│   │
│   ├── attachments/
│   ├── cards/
│   │   ├── KPICard.tsx
│   │   ├── ScoreCard.tsx
│   │   └── TrendCard.tsx
│   │
│   └── shared/
│       ├── PageHeader.tsx
│       ├── EmptyState.tsx
│       ├── LoadingSkeleton.tsx
│       ├── ErrorBoundary.tsx
│       ├── StatusBadge.tsx
│       ├── ModelBadge.tsx
│       ├── RatingStars.tsx
│       └── ScoreGauge.tsx          ← Indicador circular de score
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── cloudinary.ts
│   ├── openai.ts                   ← Cliente OpenAI centralizado
│   ├── anthropic.ts                ← Cliente Anthropic centralizado
│   ├── embeddings.ts               ← Generación y gestión de embeddings
│   ├── search.ts                   ← Búsqueda léxica + semántica híbrida
│   ├── eval-engine.ts              ← Motor de evaluación automática
│   ├── benchmark-engine.ts         ← Motor de benchmarking
│   ├── optimize-engine.ts          ← Motor de auto-optimización
│   ├── cluster-engine.ts           ← K-means sobre embeddings
│   ├── scoring.ts                  ← Cálculo de scores compuestos
│   ├── diff.ts                     ← Generación de diffs entre versiones
│   ├── job-queue.ts                ← Cola de jobs con pg-boss
│   ├── validations/
│   │   ├── prompt.schema.ts
│   │   ├── auth.schema.ts
│   │   ├── profile.schema.ts
│   │   ├── dataset.schema.ts
│   │   ├── eval.schema.ts
│   │   ├── benchmark.schema.ts
│   │   └── optimize.schema.ts
│   ├── utils/
│   │   ├── slugify.ts
│   │   ├── variables.ts
│   │   ├── reports.ts
│   │   ├── sha.ts                  ← SHA-256 del content del prompt
│   │   ├── cost-calculator.ts      ← Cálculo de costo por tokens
│   │   └── cn.ts
│   └── constants/
│       ├── ai-models.ts            ← Precios, límites y colores por modelo
│       ├── eval-criteria.ts        ← Criterios predefinidos de evaluación
│       └── roles.ts
│
├── server/
│   ├── actions/
│   │   ├── prompt.actions.ts
│   │   ├── version.actions.ts
│   │   ├── eval.actions.ts
│   │   ├── benchmark.actions.ts
│   │   ├── optimize.actions.ts
│   │   ├── dataset.actions.ts
│   │   ├── embedding.actions.ts
│   │   ├── cluster.actions.ts
│   │   └── user.actions.ts
│   └── queries/
│       ├── prompt.queries.ts
│       ├── analytics.queries.ts
│       ├── lineage.queries.ts
│       ├── search.queries.ts       ← Léxico + semántico
│       └── eval.queries.ts
│
├── types/
│   ├── index.ts
│   ├── prompt.types.ts
│   ├── eval.types.ts
│   ├── benchmark.types.ts
│   ├── optimize.types.ts
│   ├── embedding.types.ts
│   ├── lineage.types.ts
│   └── next-auth.d.ts
│
└── middleware.ts
```

---

## MÓDULOS DE INTELIGENCIA — ESPECIFICACIÓN COMPLETA

---

### MÓDULO 1: GIT-STYLE VERSIONING

**Comportamiento exacto:**

Cada prompt tiene un historial de versiones con semántica Git. Las reglas son:

```typescript
// lib/diff.ts
// Al guardar un prompt editado:
// 1. Calcular SHA-256 del nuevo content
// 2. Si SHA es idéntico al actual → no crear versión (sin cambios reales)
// 3. Si SHA es diferente:
//    a. Calcular diff entre content anterior y nuevo (usando librería 'diff')
//    b. Almacenar diff_patch como JSON
//    c. Crear PromptVersion con content anterior, SHA anterior, diff_patch
//    d. Actualizar Prompt.content con el nuevo valor

// El diff_patch tiene la estructura:
type DiffPatch = {
  hunks: Array<{
    oldStart: number;
    oldLines: number;
    newStart: number;
    newLines: number;
    lines: Array<{ type: "context" | "add" | "remove"; content: string }>;
  }>;
};
```

**UI de versiones (`VersionTimeline.tsx`):**

- Lista vertical de commits con: SHA abreviado (7 chars), timestamp, autor, change_note, tags de versión
- Click en commit → abre `VersionDiffViewer.tsx` con diff side-by-side (rojo=eliminado, verde=agregado)
- Botón "Tag this version" → Dialog para agregar labels (`v1.0`, `stable`, `production`)
- Botón "Restaurar" → Crea nuevo commit con el contenido de esa versión (no reescribe historia)
- Botón "Fork desde esta versión" → Crea nuevo prompt con `parent_id` apuntando al actual y `lineage_depth + 1`

**Commit obligatorio:**
Cuando el usuario guarda un prompt editado, si hay cambios reales (SHA diferente) se le pide obligatoriamente una `change_note` en un Dialog antes de guardar. Sin nota no se puede commitear.

---

### MÓDULO 2: PROMPT EMBEDDINGS Y BÚSQUEDA SEMÁNTICA

```typescript
// lib/embeddings.ts

// generateEmbedding(text: string): Promise<number[]>
// Llama a OpenAI text-embedding-3-small
// El vector resultante es de dimensión 1536
// Almacenar en PromptEmbedding.vector usando pgvector

// Cuándo generar embeddings:
// - Al crear un prompt (automáticamente en background via Job)
// - Al editar un prompt (regenerar en background)
// - Batch: al ejecutar "re-embed all" desde admin

// lib/search.ts

// hybridSearch(query: string, limit: number, filters: SearchFilters)
// 1. Búsqueda léxica con pg_trgm sobre title + content
// 2. Búsqueda semántica: generar embedding del query, cosine similarity con pgvector
//    SQL: ORDER BY embedding <=> query_vector (operador pgvector)
// 3. Fusión RRF (Reciprocal Rank Fusion):
//    score_final = 1/(k + rank_lexical) + 1/(k + rank_semantic)    k=60
// 4. Retornar resultados fusionados con score de relevancia

type SearchResult = {
  prompt: Prompt;
  lexical_score: number;
  semantic_score: number;
  hybrid_score: number;
  match_type: "exact" | "semantic" | "hybrid";
};
```

**SQL de búsqueda semántica con pgvector:**

```sql
-- Búsqueda por similitud coseno
SELECT p.*,
       1 - (pe.vector <=> $1::vector) AS similarity
FROM prompts p
JOIN prompt_embeddings pe ON p.id = pe.prompt_id
WHERE 1 - (pe.vector <=> $1::vector) > 0.7
ORDER BY pe.vector <=> $1::vector
LIMIT $2;

-- Índice IVFFlat para performance:
CREATE INDEX ON prompt_embeddings
USING ivfflat (vector vector_cosine_ops) WITH (lists = 100);
```

**`SemanticSearchBar.tsx`:**

- Toggle en el Topbar: "Búsqueda Léxica" / "Búsqueda Semántica" / "Híbrida"
- En modo semántico: indicador visual (ícono de cyan) de que está buscando por significado
- El resultado muestra `similarity: 0.92` junto a cada resultado
- `SimilarPrompts.tsx`: widget en la vista detalle que muestra los 5 prompts más similares semánticamente

---

### MÓDULO 3: CLUSTERING AUTOMÁTICO

```typescript
// lib/cluster-engine.ts

// clusterPrompts(k: number): Promise<void>
// Algoritmo: K-means sobre los vectores de embeddings
//
// Pasos:
// 1. Obtener todos los embeddings de prompts activos
// 2. Reducción dimensional: PCA o UMAP de 1536 → 2D (para visualización)
//    Usar implementación en pure JS o llamar a Python script via child_process
// 3. Ejecutar K-means (implementación propia simple o ml-kmeans npm package)
// 4. Para cada cluster:
//    a. Calcular centroide
//    b. Asignar ClusterMember a cada prompt
//    c. Llamar a GPT-4o para auto-generar nombre y descripción del cluster
//       Prompt para GPT: "Dado estos títulos de prompts: [lista], genera un nombre
//       conciso (3-5 palabras) y descripción (1 oración) para este cluster temático"
// 5. Persistir en DB: borrar clusters anteriores, crear nuevos
// 6. Asignar color único por cluster_id

// Cuándo ejecutar clustering:
// - Manual: botón "Re-clustering" en panel admin
// - Automático: Job nocturno si hay >10 prompts sin cluster asignado
```

**`ClusterMap.tsx` — Mapa semántico 2D:**

- Scatter plot con ApexCharts tipo `scatter`
- Cada punto es un prompt, coloreado por cluster
- Tooltip al hover: título del prompt, score de calidad, cluster name
- Click en punto → abre vista detalle del prompt
- Leyenda de clusters con nombre auto-generado
- Controles: zoom, reset, filtrar por cluster

---

### MÓDULO 4: DATASETS DE EVALUACIÓN

**`DatasetCreateDialog.tsx` — Flujo:**

```
Paso 1: Metadata
  - Nombre del dataset
  - Descripción
  - Público/privado

Paso 2: Schema de casos
  - Definir variables de input (deben coincidir con las variables del prompt)
  - Definir si habrá expected_output (para evaluación supervisada)

Paso 3: Importar casos
  - Opción A: Import CSV
    Columnas: una por variable de input + optional "expected_output" + optional "reference_score"
  - Opción B: Import JSON array
  - Opción C: Agregar casos manualmente uno por uno

Paso 4: Revisión
  - Preview de los primeros 5 casos
  - Contador de casos válidos vs inválidos
  - Botón "Crear Dataset"
```

**Validaciones del dataset:**

- Mínimo 3 casos para ser usable en evaluación
- Las variables del dataset deben ser un subconjunto de las variables del prompt
- `reference_score` debe ser Float entre 0 y 1 si se provee

---

### MÓDULO 5: EVALUACIÓN AUTOMÁTICA

**Arquitectura del motor:**

```typescript
// lib/eval-engine.ts

// El sistema usa el patrón "LLM-as-Judge"
// Un segundo LLM (GPT-4o) evalúa el output del primer LLM

async function runEvaluation(evalRunId: string): Promise<void> {
  // 1. Obtener EvalRun con prompt y dataset
  // 2. Para cada DatasetCase:
  //    a. Sustituir variables del caso en el prompt.content
  //    b. Llamar al modelo especificado en EvalRun.model
  //    c. Medir latencia y tokens
  //    d. Evaluar output con LLM-Judge usando los criterios de eval_criteria:
  //
  //       PROMPT DEL JUEZ:
  //       "Evalúa el siguiente output de IA según estos criterios:
  //        {{criteria_list_with_weights}}
  //
  //        Input dado al modelo: {{input}}
  //        Output esperado (referencia): {{expected_output}}
  //        Output real del modelo: {{actual_output}}
  //
  //        Para cada criterio, da un score de 0 a 1 y una justificación breve.
  //        Responde SOLO en JSON:
  //        { \"criteria_scores\": {...}, \"overall\": 0.X, \"reasoning\": \"...\" }"
  //
  //    e. Calcular score compuesto = sum(score_i * weight_i)
  //    f. Determinar passed = score_compuesto >= 0.7
  //    g. Calcular costo: tokens * precio_por_token del modelo
  //    h. Guardar EvalResultCase
  // 3. Agregar resultados: avg_score, avg_latency, total_tokens, total_cost
  // 4. Actualizar EvalRun.status = 'completed'
  // 5. Actualizar PromptMetric.avg_eval_score
  // 6. Si es mejor que best_eval_score → actualizar
}
```

**`EvalCriteriaEditor.tsx` — Criterios configurables:**

```typescript
// Criterios predefinidos en lib/constants/eval-criteria.ts:
const EVAL_CRITERIA_PRESETS = {
  general: [
    { name: "relevance", label: "Relevancia", weight: 0.3 },
    { name: "accuracy", label: "Precisión", weight: 0.3 },
    { name: "clarity", label: "Claridad", weight: 0.2 },
    { name: "completeness", label: "Completitud", weight: 0.2 },
  ],
  code_generation: [
    { name: "correctness", weight: 0.4 },
    { name: "efficiency", weight: 0.25 },
    { name: "readability", weight: 0.2 },
    { name: "security", weight: 0.15 },
  ],
  creative_writing: [
    { name: "creativity", weight: 0.35 },
    { name: "coherence", weight: 0.3 },
    { name: "tone_match", weight: 0.2 },
    { name: "length_fit", weight: 0.15 },
  ],
};
// El usuario puede usar un preset o crear criterios personalizados
// Los pesos deben sumar exactamente 1.0 (validación con Zod)
```

**`EvalRunDialog.tsx` — Lanzar evaluación:**

```
1. Seleccionar dataset (compatible con las variables del prompt)
2. Seleccionar modelo de IA para generar outputs
3. Configurar criterios de evaluación (preset o custom)
4. Vista previa: N casos, costo estimado en USD, tiempo estimado
5. Botón "Lanzar Evaluación"
6. → Crea EvalRun + Job → Redirige a página de detalle con polling en tiempo real
```

**`EvalRunDetail.tsx` — Vista en tiempo real:**

- Barra de progreso: `X / N casos completados`
- Tabla con resultados parciales que se actualiza cada 2 segundos (polling)
- Columnas: Caso #, Input vars, Score, Passed, Latencia, Costo
- Al completar: resumen con avg_score, tasa de éxito, costo total, tiempo total
- Botón "Comparar con versión anterior"

---

### MÓDULO 6: BENCHMARKING ENTRE MODELOS

```typescript
// lib/benchmark-engine.ts

async function runBenchmark(benchmarkRunId: string): Promise<void> {
  // 1. Para cada modelo en BenchmarkRun.models (en paralelo, max 3 simultáneos):
  //    a. Ejecutar el prompt contra todos los casos del dataset
  //    b. Evaluar cada output con LLM-Judge (mismo criterio para todos)
  //    c. Calcular métricas agregadas por modelo:
  //       - avg_score, avg_latency_ms, total_tokens, cost_usd
  //    d. Guardar BenchmarkResult
  // 2. Determinar winner_model: el de mayor avg_score
  //    Si empate → el de menor cost_usd
  // 3. Generar winner_reason con GPT-4o:
  //    "Dado este benchmark comparando [modelos], el ganador es [X] porque..."
  // 4. Actualizar BenchmarkRun.status = 'completed'
}
```

**`BenchmarkComparison.tsx` — Vista comparativa:**

```
Header: "Benchmark #123 — Prompt: [título]"

Tabla comparativa:
┌────────────────┬─────────┬──────────┬──────────┬──────────┬─────────┐
│ Modelo         │  Score  │ Latencia │  Tokens  │  Costo   │ Winner  │
├────────────────┼─────────┼──────────┼──────────┼──────────┼─────────┤
│ GPT-4o        │  0.87 ✦ │  1.2s    │  12,450  │ $0.0124  │   🏆    │
│ Claude 3.5    │  0.84   │  0.9s    │  11,200  │ $0.0112  │         │
│ GPT-4o-mini   │  0.71   │  0.4s    │   8,100  │ $0.0024  │         │
└────────────────┴─────────┴──────────┴──────────┴──────────┴─────────┘

Winner Reasoning (IA generado):
"GPT-4o obtuvo el mayor score promedio (0.87) con diferencia significativa
en el criterio de precisión (0.91 vs 0.82 de Claude). Sin embargo,
Claude 3.5 ofrece mejor relación costo/calidad..."

Radar Chart: Scores por criterio para cada modelo superpuestos

Score por caso: tabla expandible con el output de cada modelo por caso
```

---

### MÓDULO 7: SCORING AUTOMÁTICO DE CALIDAD

```typescript
// lib/scoring.ts

// El quality_score de un prompt es un composite de múltiples señales:

type QualitySignals = {
  eval_score: number; // Peso: 0.45 — resultado promedio de evaluaciones
  rating_score: number; // Peso: 0.20 — rating humano normalizado (stars/5)
  usage_score: number; // Peso: 0.15 — copy_count normalizado log-scale
  completeness: number; // Peso: 0.10 — tiene system_prompt, variables definidas, adjuntos
  recency_bonus: number; // Peso: 0.05 — penalizar prompts sin actualización > 90 días
  version_activity: number; // Peso: 0.05 — número de versiones / 10 (capped at 1)
};

function computeQualityScore(signals: QualitySignals): number {
  // Promedio ponderado de todas las señales
  // Resultado en rango [0, 1]
  // Actualizar PromptMetric.avg_eval_score y PromptVersion.quality_score
}

// Categorías de score:
// ≥ 0.85 → Excellent (verde)
// ≥ 0.70 → Good (lime)
// ≥ 0.50 → Average (amber)
//  < 0.50 → Poor (red)
```

**`ScoreGauge.tsx`:**

- Indicador semi-circular (gauge chart) con el score de 0–100
- Color dinámico según categoría
- Tooltip: desglose de las señales que componen el score
- Aparece en: PromptCard (esquina), PromptDetail (sidebar), EvalRunDetail

**`PromptScoreBadge.tsx`:**

- Badge compacto `[⬟ 0.87]` con color de fondo según categoría
- En hover: tooltip con desglose de señales

---

### MÓDULO 8: AUTO-OPTIMIZACIÓN DE PROMPTS (AI-Assisted)

```typescript
// lib/optimize-engine.ts

async function runOptimization(optimizationRunId: string): Promise<void> {
  const run = await getOptimizationRun(optimizationRunId);

  // ESTRATEGIA: Configurable por el usuario al lanzar

  // "iterative": 3 rondas de mejora
  // Ronda 1: GPT-4o analiza el prompt y genera 3 variantes mejoradas
  // Ronda 2: Evaluar cada variante contra dataset (si hay)
  //          Si no hay dataset: auto-evaluar con LLM-Judge con casos sintéticos
  // Ronda 3: Tomar la mejor variante y refinarla una vez más

  // "few_shot_injection": detectar si el prompt se beneficiaría de ejemplos
  // → Generar 2-3 ejemplos input/output relevantes e insertarlos en el prompt

  // "chain_of_thought": si el prompt es de razonamiento, agregar CoT automáticamente
  // → Insertar "Razona paso a paso antes de dar tu respuesta final"

  // "constraint_relaxation": detectar contradicciones o restricciones excesivas
  // → GPT-4o analiza y sugiere eliminar o relajar constraints conflictivos

  // PROMPT DEL OPTIMIZADOR:
  const optimizerPrompt = `
  Eres un experto en prompt engineering. Analiza el siguiente prompt y genera
  3 versiones mejoradas usando la estrategia: ${run.strategy}

  PROMPT ORIGINAL:
  ${run.original_content}

  PROBLEMAS A RESOLVER (si aplica):
  - Score actual: ${run.original_score}
  - Criterios con peores scores: [extraídos del último EvalRun si existe]

  Para cada versión mejorada, explica en 2-3 oraciones qué cambios hiciste y por qué.

  Responde SOLO en JSON:
  {
    "candidates": [
      {
        "content": "...",
        "strategy_applied": "...",
        "reasoning": "...",
        "expected_improvements": ["relevance", "accuracy"]
      }
    ]
  }
  `;

  // Evaluar cada candidato si hay dataset disponible
  // Seleccionar best_content basado en best_score
  // Calcular improvement_delta = best_score - original_score
  // Guardar en OptimizationRun.candidates (JSON con todos)
}
```

**`OptimizePanel.tsx` — UI de optimización:**

```
1. Panel lateral o Dialog con:
   - Score actual del prompt
   - Selector de estrategia (4 opciones con descripción de cada una)
   - Selector de dataset (opcional pero recomendado)
   - Costo estimado del proceso
   - Botón "Optimizar con IA"

2. Vista de progreso: "Generando variantes... Evaluando... Seleccionando ganadora..."

3. Vista de resultados (OptimizeCandidates.tsx):
   - Score original: 0.65
   - Mejor candidata: 0.81 (+0.16 ↑ 24.6% mejora)
   - Tabs: Candidata 1 | Candidata 2 | Candidata 3
   - Cada tab: diff visual vs original + score + reasoning
   - Botón "Aceptar y commitear como nueva versión"
   - Botón "Rechazar todas"
```

**Al aceptar una optimización:**

1. El content del prompt se actualiza con el best_content
2. Se crea automáticamente una `PromptVersion` con `change_note: "Auto-optimizado por IA (estrategia: X, mejora: +Y%)"`
3. Se agrega tag de versión `auto-optimized`
4. Se actualiza `OptimizationRun.status = 'accepted'`

---

### MÓDULO 9: PROMPT LINEAGE — ÁRBOL EVOLUTIVO

```typescript
// server/queries/lineage.queries.ts

// getPromptLineageTree(promptId: string): Retorna el árbol completo
// Algoritmo: BFS desde la raíz del linaje
// 1. Encontrar la raíz: seguir parent_id hasta que sea null
// 2. Desde la raíz, hacer BFS hacia abajo por children[]
// 3. Para cada nodo: título, status, score, autor, fecha, # versiones

type LineageNode = {
  id: string;
  title: string;
  slug: string;
  status: PromptStatus;
  quality_score: number;
  author: { full_name: string; username: string };
  created_at: Date;
  version_count: number;
  children: LineageNode[];
  is_current: boolean; // El nodo que el usuario está viendo actualmente
};
```

**`LineageTree.tsx` — Visualización:**

- Usar `reactflow` para el grafo interactivo de nodos y aristas
- Nodo visual: card compacto con título, score badge, avatar del autor
- Arista: flecha con label "fork" o "derivado de"
- El nodo actual está destacado con borde violet de glow
- Click en nodo → panel lateral con info del prompt y botón "Ir al prompt"
- El árbol puede ser muy profundo — implementar zoom y pan
- Colores de nodo por status: `active=emerald`, `draft=amber`, `archived=gray`

**`PromptForkDialog.tsx`:**

```
Al hacer fork de un prompt:
1. Dialog con:
   - "Estás creando un fork de: [título del prompt padre]"
   - Campo: Título del nuevo prompt (prellenado con "Fork de [título]")
   - Campo: Descripción del fork (¿qué vas a cambiar/mejorar?)
   - El content se clona del prompt padre
   - El version_counter comienza en 0
   - parent_id apunta al prompt padre
   - lineage_depth = padre.lineage_depth + 1
2. Al crear: mostrar "Fork creado — ahora puedes editar tu versión"
```

---

## SISTEMA DE JOBS ASINCRÓNICOS

Todos los procesos de IA son costosos y lentos. Nunca se ejecutan en el request-response cycle. Usan una cola de jobs sobre PostgreSQL:

```typescript
// lib/job-queue.ts

// Implementar cola simple sobre la tabla Job de Prisma
// sin dependencias externas como Redis

type JobProcessor = {
  [key: string]: (payload: unknown) => Promise<unknown>;
};

const processors: JobProcessor = {
  eval_run: (p) => evalEngine.run(p.evalRunId),
  benchmark_run: (p) => benchmarkEngine.run(p.benchmarkRunId),
  optimization_run: (p) => optimizeEngine.run(p.optimizationRunId),
  embed_prompt: (p) => embeddings.generate(p.promptId),
  cluster_prompts: (p) => clusterEngine.run(p.k),
};

// Worker: polling cada 5 segundos sobre /api/jobs/worker
// Procesar jobs en orden FIFO, máximo 1 job por tipo a la vez
// Si falla: reintentar hasta max_attempts con backoff exponencial
// Activar worker via: GET /api/jobs/worker (cron job o Vercel cron)
```

**`JobStatusIndicator.tsx`:**

- Componente que hace polling a `/api/jobs/[entityId]/status` cada 2 segundos
- Muestra: `⏳ En cola` → `⚡ Ejecutando (caso 3/10)` → `✅ Completado` / `❌ Error: [mensaje]`
- Al completar: invalidar caché y actualizar UI automáticamente sin reload

---

## SECCIONES DE LA APLICACIÓN

### `/intelligence` — Hub de Inteligencia

```
Panel central con 4 tarjetas de acceso:
  [⚡ Evaluaciones]      → /intelligence/eval
  [📊 Benchmarks]        → /intelligence/benchmark
  [🔮 Optimizaciones]    → /intelligence/optimize
  [🗺️ Mapa Semántico]    → /intelligence/clusters

Stats rápidas:
  - Evaluaciones esta semana | Score promedio global | Optimizaciones con mejora
  - Jobs en cola actualmente

Activity feed: los últimos 10 jobs completados con resultado
```

### `/intelligence/eval` — Lista de Evaluaciones

- Tabla de EvalRuns: Prompt, Dataset, Modelo, Score, Estado, Fecha, Costo
- Filtros: por prompt, por modelo, por rango de score
- Botón "Nueva Evaluación" (abre EvalRunDialog)
- Click en fila → detalle del run

### `/intelligence/benchmark` — Comparaciones

- Grid de BenchmarkRuns recientes con el modelo ganador destacado
- Tabla comparativa global: "¿Qué modelo funciona mejor en esta organización?"
  - Agregado de todos los benchmarks: score promedio por modelo
- Botón "Nuevo Benchmark"

### `/intelligence/optimize` — Optimizaciones

- Lista de OptimizationRuns con delta de mejora
- Filtros: solo mejoras >10%, por estrategia
- Badge especial en prompts que han sido optimizados

### `/intelligence/clusters` — Mapa Semántico

- Scatter plot 2D interactivo con todos los prompts
- Panel lateral: lista de clusters con nombre auto-generado, color, cantidad de prompts
- Click en cluster → filtrar prompts del cluster
- Botón "Re-clustering" (Admin/Engineer) → lanza job

### `/lineage` — Árbol Evolutivo Global

- Selector: ver árbol completo OR árbol desde un prompt específico
- Vista del grafo con reactflow
- Leyenda de colores por status
- Stats: prompts raíz, mayor profundidad de linaje, fork más exitoso (por score)

### `/datasets` — Datasets de Testing

- Mis datasets + datasets públicos
- Card: nombre, # casos, # evaluaciones que lo usan, fecha
- Detalle de dataset: tabla de casos paginada, importar/exportar CSV

---

## RBAC ACTUALIZADO

```
ADMIN:
  ✅ Todo del sistema
  ✅ Trigger clustering global
  ✅ Gestión de usuarios y roles
  ✅ Ver todos los jobs y su estado
  ✅ Configurar precios de modelos (para cálculo de costos)

ENGINEER:
  ✅ Crear y editar sus prompts
  ✅ Lanzar evaluaciones, benchmarks y optimizaciones sobre cualquier prompt público
  ✅ Crear y gestionar datasets
  ✅ Ver analytics globales de evaluaciones
  ✅ Hacer fork de cualquier prompt
  ❌ Gestión de usuarios
  ❌ Trigger clustering global

EDITOR:
  ✅ Crear y editar sus prompts
  ✅ Lanzar evaluaciones sobre sus propios prompts
  ✅ Crear datasets privados
  ✅ Ver resultados de evaluaciones de sus prompts
  ❌ Lanzar benchmarks multi-modelo
  ❌ Ver analytics globales

VIEWER:
  ✅ Ver prompts públicos, scores y resultados de evaluaciones
  ✅ Crear colecciones
  ✅ Calificar y comentar
  ❌ Crear prompts
  ❌ Lanzar ningún proceso de IA
```

---

## TAREAS — ORDEN ESTRICTO DE IMPLEMENTACIÓN

### ▶ TAREA 1: Scaffolding, DB y Extensiones PG

1. Crear proyecto Next.js con TypeScript estricto y Tailwind
2. Instalar todas las dependencias del stack en un solo comando
3. Configurar `tailwind.config.ts` con paleta PIP completa
4. Crear `prisma/schema.prisma` completo con `previewFeatures = ["postgresqlExtensions"]`
5. En la migración inicial, ejecutar:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   CREATE EXTENSION IF NOT EXISTS pg_trgm;
   CREATE INDEX ON prompt_embeddings USING ivfflat (vector vector_cosine_ops) WITH (lists = 100);
   CREATE INDEX prompts_title_trgm_idx ON prompts USING gin(title gin_trgm_ops);
   CREATE INDEX prompts_content_trgm_idx ON prompts USING gin(content gin_trgm_ops);
   ```
6. Seed completo con usuarios, categorías, tags, prompts, datasets, versiones y relaciones de linaje
7. Verificar con `npx prisma studio`

**Entregable:** DB poblada con extensiones activas. `npx tsc --noEmit` sin errores.

---

### ▶ TAREA 2: Auth, Middleware y Shell

1. Auth.js v5 con JWT y Credentials provider
2. Augmentación de tipos con el nuevo rol `engineer`
3. Middleware con rutas protegidas por rol
4. Shell completo: Sidebar por rol + Topbar + CommandSearch básico
5. Login con diseño glassmorfismo PIP

**Entregable:** Login funcional para los 5 roles. Shell navegable.

---

### ▶ TAREA 3: Galería de Prompts con Scores

1. Queries con filtros, paginación y score
2. `PromptCard.tsx` con `ScoreGauge` y `ModelBadge`
3. `PromptGrid.tsx` con toggle grid/lista
4. Panel de filtros incluyendo filtro por score mínimo
5. `prompts/page.tsx` completo

**Entregable:** Galería funcional con scores visibles en cards.

---

### ▶ TAREA 4: Git-Style Versioning

1. `lib/diff.ts` con SHA-256 y generación de diff_patch
2. Server Action `updatePrompt` con auto-versionado
3. `VersionCommitDialog.tsx` — obligar change_note
4. `VersionTimeline.tsx` con commits y tags
5. `VersionDiffViewer.tsx` con diff side-by-side
6. `VersionRestoreDialog.tsx` y `PromptForkDialog.tsx`
7. Integrar en `PromptDetail.tsx`

**Entregable:** Versiones creadas automáticamente al editar. Diff visual funcional. Fork crea linaje.

---

### ▶ TAREA 5: Embeddings y Búsqueda Semántica

1. `lib/openai.ts` y `lib/embeddings.ts`
2. Job `embed_prompt` en la cola
3. Al crear/editar prompt → encolar embedding
4. `lib/search.ts` con hybrid search (léxico + semántico + RRF)
5. `app/api/search/route.ts`
6. `SemanticSearchBar.tsx` con toggle de modo
7. `SimilarPrompts.tsx` en la vista detalle
8. Actualizar CommandSearch para usar búsqueda híbrida

**Entregable:** Búsqueda semántica retorna resultados con similarity score. Similar prompts funcional.

---

### ▶ TAREA 6: Datasets

1. Schema queries y Server Actions para Dataset y DatasetCase
2. `DatasetCreateDialog.tsx` con flujo de 4 pasos
3. `DatasetImporter.tsx` para CSV y JSON
4. `datasets/page.tsx` y `datasets/[id]/page.tsx`

**Entregable:** Datasets creables, importables desde CSV, con tabla de casos.

---

### ▶ TAREA 7: Motor de Evaluación

1. `lib/job-queue.ts` — sistema de jobs sobre Prisma
2. `app/api/jobs/worker/route.ts` — worker con polling
3. `lib/eval-engine.ts` — LLM-as-Judge completo con cálculo de costos
4. `EvalRunDialog.tsx` con configuración de criterios
5. `EvalRunDetail.tsx` con polling en tiempo real
6. `intelligence/eval/page.tsx` y `intelligence/eval/[id]/page.tsx`

**Entregable:** Evaluación completa se ejecuta en background. Resultados aparecen en tiempo real.

---

### ▶ TAREA 8: Benchmarking

1. `lib/benchmark-engine.ts` con paralelismo controlado
2. `BenchmarkRunDialog.tsx`
3. `BenchmarkComparison.tsx` con tabla y radar chart
4. `intelligence/benchmark/page.tsx`

**Entregable:** Benchmark compara 2+ modelos, declara ganador con justificación IA.

---

### ▶ TAREA 9: Scoring Automático

1. `lib/scoring.ts` con composite score
2. Recalcular score tras cada EvalRun completado
3. `ScoreGauge.tsx` y `PromptScoreBadge.tsx`
4. `ScoreTimeline.tsx` — evolución del score a lo largo de versiones
5. Integrar score en todas las vistas de prompts

**Entregable:** Cada prompt tiene score compuesto visible. Score cambia tras evaluaciones.

---

### ▶ TAREA 10: Auto-Optimización

1. `lib/optimize-engine.ts` con las 4 estrategias
2. `OptimizeDialog.tsx` con selector de estrategia
3. `OptimizeCandidates.tsx` con diff y comparación
4. Al aceptar → crear versión con tag `auto-optimized`
5. `intelligence/optimize/page.tsx`

**Entregable:** Optimización genera 3 candidatas, evalúa, presenta la mejor con diff visual.

---

### ▶ TAREA 11: Clustering

1. `lib/cluster-engine.ts` con K-means + auto-labeling
2. Job `cluster_prompts`
3. `ClusterMap.tsx` con scatter plot 2D
4. `ClusterCard.tsx` y `intelligence/clusters/page.tsx`
5. Botón "Re-clustering" en admin

**Entregable:** Clusters generados, mapa semántico interactivo funcional.

---

### ▶ TAREA 12: Árbol de Linaje

1. `server/queries/lineage.queries.ts` — BFS desde raíz
2. Instalar y configurar `reactflow`
3. `LineageTree.tsx` con nodos y aristas interactivos
4. `LineageNode.tsx` con diseño de card compacto
5. `lineage/page.tsx`

**Entregable:** Árbol visual del linaje de cualquier prompt. Fork visible como nodo hijo.

---

### ▶ TAREA 13: Hub de Inteligencia, Analytics y Reportes

1. `intelligence/page.tsx` — hub completo
2. `analytics/page.tsx` diferenciado por rol con todos los gráficos
3. `QualityHeatmap.tsx`, `OptimizationGain.tsx`
4. `ReportExportDialog.tsx` con todos los tipos de reporte incluyendo reporte de evaluaciones

**Entregable:** Hub funcional. Analytics con datos reales. Reportes exportables a PDF.

---

### ▶ TAREA 14: Panel Admin, Pulido y Producción

1. Gestión de usuarios y categorías
2. Panel de jobs: todos los jobs en cola, en ejecución, fallidos
3. Configuración de precios de modelos (para cálculo de costos)
4. Auditoría completa de RBAC en todas las rutas
5. Auditoría de performance: sin N+1, sin queries sin índice
6. Accesibilidad WCAG AA
7. `npx tsc --noEmit` y `npm run build` sin errores
8. `README.md` completo

**Entregable:** Sistema completo listo para producción.

---

## CHECKLIST FINAL DE PRODUCCIÓN

```
Core Platform
  ☐ CRUD de prompts con validación client + server
  ☐ Variables detectadas automáticamente
  ☐ RBAC verificado en servidor para todas las operaciones
  ☐ password_hash nunca en responses

Git Versioning
  ☐ SHA-256 calculado correctamente
  ☐ Diff almacenado como patch JSON
  ☐ change_note obligatoria al commitear
  ☐ Fork crea parent_id y lineage_depth correcto
  ☐ Restaurar crea nuevo commit (no reescribe historia)

Embeddings & Búsqueda
  ☐ pgvector instalado y con índice IVFFlat
  ☐ Embeddings generados para todos los prompts seed
  ☐ Búsqueda semántica retorna similarity > 0.7
  ☐ Hybrid search fusiona léxico + semántico correctamente
  ☐ Similar prompts funcional en vista detalle

Evaluación
  ☐ LLM-Judge evalúa con criterios ponderados
  ☐ Scores por criterio almacenados correctamente
  ☐ Costo calculado en USD por run
  ☐ Resultados en tiempo real con polling

Benchmarking
  ☐ Paralelismo controlado (máx 3 modelos simultáneos)
  ☐ Winner declarado por mayor score (empate → menor costo)
  ☐ Radar chart renderiza correctamente

Scoring
  ☐ Composite score se recalcula tras cada EvalRun
  ☐ ScoreGauge muestra color correcto por categoría
  ☐ ScoreTimeline muestra evolución por versión

Optimización
  ☐ Las 4 estrategias generan output distinto
  ☐ Evaluación de candidatos usa el mismo criterio que el run anterior
  ☐ Al aceptar → versión creada con tag correcto
  ☐ improvement_delta calculado correctamente

Clustering
  ☐ K-means converge correctamente
  ☐ Auto-labels generados por GPT-4o
  ☐ Scatter plot 2D renderiza todos los puntos
  ☐ Click en punto navega al prompt

Lineage
  ☐ BFS desde raíz construye árbol completo
  ☐ reactflow renderiza nodos y aristas correctamente
  ☐ Fork visible como hijo en el árbol

Jobs
  ☐ Jobs en cola se procesan en FIFO
  ☐ Retry con backoff exponencial en fallos
  ☐ max_attempts respetado
  ☐ JobStatusIndicator actualiza UI al completar

Build
  ☐ npx tsc --noEmit sin errores
  ☐ npm run build exitoso
  ☐ Sin any en TypeScript
  ☐ Sin console.log en producción
  ☐ Sin N+1 queries
  ☐ Sin queries Prisma sin .select() explícito
```

---

> **Nota para el modelo:** Este es un sistema de ingeniería de prompts de nivel empresarial. Cada módulo de inteligencia es interdependiente — los embeddings alimentan el clustering y la búsqueda semántica; los EvalRuns alimentan el scoring; el scoring alimenta la selección de candidatos en la optimización. Implementa en el orden estricto de las tareas para garantizar que cada capa tenga sus dependencias resueltas. Ante cualquier decisión técnica no especificada, elige siempre la opción que maximice la reproducibilidad y la trazabilidad del dato.
