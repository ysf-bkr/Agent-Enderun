import fs from "fs";
import path from "path";
import crypto from "crypto";
import { ensureDir, writeTextFile, writeJsonFile } from "../utils/fs.js";
import { updateProjectMemoryCommand } from "../commands/memory.js"; 
import { slugifyName, titleCase } from "../utils/string.js";
import { getConfiguredPaths } from "./memory.js";


const targetDir = process.cwd(); // Assuming targetDir is process.cwd() in the CLI context

export function inferAppSpec(description: string) {
    const normalized = String(description || "").toLowerCase();
    const isCrm = /\bcrm\b|customer|musteri|müşteri/.test(normalized);
    const hasAuth = /auth|login|giris|giriş|signin|sign in|user|kullanici|kullanıcı|role|rol/.test(normalized);
    const hasRoles = /role|rol|permission|yetki|admin/.test(normalized);
    const hasReports = /report|rapor|analytics|dashboard|chart|metric/.test(normalized);
    const appName = isCrm ? "crm-dashboard" : slugifyName(description).split("-").slice(0, 4).join("-");

    return {
        rawDescription: description,
        appName,
        title: isCrm ? "CRM Dashboard" : titleCase(appName),
        domain: isCrm ? "CRM" : "Business",
        modules: {
            auth: hasAuth || isCrm,
            users: hasAuth || hasRoles || isCrm,
            roles: hasRoles || isCrm,
            reports: hasReports || isCrm,
        },
    };
}

export function buildSharedTypesContent(existingContent: string) {
    const marker = "// --- Generated Application Contract ---";
    const generated = [
        marker,
        "export type RoleID = Brand<string, \"RoleID\">;",
        "export type ReportID = Brand<string, \"ReportID\">;",
        "export type CustomerID = Brand<string, \"CustomerID\">;",
        "",
        "export interface AuthSession {",
        "  user: User;",
        "  token: string;",
        "  expiresAt: string;",
        "}",
        "",
        "export interface Role {",
        "  id: RoleID;",
        "  name: string;",
        "  permissions: string[];",
        "}",
        "",
        "export interface Customer {",
        "  id: CustomerID;",
        "  name: string;",
        "  ownerId: UserID;",
        "  status: \"LEAD\" | \"ACTIVE\" | \"AT_RISK\";", // Using backticks for inner double quotes
        "  annualValue: number;",
        "  createdAt: string;",
        "}",
        "",
        "export interface ReportMetric {",
        "  id: ReportID;",
        "  label: string;",
        "  value: number;",
        "  trend: \"UP\" | \"DOWN\" | \"FLAT\";", // Using backticks for inner double quotes
        "}",
        "",
        "export interface DashboardSummary {",
        "  customers: Customer[];",
        "  users: User[];",
        "  roles: Role[];",
        "  reports: ReportMetric[];",
        "}",
    ].join("\n");

    if (existingContent.includes(marker)) return existingContent;
    return `${existingContent.trim()}\n\n${generated}\n`;
}

export function updateContractHashFile() {
    const pathsMap = getConfiguredPaths();
    const sharedDir = path.join(targetDir, pathsMap.backend, "src/types");
    const contractPath = path.join(targetDir, pathsMap.backend, "contract.version.json");
    if (!fs.existsSync(sharedDir) || !fs.existsSync(contractPath)) return;

    const walk = (dir: string): string[] => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);
        return entry.isDirectory() ? walk(fullPath) : (entry.name.endsWith(".ts") ? [fullPath] : []);
    });
    const hash = crypto.createHash("sha256");
    for (const filePath of walk(sharedDir).sort()) {
        hash.update(path.relative(targetDir, filePath));
        hash.update("\0");
        hash.update(fs.readFileSync(filePath));
        hash.update("\0");
    }

    const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
    contract.contract_hash = hash.digest("hex");
    contract.last_updated = new Date().toISOString();
    fs.writeFileSync(contractPath, JSON.stringify(contract, null, 2));
}

