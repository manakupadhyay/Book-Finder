const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine' ,'ejs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.render('home')
})

var check = function(req,res,next){
  if(req.query.name === "")
    // res.render('home',{message:'Empty'})
    res.redirect('/')
    next()
}

app.get('/search', check, (req, res) => {
  var query = req.query.name
  query = query.trim()
  var search = query
  query = query.split(' ').join('+') // query  = query.replace(/ /g, '+')

  let baseurl = 'https://www.googleapis.com/books/v1/volumes?q='
  let finalurl = baseurl + query
  var options = {
    'method': 'GET',
    'url': finalurl,
    'headers': {
    },
    formData: {
    }
  }
  request(options, function (error, response, body) {
    if(!error && response.statusCode == 200)
    {
      var data = JSON.parse(body)
      var myObject = []
      for(let i=0;i<6;i++){
        myObject.push({
          title:data.items[i].volumeInfo.title,
          authors:data.items[i].volumeInfo.authors,
          description:data.items[i].volumeInfo.description,
          publisher:data.items[i].volumeInfo.publisher,
          pageCount:data.items[i].volumeInfo.pageCount,
          categories:data.items[i].volumeInfo.categories,
          imageLinks:data.items[i].volumeInfo.imageLinks,
          previewlink:data.items[i].volumeInfo.previewLink,
        })
      }
      res.render('result', {data:myObject,search:search})
    }
    else{
      res.render('404')
      console.log(error)
    }
  })
})

app.use((req,res) => {
    res.statusCode = 404
    res.render('404')
})

app.listen(3000, () => {
  console.log('Listening to port 3000')
})
