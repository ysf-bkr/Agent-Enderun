#!/usr/bin/env node

/**
 * Agent Enderun — Hermes Protocol Stateful Simulation Sandbox
 * 
 * Demonstrates:
 * - Scenario 1: Autonomous task delegation.
 * - Scenario 2: High-risk admin action block & managerApproval injection.
 */

import fs from "fs";
import path from "path";

const MESSAGES_DIR = path.resolve("./.enderun/messages");
const TRACE_ID = "01H7K9P2Q3R4S5T6U7V8W9X0Z2";

console.log("🎬 STARTING HERMES PROTOCOL STATEFUL SANDBOX...");
console.log(`Trace ID: ${TRACE_ID}`);
console.log("--------------------------------------------------");

// Ensure messages directory exists
if (!fs.existsSync(MESSAGES_DIR)) {
    fs.mkdirSync(MESSAGES_DIR, { recursive: true });
}

// Clean up previous test messages
const cleanInbox = (agent) => {
    const p = path.join(MESSAGES_DIR, `${agent}.json`);
    if (fs.existsSync(p)) fs.unlinkSync(p);
};
cleanInbox("backend");
cleanInbox("manager");

function sendMessage(from, to, content, category = "INFO") {
    const messagePath = path.join(MESSAGES_DIR, `${to}.json`);
    const messages = fs.existsSync(messagePath) ? JSON.parse(fs.readFileSync(messagePath, "utf-8")) : [];
    
    const msg = {
        timestamp: new Date().toISOString(),
        from,
        to,
        traceId: TRACE_ID,
        category,
        priority: "HIGH",
        content,
        status: "PENDING"
    };
    
    messages.push(msg);
    fs.writeFileSync(messagePath, JSON.stringify(messages, null, 2));
    console.log(`📡 [Hermes Msg] ${from} ➡️ ${to} [${category}]: "${content}"`);
}

function readInbox(agent) {
    const messagePath = path.join(MESSAGES_DIR, `${agent}.json`);
    if (!fs.existsSync(messagePath)) return [];
    
    const messages = JSON.parse(fs.readFileSync(messagePath, "utf-8"));
    const pending = messages.filter(m => m.status === "PENDING" || m.status === "READ");
    
    // Mark as read
    const updated = messages.map(m => m.status === "PENDING" ? { ...m, status: "READ" } : m);
    fs.writeFileSync(messagePath, JSON.stringify(updated, null, 2));
    
    return pending;
}

function updateStatus(agent, traceId, status) {
    const messagePath = path.join(MESSAGES_DIR, `${agent}.json`);
    if (!fs.existsSync(messagePath)) return;
    
    const messages = JSON.parse(fs.readFileSync(messagePath, "utf-8"));
    const updated = messages.map(m => m.traceId === traceId ? { ...m, status } : m);
    fs.writeFileSync(messagePath, JSON.stringify(updated, null, 2));
    console.log(`🔒 [Hermes LifeCycle] Message on @${agent} marked as: ${status}`);
}

// --- STEP 1: @manager Delegates Task (Scenario 1) ---
console.log("\n[Step 1: Task Scaffolding & Briefing Delegation]");
sendMessage("manager", "backend", "Upgrade User 42 role to SuperAdmin inside target database.", "DELEGATION");

// --- STEP 2: @backend Reads & Detects High-Risk Action without approval (Scenario 2) ---
console.log("\n[Step 2: @backend Inbox Check & High-Risk Guard Trigger]");
const backendInbox1 = readInbox("backend");
const taskMsg = backendInbox1.find(m => m.category === "DELEGATION");

if (taskMsg) {
    console.log(`⚙️  @backend is processing delegation trace: ${taskMsg.traceId}`);
    console.log("⚠️  @backend security check: 'Upgrade User 42 role' detected as High-Risk Administrative Action!");
    console.log("❌ @backend security block: Action rejected due to missing 'managerApproval' signature payload!");
    
    sendMessage("backend", "manager", "ALERT: Cannot upgrade role for User 42. High-risk administrative action requires dynamic 'managerApproval' token.", "ALERT");
    updateStatus("backend", TRACE_ID, "REJECTED");
}

// --- STEP 3: @manager Processes Block, Generates Approval Token, Re-sends msg ---
console.log("\n[Step 3: @manager Token Generation & Re-Delegation]");
const managerInbox = readInbox("manager");
const alertMsg = managerInbox.find(m => m.category === "ALERT");

if (alertMsg) {
    console.log(`💡 @manager received alert: "${alertMsg.content}"`);
    console.log("🔐 @manager Dynamic Key Signing active...");
    
    const approvalToken = {
        approved: true,
        traceId: TRACE_ID,
        approvedBy: "@manager",
        approvedAt: new Date().toISOString(),
        reason: "Authorized Role Upgrade for Enterprise Compliance",
        riskLevel: "Critical",
        rollbackPlan: "Demote role back to standard User via database rollback script."
    };
    
    console.log("✅ managerApproval Token generated successfully:", JSON.stringify(approvalToken, null, 2));
    
    sendMessage("manager", "backend", `APPROVED: Here is the signed token: ${JSON.stringify(approvalToken)}`, "DELEGATION");
}

// --- STEP 4: @backend Receives Approval, Executes Simulated DDL/DML, Completes lifecycle ---
console.log("\n[Step 4: @backend final validation and execution]");
const backendInbox2 = readInbox("backend");
const approvedMsg = backendInbox2.find(m => m.category === "DELEGATION" && m.content.startsWith("APPROVED:"));

if (approvedMsg) {
    console.log("📥 @backend received approval token.");
    console.log("🛡️  @backend validation: managerApproval signature MATCHED.");
    console.log("🚀 @backend execution: Running mock SQL transaction... 'UPDATE users SET role = 'SuperAdmin' WHERE id = 42;'");
    console.log("📝 @backend logging: Audit log record generated with Trace ID.");
    
    sendMessage("backend", "manager", "SUCCESS: User 42 successfully upgraded to SuperAdmin. Trace record finalized.", "INFO");
    updateStatus("backend", TRACE_ID, "COMPLETED");
}

console.log("\n--------------------------------------------------");
console.log("🎉 HERMES STATEFUL SIMULATION COMPLETED SUCCESSFULLY!");
