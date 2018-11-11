const csvParser = require('./libs/parseCsv');

const Koa = require('koa');
const Router = require('koa-router');
const busboy = require('koa-busboy');

const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);


const app = new Koa();
const router = new Router();
const uploader = busboy({
    dest: './input',
    fnDestFilename: (fieldname, filename) => Date.now().toString() + '.csv'
});

router.post('/', uploader, async ctx => {
    const fileName = ctx.request.files[0].path;
    const outputFile = await csvParser.parseCsv(fileName, './output/');
    ctx.response.set('content-type', 'csv');
    ctx.response.body = await readFileAsync(outputFile, {
        encoding: 'utf8'
    });
});

app.use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);
