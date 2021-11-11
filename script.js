$ =document.querySelector.bind(document)
$$ =document.querySelectorAll.bind(document)


const app = {
    currentIndex: 0,
    isPlaying: true,
    songs :[
        {
            id:0,
            name: 'Happy birthday',
            singer: 'Google',
            path: './asset/mp3/song1.mp3',
            image: './asset/img/song1.jpg'
        },
        {
            id:1,
            name: 'Thanh Xuân',
            singer: 'Da LAB',
            path: './asset/mp3/song2.mp3',
            image: './asset/img/song2.jpg'
        },
        {
            id:2,
            name: 'Nụ Cười 18 20',
            singer: 'Doãn Hiếu ',
            path: './asset/mp3/song3.mp3',
            image: './asset/img/song3.jpg'
        },
       
    ],
    defineProperties() {
        Object.defineProperty(this,'currentSong',{
            get() {
                return this.songs[this.currentIndex]
            } 
        })
    },
    render() {
        var render = app.songs.map(function(item) {
            return `
            <div class="song">
            <div class="thumb" style="background-image: url('${item.image}')">
            </div>
            <div class="body">
              <h3 class="title">${item.name}</h3>
              <p class="author">${item.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        }).join('')
        $('.playlist').innerHTML = render
    },
    handleEvent() {
        const cd = $('.cd')
        const dashboard = $('.dashboard')
        const cdWidth = cd.offsetWidth
        document.onscroll = () => {
            const scrollTop =  window.scrollY
            const newCdWidth = cdWidth - scrollTop

            if(newCdWidth < 0) {
                cd.style.width = 0
            } else {
                cd.style.width = newCdWidth + 'px'
            }

            if(scrollTop == 0 || window.onload) {
                dashboard.classList.add('active')
            } else {
                dashboard.classList.remove('active')
            }
        }

        
        //xử lí sự kiện play
        $('.btn-toggle-play').onclick = function() {
            if(app.isPlaying) {
                $('#audio').play()
            }
          else {
              $('#audio').pause()
             }
        }
        $('#audio').onplay = function() {
            console.log('dang chạy')
            app.isPlaying = false
            $('.btn-toggle-play').classList.add('playing')
            $('.cd').classList.add('active')
            $('.cd').classList.remove('pause')

        }
        $('#audio').onpause = function() {
            console.log('đang dừng')
            app.isPlaying = true
            $('.btn-toggle-play').classList.remove('playing')
            $('.cd').classList.add('pause')
        }
        //xử lí nút next và back
        const next = $('.btn-next')
        const back = $('.btn-prev')
        next.onclick = function() {
            $('.progress').style.backgroundImage = `linear-gradient(to right, var(--primary-color) 0%, #ccc 0)`
            $('.cd').classList.remove('active')
            $('.btn-toggle-play').classList.remove('playing')
                app.isPlaying = true
                if(app.currentIndex<app.songs.length-1) {
                    app.currentIndex+=1
                } else {
                    app.currentIndex = 0
                }
                app.loadCurrentSong()
                setTimeout(function() {
                    $('.cd').classList.add('active')
                    $('audio').play()
                    $('.btn-toggle-play').classList.remove('playing')
                },750)
        }
        back.onclick = function() {
            $('.progress').style.backgroundImage = `linear-gradient(to right, var(--primary-color) 0%, #ccc 0)`
            $('.cd').classList.remove('active')
            $('.btn-toggle-play').classList.remove('playing')
            app.isPlaying = true
            if(app.currentIndex>0) {
                app.currentIndex-=1
            } else {
                app.currentIndex = app.songs.length -1
            }
        app.loadCurrentSong()
        setTimeout(function() {
            $('.cd').classList.add('active')
            $('audio').play()
            $('.btn-toggle-play').classList.remove('playing')
        },750)
        }
        // XỬ LÝ CLICK DANH BÀI HÁT
        $$('.song').forEach(function (item, index) {
            item.onclick = function () {
                $('.progress').style.backgroundImage = `linear-gradient(to right, var(--primary-color) 0%, #ccc 0)`
                app.isPlaying = true
                app.currentIndex = index
                app.loadCurrentSong()
                setTimeout(function() {
                    $('.btn-toggle-play').classList.remove('playing')
                $('audio').play()
                },750)
            }
        })
        //XỬ LÝ TUA NHẠC
        isBolean = true;
        $('input').oninput = function(e) {
            isBolean = false
            rate = (e.target.value/100)*$('#audio').duration
                $('#audio').currentTime = rate
                $('.progress').style.backgroundImage = `linear-gradient(to right, var(--primary-color) ${e.target.value}%, #ccc 0)`
        }
        $('#audio').ontimeupdate = function() {
            rate = $('#audio').currentTime/ $('#audio').duration
            if(isBolean) {
                if(rate) {
                    $('input').value = Math.ceil(rate*100)
                    $('.progress').style.backgroundImage = `linear-gradient(to right, var(--primary-color) ${ Math.ceil(rate*100)}%, #ccc 0)`
                    $('.dashboard').style.backgroundImage = `linear-gradient(${Math.ceil(rate*100)*8}deg,  rgb(41 255 245 / 95%), rgb(255 136 246))`
                    $$('.song').forEach(item => {
                        item.style.backgroundImage = `linear-gradient(${Math.ceil(rate*100)*8}deg,  rgb(41 255 245 / 95%), rgb(255 136 246))`
                    })
                } else {
                    $('input').value= 0
                }
            }
        }
        $('#audio').onseeked = function() {
           isBolean = true
        }

        //Xử lí thanh input nhạc 
        progess = $('.progess')

        // XỬ LÍ VÒNG LẶP
        $('.btn-repeat').onclick = function() {
            $('.btn-repeat').classList.toggle('active')
            if($('.btn-repeat').classList.contains('active')) {
                $('#audio').loop = true
            } else {
                $('#audio').loop = false
            }
        }
        //Xử lí random và tự chuyển bài
        $('.btn-random').onclick = function() {
            $('.btn-random').classList.toggle('active')
        }

        $('#audio').onended =function() {
            $('.progress').style.backgroundImage = `linear-gradient(to right, var(--primary-color) 0%, #ccc 0)`
            random = Math.floor(Math.random()*3)
            if( $('.btn-random').classList.contains('active')) {
                app.isPlaying = true
                if(random != app.currentIndex) {
                    app.currentIndex = random
                } else {
                    app.currentIndex +=1
                }
                app.loadCurrentSong()
                // $('.btn-toggle-play').classList.add('playing')
                setTimeout(function() {
                $('.btn-toggle-play').classList.remove('playing')
                $('#audio').play()
                },750)
            } else {
                app.isPlaying = true
            if(app.currentIndex<app.songs.length-1) {
                app.currentIndex+=1
            } else {
                app.currentIndex = 0
            }
            app.loadCurrentSong()
            setTimeout(function() {
            $('.btn-toggle-play').classList.remove('playing')
            $('#audio').play()
            },750)
            }
        }

        // Tự play khi load 
        
    },
    loadCurrentSong() {
        $('#audio').src = this.currentSong.path
        $('header h2').innerHTML = this.currentSong.name
        $('.cd-thumb').style.backgroundImage = `url('${this.currentSong.image}')`
    },
    start() {
        this.render()
        this.defineProperties()
        this.loadCurrentSong()
        this.handleEvent()
    }
}

app.start()




