const express = require("express");

const app = express();

app.use(express.json());

const {pool, query, get, run, initDatabase} = require("./database/db");
