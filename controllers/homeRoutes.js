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
                    attributes: ['username'],
                },
            ],
        });

        const projects = dbProjectData.map((project) =>
            project.get({ plain: true })
        );

        res.render('homepage', {
            projects,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET one project to show on the homepage.
router.get('/project/:id', async (req, res) => {
        try {
            const dbprojectData = await Project.findByPk(req.params.id, {
                include: [
                    {
                    model: User,
                    attributes: ['username'],
                    },
                ],
            });

            const project = dbprojectData.get({ plain: true });

            res.render('project', {
                ...project,
                logged_in: req.session.logged_in
            });
        } catch (err) {
            res.status(500).json(err);
        }
});

// GET request to the user profile using withAuth middleware along with login to prevent access from non logged in users.
router.get('/profile', withAuth, async (req, res) => {
    try {
        const userLogin = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Project }],
        });

        const user = userLogin.get({ plain: true });

        res.render('profile', {
            ...user,
            logged_in: true
    
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/profile');
        return;
    }

    res.render('login');
});

module.exports = router;
