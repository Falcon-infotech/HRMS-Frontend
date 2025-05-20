import { format, addDays, subDays } from 'date-fns';

// Define types
export type JobStatus = 'draft' | 'open' | 'closed' | 'cancelled';
export type CandidateStatus = 'applied' | 'screening' | 'interview' | 'assessment' | 'offer' | 'hired' | 'rejected' | 'on-hold';
export type InterviewStatus = 'scheduled' | 'completed' | 'no-show' | 'rescheduled' | 'cancelled';

// Interfaces
export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedDate: string;
  closingDate: string;
  status: JobStatus;
  candidates: number;
  hiringManager: string;
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: number;
  currentCompany?: string;
  currentPosition?: string;
  education: string;
  skills: string[];
  appliedDate: string;
  resumeUrl: string;
  coverLetterUrl?: string;
  status: CandidateStatus;
  rating: number;
  source: string;
  notes?: string;
  interviewSchedule?: Interview[];
}

export interface Interview {
  id: string;
  candidateId: string;
  jobId: string;
  candidateName: string;
  round: number;
  title: string;
  interviewers: {
    id: string;
    name: string;
  }[];
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  location: 'in-person' | 'phone' | 'video';
  status: InterviewStatus;
  feedback?: {
    rating: number;
    strengths: string[];
    improvements: string[];
    comments: string;
    recommended: boolean;
  };
}

