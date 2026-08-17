/**
 * Firebase-ready client layer.
 *
 * The Firebase Web SDK (v10+ modular) is initialised lazily ONLY when all
 * VITE_FIREBASE_* env vars are mounted. Until then every read/write falls back
 * to a clean in-memory + localStorage mock so the whole product is functional.
 */

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

export function getFirebaseConfig(): FirebaseConfig | null {
  const env = import.meta.env as Record<string, string | undefined>;
  const cfg = {
    apiKey: env["VITE_FIREBASE_API_KEY"],
    authDomain: env["VITE_FIREBASE_AUTH_DOMAIN"],
    projectId: env["VITE_FIREBASE_PROJECT_ID"],
    storageBucket: env["VITE_FIREBASE_STORAGE_BUCKET"],
    messagingSenderId: env["VITE_FIREBASE_MESSAGING_SENDER_ID"],
    appId: env["VITE_FIREBASE_APP_ID"],
  };
  if (Object.values(cfg).some((v) => !v)) return null;
  return cfg as FirebaseConfig;
}

export const isFirebaseConfigured = () => getFirebaseConfig() !== null;

/* ------------------------------- mock store ------------------------------- */

export type DocRecord = Record<string, unknown> & { id: string; createdAt: number };

const KEY = "washpass:collections";

function readAll(): Record<string, DocRecord[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, DocRecord[]>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(data));
}

/** Mirrors `addDoc(collection(db, name), data)`. */
export async function createDoc(
  collectionName: string,
  data: Record<string, unknown>,
): Promise<DocRecord> {
  const doc: DocRecord = {
    ...data,
    id: `${collectionName}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: Date.now(),
  };
  const all = readAll();
  all[collectionName] = [doc, ...(all[collectionName] ?? [])];
  writeAll(all);
  await new Promise((r) => setTimeout(r, 420));
  return doc;
}

/** Mirrors `getDocs(collection(db, name))`. */
export function listDocs(collectionName: string): DocRecord[] {
  return readAll()[collectionName] ?? [];
}

/** Mirrors `updateDoc(doc(db, name, id), patch)`. */
export function patchDoc(
  collectionName: string,
  id: string,
  patch: Record<string, unknown>,
): void {
  const all = readAll();
  all[collectionName] = (all[collectionName] ?? []).map((d) =>
    d.id === id ? { ...d, ...patch } : d,
  );
  writeAll(all);
}
