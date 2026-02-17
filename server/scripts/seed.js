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
  const applicants = [];
  for (const data of [
    { email: 'alice@example.com', name: 'Alice Chen', password: 'mock123', ...defaultApplicantFields },
    { email: 'bob@example.com', name: 'Bob Smith', password: 'mock123', ...defaultApplicantFields },
    { email: 'carol@example.com', name: 'Carol Davis', password: 'mock123', ...defaultApplicantFields },
    { email: 'dave@example.com', name: 'Dave Wilson', password: 'mock123', ...defaultApplicantFields },
    { email: 'eve@example.com', name: 'Eve Martinez', password: 'mock123', ...defaultApplicantFields },
  ]) {
    applicants.push(await Applicant.create(data));
  }

  // create companies
  const companies = [];
  for (const data of [
    { name: 'TechCorp', email: 'hr@techcorp.com', password: 'mock123' },
    { name: 'StartupXYZ', email: 'jobs@startupxyz.com', password: 'mock123' },
    { name: 'DataFlow Inc', email: 'careers@dataflow.io', password: 'mock123' },
    { name: 'CloudNine', email: 'talent@cloudnine.dev', password: 'mock123' },
  ]) {
    companies.push(await Company.create(data));
  }

  // dates for status analytics
  const now = new Date();
  const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

  // create job postings
  const jobPostings = await JobPosting.insertMany([
    // TechCorp
    { title: 'Senior Frontend Developer', tags: ['React', 'JavaScript'], location: 'Remote', description: 'Build great UIs.', status: 'ACTIVE', publishedAt: daysAgo(14) },
    { title: 'Backend Engineer', tags: ['Node.js', 'MongoDB'], location: 'Vancouver', description: 'APIs and databases.', status: 'CLOSED', publishedAt: daysAgo(45), closedAt: daysAgo(10) },
    { title: 'DevOps Engineer', tags: ['AWS', 'Docker', 'Kubernetes'], location: 'Remote', description: 'Infrastructure and CI/CD.', status: 'ACTIVE', publishedAt: daysAgo(7) },
    // StartupXYZ
    { title: 'Full Stack Developer', tags: ['React', 'Node.js'], location: 'Hybrid', description: 'End-to-end development.', status: 'CLOSED', publishedAt: daysAgo(60), closedAt: daysAgo(30) },
    { title: 'Junior Frontend Developer', tags: ['HTML', 'CSS', 'JavaScript'], location: 'Vancouver', description: 'Learn and grow with us.', status: 'ACTIVE', publishedAt: daysAgo(3) },
    { title: 'Product Manager', tags: ['Agile', 'Roadmap'], location: 'Remote', description: 'Define the vision.', status: 'UNPUBLISHED' },
    // DataFlow Inc
    { title: 'Data Engineer', tags: ['Python', 'Spark', 'SQL'], location: 'Toronto', description: 'Build data pipelines.', status: 'ACTIVE', publishedAt: daysAgo(21) },
    { title: 'ML Engineer', tags: ['Python', 'TensorFlow'], location: 'Remote', description: 'Production ML systems.', status: 'CLOSED', publishedAt: daysAgo(90), closedAt: daysAgo(20) },
    { title: 'Analytics Lead', tags: ['SQL', 'Tableau'], location: 'Hybrid', description: 'Drive insights.', status: 'ACTIVE', publishedAt: daysAgo(5) },
    // CloudNine
    { title: 'Cloud Architect', tags: ['AWS', 'Terraform'], location: 'Remote', description: 'Design cloud systems.', status: 'CLOSED', publishedAt: daysAgo(30), closedAt: daysAgo(2) },
    { title: 'Security Engineer', tags: ['Security', 'Compliance'], location: 'Vancouver', description: 'Secure our platform.', status: 'ACTIVE', publishedAt: daysAgo(14) },
    { title: 'SRE', tags: ['Linux', 'Monitoring'], location: 'Remote', description: 'Reliability and observability.', status: 'ACTIVE', publishedAt: daysAgo(1) },
  ]);

  // link job postings to companies
  await Company.findByIdAndUpdate(companies[0]._id, { jobPostings: [jobPostings[0]._id, jobPostings[1]._id, jobPostings[2]._id] });
  await Company.findByIdAndUpdate(companies[1]._id, { jobPostings: [jobPostings[3]._id, jobPostings[4]._id, jobPostings[5]._id] });
  await Company.findByIdAndUpdate(companies[2]._id, { jobPostings: [jobPostings[6]._id, jobPostings[7]._id, jobPostings[8]._id] });
  await Company.findByIdAndUpdate(companies[3]._id, { jobPostings: [jobPostings[9]._id, jobPostings[10]._id, jobPostings[11]._id] });

  // link applicants to job postings
  await JobPosting.findByIdAndUpdate(jobPostings[0]._id, { applicants: [applicants[0]._id, applicants[1]._id, applicants[2]._id, applicants[3]._id] });
  await JobPosting.findByIdAndUpdate(jobPostings[1]._id, { applicants: [applicants[0]._id, applicants[1]._id, applicants[2]._id] });
  await JobPosting.findByIdAndUpdate(jobPostings[2]._id, { applicants: [applicants[4]._id] });
  await JobPosting.findByIdAndUpdate(jobPostings[4]._id, { applicants: [applicants[0]._id, applicants[1]._id, applicants[2]._id, applicants[3]._id, applicants[4]._id] });
  await JobPosting.findByIdAndUpdate(jobPostings[6]._id, { applicants: [applicants[1]._id, applicants[3]._id] });
  await JobPosting.findByIdAndUpdate(jobPostings[7]._id, { applicants: [applicants[0]._id, applicants[2]._id, applicants[4]._id] });
  await JobPosting.findByIdAndUpdate(jobPostings[8]._id, { applicants: [applicants[3]._id] });
  await JobPosting.findByIdAndUpdate(jobPostings[9]._id, { applicants: [applicants[0]._id, applicants[1]._id, applicants[4]._id] });
  await JobPosting.findByIdAndUpdate(jobPostings[10]._id, { applicants: [applicants[2]._id] });
  await JobPosting.findByIdAndUpdate(jobPostings[11]._id, { applicants: [] });

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
