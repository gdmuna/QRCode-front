import request from '@/utils/request';

const moduleUrl = '/qrcode';

const qrcode = {
    // 获取用户有权限访问的二维码列表
    getQRCodeList() {
        return request.get(`${moduleUrl}/list`);
    },
    // 获取单个二维码详情信息
    getQRCodeDetail(data) {
        return request.get(`${moduleUrl}/detail`, data);
    },
    // 创建二维码
    createQRCode( name,description,url) {
        return request.post(`${moduleUrl}/create`, { name,description,url});
    },
    // 更新二维码
    updateQRCode(qrcodeId, name,description,url) {
        return request.post(`${moduleUrl}/update`, {qrcodeId, name,description,url});
    },
    // 删除二维码
    deleteQRCode(qrcodeId) {
        return request.delete(`${moduleUrl}/delete`, {qrcodeId});
    }
};

export default qrcode;