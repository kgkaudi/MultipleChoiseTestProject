const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    // Run route tests BEFORE integration tests
    const routeTests = [];
    const integrationTests = [];
    const otherTests = [];

    tests.forEach(test => {
      if (test.path.includes("routes")) routeTests.push(test);
      else if (test.path.includes("integration")) integrationTests.push(test);
      else otherTests.push(test);
    });

    return [...otherTests, ...routeTests, ...integrationTests];
  }
}

module.exports = CustomSequencer;
