const SERVER_PORT = process.env["SERVER_PORT"] || 5000;
const RABBITMQ_USERNAME = process.env["RABBITMT_USERNAME"] || "guest";
const RABBITMQ_PASSWORD = process.env["RABBITMT_PASSWORD"] || "guest";

module.exports = {
  SERVER_PORT,
  RABBITMQ_USERNAME,
  RABBITMQ_PASSWORD,
};
