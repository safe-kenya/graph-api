const { name } = require("./about.js")

const list = async (root, args, { db: { collections } }) => {
  const entries = await collections[name].find({
    where: {
      isDeleted: false
    }
  });
  return entries;
};

const listDeleted = async (root, args, { db: { collections } }) => {
  const entries = await collections[name].find({
    where: {
      isDeleted: true
    }
  });
  return entries;
};

const single = async (root, args, { db: { collections } }) => {
  const { id } = args[name];

  const entry = await collections[name].findOne({
    where: { id, isDeleted: false }
  });
  return entry;
};

const nested = {
  [name]: {
    async driver(root, args, { db: { collections } }) {
      const entry = await collections["driver"].findOne({
        where: { id: root.driver, isDeleted: false }
      });
      return entry;
    }
  },
  driver: {
    async bus(root, args, { db: { collections } }) {
      const entry = await collections["bus"].findOne({
        where: { driver: root.id, isDeleted: false }
      });
      return entry;
    }
  }
}

export { list, single, listDeleted, nested };
