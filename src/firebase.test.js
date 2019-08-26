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
  const identifier = new Date().getTime().toString();
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

beforeAll(async () => {
  await firebase.loadFirestoreRules({ projectId, rules });
});

afterAll(async () => {
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

  it("require budget with all required fields to be saved", async () => {
    const uid = 'alice';
    const dbAuth = authedApp({ uid });
    const inputBudget = createBudget(1000, 'EUR');

    const budgetAuth = dbAuth
      .collection('users')
      .doc(uid)
      .collection('budgets')
      .doc(inputBudget.identifier);
    delete inputBudget['identifier'];
    await firebase.assertFails(budgetAuth.set({}));
  });

/*
  it("should enforce the createdAt date in user profiles", async () => {
    const db = authedApp({ uid: "alice" });
    const profile = db.collection("users").doc("alice");
    await firebase.assertFails(profile.set({ birthday: "January 1" }));
    await firebase.assertSucceeds(
      profile.set({
        birthday: "January 1",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
    );
  });

  it("should only let users create their own profile", async () => {
    const db = authedApp({ uid: "alice" });
    await firebase.assertSucceeds(
      db
        .collection("users")
        .doc("alice")
        .set({
          birthday: "January 1",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    );
    await firebase.assertFails(
      db
        .collection("users")
        .doc("bob")
        .set({
          birthday: "January 1",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    );
  });

  it("should let anyone read any profile", async () => {
    const db = authedApp(null);
    const profile = db.collection("users").doc("alice");
    await firebase.assertSucceeds(profile.get());
  });

  it("should let anyone create a room", async () => {
    const db = authedApp({ uid: "alice" });
    const room = db.collection("rooms").doc("firebase");
    await firebase.assertSucceeds(
      room.set({
        owner: "alice",
        topic: "All Things Firebase"
      })
    );
  });

  it("should force people to name themselves as room owner when creating a room", async () => {
    const db = authedApp({ uid: "alice" });
    const room = db.collection("rooms").doc("firebase");
    await firebase.assertFails(
      room.set({
        owner: "scott",
        topic: "Firebase Rocks!"
      })
    );
  });

  it("should not let one user steal a room from another user", async () => {
    const alice = authedApp({ uid: "alice" });
    const bob = authedApp({ uid: "bob" });

    await firebase.assertSucceeds(
      bob
        .collection("rooms")
        .doc("snow")
        .set({
          owner: "bob",
          topic: "All Things Snowboarding"
        })
    );

    await firebase.assertFails(
      alice
        .collection("rooms")
        .doc("snow")
        .set({
          owner: "alice",
          topic: "skiing > snowboarding"
        })
    );
  });*/
});
