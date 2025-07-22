import request from '@/utils/request';

const moduleUrl = '/matter';

const matter = {
    // 地图
    getMatterList() {
        return request(`${moduleUrl}/getMatterList`);
    },
    getMatterCloseList() {
        return request(`${moduleUrl}/getMatterCloseList`);
    },
    closeOneMatter(matterId) {
        return request(`${moduleUrl}/closeOneMatter`, {matterId}); 
    },
    goBackOneMatter(matterId) {
        return request(`${moduleUrl}/goBackOneMatter`, {matterId});
    },
    addOneMatter(matterTime,matterData,repetition) {
        return request(`${moduleUrl}/addOneMatter`, {matterTime,matterData,repetition});
    },
    deleteOneMatter(matterId) {
        return request(`${moduleUrl}/deleteOneMatter`, {matterId});
    },
};

export default matter;
