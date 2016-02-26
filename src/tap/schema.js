/**
 * [schema defines validation schemas for Mongo documents being inserted into db:ibu collection:ibuerrors]
 *
 *
 */

var ibuErrorSchema = new Schema({
  filename: {
    type: String,
    validate: {
      validator: function(v){
        return /^[^.]+$/.test(v);
      },
      message: 'Filename is not valid!'
    }
  },
  collection: {
    type: String
  },
  IMGerrors: {
    type: Array
  },
  XMLerrors: {
    type: Array
  }
});

var ibuErrorDoc = mongoose.model('ibuErrorDoc', ibuErrorSchema);
