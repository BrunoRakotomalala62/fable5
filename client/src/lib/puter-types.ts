// Puter.js Type Definitions
export interface PuterAI {
  chat(
    messages: Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }>,
    options: { model: string; stream?: boolean }
  ): Promise<AsyncIterable<{ text?: string }>>;

  txt2img(
    prompt: string,
    options?: {
      provider?: string;
      model?: string;
      input_images?: string[];
      input_image?: string;
      test_mode?: boolean;
      puter_output_path?: string;
    }
  ): Promise<{ image_url: string }>;

  listModels(): Promise<Array<{ id: string; name: string }>>;
}

export interface PuterAuth {
  signIn(): Promise<void>;
  signOut(): Promise<void>;
  isSignedIn(): Promise<boolean>;
  getUser(): Promise<{ username: string; email: string }>;
}

export interface Puter {
  ai: PuterAI;
  auth: PuterAuth;
}

declare global {
  var puter: Puter | undefined;
}
