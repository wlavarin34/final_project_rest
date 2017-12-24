var mongoose = require('mongoose');

var teacherA = {
    teacherId:"1",
    name:'Kristen',
    lastname:'Pearce',
    title:'Title 1',
    age:19,
    isFullTime:true,
    updatedOn:'12/21/2017'
}

var teacherB = {
    teacherId:"2",
    name:'Wilkens',
    lastname:'Lavarin',
    title:'Title 2',
    age:19,
    isFullTime:true,
    updatedOn:'12/21/2017'
}


var TeacherRestController = function(TeacherModel) {
    /**
     * @param {*} req 
     * @param {*} res 
     */
    var echoMsg = function(req, res) {
        res.status(200);
        res.send("echo REST GET returned input msg:" + req.params.msg); // NOTE ilker 'res.send("echo REST GET returned input msg:%s", req.params.msg)' is WRONG. Syntax is 'res.send(status, body)'
    };

    /**
     * @param {*} req Request
     * @param {*} res Response
     */
    var find = function(req, res) {
        TeacherModel.find(function(error, teachers) {
            if (error) {
                res.status(500);
                res.send("Internal server error");
            } else {
                res.status(200);
                res.send(teachers);                
                //res.send("<h3>Teacher</h3>"+"<br>"+teacherA.name+"<br>"+teacherA.lastname+"<br>"+teacherA.title+"<br>"+teacherA.age+"<br>"+teacherA.isFullTime+"<br>"+teacherA.updatedOn+"<br>"+"Teacher Id:" + "1"+"<h3>Teacher</h3>"+"<br>"+teacherB.name+"<br>"+teacherB.lastname+"<br>"+teacherB.title+"<br>"+teacherB.age+"<br>"+teacherB.isFullTime+"<br>"+teacherB.updatedOn+"<br>"+"Teacher Id:" + "2");
            }
        });
    };

    /**
     
     * @param {*} req 
     * @param {*} res 
     */
    var findById = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            TeacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404); // 404 means not found
                    res.send("Not found Student for id:" + req.params.id);
                } else {
                    res.status(200);
                    res.send(teacher);
                }
            });
        } else {
            res.status(400); // 400 means "Bad Request" (incorrect input)
            if(req.params.id =="1"){
            res.send("<h3>Teacher</h3>"+"<br>"+teacherA.name+"<br>"+teacherA.lastname+"<br>"+teacherA.title+"<br>"+teacherA.age+"<br>"+teacherA.isFullTime+"<br>"+teacherA.updatedOn+"<br>"+"Teacher Id:" + req.params.id);
            }
            else if(req.params.id =="2"){
                res.send("<h3>Teacher</h3>"+"<br>"+teacherB.name+"<br>"+teacherB.lastname+"<br>"+teacherB.title+"<br>"+teacherB.age+"<br>"+teacherB.isFullTime+"<br>"+teacherB.updatedOn+"<br>"+"Teacher Id:" + req.params.id);
            }
            else{
                return
            }
        }
    };

    /**
     
     * @param {*} request 
     * @param {*} response 
     */
    var save = function(request, response) {
        var teacher = new TeacherModel(request.body);
        console.log("--> LOOK request: %s", request); // JSON.stringify(request)
        console.log("--> LOOK JSON.stringify(request.body): %s", JSON.stringify(request.body));
        console.log("--> LOOK request.body: %s", request.body);
        console.log("--> LOOK teacher: %s", teacher);
        teacher.save(function(error) {
            if (error) {
                response.status(500);
                response.send("Save failed");
            } else {
                response.status(201); // 201 means created
                response.send(teacher);
            }
        });
    };

    

    /**
    
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdUpdateFullyThenSave = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            TeacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404); 
                    res.send("Not found Student for id:" + req.params.id);
                } else {
                   
                    teacher.teacherId = req.body.teacherId;
                    teacher.name = req.body.name;
                    teacher.lastname = req.body.lastname;
                    teacher.age = req.body.age;
                    teacher.isFullTime = req.body.isFullTime;
                    

                    teacher.save(function(error) {
                        if (error) {
                            res.status(500);
                            res.send("Save failed");
                        } else {
                            res.status(201); // 201 means created
                            res.send(teacher);
                        }
                    });
                }
            });
        } else {
            res.status(400); // 400 means "Bad Request" (incorrect input)
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of PUT request. req.params.id:" + req.params.id);
        }
    };

    /**
    
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdUpdatePartiallyThenSave = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            TeacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404); // 404 means not found
                    res.send("Not found Teacher for id:" + req.params.id);
                } else {
                    // if incoming PUT request's body has accidentally _id, remove it from req.body
                    if (req.body._id) {
                        delete req.body._id;
                    }
                    // loop over the attributes in req.body and set them in student object
                    for (var attrName in req.body) {
                        teacher[attrName] = req.body[attrName];
                    }

                    teacher.save(function(error) {
                        if (error) {
                            res.status(500);
                            res.send("Save failed");
                        } else {
                            res.status(201); // 201 means created - in this case means updated
                            res.send(teacher);
                        }
                    })
                }
            });
        } else {
            res.status(400); // 400 means "Bad Request" (incorrect input)
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of PATCH request. req.params.id:" + req.params.id);
        }
    };

    /**
     
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdThenRemove = function(req, res) {
        try {
            console.log("findByIdThenRemove req.params.id:%s", req.params.id);
            // NOTE ilker mongoose.Types.ObjectId.isValid(req.params.id) returns true for any 12 byte string input
            if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
                // if (req.params && req.params.id) {
                console.log(" again findByIdThenRemove req.params.id:%s", req.params.id);
                TeacherModel.findById(req.params.id, function(error, teacher) {
                    if (error) {
                        console.log("findByIdThenRemove error:" + error);
                        res.status(404); // 404 means not found
                        res.send("Not found Student for id:" + req.params.id);
                    } else {
                        teacher.remove(function(error) {
                            if (error) {
                                res.status(500);
                                res.send("Remove failed");
                            } else {
                                res.status(204); // 204 means deleted
                                res.send(teacher);
                            }
                        })
                    }
                });
            } else {
                res.status(400); // 400 means "Bad Request" (incorrect input)
                res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of DELETE request. req.params.id:" + req.params.id);
            }

        } catch (e) {
            res.status(500); // 500 means "Internal Server Error". could also be due to mongodb/js-bson#205 bug that throws CastError, not being able to parse the wrong(short) _id value to objectId
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of DELETE request may be not a valid ObjectId value. req.params.id:" + req.params.id);
        }
    };

    /**
    
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdInBodyThenRemove = function(req, res) {
        console.log("findByIdInBodyThenRemove req.body._id:%s", req.body._id);
        if (req.body && req.body._id && mongoose.Types.ObjectId.isValid(req.body._id)) {
            TeacherModel.findById(req.body._id, function(error, teacher) {
                if (error) {
                    res.status(404); // 404 means "not found""
                    res.send("Not found Student for id:" + req.body._id);
                } else {
                    console.log("LAGA%sLUGA", error);
                    teacher.remove(function(error) {
                        if (error) {
                            res.status(500);
                            res.send("Remove failed");
                        } else {
                            res.status(204); // 204 means deleted ("No Content")
                            res.send(teacher);
                        }
                    })
                }
            });

        } else {
            res.status(400); // 400 means "Bad Request" (incorrect input)
            res.send("Check inputs of request. InCorrect inputs. Expected _id in body of DELETE request");
        }
    };

    // expose public functions via returned object below from this module
    return {
        echoMsg: echoMsg,
        find: find,
        findById: findById,
        save: save,
        findByIdUpdateFullyThenSave: findByIdUpdateFullyThenSave,
        findByIdUpdatePartiallyThenSave: findByIdUpdatePartiallyThenSave,
        findByIdThenRemove: findByIdThenRemove,
        findByIdInBodyThenRemove: findByIdInBodyThenRemove
    }
};

module.exports = TeacherRestController;