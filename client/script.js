
 const socket = io.connect()


para = [
    "This CSS code will remove the border and outline from a textbox of type text when it is focused You can modify the selector to target a specific textbox by using an ID class or other attribute selectors Note that removing the border and outline from a focused element can make it harder for users to see which element is currently focused so use this technique with caution",
     "The Dinosaur Game is a browser game developed by Google and built into the Google Chrome web browser The player guides a pixelated Tyrannosaurus rex across a sidescrolling landscape avoiding obstacles to achieve a higher score The game was created by members of the Chrome UX team in",
    "PacMan originally called Puck Man in Japan is a  maze action video game developed and released by Namco for arcades In North America the game was released by Midway Manufacturing as part of its licensing agreement with Namco America",
    "The SpaceX Starship is a fully reusable super heavylift launch vehicle under development by SpaceX Standing at 120 m tall it is designed to be the tallest and most powerful launch vehicle ever built and the first capable of total reusability",
    "In computer networking localhost is a hostname that refers to the current device used to access it It is used to access the network services that are running on the host via the loopback network interface Using the loopback interface bypasses any local network interface hardware",
    "A pyramid is a structure whose outer surfaces are triangular and converge to a single step at the top making the shape roughly a pyramid in the geometric sense The base of a pyramid can be trilateral quadrilateral or of any polygon shape As such a pyramid has at least three outer triangular surfaces"


]


var username = ""
var startGame = false ;

do{

    username = prompt("Enter your name : ")

}while(!username)

if(username)
{
    $('#username').html(username)
}


var currentText
var lettersArray = []
var currentIndex = 0 ;
var changeId = ['A', 'B', 'C', 'D'] ;
changeIdIndex = 0 ;
wordCount = 0
wordComplete = true ;
var characterArray 
var setTime = 60
initialTime = setTime
var wpm = 0
var accuracy = 0
var actualWords = 0
startTimer = true ;


 startGame = confirm("Are you ready ?") ;




 var giveId = "GUPT" + (new Date()).getTime() ;
 console.log(giveId);

 playerData = {
    name : username,
    id : giveId
 }

 if(startGame)
 {
    socket.emit('player-ready', playerData ) ;
}


socket.on('player-ready',(x)=>{
    console.log( "play");
    $('#num').html(x + '')
 })



function setContent()
{
    randomIndex = Math.floor(Math.random()* para.length) ;
    console.log(randomIndex);

   
    // currentText = para[0]
    currentText = para[randomIndex]
}

setContent()

function giveSpan()
{
    characterArray = currentText.split('') ;

    // characterArray.forEach(character => {
    //     character =   `<span>${character}</span>`
    // });

    lettersArray = [] 

    for(i = 0 ; i< characterArray.length; i++)
    {
        lettersArray.push( `<span>${characterArray[i]}</span>`) 
        // lettersArray.push( `<span id= ${changeId[changeIdIndex] + i}>${characterArray[i]}</span>`) 
    }

    $('#inputBox').html(lettersArray)
    // console.log(lettersArray);
}

var setWidth = 0

window.addEventListener('keydown',(e)=>{
  c =   String.fromCharCode(event.keyCode)

   if(startTimer)
   {
    startTimer = false ;
    timer()
   }

   if(characterArray[currentIndex] == ' ')
   actualWords++ ;

  if (!event.shiftKey) {
    c = c.toLowerCase();
    }
    // console.log("button pressed" +  c);
    // console.log("button pressed" +  (event.keyCode));


    if(event.keyCode == 8)
    {
        currentIndex-- ;
        lettersArray[currentIndex] = `<span>${characterArray[currentIndex]}</span>`
        wordComplete = true; 
    }
    else if(event.keyCode == 16)
    {
        // do nothing
      


    }
    else if(characterArray[currentIndex] ==  c)
    {
        if(event.keyCode == 32 )
        {
            if(wordComplete == true)
            {
                wordCount++ ;
                
            //   document.getElementById('one').style.width =` ${setWidth}%`
                // console.log("width "  + x);
               

                $('#wordCount').text(wordCount)
            }

            wordComplete = true ;
        }
        lettersArray[currentIndex] = `<span class="correct" >${characterArray[currentIndex]}</span>`
        console.log("Matched");

        currentIndex++ ;
    }
    else
    {
        lettersArray[currentIndex] = `<span class="wrong" >${characterArray[currentIndex]}</span>`
        // console.log(" not Matched " + characterArray[currentIndex]);
        wordComplete = false ;

        currentIndex++ ;

    }

    $('#inputBox').html(lettersArray)

    if(currentIndex == characterArray.length)
    {
        currentIndex = 0 ;
        setContent()
        giveSpan()
       

    }
})

var loadTimer


function timer()
{
    loadTimer = setInterval(() => {
      $('#timer').html(initialTime + '')
      wpm =  Math.floor((wordCount*60)/(setTime - initialTime || 1))
      
      $('#speed').html(wpm + '')

      accuracy = Math.floor((( wordCount)/actualWords)*100)
      $('#accuracy').html(accuracy + '')


      if(initialTime >0)
      initialTime--
      else
      {
          clearInterval(loadTimer)
          alert('Time Over...')

      }


      socket.on('update-detail', (details)=>
      {
        
        // console.log(details);

        for( let i = 0 ; i< details.length; i++)
        {
            if(details[i].clientId == giveId)
            {
                $('#rank').html( i + 1+ '')  
               
                // document.getElementById("A"+i+1).style.width = `${details[i].words*2}%`
            }
           
            if(i < 5)
            {
                var A = "A" + (i + 1)
                B = details[i].words*2 + 5 + "%"
                C = "#p" + (i + 1)
                NAME = details[i].name + " " + details[i].speed + " wpm" ;
                document.getElementById(A).style.width = B
                $(C).html(NAME)

            }
           
          
           
        }

        
      })

      socket.emit('update-detail',({
          parameter : wordCount*100 + accuracy ,
         clientId : giveId ,
         words : wordCount,
         speed : wpm
      }))
      
        
    }, 1000);
}

// timer();

giveSpan() ;