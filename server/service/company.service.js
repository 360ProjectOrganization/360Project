// Business logic for companies
const companyRepository = require('../repository/company.repository');

class CompanyService {
  async getAllCompanies() {
    return await companyRepository.findAll();
  }

  async getCompanyById(id) {
    const company = await companyRepository.findById(id);
    if (!company) {
      throw new Error('Company not found');
    }
    return company;
  }

  async getCompanyJobPostings(companyId) {
    const company = await companyRepository.findById(companyId);
    if (!company) {
      throw new Error('Company not found');
    }
    return await companyRepository.findJobPostingsByCompanyId(companyId);
  }

  async getCompanyAnalytics(companyId) {
    const company = await companyRepository.findById(companyId);
    if (!company) {
      throw new Error('Company not found');
    }
    return await companyRepository.findAnalyticsByCompanyId(companyId);
  }

  async createJobPosting(companyId, data) {
    const company = await companyRepository.findById(companyId);
    if (!company) {
      throw new Error('Company not found');
    }
    if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
      throw new Error('Title is required');
    }
    return await companyRepository.createJobPostingForCompany(companyId, {
      title: data.title.trim(),
      location: data.location,
      description: data.description,
      tags: data.tags,
    });
  }
}

module.exports = new CompanyService();
