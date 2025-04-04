import db from "../config/db.js"
const baseURL = 'http://localhost:7000'



const addProduct = (req, res) => {
    const { product_name, price, discription, stock, category_id, brand_id } = req.body;
    const prod_image = req.file ? req.file.filename : null;

    // Validate required fields
    if (!product_name || !price || !discription || !stock || !category_id || !brand_id) {
        return res.status(400).json({ msg: "All fields are required", success: false });
    }

    const query = `
        INSERT INTO product (product_name, price, discription, stock, category_id, brand_id, prod_image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [product_name, price, discription, stock, category_id, brand_id, prod_image];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ msg: "Database error", success: false, error: err.message });
        }

        // Fetch the newly inserted product to return full details
        db.query(
            `SELECT * FROM product WHERE product_id = ?`,
            [result.insertId],
            (fetchErr, fetchResult) => {
                if (fetchErr) {
                    console.error("Fetch Error:", fetchErr);
                    return res.status(500).json({ msg: "Error fetching product data", success: false });
                }

                res.status(201).json({
                    msg: "Product added successfully",
                    success: true,
                    product: fetchResult[0] // Returning the full product details
                });
            }
        );
    });
};


function getAllProduct(req, res) {
    const query = "SELECT * FROM product";

    db.query(query, (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ msg: "Database error", success: false });
        }

        const products = result.map(prod => ({
            ...prod, // Spread original product data
            prod_image: prod.prod_image ? `${baseURL}/uploads/${prod.prod_image}` : null
        }));

        res.status(200).json({ products, success: true });
    });
}
function updateProduct(req,res){

    const {product_name}= req.body;
    const id =req.params.id;
    try {
     const q3=`update product set product_name = ? where product_id = ?;`
 
     db.query (q3,[product_name,id],(err,result)=>{
         if(err) throw err;
         console.log(result)
         if(result.affectedRows===0){
             res.status(200).send({msg:"product not found",sucess:false});  
         }else
         res.status(200).send({msg:"product updatet",sucess:true});
 
     })
 } catch (error) {
    res.status(500).send({Msg:"server error" })
 }

}
function deleteProduct(req,res){

    const id =req.params.id;
    try {
     const q4=`delete from product where product_id=?;`
 
     db.query (q4,[id],(err,result)=>{
         if(err) throw err;
         console.log(result)
         if(result.affectedRows==0){
             res.status(200).send({msg:"product not found",sucess:false});  
         }else
         res.status(200).send({msg:"product deleted",sucess:true ,result:result[0]});
 
     })
 } catch (error) {
    res.status(500).send({Msg:"server error" })
 }
}





function filterProduct(req, res) {
    const name = req.params.name;

    if (!name) {
        return res.status(400).send({ msg: "Product name is required", success: false });
    }

    const query = `SELECT * FROM product WHERE product_name LIKE ?;`;

    db.query(query, [`%${name}%`], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send({ msg: "Database error", success: false });
        }

        if (result.length === 0) {
            return res.status(404).send({ msg: "No products found", success: false });
        }

        // Mapping products to update image paths
        const products = result.map(prod => ({
            ...prod, // Spread original product data
            prod_image: prod.prod_image ? `${baseURL}/uploads/${prod.prod_image}` : null
        }));

        res.status(200).send({ success: true, filterProduct: products });
    });
}

function TotalProducts(req,res){

    
    try {
     const q6=`SELECT COUNT(*) AS TotalProducts FROM product;;`
 
     db.query (q6,(err,result)=>{
         if(err) throw err;
         console.log(result)
        //  if(result.affectedRows==0){
        //      res.status(200).send({ sucess:false});  
        //  }else
         res.status(200).send({sucess:true ,TotalProducts:result[0]});
 
     })
 } catch (error) {
    res.status(500).send({Msg:"server error" })
 }
}



function getOneProduct(req,res){

    const id =req.params.id;
    try {
     const q4=`select * from product where product_id=?`
 
     db.query (q4,[id],(err,result)=>{
         if(err) throw err;
         console.log(result)
         if(result.affectedRows==0){
             res.status(200).send({msg:"product not found",sucess:false});  
         }else
         res.status(200).send({sucess:true ,result:result});
 
     })
 } catch (error) {
    res.status(500).send({Msg:"server error" })
 }
}


const getProductCategory = (req, res) => {
    try {
        const id = req.params.id;
        

        const query5 = "SELECT * FROM product WHERE category_id = ?";
        db.query(query5, [id], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).send({ Msg: "Database query error" });
            }

            const products = result.map(prod => ({
                ...prod,
                prod_image: prod.prod_image ? `${baseURL}/uploads/${prod.prod_image}` : null
            }));

            res.status(200).json({ products }); 
        });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).send({ Msg: "Server error" });
    }
};



const getProductBrand = (req, res) => {
    try {
        const id = req.params.id;
        

        const query5 = "SELECT * FROM product WHERE brand_id = ?";
        db.query(query5, [id], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).send({ Msg: "Database query error" });
            }

            const products = result.map(prod => ({
                ...prod,
                prod_image: prod.prod_image ? `${baseURL}/uploads/${prod.prod_image}` : null
            }));

            res.status(200).json({ products }); 
        });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).send({ Msg: "Server error" });
    }
};

function getProductByQuery(req, res){
    try {
        const {brand_id, minprice, maxprice} = req.query;
        console.log("brand id", brand_id);

        const query6 = `SELECT * FROM product WHERE brand_id = ? AND price >= ? AND price <= ?`;

        db.query(query6, [brand_id, minprice, maxprice], (err, result) => {
            if (err) {
                return res.status(500).send({ success: false, msg: 'Server error while executing query' });
            }
            console.log(`result `, result);

            const products = result.map((prod) => ({
                ...prod,
                prod_image: prod.prod_image
                  ? `${baseURL}/uploads/${prod.prod_image}`
                  : null,
              }));

            res.status(200).send({ success: true, filterProduct:products });
        });
    } catch (error) {
        res.status(500).send({ success: false, msg: 'Server error' });
    }
};





export default{addProduct,getAllProduct,updateProduct, deleteProduct,getOneProduct,filterProduct,TotalProducts,getProductCategory,getProductBrand,getProductByQuery}