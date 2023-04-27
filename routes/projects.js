const express = require('express')
const router = express.Router()
const ProjectModel = require('../model/project')
const UserModel = require('../model/user')

// Read
router.get('/', async (req, res) => {
   try {
        const projects = await ProjectModel.find()
        //res.status(200).send(projects)
        res.render('projects', {projects})
   } catch (err) {
        res.status(500).json({error: err.message})
   }
})

router.get('/new', (req, res) => {
    res.render('newproject')
})

// Create
router.post('/', (req, res) => {

    var naziv_projekta = req.body.naziv_projekta;
    var opis_projekta = req.body.opis_projekta;
    var cijena_projekta = req.body.cijena_projekta;
    var obavljeni_poslovi = req.body.obavljeni_poslovi;
    var datum_pocetka = req.body.datum_pocetka;
    var datum_zavrsetka = req.body.datum_zavrsetka;

    const project = new ProjectModel({
        naziv_projekta: naziv_projekta,
        opis_projekta: opis_projekta,
        cijena_projekta: cijena_projekta,
        obavljeni_poslovi: obavljeni_poslovi,
        datum_pocetka: datum_pocetka,
        datum_zavrsetka: datum_zavrsetka
    })
    const userId = req.cookies.user._id

    project.save()
        .then(() => console.log('New Project saved to database...'))
        .catch(err => console.error('Error saving document...', err));

    UserModel.findByIdAndUpdate(userId, { $push: { createdProjects: project._id } }, { new: true })
        .then(() => console.log('ProjectId saved to database under user.createdProjects...'))
        .catch(err => console.error('Error saving document...', err));    

    res.redirect('/')
})

// Update
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const update = req.body; // assuming the request body contains the updated project data
        //const options = { new: true }; // this option returns the updated document
        const result = await ProjectModel.findByIdAndUpdate(id, update); // , options is third parameter
    
        if (result === null) {
          // If no project was found with the matching ID, return a 404 response
          res.status(404).send('Project not found');
        } else {
          // If the project was updated successfully, return the updated project data
          res.status(200).send(result);
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await ProjectModel.findByIdAndDelete(id);
    
        if (result === null) {
            // If no project was found with the matching ID, return a 404 response
            res.status(404).send('Project not found');
            res.render('/projects')
        } else {
            // If the project was deleted successfully, return a 204 response
            res.status(204).send();
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

router.get('/newmember/:projectId', async (req, res) => {
    try {
        const projectId = req.params.projectId
        const project = await ProjectModel.findById(projectId)

        let users = await UserModel.find()
    

        res.render('newmember', {
            projectId: projectId, 
            users: users,
            project: project
        })
    } catch (error) {
        console.error(error);
        res.redirect('/')
    }    
})

// add member
router.post('/newmember/:projectId', async (req, res) => { 
    const projectId = req.params.projectId
    const usersArray = Object.values(req.body)
    
    ProjectModel.findByIdAndUpdate(projectId, { $addToSet: { members: { $each: usersArray } } }, { new: true })

    .then(updatedProject => {
        res.redirect(`/projects/details/${projectId}`);
    })
    .catch(err => {
        console.error(err);
        res.redirect('/') 
    });
})

router.get('/details/:id', async (req, res) => {
    try {
        const id = req.params.id
         const result = await ProjectModel.findById(id)

        const projectMembers = [];
        const promises = result.members.map(async (memberId) => {
        const user = await UserModel.findById(memberId);
        if (user) {
            projectMembers.push(user);
        }
        });

        await Promise.all(promises);
         
        res.render('projectdetails', {
            result: result, 
            projectMembers: projectMembers 
        })
    } catch (err) {
         res.status(500).json({error: err.message})
    }
})

router.get('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id
        const result = await ProjectModel.findById(id)

        const userInDb = await UserModel.findById(req.cookies.user._id)

        if (userInDb.createdProjects.includes(id)) // ako je user kreirao projekt moze uredivati sve
            res.render('editproject', {result})
        else // inace ureduje samo obavljeni_poslovi
            res.render('membereditproject', {result})
    } catch (err) {
        res.status(500).json({error: err.message})
        res.redirect('/')
    }
})

router.delete('/memberunchecked/:projectId/members/:userId', async (req, res) => {
    const projectId = req.params.projectId
    const userId = req.params.userId

    if (userId.includes('<')) {
        return
    }        
    
    ProjectModel.findByIdAndUpdate(projectId, { $pull: { members: userId } }, { new: true })
        .then(() => {
            res.redirect(`/details/${projectId}`);
        })
        .catch(err => {
            console.error(err);
            res.redirect('/') 
        });
})

router.get('/onlymyprojects', async (req, res) => {
    try {        
        const userInDb = await UserModel.findById(req.cookies.user._id)

        const projects = []
        for (let i = 0; i < userInDb.createdProjects?.length; i++) {
            const project = await ProjectModel.findById(userInDb.createdProjects[i])
            if (project) {
                projects.push(project)
            }
        }
        res.render('onlymyprojects', {projects})
    } catch (err) {
        console.log(err.message)
        res.redirect('/')
    }
})

router.get('/memberonprojects', async (req, res) => {
    try {
        const loggedUserId = req.cookies.user._id

        const projects = await ProjectModel.find({ members: loggedUserId })
        res.render('memberonprojects', {projects})

    } catch (err) {
        console.log(err.message)
        res.redirect('/')
    }
})

module.exports = router