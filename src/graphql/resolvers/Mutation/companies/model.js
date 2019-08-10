var Waterline = require("waterline");

export default Waterline.Collection.extend({
  identity: "test",
  datastore: "default",
  primaryKey: "id",

  attributes: {
    id: { type: "string" },
    foo: { type: "string" }
  }
});