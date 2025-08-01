const mongoose=require('mongoose');

const categorySchema=mongoose.Schema({
    categoryName:{type:String,required:true,unique:true},
    categoryPhoto: {
        data: Buffer,
        contentType: String,
      }
});
const categoryModel=mongoose.model('Category',categorySchema);
module.exports=categoryModel;