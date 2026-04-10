// ensuring that the environment variables are set for the test envrionment
process.env.NODE_ENV = 'test';

if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/jobly_jest';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'jest-test-jwt-secret';
}
if (!process.env.PORT) {
  process.env.PORT = '5000';
}
if (!process.env.CLIENT_URL) {
  process.env.CLIENT_URL = 'http://localhost:5173';
}
