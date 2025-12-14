// vertex table
let vertex_table = {
  //  x    y    z
  a: [100, 100, 100],
  b: [-100, 100, 100],
  c: [-100, -100, 100],
  d: [100, -100, 100],
  e: [100, 100, -100],
  f: [-100, 100, -100],
  g: [-100, -100, -100],
  h: [100, -100, -100],
};

function objectToArray(obj) {
  let keys = Object.keys(obj);
  let result = keys.map(key => {
      return obj[key];
  });
  return result;
}

function arrayToObject(arr) {
  let result = {};
  arr.forEach((subArray, index) => {
      let key = String.fromCharCode(97 + index);
      result[key] = subArray;
  });
  return result;
}


function m_mul_row_to_column(m1, m2) {
    if (m1[0].length !== m2.length) {
        throw new Error("Incompatible dimensions for matrix multiplication");
    }

    let result = [];
    for (let i = 0; i < m1.length; i++) {
        result[i] = [];
        for (let j = 0; j < m2[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function Rotate(x, y, z, tx, ty, tz) {
  let anglews = x * (Math.PI / 180)
  let angleze = y * (Math.PI / 180)
  let angleaz = z * (Math.PI / 180)
  let x_axis_rotation_matrix = [[1, 0, 0], [0, Math.cos(anglews), -(Math.sin(anglews))], [0,Math.sin(anglews),Math.cos(anglews)]]
  let y_axis_rotation_matrix = [[Math.cos(angleze), 0, Math.sin(angleze)], [0, 1, 0], [-(Math.sin(angleze)), 0,Math.cos(angleze)]]
  let z_axis_rotation_matrix = [[Math.cos(angleaz), -(Math.sin(angleaz)), 0], [Math.sin(angleaz), Math.cos(angleaz), 0], [0,0,1]]
  let transletx = tx;
  let translety = ty;
  let transletz = tz;
  let xnot = transletx;
  let ynot = translety;
  let znot = transletz;

  vertex_table = {
    //  x    y    z
    a: [100 + transletx - xnot, 100 + translety - ynot, 100 + transletz - znot],
    b: [-100 + transletx - xnot, 100 + translety - ynot, 100 + transletz - znot],
    c: [-100 + transletx - xnot, -100 + translety - ynot, 100 + transletz - znot],
    d: [100 + transletx - xnot, -100 + translety - ynot, 100 + transletz - znot],
    e: [100 + transletx - xnot, 100 + translety - ynot, -100 + transletz - znot],
    f: [-100 + transletx - xnot, 100 + translety - ynot, -100 + transletz - znot],
    g: [-100 + transletx - xnot, -100 + translety - ynot, -100 + transletz - znot],
    h: [100 + transletx - xnot, -100 + translety - ynot, -100 + transletz - znot],
  }
  vertex_table = arrayToObject(m_mul_row_to_column(objectToArray(vertex_table), z_axis_rotation_matrix))
  vertex_table = arrayToObject(m_mul_row_to_column(objectToArray(vertex_table), y_axis_rotation_matrix))
  vertex_table = arrayToObject(m_mul_row_to_column(objectToArray(vertex_table), x_axis_rotation_matrix))

  for (const key in vertex_table) {
    let table_key = vertex_table[key];  
    vertex_table[key][0] = table_key[0] + xnot
    vertex_table[key][1] = table_key[1] + ynot
    vertex_table[key][2] = table_key[2] + znot
  }
}

let Canvas_Data = '';
function Canvas_Define(String) {
    return Canvas_Data = String;
}

function line_maker(startX, startY, endX, endY, clearCanvas = false) {
  var canvas = Canvas_Data;
  var ctx = canvas.getContext('2d');
  if (clearCanvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.stroke();
}
let focal_length = 10000;

  // function focallen(int) {
    // focal_length = int;
    // }
    function main_renderer_function() {

  var canvas = Canvas_Data;
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let a_x_P = (focal_length * vertex_table.a[0]) / (focal_length + vertex_table.a[2]);
  let a_y_P = (focal_length * vertex_table.a[1]) / (focal_length + vertex_table.a[2]);
  let b_x_P = (focal_length * vertex_table.b[0]) / (focal_length + vertex_table.b[2]);
  let b_y_P = (focal_length * vertex_table.b[1]) / (focal_length + vertex_table.b[2]);
  let c_x_P = (focal_length * vertex_table.c[0]) / (focal_length + vertex_table.c[2]);
  let c_y_P = (focal_length * vertex_table.c[1]) / (focal_length + vertex_table.c[2]);
  let d_x_P = (focal_length * vertex_table.d[0]) / (focal_length + vertex_table.d[2]);
  let d_y_P = (focal_length * vertex_table.d[1]) / (focal_length + vertex_table.d[2]);
  let e_x_P = (focal_length * vertex_table.e[0]) / (focal_length + vertex_table.e[2]);
  let e_y_P = (focal_length * vertex_table.e[1]) / (focal_length + vertex_table.e[2]);
  let f_x_P = (focal_length * vertex_table.f[0]) / (focal_length + vertex_table.f[2]);
  let f_y_P = (focal_length * vertex_table.f[1]) / (focal_length + vertex_table.f[2]);
  let g_x_P = (focal_length * vertex_table.g[0]) / (focal_length + vertex_table.g[2]);
  let g_y_P = (focal_length * vertex_table.g[1]) / (focal_length + vertex_table.g[2]);
  let h_x_P = (focal_length * vertex_table.h[0]) / (focal_length + vertex_table.h[2]);
  let h_y_P = (focal_length * vertex_table.h[1]) / (focal_length + vertex_table.h[2]);


  // edge table
  let edge_table = {
    1: [a_x_P, a_y_P, b_x_P, b_y_P],
    2: [b_x_P, b_y_P, c_x_P, c_y_P],
    3: [c_x_P, c_y_P, d_x_P, d_y_P],
    4: [d_x_P, d_y_P, a_x_P, a_y_P],
    5: [a_x_P, a_y_P, e_x_P, e_y_P],
    6: [b_x_P, b_y_P, f_x_P, f_y_P],
    7: [c_x_P, c_y_P, g_x_P, g_y_P],
    8: [d_x_P, d_y_P, h_x_P, h_y_P],
    9: [e_x_P, e_y_P, f_x_P, f_y_P],
    10: [f_x_P, f_y_P, g_x_P, g_y_P],
    11: [g_x_P, g_y_P, h_x_P, h_y_P],
    12: [h_x_P, h_y_P, e_x_P, e_y_P],
  };
  function edge() {
    for (const key in edge_table) {
      let table_key = edge_table[key];
      line_maker(table_key[0], table_key[1], table_key[2], table_key[3]);
    }
  }
  edge();
  // console.log(edge_table)
  
}