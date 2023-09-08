const router = require('express').Router();
const { Project, User } = require('../models');
const withAuth = require('../utils/auth');

// GET all projects for homepage but we also have to JOIN the project table with the user table in order to get all the user data.
router.get('/', async (req, res) => {
    try {
        const dbProjectData = await Project.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const projects = dbProjectData.map((project) =>
            project.get({ plain: true })
        );

        res.render('homepage', {
            projects,
            loggedIn: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET one project
router.get('/project/:id', async (req, res) => {
        try {
            const projectData = await Project.findByPk(req.params.id, {
                include: [
                    {
                    model: User,
                    attributes: ['name'],
                    },
                ],
            });

            const project = projectData.get({ plain: true });

            res.render('project', {
                ...project,
                logged_in: req.session.loggedIn
            });
        } catch (err) {
            res.status(500).json(err);
        }
});

// GET one painting
router.get('/painting/:id', async (req, res) => {
    // If the user is not logged in, redirect the user to the login page
    if (!req.session.loggedIn) {
        res.redirect('/login');
    } else {
        // If the user is logged in, allow them to view the painting
        try {
            const dbPaintingData = await Painting.findByPk(req.params.id);

            const painting = dbPaintingData.get({ plain: true });

            res.render('painting', { painting, loggedIn: req.session.loggedIn });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

module.exports = router;
