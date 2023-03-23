const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 5000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/client'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// const secureKey = 9211 ;
// Socket 
const io = require('socket.io')(http)


// store player names : (must be unique)
const players = []
block = false ;
var turn = 0

var allPlayers = []

io.on('connection', (socket) => {
   
    console.log("A user connected...");


    socket.on('player-ready', (playerData)=>
    {
        console.log(`${playerData.name} connected ...`);
        allPlayers.push({  
            name : playerData.name,
            clientId : playerData.id,
            serverId : socket.id,
            parameter : 0,
            words : 0

        }) ;

        console.log(allPlayers);
        // console.log(  allPlayers.length  + "players");
        socket.emit('player-ready', (allPlayers.length))
        socket.broadcast.emit('player-ready', (allPlayers.length))
    })
    
     
     socket.on('update-detail', (info)=>{
    
        //   console.log("Date received :" + info.speed);
             for(let z of allPlayers)
             {
                if(info.clientId == z.clientId)
                {
                    z.parameter = info.parameter ;
                    z.words = info.words
                }
             }
         

        //   sort allPlayers on basis of speed 
        allPlayers.sort((a, b) => {
            if (a.parameter > b.parameter) {
              return -1;
            } else if (a.parameter < b.parameter) {
              return 1;
            } else {
              return 0;
            }
          });

            // console.log(allPlayers);
        socket.emit('update-detail', allPlayers) ;

        

     })




})
