const express = require('express');
const fs = require('fs');
const app = express();

const multer = require('multer');
const upload = multer({ dest: 'uploads' });

const port = 3000;

app.use(express.static('to-do'));
app.use(express.static('uploads'));
app.use(express.json());

app.get('/fetch', (req, res) => {
    fs.readFile(__dirname + '/data.txt', 'utf-8', (err, data) => {
        if (err || data.length === 0) {
            return
        } else {
            res.end(data);
        }
    });
});

app.post('/store', upload.single('image'), (req, res) => {
    let arr = [];
    let arr_data = {
        task: req.body.task,
        image: req.file.filename,
        checked: false
    };

    fs.readFile(__dirname + '/data.txt', 'utf-8', (err, data) => {
        if (data.length > 0) {
            arr = JSON.parse(data);
        }
        arr.push(arr_data);
        fs.writeFile(__dirname + '/data.txt', JSON.stringify(arr), (err) => {
            res.send(JSON.stringify(arr_data));
        });
    });
});

app.post('/dlt', (req, res) => {
    fs.readFile(__dirname + '/data.txt', 'utf-8', (err, data) => {
        let arr = JSON.parse(data);

        for(let i = 0; i < arr.length; i++) {
            if(i == req.body.index) {
                fs.unlinkSync(__dirname+'/uploads/'+arr[i].image);
                delete arr[i];
            }
        }
        fs.writeFile(__dirname + '/data.txt', JSON.stringify(arr), (err) => {
            res.end();
        });
    });
});

app.post('/check', (req, res) => {
    fs.readFile(__dirname + '/data.txt', 'utf-8', (err, data) => {
        let arr = JSON.parse(data);
        let flag;
        for(let i = 0; i < arr.length; i++) {
            if(i == req.body.index) {
                arr[i].checked = !arr[i].checked;
                flag = arr[i].checked;
                break;
            }
        }

        fs.writeFile(__dirname + '/data.txt', JSON.stringify(arr), (err) => {
            res.end(JSON.stringify({ flag }));
        });
    });
});

app.listen(port, () => {
    console.log(`server is started at port ${port}...`);
});