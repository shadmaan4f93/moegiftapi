module.exports = ({
  UserSchema,
  ProductSchema,
  CategorySchema,
  SubCategorySchema,
  OrderSchema,
  CartSchema,
  WholesellerSchema,
  AdminSchema,
  FeedbackSchema
}, mongoose) => ({
    User: mongoose.model('User', UserSchema),
    Product:mongoose.model('Product',ProductSchema),
    Category:mongoose.model('Category',CategorySchema),
    SubCategory:mongoose.model('SubCategory',SubCategorySchema),
    Order:mongoose.model('Order',OrderSchema),
    Cart:mongoose.model('Cart',CartSchema),
    Admin:mongoose.model('Admin',AdminSchema),
    Wholeseller:mongoose.model('Wholeseller',WholesellerSchema),
    Feedback:mongoose.model('Feedback',FeedbackSchema)
})