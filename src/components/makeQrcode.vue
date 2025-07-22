<template>
    <div class="contant">
        <div class="img">
            <div class="a">
                <h1>导入二维码图片</h1>
            </div>
            <div class="openb">
            <var-uploader v-model="files" :maxlength="1"  @after-read="handleAfterRead"/></div>           
        </div>
        <div class="name">
            <div class="a">
                <h1>命个名</h1>
            </div>
            <div class="b">
                <var-input  class="ippout"  v-model="value"/>
            </div>
            <div class="c">
                <var-button  type="primary" class="cb" @click="createCode">生成动态二维码</var-button>
            </div>
            <canvas id="qr-canvas" style="display: none;"></canvas>
        </div>
    </div>

</template>


<script>
import { ref } from 'vue';
import jsQR from 'jsqr';
import qrcode from '@/api/qrcode';
import { Snackbar } from '@varlet/ui';
import OpencvQr from 'opencv-qr';

export default {
    data() {
        return {
            value: "",
            files: ref([]),
            qrResult: "",
            iscode: false
        };
    },
    setup() {
        // 加载 OpenCV 模型文件
        const cvQr = new OpencvQr({
            dw: `${window.location.origin}/models/detect.caffemodel`,
            sw: `${window.location.origin}/models/sr.caffemodel`
        });
        return {
            cvQr
        };
    },
    props:{
        isUpdate:{
            type: Boolean,
            default: false
        },
        qrcodeId:{
            type: String,
            default: ""
        }
    },
    mouted() {
        this.value = "";
        this.qrResult = "";
        this.iscode = false;
        this.files = [];
    },
    methods: {
        handleAfterRead(file) { 
        const fileUrl = file.url;
        console.log(fileUrl);
        this.decodeQRCode(fileUrl);
        },
        async decodeQRCode(base64) {
            const image = new Image();
            image.src = base64;
            image.onload = async () => {    
                const canvas = document.getElementById("qr-canvas");
                const context = canvas.getContext("2d");
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, image.width, image.height);

                const info = await this.decodeQRCodeCV();
                console.log(info);

                if (info) {
                    this.qrResult = info;
                    this.iscode = true;
                } else {
                    this.qrResult = "无法识别二维码";
                }
                    console.log(this.qrResult);
            };
        },
        createCode() {
            if (this.iscode && this.value.length > 0 && this.isUpdate == false) {
                qrcode.createQRCode(this.value, "sb", this.qrResult);
                Snackbar.success({content: "添加成功",duration: 1000,})
                this.$emit("close");
            }else if(this.iscode && this.value.length > 0 && this.isUpdate == true){
                qrcode.updateQRCode(this.qrcodeId, this.value, "sb", this.qrResult);
                Snackbar.success({content: "修改成功",duration: 1000,})
                this.$emit("close2");
            }
            this.value = "";
            this.qrResult = "";
            this.iscode = false;
            this.files = [];
        },
        decodeQRCodeCV() {
            // 加载 Canvas 中的图像内容到 OpencvQr
            const img = this.cvQr.load('qr-canvas');
            // 以字符串列表的形式返回解析结果
            const infos = img?.getInfos();
            // 将解析结果传递给表单
            // 清除 OpencvQr 中的图片并释放内存
            img?.clear();
            return infos[0];
        },
    }
};
</script>
    
    

<style scoped>
.img{
    height: 50%;
    width: 100%;
    display: flex;
    /* 变成竖直分布 */
    flex-direction: column;
    justify-content: center;
    align-items: center;


}
.name{
    height: 50%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.contant{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}
.openb{
    margin-top:20px
}
.a{
    height: 30%;
}
.b{
    height: 40%;
}
.c{
    width: 100%;
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.cb{
    height: 80%;
    width: 40%;
}
.ippout{
    width: 30vw;
    max-width: 300px;
    text-align: center;
}
</style>