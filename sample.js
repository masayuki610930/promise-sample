// promiseの個人的メモ

// npm install http
const http = require('http');

const apiUrl = 'http://zipcloud.ibsnet.co.jp/api/';

// ここから実行
getZipInfo('1000001')
  .then(result => {
    // 100-0001 の結果
    console.log(result);

    return getZipInfo('1000002')
  })
  .then(result => {
    // 100-0002 の結果
    console.log(result);

    var zipcodeArray = new Array('1000003', '1000004');
    return getZipInfoFromZipcodeArray(zipcodeArray);
  })
  .then(result => {
    // 100-0003, 100-0004 の結果
    result.forEach(function(res){
      console.log(res);
    });
  })
  .catch(err => {
    console.error(err);
  });

function getZipInfo(zipcode) {
  return new Promise(function(resolve, reject) {
    http.get(apiUrl + 'search?zipcode=' + zipcode, (result) => {
      let body = '';
      result.setEncoding('utf8');
      result.on('data', (chunk) => {
        body += chunk;
      });
      result.on('end', (result) => {
        // 正常処理
        result = JSON.parse(body);
        resolve(result);
      });
    }).on('error', (e) => {
      reject("error");
    });
  });
}

// zipcodeの配列からpromiseタスクを実行する
function getZipInfoFromZipcodeArray(zipcodeArray){
  return new Promise(function(resolve, reject){
    var taskArray = [];

    zipcodeArray.forEach(function(zipcode){
      var url = apiUrl + 'search?zipcode=' + zipcode;
      taskArray.push(createApiGetTask(url));
    })

    // タスク実行
    Promise.all(taskArray).then(function(result){
      resolve(result);
    }).catch(function(){
      reject("error");
    });
  });
}

// 実行したいpromiseのタスクを作成する
function createApiGetTask(url) {
  var task = new Promise(function(resolve, reject) {
    http.get(url, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', (res) => {
        // 正常処理
        res = JSON.parse(body);
        resolve(res);
      });
    }).on('error', (e) => {
      console.log(e.message);
      reject(0);
    });
  });

  return task;
}
