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

    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'emotion': {
                "document": true
            }
        }
    };

    NLUinstance.analyze(analyzeParams)
    .then(analysisResults => {
        //console.log(JSON.stringify(analysisResults, null, 2));
        console.log(analysisResults.result.emotion.document);
        return res.send(analysisResults.result.emotion.document);
    })
    .catch(err => {
        console.log('error:', err);
        return res.send("problem");
    });
});

app.get("/url/sentiment", (req,res) => {

    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'sentiment': {
                "document": true
            }
        }
    };

    NLUinstance.analyze(analyzeParams)
    .then(analysisResults => {
        //console.log(JSON.stringify(analysisResults, null, 2));
        console.log(analysisResults.result);
        return res.send(analysisResults.result.sentiment.document);
    })
    .catch(err => {
        console.log('error:', err);
        return res.send("negative");
    });
    
});

app.get("/text/emotion", (req,res) => {
    const analyzeParams = {
        'features': {
            'keywords': {
            'emotion': true,
            'sentiment': true,
            'limit': 50,
            }
        },
        'text': req.query.text
    };

    NLUinstance.analyze(analyzeParams)
    .then(analysisResults => {
        //console.log(JSON.stringify(analysisResults, null, 2));
        console.log(analysisResults.result);
        return res.send(analysisResults.result.keywords[0]);
    })
    .catch(err => {
        console.log('error:', err);
        return res.send("problem");
    });
});

app.get("/text/sentiment", (req,res) => {

    const analyzeParams = {
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
        },
        'text': req.query.text
    };

    NLUinstance.analyze(analyzeParams)
    .then(analysisResults => {
        //console.log(JSON.stringify(analysisResults, null, 2));
        console.log(analysisResults.result.keywords[0].sentiment);
        return res.send(analysisResults.result.keywords[0].sentiment);
    })
    .catch(err => {
        console.log('error:', err);
        return res.send("negative");
    });
});

let server = app.listen(8000, () => {
    console.log('Listening', server.address().port)
})