// Generate mock job descriptions
const generateJobs = (): Job[] => {
  return [
    {
      id: 'JOB001',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'full-time',
      experience: '5+ years',
      salary: {
        min: 120000,
        max: 160000,
        currency: 'USD'
      },
      description: 'We are looking for a Senior Software Engineer to design, develop, and maintain our software applications. The ideal candidate has strong expertise in modern web technologies and a passion for building high-quality software.',
      requirements: [
        'Bachelor\'s degree in Computer Science or a related field',
        'Minimum of 5 years of experience in software development',
        'Proficiency in JavaScript/TypeScript and React',
        'Experience with Node.js and RESTful APIs',
        'Strong problem-solving skills and attention to detail',
        'Excellent communication and collaboration abilities'
      ],
      responsibilities: [
        'Design and implement new features for our web applications',
        'Collaborate with product managers and UI/UX designers',
        'Write clean, efficient, and well-documented code',
        'Participate in code reviews and ensure code quality',
        'Troubleshoot and fix bugs and performance issues',
        'Mentor junior developers'
      ],
      postedDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      closingDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      status: 'open',
      candidates: 18,
      hiringManager: 'James Taylor'
    },
    {
      id: 'JOB002',
      title: 'Product Manager',
      department: 'Product',
      location: 'San Francisco, CA',
      type: 'full-time',
      experience: '3+ years',
      salary: {
        min: 110000,
        max: 140000,
        currency: 'USD'
      },
      description: 'We are seeking a Product Manager to help us define and execute our product strategy. The ideal candidate will have a deep understanding of user needs, market trends, and business requirements.',
      requirements: [
        'Bachelor\'s degree in Business, Computer Science, or a related field',
        '3+ years of experience in product management',
        'Strong analytical and problem-solving skills',
        'Excellent communication and stakeholder management abilities',
        'Experience with agile development methodologies',
        'Technical background is a plus'
      ],
      responsibilities: [
        'Define product vision, strategy, and roadmap',
        'Gather and prioritize product requirements',
        'Work closely with engineering, design, and marketing teams',
        'Conduct market research and analyze user feedback',
        'Define and track key product metrics',
        'Present product plans to stakeholders'
      ],
      postedDate: format(subDays(new Date(), 20), 'yyyy-MM-dd'),
      closingDate: format(addDays(new Date(), 40), 'yyyy-MM-dd'),
      status: 'open',
      candidates: 12,
      hiringManager: 'Sarah Johnson'
    },
    {
      id: 'JOB003',
      title: 'UI/UX Designer',
      department: 'Product',
      location: 'Remote',
      type: 'full-time',
      experience: '2+ years',
      salary: {
        min: 90000,
        max: 120000,
        currency: 'USD'
      },
      description: 'We are looking for a talented UI/UX Designer to create amazing user experiences. The ideal candidate should have a passion for designing beautiful, intuitive interfaces and a strong understanding of user-centered design principles.',
      requirements: [
        'Bachelor\'s degree in Design, HCI, or a related field',
        '2+ years of experience in UI/UX design',
        'Proficiency in design tools such as Figma, Sketch, or Adobe XD',
        'Strong portfolio demonstrating UX process and UI design skills',
        'Knowledge of user research methods and usability testing',
        'Understanding of web and mobile design principles and accessibility standards'
      ],
      responsibilities: [
        'Create wireframes, prototypes, and high-fidelity mockups',
        'Conduct user research and usability testing',
        'Collaborate with product managers and engineers',
        'Design intuitive user interfaces and experiences',
        'Develop and maintain design systems and style guides',
        'Gather and incorporate user feedback'
      ],
      postedDate: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
      closingDate: format(addDays(new Date(), 35), 'yyyy-MM-dd'),
      status: 'open',
      candidates: 15,
      hiringManager: 'Emma Garcia'
    },
    {
      id: 'JOB004',
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'San Francisco, CA',
      type: 'full-time',
      experience: '1-3 years',
      salary: {
        min: 70000,
        max: 90000,
        currency: 'USD'
      },
      description: 'We are seeking a Marketing Specialist to help us develop and implement marketing strategies. The ideal candidate will have experience with digital marketing channels and a data-driven approach to marketing.',
      requirements: [
        'Bachelor\'s degree in Marketing, Communications, or a related field',
        '1-3 years of experience in marketing',
        'Knowledge of digital marketing channels (email, social media, SEO)',
        'Experience with marketing analytics tools',
        'Strong communication and copywriting skills',
        'Creative mindset with attention to detail'
      ],
      responsibilities: [
        'Develop and execute marketing campaigns',
        'Create and manage content for various channels',
        'Track and analyze marketing metrics',
        'Collaborate with design and product teams',
        'Manage social media accounts',
        'Help organize events and webinars'
      ],
      postedDate: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
      closingDate: format(addDays(new Date(), 50), 'yyyy-MM-dd'),
      status: 'open',
      candidates: 8,
      hiringManager: 'Emily Davis'
    },
    {
      id: 'JOB005',
      title: 'Sales Representative',
      department: 'Sales',
      location: 'New York, NY',
      type: 'full-time',
      experience: '2+ years',
      salary: {
        min: 60000,
        max: 100000,
        currency: 'USD'
      },
      description: 'We are looking for a Sales Representative to help us grow our customer base. The ideal candidate will be a motivated self-starter with strong interpersonal skills and a track record of exceeding sales targets.',
      requirements: [
        'Bachelor\'s degree in Business, Marketing, or a related field',
        '2+ years of experience in sales',
        'Excellent communication and negotiation skills',
        'Experience with CRM software',
        'Ability to work independently and as part of a team',
        'Results-driven with a strong work ethic'
      ],
      responsibilities: [
        'Identify and pursue new sales opportunities',
        'Build and maintain relationships with prospects and customers',
        'Understand customer needs and provide appropriate solutions',
        'Meet or exceed sales targets',
        'Prepare and deliver sales presentations',
        'Keep detailed records and provide sales reports'
      ],
      postedDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
      closingDate: format(addDays(new Date(), 55), 'yyyy-MM-dd'),
      status: 'open',
      candidates: 6,
      hiringManager: 'David Wilson'
    },
    {
      id: 'JOB006',
      title: 'Customer Support Specialist',
      department: 'Customer Support',
      location: 'Remote',
      type: 'full-time',
      experience: '1+ years',
      salary: {
        min: 55000,
        max: 70000,
        currency: 'USD'
      },
      description: 'We are seeking a Customer Support Specialist to provide excellent service to our customers. The ideal candidate will have strong communication skills, problem-solving abilities, and a customer-centric mindset.',
      requirements: [
        'Bachelor\'s degree or equivalent experience',
        '1+ years of experience in customer support',
        'Excellent verbal and written communication skills',
        'Problem-solving abilities and attention to detail',
        'Patience and empathy when dealing with customer issues',
        'Basic technical knowledge relevant to our products'
      ],
      responsibilities: [
        'Respond to customer inquiries via email, chat, and phone',
        'Troubleshoot and resolve customer issues',
        'Document customer interactions in CRM system',
        'Identify and escalate complex issues when necessary',
        'Provide product information and guidance to customers',
        'Collect and report customer feedback'
      ],
      postedDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
      closingDate: format(addDays(new Date(), 23), 'yyyy-MM-dd'),
      status: 'open',
      candidates: 10,
      hiringManager: 'William Lee'
    },
    {
      id: 'JOB007',
      title: 'Data Analyst',
      department: 'Finance',
      location: 'San Francisco, CA',
      type: 'full-time',
      experience: '2-4 years',
      salary: {
        min: 85000,
        max: 110000,
        currency: 'USD'
      },
      description: 'We are looking for a Data Analyst to help us make data-driven decisions. The ideal candidate will have strong analytical skills, experience with data visualization, and the ability to translate complex data into actionable insights.',
      requirements: [
        'Bachelor\'s degree in Statistics, Mathematics, Computer Science, or a related field',
        '2-4 years of experience in data analysis',
        'Proficiency in SQL and Excel',
        'Experience with data visualization tools (e.g., Tableau, Power BI)',
        'Strong analytical and problem-solving skills',
        'Excellent attention to detail'
      ],
      responsibilities: [
        'Collect, process, and analyze data from various sources',
        'Create reports and dashboards to visualize data',
        'Identify trends and patterns in data',
        'Collaborate with different teams to understand their data needs',
        'Develop and maintain data documentation',
        'Make recommendations based on data analysis'
      ],
      postedDate: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
      closingDate: format(addDays(new Date(), 57), 'yyyy-MM-dd'),
      status: 'open',
      candidates: 5,
      hiringManager: 'Olivia Brown'
    },
    {
      id: 'JOB008',
      title: 'HR Coordinator',
      department: 'Human Resources',
      location: 'San Francisco, CA',
      type: 'full-time',
      experience: '1-3 years',
      salary: {
        min: 60000,
        max: 75000,
        currency: 'USD'
      },
      description: 'We are seeking an HR Coordinator to support our Human Resources team. The ideal candidate will be detail-oriented, organized, and have excellent interpersonal skills.',
      requirements: [
        'Bachelor\'s degree in Human Resources, Business, or a related field',
        '1-3 years of experience in HR',
        'Knowledge of HR practices and regulations',
        'Experience with HRIS and applicant tracking systems',
        'Excellent organizational and time management skills',
        'Strong communication and interpersonal abilities'
      ],
      responsibilities: [
        'Assist with recruitment and onboarding processes',
        'Maintain employee records and HR databases',
        'Support benefits administration and employee relations',
        'Help organize HR events and initiatives',
        'Respond to employee inquiries',
        'Prepare HR reports and documentation'
      ],
      postedDate: format(subDays(new Date(), 45), 'yyyy-MM-dd'),
      closingDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
      status: 'closed',
      candidates: 14,
      hiringManager: 'Sophia Martinez'
    },
    {
      id: 'JOB009',
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'full-time',
      experience: '3+ years',
      salary: {
        min: 110000,
        max: 150000,
        currency: 'USD'
      },
      description: 'We are looking for a DevOps Engineer to help us build and maintain our infrastructure and deployment processes. The ideal candidate will have experience with cloud platforms, automation tools, and CI/CD pipelines.',
      requirements: [
        'Bachelor\'s degree in Computer Science or a related field',
        '3+ years of experience in DevOps or Site Reliability Engineering',
        'Experience with cloud platforms (AWS, Azure, or GCP)',
        'Knowledge of containerization technologies (Docker, Kubernetes)',
        'Proficiency in scripting languages (Python, Bash, etc.)',
        'Experience with CI/CD tools (Jenkins, GitLab CI, etc.)'
      ],
      responsibilities: [
        'Design, implement, and maintain CI/CD pipelines',
        'Manage cloud infrastructure and services',
        'Implement monitoring and alerting systems',
        'Automate deployment and operations processes',
        'Collaborate with development teams to improve processes',
        'Ensure system reliability, security, and scalability'
      ],
      postedDate: format(subDays(new Date(), 60), 'yyyy-MM-dd'),
      closingDate: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
      status: 'closed',
      candidates: 9,
      hiringManager: 'James Taylor'
    },
    {
      id: 'JOB010',
      title: 'Financial Analyst',
      department: 'Finance',
      location: 'San Francisco, CA',
      type: 'full-time',
      experience: '2-5 years',
      salary: {
        min: 90000,
        max: 120000,
        currency: 'USD'
      },
      description: 'Draft',
      requirements: [
        'Draft'
      ],
      responsibilities: [
        'Draft'
      ],
      postedDate: '',
      closingDate: '',
      status: 'draft',
      candidates: 0,
      hiringManager: 'Olivia Brown'
    }
  ];
};

