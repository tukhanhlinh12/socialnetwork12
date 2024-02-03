const Joi = require('joi')

const albumSchema = Joi.object({
    title: Joi.string(),
    privacy: Joi.string(),
})

module.exports = {albumSchema}