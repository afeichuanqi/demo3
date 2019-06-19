import {AsyncStorage} from "react-native";

const FAVORITE_KEY_PREFIX = 'favorite_';
export default class FavoriteDAO {
    constructor(flag) {
        this.favoriteKey = FAVORITE_KEY_PREFIX + flag;

    }

    //收藏项目
    saveFavoriteItem(key, value, callback) {
        //debugger
        //console.log('key',key)
        AsyncStorage.setItem(key, value, (error, result) => {
            if (!error) {
                this.updateFavoriteKeys(key, true);//更新Favorite的key
            }
        })
    }

    /**
     * 更新Favorite key集合
     *
     * @param key
     * @param isAdd true添加，false 删除
     */
    updateFavoriteKeys(key, isAdd) {
        AsyncStorage.getItem(this.favoriteKey, (error, result) => {
            if (!error) {
                let favoriteKeys = [];
                if (result) {
                    favoriteKeys = JSON.parse(result);
                }
                let index = favoriteKeys.indexOf(key);
                if (isAdd) { // 如何过添加且key不存在则添加到数组中
                    if (index === -1) favoriteKeys.push(key);
                } else { //如果是删除且key存在则将其从数值中移除
                    if (index !== -1) favoriteKeys.splice(index, 1);
                }
                AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys));
            }
        })
    }

    /**
     *
     */
    // deleteFavoriteKeys(){
    //     //;
    //     console.log("result","被调用");
    //     AsyncStorage.getAllKeys((err,results)=>{
    //         console.log("result",results);
    //         if(results){
    //             results.map((result,i,store)=>{
    //                 //console.log(result);
    //                 AsyncStorage.removeItem(result,(err,str)=>{
    //                     console.log("result",str);
    //
    //                 });
    //             })
    //         }
    //     })
    //
    // }


    /**
     * 获取收藏的repository对应的key
     * @returns {Promise<any> | Promise<*>}
     */
    getFavoriteKeys() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.favoriteKey, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(error);
                    }
                } else {
                    reject(error);
                }
            })
        })
    }

    /**
     * 获取所有收藏的项目
     */
    getAllItems() {
        return new Promise((resolve, reject) => {
            this.getFavoriteKeys().then(keys => {
                //console.log('keys', keys);
                let items = [];
                if (keys) {
                    AsyncStorage.multiGet(keys, (error, stores) => {

                        try {
                            stores.map((result, i, store) => {
                                let key = store[i][0];
                                let value = store[i][1];

                                if (value) items.push(JSON.parse(value));
                            })
                            //console.log("12345",items);
                            resolve(items)
                            //console.log('items', items);
                        } catch (e) {
                            reject(e);
                        }
                    })
                }
            })
        })
    }

    /**
     * 取消收藏，移除已经收藏的项目
     * @param key
     */
    removeFavoriteItem(key) {
        AsyncStorage.removeItem(key, (error, result) => {
            if (!error) {
                this.updateFavoriteKeys(key, false);
            }
        });
    }
}