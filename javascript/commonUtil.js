

var jforce=getJSON();

if (!(window.localStorage)) {
  alert("save未対応です。")
}

function getJSON() {
  var req = new XMLHttpRequest();		  // XMLHttpRequest オブジェクトを生成する
  req.onreadystatechange = function() {		  // XMLHttpRequest オブジェクトの状態が変化した際に呼び出されるイベントハンドラ
    if(req.readyState == 4 && req.status == 200){ // サーバーからのレスポンスが完了し、かつ、通信が正常に終了した場合
      document.getElementById("result").innerHTML="JSON取得成功";
    }
  };
  req.open("GET", "json/member.json", false); // HTTPメソッドとアクセスするサーバーの　URL　を指定
  req.send(null);					    // 実際にサーバーへリクエストを送信
  return JSON.parse(req.responseText);
}


//save to localStorage
function saveLocal(){
  //localStorage
  var local_storage = window.localStorage;
  //Object to json_text
  var json_text = JSON.stringify(jforce);

  //save json localStorage
  window.localStorage.setItem("jforce", json_text);

  console.log(local_storage);

  if(local_storage.getItem("jforce").empty){
    alert("保存できませんでした");
    return false;
  }

  alert("保存成功");
}

//fetch from localStorage
function rollback(){
  // readItem
  var str = window.localStorage.getItem("jforce");
  // json_text to Object
  jforce = JSON.parse(str);
  console.log(obj);
}

////////////////////DL用////////////////////
var a = document.querySelector('.download');
var fileName = document.getElementById('FileName').value;

var blob = new Blob(
  [str],
  { type: 'application\/json' }
);
var url = URL.createObjectURL(blob);
console.log(fileName);
a.download = fileName+'.json';
a.href = url;
a.classList.remove('disabled');
