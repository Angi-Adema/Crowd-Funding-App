const router = require('express').Router();
const { Project } = require('../models');

// GET all projects for homepage
router.get('/', async (req, res) => {
    try {
        const dbProjectData = await Project.findAll({
            include: [
                {
                    model: Project,
                    attributes: ['name', 'date_created', 'description'],
                },
            ],
        });

        const projects = dbProjectData.map((project) =>
            project.get({ plain: true })
        );

        res.render('homepage', {
            projects,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// GET one project
router.get('/project/:id', async (req, res) => {
    // If the user is not logged in, redirect the user to the login page
    if (!req.session.loggedIn) {
        res.redirect('/login');
    } else {
        // If the user is logged in, allow them to view the gallery
        try {
            const dbProjectData = await Project.findByPk(req.params.id, {
                include: [
                    {
                        model: Project,
                        attributes: [
                            'id',
                            'name',
                            'description',
                        ],
                    },
                ],
            });
            const gallery = dbGalleryData.get({ plain: true });
            res.render('gallery', { gallery, loggedIn: req.session.loggedIn });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
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
