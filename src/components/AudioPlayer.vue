<template>
  <div aria-labelledby="语音" class="share_audio_context flex_context" :class="{share_audio_playing: isPlaying}">
    <audio>
      <source src="" type="audio/mpeg" />
    </audio>
    <div aria-labelledby="播放开关" class="share_audio_switch">
      <em class="icon_share_audio_switch" role="button" @click="togglePlay"></em>
    </div>
    <div class="share_audio_info flex_bd">
      <strong class="share_audio_title" aria-describedby="语音标题" role="link">{{title}}</strong>
      <p class="share_audio_tips" style="display:none">来自{{mysource}}</p>
      <div class="share_audio_progress_wrp">
        <div class="share_audio_progress" @click.stop="setProgress">
          <div :style="{width: playPercent}" class="share_audio_progress_inner"></div>
          <div class="share_audio_progress_buffer" style="width:0"></div>
          <div class="share_audio_progress_loading" style="display:none;">
            <div class="share_audio_progress_loading_inner"></div>
          </div>
        </div>
        <span class="share_audio_progress_handle" :style="{display: 'block', left:playPercent}"></span>
      </div>
      <div class="share_audio_desc" aria-labelledby="时长">
        <em class="share_audio_length_current" aria-hidden="true">{{currentTime}}</em>
        <em class="share_audio_length_total">{{duration}}</em>
      </div>
    </div>
  </div>
</template>

<script>
function formatTime (tsecs) {
  let minutes = Math.floor(tsecs / 60)
  let seconds = Math.floor(tsecs) - minutes * 60
  let minitestr = (minutes >= 10) ? minutes : '0' + minutes
  let secondstr = (seconds >= 10) ? seconds : '0' + seconds
  return minitestr + ':' + secondstr
}

export default {
  name: 'AudioPlayer',
  props: {
    audioUrl: {
      type: String,
      required: true
    },
    title: String,
    source: String
  },
  data () {
    return {
      isPlaying: false,
      duration: '00:00',
      mysource: this.source || '未知',
      progress: 0,
      playPercent: 0,
      currentTime: '00:00'
    }
  },

  mounted () {
    this.audio = this.$el.getElementsByTagName('audio')[0]
    this.progress = this.$el.getElementsByTagName('progress')[0]
    this.audio.addEventListener('ended', this.stop, false)
    this.audio.addEventListener('loadeddata', this.loadedData, false)
    // this.audio.addEventListener('loadedmetadata', this.loadedMetadata, false)
    this.audio.addEventListener('timeupdate', this.timeUpate, false)
    this.audio.src = this.audioUrl
  },

  unmounted () {
  },

  activated () {
    this.audio.src = this.audioUrl
  },

  deactivated () {
    this.stop()
  },

  methods: {
    togglePlay () {
      if (!this.isPlaying) {
        this.play()
      } else {
        this.stop()
      }
    },

    play () {
      if (!this.isPlaying) {
        this.audio.play()
        this.isPlaying = true
      }
    },

    pause () {
      if (this.isPlaying) {
        this.audio.pause()
        this.isPlaying = false
      }
    },

    stop () {
      if (this.isPlaying) {
        this.isPlaying = false
        this.audio.pause()
        this.audio.currentTime = 0
        this.currentTime = '00:00'
        this.playPercent = 0
      }
    },

    timeUpate () {
      this.playPercent = (this.audio.currentTime * 100 / this.audio.duration) + '%'
      this.currentTime = formatTime(this.audio.currentTime)
    },

    loadedData (event) {
      this.duration = formatTime(this.audio.duration)
    },

    setProgress (event) {
      let percent = event.offsetX / event.currentTarget.clientWidth
      this.audio.currentTime = percent * this.audio.duration
    }
  }
}
</script>



<style lang="css" scoped>
.share_audio_context:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    -moz-border-radius: 4px;
    -webkit-border-radius: 4px;
    width: 200%;
    height: 200%;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
}
.flex_context {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}
.share_audio_context {
    background-color: #fcfcfc;
    padding: 14px 15px 6px;
    font-size: 16px;
    position: relative;
    outline: 0;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
}
.share_audio_context {
    margin: 16px 0;
}

