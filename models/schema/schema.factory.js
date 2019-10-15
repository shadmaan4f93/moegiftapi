module.exports = ({ mongoose, bcrypt, utils = {} }) => {
  utils = require('../../routes/util')();

  //*********************************** UserSchema **********************************/

  var UserSchema = new mongoose.Schema({

    id: {
      type: String,
      required: true
    },
    address:{
      type: new mongoose.Schema({
        addressline1:{type:String,required:false,default:null},
        addressline2:{type:String,required:false,default:null},
        city:{type:String,required:false,default:null},
        zipcode:{type:String,required:false,default:null},
        country:{type:String,required:false,default:null},
      }),
      required:false,
      default:null
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    profileImage: {
      type: String,
      required: false,
      default: '/static/img/common/default-profile.jpg'
    },
    phone: {
      type: String,
      required: false,
      default: null
    },
    firstName: {
      type: String,
      required: false,
      default: null
    },
    lastName: {
      type: String,
      required: false,
      default: null
    },
    status: {
      type: String,
      required: false,
      defualt: null
    },
    createdAt: {
      type: Date,
      required: false,
      default: new Date()
    },
    modifiedAt: {
      type: Date,
      required: false,
      default: null
    },
    username: {
      type: String,
      required: false,
      default: null
    },
    type: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: false,
      default: null
    },
    stripeAccountId: {
      type: String,
      required: false,
      default: null
    },

  });

  // // Execute before each user.save() call
  // UserSchema.pre('save', function(callback) {
  //   var user = this;
  //   // Break out if the password hasn't changed
  //   if (!user.isModified('password')) return callback();
  //   // Password changed so we need to hash it
  //   bcrypt.genSalt(5, function(err, salt) {
  //     if (err) return callback(err);

  //     bcrypt.hash(user.password, salt, null, function(err, hash) {
  //       if (err) return callback(err);
  //       user.password = hash;
  //       var publicId = genId.generate();
  //       while (publicId.startsWith(0)) {
  //         publicId = genId.generate();
  //       }
  //       user.publicId = publicId;
  //       callback();
  //     });
  //   });
  // });


  // UserSchema.pre('findOneAndUpdate', function(callback) {
  //   var userQuery = this; //query, not docuemnt

  //   userQuery.findOne(function(err, user) {
  //     if (err) return callback(err);

  //     if (user) {
  //       //saveAndUpdate(user, callback);

  //       // Break out if the password hasn't changed
  //       if (!utils.empty(userQuery._update.password)) {

  //         // Password changed so we need to hash it
  //         bcrypt.genSalt(5, function(err, salt) {
  //           if (err) return callback(err);

  //           bcrypt.hash(userQuery._update.password, salt, null, function(err, hash) {
  //             if (err) return callback(err);
  //             userQuery._update.password = hash;
  //             callback();
  //           });
  //         });

  //       } else {

  //         callback();
  //       }

  //     } else {
  //       return callback(null, null);
  //     }
  //   })
  // });

  UserSchema.methods.verifyPassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };

  UserSchema.methods.createStripeAccount = async function() {
    if (this.stripeAccountId) {
      return this.stripeAccountId;
    }

    var customer = await stripe.customers.create({
      email: this.email,
      description: `${this.firstName} ${this.lastName}.`
    });

    if (!customer || !customer.id) {
      return null
    }

    this.stripeAccountId = customer.id;
    this.save();

    return customer.id
  };

  //*********************************** AdminSchema **********************************/
