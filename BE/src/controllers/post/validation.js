const Joi = require("joi");

const postSchema = Joi.object({
  vacation: Joi.string().required(),
  milestone: Joi.string().required(),
  content: Joi.string(),
});

module.exports = { postSchema };
