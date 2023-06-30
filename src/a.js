var $ = document.querySelector.bind(document)
var $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY ='PLAYER-F8'
// console.log('123')
        const cd = $('.cd')
        const heading = $('header h2')
        const cdThumb = $('.cd-thumb')
        const audio = $('#audio')
        const btnPlay = $('.btn-toggle-play')
        const player = $('.player')
        const progress = $('#progress')
        const nextSong=$('.btn-next')
        const prevSong=$('.btn-prev')
        const btnrandom =$('.btn-random')
        const btnrepeat =$('.btn-repeat')
        const playlist = $('.playlist')
const app ={
    isRandom: false,
    isrepeat: false,
    currentIndex: 0,
    isplaying: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) ||{},
    setConfig:function(key,value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    songs : [
        
        {
            name: 'Roi Mot Ngay',
            singer: 'Dewie ',
            path: './music/y2mate.com - Roi Mot Ngay  Dewie OffIcial Visualizer.mp3',
            img: './img/screenshot_1687444973.png'
        },
        {
            name: 'Cho Tôi Lang Thang',
            singer: 'Đen ft Ngọt',
            path: './music/y2mate.com - Cho Tôi Lang Thang.mp3',
            img: './img/screenshot_1687444958.png'
        },
        {
            name: 'Anh đã xây cả tòa lâu đài ',
            singer: 'NASTY5 ft XÁM',
            path: './music/y2mate.com - ANH ĐÃ XÂY CẢ TÒA LÂU ĐÀI  NASTY5 ft XÁM  OFFICIAL MV  Prod Aloha.mp3',
            img: './img/hqdefault.png'
        },
        {
            name: 'Coldzy - LOOP (feat. TO$KA, Left Hand)',
            singer: 'Coldzy',
            path: './music/y2mate.com - Coldzy  LOOP feat TOKA Left Hand.mp3',
            img: './img/screenshot_1687349006.png'
        },
        {
            name:'Những Ngày Trẻ',
            singer: 'Khơme',
            path: './music/y2mate.com - Những Ngày Trẻ.mp3',
            img: './img/screenshot_1687435792.png'
        },
        {
            name:'Making My Way',
            singer:'Sơn Tùng M-TP',
            path: './music/y2mate.com - SON TUNG MTP  MAKING MY WAY  OFFICIAL VISUALIZER.mp3',
            img: './img/artworks-vVV3zxIIBvCfCLMH-4RQl1w-t500x500.png'
        }
    ],

    render: function () {
        const songs = this.songs.map((song,index) => {
            return `<div class="song ${index === this.currentIndex ? 'active':''}" data-index = ${index} >
            <div class="thumb" style="background-image: url('${song.img}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        })
       playlist.innerHTML = songs.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {
        const cdwidth = cd.offsetWidth
        // xử lí đĩa cd quay

       const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' } 
        ],{
            duration: 10000,// quay 10s
            iterations: Infinity 
        })
        cdThumbAnimate.pause()
       

        // xử lí kéo playlist
        document.onscroll=function () {
            const scrolltop = window.scrollY || document.documentElement.scrollTop 
            const newcdWidth = cdwidth-scrolltop
            cd.style.width= newcdWidth > 0 ? newcdWidth + 'px':0
            cd.style.opacity= newcdWidth / cdwidth
        }



        // xử lí play
        btnPlay.onclick = function() {
            if (app.isplaying){
                audio.pause()
            }else{
                audio.play()
            }
        }
        // khi song được playing
        audio.onplay = function(){
            app.isplaying = true
            player.classList.toggle('playing')
            cdThumbAnimate.play()

        }
        // khi song không playing
        audio.onpause = function(){
            app.iscdthumb=false
            app.isplaying = false
            player.classList.toggle('playing')
            cdThumbAnimate.pause()
        }
        // time khi playing
        audio.ontimeupdate = function(){
            var currentime = audio.currentTime
            var duration = audio.duration
            if(duration){
                const propressPercent = Math.floor(audio.currentTime/audio.duration*100)
                progress.value = propressPercent
            }
        }
        // xử lí tua 
        progress.onchange = function(e){
            const seektime = audio.duration / 100 * e.target.value
            audio.currentTime = seektime
        }
        // next bài hát
        nextSong.onclick= function(){
            if(app.isRandom){
                app.randomsong()
            }else{
                app.nextSong()
            }
            audio.play()
            app.render()
            app.ScrolltoActiveSong()
        }
        // prev bài háy
        prevSong.onclick= function(){
            if(app.isRandom){
                app.randomsong()
            }else{
                app.prevSong()
            }
            audio.play()
            app.render()
            app.ScrolltoActiveSong()
        }
        // random bài hát
        btnrandom.onclick = function(e){
            app.isRandom = !app.isRandom
            app.setConfig('isRandom',app.isRandom)
                btnrandom.classList.toggle('active',app.isRandom)
           
           
        }
        // tự động chuyển bài
        audio.onended = function(){
            if(app.isrepeat){
                audio.play();
            }else{
                nextSong.click()
            }
        }
        // lặp lại bài hát
        btnrepeat.onclick = function(e){
            app.isrepeat = !app.isrepeat
            app.setConfig('isrepeat',app.isrepeat)
            btnrepeat.classList.toggle('active',app.isrepeat)
        }
        // chọn bài hát bất kì
        playlist.onclick = function(e){
            const songnode = e.target.closest('.song:not(.active)')
            if(songnode||e.target.closest('.option'))
                {
                //xử lí click vào song
                if(songnode){
                    app.currentIndex = Number(songnode.dataset.index)
                    console.log(songnode.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }
                //xử lí nhấn vào song option
                
            }
        }
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage =`url(${this.currentSong.img})`
        audio.src = this.currentSong.path
    },
    loadconfig: function(){
        this.isRandom = this.config.isRandom
        this.isrepeat = this.config.isrepeat
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex=0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex= this.songs.length-1 
        }
        this.loadCurrentSong()
    },
    randomsong: function(){
        let newIndex 
        do{
            newIndex = Math.floor(Math.random()*this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    ScrolltoActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',

            })
        }, 500);
    },

    playaudio: function(){

    },
    start: function () {
        // load config
        this.loadconfig()
        //định nghĩa các thuộc tính của object
        this.defineProperties()
        //định nghĩa xử lí các sự kiện
        this.handleEvent()
        //tải bài hát đầu tiên vào ứng dụng
        this.loadCurrentSong()


        // render Playlist
        this.render()

        // update hieu ung
        btnrepeat.classList.toggle('active',this.isrepeat)
        btnrandom.classList.toggle('active',this.isRandom)

    }
    
}
app.start()
