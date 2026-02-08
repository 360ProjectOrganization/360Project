// seed script to add mock data
require('dotenv').config();
const { connectDB, closeDB } = require('../repository/connection');
const Applicant = require('../repository/models/applicant.model');
const Company = require('../repository/models/company.model');
const JobPosting = require('../repository/models/jobPosting.model');
const Administrator = require('../repository/models/administrator.model');
const fs = require('fs');
const path = require('path');

const MOCKFILES_DIR = path.join(__dirname, '../repository/models/mockfiles');

async function seed() {
  await connectDB();

  // load default pfp
  let defaultPfp;
  try {
    defaultPfp = fs.readFileSync(path.join(MOCKFILES_DIR, 'default_pfp.jpg'));
  } catch (err) {
    console.warn('Default pfp not found, seeding without pfp:', err.message);
  }

  const defaultApplicantFields = defaultPfp
    ? { pfp: defaultPfp, pfpContentType: 'image/jpeg' }
    : {};

  // clear existing collections
  await Applicant.deleteMany({});
  await Company.deleteMany({});
  await JobPosting.deleteMany({});
  await Administrator.deleteMany({});

  // create applicants 
  const applicants = await Applicant.insertMany([
    { email: 'alice@example.com', name: 'Alice Chen', password: 'mock123', ...defaultApplicantFields },
    { email: 'bob@example.com', name: 'Bob Smith', password: 'mock123', ...defaultApplicantFields },
    { email: 'carol@example.com', name: 'Carol Davis', password: 'mock123', ...defaultApplicantFields },
  ]);

  // create companies
  const companies = await Company.insertMany([
    { name: 'TechCorp', email: 'hr@techcorp.com', password: 'mock123' },
    { name: 'StartupXYZ', email: 'jobs@startupxyz.com', password: 'mock123' },
  ]);

  // create job postings
  const jobPostings = await JobPosting.insertMany([
    { title: 'Senior Frontend Developer', tags: ['React', 'JavaScript'], location: 'Remote', description: 'Build great UIs.' },
    { title: 'Backend Engineer', tags: ['Node.js', 'MongoDB'], location: 'Vancouver', description: 'APIs and databases.' },
    { title: 'Full Stack Developer', tags: ['React', 'Node.js'], location: 'Hybrid', description: 'End-to-end development.' },
  ]);

  // link job postings to companies
  await Company.findByIdAndUpdate(companies[0]._id, {
    jobPostings: [jobPostings[0]._id, jobPostings[1]._id],
  });
  await Company.findByIdAndUpdate(companies[1]._id, {
    jobPostings: [jobPostings[2]._id],
  });

  // link applicants to job postings
  await JobPosting.findByIdAndUpdate(jobPostings[0]._id, {
    applicants: [applicants[0]._id, applicants[1]._id],
  });
  await JobPosting.findByIdAndUpdate(jobPostings[1]._id, {
    applicants: [applicants[1]._id],
  });

  // create an admin
  await Administrator.create({
    email: 'admin@jobly.com',
    password: 'admin123',
  });

  console.log('Seed complete: applicants', applicants.length, 'companies', companies.length, 'job postings', jobPostings.length);
  await closeDB();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
