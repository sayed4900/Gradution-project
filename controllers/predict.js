
const onnx = require('onnxruntime-node') ; 
const fs = require('fs')


function normalizeArray(arr) {
  const min = Math.min(...arr);
  const max = Math.max(...arr);

  return arr.map((value) => (value - min) / (max - min));
  
}



let input = [
  135, 190, 229, 223, 192, 125, 55, -9, -33, -38, -10, 35, 64, 113, 152, 164, 127, 50, -47, -121, -138, -125, -101, -50,
  11, 39, 24, 48, 64, 46, 13, -19, -61, -96, -130, -132, -116, -115, -71, -14, 25, 19, 6, 9, 21, 13, -37, -58, -33, 5,
  47, 80, 101, 88, 73, 69, 41, -13, -31, -61, -80, -77, -66, -43, 5, 87, 129, 121, 88, 12, -76, -150, -207, -186,
  -165, -148, -103, -33, 40, 94, 75, 8, -81, -155, -227, -262, -233, -218, -187, -126, -65, -12, 27, 61, 49, 9, -46,
  -124, -210, -281, -265, -181, -89, -4, 53, 53, 38, 43, 31, 34, 9, -7, -34, -70, -84, -101, -70, -11, 42, 62, 66, 74,
  64, 59, 56, 36, -11, -30, -43, -23, 8, 42, 77, 103, 135, 121, 79, 59, 43, 54, 90, 111, 107, 64, 32, 18, -25, -69,
  -65, -44, -33, -57, -88, -114, -130, -114, -83, -53, -79, -72, -85, -109, -98, -72, -65, -63, -11, 10, 8, -17,
  -15, -31, -77, -103, -127, -116, -83, -51
];



exports.predict = async(req,res) => {
  try{
    const session = await onnx.InferenceSession.create('./keras_model.onnx');
    
    const data = Float32Array.from(req.body.input);
    const float_input = new onnx.Tensor('float32', data, [1, 178]);
      
    // prepare feeds. use model input names as keys.
    const feeds = {input_1: float_input};
  
    // feed inputs and run
    const results = await session.run(feeds);
    
    // read from results
    const resultData = results.y.data;
    console.log(`data of result tensor: ${resultData}`);
    res.status(200).json({status:"success", predict:resultData})
  }catch(err){
    res.status(500).json(err); 
  }
}

exports.predictModelOne = async(req,res) => {
  try{
    let file = req.file; 
    if (!req.file) {
      return  res.status(404).json({ status: 'fail', message: "There is no file, please upload the file again" });
    }
    const session = await onnx.InferenceSession.create('./keras_model.onnx');

    const fileContents = fs.readFileSync(req.file.path, 'utf-8');
    const rows = fileContents.split('\n') ; 
    const rowsArray = [];
    const output = [];
    let data = [] ;
    const index = 0 ;
    
    for (const row of rows) {
      // Split each row into columns based on the CSV delimiter (e.g., comma)
      const columns = row.split(",");

      if (isNaN(parseFloat(columns[0]))){
        continue;
      }else
        console.log(parseFloat(columns[0],'👍👍👍👍'));
      data = columns.map((column) => parseFloat(column));

      // Push the columns as an array into rowsArray
      // rowsArray.push(data);
      
    
      const float_input = new onnx.Tensor('float32', data, [1, 178]);
      const feeds = {input_1: float_input};
    //    // feed inputs and run
      const results = await session.run(feeds);
    //  // read from results
      const resultData = results.y.data;
      output.push(resultData);
    }
        
    // prepare feeds. use model input names as keys.
    
    // console.log(`data of result tensor: ${resultData}`);
    res.status(200).json({status:"success",output,dataLen:rowsArray.length})
  }catch(err){
    res.status(500).json(err); 
  }
}





