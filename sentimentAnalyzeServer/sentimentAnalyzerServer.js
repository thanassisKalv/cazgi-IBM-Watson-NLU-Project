const express = require('express');
const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });

    return naturalLanguageUnderstanding;
}

const NLUinstance = getNLUInstance();

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {


    return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {

    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'entities': {
            'emotion': true,
            'sentiment': true,
            'limit': 2,
            },
            'keywords': {
            'emotion': true,
            'sentiment': true,
            'limit': 2,
            },
        }
    };
    

    NLUinstance.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
        return res.send("url sentiment for "+req.query.url);
    })
    .catch(err => {
        console.log('error:', err);
        return res.send("url-sentiment for "+req.query.url);
    });
    
});

app.get("/text/emotion", (req,res) => {
    return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {

    const analyzeParams = {
        'features': {
            'syntax': {
            'sentences': true,
            'tokens': {
                'lemma': true,
                'part_of_speech': true
            }
            }
        },
        'text': req.query.text
    };

    NLUinstance.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
        return res.send("positive");
    })
    .catch(err => {
        console.log('error:', err);
        return res.send("negative");
    });
});

let server = app.listen(8000, () => {
    console.log('Listening', server.address().port)
})

