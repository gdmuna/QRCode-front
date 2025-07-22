import request from '@/utils/request';

const moduleUrl = '/map';

const map = {
    // 地图
    getMap() {
        return request(`${moduleUrl}/getMap`);
    }
};

export default map;
