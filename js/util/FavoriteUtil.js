import {FLAG_STORAGE} from "../expand/dao/DataStore";
export default class FavoriteUtil{
    static onFavorite(favoriteDAO,item,isFavorite,flag){

        const key = flag === FLAG_STORAGE.flag_trending?item.fullName:item.id.toString();//兼容趋势和最热页面

        if(isFavorite){
            favoriteDAO.saveFavoriteItem(key,JSON.stringify(item));

        }else{
            favoriteDAO.removeFavoriteItem(key);
        }

    }}