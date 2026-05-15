#!/usr/bin/env node

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

const contractPath = path.join(projectRoot, "packages/shared-types/contract.version.json");
const sharedTypesDir = path.join(projectRoot, "packages/shared-types/src");

function calculateHash(dir) {
  const hash = crypto.createHash("sha256");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".ts") || f.endsWith(".json")).sort();
  
  files.forEach(file => {
    const content = fs.readFileSync(path.join(dir, file));
    hash.update(content);
  });
  
  return hash.digest("hex");
}

try {
  console.log("🔍 Calculating shared-types contract hash...");
  const newHash = calculateHash(sharedTypesDir);
  
  const contract = JSON.parse(fs.readFileSync(contractPath, "utf-8"));
  
  if (contract.contract_hash === newHash) {
    console.log("✅ Contract hash is already up to date.");
  } else {
    contract.contract_hash = newHash;
    contract.last_updated = new Date().toISOString();
    fs.writeFileSync(contractPath, JSON.stringify(contract, null, 2));
    console.log(`🚀 Contract updated with new hash: ${newHash.slice(0, 10)}...`);
  }
} catch (error) {
  console.error("❌ Failed to update contract hash:", error.message);
  process.exit(1);
}
