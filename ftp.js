let Client = require('ssh2-sftp-client')
let fs = require('fs')
let path = require('path')
let exec = require('child_process').exec
let createDelay = 50
const romotePath = '/usr/local/license'
const options = {
  host: '192.168.14.40',
  port: 22,
  username: 'root',
  password: 'baicells'
}

function readFileList(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((item, index) => {
    var fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readFileList(path.join(dir, item), filesList); //递归读取文件
    } else {
      filesList.push(fullPath);
    }
  });
  return filesList;
}

function sleep(delay) {
  var start = (new Date()).getTime();
  while ((new Date()).getTime() - start < delay) {
    continue;
  }
}

function createDir(filesList, sftp) {
  let dirlist = [];
  filesList.map(function(file) {
    let localfile = file.replace(/\\/g, '/');
    let preIdx = localfile.indexOf('/') + 1;
    let sufIdx = localfile.lastIndexOf('/')
    let dir = localfile.substring(preIdx, sufIdx); // splice local dir and file name
    let tar = null;

    let has = dirlist.some(function(key) {
      let hasKey = dir.indexOf(key) == 0;
      if (hasKey) tar = key;
      return hasKey;
    })

    // Filter keep deepest dir
    if (has) {
      let idx = dirlist.indexOf(tar);
      dirlist.splice(idx, 1, dir);
    } else if (dir != '/') {
      dirlist.push(dir);
    }
  })
  console.log('Dirs: ', dirlist)

  dirlist.map(function(filedir, index) {
    let rmDir = path.join(romotePath, filedir).replace(/\\/g, '/');
    console.log('dir -->', rmDir, '  created !');

    //Set delay for async concurrent dir creation normal
    setTimeout(function() {
      sftp.exists(rmDir).then((data) => {
        if (data) { // exist

        } else { // not exist, create dir
          sftp.mkdir(rmDir, true).catch((err) => {
            console.log(err, 'catch error');
          });
        }
      })
    }, createDelay * index);
  })
}

// 批量上传
function batchUpload(localdir) {
  let sftp = new Client();
  sftp.connect(options).then(() => {
    let filesList = readFileList(localdir);
    // create dirs
    createDir(filesList, sftp);

    setTimeout(function() {
      filesList.map(function(file, idx) {
        let fname = file.substring(4),
          localfile = file.replace(/\\/g, '/'),
          fpath = path.join(romotePath, fname).replace(/\\/g, '/');
        // upload file
        sftp.put(localfile, fpath, {
          flags: 'w',
          autoClose: true
        }).then(() => {
          console.log('uploaded -->', localfile);
        });
      })
    }, createDelay * (filesList.length + 1));

    return filesList;
  }).then((data) => {
    console.log("batch uploading ...", '(total: ' + data.length + ')');
  }).catch((err) => {
    console.log(err, 'catch error');
  });
}

batchUpload('dist')

return false;
//upload('disc/index.html', '/usr/local/license/test/index.html')
