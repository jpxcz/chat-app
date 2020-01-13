const BOT_PORT = process.env["BOT_PORT"] || 6000;
const RABBITMQ_USERNAME = process.env["RABBITMT_USERNAME"] || "guest";
const RABBITMQ_PASSWORD = process.env["RABBITMT_PASSWORD"] || "guest";

module.exports = {
  BOT_PORT,
  RABBITMQ_USERNAME,
  RABBITMQ_PASSWORD,
};
