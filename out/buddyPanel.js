"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuddyPanel = void 0;
const vscode = require("vscode");
const fs = require("fs");
const buddyHTML_1 = require("./buddyHTML");
const AUDIO_STAGES = [
    'idle',
    'thinking',
    'planning',
    'searching',
    'editing',
    'terminal',
    'success',
    'error',
    'sleeping'
];
class BuddyPanel {
    constructor(_context) {
        this._context = _context;
    }
    resolveWebviewView(webviewView) {
        this._view = webviewView;
        const mediaRoot = vscode.Uri.joinPath(this._context.extensionUri, 'media');
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [mediaRoot]
        };
        webviewView.webview.html = (0, buddyHTML_1.getBuddyHTML)(this.getStageAudioUris(webviewView.webview));
        webviewView.webview.onDidReceiveMessage((msg) => {
            if (msg.command === 'ready') {
                this.postStage('idle');
            }
        });
    }
    postStage(stage, meta) {
        this._view?.webview.postMessage({ command: 'stage', stage, meta: meta ?? {} });
    }
    getStageAudioUris(webview) {
        const mediaPath = this._context.asAbsolutePath('media');
        const stageAudio = {};
        for (const stage of AUDIO_STAGES) {
            const candidates = [
                `${stage}.ogg`,
                `${stage}.mp3`,
                `audio/${stage}.ogg`,
                `audio/${stage}.mp3`,
            ];
            const uris = candidates
                .map((relativePath) => ({
                filePath: this._context.asAbsolutePath(`media/${relativePath}`),
                uri: vscode.Uri.joinPath(this._context.extensionUri, 'media', ...relativePath.split('/'))
            }))
                .filter((candidate) => candidate.filePath.startsWith(mediaPath) && fs.existsSync(candidate.filePath))
                .map((candidate) => webview.asWebviewUri(candidate.uri).toString());
            if (uris.length) {
                stageAudio[stage] = uris;
            }
        }
        return stageAudio;
    }
}
exports.BuddyPanel = BuddyPanel;
//# sourceMappingURL=buddyPanel.js.map