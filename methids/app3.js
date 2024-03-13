const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const ejsmate = require('ejs-mate')
app.engine('ejs', ejsmate)
app.set('view engine', 'ejs')

let number = 0

app.get('/processAudio', (req, res) => {
  // Sukurkite laikiną failą, kuriuo bus dalinamasi
  const audioFilePath = 'guitar.wav';

  console.log(req.query.number)
  // Paleiskite Python vaikinio procesą
  const pythonProcess = spawn('python', ['test2.py', audioFilePath, req.query.number]);

  // Pasiruoškite gauti atsakymą iš vaikinio proceso
  pythonProcess.stdout.on('data', (data) => {
    // Grąžinkite atsakymą klientui
    res.send(data);
  });

  // Obsėrvas klaidoms
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python stderr: ${data}`);
    res.status(500).send('Internal Server Error');
  });

  // Obsėrvas vaikinio proceso baigčiai
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('/', (req,res) => {
    res.render('page')
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
