var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display user page
router.get('/', function(req, res, next) {      
    dbConn.query('SELECT * FROM alerts ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            // render to views/alerts/index.ejs
            res.render('alerts',{data:''});   
        } else {
            // render to views/alerts/index.ejs
            res.render('alerts',{data:rows});
        }
    });
});

// display add user page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('alerts/add', {
        title: '',
        time: '',
        date:'',
        type:''
    })
})

// add a new user
router.post('/add', function(req, res, next) {    

    let title = req.body.title;
    let time = req.body.time;
    let date = req.body.date;
    let type = req.body.type;
    let errors = false;

    if(title.length === 0 || time.length === 0 || date.length === 0 || type.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter title and time and date and Type");
        // render to add.ejs with flash message
        res.render('alerts/add', {
            title: title,
            time: time,
            date:date,
            type:type
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            title: title,
            time: time,
            date:date,
            type: type
        }
        
        // insert query
        dbConn.query('INSERT INTO alerts SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('alerts/add', {
                    title: form_data.title,
                    time: form_data.time,
                    date:form_data.date,
                    type:form_data.type
                })
            } else {                
                req.flash('success', 'User successfully added');
                res.redirect('/alerts');
            }
        })
    }
})

// display edit user page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM alerts WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('/alerts')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('alerts/edit', {
                title: 'Edit User', 
                id: rows[0].id,
                title: rows[0].title,
                time: rows[0].time,
                date: rows[0].date,
                type: rows[0].type
            })
        }
    })
})

// update user data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let title = req.body.title;
    let time = req.body.time;
    let date = req.body.date;
    let type = req.body.type;
    let errors = false;

    if(title.length === 0 || time.length === 0 || date.length === 0 || type.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter title and time and date");
        // render to add.ejs with flash message
        res.render('alerts/edit', {
            id: req.params.id,
            title: title,
            time: time,
            date:date,
            type:type
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            title: title,
            time: time,
            date:date,
            type: type
        }
        // update query
        dbConn.query('UPDATE alerts SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('alerts/edit', {
                    id: req.params.id,
                    title: form_data.title,
                    time: form_data.time,
                    date: form_data.date,
                    type: form_data.type
                })
            } else {
                req.flash('success', 'User successfully updated');
                res.redirect('/alerts');
            }
        })
    }
})
   
// delete user
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM alerts WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to user page
            res.redirect('/alerts')
        } else {
            // set flash message
            req.flash('success', 'User successfully deleted! ID = ' + id)
            // redirect to user page
            res.redirect('/alerts')
        }
    })
})

module.exports = router;