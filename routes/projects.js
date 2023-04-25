const express = require('express')
const router = express.Router()
const ProjectModel = require('../model/project')

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

    project.save()
        .then(() => console.log('Document saved to database...'))
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
    const projectId = req.params.projectId

    res.render('newmember', {projectId})
})

// add member
router.post('/newmember/:projectId', async (req, res) => {
    const projectId = req.params.projectId
    var member = req.body.name

    ProjectModel.findByIdAndUpdate(projectId, { $push: { members: { name: member } } }, { new: true })
    .then(updatedProject => {
        console.log(updatedProject);
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
         //res.status(200).send(result)    
         console.log(result)
         res.render('projectdetails', {result})
    } catch (err) {
         res.status(500).json({error: err.message})
    }
})

router.get('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id
         const result = await ProjectModel.findById(id)
         res.render('editproject', {result})
    } catch (err) {
         res.status(500).json({error: err.message})
         res.redirect('/projects')
    }
})

module.exports = router