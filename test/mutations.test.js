// Import the dependencies for testing
import chai from "chai";
import chaiHttp from "chai-http";
var rimraf = require("rimraf");
import app from "../src/server";

// Configure chai
chai.use(chaiHttp);
chai.should();
var expect = chai.expect;

const sharedInfo = {};

rimraf(".tmp/localDiskDb/*", () => {
  console.log("  Cleared setup dir");
});

describe("Setup", () => {
  before(function (done) {
    this.timeout(1000); // wait for db connections etc.

    setTimeout(done, 500);
  });

  describe("OPS", function () {
    // Test to get all students record
    it("Health check should return 200", done => {
      chai
        .request(app)
        .get("/health")
        .end((err, res) => {
          res.should.have.status(200);

          done();
        });
    });

    it("Graphql responds hello", done => {
      chai
        .request(app)
        .post("/graph")
        .set("content-type", "application/json")
        .send({ query: "{hello}" })
        .end((err, res) => {
          res.should.have.status(200);

          done();
        });
    });
  });
});

describe("Admins", () => {
  it("Can create an admin", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($Iadmin: Iadmin!) {
            admins {
              create(admin: $Iadmin) {
                id
              }
            }
          }            
        `,
        variables: {
          "Iadmin": {
            "username": "test",
            "email": "test",
            "password": "test"
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.admins.create.id).to.be.a.string;

        sharedInfo.adminId = res.body.data.admins.create.id
        done();
      });
  });

  it("Can update an admin", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($admin: Uadmin!) {
            admins {
              update(admin: $admin) {
                id
              }
            }
          }            
        `,
        variables: {
          "admin": {
            "id": sharedInfo.adminId,
            "username": "tested"
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.admins.update.id).to.be.a.string;
        done();
      });
  });

  it("Can nuke an admin", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($Iadmin: Uadmin!) {
            admins {
              delete(admin: $Iadmin) {
                id
              }
            }
          }                  
        `,
        variables: {
          "Iadmin": {
            "id": sharedInfo.adminId
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.admins.delete).to.be.null;
        done();
      });
  });

  it("Can restore an admin", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($Iadmin: Uadmin!) {
            admins {
              restore(admin: $Iadmin) {
                id
              }
            }
          }                  
        `,
        variables: {
          "Iadmin": {
            "id": sharedInfo.adminId
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        // expect(res.body.data.admins.restore.id).to.be.string;
        done();
      });
  });

  it("Can fetch restored admin", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
        {
          admins{
            id
          }
        }        
        `
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.admins[0].id).to.be.a.string;

        done();
      });
  });
})

describe("Routes", () => {
  it("Can create an route", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($Iroute: Iroute!) {
            routes {
              create(route: $Iroute) {
                id
              }
            }
          }            
        `,
        variables: {
          "Iroute": {
            "name": "marwa"
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.routes.create.id).to.be.a.string;

        sharedInfo.routeId = res.body.data.routes.create.id
        done();
      });
  });

  it("Can update an route", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($route: Uroute!) {
            routes {
              update(route: $route) {
                id
              }
            }
          }            
        `,
        variables: {
          "route": {
            "id": sharedInfo.routeId,
            "name": "tested"
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.routes.update.id).to.be.a.string;
        done();
      });
  });

  it("Can nuke an route", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($Iroute: Uroute!) {
            routes {
              delete(route: $Iroute) {
                id
              }
            }
          }                  
        `,
        variables: {
          "Iroute": {
            "id": sharedInfo.routeId
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.routes.delete).to.be.null;
        done();
      });
  });

  it("Can restore an route", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($Iroute: Uroute!) {
            routes {
              restore(route: $Iroute) {
                id
              }
            }
          }                  
        `,
        variables: {
          "Iroute": {
            "id": sharedInfo.routeId
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        // expect(res.body.data.routes.restore.id).to.be.string;
        done();
      });
  });

  it("Can fetch restored route", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
        {
          routes{
            id
          }
        }        
        `
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.routes[0].id).to.be.a.string;

        done();
      });
  });
})

