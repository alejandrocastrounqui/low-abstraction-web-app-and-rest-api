var express = require("express");
var cors = require('cors')
var app = express();

// permite que se acceda a esta url desde una web alojada en otro dominio
// es un control de seguridad que implementan los browsers
app.use(cors())
// lee todo el buffer del request y almacena el contenido en un atributo del request
// para poder accederlo sincronicamente
app.use(express.json());

var PORT = process.env.PORT || 3000

var storage = function(){
  var _seq = 0;
  var _storage = {};
  return {
    get: function(id){
      return _storage[id]
    },
    put: function(item){
      _seq++;
      _storage[_seq] = item;
      item.id = _seq;
      return _seq;
    },
    all: function(){
      return Object.values(_storage);
    }
  }
}();

app.listen(PORT, () => {
 console.log("Server running on port " + PORT);
});

app.use((_req, _res, next)=>{
  setTimeout(next, 1000)
})

app.get("/", (req, res, next) => {
  var result = storage.all().map(({
    id, 
    firstName, 
    lastName, 
    created, 
    email
  })=>({
    id, 
    firstName, 
    lastName, 
    created, 
    email
  }));
  res.json(result);
});

app.get("/:id", (req, res, next) => {
  res.json(storage.get(req.params.id));
});

app.post("/", (req, res, next) => {
  var item = req.body
  item.created = (new Date()).toISOString()
  storage.put(item)
  res.json({msg:'ok'});
});
