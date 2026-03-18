"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const buddyPanel_1 = require("./buddyPanel");
function activate(context) {
    const panel = new buddyPanel_1.BuddyPanel(context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('agentBuddy.panel', panel, {
        webviewOptions: { retainContextWhenHidden: true }
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('agentBuddy.muted')) {
            panel.syncSettings();
        }
    }));
    let idleTimer;
    let sleepTimer;
    let lastStage = 'idle';
    let editBurstCount = 0;
    let editBurstTimer;
    const setStage = (stage, meta) => {
        lastStage = stage;
        panel.postStage(stage, meta);
        // Reset idle → sleep cascade
        clearTimeout(idleTimer);
        clearTimeout(sleepTimer);
        if (stage === 'idle') {
            sleepTimer = setTimeout(() => panel.postStage('sleeping'), 4 * 60 * 1000);
        }
    };
    const touchActivity = () => {
        clearTimeout(idleTimer);
        clearTimeout(sleepTimer);
        if (lastStage === 'sleeping' || lastStage === 'idle') {
            setStage('idle');
        }
        idleTimer = setTimeout(() => setStage('idle'), 8000);
    };
    // ── DIAGNOSTICS → error / success ──────────────────────────────────────
    context.subscriptions.push(vscode.languages.onDidChangeDiagnostics((e) => {
        let errors = 0;
        let warnings = 0;
        for (const uri of e.uris) {
            for (const d of vscode.languages.getDiagnostics(uri)) {
                if (d.severity === vscode.DiagnosticSeverity.Error)
                    errors++;
                if (d.severity === vscode.DiagnosticSeverity.Warning)
                    warnings++;
            }
        }
        if (errors > 0) {
            setStage('error', { errors, warnings });
        }
        else if (lastStage === 'error') {
            setStage('success');
            setTimeout(() => setStage('idle'), 3000);
        }
        touchActivity();
    }));
    // ── TEXT CHANGES → editing / planning (burst detection) ────────────────
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document.uri.scheme !== 'file')
            return;
        touchActivity();
        editBurstCount += e.contentChanges.length;
        clearTimeout(editBurstTimer);
        editBurstTimer = setTimeout(() => {
            if (editBurstCount > 20) {
                // Large burst = agent is making sweeping edits
                setStage('editing', { lines: editBurstCount });
            }
            editBurstCount = 0;
        }, 400);
        if (lastStage !== 'editing' && lastStage !== 'error') {
            setStage('editing');
        }
    }));
    // ── FILE SAVE → could be agent completing a task ────────────────────────
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(() => {
        touchActivity();
        if (lastStage === 'editing') {
            setStage('thinking'); // brief pause after save = "reviewing"
            setTimeout(() => {
                if (lastStage === 'thinking')
                    setStage('idle');
            }, 2000);
        }
    }));
    // ── TERMINAL ACTIVITY → terminal stage ─────────────────────────────────
    context.subscriptions.push(vscode.window.onDidOpenTerminal(() => {
        touchActivity();
        setStage('terminal');
    }));
    context.subscriptions.push(vscode.window.onDidCloseTerminal(() => {
        if (lastStage === 'terminal') {
            setStage('thinking');
            setTimeout(() => {
                if (lastStage === 'thinking')
                    setStage('idle');
            }, 2500);
        }
    }));
    // ── ACTIVE EDITOR CHANGE → searching / planning ────────────────────────
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (!editor)
            return;
        touchActivity();
        // Rapid file switching = agent is navigating/searching
        if (lastStage !== 'editing' && lastStage !== 'terminal') {
            setStage('searching');
            setTimeout(() => {
                if (lastStage === 'searching')
                    setStage('thinking');
            }, 1500);
        }
    }));
    // ── LM API REQUESTS → thinking (when available) ────────────────────────
    // vscode.lm is available in VS Code 1.90+
    try {
        const lm = vscode.lm;
        if (lm?.onDidChangeChatModels) {
            // Proxy: when models change it often means a request just completed
            context.subscriptions.push(lm.onDidChangeChatModels(() => {
                setStage('thinking');
                touchActivity();
            }));
        }
    }
    catch (_) { /* not available */ }
    // ── DEBUG SESSION → planning ────────────────────────────────────────────
    context.subscriptions.push(vscode.debug.onDidStartDebugSession(() => {
        setStage('planning');
        touchActivity();
    }));
    context.subscriptions.push(vscode.debug.onDidTerminateDebugSession(() => {
        setStage('thinking');
        setTimeout(() => setStage('idle'), 2000);
    }));
    // ── SIMULATE COMMAND (for demo/dev) ────────────────────────────────────
    const stages = ['thinking', 'planning', 'searching', 'editing', 'terminal', 'success', 'idle', 'sleeping'];
    let simIdx = 0;
    context.subscriptions.push(vscode.commands.registerCommand('agentBuddy.simulate', () => {
        setStage(stages[simIdx % stages.length]);
        simIdx++;
    }));
    // Initial state
    setStage('idle');
    sleepTimer = setTimeout(() => panel.postStage('sleeping'), 4 * 60 * 1000);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map