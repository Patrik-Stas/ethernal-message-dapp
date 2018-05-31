const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);


const eboardPath = path.resolve(__dirname, 'contracts', 'EthernalMessageBook.sol');
const source = fs.readFileSync(eboardPath, 'utf8');

console.log("Compiling solidity code.");
const fullCompileOutput = solc.compile(source, 1);
const contracts = fullCompileOutput.contracts;

fs.ensureDirSync(buildPath);

console.log("Saving full contracts");
for (let contract in contracts) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':','') + '.bytecode.json'),
        contracts[contract].bytecode
    );
}

console.log("Saving interfaces");
for (let contract in contracts) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':','') + '.interface.json'),
        contracts[contract].interface
    );
}
