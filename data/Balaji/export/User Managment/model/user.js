const mongoose = require("mongoose");
    mongoose.set('useCreateIndex', true);    
    // Create Schema
    const userSchema = new mongoose.Schema(
        {"email":{"type":"String","unique":"true","required":"true"},"password":{"type":"String","unique":"false","required":"false"},"name":{"type":"String","unique":"false","required":"false"}}
    ,
    {timestamps:true}
    );
    module.exports = mongoose.model("user", userSchema);