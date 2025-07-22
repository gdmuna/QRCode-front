<template>
    <div class="header">
        <div class="inner-header flex">
          <img :src="qe.qrUrl" alt="" class="imgg">
        </div>
        <canvas ref="qrcodeCanvas" style="display:none;"></canvas>
        <!-- 波浪 SVG -->
        <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
             viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
          <defs>
            <path id="gentle-wave"
                  d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g class="parallax">
            <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
            <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
            <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
            <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
          </g>
        </svg>
      </div>
      <div class="content flex">
        <h1>{{qe.qrName}}</h1>
      </div>
      <div class="foot">
        <b>powered by </b><a href="https://gdmuna.com">gdmuna</a>
      </div>
      
</template>

<script>
import QRCode from 'qrcode';
import Public from '@/api/public';
import { nextTick } from 'vue';

export default {
    props: {
        query: Object // 接收 query 参数
    },
    data() {
        return {
            qe:{
                qrUrl:"",
                qrName: ""
            }
        };
    },
    methods: {
        async ck(){
            const right = await Public.getQRCodeDetail({ qrcodeId: this.query.qrcodeId });
            
                //获取地址栏？后的参数
                const url = window.location.href;
               //截取地址栏？后的参数

            
            
            this.qe.qrName = right.name;
            this.generateQRCode(right.url, (dataURL) => {
                this.qe.qrUrl = dataURL;
            });
        },
        generateQRCode(url, callback) {
            nextTick(() => {
                const canvas = this.$refs.qrcodeCanvas;
                QRCode.toCanvas(canvas, url, (error) => {
                    if (error) console.error(error);
                    const dataURL = canvas.toDataURL('image/jpeg');
                    callback(dataURL);
                });
            });
        },
        goHome(){
            this.$router.push({path: '/'});
        }
    },
    mounted() {
        this.ck();
    }
}
</script>


<style scoped>
    .imgg{
        width: 80vw;
        max-width: 500px;
        margin-top: 10vh;
    }
.nalogo{
  background: url(../../assets/logo.jpg);
  width: 40px;
  height: 40px;
  background-size: 100%;
  margin-right: 5px;
}
.foot{
  height: 5vh;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    margin-bottom: 5px;
    font-size: small;
    background-color: white;
}
.header {
  position: relative;
  text-align: center;
  background: linear-gradient(60deg, rgba(84, 58, 183, 1) 0%, rgba(0, 172, 193, 1) 100%);
  color: white;
}

.inner-header {
  flex-direction: column;
  height: 70vh;
  width: 100%;
  margin: 0;
  padding: 0;
}
h2{
    font-size: 2em;
    
}
.flex {
  display: flex;

  justify-content: center;
  align-items: center;
  text-align: center;
}
.content {
position: relative; 
height: 20vh; 
text-align: center;
background-color: white; 
} 
.waves {
  position: relative;
  width: 100%;
  height: 15vh;
  margin-bottom: -7px;
  min-height: 100px;
  max-height: 150px;
}

.parallax>use {
  animation: move-forever 25s cubic-bezier(.55, .5, .45, .5) infinite;
}

.parallax>use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}

.parallax>use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}

.parallax>use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}

.parallax>use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}

@keyframes move-forever {
  0% { transform: translate3d(-90px, 0, 0); }
  100% { transform: translate3d(85px, 0, 0); }
}

@media (max-width: 768px) {
  .waves {
    height: 40px;
    min-height: 40px;
  }
}

</style>