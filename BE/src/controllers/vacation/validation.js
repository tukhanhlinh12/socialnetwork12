const Joi = require("joi");

const vacationSchema = Joi.object({
  title: Joi.string(),
  desc: Joi.string(),
  startedAt: Joi.date(),
  endedAt: Joi.date().greater(Joi.ref("startedAt")),
  // privacy: Joi.string(),
  status: Joi.string(),
});

module.exports = { vacationSchema };
