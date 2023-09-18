const router = require('express').Router();
const { Project, User } = require('../models');
const withAuth = require('../utils/auth');

// GET all projects for homepage
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
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET one project
router.get('/project/:id', async (req, res) => {
  try {
    const dbProjectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const project = dbProjectData.get({ plain: true });

    res.render('project', {
      ...project,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET route for profile that requires the user to be logged in and authorized to access their profile.
router.get('/profile', withAuth, async (req, res) => {
  try {
    const dbUserData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Project }],
    });

    const user = dbUserData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true   // req.session.logged_in
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
