const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $(".cd");
const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playbtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

// const request = require("request");

// // pdf to text
// const options = {
//   method: "POST",
//   url: "https://selectpdf.com/api2/pdftotext/",
//   headers: {
//     "Content-Type": "multipart/form-data; boundary=---011000010111000001101001",
//   },
//   formData: {
//     key: "_put___your___license___key___here__",
//     url: "https://selectpdf.com/demo/files/selectpdf.pdf",
//   },
// };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(body);
// });

// // text to speech
// const axios = require("axios");

// const options2 = {
//   method: "POST",
//   url: "https://text-to-speech53.p.rapidapi.com/",
//   headers: {
//     "content-type": "application/json",
//     "X-RapidAPI-Key": "70563b477cmshdc2fb090b91d03ep11a893jsn25b27d0ee0c2",
//     "X-RapidAPI-Host": "text-to-speech53.p.rapidapi.com",
//   },
//   data: {
//     text: "お元気ですか",
//     lang: "ja",
//     format: "wav",
//   },
// };

// try {
//   const response = await axios.request(options2);
//   console.log(response.data);
// } catch (error) {
//   console.error(error);
// }

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Shake It Off",
      singer: "Taylor Swift",
      path: "./assets/audio/Taylor_Swift_-_Shake_It_Off_[NaijaGreen.Com]_.mp3",
      image: "./assets/image/shakeitoff.jpg",
    },
    {
      name: "Muộn rồi mà sao còn",
      singer: "Sơn Tùng M-TP",
      path: "./assets/audio/MuonRoiMaSaoCon-SonTungMTP-7011803.mp3",
      image: "./assets/image/muonroimasaocon.png",
    },
    {
      name: "Making My Way",
      singer: "Sơn Tùng M-TP",
      path: "./assets/audio/Making-My-Way-Son-Tung-M-TP.mp3",
      image: "./assets/image/makingmyway.jpg",
    },
    {
      name: "Shake It Off",
      singer: "Taylor Swift",
      path: "./assets/audio/Taylor_Swift_-_Shake_It_Off_[NaijaGreen.Com]_.mp3",
      image: "./assets/image/shakeitoff.jpg",
    },
    {
      name: "Muộn rồi mà sao còn",
      singer: "Sơn Tùng M-TP",
      path: "./assets/audio/MuonRoiMaSaoCon-SonTungMTP-7011803.mp3",
      image: "./assets/image/muonroimasaocon.png",
    },
    {
      name: "Making My Way",
      singer: "Sơn Tùng M-TP",
      path: "./assets/audio/Making-My-Way-Son-Tung-M-TP.mp3",
      image: "./assets/image/makingmyway.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `   
                <div class="song ${
                  index === this.currentIndex ? "active" : ""
                }">     
                    <div class="thumb"
                        style="background-image: url('${song.image}');">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const cdWidth = cd.offsetWidth;
    const _this = this;

    // Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });

    cdThumbAnimate.pause();

    // Xử lý phóng to / thu nhỏ cd
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 50 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi click play
    playbtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lí khi tua
    progress.onchange = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    // Khi next bài
    nextBtn.onclick = function () {
      _this.nextSong();
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi prev bài
    prevBtn.onclick = function () {
      _this.preSong();
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi ấn random
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Khi ấn repeat
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", this.isRepeat);
    };

    // Xử lí khi kết thúc hoàn chỉnh 1 bài
    audio.onended = function () {
      if (!_this.isRepeat) {
        _this.nextSong();
      }
      audio.play();
    };
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 200);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    if (this.isRandom) this.playRandomSong();
    else {
      this.currentIndex++;
      if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0;
      }
    }
    this.loadCurrentSong();
  },

  preSong: function () {
    if (this.isRandom) this.playRandomSong();
    else {
      this.currentIndex--;
      if (this.currentIndex <= -1) {
        this.currentIndex = this.songs.length - 1;
      }
    }

    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
  },

  start: function () {
    // Định nghĩa các thuộc tính cho Obj
    this.defineProperties();

    // Lắng nghe các sự kiện
    this.render();

    //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.handleEvents();
  },
};

app.start();
