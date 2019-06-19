import ProjectModel from "../model/ProjectModel";
import Util from "../util/Utils";

export function sendData(actionType, dispatch, data, storeName, pageSize, favoriteDAO,params) {
    let fixItems = [];
    if (data && data.data) {
        if (Array.isArray(data.data)) {
            fixItems = data.data

        } else if (Array.isArray(data.data.items)) {
            fixItems = data.data.items;
        }
    }
    let showItems = pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize);
    _projectModels(showItems, favoriteDAO, projectModels => {
        //console.log('projectModes',projectModels);
        //console.log("projectModels",projectModels);
        dispatch({
            type: actionType,
            projectModels: projectModels,//第一次要加载的数据
            storeName,
            pageIndex: 1,
            items: fixItems,
            ...params,
        })

    })
}


export async function _projectModels(showItems, favoriteDAO, callback) {
    let keys = [];
    try {
        //获取收藏的key
        keys = await favoriteDAO.getFavoriteKeys();
    } catch (e) {
        //console.log(e);
    }
    let projectModels = [];
    //console.log('keys',keys);

    for (let i = 0, len = showItems.length; i < len; i++) {
        projectModels.push(new ProjectModel(showItems[i], Util.checkFavorite(showItems[i], keys)))

    }
    doCallBack(callback,projectModels);

}
export const doCallBack = (callBack,object)=>{
    if(typeof callBack === 'function'){
        callBack(object);
    }
}