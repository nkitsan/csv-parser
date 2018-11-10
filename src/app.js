const csvParser = require('./libs/parseCsv');
const Koa = require('koa');
const Router = require('koa-router')
const busboy = require('koa-busboy');
const send = require('koa-send');


const app = new Koa();
const router = new Router();
const uploader = busboy({
    dest: './input',
    fnDestFilename: (fieldname, filename) => Date.now().toString() + filename
});

router.post('/', uploader, async ctx => {
    const fileName = ctx.request.files[0].path;
    const outputFile = csvParser.parseCsv(fileName, './output/');
    //await send(ctx, outputFile);
});

app.use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);
