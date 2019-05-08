//we need to use the path and fs modules from node.js
const path = require('path');
const fs = require('fs');

//The below values help maintain uniqueness and consistency for user/position id generation
//idTrack is incremented by one after a user id is assigned
let idTrack = 0;
//idCheck is updated to equal idTrack after a company's employee file has been processed 
let idCheck = 0;
//posidTrack is incremented by one after a position id is assigned
let posidTrack = 1;
//We use employeeId + idCheck for generating a user's site-wide id

//collections for the JSONs after they've been fixed to our specifications
let UserJSONs = [];
let PositionJSONs = [];
let CompanyJSONs = [];

//collections for the SQL commands after they've been generated
let companyComm = [];
let postCommands = [];
let userTableComm = [];

// collections for the SQL commands for updating the foreign keys
let compUpdate = [];
let postUpdate = [];

//Keeps track of which companies we've accounted for when they're referenced in employee data
let compIdList = [];

//the path to our users input folder
let folderPathA = "InputUser";

//the path to our positions input folder
let folderPathB = "InputPosition";

// path for testing purposes only, not currently used
let testPath = "Test";

//Reads each file in the users input directory
try {
  var filesA = fs.readdirSync(folderPathA);
} catch (error) {
  console.log('Error in Directory A: ' + error);
}

//runs each file in the directory of employee data through our correction system
let i = 0;
for(var f in filesA){
  try{
    var data = fs.readFileSync(folderPathA + "/" + filesA[f], 'utf-8');
  }catch(e){
    console.log('Error Reading File', e);
  }
  
  // cleans the content
  var content = fileClean(data);
  
  //for each json object 
  for(var obj in content){
    // parse info and add new fields
    UserJSONs[i] = userParse(content[obj]);
    i++;
  }
  //updates our idCheck to the max possible unique user id
  idCheck = idTrack; 
}

//create the SQL command-arrays based on fixed user/company JSON data taken from above
companyComm = companyCommands(CompanyJSONs);
userTableComm = userCommands(UserJSONs);

// create UPDATE commands to fix foreign key problems
compUpdate = updateCompany(CompanyJSONs);

//Reads each file in the positions input directory
try {
  var filesB = fs.readdirSync(folderPathB);
} catch (error) {
  console.log('Error in Directory B: ' + error);
}

//runs each file of employee data through our correction system
let index = PositionJSONs.length; 
for(var f in filesB){
  try{
    var data = fs.readFileSync(folderPathB + "/" + filesB[f], 'utf-8');
  }catch(e){
    console.log('Error Reading File', e);
  }
  
  var content = fileClean(data);
  
  //for each json object 
  for(var obj in content){
    PositionJSONs[index] = positionParse(content[obj]);
    index++;
  }
}

//create an SQL command-array based on fixed position JSON data taken from above  
postCommands = positionCommands(PositionJSONs);

// create UPDATE command for foreign key (managerID)
postUpdate = updatePos(PositionJSONs);

//uses all the generated commands and puts them together in a text file 
generateCommand(companyComm, postCommands, userTableComm, compUpdate, postUpdate);

// Below is functions used above

//turns the string representation of a list of dictionaries into a real list of dictionaries
function fileClean(fileStr){
    //uses the eval function to run a string as code
    //console.log(fileStr);
    return eval(fileStr);
}