export function createBaseTypeFiles(baseDir: string) {
    const typesDir = path.join(baseDir, "types");
    ensureDir(typesDir);

    writeTextFile(path.join(typesDir, "api.ts"), `import { TraceID } from "./brands.js";

/**
 * API Response Wrappers
 */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    requestId: TraceID;
    timestamp: string;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
`);

    writeTextFile(path.join(typesDir, "brands.ts"), `/**
 * Branded Type Utility
 */
export type Brand<K, T> = K & { __brand: T };

/**
 * Entity IDs (Branded)
 */
export type TraceID = Brand<string, "TraceID">;
export type AgentID = Brand<string, "AgentID">;
export type ProjectID = Brand<string, "ProjectID">;
export type UserID = Brand<string, "UserID">;
`);

    writeTextFile(path.join(typesDir, "constants.ts"), `import { TraceID } from "./brands.js";

/**
 * Project Phases
 */
export const PROJECT_PHASES = ["PHASE_0", "PHASE_1", "PHASE_2", "PHASE_3", "PHASE_4"] as const;
export type ProjectPhase = (typeof PROJECT_PHASES)[number];

/**
 * Execution Profiles
 */
export const EXECUTION_PROFILES = ["Lightweight", "Full"] as const;
export type ExecutionProfile = (typeof EXECUTION_PROFILES)[number];

/**
 * Task Priorities
 */
export const TASK_PRIORITIES = ["P0", "P1", "P2", "P3"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

/**
 * Task Statuses
 */
export const TASK_STATUSES = ["PENDING", "IN_PROGRESS", "BLOCKED", "COMPLETED", "FAILED"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

/**
 * Action Types & Status
 */
export const ACTION_TYPES = ["CREATE", "MODIFY", "DELETE", "RESEARCH", "ORCHESTRATE"] as const;
export type ActionType = (typeof ACTION_TYPES)[number];

export const ACTION_STATUSES = ["SUCCESS", "FAILURE", "WAITING"] as const;
export type ActionStatus = (typeof ACTION_STATUSES)[number];
`);

    writeTextFile(path.join(typesDir, "index.ts"), `/**
 * Agent Enderun — App-Local Types (Modular)
 */

export * from "./brands.js";
export * from "./constants.js";
export * from "./models.js";
export * from "./api.js";
export * from "./logs.js";
`);

    writeTextFile(path.join(typesDir, "logs.ts"), `import { TraceID, AgentID } from "./brands.js";
import { ActionType, ActionStatus } from "./constants.js";

/**
 * Audit & Agent Logging Types
 */
export interface AgentActionLog {
  timestamp: string;
  agent: AgentID;
  action: ActionType;
  requestId: TraceID | "—";
  status: ActionStatus;
  summary: string;
  files?: string[];
  details?: Record<string, unknown>;
}
`);

    writeTextFile(path.join(typesDir, "models.ts"), `import { UserID, TraceID, AgentID } from "./brands.js";
import { ProjectPhase, ExecutionProfile, TaskPriority, TaskStatus } from "./constants.js";

/**
 * Base Entity Fields
 */
export interface BaseEntity {
  id: string; // Usually ULID
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

/**
 * Audit Log Model
 */
export interface AuditLog extends BaseEntity {
  entityName: string;
  entityId: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "RESTORE";
  userId: UserID;
  previousState?: Record<string, unknown> | null;
  newState?: Record<string, unknown> | null;
  traceId: TraceID;
}

/**
 * User Model
 */
export interface User extends BaseEntity {
  id: UserID;
  email: string;
  fullName: string;
  role: "ADMIN" | "DEVELOPER" | "VIEWER";
}

export interface UserProfile extends User {
  avatarUrl?: string;
  bio?: string;
  preferences: Record<string, unknown>;
}

/**
 * Project Status
 */
export interface ProjectStatus {
  phase: ProjectPhase;
  profile: ExecutionProfile;
  lastUpdate: string;
  activeTraceId: TraceID | null;
  blockers: string[];
}

/**
 * Task Model
 */
export interface Task {
  id: TraceID;
  description: string;
  agent: AgentID;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}
`);
    console.warn(`✅ Base types created in ${path.relative(targetDir, typesDir)}`);
}

interface AppSpec {
    rawDescription: string;
    appName: string;
    title: string;
    domain: string;
    modules: {
        auth: boolean;
        users: boolean;
        roles: boolean;
        reports: boolean;
    };
}

