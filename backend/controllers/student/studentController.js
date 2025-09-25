const studentDashboardService = require('../../services/studentDashboardService');
const studentCourseService = require('../../services/studentCourseService');
const studentNoteService = require('../../services/studentNoteService');
const studentAssignmentService = require('../../services/studentAssignmentService');
const StudentValidators = require('../../utils/validators/studentValidators');
const { handleAsync, sendSuccess, handleServiceError } = require('../../utils/responseHelpers');

// @desc    Get student dashboard
// @route   GET /api/student/dashboard
// @access  Private (Student only)
const getDashboard = handleAsync(async (req, res) => {
  const dashboardData = await studentDashboardService.getDashboardData(req.user._id);
  sendSuccess(res, dashboardData);
});

// @desc    Get all courses for student
// @route   GET /api/student/courses
// @access  Private (Student only)
const getCourses = handleAsync(async (req, res) => {
  const { page = 1, limit = 10, category, level, search } = req.query;
  const courses = await studentCourseService.getCourses(req.user._id, { page, limit, category, level, search });
  sendSuccess(res, courses);
});

// @desc    Enroll in a course
// @route   POST /api/student/courses/:courseId/enroll
// @access  Private (Student only)
const enrollInCourse = handleAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await studentCourseService.enrollInCourse(req.user._id, courseId);
  sendSuccess(res, result, 'Successfully enrolled in course');
});

// @desc    Get student's notes
// @route   GET /api/student/notes
// @access  Private (Student only)
const getNotes = handleAsync(async (req, res) => {
  const { page = 1, limit = 10, category, search } = req.query;
  const notes = await studentNoteService.getNotes(req.user._id, { page, limit, category, search });
  sendSuccess(res, notes);
});

// @desc    Create a new note
// @route   POST /api/student/notes
// @access  Private (Student only)
const createNote = handleAsync(async (req, res) => {
  const noteData = StudentValidators.validateNote(req.body);
  const note = await studentNoteService.createNote(req.user._id, noteData);
  sendSuccess(res, note, 'Note created successfully', 201);
});

// @desc    Get student assignments
// @route   GET /api/student/assignments
// @access  Private (Student only)
const getAssignments = handleAsync(async (req, res) => {
  const { status = 'all' } = req.query;
  const assignments = await studentAssignmentService.getAssignments(req.user._id, status);
  sendSuccess(res, assignments);
});

module.exports = {
  getDashboard,
  getCourses,
  enrollInCourse,
  getNotes,
  createNote,
  getAssignments
};
