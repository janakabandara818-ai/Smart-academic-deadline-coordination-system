export const SAMPLE_DATA_LABEL =
  'Sample data (Sprint 1 fixture) – not live Moodle data';

export const modules = [
  { id: 'CS3202', name: 'Software Engineering', lecturer: 'Dr. Nimal Perera', students: 86 },
  { id: 'EE2101', name: 'Electrical Engineering', lecturer: 'Ms. Kasuni Silva', students: 72 },
  { id: 'SE3205', name: 'Software Design', lecturer: 'Dr. Nimal Perera', students: 86 }
];

export const deadlines = [
  {
    id: 'd1', moduleId: 'CS3202', title: 'Assignment 03', type: 'Assignment',
    complexity: 'High', date: '2026-11-14', time: '23:59', source: 'Moodle demo',
    description: 'Software architecture and design patterns. Coordinate your group and review the assignment brief on your university LMS.'
  },
  {
    id: 'd2', moduleId: 'EE2101', title: 'Circuit Theory Quiz', type: 'Quiz',
    complexity: 'Low', date: '2026-11-16', time: '16:00', source: 'Moodle demo',
    description: 'A short assessment covering circuit analysis fundamentals.'
  },
  {
    id: 'd3', moduleId: 'SE3205', title: 'Design Case Study', type: 'Assignment',
    complexity: 'Medium', date: '2026-11-17', time: '23:59', source: 'Moodle demo',
    description: 'Prepare the software design case study with your allocated team.'
  },
  {
    id: 'd4', moduleId: 'EE2101', title: 'Lab Report', type: 'Lab',
    complexity: 'Medium', date: '2026-11-20', time: '17:00', source: 'Moodle demo',
    description: 'Document your experimental results, calculations, and observations.'
  },
  {
    id: 'd5', moduleId: 'SE3205', title: 'Group Project', type: 'Project',
    complexity: 'High', date: '2026-11-27', time: '23:59', source: 'Moodle demo',
    description: 'Final group project milestone: system design and implementation plan.'
  }
];
