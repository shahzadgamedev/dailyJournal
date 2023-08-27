const mongoose = require('mongoose');
// Replace the uri string with your connection string.
const uri = "mongodb://127.0.0.1:27017/JournalDB";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = new mongoose.Schema({
    title: String,
    body: String
});


//creating collection of posts
const Post = mongoose.model("Post", postSchema);

async function GetPosts(maxPosts) {
    // only return the latest maxPosts posts
    var posts = [];
    await Post.find()
    .limit(maxPosts)
    .then(function (postsData) { posts = postsData;})
    .catch(function (err) { console.log(err);});

    return posts;
}

async function AddPost(postTitle, postBody) {
    const post = new Post({ title: postTitle, body: postBody });
    await post.save();
    return post;
}

async function DeletePost(id) {
    //convert id to object id
    const objectID = new mongoose.Types.ObjectId(id.trim());
    await Post.deleteOne({ _id:  objectID })
    .then(function () { console.log("Successfully deleted the post"); })
    .catch(function (err) { console.log(err); });
}

async function findPost(id) {
    var post = null;
    await Post.findOne({ _id: id }).then(function (postData) { post = postData; })
    .catch(function (err) { console.log(err); });
    return post;
}

module.exports = { GetPosts, AddPost, DeletePost, findPost };