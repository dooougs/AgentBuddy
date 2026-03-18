"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuddyPanel = void 0;
const buddyHTML_1 = require("./buddyHTML");
class BuddyPanel {
    constructor(_context) {
        this._context = _context;
    }
    resolveWebviewView(webviewView) {
        this._view = webviewView;
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = (0, buddyHTML_1.getBuddyHTML)();
        webviewView.webview.onDidReceiveMessage((msg) => {
            if (msg.command === 'ready') {
                this.postStage('idle');
            }
        });
    }
    postStage(stage, meta) {
        this._view?.webview.postMessage({ command: 'stage', stage, meta: meta ?? {} });
    }
}
exports.BuddyPanel = BuddyPanel;
//# sourceMappingURL=buddyPanel.js.map