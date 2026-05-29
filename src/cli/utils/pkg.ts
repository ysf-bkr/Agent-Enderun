import fs from "fs";
import path from "path";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const sourceDir = path.join(__dirname, "../../.."); // Adjust path as necessary to reach project root

export function getPackageVersion() {
    const pkg = JSON.parse(fs.readFileSync(path.join(sourceDir, "package.json"), "utf8"));
    return pkg.version;
}

export function getPackageManager() {
    const override = process.env.AGENT_ENDERUN_PACKAGE_MANAGER || process.env.AGENT_ENDERUN_PM || process.env.AI_ENDERUN_PACKAGE_MANAGER || process.env.AI_ENDERUN_PM;
    if (override) return override.toLowerCase();

    const userAgent = process.env.npm_config_user_agent || "";
    const npmExecPath = process.env.npm_execpath || "";

    if (userAgent.includes("pnpm") || npmExecPath.includes("pnpm")) return "pnpm";
    if (userAgent.includes("yarn") || npmExecPath.includes("yarn")) return "yarn";

    // Check for lockfiles in target directory
    if (fs.existsSync(path.join(process.cwd(), "pnpm-lock.yaml")) || fs.existsSync(path.join(process.cwd(), "pnpm-workspace.yaml"))) return "pnpm";
    if (fs.existsSync(path.join(process.cwd(), "yarn.lock"))) return "yarn";
  
    return "npm";
}

interface PackageJson {
    name?: string;
    version?: string;
    type?: string;
    workspaces?: string[];
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
    enderun?: Record<string, unknown>;
  }

export function mergePackageJson(targetPath: string, sourcePath: string): void {
    let targetPkg: PackageJson = {}; 
    if (fs.existsSync(targetPath)) {
        try {
            targetPkg = JSON.parse(fs.readFileSync(targetPath, "utf8"));
        } catch {
            console.warn("⚠️  Could not parse existing package.json, creating a new one.");
        }
    }

    const sourcePkg: PackageJson = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  
  type PackageMap = Record<string, string>;
  const sanitizeDeps = (deps: PackageMap | Record<string, unknown> | undefined): Record<string, string> | undefined => {
      if (!deps) return deps as undefined;
      const cleaned: Record<string, string> = {};
      for (const [name, version] of Object.entries(deps)) {
          cleaned[name] = (typeof version === "string" && version.startsWith("workspace:")) ? "*" : String(version || "");
      }
      return cleaned;
  };

  const actualTargetScope = targetPkg.name && targetPkg.name.startsWith("@")
      ? targetPkg.name.split("/")[0]
      : (targetPkg.name ? `@${targetPkg.name}` : "");

  // Cleanup potential leftovers from previous bugged runs where agent-enderun was renamed to target name
  if (actualTargetScope) {
      const scopeName = actualTargetScope.startsWith("@") ? actualTargetScope.slice(1) : actualTargetScope;
      const cleanup = (obj: Record<string, string> | undefined): void => {
          if (!obj) return;
          delete obj[scopeName];
          delete obj[actualTargetScope];
          delete obj["agent-enderun"]; // Will be re-added correctly
      };
      cleanup(targetPkg.devDependencies);
      cleanup(targetPkg.dependencies);
  }

  targetPkg.dependencies = sanitizeDeps({
      ...targetPkg.dependencies,
      ...sourcePkg.dependencies
  });

  // Merge scripts
  const pkgMgr = getPackageManager();
  const runCmd = pkgMgr === "yarn" ? "yarn" : (pkgMgr === "pnpm" ? "pnpm" : "npm run");
  
  targetPkg.scripts = {
      ...targetPkg.scripts,
      "enderun:status": "agent-enderun status",
      "enderun:trace": "agent-enderun trace:new",
      "enderun:verify": "agent-enderun verify-contract",
      "enderun:check": "agent-enderun check",
      "enderun:test": "vitest run",
      "enderun:test:watch": "vitest",
      "enderun:build": `${runCmd} build --prefix framework-mcp`,
  };

  const sourceDevDeps = sourcePkg.devDependencies || {};
  targetPkg.devDependencies = sanitizeDeps({
      ...targetPkg.devDependencies,
      "agent-enderun": `^${sourcePkg.version}`,
      ...(sourceDevDeps["@modelcontextprotocol/sdk"] ? {"@modelcontextprotocol/sdk": sourceDevDeps["@modelcontextprotocol/sdk"]} : {}),
      ...(sourceDevDeps["zod"] ? {"zod": sourceDevDeps["zod"]} : {}),
      ...(sourceDevDeps["ts-morph"] ? {"ts-morph": sourceDevDeps["ts-morph"]} : {}),
      ...(sourceDevDeps["typescript"] ? {"typescript": sourceDevDeps["typescript"]} : {}),
      ...(sourceDevDeps["@types/node"] ? {"@types/node": sourceDevDeps["@types/node"]} : {}),
      ...(sourceDevDeps["tsx"] ? {"tsx": sourceDevDeps["tsx"]} : {}),
      ...(sourceDevDeps["vitest"] ? {"vitest": sourceDevDeps["vitest"]} : {}),
      "@pandacss/dev": sourceDevDeps["@pandacss/dev"] || "^1.11.1"
  });

  if (targetPkg.peerDependencies) {
      targetPkg.peerDependencies = sanitizeDeps(targetPkg.peerDependencies);
  }
  if (targetPkg.optionalDependencies) {
      targetPkg.optionalDependencies = sanitizeDeps(targetPkg.optionalDependencies);
  }

  // Ensure basic fields
  if (!targetPkg.name) targetPkg.name = path.basename(process.cwd());
  if (!targetPkg.version) targetPkg.version = "0.1.0";
  if (!targetPkg.type) targetPkg.type = "module";
  if (!targetPkg.workspaces) targetPkg.workspaces = ["apps/*", "framework-mcp"];

  // Add metadata
  targetPkg.enderun = {
      version: sourcePkg.version || "0.0.0",
      initializedAt: new Date().toISOString(),
  };

  fs.writeFileSync(targetPath, JSON.stringify(targetPkg, null, 2));
  console.warn("✅ package.json updated with Enderun scripts and dependencies.");
}

