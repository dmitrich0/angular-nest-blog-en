const cy = require('cypress');
const fse = require('fs-extra');
const {merge} = require('mochawesome-merge');
const generator = require('mochawesome-report-generator');

async function runTests() {
    await fse.emptydir('mochawesome-report');
    const {totalFailed} = await cy.run();
    const jsonReport = await merge();
    await generator.create(jsonReport, {inline: true});
    process.exit(totalFailed);
}

runTests();