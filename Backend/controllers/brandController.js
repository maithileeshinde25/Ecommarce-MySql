import db from "../config/db.js"


const baseURL = 'http://localhost:7000'

function addBrand(req,res){
    try {
        const { brand_name } = req.body;
        const brand_image = req.file ? req.file.filename : null;

        if (!brand_name) {
            return res.status(400).json({ msg: "brand name is required" });
        }

        const q1 = "INSERT INTO brand (brand_name, brand_image) VALUES (?, ?)";
        db.query(q1, [brand_name, brand_image], (err, result) => {
            if (err) throw err;
            res.status(200).json({ msg: "brand added successfully", success: true });
        });

    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
}

function getAllBrands(req,res){
    try {
        const q2='select * from brand'
    
        db.query (q2,(err,result)=>{
            if(err) throw err;


            if (result.length === 0) {
                return res.status(404).send({ msg: "No brands found", success: false });
              }

              const brands = result.map((b) => ({
                ...b,
                brand_image: b.brand_image
                  ? `${baseURL}/uploads/${b.brand_image}`
                  : null,
              }));
            res.status(200).send({brands:brands,sucess:true});
    
        })
    } catch (error) {
       res.status(500).send({Msg:"server error" })
    }
}


function updateBrand(req,res){
    const {brand_name}= req.body;
    const id=req.params.id;
    try {
     const q3=`update brand set brand_name = ? where brand_id = ?;`
 
     db.query (q3,[brand_name,id],(err,result)=>{
         if(err) throw err;
         console.log(result)
         if(result.length==0){
             res.status(200).send({msg:"Brand not found",sucess:false});  
         }else
         res.status(200).send({msg:"Brand updated",sucess:true});
 
     })
 } catch (error) {
    res.status(500).send({Msg:"server error" })
 }
 
}
function deleteBrand(req,res){
    const id =req.params.id;
    try {
     const q4=`delete from brand where brand_id=?;`
 
     db.query (q4,[id],(err,result)=>{
         if(err) throw err;
         console.log(result)
         if(result.length==0){
             res.status(200).send({msg:"Brand not found",sucess:false});  
         }else
         res.status(200).send({msg:"Brand deleted",sucess:true});
 
     })
 } catch (error) {
    res.status(500).send({Msg:"server error" })
 }
}




export default{addBrand,getAllBrands,updateBrand,deleteBrand}