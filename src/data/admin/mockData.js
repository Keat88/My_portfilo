// TEMPORARY UI DEVELOPMENT MOCK DATA ONLY.
// Do not treat these values as real backend data. Replace via src/services/adminApi.js when endpoints are ready.

export const mockDashboardStats = {
  totalProjects: 12,
  publishedProjects: 8,
  totalSkills: 18,
  totalServices: 6,
  totalMessages: 34,
  unreadMessages: 5,
  _mock: true,
  _note: 'Sample statistics for UI development',
}

export const mockMessagesTrend = [
  { date: '2026-05-20', messages: 2 },
  { date: '2026-06-03', messages: 4 },
  { date: '2026-06-17', messages: 3 },
  { date: '2026-07-01', messages: 6 },
  { date: '2026-07-15', messages: 5 },
  { date: '2026-08-02', messages: 7 },
  { date: '2026-08-19', messages: 4 },
  { date: '2026-09-05', messages: 8 },
  { date: '2026-09-22', messages: 6 },
  { date: '2026-10-10', messages: 9 },
  { date: '2026-10-28', messages: 7 },
  { date: '2026-11-19', messages: 10 },
]

export const mockProjectDistribution = [
  { name: 'Web App', value: 5 },
  { name: 'API/Backend', value: 4 },
  { name: 'Mobile/Hybrid', value: 1 },
  { name: 'DevOps/Tooling', value: 2 },
]

export const mockActivities = [
  { id: 'a1', type: 'project_created', message: 'New project "Portfolio CMS" created', time: '2026-11-19T08:20:00Z' },
  { id: 'a2', type: 'message_new', message: 'New contact message from Sopheak R.', time: '2026-11-19T07:45:00Z' },
  { id: 'a3', type: 'project_updated', message: 'Project "LearnHub" updated', time: '2026-11-18T16:10:00Z' },
  { id: 'a4', type: 'skill_added', message: 'Skill "FastAPI" added to Backend', time: '2026-11-18T11:30:00Z' },
  { id: 'a5', type: 'message_status', message: 'Message from Lina marked as Replied', time: '2026-11-17T14:05:00Z' },
]

export const mockMessages = [
  { id: 101, name: 'Sopheak Rith', email: 'sopheak@example.com', subject: 'Collaboration inquiry', message: 'Hi, I would like to discuss a potential collaboration on a web platform. Are you available this week?', date: '2026-11-19T07:45:00Z', status: 'New' },
  { id: 102, name: 'Lina Chan', email: 'lina.chan@example.com', subject: 'Freelance project', message: 'We need help building a REST API and admin panel. Could you share your availability and rates?', date: '2026-11-18T13:20:00Z', status: 'Replied' },
  { id: 103, name: 'David Kim', email: 'david.kim@example.com', subject: 'Question about your portfolio', message: 'Loved your projects section. What stack did you use for the POS system backend?', date: '2026-11-17T09:10:00Z', status: 'Read' },
  { id: 104, name: 'Maly Sok', email: 'maly.sok@example.com', subject: 'Internship opportunity', message: 'Our team is looking for a backend intern. Would you be open to a short call?', date: '2026-11-16T15:40:00Z', status: 'New' },
  { id: 105, name: 'John Carter', email: 'john.carter@example.com', subject: 'Website maintenance', message: 'Do you provide ongoing maintenance for React + API projects?', date: '2026-11-15T10:05:00Z', status: 'Archived' },
  { id: 106, name: 'Nita Phan', email: 'nita@example.com', subject: 'Design handoff', message: 'I have Figma designs ready and need frontend implementation support.', date: '2026-11-14T08:55:00Z', status: 'Read' },
  { id: 107, name: 'Alex Nguyen', email: 'alex.nguyen@example.com', subject: 'API integration help', message: 'Can you help integrate third-party payment APIs securely?', date: '2026-11-13T12:30:00Z', status: 'New' },
  { id: 108, name: 'Rina Ly', email: 'rina.ly@example.com', subject: 'Speaking invitation', message: 'We are hosting a student tech meetup and would love you to speak.', date: '2026-11-12T17:00:00Z', status: 'Replied' },
]

