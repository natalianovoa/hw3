"use strict";

const resetDB = require("../config/scripts/populateDB")

const Companion = require("./schema/Companion");
const Doctor = require("./schema/Doctor");

const express = require("express");
const router = express.Router();


// completely resets your database.
// really bad idea irl, but useful for testing
router.route("/reset")
    .get((_req, res) => {
        resetDB(() => {
            res.status(200).send({
                message: "Data has been reset."
            });
        });
    });

router.route("/")
    .get((_req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });
    
// ---------------------------------------------------
// Edit below this line
// ---------------------------------------------------
router.route("/doctors")
    .get((req, res) => {
        console.log("GET /doctors");

        // already implemented:
        Doctor.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /doctors");
        Doctor.create(req.body)
            .save()
            .then(doctor => {
                res.status(201).send(doctor);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });

// optional:
router.route("/doctors/favorites")
    .get((req, res) => {
        console.log(`GET /doctors/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /doctors/favorites`);
        if(!req.body.name || !req.body.seasons || !req.body.doc_id) {
            res.status(404).send({message: 'name, seasons, and id required'})
            return;
        }
        Doctor.create(req.body)
            .save()
            .then(doctor => {
                res.status(201).send(doctor);
            });
    });
    
router.route("/doctors/:id")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}`);
        Doctor.findById(req.params.id)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(404).send(err);
        });
    })
    .patch((req, res) => {
        console.log(`PATCH /doctors/${req.params.id}`);
        Doctor.findOneAndUpdate(
            {_id: req.params.id},
            req.body,
            {new: true}
        )
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(404).send({
                message: `Doctor with id "${req.params.id}" does not exist.`

            });
        });
    })
    .delete((req, res) => {
        console.log(`DELETE /doctors/${req.params.id}`);
        Doctor.findOneAndDelete(
            {_id: req.params.id}
        )
        .then(data => {
            if(data){
            res.status(200).send(null);
            }
            else {
                res.status(404).send({
                    message: `Doctor with id "${req.params.id}" does not exist.`
    
                });
            }
        })
        .catch(err => {
            res.status(404).send(err);
        });
    })
    
router.route("/doctors/:id/companions")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/companions`);
        Companion.find({doctors: req.params.id})
        .then(data => {
                res.status(200).send(data);
            })
        .catch(err => {
                res.status(404).send(err);
        })
        
    })

router.route("/doctors/:id/goodparent")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/goodparent`);
        Companion.find({'doctors':{'$in':req.params.id}, 'alive': {'$eq':false}})
        .then(data => {
            if  (data.length <= 0)
                res.status(200).send(true);
            else{
                res.status(200).send(false)
            }
        })
        .catch(err => {
                res.status(404).send(err);
        })
        
    })

// optional:
router.route("/doctors/favorites/:doctor_id")
    .delete((req, res) => {
        console.log(`DELETE /doctors/favorites/${req.params.doctor_id}`);
        res.status(501).send();
    });

router.route("/companions")
    .get((req, res) => {
        console.log("GET /companions");
        // already implemented:
        Companion.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(404).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /companions");
        Companion.create(req.body)
            .save()
            .then(companion => {
                res.status(201).send(companion);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });

router.route("/companions/crossover")
    .get((req, res) => {
        console.log(`GET /companions/crossover`);
        Companion.find({'doctors.1':{$exists:true}})
        .then(data => {
            res.status(200).send(data)
            })
        .catch(err => {
                res.status(404).send(err);
        });
    })

// optional:
router.route("/companions/favorites")
    .get((req, res) => {
        console.log(`GET /companions/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /companions/favorites`);
        res.status(501).send();
    })

router.route("/companions/:id")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}`);
        Companion.findById(req.params.id)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(404).send(err);
        });
    })
    .patch((req, res) => {
        console.log(`PATCH /companions/${req.params.id}`);
        Companion.findOneAndUpdate(
            {_id: req.params.id},
            req.body,
            {new: true}
        )
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(404).send({
                message: `Companion with id "${req.params.id}" does not exist.`

            });
        });
    })
    .delete((req, res) => {
        console.log(`DELETE /companions/${req.params.id}`);
        Companion.findOneAndDelete(
            {_id: req.params.id}
        )
        .then(data => {
            if(data){
            res.status(200).send(null);
            }
            else {
                res.status(404).send({
                    message: `Companion with id "${req.params.id}" does not exist.`
    
                });
            }
        })
        .catch(err => {
            res.status(404).send(err);
        });
    })

router.route("/companions/:id/doctors")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/doctors`);
        Companion.findById(req.params.id)
        .then(data => {
            res.status(200).send(data.doctors);
        })
        .catch(err => {
            res.status(404).send(err);
        });
    });

router.route("/companions/:id/friends")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/friends`);
        Companion.findById(req.params.id)
        .then(data => {
            Companion.find({'_id':{'$ne':req.params.id}, 'seasons':{'$in':data.seasons}})
            .then(data => {
                res.status(200).send(data);
        })
            .catch(err => {
                res.status(404).send(err);
        })
    })
        .catch(err => {
                res.status(404).send(err);
        })
        
    });

// optional:
router.route("/companions/favorites/:companion_id")
    .delete((req, res) => {
        console.log(`DELETE /companions/favorites/${req.params.companion_id}`);
        res.status(501).send();
    });

module.exports = router;