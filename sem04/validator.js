const Joi = require('joi');

const idSchema = Joi.object({
	id: Joi.string().guid({ version: 'uuidv4' }),
});

const bodySchema = Joi.object({
	name: Joi.string().min(2).required(),
	lastName: Joi.string().min(2),
	age: Joi.number().min(18).required(),
	city: Joi.string().min(2).required(),
});

function checkId(req, res, next) {
	const validationResult = idSchema.validate(req.params);
	if (validationResult.error) {
		return res.status(400).send({ error: validationResult.error.details });
	}
	next();
}

function checkBody(req, res, next) {
	const validationResult = bodySchema.validate(req.body);
	if (validationResult.error) {
		return res.status(400).send({ error: validationResult.error.details });
	}
	next();
}

module.exports = {
	checkId,
	checkBody,
};