//takes an employee json object and manipulates it to fit our user database table schema
var uIndex = 0; // index for CompanyJSONs
function userParse(obj){
  //console.log("Idcheck: " + idCheck);
  //console.log(obj.employeeId + idCheck);
    //keeps track of whether this user owns their company (starts with false assumption)
  let ceo = false;

  //only ceo gets hiring priv by default, and we have an assumption the user isn't a ceo
  obj.hasHiringPriv = false;

  //Assigns a fixed-to-be-unique managerId for each user
  let found = false;
  for(var propt in obj){
    if(propt == "managerId"){
      obj.managerId = obj.managerId + idCheck;
      found = true;
    }
  }
  //this is triggered if no manager id existed for the employee (AKA user = ceo)
  if(!found){
    obj.managerId = -1;
    ceo = true;
    obj.hasHiringPriv = true;
  }

  //generates a site-wide unique user id based on original employee id
  obj.userId = obj.employeeId + idCheck;
  //increments the id tracker up one
  ++idTrack;

  //if we have a ceo but don't have the company json accounted for we make a new one
  if(ceo && !compIdList.includes(obj.companyId)){
    var cstr = '{ "companyId":"' + obj.companyId + '", "companyName":"' + obj.companyName + '","description":"?"' +', "ownerId":"' + obj.userId + '"}';
    let comp = JSON.parse(cstr);
    CompanyJSONs[uIndex] = comp;
    uIndex++;
  }

  // changes startDate to joinDate for database purposes
  obj.joinDate = obj.startDate;
  
  //make a new but claimed position for employee
  pos = makePos(obj.positionTitle, obj.companyId, obj.managerId);
  //gives the user their position's id
  obj.positionId = pos.positionId;

  //gets rid of useless fields for users
  delete obj.positionTitle;
  delete obj.companyName;
  delete obj.employeeId;
  
  //returns the fixed json for a user
  return obj;
}

//creates an employee's filled position for our database
//function makePos(String titleP, int compId, int mangId){
function makePos(titleP, compId, mangId){
    let pos = { title: titleP};
    pos.positionId = posidTrack;
    ++posidTrack;
    pos.description = "Default Description";
    pos.companyId = compId;
    pos.managerId = mangId;
    pos.publicVisible = false;
    pos.isAvailable = false;
    pos.startDate = null;
    pos.postedDate = null;
    pos.postingExpirationDate = null;
    PositionJSONs[pos.positionId - 1] = pos;
    return pos;
}

//takes a position json object and manipulates it to fit our database schema
function positionParse(obj){
  
  //we assume the positions specifically given to us in the data are visible and open to the public
  obj.publicVisible = true;
  obj.isAvailable = true;

  //assigns an id to the position
  obj.positionId = posidTrack;
  //increments the position id tracker
  ++posidTrack;

  //checks if start date and expiration date are fields
  let foundStart = false;
  let foundExp = false;

  //iterates through the fields of the position
  for(var propt in obj){
    if(propt == "postingExpirationDate"){
      foundExp = true;
    }
    if(propt == "startDate"){
      foundStart = true;
    }  
  }

  //this is triggered if no start date field existed
  if(!foundStart){
    obj.startDate = null;
  }

  //this is triggered if no expiration date field existed
  if(!foundExp){
    obj.postingExpirationDate = null;
  }

  //gets rid of useless company name field for positions
  delete obj.companyName;
  
  //returns the fixed json for a position
  return obj;
}

//have this function join the three command-lists into one outputted text file
function generateCommand(compComs, postComs, userComs, updateComp, updateP){
  //the path to our output folder
  let folderPathC = "OutputSQL";

  // all lists put together
  let allComs = compComs.concat(postComs.concat(userComs.concat(updateComp.concat(updateP))));
  
  // creates a unique name for the file
  let date = new Date();
  let filename = "/Output_" + date.getFullYear() + '-' + (date.getMonth() + 1)+ '-' + date.getDate() + '_' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds(); 
  
  var truncate = "truncate cref, pref, uref;";

  // iterate through so it doesn't produce unnecessary commas
  for(var i = 0; i < allComs.length; i++){ 
    fs.writeFileSync(folderPathC + filename + ".txt", allComs[i] + '\r\n',{flag:'a+'}, (err) => {
      if(err) return console.log('Error found Here: ' + err);
    });
  }
  fs.writeFileSync(folderPathC + filename + ".txt", truncate + '\r\n',{flag:'a+'}, (err) => {
    if(err) return console.log('Error found Here: ' + err);
  });

}

