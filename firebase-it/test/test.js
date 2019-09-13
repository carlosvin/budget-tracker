const firebase = require("@firebase/testing");
const fs = require("fs");

/*
 * ============
 *    Setup
 * ============
 */
const projectId = "firestore-emulator-example";
const firebasePort = require("../firebase.json").emulators.firestore.port;
const port = firebasePort /** Exists? */ ? firebasePort : 8080;
const coverageUrl = `http://localhost:${port}/emulator/v1/projects/${projectId}:ruleCoverage.html`;

const rules = fs.readFileSync("firestore.rules", "utf8");

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth) {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
}

/*
 * ============
 *  Test Cases
 * ============
 */


function createBudget (currency, total, days = 30) {
  const from = new Date('2019/1/1');
  const to = from + (3600 * 24 * days);
  const identifier = Date.now().toString();
  return { 
      currency,
      from,
      to,
      identifier,
      name: 'Name ' + identifier,
      total
  };
}

beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId });
});

before(async () => {
  await firebase.loadFirestoreRules({ projectId, rules });
});

after(async () => {
  await Promise.all(firebase.apps().map(app => app.delete()));
  console.log(`View rule coverage information at ${coverageUrl}\n`);
});

describe("Budget tracker", () => {
  it("require logged in users to read/write only its own budgets", async () => {
    const uid = 'alice';
    const db = authedApp(null);
    const inputBudget = createBudget(1000, 'EUR');
    const budget = db.collection('users').doc(uid).collection('budgets').doc(inputBudget.identifier);
    await firebase.assertFails(budget.set(inputBudget));
    await firebase.assertFails(budget.get());

    const dbAuth = authedApp({ uid });
    const budgetAuth = dbAuth
      .collection('users')
      .doc(uid)
      .collection('budgets')
      .doc(inputBudget.identifier);
    await firebase.assertSucceeds(budgetAuth.set(inputBudget));
    await firebase.assertSucceeds(budgetAuth.get());
  });

  it.skip("require budget with all required fields to be saved", async () => {
    const uid = 'alice';
    const dbAuth = authedApp({ uid });
    const inputBudget = createBudget(1000, 'EUR');

    const budgetAuth = dbAuth
      .collection('users')
      .doc(uid)
      .collection('budgets')
      .doc(inputBudget.identifier);
    delete inputBudget.identifier;
    await firebase.assertFails(budgetAuth.set(inputBudget));
  });

});
