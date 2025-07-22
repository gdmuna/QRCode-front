<template>
    <div class="head">
        <Header :pitime="pitime" />
    </div>
    <div class="mainbox">
        <div class="history">
            <history :codeList="codelist" @delete="deletecode" @close2="closeCenter2" @tooMore="doMore"/>
        </div>
        <var-paper  :elevation="7" :width="100" :height="100" round ripple class="HET" @click="center = true">生成活码</var-paper>
            <var-popup v-model:show="center">
                <div class="center">
                    <makeQrcode @close="closeCenter" :isUpdate="false"/>
                </div>
        </var-popup>
    </div>
    
</template>

<script>
import Header from '@/components/header.vue';
import history from '@/components/history.vue';
import makeQrcode from '@/components/makeQrcode.vue';
import qrcode from '@/api/qrcode';
import auth from '@/api/auth';
import { Snackbar } from '@varlet/ui'
import Icon from '@/components/icon.vue';
import { nextTick } from 'vue';

import { ref } from 'vue';
export default {
    components: {
        Header,makeQrcode,history,Icon
    },
    data() {
        return {
                codelist: [],
                pitime: 'Today',
                isOpen: false,
                center: false,
                isMore:false,
                files: ref([]) // 使用 ref 创建响应式属性
            }
    },
    methods: {
        //获取二维码列表
        async getCodeList() {
            const codeList = await qrcode.getQRCodeList();
            this.codelist = codeList;
            console.log(codeList);
            if(codeList.length>12){
                this.isMore = true;
            }
            this.$forceUpdate();
        },
        closeCenter(){
            this.center = false;
            this.getCodeList();
        },
        closeCenter2(){
            this.getCodeList();
        },
        async deletecode(id){
            console.log(id,"SSSS");
            await qrcode.deleteQRCode(id);
            Snackbar.info({content: "删除成功",duration: 1000,})
            this.getCodeList();
        },
        doMore(event){
            if(event>12){
                this.isMore = true;
            }else{
                this.isMore = false;
            }
        },
        openopen() {
            this.isOpen = !this.isOpen;
            if(this.isOpen){
                nextTick(() => {
                    const openDiv = document.querySelector('.open');
                    const xialaDiv = document.querySelector('.xiala');
                    const historyDiv = document.querySelector('.history');
                    const openname = document.querySelector('.openname');
                    openDiv.style.display = 'none';
                    historyDiv.style.height = '98%';
                    historyDiv.style.overflow = 'auto';
                    historyDiv.style.transition = 'all 1s';
                    xialaDiv.style.transition = 'all 1s';
                    //下拉按钮内容改为收起
                    openname.innerHTML = '收起';
                });
            }else{
                nextTick(() => {
                    const openDiv = document.querySelector('.open');
                    const xialaDiv = document.querySelector('.xiala');
                    const historyDiv = document.querySelector('.history');
                    const openname = document.querySelector('.openname');
                    openDiv.style.display = 'flex';
                    historyDiv.style.height = '75%';
                    historyDiv.style.overflow = 'hidden';
                    historyDiv.style.transition = 'all 1s';
                    xialaDiv.style.transition = 'all 1s';
                    openname.innerHTML = '展开';
                });
            }
        }
    },
    mounted() {
        this.getCodeList();
    }
}

</script>

<style scoped>
.mainbox{
    height: 93dvh;
    width: 100%;    
    background-color: white;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.history{
    height: 100%;
    width: 100%;
    overflow: scroll;
    padding-bottom: 110px;
}
.open{
    height: 15%;
    display: flex;
    justify-content: center;
}

.HET{
    height: 90px;
    line-height: 100px;
    text-align: center;
    background-color: #587DFC;
    color: white;
    position: absolute;
    bottom: 10px;
    font-size: 25px;
}
.head {
    height: 7dvh;
    width: 100%;
}
.center{
    height: 50vh;
    width: 90vw;
    max-width: 500px;
    border-radius: 10px;
}
.xiala{
    width: 100vw;
    display: flex;
    justify-content: center;
    border-top: 2px solid #78786a;
    position: relative;
    transition: all 1s;
}
.icon{
    position: absolute;
    top:-12px;
}
</style>