export function createBackendFiles(spec: AppSpec) {
    const pathsMap = getConfiguredPaths();
    const backendDir = pathsMap.backend;

    createBaseTypeFiles(path.join(targetDir, backendDir, "src"));
    writeJsonFile(path.join(targetDir, backendDir, "contract.version.json"), {
        "contract_hash": "initial_hash_placeholder",
        "last_updated": new Date().toISOString()
    });
    writeJsonFile(path.join(targetDir, backendDir, "package.json"), {
        name: "@agent-enderun/backend",
        version: "0.1.0",
        private: true,
        type: "module",
        scripts: {
            dev: "tsx src/server.ts",
            build: "tsc -p tsconfig.json",
            start: "node dist/server.js",
            test: "vitest run",
        },
        dependencies: {
            "@fastify/cors": "^11.0.0",
            fastify: "^5.0.0",
            zod: "^3.24.2",
        },
        devDependencies: {
            "@types/node": "^22.13.4",
            tsx: "^4.19.4",
            typescript: "^5.9.3",
            vitest: "^3.0.5",
        },
    });

    writeJsonFile(path.join(targetDir, backendDir, "tsconfig.json"), {
        extends: "../../tsconfig.json",
        compilerOptions: {
            outDir: "dist",
            rootDir: "src",
            module: "NodeNext",
            moduleResolution: "NodeNext",
            target: "ES2022",
            strict: true,
            skipLibCheck: true,
        },
        include: ["src/**/*.ts"],
    });

    writeTextFile(path.join(targetDir, backendDir, "src/data.ts"), [
        "import type { Customer, DashboardSummary, ReportMetric, Role, User } from \"./types/index.js\";",
        "",
        "const now = new Date().toISOString();",
        "",
        "export const roles: Role[] = [",
        "  { id: \"role_admin\" as Role[\"id\"], name: \"Admin\", permissions: [\"users:manage\", \"reports:view\", \"customers:manage\"] },",
        "  { id: \"role_manager\" as Role[\"id\"], name: \"Manager\", permissions: [\"reports:view\", \"customers:manage\"] },",
        "  { id: \"role_viewer\" as Role[\"id\"], name: \"Viewer\", permissions: [\"reports:view\"] },",
        "];",
        "",
        "export const users: User[] = [",
        "  { id: \"user_1\" as User[\"id\"], email: \"admin@example.com\", fullName: \"Admin User\", role: \"ADMIN\", createdAt: now },",
        "  { id: \"user_2\" as User[\"id\"], email: \"manager@example.com\", fullName: \"Sales Manager\", role: \"DEVELOPER\", createdAt: now },",
        "];",
        "",
        "export const customers: Customer[] = [",
        "  { id: \"customer_1\" as Customer[\"id\"], name: \"Northwind\", ownerId: users[1].id, status: \"ACTIVE\", annualValue: 125000, createdAt: now },",
        "  { id: \"customer_2\" as Customer[\"id\"], name: \"Acme Corp\", ownerId: users[1].id, status: \"LEAD\", annualValue: 82000, createdAt: now },",
        "  { id: \"customer_3\" as Customer[\"id\"], name: \"Globex\", ownerId: users[0].id, status: \"AT_RISK\", annualValue: 54000, createdAt: now },",
        "];",
        "",
        "export const reports: ReportMetric[] = [",
        "  { id: \"report_pipeline\" as ReportMetric[\"id\"], label: \"Pipeline\", value: 261000, trend: \"UP\" },",
        "  { id: \"report_active_customers\" as ReportMetric[\"id\"], label: \"Active Customers\", value: 1, trend: \"FLAT\" },",
        "  { id: \"report_risk\" as ReportMetric[\"id\"], label: \"At Risk\", value: 1, trend: \"DOWN\" },",
        "];",
        "",
        "export function getDashboardSummary(): DashboardSummary {",
        "  return { customers, users, roles, reports };",
        "}",
    ].join("\n"));

    writeTextFile(path.join(targetDir, backendDir, "src/server.ts"), [
        "import Fastify from \"fastify\";",
        "import cors from \"@fastify/cors\";",
        "import { z } from \"zod\";",
        "import { customers, getDashboardSummary, reports, roles, users } from \"./data.js\";",
        "",
        "const app = Fastify({ logger: true });",
        "await app.register(cors, { origin: true });",
        "",
        "app.get(\"/health\", async () => ({ ok: true, service: \"agent-enderun-backend\" }));",
        "app.get(\"/api/v1/dashboard\", async () => ({ data: getDashboardSummary() }));",
        "app.get(\"/api/v1/users\", async () => ({ data: users }));",
        "app.get(\"/api/v1/roles\", async () => ({ data: roles }));",
        "app.get(\"/api/v1/customers\", async () => ({ data: customers }));",
        "app.get(\"/api/v1/reports\", async (request, reply) => {",
        "  interface QueryParams {",
        "    page?: number;",
        "    limit?: number;",
        "  }",
        "  const { page = 1, limit = 10 } = request.query as QueryParams;",
        "  const startIndex = (Number(page) - 1) * Number(limit);",
        "  const endIndex = startIndex + Number(limit);",
        "  const paginatedReports = reports.slice(startIndex, endIndex);",
        "  reply.send({",
        "    data: paginatedReports,",
        "    meta: {",
        "      total: reports.length,",
        "      page: Number(page),",
        "      limit: Number(limit),",
        "    },",
        "  });",
        "});",
        "",
        "app.post(\"/api/v1/auth/login\", async (request, reply) => {",
        "  const body = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse(request.body);",
        "  if (!body.success) return reply.code(400).send({ error: { code: \"VALIDATION_ERROR\", message: \"Invalid login payload\" } });",
        "",
        "  const user = users.find((item) => item.email === body.data.email) || users[0];",
        "  return { data: { user, token: \"demo-token\", expiresAt: new Date(Date.now() + 3600000).toISOString() } };",
        "});",
        "",
        "const port = Number(process.env.PORT || 4000);",
        "await app.listen({ port, host: \"0.0.0.0\" });",
    ].join("\n"));

    writeTextFile(path.join(targetDir, backendDir, "README.md"), [
        `# ${spec.title} Backend`,
        "",
        "Fastify API generated by Agent Enderun.",
        "",
        "## Commands",
        "",
        "- `npm run dev` strings",
        "- `npm run build` strings",
        "- `npm run test` strings",
    ].join("\n"));
}