// Generate mock candidates
const generateCandidates = (): Candidate[] => {
  const candidates: Candidate[] = [
    {
      id: 'CAN001',
      jobId: 'JOB001',
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      experience: 7,
      currentCompany: 'Tech Corp',
      currentPosition: 'Software Engineer',
      education: 'MS Computer Science, Stanford University',
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'GraphQL', 'AWS'],
      appliedDate: format(subDays(new Date(), 25), 'yyyy-MM-dd'),
      resumeUrl: '#',
      coverLetterUrl: '#',
      status: 'interview',
      rating: 4.5,
      source: 'LinkedIn',
      notes: 'Strong technical skills and good cultural fit.'
    },
    {
      id: 'CAN002',
      jobId: 'JOB001',
      name: 'Jessica Williams',
      email: 'jessica.williams@example.com',
      phone: '(555) 234-5678',
      location: 'Oakland, CA',
      experience: 6,
      currentCompany: 'Software Solutions Inc.',
      currentPosition: 'Senior Developer',
      education: 'BS Computer Science, UC Berkeley',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Docker'],
      appliedDate: format(subDays(new Date(), 23), 'yyyy-MM-dd'),
      resumeUrl: '#',
      status: 'assessment',
      rating: 4.0,
      source: 'Indeed',
      notes: 'Good experience with our tech stack.'
    },
    {
      id: 'CAN003',
      jobId: 'JOB001',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '(555) 345-6789',
      location: 'San Jose, CA',
      experience: 5,
      currentCompany: 'Tech Innovators',
      currentPosition: 'Software Engineer',
      education: 'MS Software Engineering, San Jose State University',
      skills: ['JavaScript', 'React', 'Redux', 'Express', 'PostgreSQL'],
      appliedDate: format(subDays(new Date(), 20), 'yyyy-MM-dd'),
      resumeUrl: '#',
      status: 'offer',
      rating: 4.8,
      source: 'Referral',
      notes: 'Excellent technical skills and team fit.'
    },
    {
      id: 'CAN004',
      jobId: 'JOB001',
      name: 'Samantha Lee',
      email: 'samantha.lee@example.com',
      phone: '(555) 456-7890',
      location: 'San Francisco, CA',
      experience: 4,
      currentCompany: 'Web Developers Co.',
      currentPosition: 'Frontend Developer',
      education: 'BS Computer Science, UCLA',
      skills: ['JavaScript', 'TypeScript', 'React', 'CSS', 'HTML', 'Redux'],
      appliedDate: format(subDays(new Date(), 18), 'yyyy-MM-dd'),
      resumeUrl: '#',
      coverLetterUrl: '#',
      status: 'screening',
      rating: 3.5,
      source: 'Company Website',
      notes: 'Strong frontend skills.'
    },
    {
      id: 'CAN005',
      jobId: 'JOB001',
      name: 'David Kim',
      email: 'david.kim@example.com',
      phone: '(555) 567-8901',
      location: 'Remote',
      experience: 8,
      currentCompany: 'Global Tech',
      currentPosition: 'Lead Developer',
      education: 'BS Computer Engineering, MIT',
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Cloud Architecture'],
      appliedDate: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
      resumeUrl: '#',
      status: 'rejected',
      rating: 3.0,
      source: 'LinkedIn',
      notes: 'Good experience, but not the right cultural fit.'
    },
    {
      id: 'CAN006',
      jobId: 'JOB002',
      name: 'Rachel Martinez',
      email: 'rachel.martinez@example.com',
      phone: '(555) 678-9012',
      location: 'San Francisco, CA',
      experience: 5,
      currentCompany: 'Product Innovations',
      currentPosition: 'Product Manager',
      education: 'MBA, UC Berkeley',
      skills: ['Product Strategy', 'Agile Methodologies', 'User Research', 'Data Analysis', 'Roadmapping'],
      appliedDate: format(subDays(new Date(), 17), 'yyyy-MM-dd'),
      resumeUrl: '#',
      coverLetterUrl: '#',
      status: 'interview',
      rating: 4.7,
      source: 'Referral',
      notes: 'Great experience and excellent communication skills.'
    },
    {
      id: 'CAN007',
      jobId: 'JOB002',
      name: 'Thomas Wilson',
      email: 'thomas.wilson@example.com',
      phone: '(555) 789-0123',
      location: 'Seattle, WA (Willing to relocate)',
      experience: 4,
      currentCompany: 'Tech Solutions',
      currentPosition: 'Product Owner',
      education: 'BS Business Administration, University of Washington',
      skills: ['Product Management', 'User Stories', 'Prioritization', 'Stakeholder Management'],
      appliedDate: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
      resumeUrl: '#',
      status: 'assessment',
      rating: 4.2,
      source: 'LinkedIn',
      notes: 'Good experience with similar products.'
    },
    {
      id: 'CAN008',
      jobId: 'JOB003',
      name: 'Emily Johnson',
      email: 'emily.johnson@example.com',
      phone: '(555) 890-1234',
      location: 'San Francisco, CA',
      experience: 3,
      currentCompany: 'Design Studio',
      currentPosition: 'UI/UX Designer',
      education: 'BFA Graphic Design, Rhode Island School of Design',
      skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Interaction Design', 'Visual Design'],
      appliedDate: format(subDays(new Date(), 12), 'yyyy-MM-dd'),
      resumeUrl: '#',
      coverLetterUrl: '#',
      status: 'offer',
      rating: 4.9,
      source: 'Dribbble',
      notes: 'Exceptional portfolio and great interview performance.'
    },
    {
      id: 'CAN009',
      jobId: 'JOB003',
      name: 'Kevin Brown',
      email: 'kevin.brown@example.com',
      phone: '(555) 901-2345',
      location: 'Los Angeles, CA (Willing to relocate)',
      experience: 2,
      currentCompany: 'Creative Agency',
      currentPosition: 'UX Designer',
      education: 'BS Human-Computer Interaction, Carnegie Mellon University',
      skills: ['User Research', 'Usability Testing', 'Wireframing', 'Figma', 'Design Systems'],
      appliedDate: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
      resumeUrl: '#',
      status: 'applied',
      rating: 0,
      source: 'Company Website',
      notes: ''
    },
    {
      id: 'CAN010',
      jobId: 'JOB004',
      name: 'Laura Garcia',
      email: 'laura.garcia@example.com',
      phone: '(555) 012-3456',
      location: 'San Francisco, CA',
      experience: 2,
      currentCompany: 'Marketing Agency',
      currentPosition: 'Digital Marketing Specialist',
      education: 'BS Marketing, San Francisco State University',
      skills: ['Social Media Marketing', 'Email Campaigns', 'Content Creation', 'SEO', 'Google Analytics'],
      appliedDate: format(subDays(new Date(), 8), 'yyyy-MM-dd'),
      resumeUrl: '#',
      coverLetterUrl: '#',
      status: 'screening',
      rating: 4.0,
      source: 'Indeed',
      notes: 'Good experience with digital marketing channels.'
    },
    {
      id: 'CAN011',
      jobId: 'JOB004',
      name: 'Daniel Thompson',
      email: 'daniel.thompson@example.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      experience: 3,
      currentCompany: 'Growth Marketers',
      currentPosition: 'Marketing Specialist',
      education: 'BA Communication, UC Davis',
      skills: ['Content Marketing', 'Campaign Management', 'Social Media', 'Copywriting', 'Marketing Analytics'],
      appliedDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
      resumeUrl: '#',
      status: 'applied',
      rating: 0,
      source: 'LinkedIn',
      notes: ''
    },
    {
      id: 'CAN012',
      jobId: 'JOB005',
      name: 'Christina Lee',
      email: 'christina.lee@example.com',
      phone: '(555) 234-5678',
      location: 'New York, NY',
      experience: 4,
      currentCompany: 'Sales Solutions Inc.',
      currentPosition: 'Sales Representative',
      education: 'BS Business Management, NYU',
      skills: ['B2B Sales', 'CRM Software', 'Negotiation', 'Client Relationship Management', 'Sales Presentations'],
      appliedDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
      resumeUrl: '#',
      coverLetterUrl: '#',
      status: 'applied',
      rating: 0,
      source: 'Indeed',
      notes: ''
    },
    {
      id: 'CAN013',
      jobId: 'JOB006',
      name: 'Robert Taylor',
      email: 'robert.taylor@example.com',
      phone: '(555) 345-6789',
      location: 'Chicago, IL (Remote)',
      experience: 2,
      currentCompany: 'Customer First',
      currentPosition: 'Customer Support Representative',
      education: 'BA Psychology, University of Illinois',
      skills: ['Customer Service', 'Problem Solving', 'Communication', 'Ticketing Systems', 'Technical Knowledge'],
      appliedDate: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
      resumeUrl: '#',
      status: 'interview',
      rating: 4.2,
      source: 'ZipRecruiter',
      notes: 'Great communication skills and customer service experience.'
    },
    {
      id: 'CAN014',
      jobId: 'JOB007',
      name: 'Sophia Adams',
      email: 'sophia.adams@example.com',
      phone: '(555) 456-7890',
      location: 'San Francisco, CA',
      experience: 3,
      currentCompany: 'Data Insights Co.',
      currentPosition: 'Data Analyst',
      education: 'MS Statistics, Stanford University',
      skills: ['SQL', 'Excel', 'Tableau', 'Python', 'Data Visualization', 'Statistical Analysis'],
      appliedDate: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
      resumeUrl: '#',
      coverLetterUrl: '#',
      status: 'applied',
      rating: 0,
      source: 'Company Website',
      notes: ''
    },
    {
      id: 'CAN015',
      jobId: 'JOB008',
      name: 'Jennifer Morgan',
      email: 'jennifer.morgan@example.com',
      phone: '(555) 567-8901',
      location: 'San Francisco, CA',
      experience: 2,
      currentCompany: 'Corporate Services',
      currentPosition: 'HR Assistant',
      education: 'BS Human Resources Management, San Francisco State University',
      skills: ['HRIS', 'Benefits Administration', 'Onboarding', 'Employee Relations', 'HR Policies'],
      appliedDate: format(subDays(new Date(), 40), 'yyyy-MM-dd'),
      resumeUrl: '#',
      status: 'hired',
      rating: 4.7,
      source: 'LinkedIn',
      notes: 'Excellent candidate with great HR knowledge. Start date: ' + format(addDays(new Date(), 10), 'yyyy-MM-dd')
    },
    {
      id: 'CAN016',
      jobId: 'JOB009',
      name: 'Ryan Davis',
      email: 'ryan.davis@example.com',
      phone: '(555) 678-9012',
      location: 'Austin, TX (Remote)',
      experience: 5,
      currentCompany: 'Cloud Technologies',
      currentPosition: 'DevOps Engineer',
      education: 'BS Computer Science, University of Texas',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Python'],
      appliedDate: format(subDays(new Date(), 50), 'yyyy-MM-dd'),
      resumeUrl: '#',
      coverLetterUrl: '#',
      status: 'hired',
      rating: 4.8,
      source: 'Referral',
      notes: 'Exceptional candidate with extensive DevOps experience. Start date: ' + format(subDays(new Date(), 5), 'yyyy-MM-dd')
    }
  ];
  
  return candidates;
};

