// console.log("Are you ready");

const cards = document.querySelectorAll(".card");

const audioPlayer = document.getElementById("audioPlayer");

const playbar = document.querySelector(".playbar");

const playPausebtn = document.querySelector(".play-img");

const preSong = document.querySelector(".pre-song");

const nextSong = document.querySelector(".next-song");

const songTime = document.querySelector('.song-time')

const volumeRange = document.getElementById('volumeRange')

const songDetails = document.querySelector('.song-details')

const seekbar = document.getElementById("seekbar")

const circle = document.getElementById("circle")

let isPlaying = false;

let lastvolume = 1

let currentsong = 0;

let isDragging  = false;

let playlist = [
  "songs/brain-implant-cyberpunk-sci-fi-trailer-action-intro-330416.mp3".trim(),
  "songs/gorila-315977.mp3".trim(),
  "songs/experimental-cinematic-hip-hop-315904.mp3".trim(),
  "songs/dont-talk-315229.mp3".trim(),
  "songs/gardens-stylish-chill-303261.mp3".trim(),
  "songs/kugelsicher-by-tremoxbeatz-302838.mp3".trim(),
  "songs/soulsweeper-252499.mp3".trim(),
  "songs/tell-me-the-truth-260010.mp3".trim(),
  "songs/lost-in-dreams-abstract-chill-downtempo-cinematic-future-beats-270241.mp3".trim(),
  "songs/alone-296348.mp3".trim(),
  "songs/vlog-music-beat-trailer-showreel-promo-background-intro-theme-274290.mp3".trim(),
  "songs/spinning-head-271171.mp3".trim()
];


// plays the song 

function playSong(index){
  if(index < 0){
    index = playlist.length - 1
  }

  if(index >= playlist.length){
    index = 0
  }

  currentsong = index;
  audioPlayer.src = playlist[currentsong]
  audioPlayer.play()
  isPlaying = true;
  updateplayPausebtn();
  updateSongTitle();
}


// pause previous and next 


audioPlayer.addEventListener("ended",()=>{
  playSong(currentsong+1)
})


preSong.addEventListener('click', ()=>{
  playSong(currentsong-1)
})

nextSong.addEventListener('click', ()=>{
  playSong(currentsong+1)
})


// when clicked on card playbar shows and songs starts playing 


cards.forEach((card) => {
  card.addEventListener("click", () => {
    playbar.classList.add("show");
    const song = card.getAttribute("data-audio").trim();
    const index = playlist.findIndex(s=> s.trim() === song.trim())

    if(index !== -1){
      if(currentsong === index){
        currentsong = index
        audioPlayer.src = playlist[index]
        audioPlayer.currentTime = 0
        audioPlayer.play()
        isPlaying = true;
        updateplayPausebtn();
        updateSongTitle();
      }else{
        playSong(index)
      }
      }else {
      audioPlayer.src = song;
      audioPlayer.play();
      isPlaying = true;
      updateplayPausebtn();
      updateSongTitle();
    }
  });
});

// pause play btn function

playPausebtn.addEventListener("click", () => {
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
  } else {
    audioPlayer.play();
    isPlaying = true;
  }

  updateplayPausebtn();
});

function updateplayPausebtn() {
  if (isPlaying) {
    playPausebtn.src = "img/pause.svg";
  } else {
    playPausebtn.src = "img/play.svg";
  }
}

audioPlayer.addEventListener('loadedmetadata' , ()=>{
  updateSongTime()
})

audioPlayer.addEventListener('timeupdate' , ()=>{
  updateSongTime()
})


function updateSongTime(){
  let current = formatTime(audioPlayer.currentTime)
  let target = formatTime(audioPlayer.duration || 0)

  songTime.textContent = `${current} / ${target}`
}

function formatTime(seconds){
  let min = Math.floor(seconds / 60)
  let sec = Math.floor(seconds % 60)

  return `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`
}


document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0";
  document.querySelector(".close-hidden").style.display = "flex";
});

document.querySelector(".close-hidden").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-150%";
  document.querySelector(".close-hidden").style.display = "none";
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1200) {
    document.querySelector(".left").style.left = "";
    document.querySelector(".close-hidden").style.display = "none";
  }
});


// volume function

volumeRange.addEventListener('input',()=>{
  audioPlayer.volume = parseFloat(volumeRange.value)

  if(audioPlayer.volume > 0){
    lastvolume = audioPlayer.volume
  }

  updateVolumeIcon()
})

const volumeImg = document.querySelector('.volume-img')

volumeImg.addEventListener('click' ,()=>{
  if(audioPlayer.volume > 0){
    lastvolume = audioPlayer.volume
    audioPlayer.volume = 0 
    volumeRange.value = 0
  }

  else{
    audioPlayer.volume = lastvolume || 1
    volumeRange.value = lastvolume || 1
  }

  volumeImg.src = audioPlayer.volume === 0 ? "img/mute.svg" : "img/volume.svg"

  updateVolumeIcon()
})


function updateVolumeIcon(){
  if(audioPlayer.volume == 0){
    volumeImg.src = "img/mute.svg"
  }

  else{
    volumeImg.src = "img/volume.svg"
  }
}


// for song title

function updateSongTitle(){
  const stopwords = ["by", "the" , "a" , "an" , "of" , "In" , "to" , "and" , "on" ,"for" , "with" ,"at" , "from"]
  let path = playlist[currentsong]
  console.log("Current Song Path:" , path)
  let filename = path.split('/').pop()
  let nameWithoutExtension = filename.replace('.mp3'," ")
  let cleanName = nameWithoutExtension.replace(/[-_]/g, " ")

  let words = cleanName.trim().split(/\s+/).filter(word => !stopwords.includes(word.toLowerCase()))
  let limitWords = words.slice(0,3)

  let finalTitle = limitWords.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")

  songDetails.textContent = finalTitle;
}


// fucntionality of the seekbar to move the circle as songs plays and extra design etc

audioPlayer.addEventListener("timeupdate",()=>{
  const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  circle.style.left = `${progressPercent}%`
})


seekbar.addEventListener("click" ,(e)=>{
  let rect = seekbar.getBoundingClientRect()
  let offsetx =  e.clientX -  rect.left
  let width = rect.width
  let percentage = offsetx / width

  audioPlayer.currentTime = percentage * audioPlayer.duration
})