.share_audio_switch {
    margin: -10px 15px 0 0;
    position: relative;
    z-index: 1;
}
.share_audio_playing .icon_share_audio_switch {
    background-image: url(data:image/gif;base64,R0lGODlhVABUAPfJAButGiKwIe747m7Kbe/47/r8+vj7+J3bnB+vHqDcny20LByuG+j16Pz9/HvPeiOwIk/ATuT05FLBUTa3Np7bnTm4OCqzKdXv1ff79ySwI8Lowi+1Lj66Pb3mvdvx23nPeaTepMjqyLXktVzEW63hrTW2NEu+So7WjdLu0j66PrzmvKrgqn7QfeL04p/cnkm+SCiyJ7/nvmTHYyGwIPn8+fX69d7y3vb69iWxJE2/TPL58iuzKqzgrHjOeEW8RPT69PH58ZXYlNDtz4bThSyzK+337eb15mLGYdbv1mnJaW/Lb8bqxja3NeX15V3FXPD48GHGYfP689fw11HAUHzQe3fOd0q+STi4N8rrytPu01/FXz25PGzKa17FXez37CCvH6ngqaDcoOn26ODz3x6vHZLXkiaxJef150y/S+Hz4NDt0E/AT77nvrTjtJfZlnrPeje3N0K7QWvKaoXThLvmu8fqxmXHZIPSg5bZlavgq8/tz9zx3JzbnI/WjtHu0Ue9RkS8Q93y3ZTYk6LdovH58FfDV2DGYInUiX3QfIfThmfIZtnw2Dq4OZDXkLrlulDAUIzVi43VjG/LbsPpw/n7+XTNc1TBUx6uHcDnv3DLcDG1MN/y31/FXsjqx2jJaFPBUi60LS60LljDWHXNdGbIZTS2M6/hrnfOdke9R9Tv1FbCVWPHYkC6P1rEWbDir0a8RVXCVMnryYvVi4jUiMHowVnDWMvry+v36zO2Mqjfpx2uHGfIZyeyJsDowLHisZHXkZPYk7nluXbNddnw2fv8+4fUhzC1LxqtGf39/QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4NzEyYzBkMi03NGJlLTQ5MTEtYmQyMi1lNmI4ZTlhZmQ5ZGIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkUzMTAyRkEyMjg0MTFFN0JDNzBCMEY5NjNCMDhDQjQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkUzMTAyRjkyMjg0MTFFN0JDNzBCMEY5NjNCMDhDQjQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NzEyYzBkMi03NGJlLTQ5MTEtYmQyMi1lNmI4ZTlhZmQ5ZGIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODcxMmMwZDItNzRiZS00OTExLWJkMjItZTZiOGU5YWZkOWRiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJ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);
}

