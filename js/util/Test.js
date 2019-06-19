const a = [{name:1,checked:true},{name:2,checked:true},{name:3,checked:true},{name:4,checked:true},{name:5,checked:true}];
console.log(a.map(val=>{
    return {//注意 :不直接修改props,copy一份
        ...val,
        checked: false,
    }
}));