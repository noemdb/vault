export enum UserRole {
  admin = "admin",
  engineer = "engineer",
  editor = "editor",
  viewer = "viewer",
}

export enum PromptStatus {
  draft = "draft",
  active = "active",
  deprecated = "deprecated",
  archived = "archived",
  featured = "featured",
}

export enum AIModel {
  gpt_4o = "gpt_4o",
  gpt_4o_mini = "gpt_4o_mini",
  gpt_4_turbo = "gpt_4_turbo",
  claude_3_5_sonnet = "claude_3_5_sonnet",
  claude_3_opus = "claude_3_opus",
  claude_3_haiku = "claude_3_haiku",
  gemini_1_5_pro = "gemini_1_5_pro",
  gemini_1_5_flash = "gemini_1_5_flash",
  llama_3_70b = "llama_3_70b",
  mistral_large = "mistral_large",
  custom = "custom",
}

export enum AttachmentType {
  image = "image",
  pdf = "pdf",
  html = "html",
  markdown = "markdown",
  text = "text",
  json_output = "json_output",
  csv_dataset = "csv_dataset",
}

export enum EvalStatus {
  pending = "pending",
  running = "running",
  completed = "completed",
  failed = "failed",
}

export enum OptimizationStatus {
  pending = "pending",
  running = "running",
  completed = "completed",
  failed = "failed",
  accepted = "accepted",
  rejected = "rejected",
}

export enum JobStatus {
  queued = "queued",
  running = "running",
  completed = "completed",
  failed = "failed",
}

export interface SharedPrompt {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: PromptStatus;
  model: AIModel;
  author: {
    email: string;
    profile?: {
      full_name: string;
      username: string;
    } | null;
  };
  category?: {
    name: string;
  } | null;
  _count: {
    versions: number;
  };
}
