var express = require('express');
var router = express.Router();
// Add Mongo
const MongoClient = require('mongodb').MongoClient;

// Hàm chuyển thành ObjectID
const chuyenObjectID = require('mongodb').ObjectID;

const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'contact';

// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//   assert.equal(null, err);
//   console.log("Kết nối thành công!");

//   const db = client.db(dbName);

//   client.close();
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST Sửa dũ liệu */
router.post('/sua/:idcansua', function(req, res, next) {
  var idcansua = chuyenObjectID(req.params.idcansua);
  var duLieuSua = {
    "ten" : req.body.ten,
    "dienthoai" : req.body.dt
  }
  const updateDocument = function(db, callback) {
    const collection = db.collection('nguoidung');
    collection.updateOne({ _id : idcansua }
      , { $set: duLieuSua }, function(err, result) {
      assert.equal(err, null);
      console.log("Cap nhat xong!");
      callback(result);
    });
  }
  // console.log(idcansua);
  // console.log(duLieuSua);
    // Kết nối Mongo để Cập nhật
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const db = client.db(dbName);
    // Gọi hàm
    updateDocument(db, function() {
    client.close();   
    res.redirect('/xem')
    });
  });
  

});
/* GET Sửa dũ liệu */
router.get('/sua/:idcansua', function(req, res, next) {
  var idcansua = chuyenObjectID(req.params.idcansua);
  // Khai báo hàm sửa
  const findDocuments = function(db, callback) {
    const collection = db.collection('nguoidung');
    collection.find({_id: idcansua}).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Tim thay");
      callback(docs);
    });
  }
  // Xem dữ liệu được tìm thấy
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      const db = client.db(dbName); 
        findDocuments(db, function(dulieu) {
          // console.log(dulieu);          
          client.close();
          res.render('sua', { title: 'Sửa dữ liệu', datasua: dulieu });
        }); 
    });
});

/* GET Xóa dữ liệu */
router.get('/xoa/:idcanxoa', function(req, res, next) {
  var idcanxoa = chuyenObjectID(req.params.idcanxoa)
  // Khai báo hàm xóa
  const xoaContact = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    collection.deleteOne({ _id : idcanxoa }, function(err, result) {
      assert.equal(err, null);
      console.log("Xoa thanh cong");
      callback(result);
    });
  }
  // Kết nối Mongo để xóa
  // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      const db = client.db(dbName);
      xoaContact(db, function() {
      client.close();   
      res.redirect('/xem')
      });
    });
});

/* GET Xem dữ liệu. */
router.get('/xem', function(req, res, next) {
  // Lấy dữ liệu ra
  const findDocuments = function(db, callback) {
    const collection = db.collection('nguoidung');
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      callback(docs);
    });
  }
  // Kết nôi Mongo
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const db = client.db(dbName); 
      findDocuments(db, function(dulieu) {
        res.render('xem', { title: 'Xem dữ liệu', data: dulieu });
        client.close();
      }); 
  });
});

/* GET Thêm mới dữ liệu */
router.get('/them', function(req, res, next) {
  res.render('them', { title: 'Thêm mới dữ liệu' });
});
/* POST dữ liệu từ form */
router.post('/them', function(req, res, next) {
  var duLieu1 = {
    "ten" : req.body.ten,
    "dienthoai" : req.body.dt
  }
  // Thêm người dùng
  const insertDocuments = function(db, callback) {
    const collection = db.collection('nguoidung');
    collection.insert(
      duLieu1, function(err, result) {
      assert.equal(err, null);
      callback(result);
    });
  }
    // Kết nối Lên Server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const db = client.db(dbName);
    insertDocuments(db, function() {
      client.close();
      res.redirect('/xem');
    });
  });
  
});

module.exports = router;
