var spawn = require('child_process').spawn,
py    = spawn('python', ['pri.py']),
data = "Chhohey",
dataString = '';

py.stdout.on('data', function(data){
    console.log("Node Writing",data.toString());
  });

py.stdin.write(data);

py.stdin.end();