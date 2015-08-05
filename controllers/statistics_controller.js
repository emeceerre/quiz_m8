var models = require('../models/models.js');
var Sequelize = require('sequelize');

var datos = {
	n_preguntas: 0,
	n_comentarios: 0,
	n_preg_nocoment: 0,
	n_preg_concoment: 0
};

exports.calculate = function(req, res, next) {
	// Basado en la solución propuesta por Francisco Fornell Vazquez
	// en https://www.miriadax.net/web/javascript-node-js/foro/-/message_boards/view_message/34735986?_19_delta=20&_19_keywords=&_19_advancedSearch=false&_19_andOperator=true&cur=2
	Sequelize.Promise.all([
		models.Quiz.count(),
		models.Comment.count(),
		models.Comment.countPregConComent()
		]).then( function (values) {
			datos.n_preguntas = values[0];
			datos.n_comentarios = values [1];
			datos.n_preg_concoment = values[2];
			datos.n_preg_nocoment = (datos.n_preguntas - datos.n_preg_concoment);
		}).catch (function (err) {
			next(err);
		})
		.finally (function() {
			next();
		});
};

exports.show = function(req, res) {
	res.render('quizes/statistics', { datos: datos, errors: []});
}