import * as fs from 'fs';
import * as babelParser from '@babel/parser';
import chalk from "chalk";

interface CodeDuplication {
    code: string;
    lines1: number[];
    lines2: number[];
}

const detectCodeDuplication = (filename1: string, filename2: string): CodeDuplication[] => {

    const file1Content = fs.readFileSync(filename1, 'utf-8');
    const file2Content = fs.readFileSync(filename2, 'utf-8');

    const ast1 = babelParser.parse(file1Content, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
    const ast2 = babelParser.parse(file2Content, { sourceType: 'module', plugins: ['jsx', 'typescript'] });

    const duplications: CodeDuplication[] = [];

   const generateCodeFromNode = (node: any, filename: string, currentLines: number[], otherCode?: string): string => {
        const { start, end } = node.loc;
        const codeLines = fs.readFileSync(filename, 'utf-8').split('\n').slice(start.line - 1, end.line);
        currentLines.push(...Array.from({ length: end.line - start.line + 1 }, (_, i) => start.line + i - 1));
        return codeLines.join('\n');
    };

    const getLines = (node: any): number[] => {
        const { start, end } = node.loc;
        return Array.from({ length: end.line - start.line + 1 }, (_, i) => start.line + i);
    }

    const traverseAndCompare = (node1: any, node2: any, currentLines1: number[], currentLines2: number[]) => {
        if (node1 && node2 && node1.type === node2.type && node1.type === 'BlockStatement') {
            const code1 = generateCodeFromNode(node1, filename1, currentLines1);
            const code2 = generateCodeFromNode(node2, filename2, currentLines2);
            if (code1 === code2) {
                duplications.push({ code: code1, lines1: getLines(node1), lines2: getLines(node2) });
            }
        }

        if (node1 && typeof node1 === 'object' && node2 && typeof node2 === 'object') {
            for (const key of Object.keys(node1)) {
                if (key !== 'loc' && key !== 'range' && key !== 'start' && key !== 'end' && key !== 'comments' && key !== 'leadingComments' && key !== 'trailingComments') {
                    const childNode1 = node1[key];
                    const childNode2 = node2[key];
                    traverseAndCompare(childNode1, childNode2, currentLines1, currentLines2);
                }
            }
        }
    };


    traverseAndCompare(ast1, ast2, [], []);

    return duplications;
};

let duplications = detectCodeDuplication('file1.js', 'file2.js');

const filterDepthNode = duplications.filter((duplication) => {
    let depth = false;
    for (const duplication2 of duplications) {
        if (duplication.code !== duplication2.code &&
            duplication.lines1[0] >= duplication2.lines1[0] &&
            duplication.lines1[duplication.lines1.length - 1] <= duplication2.lines1[duplication2.lines1.length - 1]
        ) {
            depth = true;
            break;
        }
    }
    return !depth;
});

const outputFileName = 'duplications.txt';
const outputStream = fs.createWriteStream(outputFileName);
filterDepthNode.forEach((duplication, index) => {
    const lines: string[] = duplication.code.split('\n');
    outputStream.write(`Duplication ${index + 1}:\n`);
    outputStream.write("Code:\n");
    for(let i = 0; i < lines.length; i++) {
        outputStream.write(`${duplication.lines1[i]}: ${lines[i]}\n`);
    }
    outputStream.write("\n");
});
outputStream.end();

if(duplications.length !== filterDepthNode.length) {
    console.warn(chalk.blue(`\n${duplications.length} initial duplications detected.`));
    console.log(chalk.yellow(`WARN: ${duplications.length - filterDepthNode.length} depth children node duplications detected and removed of result.`));
}

console.log(chalk.green(`\n=> ${filterDepthNode.length} linears duplications detected and written to ${chalk.cyan(outputFileName)}`));
