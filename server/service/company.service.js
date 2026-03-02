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
}

module.exports = new CompanyService();
