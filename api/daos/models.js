var modelMap = new Map()

var Mongoose = require('mongoose')
var Schema = Mongoose.Schema;

exports.getModel= function (collectionName) {

    if (modelMap.get(collectionName)){
        return modelMap.get(collectionName);
    }
    else{
        var collSchema = new Schema({ any: Schema.Types.Mixed },{collection:collectionName});
        var schema=Mongoose.model(collectionName, collSchema);
        modelMap.set(collectionName,schema);
        return schema;
    }

}