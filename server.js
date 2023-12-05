const port = 2424;

const fs = require("fs");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require('body-parser');
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json()); 

const doc = {
    exists: (name) => fs.existsSync(`${__dirname}/docs/${encodeURIComponent(name)}`),
    write: (name, wikitext) => fs.writeFileSync(`${__dirname}/docs/${encodeURIComponent(name)}`, wikitext, 'utf8'),
    read: (name) => doc.exists(name) ? fs.readFileSync(`${__dirname}/docs/${encodeURIComponent(name)}`, 'utf8') : ''
};

app.get("/", (req, res) => {    
	res.redirect(`/wiki/대문`);
});

app.get("/wiki/:name", (req, res) => {    
	const name = req.params.name;
    if(!doc.exists(name)) return res.redirect(`/edit/${name}`);
	
	res.render("wiki", {name, text: doc.read(name)});
});

app.get("/edit/:name", (req, res) => {    
	const name = req.params.name;
	
	res.render("edit", {name, text: doc.read(name)});
});

app.post("/edit/:name", (req, res) => {    
	const name = req.params.name;
	doc.write(name, req.body.text || '');
	
	res.redirect(`/wiki/${name}`);
});

console.log("이 파일 실행중임"); 

app.listen(port, () => {
    console.log(`서버 ${port} 포트에 실행 됬다고`); 
});