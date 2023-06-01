import {Schema, model} from 'mongoose'


const UserSchema = new Schema({
    test : String
})




export default model('users', UserSchema)