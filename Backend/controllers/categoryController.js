import db from "../config/db.js"
import path from 'path'

const baseURL = 'http://localhost:7000'

 const addCategory = (req, res) => {
    try {
        const { category_name } = req.body;
        const category_image = req.file ? req.file.filename : null;

        if (!category_name) {
            return res.status(400).json({ msg: "Category name is required" });
        }

        const q1 = "INSERT INTO category (category_name, category_image) VALUES (?, ?)";
        db.query(q1, [category_name, category_image], (err, result) => {
            if (err) throw err;
            res.status(200).json({ msg: "Category added successfully", success: true });
        });

    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};


function getAllCategory(req,res){
    try {
        const q2='select * from category'
    
        db.query (q2,(err,result)=>{
            if(err) throw err;
            if (result.length === 0) {
                return res
                  .status(404)
                  .send({ msg: "No categories found", success: false });
              }
const categories=result.map((category)=>({
    ...category,category_image:category.category_image ? `${baseURL}/uploads/${category.category_image}` :null
}));

            res.status(200).send({categories:categories,sucess:true});
    
        })
    } catch (error) {
       res.status(500).send({Msg:"server error" })
    }
}
function updateCategory(req,res){

   const {category_name}= req.body;
   const id =req.params.id;
   try {
    const q3=`update category set category_name = ? where category_id = ?;`

    db.query (q3,[category_name,id],(err,result)=>{
        if(err) throw err;
        console.log(result)
        if(result.length==0){
            res.status(200).send({msg:"category not found",sucess:false});  
        }else
        res.status(200).send({msg:"category updatet",sucess:true});

    })
} catch (error) {
   res.status(500).send({Msg:"server error" })
}

}
function deleteCategory(req,res){
    const id =req.params.id;
    try {
        console.log(">>>>>>>>>>");
        
     const q4=`delete from category where category_id=?;`
 
     db.query (q4,[id],(err,result)=>{
         if(err) throw err;
         console.log(result)
         if(result.affectedRows==0){
             res.status(200).send({msg:"category not found",sucess:false});  
         }else
         res.status(200).send({msg:"category deleted",sucess:true });
 
     })
 } catch (error) {
    res.status(500).send({Msg:"server error" })
 }
}





export default{addCategory,getAllCategory,updateCategory,deleteCategory}