//creates SQL commands that would populate the company table of the database
function companyCommands(objArray){
  //stores the command strings pertaining to each company
  let commandList = [];
  
  //indexes the commandList
  var i = 0;
  
  //goes through each company in objArray
  for(var comp in objArray){
    /* because our database relies on foreign keys, first all primary keys need to be
       populated first, so all foreign keys are first set to NULL and then the 
       alter table command will put the values in.
    */

    commandList[i] = "with rows as( insert into company (companyName, description) values('" + objArray[comp].companyName + "', '" + objArray[comp].description + "') returning companyID) insert into cref (cid, iid) select companyID," + objArray[comp].companyId + " from rows;";
    i++;
  }
  return commandList;
}

// creates SQL commands that will update the owner
function updateCompany(objArray){
  // stores the command to update the foreign keys of the company table (ownerID)
  let updateList = [];
  
  // index of updateList
  var i = 0;

  // goes through each company in objArray
  for(var comp in objArray){
    /* because our database relies on foreign keys, first all primary keys need to be
       populated first, so all foreign keys are first set to NULL and then the 
       alter table command will put the values in, these provide update statements 
       to put the data in after each company is made.
    */
    updateList[i] = "UPDATE Company SET ownerID = uref.uid from uref, cref where uref.iid = " + objArray[comp].ownerId + " and company.companyID = cref.cid and cref.iid = " + objArray[comp].companyId + ";";
    i++; 
  }
  return updateList;
}

//creates SQL commands that would populate the position table of the database
function positionCommands(objArray){
  //stores the command strings pertaining to each position
  let commandList = [];
  
  //indexes the commandList
  var i = 0;
  
  //goes through each position in objArray
  for(var pos in objArray){
    // if statements to get rid of 'null' since PSQL only takes null without the single quotes
    
    commandList[i] = "with rows as(insert into position (title, description, companyID, startDate, postedDate, postingExpirationDate, isAvailable) (Select '" + objArray[pos].title + "','" + objArray[pos].description + "', cref.cid," + (objArray[pos].startDate == null ? null : "'" + objArray[pos].startDate +"'") + "," + (objArray[pos].postedDate == null ? null : "'" + objArray[pos].postedDate +"'") + "," + (objArray[pos].postingExpirationDate == null ? null : "'" + objArray[pos].postingExpirationDate +"'") + "," + objArray[pos].isAvailable + " from cref where cref.iid = " + objArray[pos].companyId + ") returning positionID) insert into pref (pid, iid) (Select positionID, " + objArray[pos].positionId + " from rows);"; 
    i++;
  }
  return commandList;
}

// creates update command for position table foreign key
function updatePos(objArray){
  //stores the command strings pertaining to each position
  let updateList = [];
  
  //indexes the commandList
  var i = 0;
  
  //goes through each position in objArray
  for(var pos in objArray){
    if(objArray[pos].managerId != -1){    
      updateList[i] = "UPDATE Position SET managerID = uref.uid from uref, pref where uref.iid = " + objArray[pos].managerId + " and pref.pid = position.positionID and pref.iid = " + objArray[pos].positionId + ";";
      i++; 
    }
  }
  return updateList;
}

//creates SQL commands that would populate the user table of the database
function userCommands(objArray){
  //stores the command strings pertaining to each position
  let commandList = [];
  
  //indexes the commandList
  var i = 0;
  
  //goes through each user in objArray
  for(var user in objArray){
    commandList[i] = "with rows as(insert into usertable (firstName,lastName,managerID, positionID,companyID,hasHiringPriv,email,joinDate) (select '" + objArray[user].firstName + "','" + objArray[user].lastName + "'," + (objArray[user].managerId == -1 ? null : "uref.uid") + ", pref.pid, cref.cid,'" + objArray[user].hasHiringPriv + "','" + objArray[user].email + "','" + objArray[user].joinDate + "' from pref, " + (objArray[user].managerId == -1 ? '' : "uref, ") + " cref where pref.iid = " + objArray[user].positionId + (objArray[user].managerId == -1 ? "":" and uref.iid = " + objArray[user].managerId) + " and cref.iid = " + objArray[user].companyId + ") returning userID) insert into uref (uid, iid) (select userID," + objArray[user].userId + " from rows);";
    i++;  
  }
  return commandList;
}
  
  
