import request from '@/utils/request';

const moduleUrl = '/pi';

const pi = {
    // 查询某个用户的详细信息
    getNewTemperature() {
        return request(`${moduleUrl}/getNewTemperature`);
    },
    getTemperature10List() {
        return request(`${moduleUrl}/getTemperature10List`);
    },
    getHeart() {
        return request(`${moduleUrl}/getHeart`);
    }
};

export default pi;