// Generate mock interviews
const generateInterviews = (): Interview[] => {
  const interviews: Interview[] = [
    {
      id: 'INT001',
      candidateId: 'CAN001',
      jobId: 'JOB001',
      candidateName: 'Alex Johnson',
      round: 1,
      title: 'Technical Screening',
      interviewers: [
        { id: 'EMP007', name: 'James Taylor' }
      ],
      scheduledDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      scheduledTime: '10:00',
      duration: 60,
      location: 'video',
      status: 'scheduled'
    },
    {
      id: 'INT002',
      candidateId: 'CAN003',
      jobId: 'JOB001',
      candidateName: 'Michael Chen',
      round: 1,
      title: 'Technical Screening',
      interviewers: [
        { id: 'EMP007', name: 'James Taylor' }
      ],
      scheduledDate: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
      scheduledTime: '14:00',
      duration: 60,
      location: 'video',
      status: 'completed',
      feedback: {
        rating: 4.8,
        strengths: ['Strong technical knowledge', 'Excellent problem-solving skills', 'Good communication'],
        improvements: ['Could improve on system design knowledge'],
        comments: 'Michael performed extremely well in the technical screening. His coding skills are top-notch, and he was able to solve all the problems efficiently while clearly explaining his thought process.',
        recommended: true
      }
    },
    {
      id: 'INT003',
      candidateId: 'CAN003',
      jobId: 'JOB001',
      candidateName: 'Michael Chen',
      round: 2,
      title: 'Team Interview',
      interviewers: [
        { id: 'EMP007', name: 'James Taylor' },
        { id: 'EMP001', name: 'John Smith' }
      ],
      scheduledDate: format(subDays(new Date(), 8), 'yyyy-MM-dd'),
      scheduledTime: '11:00',
      duration: 90,
      location: 'video',
      status: 'completed',
      feedback: {
        rating: 4.7,
        strengths: ['Great team player', 'Good cultural fit', 'Excellent technical skills'],
        improvements: ['Could be more assertive in discussions'],
        comments: 'Michael interacted well with the team and demonstrated both technical excellence and good collaboration skills. Everyone on the panel was impressed and thinks he would be a great addition to the team.',
        recommended: true
      }
    },
    {
      id: 'INT004',
      candidateId: 'CAN003',
      jobId: 'JOB001',
      candidateName: 'Michael Chen',
      round: 3,
      title: 'Final Interview',
      interviewers: [
        { id: 'EMP006', name: 'Sophia Martinez' },
        { id: 'EMP007', name: 'James Taylor' }
      ],
      scheduledDate: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
      scheduledTime: '15:00',
      duration: 60,
      location: 'in-person',
      status: 'completed',
      feedback: {
        rating: 4.9,
        strengths: ['Excellent cultural fit', 'Strong technical background', 'Great communication skills'],
        improvements: ['None significant'],
        comments: 'Michael impressed everyone in the final round. He has the right mix of technical skills and cultural fit that we\'re looking for. We\'ve decided to extend an offer.',
        recommended: true
      }
    },
    {
      id: 'INT005',
      candidateId: 'CAN006',
      jobId: 'JOB002',
      candidateName: 'Rachel Martinez',
      round: 1,
      title: 'Initial Screening',
      interviewers: [
        { id: 'EMP002', name: 'Sarah Johnson' }
      ],
      scheduledDate: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
      scheduledTime: '13:00',
      duration: 45,
      location: 'phone',
      status: 'completed',
      feedback: {
        rating: 4.5,
        strengths: ['Excellent product knowledge', 'Strong communication skills', 'Good understanding of agile methodologies'],
        improvements: ['Could improve technical knowledge'],
        comments: 'Rachel demonstrated strong product management skills and a clear understanding of our market. Her experience aligns well with what we\'re looking for.',
        recommended: true
      }
    },
    {
      id: 'INT006',
      candidateId: 'CAN006',
      jobId: 'JOB002',
      candidateName: 'Rachel Martinez',
      round: 2,
      title: 'Product Case Study',
      interviewers: [
        { id: 'EMP002', name: 'Sarah Johnson' },
        { id: 'EMP007', name: 'James Taylor' }
      ],
      scheduledDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
      scheduledTime: '14:00',
      duration: 90,
      location: 'video',
      status: 'scheduled'
    },
    {
      id: 'INT007',
      candidateId: 'CAN008',
      jobId: 'JOB003',
      candidateName: 'Emily Johnson',
      round: 1,
      title: 'Portfolio Review',
      interviewers: [
        { id: 'EMP010', name: 'Emma Garcia' }
      ],
      scheduledDate: format(subDays(new Date(), 9), 'yyyy-MM-dd'),
      scheduledTime: '11:00',
      duration: 60,
      location: 'video',
      status: 'completed',
      feedback: {
        rating: 4.9,
        strengths: ['Exceptional design skills', 'Strong portfolio', 'Great attention to detail'],
        improvements: ['None significant'],
        comments: 'Emily\'s portfolio is impressive, showcasing a range of projects with strong user-centered design. Her work demonstrates excellent visual design skills and a deep understanding of UX principles.',
        recommended: true
      }
    },
    {
      id: 'INT008',
      candidateId: 'CAN008',
      jobId: 'JOB003',
      candidateName: 'Emily Johnson',
      round: 2,
      title: 'Design Challenge',
      interviewers: [
        { id: 'EMP010', name: 'Emma Garcia' },
        { id: 'EMP002', name: 'Sarah Johnson' }
      ],
      scheduledDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
      scheduledTime: '14:00',
      duration: 120,
      location: 'video',
      status: 'completed',
      feedback: {
        rating: 4.8,
        strengths: ['Excellent problem-solving approach', 'Strong design process', 'Great presentation skills'],
        improvements: ['Could consider more edge cases'],
        comments: 'Emily excelled in the design challenge, presenting a well-thought-out solution with a clear design process. Her approach was user-centered, and she was able to explain her decisions effectively.',
        recommended: true
      }
    },
    {
      id: 'INT009',
      candidateId: 'CAN008',
      jobId: 'JOB003',
      candidateName: 'Emily Johnson',
      round: 3,
      title: 'Final Interview',
      interviewers: [
        { id: 'EMP006', name: 'Sophia Martinez' },
        { id: 'EMP010', name: 'Emma Garcia' },
        { id: 'EMP002', name: 'Sarah Johnson' }
      ],
      scheduledDate: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
      scheduledTime: '10:00',
      duration: 60,
      location: 'in-person',
      status: 'completed',
      feedback: {
        rating: 4.9,
        strengths: ['Excellent cultural fit', 'Outstanding design skills', 'Great communication'],
        improvements: ['None significant'],
        comments: 'Emily impressed everyone in the final round. She has the right combination of design skills, process, and cultural fit. We\'ve decided to extend an offer.',
        recommended: true
      }
    },
    {
      id: 'INT010',
      candidateId: 'CAN013',
      jobId: 'JOB006',
      candidateName: 'Robert Taylor',
      round: 1,
      title: 'Initial Screening',
      interviewers: [
        { id: 'EMP009', name: 'William Lee' }
      ],
      scheduledDate: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
      scheduledTime: '15:00',
      duration: 45,
      location: 'phone',
      status: 'completed',
      feedback: {
        rating: 4.2,
        strengths: ['Strong customer service background', 'Good communication skills', 'Problem-solving abilities'],
        improvements: ['Could improve technical knowledge'],
        comments: 'Robert has a solid background in customer support and demonstrated good communication skills. His approach to handling difficult customers was particularly impressive.',
        recommended: true
      }
    },
    {
      id: 'INT011',
      candidateId: 'CAN013',
      jobId: 'JOB006',
      candidateName: 'Robert Taylor',
      round: 2,
      title: 'Scenario-Based Interview',
      interviewers: [
        { id: 'EMP009', name: 'William Lee' },
        { id: 'EMP006', name: 'Sophia Martinez' }
      ],
      scheduledDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      scheduledTime: '13:00',
      duration: 60,
      location: 'video',
      status: 'scheduled'
    },
    {
      id: 'INT012',
      candidateId: 'CAN015',
      jobId: 'JOB008',
      candidateName: 'Jennifer Morgan',
      round: 1,
      title: 'HR Screening',
      interviewers: [
        { id: 'EMP006', name: 'Sophia Martinez' }
      ],
      scheduledDate: format(subDays(new Date(), 35), 'yyyy-MM-dd'),
      scheduledTime: '10:00',
      duration: 45,
      location: 'phone',
      status: 'completed',
      feedback: {
        rating: 4.6,
        strengths: ['Excellent HR knowledge', 'Good communication skills', 'Organized and detail-oriented'],
        improvements: ['Limited experience with HRIS systems'],
        comments: 'Jennifer has a solid background in HR and demonstrates a good understanding of HR processes. Her organizational skills and attention to detail would be valuable in this role.',
        recommended: true
      }
    },
    {
      id: 'INT013',
      candidateId: 'CAN015',
      jobId: 'JOB008',
      candidateName: 'Jennifer Morgan',
      round: 2,
      title: 'Case Study and Team Interview',
      interviewers: [
        { id: 'EMP006', name: 'Sophia Martinez' },
        { id: 'EMP008', name: 'Olivia Brown' }
      ],
      scheduledDate: format(subDays(new Date(), 28), 'yyyy-MM-dd'),
      scheduledTime: '14:00',
      duration: 90,
      location: 'in-person',
      status: 'completed',
      feedback: {
        rating: 4.7,
        strengths: ['Great problem-solving skills', 'Good understanding of HR policies', 'Strong team player'],
        improvements: ['Could be more assertive'],
        comments: 'Jennifer performed well in the case study, demonstrating good problem-solving skills and a solid understanding of HR policies and best practices. She also connected well with the team.',
        recommended: true
      }
    },
    {
      id: 'INT014',
      candidateId: 'CAN015',
      jobId: 'JOB008',
      candidateName: 'Jennifer Morgan',
      round: 3,
      title: 'Final Interview',
      interviewers: [
        { id: 'EMP006', name: 'Sophia Martinez' },
        { id: 'EMP008', name: 'Olivia Brown' }
      ],
      scheduledDate: format(subDays(new Date(), 20), 'yyyy-MM-dd'),
      scheduledTime: '11:00',
      duration: 60,
      location: 'in-person',
      status: 'completed',
      feedback: {
        rating: 4.8,
        strengths: ['Excellent cultural fit', 'Strong HR knowledge', 'Great communication skills'],
        improvements: ['None significant'],
        comments: 'Jennifer impressed in the final round. She has the right combination of HR knowledge, attention to detail, and cultural fit. We\'ve decided to extend an offer.',
        recommended: true
      }
    },
    {
      id: 'INT015',
      candidateId: 'CAN016',
      jobId: 'JOB009',
      candidateName: 'Ryan Davis',
      round: 1,
      title: 'Technical Screening',
      interviewers: [
        { id: 'EMP007', name: 'James Taylor' }
      ],
      scheduledDate: format(subDays(new Date(), 45), 'yyyy-MM-dd'),
      scheduledTime: '13:00',
      duration: 60,
      location: 'video',
      status: 'completed',
      feedback: {
        rating: 4.7,
        strengths: ['Strong DevOps knowledge', 'Excellent technical skills', 'Good communication'],
        improvements: ['Could improve knowledge of Kubernetes'],
        comments: 'Ryan has extensive DevOps experience and demonstrated strong technical skills. His knowledge of CI/CD pipelines and AWS is particularly impressive.',
        recommended: true
      }
    },
    {
      id: 'INT016',
      candidateId: 'CAN016',
      jobId: 'JOB009',
      candidateName: 'Ryan Davis',
      round: 2,
      title: 'Technical Deep Dive',
      interviewers: [
        { id: 'EMP007', name: 'James Taylor' },
        { id: 'EMP001', name: 'John Smith' }
      ],
      scheduledDate: format(subDays(new Date(), 35), 'yyyy-MM-dd'),
      scheduledTime: '14:00',
      duration: 120,
      location: 'video',
      status: 'completed',
      feedback: {
        rating: 4.8,
        strengths: ['Excellent system design skills', 'Strong automation knowledge', 'Great problem-solving abilities'],
        improvements: ['Could deepen knowledge of security best practices'],
        comments: 'Ryan performed exceptionally well in the technical deep dive. His approach to designing infrastructure was well-thought-out, and he demonstrated a strong understanding of DevOps principles.',
        recommended: true
      }
    },
    {
      id: 'INT017',
      candidateId: 'CAN016',
      jobId: 'JOB009',
      candidateName: 'Ryan Davis',
      round: 3,
      title: 'Final Interview',
      interviewers: [
        { id: 'EMP006', name: 'Sophia Martinez' },
        { id: 'EMP007', name: 'James Taylor' }
      ],
      scheduledDate: format(subDays(new Date(), 25), 'yyyy-MM-dd'),
      scheduledTime: '11:00',
      duration: 60,
      location: 'video',
      status: 'completed',
      feedback: {
        rating: 4.9,
        strengths: ['Excellent cultural fit', 'Strong technical background', 'Great communication skills'],
        improvements: ['None significant'],
        comments: 'Ryan impressed everyone in the final round. He has the right mix of technical skills and cultural fit that we\'re looking for. We\'ve decided to extend an offer.',
        recommended: true
      }
    }
  ];
  
  return interviews;
};

// Generate all recruitment data
export const jobs = generateJobs();
export const candidates = generateCandidates();
export const interviews = generateInterviews();

// Helper functions

// Get candidates for a specific job
export const getCandidatesForJob = (jobId: string): Candidate[] => {
  return candidates.filter(candidate => candidate.jobId === jobId);
};

// Get interviews for a specific candidate
export const getInterviewsForCandidate = (candidateId: string): Interview[] => {
  return interviews.filter(interview => interview.candidateId === candidateId);
};

// Get interviews scheduled for specific date
export const getInterviewsForDate = (date: string): Interview[] => {
  return interviews.filter(interview => interview.scheduledDate === date && interview.status === 'scheduled');
};

// Get candidates by status
export const getCandidatesByStatus = (status: CandidateStatus): Candidate[] => {
  return candidates.filter(candidate => candidate.status === status);
};

// Get jobs by status
export const getJobsByStatus = (status: JobStatus): Job[] => {
  return jobs.filter(job => job.status === status);
};