.icon_share_audio_switch {
    background: transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAMAAAArteDzAAAAaVBMVEUAAAAarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRkarRlIa6J1AAAAInRSTlMA9wYa38QR7ZJnMK1IIqBsO3fXDbSGQudZz5fKpV0rfbpRlHIjYQAAA35JREFUWMPFWduyqjAMDS0tgtwEFBGv/P9Hntmh3cWDTYsMs/Oio3SRy0qapuCU7PXIRdUGQxCFncgfrwzWCb/l4TCTML/xbxFlIQariEJ+AZnkwUBKkCdLIZvBQ5olsPw61Uhc4vTOa4Ca39P4IqYWXH2dyw5mWXUs2ez/8liZVx6YD2bW6wXRzmpesov0U70HxW5azTBmpD1xqJW9uUzfaS0Lp1ms0Nru6Nfv9WPSi8lahT2BKoWyvARPKZUPhLRiduq9ckHaKds6y5pa6XmARXJQutaEP4MzLJTzyJfmk193I2YKiyUdUXcf+OnCdKPO+JqNvxO2kx4YNcr+c2jvjpE7Wv27W4uRS/C1jFEu3mpdhJyX34PWISY3ByNj/SxhhZRjfZ0UMkUJt3Bxx08rJU2xbFB16YEZDiG3JSy6sHlXNPbCHIbOVpHiN1VzjBLzKOCkmxjGKld6B4oNbjkiqi3rkJeBNN8jBj7SUEaxyGgnjE1OkS0mHkUAgd5X/qWF80mWR7PaOY0410GrnHHXVHpSqlZII521RzeXqtpkTkgEEitIiwF1YeLDJgQnIldbgAx5wMBj5z4br+aWB5GdGbxUxGjUp6ESLmxhJsaMFzx+Pi5+VIpN6bTUlcvPfw/InXlvjO5MjsdE/ucg6DjxRlEJY4Wb0J1IlnR0ZoXGEHF/6l1I68d+vj3ho9xH0mO+cjumNiMxvg/tTOWYcIAkqCl+XjRbtH7CHv4aCQrIQIui3TCxNPyN1BMXfhQFFxCgJ/yzmYAaTpGgEZpPoOq60GJctfkRaX5IBApRVTNTm/TvnYHqCEoh6kMzUCuNxnUUpVzkB/2+/Pc5iTpT5PdNUx78FrMT6kymqbugmEpxNZU4JXaph7v0GbOGxJQ3SZU+ryINSWT8iAt6skg7txPD1wCJN/rrQG0nZuNzo54nHQOnNj6zRTtRj5Pe5klu0d7NBGTThvFENhNE20NQS5BtD9GgUdQqyQZtaSuZ4bIr1fUGcmHTCz1SRpJNL9GeE3xNHe35/CDhRj04DhLzI48b9eI48mxxONvyGLn+wGtsLTY5mm87RFg/7jhNxh3bD2aANWtHSFsOu7Yfy60fIG4/6lw/lN14fOwedJdWXxKD7m1H8u7LAwZMZsn88mCDa46/v5DZ6OoIhcf7dg7Y7mPalb7XcVEwDEFU+V3H/QOplcP+ctPpgwAAAABJRU5ErkJggg==) no-repeat 0 0;
    width: 42px;
    height: 42px;
    vertical-align: middle;
    display: inline-block;
    -webkit-background-size: 42px auto;
    background-size: 42px auto;
    overflow: hidden;
    color: transparent;
}
.icon_share_audio_switch:before {
    content: "播放语音";
}

.share_audio_playing .icon_share_audio_switch:before {
    content: "停止播放";
}
.flex_bd {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    word-wrap: break-word;
    word-break: break-all;
}
.share_audio_info {
    position: relative;
    z-index: 1;
    outline: 0;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
}
.share_audio_title {
    display: block;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    min-height: 1.6em;
    padding-bottom: 6px;
}
.share_audio_tips {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    padding-bottom: 6px;
    font-size: 12px;
    color: #8c8c8c;
    margin-top: 0;
    margin-bottom: 0;
}
.share_audio_progress_wrp {
    height: 2px;
    margin-right: 7px;
    position: relative;
    outline: 0;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
}
.share_audio_progress {
    height: 100%;
    background-color: #ebebeb;
    position: relative;
    width: 100%;
    padding-left: 7px;
    -webkit-box-sizing: initial!important;
    box-sizing: initial!important;
}
.share_audio_progress_inner {
    background-color: #09bb07;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}
.share_audio_progress_buffer {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: #d9d9d9;
}
.share_audio_progress_loading {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    display: none;
}
.share_audio_progress_loading .share_audio_progress_loading_inner {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    -webkit-animation: slidein 6s linear infinite normal;
    animation: slidein 6s linear infinite normal;
    width: 200%;
    max-width: none!important;
    background-image: -webkit-repeating-linear-gradient(-15deg,#d9d9d9,#d9d9d9 2px,#ebebeb 2px,#ebebeb 4px);
    background-image: repeating-linear-gradient(-15deg,#d9d9d9,#d9d9d9 2px,#ebebeb 2px,#ebebeb 4px);
}
.share_audio_progress_handle {
    z-index: 2;
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    background-color: rgba(9,187,7,0.15);
    top: 50%;
    margin-top: -7px;
    margin-left: -3.5px;
    cursor: pointer;
    outline: 0;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
}
.share_audio_progress_handle:before {
    content: " ";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    background-color: #09bb07;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -4px;
    margin-left: -4px;
}
.share_audio_desc {
    color: #b2b2b2;
    overflow: hidden;
    padding-top: 6px;
    font-size: 12px;
}
.share_audio_desc em {
    font-weight: 400;
    font-style: normal;
}
.share_audio_length_current {
    float: left;
}
.share_audio_length_total {
    float: right;
}
.share_audio_length_total:before {
    position: absolute;
    left: -9999em;
    content: "总时长";
}
</style>
