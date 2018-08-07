var express = require('express');
var mongoose = require('mongoose');
var taskSchema = new mongoose.Schema( {
    id: Number,
    task: String,
    status: Boolean
} );
var modelTask = mongoose.model('newTask', taskSchema);
module.exports = modelTask;

