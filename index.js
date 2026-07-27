import express from "express";
import { movies } from "./data.js";

const app = express();
app.use(express.json());

//homepage
app.get("/",(req,res)=>{
    res.send("Movie API is running");
});

// get all movies and Filter
app.get("/movies",(req,res)=>{
    let newMovie = movies;
    const useInfo = req.query;
    console.log(useInfo);

    //Search Movies by Title
    if(useInfo.search != undefined){
        newMovie = newMovie.filter((m)=>(m.title == useInfo.search))
    }

    // Filter Movies
    if(useInfo.genre != undefined){
        newMovie = newMovie.filter((m)=>(m.genre == useInfo.genre))
    }
    if(useInfo.language != undefined){
        newMovie = newMovie.filter((m)=>(m.language == useInfo.language))
    }
    if(useInfo.rating != undefined){
        newMovie = newMovie.filter((m)=>(m.rating >= useInfo.rating))
    }
    if(useInfo.releaseYear != undefined){
        newMovie = newMovie.filter((m)=>(m.releaseYear == useInfo.releaseYear))
    }
    if(useInfo.availableOnOTT != undefined){
        newMovie = newMovie.filter((m)=>(m.availableOnOTT == JSON.parse(useInfo.availableOnOTT)))
    }
    if(newMovie.length == 0){
        res.send("Movie Not Found!");
        return;
    }
    res.json(newMovie);
});
// Get Single Movie by ID
app.get("/movies/:id",(req,res)=>{
    const id = req.params.id;
    const userMovie = movies.find((m)=>(m.id == id));
    if(userMovie == undefined){
        res.json({status: 404, message: "Movie not found"})
    }
    else{
        res.json(userMovie);
    }
});

// Create New Movie
app.post("/movies",(req,res)=>{
    const userMovie = req.body;
    const ids = movies.length+1;
    // userMovie.id = ids;
    const newMovie = {
        "message": "Movie created successfully",
        "movie": {
            "id": ids,
        }
    }
    Object.assign(newMovie.movie,userMovie);
    movies.push(newMovie.movie);
    res.json(newMovie);
})

// Update Movie
app.patch("/movies/:id",(req,res)=>{
    const id = req.params.id;
    const updateData = req.body;
    const userMovie = movies.find((m)=>(m.id == id));

    // console.log(updateData.rating);
    // console.log(userMovie);
    
    if(updateData.rating != undefined && userMovie != undefined){
        userMovie.rating = updateData.rating;
    }
    
    else{
        res.send("Invaid Data!");
        return;
    }
    const data = {
        "message": "Movie updated successfully",
        "movie": userMovie
    }
    res.json(data);

})

// Delete Movie
app.delete("/movies/:id",(req,res)=>{
    const id = req.params.id;
    const userMovieIndex = movies.findIndex((m)=>(m.id == id));

    // console.log(updateData.rating);
    // console.log(userMovie);
    if(userMovieIndex >= 0){
        movies.splice(userMovieIndex,1);
    }
    else{
        res.send("Movie is Not found");
        return;
    }

    const data = {
        "message": "Movie deleted successfully",
        "movie": movies[userMovieIndex]
    }
    res.json(data);

})


app.listen(4000,()=>{
    console.log("Server is Running at Port 4000");
})
