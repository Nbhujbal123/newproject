console.log("lets write javascript");

let currentsong = new Audio();
let songs;
let currfolder;

function SecondsToMinutesSeconds(seconds) {
    if(isNaN(seconds) || seconds < 0){
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2,"0");
    const formattedseconds = String(remainingSeconds).padStart(2,"0");

    return `${ formattedMinutes}:${formattedseconds}`

}


async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    console.log(as);
     songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currfolder}/`)[1]);
        }
    }
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img  src="asetsnew/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div></div>
        </div>
        <span>play now</span>
        <img  src="asetsnew/splay.svg" alt="">
    </li> `;
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element =>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })
}

let playMusic = (songj, pause=false) => {
    currentsong.src = `/new programs/spotifycln/${currfolder}/` + songj;
    if(!pause){
        currentsong.play();
        play.src = "asetsnew/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(songj)
    document.querySelector(".songtime").innerHTML = "00:00/00:00";

}

    let cards = document.querySelector(".cards");


async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }


async function main() {
    await getSongs("songs/cs");
    playMusic(songs[0], true)

    // console.log(songs);
   
    displayAlbums();

    play = document.querySelector(".splay");
    
     
    play.addEventListener('click' , ()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src="asetsnew/pause.svg";
        }
        else{
            currentsong.pause();
            play.src="asetsnew/splay.svg";
        }
    })

    currentsong.addEventListener("timeupdate", ()=>{
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${SecondsToMinutesSeconds(currentsong.currentTime)}/${SecondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
         currentsong.currentTime = ((currentsong.duration)* percent)/100;
    })

    let open = document.querySelector(".hamber");
    console.log("open");
    open.addEventListener("click",()=>{
        document.querySelector(".left").style.left="0";
        // document.querySelector(".left").style.opacity=1;
        
    })
    let close = document.querySelector(".close");
    console.log("close");
    close.addEventListener("click", ()=>{
        document.querySelector(".left").style.left="-100%";
    })

    let prvs = document.querySelector(".previus");
    prvs.addEventListener("click" , ()=>{
        console.log("previus clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index-1) >= 0){
            playMusic(songs[index-1]);
        }
    })

    let next = document.querySelector(".next");
    next.addEventListener("click" , ()=>{
        console.log("Next clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1) [0])
        if((index + 1) < length){
            playMusic(songs[index+1]);
        }
    })
    // let vlm = document.querySelector(".range").getElementsByTagName("input")[0];
    // vlm.addEventListener("change",(e)=>{
    //     currentsong.volume = parseInt(e.target.value)/100;
    // })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , (e)=>{
        currentsong.volume = parseInt(e.target.value)/100;
    })

    //load the playlist when user click the card.
    
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        console.log(e)
        e.addEventListener("click" , async item =>{
            console.log(item,item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
}
main()
