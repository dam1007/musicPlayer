// 변수 선언
const wrapper = document.querySelector('.wrapper'),
musicImg = wrapper.querySelector('.img-area img'),
musicName = wrapper.querySelector('.song-details .name'),
musicArtist = wrapper.querySelector('.song-details .artist'),
mainAudio = wrapper.querySelector('#main-audio'),
playPauseBtn = wrapper.querySelector('.play-pause'),
prevBtn = wrapper.querySelector('#prev'),
nextBtn = wrapper.querySelector('#next'),
progressArea = wrapper.querySelector('.progress-area'),
progressBar = wrapper.querySelector('.progress-bar'),
musicList = wrapper.querySelector('.music-list'),
showMoreBtn = wrapper.querySelector('#more-music'),
hideMusicBtn = musicList.querySelector('#close');


//let musicIndex = 2;
//새로고침 시 랜덤으로 음악 변경
let musicIndex = Math.floor(Math.random() * allMusic.length + 1);

//1. 음악 로딩
window.addEventListener('load', () => {
    loadMusic(musicIndex); //윈도우 로드 시, 음악 로딩
    playingNow();
});

//1. main-audio에 음악 로딩
function loadMusic(indexNum){
    //listMusic의 allMusic
    //console.log(indexNum);
    musicName.innerText = allMusic[indexNum - 1].name;
    musicArtist.innerText = allMusic[indexNum - 1].artist;
    musicImg.src = `assets/img/${allMusic[indexNum - 1].img}.jpg`;
    mainAudio.src = `assets/song/${allMusic[indexNum - 1].src}.mp3`;
    
}

//3. 음악 재생 함수
function playMusic(){
    wrapper.classList.add('paused');
    playPauseBtn.querySelector('i').innerText = 'pause'; //버튼 변환
    mainAudio.play();
    console.log(musicName);
}

