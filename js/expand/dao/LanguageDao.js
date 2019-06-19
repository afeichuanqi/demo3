import {AsyncStorage} from 'react-native';
import keys from '../../res/data/keyss';
import langs from '../../res/data/langs';

export const FLAG_LANGUAGE = {flag_langage: 'language_dao_language', flag_key: 'language_dao_key'};

export default class LanguageDao {
    constructor(flag) {
        this.flag = flag;
    }

    /**
     * 获取语言或者标签
     * @returns {Promise<any> | Promise<*>}
     */
    fetch() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.flag, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!result) {
                    let data = this.flag === FLAG_LANGUAGE.flag_langage ? langs : keys;
                    this.save(data);
                    resolve(data);

                } else {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                    }
                }
            })

        })
    }

    /**
     * 保存语言或标签
     * @param objectData
     */
    save(objectData) {
        let stringData =JSON.stringify(objectData);
        AsyncStorage.setItem(this.flag,stringData,(err,result)=>{

        });
    }
}