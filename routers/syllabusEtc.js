
const { Router } = require("express");

const router = Router();
// Sample data
// const syllabus = {
//     '1': [{ subject: 'Mathematics', code: 'BCA101' }, { subject: 'C Programming', code: 'BCA102' }],
//     '2': [{ subject: 'Data Structures', code: 'BCA201' }, { subject: 'DBMS', code: 'BCA202' }],
//     '3': [{ subject: 'Operating Systems', code: 'BCA301' }, { subject: 'OOP with Java', code: 'BCA302' }],
//     '4': [{ subject: 'Computer Networks', code: 'BCA401' }, { subject: 'Web Technologies', code: 'BCA402' }],
//     '5': [{ subject: 'Software Engineering', code: 'BCA501' }, { subject: 'AI & ML Basics', code: 'BCA502' }],
//     '6': [{ subject: 'Cloud Computing', code: 'BCA601' }, { subject: 'Cyber Security', code: 'BCA602' }],
//     'PGDCA1': [{ subject: 'Advanced Java', code: 'PGD101' }, { subject: 'Big Data Analytics', code: 'PGD102' }],
//     'PGDCA2': [{ subject: 'Blockchain Technology', code: 'PGD201' }, { subject: 'Deep Learning', code: 'PGD202' }]
// };

// const faculty = [
//     { name: 'Dr. A Sharma', qualification: 'PhD in CS', expertise: 'AI & ML', image: 'faculty1.jpg' },
//     { name: 'Prof. B Verma', qualification: 'M.Tech', expertise: 'Web Development', image: 'faculty2.jpg' },
//     { name: 'Ms. C Gupta', qualification: 'M.Sc CS', expertise: 'Cyber Security', image: 'faculty3.jpg' }
// ];

// const additionalInfo = [
//     { topic: 'Git & GitHub', definition: 'Version control system to track changes.', link: 'https://www.youtube.com/watch?v=SWYqp7iY_Tc', article: 'https://www.atlassian.com/git/tutorials/what-is-version-control' },
//     { topic: 'Linux Basics', definition: 'Open-source OS used in servers and dev environments.', link: 'https://www.youtube.com/watch?v=IVquJh3DXUA', article: 'https://opensource.com/resources/linux' },
//     { topic: 'Docker', definition: 'Containerization platform for deploying apps.', link: 'https://www.youtube.com/watch?v=fqMOX6JJhGo', article: 'https://www.docker.com/resources/what-container/' },
//     { topic: 'Kubernetes', definition: 'System for automating containerized application deployment.', link: 'https://www.youtube.com/watch?v=PH-2FfFD2PU', article: 'https://kubernetes.io/docs/concepts/overview/' },
//     { topic: 'Python Basics', definition: 'Popular programming language for automation and AI.', link: 'https://www.youtube.com/watch?v=rfscVS0vtbw', article: 'https://www.python.org/doc/' }
// ];


router.get('/syllabus', (req, res) => {
    return res.render('syllabus');
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

router.get('/faculty', (req, res) => {
    res.render('faculty');
});

router.get('/additional-info', (req, res) => {
    res.render('additional-info');
});

module.exports = router;