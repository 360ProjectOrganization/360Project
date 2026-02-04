// archive of the schema before it was rewritten for mongoose

db.createCollection("companies", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "companies",
      required: ["c_id"],
      properties: {
        "c_id": { bsonType: "objectId" },
        "name": { bsonType: "string" },
        "email": { bsonType: "string" },
        "password": { bsonType: "string" },
        "pfp": { bsonType: "string" },
        "jobPostings": { bsonType: "array", items: { bsonType: "objectId" } },
      },
    },
  },
});

db.createCollection("applicants", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "applicants",
      required: ["a_id"],
      properties: {
        "a_id": { bsonType: "objectId" },
        "email": { bsonType: "string" },
        "name": { bsonType: "string" },
        "password": { bsonType: "string" },
        "pfp": { bsonType: "binData" },
        "resume": { bsonType: "binData" },
      },
    },
  },
});

db.createCollection("jobPostings", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "jobPostings",
      required: ["j_id"],
      properties: {
        "j_id": { bsonType: "objectId" },
        "title": { bsonType: "string" },
        "tags": { bsonType: "array", items: { bsonType: "string" } },
        "location": { bsonType: "string" },
        "description": { bsonType: "string" },
        "applicants": { bsonType: "array", items: { bsonType: "objectId" } },
      },
    },
  },
});

db.createCollection("administrators", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "administrators",
      required: ["ad_id"],
      properties: {
        "ad_id": { bsonType: "objectId" },
        "email": { bsonType: "string" },
        "password": { bsonType: "string" },
      },
    },
  },
});