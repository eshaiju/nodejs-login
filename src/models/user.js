import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

// Define the model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// on save hook encrypt password
// Before saving a model run this
userSchema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, (error, salt) => {

    if(error) { return next(error); }

    bcrypt.hash( user.password, salt, null, (error, hash) => {

      if(error) { return next(error); }

      user.password = hash;
      next();
    });

  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (error, isMatch) => {
    if(error) { return callback(error);}
    callback(null, isMatch);
  });
}

// Create the model class
const User = mongoose.model('user', userSchema);

// Export the model
export default User;
