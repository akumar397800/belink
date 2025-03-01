import mongoose from "mongoose";

const productSchema = new mongoose.Schema({ 
    name: {
        type: String,
        
    },
    image: {
        type: Array,
        default: []
    },
    category: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'category'
        }
    ],
    subcategory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'subcategory'
        }
    ],
    unit: {
        type: String,
        default: ''
    },
    stock: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    more_details: {
        type: Object,
        default: {}
    },
    publish: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
}
);

const ProductModel = mongoose.model('product', productSchema);

export default ProductModel