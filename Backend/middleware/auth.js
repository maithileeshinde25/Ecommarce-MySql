import jwt from "jsonwebtoken";

function auth(req, res, next) {
  const tokenwithBearer = req.header("Authorization");
  const tokenArray = tokenwithBearer.split(" ");  
  const token = tokenArray[1];
  console.log(token);

  const user = jwt.decode(token, "password");
  console.log(user);
  req.user = user;
  next();
}
function adminCheck(req, res, next) {
  if (req.user.role=="admin") {
    next();
    
  }
  else
    res.status(500).send({Msg:"Not admin"})
}

export default {auth, adminCheck};
