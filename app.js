const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const databaseHandler = require(__dirname + "/databaseHandler.js"); 

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static( __dirname + "/public"));


var posts = [];
var maxPosts = 5;



app.get("/", (req, res) => {
    RefreshPosts().then(function ()
    {
        res.render("home", {content: homeStartingContent, posts: posts});
    }) .catch(function (err) { console.log(err); });

    
});


app.get("/contact", (req, res) => {
    res.render("contact", {content: contactContent});
});


app.get("/about", (req, res) => {
    res.render("about", {content: aboutContent});
});


app.get("/compose", (req, res) => {
    res.render("compose");
});

app.get("/post/:postId", (async (req, res) => {
    var requestedID = req.params.postId;
    var postData = null;
    postData = await databaseHandler.findPost(requestedID);
    res.render("post", {postTitle: postData.title, postBody: postData.body, postID: postData._id.toString()});
    
}));

app.post("/post" , (req, res) => {
    var postTitle = req.body.postTitle;
    var postBody = req.body.postBody;  
    const post = { title: postTitle, body: postBody };
    
    databaseHandler.AddPost(postTitle, postBody).then(function ()
    {
        res.redirect("/");
    }
    ).catch(function (err) { console.log(err); });
   
   
});


app.post("/delete", (async(req, res) => {
    var postID = req.body.postID;
    await databaseHandler.DeletePost(postID);
    res.redirect("/");
    
   
   
}));








// This route will handle all the requests that are 
// not handled by any other route handler. In 
// this handler we will redirect the user to 
// an error page with NOT FOUND message and status
// code as 404 (HTTP status code for NOT found)
app.all('*', (req, res) => {
    res.status(404).sendFile(__dirname + '/public/404.html');
});




// listen To Port 80
app.listen('80', '192.168.29.131', () => {
    console.log('server started at http://192.168.29.131');
});


async function RefreshPosts() {
    var postsData = await databaseHandler.GetPosts(maxPosts);
    if (postsData == null) {
        posts = [{"_id":"0", "title": "Welcome to Daily Journal", "body": "Click on compose to add a new post"}];
    }else {
        posts = postsData;
    }
}