//4. 음악 정지 함수
function pauseMusic(){
    wrapper.classList.remove('paused');
    playPauseBtn.querySelector('i').innerText = 'play_arrow'; //버튼 변환
    mainAudio.pause();
}
//5. 다음 음악 함수
function nextMusic(){
    //1씩 증가
    musicIndex++;
    //musicIndex가 곡 수보다 커졌을 때, 다시 1로 돌아감
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
//6. 이전 음악 함수
function prevMusic(){
    //1씩 감소
    musicIndex--;
    //musicIndex가 1보다 작아졌을 때, 배열의 마지막 index로 돌아감
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}


//2. 버튼
playPauseBtn.addEventListener('click', () => {
    const isMusicPaused = wrapper.classList.contains('paused');
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

//5. 다음 버튼 이벤트
nextBtn.addEventListener('click', () => {
    nextMusic();
});

//6. 이전 버튼 이벤트
prevBtn.addEventListener('click', () => {
    prevMusic();
});

//7. 재생바 현재시간에 따라 너비 맞추기
//timeupdate 이벤트 - 동영상의 재생 위치가 변경되면, 영상의 현재 위치를 표시. 
mainAudio.addEventListener('timeupdate', (e) => {
    //console.log(e);
    const currentTime = e.target.currentTime; //currenttime 추출.
    const duration = e.target.duration; // duration 추출
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector('.current'),
        musicDuration = wrapper.querySelector('.duration');

    mainAudio.addEventListener('loadeddata', () => {
        //총 재생시간 출력
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ //초 단위가 한자리수면 0 추가하기
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    //현재 재생시간 출력
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){ //초 단위가 한자리수면 0 추가하기
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});


//8.재생바 클릭 시, 위치이동 및 시간 변동 - 클릭이벤트
progressArea.addEventListener('click', (e) => {
    let progressWidthval = progressArea.clientWidth; //재생바 너비 구하기
    let clickedOffSetX = e.offsetX; //재생바 클릭 시 x좌표 구하기
    //console.log(clickedOffSetX); 
    let songDuration = mainAudio.duration; //재생시간

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
});

//9.반복 재생 
const repeatBtn = wrapper.querySelector('#repeat-plist');
repeatBtn.addEventListener('click', () => {
    let getText = repeatBtn.innerText;

    //루프 아이콘 클릭 시 변경
    switch(getText){
        case "repeat": //repeat으로 아이콘일 때, repeat_one으로 바꿔주기
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute('title', 'Song looped'); //툴팁 변경
            break;
        case "repeat_one": //아이콘이 한 번만 반복일 때, shuffle로 바꿔주기
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute('title', 'Playback shuffle');
            break;
        case "shuffle": //아이콘이 shuffle 일 때, repeat으로 바꿔주기
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute('title', 'Playlist looped');
            break;
            
    }
});

//10.노래가 끝난 뒤
mainAudio.addEventListener('ended', () => {
    //loop 아이콘으로 변했을 때, 현재 곡
    let getText = repeatBtn.innerText; //아이콘 변경

    //아이콘 따라 재생방식 변경
    switch(getText){
        case "repeat": //repeat으로 아이콘일 때, 다음 음악으로 넘어가기
            nextMusic();
            break;
        case "repeat_one": //아이콘이 한 번만 반복일 때, 현재 곡 0초로 돌아감
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle": //아이콘이 shuffle 일 때, 랜덤으로 바꿔주기
            //배열의 범위에서 랜덤하게
            let randomIndex = Math.floor(Math.random() * allMusic.length + 1);
            do {
                randomIndex = Math.floor(Math.random() * allMusic.length + 1);
            } while (musicIndex == randomIndex); //이 루프는 다음 랜덤 넘버가 현재 뮤직 인덱스와 같지 않을 때까지 반복
            musicIndex = randomIndex;
            loadMusic(musicIndex);  //음악 로딩
            playMusic(); //음악 재생
            playingNow();
            break;
    }
});

//11. 버튼 클릭 시 곡 리스트 보이기
showMoreBtn.addEventListener('click', () => {
    musicList.classList.toggle('show');
});
//11. 버튼 클릭 시 곡 리스트 숨기기
hideMusicBtn.addEventListener('click', () => {
    showMoreBtn.click();
});

//12. 리스트에 데이터 추가
const ulTag = wrapper.querySelector('ul');
for(let i = 0; i < allMusic.length; i++){
    //loadMusic function에서 index를 하나 감소시켰기 때문에 1을 추가해줘야 함.
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="assets/song/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                </li>`;
    ulTag.insertAdjacentHTML('beforeend', liTag);
    
    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener('loadeddata', () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ //초 단위가 한자리수면 0 추가하기
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute('t-duration', `${totalMin}:${totalSec}`);
    });
}

//13. list에서 노래 클릭 시 클래스 15.playingNow()
const allLiTags = ulTag.querySelectorAll('li');
function playingNow(){
    for(let j = 0; j < allLiTags.length; j++){
        let audioTag = allLiTags[j].querySelector('.audio-duration');
        //
        if(allLiTags[j].classList.contains('playing')){
            allLiTags[j].classList.remove('playing');
            //'재생 중' 메세지 현재 재생 곡 이외에는 제거
            let adDuration = audioTag.getAttribute('t-duration');
            audioTag.innerText = adDuration;
        }
        if(allLiTags[j].getAttribute('li-index') == musicIndex) {
            allLiTags[j].classList.add('playing');
            //'재생 중' 메세지 출력
            audioTag.innerText = 'Playing';
        }
        //모든 li 태그에 onclick 속성 추가
        allLiTags[j].setAttribute('onclick', 'clicked(this)');
    }
}

//14. list에서 노래 클릭 시 재생
function clicked(element){
    //클릭된 li의 li-index 속성
    //console.log(element);
    let getLiIndex = element.getAttribute('li-index');
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}