var AdminSchema = new mongoose.Schema({

  id: {
    type: String,
    required: true,
    unique: true
  },
  address:{
    type: new mongoose.Schema({
      addressline1:{type:String,required:false,default:null},
      addressline2:{type:String,required:false,default:null},
      city:{type:String,required:false,default:null},
      zipcode:{type:String,required:false,default:null},
      country:{type:String,required:false,default:null},
    }),
    required:false,
    default:null
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    required: false,
    default: '/static/img/common/default-profile.jpg'
  },
  Phone: {
    type: String,
    required: false,
    default: null
  },
  firstName: {
    type: String,
    required: false,
    default: null
  },
  lastName: {
    type: String,
    required: false,
    default: null
  },
  status: {
    type: String,
    required: false,
    defualt: null
  },
  createdAt: {
    type: Date,
    required: false,
    default: new Date()
  },
  modifiedAt: {
    type: Date,
    required: false,
    default: null
  },
  username: {
    type: String,
    required: false,
    default: null
  },
  type: {
    type: String,
    required: true

  },
  gender: {
    type: String,
    required: false,
    default: null
  }

});

//*********************************** WholesellerSchema **********************************/

var WholesellerSchema = new mongoose.Schema({

  id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  address:{
    type: new mongoose.Schema({
      addressline1:{type:String,required:false,default:null},
      addressline2:{type:String,required:false,default:null},
      city:{type:String,required:false,default:null},
      zipcode:{type:String,required:false,default:null},
      country:{type:String,required:false,default:null},
    }),
    required:false,
    default:null
  },
  profileImage: {
    type: String,
    required: false,
    default: '/static/img/common/default-profile.jpg'
  },
  phone: {
    type: String,
    required: false,
    default: null
  },
  firstName: {
    type: String,
    required: false,
    default: null
  },
  lastName: {
    type: String,
    required: false,
    default: null
  },
  status: {
    type: String,
    required: false,
    defualt: null
  },
  createdAt: {
    type: Date,
    required: false,
    default: new Date()
  },
  modifiedAt: {
    type: Date,
    required: false,
    default: null
  },
  username: {
    type: String,
    required: false,
    default: null
  },
  type: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: false,
    default: null
  }

});
  //*********************************** ProductSchema **********************************/

  var ProductSchema = new mongoose.Schema({
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      unique: true,
      required: true
    },
    sku: {
      type: String,
      required: false,
      default: null
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false,
      default: null
    },
    active: {
      type: Boolean,
      required: false,
      default:true
    },
    count: {
      type: Number,
      required: false,
      default: 0
    },
    brand: {
      type: String,
      required: false,
      default: null
    },
    priceUs: {
      type: Number,
      required: false,
      default: 0
    },
    priceCad: {
      type: Number,
      required: false,
      default:0
    },
    category: {
      type: String,
      required: true
    },
    subcategory: {
      type: String,
      required: true
    },
    sale: {
      type: Boolean,
      required: false,
      default:true
    },
    new: {
      type: Boolean,
      required: false,
      default:true
    },
    discountAmount: {
      type: Number,
      required: false,
      default: 0
    },
    discountPercentage: {
      type: Number,
      required: false,
      default: 0
    },
    imageUrl: {
      type: String,
      required: false,
      default: '/static/img/common/default-profile.jpg'
    },
    createdBy: {
      type: String,
      required: false,
      default:null
    },
    createdDate: {
      type: Date,
      required: true,
      default: new Date()
    },
    updatedBy: {
      type: String,
      required: false,
      default:null
    },
    updatedDate: {
      type: Date,
      required: true,
      default: new Date()
    },
    features: {
      type: Array,
      required: false,
      default: []
    },
    saleStartDate: {
      type: Date,
      required: false,
      default: null
    },
    saleEndtDate: {
      type: Date,
      required: false,
      default: null
    }
  },
    { toObject: { virtuals: true }, toJSON: { virtuals: true } }
  );

  ProductSchema.index({ id: 1 });

  //*********************************** CategorySchema **********************************/

  var CategorySchema = new mongoose.Schema({
    id: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    name: {
      type: String,
      unique: true,
      required: true
    },
    createdAt: {
      type: Date,
      required: false,
      default: new Date()
    },
    modifiedAt: {
      type: Date,
      required: false,
      default: null
    }
  });
  CategorySchema.index({ id: 1 });

  //*********************************** SubCategorySchema **********************************/
  var SubCategorySchema = new mongoose.Schema({
    id: {
      type: String,
      required: true,
      unique: true
    },
    categoryId: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    name: {
      type: String,
      unique: true,
      required: true
    },
    createdAt: {
      type: Date,
      required: false,
      default: new Date()
    },
    modifiedAt: {
      type: Date,
      required: false,
      default: null
    }
  });
  SubCategorySchema.index({ id: 1 });

  //*********************************** OrderSchema **********************************/


  var OrderSchema = new mongoose.Schema({
    orderId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true,
    },
    orderItems: [
      {
        id: {
          type: String,
          required: true
        },
        name: {
          type: String,
          unique: true,
          required: true
        },
        sku: {
          type: String,
          required: false,
          default: null
        },
        title: {
          type: String,
          required: true,
          default: null
        },
        description: {
          type: String,
          required: false,
          default: null
        },
        active: {
          type: Boolean,
          required: false,
          default: true
        },
        count: {
          type: Number,
          required: false,
          default: 0
        },
        brand: {
          type: String,
          required: false,
          default: null
        },
        priceUs: {
          type: Number,
          required: false,
          default: 0
        },
        priceCad: {
          type: Number,
          required: false,
          default: 0
        },
        category: {
          type: String,
          required: true
        },
        sale: {
          type: Boolean,
          required: false,
          default: true
        },
        new: {
          type: Boolean,
          required: false,
          default: true
        },
        discountAmount: {
          type: Number,
          required: false,
          default: null
        },
        discountPercentage: {
          type: Number,
          required: false,
          default: null
        },
        imageUrl: {
          type: String,
          required: false,
          default: '/static/img/common/default-profile.jpg'
        },
        createdBy: {
          type: String,
          required: false,
          default: null
        },
        createdDate: {
          type: Date,
          required: true,
          default: new Date()
        },
        updatedBy: {
          type: String,
          required: false,
          default: null
        },
        updatedDate: {
          type: Date,
          required: false,
          default: new Date()
        }
      }
    ],
    createdAt: {
      type: Date,
      required: false,
      default: new Date()
    },
    modifiedAt: {
      type: Date,
      required: false,
      default: new Date()
    },
    quantity: {
      type: Number,
      required: false,
      default: 1
    },
    orderTotal: {
      type: Number,
      required: false,
      default: 0
    }
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } });

  OrderSchema.index({ orderId: 1 });


  //*********************************** CartSchema **********************************/

  var CartSchema = new mongoose.Schema({
    id: {
      type: String,
      unique: true,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: false
    },
    item: {
      type: Array,
      required: false
    },
    createdAt: {
      type: Date,
      required: false
    },
    modifiedAt: {
      type: Date,
      required: false
    },
    totalpayable: {
      type: Number,
      required: true,
      default: 0
    }
  });
  CartSchema.index({ id: 1 });


//*********************************** FeedbackSchema **********************************/

var FeedbackSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: false
  },
  productId: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  },
  description: {
    type: String,
    required: false,
    default: null
  },
  star: {
    type: Number,
    required: false,
    default: 0,
    max: 5
  }
});
FeedbackSchema.index({ id: 1 });

  // ProductSchema.virtual('subCategory', {
  //   ref: 'SubCategory', // The model to use
  //   localField: 'subcategoryid', // Find people where `localField`
  //   foreignField: 'id', // is equal to `foreignField`
  // });

  OrderSchema.virtual('userDetail', {
    ref: 'User', 
    localField: 'userId',
    foreignField: 'id', 
  });

  ProductSchema.virtual('categoryDetails', {
    ref: 'Category', // The model to use
    localField: 'category', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
  });

  ProductSchema.virtual('subCategoryDetails', {
    ref: 'SubCategory', // The model to use
    localField: 'subcategory', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
  });


  //************************************************************************************/

  return {
    UserSchema,
    AdminSchema,
    WholesellerSchema,
    ProductSchema,
    CategorySchema,
    SubCategorySchema,
    OrderSchema,
    CartSchema,
    FeedbackSchema
  };
};
