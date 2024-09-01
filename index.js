import chalk from 'chalk';
import { error } from 'console';
import readline from 'readline';

// MARK: Constant Values

const VALID_CHARS_UPPERCASED_ALPHABETICAL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const VALID_CHARS_LOWERCASED_ALPHABETICAL = 'abcdefghijklmnopqrstuvwxyz';
const VALID_CHARS_ALPHABETICAL = VALID_CHARS_UPPERCASED_ALPHABETICAL + VALID_CHARS_LOWERCASED_ALPHABETICAL;
const VALID_CHARS_NUMERICAL = '1234567890';
const VALID_CHARS_SYMBOLS = '!@$%^&*+#_.-';

const EXIT_CODES = ['exit', 'quit', 'q', 'bye', 'close', 'end', 'stop', 'terminate', 'done', 'finish', 'finished'];

// MARK: Helper Functions

function getSetOfValidCharactersAsString(isAlphabetIncluded, areNumbersIncluded, areSymbolsIncluded) {
    return '' +
        (isAlphabetIncluded ? VALID_CHARS_ALPHABETICAL : '') +
        (areNumbersIncluded ? VALID_CHARS_NUMERICAL : '') +
        (areSymbolsIncluded ? VALID_CHARS_SYMBOLS : '');
}

// MARK: Main Loop
// TODO: Create a second generator for memorable passwords 

const log = console.log;
const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const isExitCode = (str) => {
    return EXIT_CODES.includes(str.toLowerCase());
}
const requestUserInput = (query) => {
    return new Promise((resolve) => {
        reader.question(query, (response) => {
            resolve(response);
        });
    });
}

const session = {
    isUserFinished: false,
    options: {
        desiredCharacterLength: {
            key: "Length",
            value: 24
        },
        // TODO: Desired mix of upper/lower alphabetical characters option as percent
        shouldDisplayGeneratedPassword: {
            key: "DisplayPassword",
            value: false
        },
        shouldCopyGeneratedPasswordToClipboard: {
            key: "CopyToClipboard",
            value: true
        },
        shouldIncludeAlphabet: {
            key: "Alphabet",
            value: true
        },
        shouldIncludeNumbers: {
            key: "Numbers",
            value: true
        },
        shouldIncludeSymbols: {
            key: "Symbols",
            value: true
        }
    }
}

const printSimpleCommandInstruction = (syntax, effect) => {
    const colorSyntax = chalk.italic(`${syntax}`);
    log(`${chalk.gray('-')} ${colorSyntax} ${chalk.gray(':')} ${effect}`);
}

const printTitleSection = () => {
    log('');
    log(chalk.bold.blue('Password Generator by T0xicTyler'));
    printSimpleCommandInstruction('Generate', 'Generate a password');
    printSimpleCommandInstruction('? <Option>', 'View the description for a Command or Option');
    printSimpleCommandInstruction('?', 'List all available Commands and Options');
}

const yesNoString = (bool) => {
    if (typeof(bool) !== 'boolean') {
        error(`Unable to generate yes/no string from non-boolean type: ${typeof(bool)}`);
        return chalk.red('ERROR');
    }

    return bool ? chalk.green('Yes') : chalk.red('No');
}

const printOptionStatus = (option) => {
    const {key, value} = option;
    const fmtKey   = `${chalk.underline(key)}`;
    const fmtValue = typeof(value) === 'boolean' ? yesNoString(value) : `${chalk.yellow(value)}`;
    log(`${chalk.gray('>')} ${fmtKey}: ${fmtValue}`);
}

const printOptionsSection = () => {
    log(chalk.blue('Options:'));
    printOptionStatus(session.options.desiredCharacterLength);
    printOptionStatus(session.options.shouldDisplayGeneratedPassword);
    printOptionStatus(session.options.shouldCopyGeneratedPasswordToClipboard);
}

const printCharacterTogglesSection = () => {
    log(chalk.blue('Included Characters:'));
    printOptionStatus(session.options.shouldIncludeAlphabet);
    printOptionStatus(session.options.shouldIncludeNumbers);
    printOptionStatus(session.options.shouldIncludeSymbols);
}

const printSessionDetails = () => {
    printTitleSection();
    printOptionsSection();
    printCharacterTogglesSection();
}

async function runSession() {
    while (!session.isUserFinished) {
        printSessionDetails();
        log('');

        const response = await requestUserInput(`Enter a ${chalk.italic('Command')} or ${chalk.underline('Option')}: `);

        log(`Hello ${response}!`);

        if (isExitCode(response)) {
            log(`Thank you for using ${chalk.blue('Password Generator')}`);
            session.isUserFinished = true;
        }
    }

    reader.close();
}

runSession();