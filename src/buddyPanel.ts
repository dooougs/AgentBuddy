import * as vscode from 'vscode';
import * as fs from 'fs';
import { AgentStage } from './extension';
import { getBuddyHTML } from './buddyHTML';

const AUDIO_STAGES: AgentStage[] = [
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

export class BuddyPanel implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly _context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
    const mediaRoot = vscode.Uri.joinPath(this._context.extensionUri, 'media');
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [mediaRoot]
    };
    webviewView.webview.html = getBuddyHTML(this.getStageAudioUris(webviewView.webview));
    webviewView.webview.onDidReceiveMessage((msg) => {
      if (msg.command === 'ready') {
        this.postStage('idle');
      }
    });
  }

  postStage(stage: AgentStage, meta?: Record<string, unknown>) {
    this._view?.webview.postMessage({ command: 'stage', stage, meta: meta ?? {} });
  }

  private getStageAudioUris(webview: vscode.Webview): Record<string, string[]> {
    const mediaPath = this._context.asAbsolutePath('media');
    const stageAudio: Record<string, string[]> = {};

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
