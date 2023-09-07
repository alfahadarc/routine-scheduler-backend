
import {
  store,
  getLabroom
} from "./repo.js";

export async function storeme(req, res, next) {

  try {
    const result = await store(req.body.initial, JSON.stringify(req.body.theory));
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function lab(req, res, next) {

  let result;
  
  try {
    result = await getLabroom();
    
  }
  catch (err) {
    next(err);
  }

  let val =[]
  for (let i = 0; i < result.length; i++) {
    let level;
    if (result[i].batch == 21) {
      level="L1-T2"
    } else if (result[i].batch == 20) {
      level="L2-T2"

    } else if (result[i].batch == 19) {
      level="L3-T2"

    }
    else if (result[i].batch == 18) {
      level="L4-T1"
    }
    let obj = {
      room: result[i].room,
      lvl: level
    }
    val.push(obj)
  }

  console.log(val)

  let object=[]

  for(let i=0; i< val.length; i++){
    let find = object.find(element => element.room == val[i].room);
    if(find){
      let findlvl = find.lvl.find(element => element == val[i].lvl);
      if(!findlvl){
        find.lvl.push(val[i].lvl)
      }
    }else{
      let obj = {
        room: val[i].room,
        lvl: []
      }
      obj.lvl.push(val[i].lvl)
      object.push(obj)
    }
  }

  console.log(object)


  // let lvlterm = [];
  // let fixedRoomAllocation = req.body.fixedRoomAllocation;

  // for (let i = 0; i < fixedRoomAllocation.length; i++) {
  //   let room = fixedRoomAllocation[i].room
  //   for (let j = 0; j < fixedRoomAllocation[i].courses.length; j++) {
  //     //console.log(fixedRoomAllocation[i].courses[j].level_term)
  //     let lvl = fixedRoomAllocation[i].courses[j].level_term
  //     let c = {
  //       room: room,
  //       lvl: lvl
  //     }
  //     lvlterm.push(c)
  //   }
  // }

  // let obj = {
  //   room: "",
  //   lvl: ""
  // }
  // let arr = []
  

  // for (let i = 0; i < lvlterm.length; i++) {

  //   //find arr for room
  //   let found = arr.find(element => element.lvl == lvlterm[i].lvl);
  //   if (found) {
  //     //console.log("found")
  //     //console.log(found)
  //     //if room is not there push
  //     let foundroom = found.room.find(element => element == lvlterm[i].room);
  //     if (!foundroom) {
  //       //console.log("room not found")
  //       found.room.push(lvlterm[i].room)
  //     }

  //   } else {
  //     //console.log("not found")
  //     obj.lvl = lvlterm[i].lvl
  //     obj.room = []

  //     obj.room.push(lvlterm[i].room)
  //     arr.push(obj)
  //     obj = {
  //       room: "",
  //       lvl: ""
  //     }
  //   }
  // }
  

  res.send(object)
}

