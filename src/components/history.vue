<template>
    <div class="content">
        <div class="contentSon">
            <div class="cardp" v-for="(item, index) in codeList" :key="index">
                <var-paper class="paperl" :elevation="2" :width="110" :height="110" @click="center = true, bigCode.qrcodeId = item.qrcodeId , bigCode.url = qrcodelist[index], bigCode.name=item.name ">
                    <img :src="qrcodelist[index]" alt="" class="image">
                </var-paper>
                <b style="color: rgb(70, 66, 66); font-size: 20px;">{{ item.name }}</b>
                <b>{{ item.updateTime?"改动":"创建" }}已经<b style="color: red; font-size: 20px;">{{ getDaysDifference(item.updateTime?item.updateTime:item.createTime) }}天</b>了</b>
            </div>
        </div>
    </div>
    <canvas ref="qrcodeCanvas" style="display:none;"></canvas>
    <var-popup v-model:show="center" class="ittcenter">
        <div class="center">
            <img :src="bigCode.url" alt="" class="imagge">
            <h1>{{bigCode.name}}</h1>
        </div>
        <div class="foot">
            <var-button-group type="primary" size="normal" class="foot1">
                <var-button class="aaa" @click="center=false, center2=true">更改</var-button>
                <var-button class="aaa" @click="toView">预览</var-button>
                <var-button class="aaa" @click="saveImage">保存</var-button>
                <var-button class="aaa" @click="Delete">删除</var-button>
              </var-button-group>
        </div>
    </var-popup>
    <var-popup v-model:show="center2">
        <div class="center2">
            <makeQrcode :isUpdate="true" :qrcodeId="bigCode.qrcodeId"  @close2="closeCenter"/>
        </div>
    </var-popup>
    <var-popup :default-style="false" v-model:show="info">
        <var-result class="result" type="info" title="微信不支持下载" description="可以长按保存">
          <template #footer>
            <var-button type="info" @click="info = false">知道了</var-button>
          </template>
        </var-result>
      </var-popup>
</template>

<script>
import Qrcodelook from '@/components/Qrcodelook.vue';
import makeQrcode from '@/components/makeQrcode.vue';
import { Snackbar } from '@varlet/ui'
import QRCode from 'qrcode';
import { nextTick } from 'vue';

export default {
    components: {
        Qrcodelook,
        makeQrcode
    },
    props: {
        codeList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            info: false,
            center: false,
            center2: false,
            qrcodelist: [],
            bigCode: { url: "", name: "" ,qrcodeId: "",time:""}
        };
    },
    methods: {
        toView(){
            this.center2 = false;
            this.center = false;
            this.$router.push({path: '/public', query: {qrcodeId: this.bigCode.qrcodeId}});
        },
        getDaysDifference(timestamp) {
            const now = new Date();
            const targetDate = new Date(timestamp);
            const differenceInTime = now - targetDate;
            const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
            return differenceInDays;
        },
        closeCenter(){
                this.center2 = false;
                this.$emit('close2');
        },
        updateImg(){
            this.codeList.forEach((item, index) => {
            //当前站点+/public?+qrcodeId
            const url = `${window.location.origin}/public?qrcodeId=${item.qrcodeId}`;
            this.generateQRCode(url, (qrCodeUrl) => {
                this.qrcodelist[index] = qrCodeUrl;
                });
            });
        },
        Delete(){
            console.log(this.bigCode.qrcodeId);
            this.$emit('delete', this.bigCode.qrcodeId);
            this.center = false;
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
        saveImage() {
            Snackbar.loading("加载中")
            const link = document.createElement('a');
            link.href = this.bigCode.url;
            link.download = `${this.bigCode.name}.jpg`; // 设置下载文件名
            //检测是否是微信浏览器，是则提示不支持下载
            if (navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1) {
                Snackbar.error("微信浏览器不支持下载")
                this.info = true;
                return;
            }
            Snackbar.success("下载成功")
            link.click();
        },
    },
    //监听二维码列表变化，更新二维码图片
    watch: {
        codeList: {
            handler() {
                this.updateImg();
                this.$emit('tooMore',this.codeList.length);
            },
            immediate: true, // 在初始化时也调用一次
            deep: true // 深度监听数组中的元素变化
        }
    },
    //监听二维码列表变化，长度大于12时调用函数add

};
</script>

<style scoped>
.content {
    width: 100%;
    display: flex;
    justify-content: center;
}

.contentSon {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
}

.cardp {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    text-align: center;   
}

.image {
    width: 100%;
}

.itcenter {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.center {
    overflow:auto;
    height: 60vh;
    max-height: 700px;
    width: 100vw;
    max-width: 500px;
    border-radius: 10px;
}

.center2 {
    height: 50vh;
    width: 90vw;
    border-radius: 10px;
}

.imagge {
    width: 100%;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.foot {
    position: fixed;
    width: 100%;
    max-width: 500px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.foot1 {
    display: flex;
    width: 95%;
    justify-content: space-around;
    margin-bottom: 20px;
}

.aaaa {
    width: 90%;
    margin: 5px;
}

.aaa {
    width: 25%;
}

</style>