export function sanitizeJson(obj: Record<string, unknown>, targetScope = ""): Record<string, unknown> {
    if (typeof obj !== "object" || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(item => sanitizeJson(item as Record<string, unknown>, targetScope)) as unknown as Record<string, unknown>;
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
        let finalKey = key;
        let finalValue = value;

        // Remove UnoCSS related keys or values
        if (typeof key === "string" && key.includes("unocss")) continue;
        if (typeof value === "string" && value.includes("unocss")) {
            continue; // Skip this script/field
        }

        // Replace scope if needed
        if (targetScope) {
            const scopeName = targetScope.startsWith("@") ? targetScope.slice(1) : targetScope;

            // Handle scoped: @ai-enderun/foo -> @target/foo
            if (typeof key === "string" && key.startsWith("@ai-enderun/")) {
                finalKey = key.replace("@ai-enderun/", `${targetScope}/`);
            }
            if (typeof value === "string" && value.startsWith("@ai-enderun/")) {
                finalValue = value.replace("@ai-enderun/", `${targetScope}/`);
            }

            // Handle unscoped: ai-enderun-foo -> target-foo
            if (typeof key === "string" && key.startsWith("ai-enderun-")) {
                finalKey = key.replace("ai-enderun-", `${scopeName}-`);
            }
            if (typeof value === "string" && value.startsWith("ai-enderun-")) {
                finalValue = value.replace("ai-enderun-", `${scopeName}-`);
            }
      
            // Handle agent-enderun -> target (ONLY for the package name)
            if (key === "name" && value === "agent-enderun") {
                finalValue = scopeName;
            }
      
            // Preserve agent-enderun in dependencies and bin
            // (No action needed as finalKey/finalValue default to original)

            if (typeof value === "string" && value.startsWith("workspace:")) {
                finalValue = "*";
            }
        } else if (typeof value === "string" && value.startsWith("workspace:")) {
            finalValue = "*";
        }

        cleaned[finalKey] = (typeof finalValue === "object" && finalValue !== null) ? sanitizeJson(finalValue as Record<string, unknown>, targetScope) : finalValue;
    }
    return cleaned;
}

export function deepCleanProtocols(dir: string, targetScope = ""): void {
    if (!fs.existsSync(dir)) return;
  
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === "node_modules" || entry.name === ".git") continue;
            deepCleanProtocols(fullPath, targetScope);
        } else if (entry.name === "package.json") {
            try {
                const content = fs.readFileSync(fullPath, "utf8");
                const json = JSON.parse(content);
                const cleaned = JSON.stringify(sanitizeJson(json, targetScope), null, 2);
                fs.writeFileSync(fullPath, cleaned);
            } catch {
                // ignore malformed json
            }
        } else if (entry.name === "package-lock.json") {
            fs.unlinkSync(fullPath);
        }
    }
}
