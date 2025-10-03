const process = require("process");
const { faker } = require("@faker-js/faker");

module.exports = () => {
  const FAKER_SEED = process.env.FAKER_SEED;
  if (FAKER_SEED) {
    if (isNaN(Number(FAKER_SEED))) {
      throw new Error("The environment variable FAKER_SEED must be a number");
    }
    faker.seed(Number(FAKER_SEED));
  }
};