describe("Drivers", () => {
  it("Can create an driver", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($Idriver: Idriver!) {
            drivers {
              create(driver: $Idriver) {
                id
              }
            }
          }
      `,
        variables: {
          "Idriver": {
            "username": "marwa",
            "email": "test",
            "phone": "test",
            "password": "12345"
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.drivers.create.id).to.be.a.string;

        sharedInfo.driverId = res.body.data.drivers.create.id
        done();
      });
  });

  it("Can update an driver", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($driver: Udriver!) {
            drivers {
              update(driver: $driver) {
                id
              }
            }
          }            
        `,
        variables: {
          "driver": {
            "id": sharedInfo.driverId,
            "username": "marwaed",
            "email": "test",
            "phone": "test",
            "password": "12345"
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.drivers.update.id).to.be.a.string;
        done();
      });
  });

  it("Can nuke an driver", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($Idriver: Udriver!) {
            drivers {
              delete(driver: $Idriver) {
                id
              }
            }
          }                  
        `,
        variables: {
          "Idriver": {
            "id": sharedInfo.driverId
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.drivers.delete).to.be.null;
        done();
      });
  });

  it("Can restore an driver", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($Idriver: Udriver!) {
            drivers {
              restore(driver: $Idriver) {
                id
              }
            }
          }                  
        `,
        variables: {
          "Idriver": {
            "id": sharedInfo.driverId
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        // expect(res.body.data.drivers.restore.id).to.be.string;
        done();
      });
  });

  it("Can fetch restored driver", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
        {
          drivers{
            id
          }
        }        
        `
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.drivers[0].id).to.be.a.string;

        done();
      });
  });
})


describe("Busses", () => {
  it("Can create an bus", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
        mutation ($Ibus: Ibus!) {
          buses {
            create(bus: $Ibus) {
              id
            }
          }
        }
        `,
        variables: {
          "Ibus": {
            "make": "marwa",
            "plate": "test",
            "size": 2
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.buses.create.id).to.be.a.string;

        sharedInfo.busId = res.body.data.buses.create.id
        done();
      });
  });

  it("Can update an bus", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($bus: Ubus!) {
            buses {
              update(bus: $bus) {
                id
              }
            }
          }            
        `,
        variables: {
          "bus": {
            "id": sharedInfo.busId,
            "make": "marwaed",
            "plate": "test",
            "size": 3
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.buses.update.id).to.be.a.string;
        done();
      });
  });

  it("Can nuke an bus", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($Ibus: Ubus!) {
            buses {
              delete(bus: $Ibus) {
                id
              }
            }
          }                  
        `,
        variables: {
          "Ibus": {
            "id": sharedInfo.busId
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.buses.delete).to.be.null;
        done();
      });
  });

  it("Can restore an bus", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($Ibus: Ubus!) {
            buses {
              restore(bus: $Ibus) {
                id
              }
            }
          }                  
        `,
        variables: {
          "Ibus": {
            "id": sharedInfo.busId
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        // expect(res.body.data.buss.restore.id).to.be.string;
        done();
      });
  });

  it("Can fetch restored bus", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
        {
          buses{
            id
          }
        }        
        `
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.buses[0].id).to.be.a.string;

        done();
      });
  });
})

describe("Students", () => {
  it("Can create an student", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($Istudent: Istudent!) {
            students {
              create(student: $Istudent) {
                id
              }
            }
          }
        `,
        variables: {
          "Istudent": {
            "name": "marwa",
            "route": "test",
            "gender": "FEMALE",
            "parent": "test"
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.students.create.id).to.be.a.string;

        sharedInfo.studentId = res.body.data.students.create.id
        done();
      });
  });

  it("Can update an student", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
        mutation ($student: Ustudent!) {
          students {
            update(student: $student) {
              id
            }
          }
        }                 
        `,
        variables: {
          "student": {
            "id": sharedInfo.studentId,
            "name": "marwa",
            "route": "test",
            "gender": "MALE",
            "parent": "test"
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.students.update.id).to.be.a.string;
        done();
      });
  });

  it("Can nuke an student", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($Istudent: Ustudent!) {
            students {
              delete(student: $Istudent) {
                id
              }
            }
          }                  
        `,
        variables: {
          "Istudent": {
            "id": sharedInfo.studentId
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.students.delete).to.be.null;
        done();
      });
  });

  it("Can restore an student", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($Istudent: Ustudent!) {
            students {
              restore(student: $Istudent) {
                id
              }
            }
          }                  
        `,
        variables: {
          "Istudent": {
            "id": sharedInfo.studentId
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        // expect(res.body.data.students.restore.id).to.be.string;
        done();
      });
  });

  it("Can fetch restored student", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
        {
          students{
            id
          }
        }        
        `
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.students[0].id).to.be.a.string;

        done();
      });
  });
})

describe("Parent", () => {
  it("Can create an parent", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($Iparent: Iparent!) {
            parents {
              create(parent: $Iparent) {
                id
              }
            }
          }
        `,
        variables: {
          "Iparent": {
            "name": "marwa",
            "phone": "test",
            "email": "FEMALE",
            "gender": "MALE"
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.parents.create.id).to.be.a.string;

        sharedInfo.parentId = res.body.data.parents.create.id
        done();
      });
  });

  it("Can update an parent", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
        mutation ($parent: Uparent!) {
          parents {
            update(parent: $parent) {
              id
            }
          }
        }
      `,
        variables: {
          "parent": {
            "id": sharedInfo.parentId,
            "name": "marwaed",
            "phone": "test",
            "email": "FEMALE",
            "gender": "MALE"
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.parents.update.id).to.be.a.string;
        done();
      });
  });

  it("Can nuke an parent", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($Iparent: Uparent!) {
            parents {
              delete(parent: $Iparent) {
                id
              }
            }
          }                  
        `,
        variables: {
          "Iparent": {
            "id": sharedInfo.parentId
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.parents.delete).to.be.null;
        done();
      });
  });

  it("Can restore an parent", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
          mutation ($Iparent: Uparent!) {
            parents {
              restore(parent: $Iparent) {
                id
              }
            }
          }                  
        `,
        variables: {
          "Iparent": {
            "id": sharedInfo.parentId
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        // expect(res.body.data.parents.restore.id).to.be.string;
        done();
      });
  });

  it("Can fetch restored parent", done => {
    chai
      .request(app)
      .post("/graph")
      .set("content-type", "application/json")
      .send({
        query: `
        {
          parents{
            id
          }
        }        
        `
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.not.be.null;
        expect(res.body.errors).to.not.exist;
        expect(res.body.data.parents[0].id).to.be.a.string;

        done();
      });
  });
})
