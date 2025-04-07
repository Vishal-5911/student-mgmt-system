module.exports = (req, res, next) => {
    res.locals.syllabus = {
       '1': [{ subject: 'Mathematics-I', code: 'BCA101' }, { subject: 'Applied English', code: 'BCA102' },{ subject: 'Computer Fundamentals', code: 'BCA103' }, { subject: 'C Programming', code: 'BCA104' }, { subject: 'Office Automation Tools', code: 'BCA105' },{ subject: 'Environment Science', code: 'ENVS2AECC02' },{ subject: 'C Programming Lab-I', code: 'BCA104(P)' }, { subject: 'Office Automation Tools Lab-II', code: 'BCA105(P)' }],
        '2': [{ subject: 'Mathematics-II', code: 'BCA201' },{ subject: 'Communicative English', code: 'BCA202' },{ subject: 'Communicative English', code: 'BCA203' },{ subject: 'Data Structures', code: 'BCA204' }, { subject: 'Data Base Management System', code: 'BCA205' },{ subject: 'Data Structures Lab-III', code: 'BCA204(P)' }, { subject: 'Data Base Management System Lab-IV', code: 'BCA205(P)' }],
        '3': [{ subject: 'Mathematics-III', code: 'BCA301' }, { subject: 'Business Practices and Management', code: 'BCA302' }, { subject: 'Computer Organization', code: 'BCA303' }, { subject: 'Object Oriented Programming with C++', code: 'BCA304' },{ subject: 'Desktop Publishing and Designing', code: 'BCA305' }, { subject: 'Object Oriented Programming with C++ LabV', code: 'BCA304(P)' },{ subject: 'Desktop Publishing and Designing Lab VI', code: 'BCA305(P)' }],
        '4': [{ subject: 'Personnel Management', code: 'BCA401' }, { subject: 'Accounting', code: 'BCA402' },{ subject: 'System Analysis and Design', code: 'BCA403' }, { subject: 'Internet Technology & Web Page Design', code: 'BCA404' },{ subject: 'Programming in Visual Basic', code: 'BCA405' },{ subject: 'Computer '}, { subject: 'Internet Technology & Web Page Design Lab VII', code: 'BCA404(P)' },{ subject: 'Programming in Visual Basic Lab-VIII', code: 'BCA405(P)' }, ],
        '5': [{ subject: 'Operating System', code: 'BCA501' }, { subject: 'e-Commerce', code: 'BCA502' },{ subject: 'Management Information System', code: 'BCA503' }, { subject: 'ASP.NET Technologies', code: 'BCA504' },{ subject: '	Computer Oriented Statistical Methods', code: 'BCA505' }, { subject: 'ASP.net Technologies Lab-IX', code: 'BCA504(P)' }, { subject: 'Computer Oriented Statistical Methods Lab X', code: 'BCA505(P)' }],
        '6': [{ subject: 'Computer Networks', code: 'BCA601' }, { subject: 'Numerical Methods ', code: 'BCA602' },{ subject: 'Multimedia Technology', code: 'BCA603' }, { subject: 'Computer Graphics', code: 'BCA604' },{ subject: 'Software Engineering', code: 'BCA605' }, { subject: 'Computer Graphics Lab-XI ', code: 'BCA604(P)' },{ subject: 'Major Project', code: 'BCA605(P)' }, ],
        'PGDCA1': [{ subject: 'Fundamentals of Programming Using C  ', code: 'DCS-101' },{ subject:'PC Software ', code: 'DCS-102' }, { subject: 'Operating system  ', code: 'DCS-103' }, { subject: 'Computer Organization and Architecture ', code: 'DCS-104' }, { subject: ' Practical-I ( C Language)', code: 'DCS-105' },  { subject: 'Practical-I I (PC Software) ', code: 'DCS-106' }],
        'PGDCA2': [{ subject: 'Data and File Structure ', code: 'DCS-201' },{ subject:' System Analysis and Design ', code: 'DCS-202' }, { subject:  'Object Oriented Programming & C ++ ', code: 'DCS-203' }, { subject: ' Data base Management system ', code: 'DCS-204' }, { subject: ' Practical-III (DFS Using C ++ ', code: 'DCS-205' },  { subject: 'Practical-IV (Data base Management system)', code: 'DCS-206' },{ subject: ' Project Work  ', code: 'DCS-207' }],
    };

    res.locals.faculty = [
        { name: 'Dr. Tej Singh', qualification: 'Ph.D, MCA, M.Sc. IT', image: 'prof.hod.png' },
        { name: 'Dr. Sanju Bala', qualification: 'Ph.D, M.Com, PDGCA, PGDESD, PGDIBM, B.ed', image: 'dr.sanju-bala.png' },


        { name: 'Dr. Kanchan Sharma', qualification: 'Ph.D, MCA, M.Sc. Maths,B.ed', image: 'dr.kanchan.png' },

        { name: 'Dr. Monika', qualification: 'Ph.D, MCA', image: 'prof.monika.png' },
        { name: 'Prof. Ankit Chandle', qualification: 'M.Tech, UGC-NET', image: 'prof.ankit.png' },
        { name: 'Dr. Sonika Sharma', qualification: 'Ph.D, MA Mathematics, PGDCA, B.ed', image: 'dr.sonika.png' },
        { name: 'Prof. Poonam Thakur', qualification: 'M.Tech,UGC-NET', image: 'prof.poonam.png' },
    ];

    res.locals.additionalInfo = [
        { topic: 'Git & GitHub', definition: 'Version control system to track changes.', link: 'https://www.youtube.com/watch?v=SWYqp7iY_Tc', article: 'https://www.atlassian.com/git/tutorials/what-is-version-control' },
        { topic: 'Linux Basics', definition: 'Open-source OS used in servers and dev environments.', link: 'https://www.youtube.com/watch?v=IVquJh3DXUA', article: 'https://opensource.com/resources/linux' },
        { topic: 'Docker', definition: 'Containerization platform for deploying apps.', link: 'https://www.youtube.com/watch?v=fqMOX6JJhGo', article: 'https://www.docker.com/resources/what-container/' },
        { topic: 'Kubernetes', definition: 'System for automating containerized application deployment.', link: 'https://www.youtube.com/watch?v=PH-2FfFD2PU', article: 'https://kubernetes.io/docs/concepts/overview/' },
        { topic: 'Python Basics', definition: 'Popular programming language for automation and AI.', link: 'https://www.youtube.com/watch?v=rfscVS0vtbw', article: 'https://www.python.org/doc/' }
    ];

    res.locals.departmentImages = [
        "library.png",
        "dept1.png",

    ];
    next();
};
