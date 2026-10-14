import { setPriority } from 'os';
import { toNamespacedPath } from 'path';
import * as vscode from 'vscode';

interface Options {
	/* Параметры которые включает в себя for, 
	i это name. i=0, 0 это start, позиция откуда мы начнем,
	i<10, 10 это end, позиция до куда мы идем,
	i++, это шаг - step*/
	name: string;
	start: number;
	end: number;
	step: number;
}

function Parsing(txt: string): Options {
	/* Принимает в себя txt типа string, возвращает интерфейс Options.
		функция делает парсинг строки на 4 ключевых аргумента name, start, end, step.
		name, start, end, step - параметры типа Options, лежащие в for.
		s: string - временная переменная для парсинга, для того что бы записать.
		в нее то, что идет в скобках for (...).
		flag: boolean - момент когда мы встречаем скобку.
		arr: string[] - уже распаршенный текст.
	*/
	console.log(txt);
	let name: string = 'i';
	let start: number = 0;
	let end: number = 10;
	let step: number = 1;
	let s: string = '';
	let flag: boolean = false;
	for (let i: number=0;i<txt.length;i++){
		if (txt[i] == ')'){
			flag = false;
		}
		if (flag){
			s += txt[i];
		}
		if (txt[i] == '('){
			flag = true;
		}
	}
	let arr: string[] = s.split(',').map(s => s.trim());
	name = arr[0];
	start = Number(arr[1]);
	end = Number(arr[2]);
	if (arr.length > 3){
		step = Number(arr[3]);
	}

	return {name, start, end, step};
}

function BuildFor(params: Options): string {
	/* принимает параметры Options, проверяет соответствие знаков
	 и возращает нужную строку правильного формата.
	если у нас i идет на уменьшение, то знаки меняются на противоположные
	*/
	let {name, start, end, step} = params;
	let znak: string = '<';
	let s: string = '+=';
	if (start > end){
		znak = '>'
		s = '-='
	}
	return `for (int ${name}=${start}; ${name} ${znak} ${end};${name} ${s} ${step}){\n	 \n}`;
}

export function activate(context: vscode.ExtensionContext) {
	// сообщение о том что комбинация нажата и дополнение активно
	console.log('Congratulations, your extension "extension-for-labwork3" is now active!');
	// регистрация команды под id insertCodeCommand
	const insertCodeCommand = vscode.commands.registerCommand('extension-for-labwork3.insertCodeCommand', () => {
        const editor = vscode.window.activeTextEditor; //editor - наш редактор
        if (!editor) {// если редактор не открыт
            vscode.window.showWarningMessage('Некуда вставлять код.');
            return;
        }
		/* editor.selection - выделенный текст
		editor.document.getText() - получение текста
		*/
		const Text = editor.document.getText(editor.selection) 
		// сперва парсим текст на аргумент а потом собираем в нормальный вид
		const insertionCode = BuildFor(Parsing(Text));
		editor.edit(editBuilder => {
			// замена выделенной строки на строку правильного вида for
            editBuilder.replace(editor.selection, insertionCode);
			vscode.window.showInformationMessage('done!');
        });
	});

	context.subscriptions.push(insertCodeCommand);
}

export function deactivate() {}
