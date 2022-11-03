// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class EricWebviewProvider implements vscode.WebviewViewProvider {
  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.onDidReceiveMessage((message) => {
      console.log(`receive ${message}`);

      webviewView.webview.postMessage('ok, sidebar already received');
    });

    webviewView.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>hello world</title>
		</head>
		<body>
			<div> hello world</div>
			<script>
				(function() {
					const vscode = acquireVsCodeApi();

					vscode.postMessage('webview is initialized')

					window.addEventListener('message', event => {
						console.log(\`webview recevie \${event.data}\`)
					})
				})();
			</script>
		</body>
		</html>`;
  }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "my-vscode-extension" is now active!'
  );

  // 打开一个新网页
  const panel = vscode.window.createWebviewPanel(
    'hello world',
    'helloworld',
    vscode.ViewColumn.One
  );

  panel.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>hello world</title>
		</head>
		<body>
			<div> hello world</div>
		</body>
		</html>
	`;

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'my-vscode-extension.helloWorld',
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        'Hello World from my-vscode-extension!'
      );
    }
  );

  context.subscriptions.push(disposable);

  // 树
  // const treeDataProvider: vscode.TreeDataProvider<string> = {
  //   getChildren(text) {
  //     if (text) {
  //       return [1, 2, 3].map((num) => `sub${num}`);
  //     }
  //     return [1, 2, 3].map((num) => `main${num}`);
  //   },
  //   getTreeItem(label) {
  //     return {
  //       label,
  //       collapsibleState:
  //         label === 'main3'
  //           ? vscode.TreeItemCollapsibleState.Collapsed
  //           : vscode.TreeItemCollapsibleState.None,
  //     };
  //   },
  // };

  // 树视图
  // "views": {
  //   "demoView": [
  //     {
  //       "id": "ericTreeView",
  //       "name": "Webview sidebar"
  //     }
  //   ]
  // }
  // const treeview = vscode.window.createTreeView('ericTreeView', {
  //   treeDataProvider,
  // });

  // "views": {
  // 	"demoView": [
  // 		{
  // 			"type": "webview",
  // 			"id": "ericWebviewView",
  // 			"name": "Webview sidebar"
  // 		}
  // 	]
  // }
  // webview 嵌入到 sidebar
  vscode.window.registerWebviewViewProvider(
    'ericView',
    new EricWebviewProvider()
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
