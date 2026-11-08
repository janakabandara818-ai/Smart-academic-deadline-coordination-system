// Fixed November 2026 demo semester, independent of the device clock.
export const DEMO_TODAY = "2026-11-07";
export const initialModules = [
  {
    id: "CS3202",
    name: "Software Engineering",
    lecturer: "Dr. Nimal Perera",
    students: 86,
  },
  {
    id: "EE2101",
    name: "Electrical Engineering",
    lecturer: "Ms. Kasuni Silva",
    students: 72,
  },
  {
    id: "SE3205",
    name: "Software Design",
    lecturer: "Dr. Nimal Perera",
    students: 86,
  },
];
export const initialDeadlines = [
  {
    id: "d1",
    moduleId: "CS3202",
    title: "Assignment 03",
    type: "Assignment",
    complexity: "High",
    date: "2026-11-14",
    time: "23:59",
    source: "Moodle demo",
    description:
      "Software architecture and design patterns. Coordinate your group and review the assignment brief on your university LMS.",
  },
  {
    id: "d2",
    moduleId: "EE2101",
    title: "Circuit Theory Quiz",
    type: "Quiz",
    complexity: "Low",
    date: "2026-11-16",
    time: "16:00",
    source: "Moodle demo",
    description: "A short assessment covering circuit analysis fundamentals.",
  },
  {
    id: "d3",
    moduleId: "SE3205",
    title: "Design Case Study",
    type: "Assignment",
    complexity: "Medium",
    date: "2026-11-17",
    time: "23:59",
    source: "Moodle demo",
    description:
      "Prepare the software design case study with your allocated team.",
  },
  {
    id: "d4",
    moduleId: "EE2101",
    title: "Lab Report",
    type: "Lab",
    complexity: "Medium",
    date: "2026-11-20",
    time: "17:00",
    source: "Moodle demo",
    description:
      "Document your experimental results, calculations, and observations.",
  },
  {
    id: "d5",
    moduleId: "SE3205",
    title: "Group Project",
    type: "Project",
    complexity: "High",
    date: "2026-11-27",
    time: "23:59",
    source: "Moodle demo",
    description:
      "Final group project milestone: system design and implementation plan.",
  },
];
export const initialNotifications = [
  {
    id: "n1",
    title: "Deadline updated",
    message:
      "CS3202 · Assignment 03 is due on November 14, 2026. Review your schedule for potential conflicts.",
    category: "Deadlines",
    read: false,
    time: "10 minutes ago",
  },
  {
    id: "n2",
    title: "New lab report added",
    message: "EE2101 · Lab Report is due on November 20, 2026 at 5:00 PM.",
    category: "Assignments",
    read: false,
    time: "1 hour ago",
  },
  {
    id: "n3",
    title: "Your weekly workload overview is ready",
    message:
      "You have 5 upcoming deadlines across 3 modules. Open your calendar to plan ahead.",
    category: "System",
    read: false,
    time: "3 hours ago",
  },
  {
    id: "n4",
    title: "Welcome to SADCS",
    message:
      "This is a demonstration workspace. Moodle, email, and account services are not connected.",
    category: "System",
    read: true,
    time: "Yesterday",
  },
];
export const initialUsers = [
  {
    id: "u1",
    name: "Dr. Nimal Perera",
    email: "nimal@eng.ruh.ac.lk",
    role: "Lecturer",
    status: "Active",
  },
  {
    id: "u2",
    name: "Ms. Kasuni Silva",
    email: "kasuni@eng.ruh.ac.lk",
    role: "Lecturer",
    status: "Active",
  },
  {
    id: "u3",
    name: "Saman Fernando",
    email: "saman@eng.ruh.ac.lk",
    role: "Student",
    status: "Active",
  },
  {
    id: "u4",
    name: "Anjali Jayasinghe",
    email: "anjali@eng.ruh.ac.lk",
    role: "Student",
    status: "Active",
  },
  {
    id: "u5",
    name: "Faculty Administrator",
    email: "admin@eng.ruh.ac.lk",
    role: "Admin",
    status: "Active",
  },
];
export const typeColors = {
  Assignment: "#e5a12a",
  Quiz: "#a65ae0",
  Project: "#3c85da",
  Lab: "#2f966b",
};
export const demoWorkload = [42, 58, 63, 70, 82, 89, 100];
export const sampleProposal = {
  moduleId: "CS3202",
  title: "Group Project – System Design",
  type: "Project",
  complexity: "High",
  date: "2026-11-14",
};
