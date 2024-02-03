const Joi = require('joi')

const milestoneSchema = Joi.object({
    time: Joi.date(),
    desc: Joi.string(),
})

module.exports = {milestoneSchema}