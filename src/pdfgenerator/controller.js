import pdf from "pdf-creator-node";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import admin from 'firebase-admin';
import { serviceAccount } from '../../pvtkey.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var html = fs.readFileSync(path.resolve(__dirname, 'template.html'), 'utf8');
var outputDir = path.resolve(__dirname, 'output.pdf');


var options = {
    format: "A3",
    orientation: "landscape",
    border: "10mm",
    header: {
        height: "45mm",
        contents: '<div style="text-align: center;">Author: AA Fahad</div>'
    },
    footer: {
        height: "28mm",
        contents: {
            first: 'Cover page',
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: 'Last Page'
        }
    }
};


var days = [
    {day: "sat", eight:"CSE102\n[ASM]", nine:"CSE102\n[ASM]", ten:"CSE102\n[ASM]", eleven:"CSE102\n[ASM]", twelve:"CSE102\n[ASM]", one:"CSE102\n[ASM]", two:"CSE102\n[ASM]", three:"CSE102\n[ASM]", four:"CSE102\n[ASM]"},
    {day: "sun", eight:"CSE102\n[ASM]", nine:"CSE102\n[ASM]", ten:"CSE102\n[ASM]", eleven:"CSE102\n[ASM]", twelve:"CSE102\n[ASM]", one:"CSE102\n[ASM]", two:"CSE102\n[ASM]", three:"CSE102\n[ASM]", four:"CSE102\n[ASM]"},
    {day: "mon", eight:"CSE102\n[ASM]", nine:"CSE102\n[ASM]", ten:"CSE102\n[ASM]", eleven:"CSE102\n[ASM]", twelve:"CSE102\n[ASM]", one:"CSE102\n[ASM]", two:"CSE102\n[ASM]", three:"CSE102\n[ASM]", four:"CSE102\n[ASM]"},
    {day: "tues", eight:"CSE102\n[ASM]", nine:"CSE102\n[ASM]", ten:"CSE102\n[ASM]", eleven:"CSE102\n[ASM]", twelve:"CSE102\n[ASM]", one:"CSE102\n[ASM]", two:"CSE102\n[ASM]", three:"CSE102\n[ASM]", four:"CSE102\n[ASM]"},
    {day: "wed", eight:"CHEM\n[ASM]", nine:"CSE102\n[ASM]", ten:"CSE102\n[ASM]", eleven:"CSE102\n[ASM]", twelve:"CSE102\n[ASM]", one:"CSE102\n[ASM]", two:"CSE102\n[ASM]", three:"CSE102\n[ASM]", four:"CSE102\n[ASM]"},
];

var document = {
    html: html,
    data: {
        days: days
    },
    path: outputDir,
    type: "",
};

export async function generatePDF(req, res) {
    pdf
        .create(document, options)
        .then((stat) => {
            console.log(stat);
            res.status(200).json({ message: "PDF Generated" })
        })
        .catch((error) => {
            console.error(error);
        });

}





//initialize the app
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(JSON.stringify(serviceAccount))),
    storageBucket: 'gs://routineschedule-cd03a.appspot.com' //you can find in storage.
});

//get your bucket
var bucket = admin.storage().bucket();

//function to upload file
async function uploadFile(filepath, filename) {
    await bucket.upload(filepath, {
        gzip: true,
        destination: filename,
        metadata: {
            cacheControl: 'public, max-age=31536000'
        }
    });

    console.log(`${filename} uploaded to bucket.`);
}

//function to get url

async function generateSignedUrl(filename) {
    const options = {
        version: 'v2',
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60
    };

    const [url] = await bucket.file(filename).getSignedUrl(options);
    // console.log(url);
    return url;
};

var filepath = outputDir;
var filename = 'test.pdf' //can be anything, it will be the name with which it will be uploded to the firebase storage.


export async function uploadPDF(req, res) {
    // uploadFile(filepath, filename)
    const url = await generateSignedUrl(filename)
    res.status(200).json({ url: url })
}