export function createWebFiles(spec: AppSpec) {
    const pathsMap = getConfiguredPaths();
    const frontendDir = pathsMap.frontend;

    createBaseTypeFiles(path.join(targetDir, frontendDir, "src"));
    writeJsonFile(path.join(targetDir, frontendDir, "package.json"), {
        name: "@agent-enderun/web",
        version: "0.1.0",
        private: true,
        type: "module",
        scripts: {
            dev: "vite --host 0.0.0.0",
            build: "tsc -p tsconfig.json && vite build",
            preview: "vite preview",
            test: "vitest run",
        },
        dependencies: {
            "@vitejs/plugin-react": "^5.0.0",
            vite: "^7.0.0",
            react: "^19.0.0",
            "react-dom": "^19.0.0",
            "lucide-react": "^0.468.0",
        },
        devDependencies: {
            "@types/react": "^19.0.0",
            "@types/react-dom": "^19.0.0",
            typescript: "^5.9.3",
            vitest: "^3.0.5",
        },
    });

    writeJsonFile(path.join(targetDir, frontendDir, "tsconfig.json"), {
        extends: "../../tsconfig.json",
        compilerOptions: {
            jsx: "react-jsx",
            module: "NodeNext",
            moduleResolution: "NodeNext",
            target: "ES2022",
            strict: true,
            skipLibCheck: true,
        },
        include: ["src/**/*.ts", "src/**/*.tsx"],
    });

    writeTextFile(path.join(targetDir, frontendDir, "index.html"), [
        "<div id=\"root\"></div>",
        "<script type=\"module\" src=\"/src/main.tsx\"></script>",
    ].join("\n"));

    writeTextFile(path.join(targetDir, frontendDir, "src/main.tsx"), [
        "import React from \"react\";",
        "import { createRoot } from \"react-dom/client\";",
        "import { App } from \"./App.js\";",
        "import \"./styles.css\";",
        "",
        "createRoot(document.getElementById(\"root\") as HTMLElement).render(",
        "  <React.StrictMode>",
        "    <App />",
        "  </React.StrictMode>,",
        ");",
    ].join("\n"));

    writeTextFile(path.join(targetDir, frontendDir, "src/App.tsx"), [
        "import { BarChart3, ShieldCheck, UsersRound } from \"lucide-react\";",
        "",
        "const metrics = [",
        "  { label: \"Pipeline\", value: \"$261K\", tone: \"green\" },",
        "  { label: \"Active customers\", value: \"18\", tone: \"blue\" },",
        "  { label: \"At risk\", value: \"3\", tone: \"red\" },",
        "];",
        "",
        "const customers = [",
        "  { name: \"Northwind\", status: \"Active\", owner: \"Sales Manager\", value: \"$125K\" },",
        "  { name: \"Acme Corp\", status: \"Lead\", owner: \"Sales Manager\", value: \"$82K\" },",
        "  { name: \"Globex\", status: \"At risk\", owner: \"Admin User\", value: \"$54K\" },",
        "];",
        "",
        "export function App() {",
        "  return (",
        "    <main className=\"shell\">",
        "      <aside className=\"sidebar\" aria-label=\"Primary navigation\">",
        "        <div className=\"brand\">AE</div>",
        "        <nav>",
        "          <a className=\"active\" href=\"#dashboard\"><BarChart3 size={18} /> Dashboard</a>",
        "          <a href=\"#users\"><UsersRound size={18} /> Users</a>",
        "          <a href=\"#roles\"><ShieldCheck size={18} /> Roles</a>",
        "        </nav>",
        "      </aside>",
        "",
        "      <section className=\"workspace\">",
        "        <header className=\"topbar\">",
        "          <div>",
        `            <p>${spec.domain}</p>`,
        `            <h1>${spec.title}</h1>`,
        "          </div>",
        "          <button type=\"button\">New customer</button>",
        "        </header>",
        "",
        "        <section className=\"metrics\" aria-label=\"Report metrics\">",
        "          {metrics.map((metric) => (",
        "            <article className={`metric ${metric.tone}`} key={metric.label}>",
        "              <span>{metric.label}</span>",
        "              <strong>{metric.value}</strong>",
        "            </article>",
        "          ))}",
        "        </section>",
        "",
        "        <section className=\"panel\">",
        "          <div>",
        "            <h2>Customers</h2>",
        "            <p>Ownership, value and status at a glance.</p>",
        "          </div>",
        "          <div className=\"table\">",
        "            {customers.map((customer) => (",
        "              <div className=\"row\" key={customer.name}>",
        "                <strong>{customer.name}</strong>",
        "                <span>{customer.status}</span>",
        "                <span>{customer.owner}</span>",
        "                <b>{customer.value}</b>",
        "              </div>",
        "            ))}",
        "          </div>",
        "        </section>",
        "      </section>",
        "    </main>",
        "  );",
        "}",
    ].join("\n"));

    writeTextFile(path.join(targetDir, frontendDir, "src/styles.css"), [
        ":root {",
        "  color: #172026;",
        "  background: #f4f7f6;",
        "  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;",
        "}",
        "",
        "* { box-sizing: border-box; }",
        "body { margin: 0; }",
        "button { font: inherit; }",
        "",
        ".shell {",
        "  min-height: 100vh;",
        "  display: grid;",
        "  grid-template-columns: 240px 1fr;",
        "}",
        "",
        ".sidebar {",
        "  background: #102022;",
        "  color: #eef6f2;",
        "  padding: 24px;",
        "}",
        "",
        ".brand {",
        "  width: 40px;",
        "  height: 40px;",
        "  display: grid;",
        "  place-items: center;",
        "  background: #d8f36a;",
        "  color: #102022;",
        "  font-weight: 800;",
        "  border-radius: 8px;",
        "  margin-bottom: 32px;",
        "}",
        "",
        "nav { display: grid; gap: 8px; }",
        "nav a {",
        "  color: inherit;",
        "  text-decoration: none;",
        "  display: flex;",
        "  gap: 10px;",
        "  align-items: center;",
        "  padding: 10px 12px;",
        "  border-radius: 8px;",
        "}",
        "nav a.active, nav a:hover { background: rgba(255,255,255,0.12); }",
        "",
        ".workspace { padding: 32px; }",
        ".topbar {",
        "  display: flex;",
        "  justify-content: space-between;",
        "  align-items: center;",
        "  gap: 24px;",
        "  margin-bottom: 24px;",
        "}",
        ".topbar p { margin: 0 0 4px; color: #58666a; font-size: 14px; }",
        ".topbar h1 { margin: 0; font-size: 32px; letter-spacing: 0; }",
        ".topbar button {",
        "  border: 0;",
        "  border-radius: 8px;",
        "  background: #176b5d;",
        "  color: white;",
        "  padding: 10px 14px;",
        "}",
        "",
        ".metrics {",
        "  display: grid;",
        "  grid-template-columns: repeat(3, minmax(0, 1fr));",
        "  gap: 16px;",
        "  margin-bottom: 24px;",
        "}",
        ".metric, .panel {",
        "  background: white;",
        "  border: 1px solid #d9e3e0;",
        "  border-radius: 8px;",
        "}",
        ".metric { padding: 18px; }",
        ".metric span { display: block; color: #58666a; margin-bottom: 8px; }",
        ".metric strong { font-size: 28px; }",
        ".metric.green { border-top: 4px solid #49a078; }",
        ".metric.blue { border-top: 4px solid #3f7cac; }",
        ".metric.red { border-top: 4px solid #d95d39; }",
        "",
        ".panel { padding: 20px; }",
        ".panel h2 { margin: 0 0 4px; font-size: 20px; }",
        ".panel p { margin: 0 0 18px; color: #58666a; }",
        ".table { display: grid; gap: 8px; }",
        ".row {",
        "  display: grid;",
        "  grid-template-columns: 1.4fr 0.8fr 1fr 0.6fr;",
        "  gap: 16px;",
        "  align-items: center;",
        "  padding: 12px;",
        "  border-radius: 8px;",
        "  background: #f7faf9;",
        "}",
        "",
        "@media (max-width: 760px) {",
        "  .shell { grid-template-columns: 1fr; }",
        "  .sidebar { position: static; }",
        "  .metrics { grid-template-columns: 1fr; }",
        "  .topbar { align-items: flex-start; flex-direction: column; }",
        "  .row { grid-template-columns: 1fr; }",
        "}",
    ].join("\n"));

    writeTextFile(path.join(targetDir, frontendDir, "README.md"), [
        `# ${spec.title} Web`,
        "",
        "React dashboard generated by Agent Enderun.",
        "",
        "## Commands",
        "",
        "- `npm run dev` strings",
        "- `npm run build` strings",
        "- `npm run test` strings",

    ].join("\n"));
}