export const mockProjects = [
  { id: 1, title: 'ContactHub', shortDescription: 'Personal & business contact management system.', fullDescription: 'A full-stack contact management platform with authentication, role-based access, and CRUD workflows.', thumbnail: '', githubUrl: 'https://github.com/example/contacthub', liveUrl: '', technologies: ['Spring Boot', 'React', 'MySQL'], featured: true, published: true, createdAt: '2026-03-10T00:00:00Z' },
  { id: 2, title: 'LearnHub', shortDescription: 'Learning management system.', fullDescription: 'LMS with courses, lessons, enrollments, and student progress tracking.', thumbnail: '', githubUrl: '', liveUrl: '', technologies: ['Spring Boot', 'React', 'MySQL'], featured: true, published: false, createdAt: '2026-04-02T00:00:00Z' },
  { id: 3, title: 'Restaurant POS System', shortDescription: 'Multi-branch restaurant management.', fullDescription: 'POS solution covering orders, inventory, payments, and employee roles.', thumbnail: '', githubUrl: '', liveUrl: '', technologies: ['Backend', 'React', 'MySQL'], featured: false, published: true, createdAt: '2026-05-18T00:00:00Z' },
  { id: 4, title: 'Product CRUD API', shortDescription: 'Secure REST API service.', fullDescription: 'Spring Boot REST API with JWT auth, validation, and Swagger docs.', thumbnail: '', githubUrl: 'https://github.com/example/product-crud-api', liveUrl: '', technologies: ['Java', 'Spring Security', 'JWT', 'MySQL'], featured: false, published: true, createdAt: '2026-06-07T00:00:00Z' },
]

export const mockSkills = [
  { id: 1, name: 'Java', category: 'Programming Languages', icon: 'SiJava', displayOrder: 1, visible: true },
  { id: 2, name: 'JavaScript', category: 'Programming Languages', icon: 'SiJavascript', displayOrder: 2, visible: true },
  { id: 3, name: 'React.js', category: 'Frontend Development', icon: 'SiReact', displayOrder: 3, visible: true },
  { id: 4, name: 'Tailwind CSS', category: 'Frontend Development', icon: 'SiTailwindcss', displayOrder: 4, visible: true },
  { id: 5, name: 'Spring Boot', category: 'Backend Development', icon: 'SiSpringboot', displayOrder: 5, visible: true },
  { id: 6, name: 'FastAPI', category: 'Backend Development', icon: 'SiFastapi', displayOrder: 6, visible: true },
  { id: 7, name: 'MySQL', category: 'Database', icon: 'SiMysql', displayOrder: 7, visible: true },
  { id: 8, name: 'Docker', category: 'DevOps and Tools', icon: 'SiDocker', displayOrder: 8, visible: false },
]

export const mockServices = [
  { id: 1, title: 'Backend Development', description: 'Robust server-side systems and business logic for reliable applications.', icon: 'Server', displayOrder: 1, visible: true },
  { id: 2, title: 'Full-Stack Web Development', description: 'End-to-end web applications with modern UI and solid APIs.', icon: 'Layers', displayOrder: 2, visible: true },
  { id: 3, title: 'REST API Development', description: 'Secure, well-documented REST APIs for scalable integrations.', icon: 'Cable', displayOrder: 3, visible: true },
  { id: 4, title: 'Database Design', description: 'Schema design and query optimization for data-driven systems.', icon: 'Database', displayOrder: 4, visible: false },
]

export const mockExperiences = [
  { id: 1, title: 'Weekend Student Intern', description: 'Hands-on industry experience building and maintaining web features.', organization: 'ETEC Center', startDate: '2025-01-01', endDate: null, displayOrder: 1, visible: true },
  { id: 2, title: 'IT Student (Scholarship)', description: 'Second-year Information Technology student focusing on software engineering.', organization: 'The University of Cambodia', startDate: '2024-01-01', endDate: null, displayOrder: 2, visible: true },
  { id: 3, title: 'Personal Projects Milestone', description: 'Built multiple full-stack portfolio projects using React and backend frameworks.', organization: 'Independent', startDate: '2023-06-01', endDate: '2024-12-31', displayOrder: 3, visible: true },
]

export const mockProfile = {
  avatar: '',
  fullName: 'Keng Keat',
  username: 'kengkeat',
  email: 'keatkeng88@gmail.com',
}

export const mockSettings = {
  theme: 'dark',
  language: 'en',
  emailNotifications: true,
  messageAlerts: true,
  compactMode: false,
  showTips: true,
}
