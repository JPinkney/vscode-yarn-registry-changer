import * as vscode from 'vscode';
import { TextDecoder, TextEncoder } from 'util';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('registry-changer.select', () => {
		selectRegistry();
	});
	
	const yarnDefaultRegistry = vscode.workspace.getConfiguration('yarn').get('default.registry');
	if (yarnDefaultRegistry && yarnDefaultRegistry !== '') {
		findAndReplaceResolvedLocation(yarnDefaultRegistry as string);
	}

	context.subscriptions.push(disposable);
}

function selectRegistry() {
	const quickPick = vscode.window.createQuickPick();
	const registries = (vscode.workspace.getConfiguration('yarn').get('registries') || []) as string[];
	quickPick.items = registries.map(registry => createQuickPick(registry));
	quickPick.show();
	let val = '';
	quickPick.onDidChangeSelection(a => {
		val = a[0].label;
	});
	quickPick.onDidAccept(() => {
		quickPick.hide();
		findAndReplaceResolvedLocation(val);
		vscode.window.showInformationMessage('Changing your registry to use: ' + val);
	});
}

function findAndReplaceResolvedLocation(val: string) {
	vscode.workspace.findFiles('{**/yarn.lock}').then(files => {
		for (const file of files) {
			vscode.workspace.fs.readFile(file).then(async val3 => {
				let text = new TextDecoder().decode(val3);
				if (!val.endsWith('/')) {
					val += '/';
				}
				text = text.replace(/".*\/registry.npmjs.org\/|"https:\/\/registry.yarnpkg.com\//g, `\"${val}`);
				const encoded = new TextEncoder().encode(text);
				await vscode.workspace.fs.writeFile(file, encoded);
			});
		}
	});
}

function createQuickPick(label: string) {
	return {
		label
	} as vscode.QuickPickItem;
}

export function deactivate() {}