export function updateProjectDocs(spec: AppSpec) {
    const pathsMap = getConfiguredPaths();
    const docsDir = path.join(targetDir, pathsMap.docs);
    const apiDir = path.join(docsDir, "api");
    ensureDir(apiDir);

    writeTextFile(path.join(docsDir, "project-docs.md"), [
        `# ${spec.title} Requirements`,
        "",
        "## Request",
        "",
        spec.rawDescription,
        "",
        "## Generated Scope",
        "",
        `- Domain: ${spec.domain}`,
        `- Auth: ${spec.modules.auth ? "yes" : "no"}`,
        `- Users: ${spec.modules.users ? "yes" : "no"}`,
        `- Roles: ${spec.modules.roles ? "yes" : "no"}`,
        `- Reports: ${spec.modules.reports ? "yes" : "no"}`,
        "",
        "## Architecture",
        "",
        `- \`${pathsMap.backend}\`: Fastify API`,
        `- \`${pathsMap.frontend}\`: React dashboard`,
        `- \`${pathsMap.backend}/src/types\`: Contract-first backend TypeScript types`,
    ].join("\n"));

    writeTextFile(path.join(apiDir, "README.md"), [
        "# API Registry",
        "",
        "- `POST /api/v1/auth/login`",
        "- `GET /api/v1/dashboard`",
        "- `GET /api/v1/users`",
        "- `GET /api/v1/roles`",
        "- `GET /api/v1/customers`",
        "- `GET /api/v1/reports`",
    ].join("\n"));
}

