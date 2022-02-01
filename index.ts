#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";
import inquirer from "inquirer";
import fs from "fs";
import open from "open";

let loop = true;

let lastText = "Hello World";
let lastFont = "";

(async () => {
    while (loop) {
        const fonts = figlet.fontsSync().map(font => {
            return {
                name: font,
                value: font
            }
        })
        const ask = await inquirer.prompt([
            {
                type: "input",
                message: "What do you want to say?",
                name: "text",
                default: lastText
            },
            {
                type: "list",
                choices: fonts,
                message: "Which font do you want to use?",
                name: "font",
                default: lastFont
            },
            {
                type: "checkbox",
                choices: [
                    {
                        checked: true,
                        name: "Generate File",
                        value: "file",
                    },
                    {
                        checked: false,
                        name: "Log to console",
                        value: "log"
                    }
                ],
                validate(a) {
                    if (a.length < 1) {
                      return 'At least one output method is required!';
                    }
            
                    return true;
                },
                name: "outputs",
            },
            {
                type: "confirm",
                message: "Open the file?",
                name: "open",
                default: false,
                when: (answers) => {
                    return answers.outputs.includes("file")
                }
            },
        ])

        lastFont = ask.font;

        lastText = ask.text;

        if(ask.outputs.includes("file")) await fs.writeFileSync(`${__dirname}\\ascii.txt`, figlet.textSync(ask.text, ask.font));

        if(ask.outputs.includes("log")) console.log(gradient("#00ff00", "#00ff99")(figlet.textSync(ask.text, ask.font)));
        else console.log(gradient("#00ff00", "#00ff99")(figlet.textSync("DONE!", "3-D")));

        if(ask.open == true) {
            await open(`${__dirname}\\ascii.txt`)
        }

        const ask2 = await inquirer.prompt([
            {
                type: "confirm",
                message: "Do you want to make another ascii text?",
                name: "repeat",
                default: true
            }
        ])
    
        loop = ask2.repeat;
    }
})()