export function updateMemoryForGeneratedApp(spec: AppSpec, traceId: string) {
    const memoryPath = getMemoryPath();
    if (!fs.existsSync(memoryPath)) return;

    const pathsMap = getConfiguredPaths();
    const today = new Date().toISOString().split("T")[0];
    const history = [
        `### ${today} — Generated ${spec.title}`,
        "",
        "- **Agent:** @manager",
        `- **Trace ID:** ${traceId}`,
        "- **Action:** Created full-stack starter from natural language request.",
        `- **Files:** ${pathsMap.backend}, ${pathsMap.frontend}, project docs`,
    ].join("\n");

    updateProjectMemoryCommand("HISTORY", history);
}

export async function collectCreateAppDescription(args: string[]) {
    const initial = args.join(" ").trim();
    if (initial) return initial;

    const readline = await import("readline/promises");
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    try {
        const idea = await rl.question("What do you want to build? ");
        const platform = await rl.question("Platform? (full-stack/web/backend) ");
        const auth = await rl.question("Auth and roles? (yes/no) ");
        const reports = await rl.question("Reports/dashboard? (yes/no) ");
        return [idea, platform, auth.includes("y") ? "with auth and roles" : "", reports.includes("y") ? "with reports dashboard" : ""].filter(Boolean).join(" ");
    } finally {
        rl.close();
    }
}

function getFrameworkDir(): string {
    for (const dir of [".gemini", ".claude", ".agent", ".enderun"]) {
        if (fs.existsSync(path.join(process.cwd(), dir))) return dir;
    }
    return ".gemini";
}

function getMemoryPath(): string {
    return path.join(process.cwd(), getFrameworkDir(), "PROJECT_MEMORY.md");
}
