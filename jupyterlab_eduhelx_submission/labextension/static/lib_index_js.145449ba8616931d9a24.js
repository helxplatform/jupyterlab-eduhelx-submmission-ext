"use strict";
(self["webpackChunkjupyterlab_eduhelx_submission"] = self["webpackChunkjupyterlab_eduhelx_submission"] || []).push([["lib_index_js"],{

/***/ "./lib/api/api.js":
/*!************************!*\
  !*** ./lib/api/api.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cloneStudentRepository: () => (/* binding */ cloneStudentRepository),
/* harmony export */   getAssignments: () => (/* binding */ getAssignments),
/* harmony export */   getServerSettings: () => (/* binding */ getServerSettings),
/* harmony export */   getStudentAndCourse: () => (/* binding */ getStudentAndCourse),
/* harmony export */   submitAssignment: () => (/* binding */ submitAssignment)
/* harmony export */ });
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! qs */ "webpack/sharing/consume/default/qs/qs");
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/services */ "webpack/sharing/consume/default/@jupyterlab/services");
/* harmony import */ var _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _handler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../handler */ "./lib/handler.js");
/* harmony import */ var _assignment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./assignment */ "./lib/api/assignment.js");
/* harmony import */ var _student__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./student */ "./lib/api/student.js");
/* harmony import */ var _course__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./course */ "./lib/api/course.js");
/* harmony import */ var _server_settings__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./server-settings */ "./lib/api/server-settings.js");







async function getStudentAndCourse() {
    const { student, course } = await (0,_handler__WEBPACK_IMPORTED_MODULE_2__.requestAPI)(`/course_student`, {
        method: 'GET'
    });
    return {
        student: _student__WEBPACK_IMPORTED_MODULE_3__.Student.fromResponse(student),
        course: _course__WEBPACK_IMPORTED_MODULE_4__.Course.fromResponse(course)
    };
}
async function getAssignments(path) {
    const { assignments, current_assignment } = await (0,_handler__WEBPACK_IMPORTED_MODULE_2__.requestAPI)(`/assignments?${qs__WEBPACK_IMPORTED_MODULE_0___default().stringify({ path })}`, {
        method: 'GET'
    });
    return {
        assignments: assignments ? assignments.map((data) => _assignment__WEBPACK_IMPORTED_MODULE_5__.Assignment.fromResponse(data)) : null,
        currentAssignment: current_assignment ? _assignment__WEBPACK_IMPORTED_MODULE_5__.Assignment.fromResponse(current_assignment) : null
    };
}
async function getServerSettings() {
    try {
        const data = await (0,_handler__WEBPACK_IMPORTED_MODULE_2__.requestAPI)('/settings', {
            method: 'GET'
        });
        return _server_settings__WEBPACK_IMPORTED_MODULE_6__.ServerSettings.fromResponse(data);
    }
    catch (e) {
        if (e instanceof _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.ResponseError) {
            const response = e.response;
            if (response.status === 404) {
                const message = 'EduHeLx Submission server extension is unavailable. Please ensure you have installed the ' +
                    'JupyterLab EduHeLx Submission server extension by running: pip install --upgrade jupyterlab_eduhelx_submission. ' +
                    'To confirm that the server extension is installed, run: jupyter server extension list.';
                throw new _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.ResponseError(response, message);
            }
            else {
                const message = e.message;
                console.error('Failed to get the server extension settings', message);
                throw new _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.ResponseError(response, message);
            }
        }
        else {
            throw e;
        }
    }
}
async function submitAssignment(currentPath, summary, description) {
    const res = await (0,_handler__WEBPACK_IMPORTED_MODULE_2__.requestAPI)(`/submit_assignment`, {
        method: 'POST',
        body: JSON.stringify({
            summary,
            description,
            current_path: currentPath
        })
    });
}
async function cloneStudentRepository(repositoryUrl, currentPath) {
    const repositoryRootPath = await (0,_handler__WEBPACK_IMPORTED_MODULE_2__.requestAPI)(`/clone_student_repository`, {
        method: 'POST',
        body: JSON.stringify({
            repository_url: repositoryUrl,
            current_path: currentPath
        })
    });
    return repositoryRootPath;
}


/***/ }),

/***/ "./lib/api/assignment.js":
/*!*******************************!*\
  !*** ./lib/api/assignment.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Assignment: () => (/* binding */ Assignment)
/* harmony export */ });
/* harmony import */ var _submission__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./submission */ "./lib/api/submission.js");

class Assignment {
    constructor(_id, _name, _directoryPath, _absoluteDirectoryPath, _createdDate, _adjustedAvailableDate, _adjustedDueDate, _lastModifiedDate, _isDeferred, _isExtended, _isCreated, _isAvailable, _isClosed, _submissions) {
        this._id = _id;
        this._name = _name;
        this._directoryPath = _directoryPath;
        this._absoluteDirectoryPath = _absoluteDirectoryPath;
        this._createdDate = _createdDate;
        this._adjustedAvailableDate = _adjustedAvailableDate;
        this._adjustedDueDate = _adjustedDueDate;
        this._lastModifiedDate = _lastModifiedDate;
        this._isDeferred = _isDeferred;
        this._isExtended = _isExtended;
        this._isCreated = _isCreated;
        this._isAvailable = _isAvailable;
        this._isClosed = _isClosed;
        this._submissions = _submissions;
    }
    get id() { return this._id; }
    get name() { return this._name; }
    get directoryPath() { return this._directoryPath; }
    get absoluteDirectoryPath() { return this._absoluteDirectoryPath; }
    get createdDate() { return this._createdDate; }
    get adjustedAvailableDate() { return this._adjustedAvailableDate; }
    get adjustedDueDate() { return this._adjustedDueDate; }
    get lastModifiedDate() { return this._lastModifiedDate; }
    get isDeferred() { return this._isDeferred; }
    get isExtended() { return this._isExtended; }
    get isCreated() { return this._isCreated; }
    get isAvailable() { return this._isAvailable; }
    get isClosed() { return this._isClosed; }
    get submissions() { return this._submissions; }
    static fromResponse(data) {
        var _a;
        return new Assignment(data.id, data.name, data.directory_path, data.absolute_directory_path, new Date(data.created_date), data.adjusted_available_date ? new Date(data.adjusted_available_date) : null, data.adjusted_due_date ? new Date(data.adjusted_due_date) : null, new Date(data.last_modified_date), data.is_deferred, data.is_extended, data.is_created, data.is_available, data.is_closed, (_a = data.submissions) === null || _a === void 0 ? void 0 : _a.map((res) => _submission__WEBPACK_IMPORTED_MODULE_0__.Submission.fromResponse(res)));
    }
}


/***/ }),

/***/ "./lib/api/commit.js":
/*!***************************!*\
  !*** ./lib/api/commit.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Commit: () => (/* binding */ Commit)
/* harmony export */ });
class Commit {
    constructor(_id, _authorName, _authorEmail, _committerName, _committerEmail, _message) {
        this._id = _id;
        this._authorName = _authorName;
        this._authorEmail = _authorEmail;
        this._committerName = _committerName;
        this._committerEmail = _committerEmail;
        this._message = _message;
    }
    get id() { return this._id; }
    get idShort() { return this._id.slice(0, 7); }
    get authorName() { return this._authorName; }
    get authorEmail() { return this._authorEmail; }
    get committerName() { return this._committerName; }
    get committerEmail() { return this._committerEmail; }
    get message() { return this._message; }
    get summary() {
        const [summary, ...description] = this.message.split("\n");
        return summary;
    }
    get description() {
        const [summary, ...description] = this.message.split("\n");
        return description.join("\n");
    }
    static fromResponse(data) {
        return new Commit(data.id, data.author_name, data.author_email, data.committer_name, data.committer_email, data.message);
    }
}


/***/ }),

/***/ "./lib/api/course.js":
/*!***************************!*\
  !*** ./lib/api/course.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Course: () => (/* binding */ Course)
/* harmony export */ });
/* harmony import */ var _instructor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instructor */ "./lib/api/instructor.js");

class Course {
    constructor(_id, _name, _masterRemoteUrl, _instructors) {
        this._id = _id;
        this._name = _name;
        this._masterRemoteUrl = _masterRemoteUrl;
        this._instructors = _instructors;
    }
    get id() { return this._id; }
    get name() { return this._name; }
    get masterRemoteUrl() { return this._masterRemoteUrl; }
    get instructors() { return this._instructors; }
    static fromResponse(data) {
        return new Course(data.id, data.name, data.master_remote_url, data.instructors.map((res) => _instructor__WEBPACK_IMPORTED_MODULE_0__.Instructor.fromResponse(res)));
    }
}


/***/ }),

/***/ "./lib/api/instructor.js":
/*!*******************************!*\
  !*** ./lib/api/instructor.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Instructor: () => (/* binding */ Instructor)
/* harmony export */ });
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user */ "./lib/api/user.js");

class Instructor extends _user__WEBPACK_IMPORTED_MODULE_0__.User {
    constructor(id, onyen, firstName, lastName, email) {
        super(id, onyen, firstName, lastName, email);
    }
    static fromResponse(data) {
        return new Instructor(data.id, data.onyen, data.first_name, data.last_name, data.email);
    }
}


/***/ }),

/***/ "./lib/api/server-settings.js":
/*!************************************!*\
  !*** ./lib/api/server-settings.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ServerSettings: () => (/* binding */ ServerSettings)
/* harmony export */ });
class ServerSettings {
    constructor() { }
    static fromResponse(data) {
        return new ServerSettings();
    }
}


/***/ }),

/***/ "./lib/api/student.js":
/*!****************************!*\
  !*** ./lib/api/student.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Student: () => (/* binding */ Student)
/* harmony export */ });
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user */ "./lib/api/user.js");

class Student extends _user__WEBPACK_IMPORTED_MODULE_0__.User {
    constructor(id, onyen, firstName, lastName, email, _joinDate, _exitDate) {
        super(id, onyen, firstName, lastName, email);
        this._joinDate = _joinDate;
        this._exitDate = _exitDate;
    }
    get joinDate() { return this._joinDate; }
    get exitDate() { return this._exitDate; }
    static fromResponse(data) {
        return new Student(data.id, data.onyen, data.first_name, data.last_name, data.email, new Date(data.join_date), data.exit_date ? new Date(data.exit_date) : null);
    }
}


/***/ }),

/***/ "./lib/api/submission.js":
/*!*******************************!*\
  !*** ./lib/api/submission.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Submission: () => (/* binding */ Submission)
/* harmony export */ });
/* harmony import */ var _commit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./commit */ "./lib/api/commit.js");

class Submission {
    constructor(_id, _active, _submissionTime, _commit) {
        this._id = _id;
        this._active = _active;
        this._submissionTime = _submissionTime;
        this._commit = _commit;
    }
    get id() { return this._id; }
    get active() { return this._active; }
    get submissionTime() { return this._submissionTime; }
    get commit() { return this._commit; }
    static fromResponse(data) {
        return new Submission(data.id, data.active, new Date(data.submission_time), _commit__WEBPACK_IMPORTED_MODULE_0__.Commit.fromResponse(data.commit));
    }
}


/***/ }),

/***/ "./lib/api/user.js":
/*!*************************!*\
  !*** ./lib/api/user.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   User: () => (/* binding */ User)
/* harmony export */ });
class User {
    constructor(_id, _onyen, _firstName, _lastName, _email) {
        this._id = _id;
        this._onyen = _onyen;
        this._firstName = _firstName;
        this._lastName = _lastName;
        this._email = _email;
    }
    get id() { return this._id; }
    get onyen() { return this._onyen; }
    get firstName() { return this._firstName; }
    get lastName() { return this._lastName; }
    get fullName() { return `${this.firstName} ${this.lastName}`; }
    get email() { return this._email; }
    static fromResponse(data) {
        return new User(data.id, data.onyen, data.first_name, data.last_name, data.onyen);
    }
}


/***/ }),

/***/ "./lib/components/assignment-panel/assignment-content/assignment-content.js":
/*!**********************************************************************************!*\
  !*** ./lib/components/assignment-panel/assignment-content/assignment-content.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssignmentContent: () => (/* binding */ AssignmentContent)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/core */ "webpack/sharing/consume/default/@material-ui/core/@material-ui/core?8d99");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style */ "./lib/components/assignment-panel/assignment-content/style.js");
/* harmony import */ var _no_assignment_warning__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../no-assignment-warning */ "./lib/components/assignment-panel/no-assignment-warning/no-assignment-warning.js");
/* harmony import */ var _assignment_info__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../assignment-info */ "./lib/components/assignment-panel/assignment-info/assignment-info.js");
/* harmony import */ var _assignment_submissions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../assignment-submissions */ "./lib/components/assignment-panel/assignment-submissions/assignment-submissions.js");
/* harmony import */ var _assignment_submit_form__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../assignment-submit-form */ "./lib/components/assignment-panel/assignment-submit-form/assignment-submit-form.js");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../contexts */ "./lib/contexts/assignment-context.js");








const AssignmentContent = () => {
    const { loading, path, assignment, student, assignments } = (0,_contexts__WEBPACK_IMPORTED_MODULE_2__.useAssignment)();
    /*
    const [showSelectionView, setShowSelectionView] = useState<boolean>(true)

    useEffect(() => {
        // When the path / active assignment changes,
        // if there's an active assignment, show the assignment view.
        if (assignment) setShowSelectionView(false)
        // If there isn't an assignment in the current directory, show the selection view.
        else setShowSelectionView(true)
        // Then, users can press a button while in the assignment view, users can press
        // a back button to go back to the selection view.
    }, [path, assignment?.id])
    */
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _style__WEBPACK_IMPORTED_MODULE_3__.containerClass }, loading ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _style__WEBPACK_IMPORTED_MODULE_3__.loadingContainerClass },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.CircularProgress, { color: "inherit" }))) : assignments === null || assignment === null ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_no_assignment_warning__WEBPACK_IMPORTED_MODULE_4__.NoAssignmentWarning, { noRepository: assignments === null })) : (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _style__WEBPACK_IMPORTED_MODULE_3__.assignmentContainerClass },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_assignment_info__WEBPACK_IMPORTED_MODULE_5__.AssignmentInfo, null),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_assignment_submissions__WEBPACK_IMPORTED_MODULE_6__.AssignmentSubmissions, { style: { flexGrow: 1 } }),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_assignment_submit_form__WEBPACK_IMPORTED_MODULE_7__.AssignmentSubmitForm, null)))));
};


/***/ }),

/***/ "./lib/components/assignment-panel/assignment-content/style.js":
/*!*********************************************************************!*\
  !*** ./lib/components/assignment-panel/assignment-content/style.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assignmentContainerClass: () => (/* binding */ assignmentContainerClass),
/* harmony export */   containerClass: () => (/* binding */ containerClass),
/* harmony export */   loadingContainerClass: () => (/* binding */ loadingContainerClass)
/* harmony export */ });
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! typestyle */ "webpack/sharing/consume/default/typestyle/typestyle");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(typestyle__WEBPACK_IMPORTED_MODULE_0__);

const containerClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
});
const loadingContainerClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '36px 11px 4px 11px',
    color: 'var(--md-blue-600)'
});
const assignmentContainerClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
});


/***/ }),

/***/ "./lib/components/assignment-panel/assignment-info/assignment-info.js":
/*!****************************************************************************!*\
  !*** ./lib/components/assignment-panel/assignment-info/assignment-info.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssignmentInfo: () => (/* binding */ AssignmentInfo)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style */ "./lib/components/assignment-panel/assignment-info/style.js");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../contexts */ "./lib/contexts/assignment-context.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils */ "./lib/utils/date-format.js");




const MS_IN_HOURS = 3.6e6;
const AssignmentInfo = ({}) => {
    const { assignment, student, course } = (0,_contexts__WEBPACK_IMPORTED_MODULE_1__.useAssignment)();
    if (!student || !assignment || !course)
        return null;
    const hoursUntilDue = assignment.isCreated ? ((assignment.adjustedDueDate.getTime() - Date.now()) / MS_IN_HOURS) : Infinity;
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _style__WEBPACK_IMPORTED_MODULE_2__.assignmentInfoClass },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("header", { className: _style__WEBPACK_IMPORTED_MODULE_2__.assignmentNameClass }, assignment.name),
            assignment.isClosed ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", { style: {
                    margin: 0,
                    marginTop: 8,
                    fontSize: 13,
                    color: 'var(--jp-ui-font-color1)',
                    textTransform: 'uppercase',
                    letterSpacing: 0.75
                } }, "Closed")) : null),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _style__WEBPACK_IMPORTED_MODULE_2__.assignmentInfoSectionClass, style: { marginTop: 16 } },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", { className: _style__WEBPACK_IMPORTED_MODULE_2__.assignmentInfoSectionHeaderClass }, "Student"),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null,
                student.firstName,
                " ",
                student.lastName)),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _style__WEBPACK_IMPORTED_MODULE_2__.assignmentInfoSectionClass },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", { className: _style__WEBPACK_IMPORTED_MODULE_2__.assignmentInfoSectionHeaderClass },
                "Professor",
                course.instructors.length > 1 ? "s" : ""),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, course.instructors.map((ins) => ins.fullName).join(", "))),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _style__WEBPACK_IMPORTED_MODULE_2__.assignmentInfoSectionClass },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", { className: _style__WEBPACK_IMPORTED_MODULE_2__.assignmentInfoSectionHeaderClass }, "Due date"),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
                assignment.isCreated ? (new _utils__WEBPACK_IMPORTED_MODULE_3__.DateFormat(assignment.adjustedDueDate).toBasicDatetime()) : (`To be determined`),
                assignment.isExtended ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", null, "\u00A0(extended)")) : null),
            assignment.isCreated && !assignment.isClosed && hoursUntilDue <= 2 ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: { marginTop: 4, color: 'var(--jp-warn-color0)' } },
                "Warning: ",
                new _utils__WEBPACK_IMPORTED_MODULE_3__.DateFormat(assignment.adjustedDueDate).toRelativeDatetime(),
                " remaining")) : null)));
};


/***/ }),

/***/ "./lib/components/assignment-panel/assignment-info/style.js":
/*!******************************************************************!*\
  !*** ./lib/components/assignment-panel/assignment-info/style.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assignmentInfoClass: () => (/* binding */ assignmentInfoClass),
/* harmony export */   assignmentInfoSectionClass: () => (/* binding */ assignmentInfoSectionClass),
/* harmony export */   assignmentInfoSectionHeaderClass: () => (/* binding */ assignmentInfoSectionHeaderClass),
/* harmony export */   assignmentNameClass: () => (/* binding */ assignmentNameClass)
/* harmony export */ });
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! typestyle */ "webpack/sharing/consume/default/typestyle/typestyle");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(typestyle__WEBPACK_IMPORTED_MODULE_0__);

const assignmentInfoClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    fontSize: 'var(--jp-ui-font-size1)',
    color: 'var(--jp-ui-font-color2)',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 12px'
});
const assignmentNameClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    flex: '0 0 auto',
    color: 'var(--jp-ui-font-color1)',
    fontSize: 'var(--jp-ui-font-size3)',
    fontWeight: 600,
    marginTop: 6,
    padding: '8px 0',
    marginBottom: 0,
    paddingBottom: 0
});
const assignmentInfoSectionClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    color: 'var(--jp-ui-font-color1)',
    marginBottom: 16,
    '& > *:first-child': {
        fontSize: 12
    },
    '& > *': {
        fontSize: 14
    }
});
const assignmentInfoSectionHeaderClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    margin: 0,
    marginBottom: 4,
    fontWeight: 600
});


/***/ }),

/***/ "./lib/components/assignment-panel/assignment-panel.js":
/*!*************************************************************!*\
  !*** ./lib/components/assignment-panel/assignment-panel.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssignmentPanel: () => (/* binding */ AssignmentPanel)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _material_ui_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/icons */ "webpack/sharing/consume/default/@material-ui/icons/@material-ui/icons");
/* harmony import */ var _material_ui_icons__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style */ "./lib/components/assignment-panel/style.js");
/* harmony import */ var _assignment_content__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./assignment-content */ "./lib/components/assignment-panel/assignment-content/assignment-content.js");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../contexts */ "./lib/contexts/commands-context.js");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../contexts */ "./lib/contexts/assignment-context.js");





const AssignmentPanel = ({}) => {
    const commands = (0,_contexts__WEBPACK_IMPORTED_MODULE_2__.useCommands)();
    const { course, assignment } = (0,_contexts__WEBPACK_IMPORTED_MODULE_3__.useAssignment)();
    const headerName = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        const headerFragments = [];
        // if (assignment) headerFragments.push(assignment.name)
        if (course)
            headerFragments.push(course.name);
        headerFragments.push('EduHeLx');
        return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, headerFragments.join(' • ')));
    }, [course]);
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _style__WEBPACK_IMPORTED_MODULE_4__.panelWrapperClass },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("header", { className: _style__WEBPACK_IMPORTED_MODULE_4__.panelHeaderClass },
            assignment && (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_icons__WEBPACK_IMPORTED_MODULE_1__.ArrowBackSharp, { onClick: () => commands.execute('filebrowser:go-to-path', {
                    path: `${assignment.absoluteDirectoryPath}/../`,
                    dontShowBrowser: true
                }), style: { marginRight: 8, fontSize: 16, cursor: 'pointer' } })),
            headerName),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_assignment_content__WEBPACK_IMPORTED_MODULE_5__.AssignmentContent, null)));
};


/***/ }),

/***/ "./lib/components/assignment-panel/assignment-submissions/assignment-submissions.js":
/*!******************************************************************************************!*\
  !*** ./lib/components/assignment-panel/assignment-submissions/assignment-submissions.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssignmentSubmissions: () => (/* binding */ AssignmentSubmissions)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/core */ "webpack/sharing/consume/default/@material-ui/core/@material-ui/core?8d99");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _material_ui_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/icons */ "webpack/sharing/consume/default/@material-ui/icons/@material-ui/icons");
/* harmony import */ var _material_ui_icons__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style */ "./lib/components/assignment-panel/assignment-submissions/style.js");
/* harmony import */ var _text_divider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../text-divider */ "./lib/components/text-divider/text-divider.js");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../contexts */ "./lib/contexts/assignment-context.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../utils */ "./lib/utils/date-format.js");







const AssignmentSubmissions = ({ ...props }) => {
    const { assignment } = (0,_contexts__WEBPACK_IMPORTED_MODULE_3__.useAssignment)();
    const submissionSource = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (assignment === null || assignment === void 0 ? void 0 : assignment.submissions.sort((a, b) => b.submissionTime.getTime() - a.submissionTime.getTime())), [assignment]);
    if (!assignment)
        return null;
    if (assignment.submissions.length === 0)
        return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _style__WEBPACK_IMPORTED_MODULE_4__.noSubmissionsTextContainerClass }, "You haven't made any submissions for this assignment yet. To submit your work, press the \"Submit\" button at the bottom of the page."));
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _style__WEBPACK_IMPORTED_MODULE_4__.assignmentSubmissionsContainerClass, ...props },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_text_divider__WEBPACK_IMPORTED_MODULE_5__.TextDivider, { innerStyle: { fontSize: 'var(--jp-ui-font-size2)' }, style: { padding: '0 12px' } }, "Submissions"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _style__WEBPACK_IMPORTED_MODULE_4__.assignmentsListClass }, submissionSource.map((submission, i) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.ExpansionPanel, { key: submission.id, square: true },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.ExpansionPanelSummary, { expandIcon: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_icons__WEBPACK_IMPORTED_MODULE_2__.ExpandMoreSharp, null) },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.ListItem, null,
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.ListItemIcon, { style: { minWidth: 0, marginRight: 16 } },
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, `#${submissionSource.length - i}`)),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.ListItemText, { disableTypography: true },
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: { fontSize: 12, color: 'var(--jp-ui-font-color2)', marginBottom: 4 } }, new _utils__WEBPACK_IMPORTED_MODULE_6__.DateFormat(submission.submissionTime).toBasicDatetime()),
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: { fontSize: 13 } }, submission.commit.summary)))),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.ExpansionPanelDetails, null,
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.Card, { variant: "outlined" },
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.CardContent, { style: { padding: 0 } },
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.Typography, { variant: "h5", component: "h5", style: { fontSize: 13, fontFamily: "inherit" } }, submission.commit.authorName),
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.Typography, { style: { fontSize: 12, marginBottom: 4, fontFamily: "inherit" }, color: "textSecondary" }, submission.commit.idShort),
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.Typography, { variant: "body2", component: "p", style: {
                                fontSize: 12,
                                fontFamily: "inherit",
                                wordBreak: "break-word",
                                fontStyle: submission.commit.description ? "normal" : "italic"
                            } }, submission.commit.description || "No description"))))))))));
};


/***/ }),

/***/ "./lib/components/assignment-panel/assignment-submissions/style.js":
/*!*************************************************************************!*\
  !*** ./lib/components/assignment-panel/assignment-submissions/style.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activateSubmissionButtonClass: () => (/* binding */ activateSubmissionButtonClass),
/* harmony export */   assignmentSubmissionsContainerClass: () => (/* binding */ assignmentSubmissionsContainerClass),
/* harmony export */   assignmentSubmissionsHeaderClass: () => (/* binding */ assignmentSubmissionsHeaderClass),
/* harmony export */   assignmentsListClass: () => (/* binding */ assignmentsListClass),
/* harmony export */   assignmentsTableClass: () => (/* binding */ assignmentsTableClass),
/* harmony export */   noSubmissionsTextContainerClass: () => (/* binding */ noSubmissionsTextContainerClass)
/* harmony export */ });
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! typestyle */ "webpack/sharing/consume/default/typestyle/typestyle");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(typestyle__WEBPACK_IMPORTED_MODULE_0__);

const assignmentSubmissionsContainerClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    display: 'flex',
    flexDirection: 'column'
});
const assignmentSubmissionsHeaderClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    margin: '0',
    marginBottom: '2px',
    padding: '0 12px',
    fontWeight: 600,
    color: 'var(--jp-ui-font-color0)',
    fontSize: 'var(--jp-ui-font-size2)'
});
const noSubmissionsTextContainerClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    width: '100%',
    color: 'var(--jp-ui-font-color2)',
    fontSize: 'var(--jp-ui-font-size1)',
    lineHeight: 'var(--jp-content-line-height)',
    textAlign: 'left',
    padding: '0 12px',
    flexGrow: 1
});
const assignmentsTableClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    '& th, & td': {
        height: 42,
        fontSize: 13,
    }
});
const activateSubmissionButtonClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    fontSize: 13,
    backgroundColor: 'var(--jp-layout-color0)',
    color: 'var(--jp-ui-font-color0)',
    borderRadius: 3,
    border: '1px solid var(--jp-border-color2)',
    padding: '4px 10px',
    cursor: 'pointer'
});
const assignmentsListClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    flexGrow: 1,
    height: 0,
    overflowY: 'auto',
    padding: 0,
    /** Adjusting clashing styles caused by using accordion summaries as ListItem components */
    '& .MuiExpansionPanel-root, & .MuiExpansionPanel-root.Mui-expanded': {
        boxShadow: 'none',
        margin: 0,
    },
    '& .MuiExpansionPanel-root::before, & > div.MuiExpansionPanel-root.Mui-expanded::before': {
        top: -1,
        left: 0,
        right: 0,
        height: 1,
        content: '""',
        opacity: 1,
        position: 'absolute',
        display: 'block !important'
    },
    '& .MuiExpansionPanel-root:first-child::before, & > div.MuiExpansionPanel-root.Mui-expanded:first-child::before': {
        display: 'none !important'
    },
    '& .MuiExpansionPanelSummary-root, & .MuiExpansionPanelSummary-root.Mui-expanded': {
        padding: 0,
        minHeight: 'unset'
    },
    '& .MuiExpansionPanelSummary-content, & .MuiExpansionPanelSummary-content.Mui-expanded': {
        margin: 0
    },
    '& .MuiListItem-root': {
        paddingLeft: 12,
        paddingRight: 12
    },
    '& .MuiExpansionPanelSummary-expandIcon': {
        marginRight: 0
    },
    '& .MuiExpansionPanelDetails-root': {
        paddingLeft: 12,
        paddingRight: 12
    },
    '& .MuiExpansionPanelDetails-root > .MuiCard-root': {
        borderWidth: 0,
        borderLeftWidth: '2px !important',
        // So that the border aligns with the assignment number,
        // and the text aligns with the commit summary
        paddingLeft: 22,
        marginLeft: 8,
        borderRadius: 0
    },
    '& .MuiExpansionPanelDetails-root > .MuiCard-root > .MuiCardContent-root': {
        paddingLeft: 0
    }
});


/***/ }),

/***/ "./lib/components/assignment-panel/assignment-submit-form/assignment-submit-button/assignment-submit-button.js":
/*!*********************************************************************************************************************!*\
  !*** ./lib/components/assignment-panel/assignment-submit-form/assignment-submit-button/assignment-submit-button.js ***!
  \*********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssignmentSubmitButton: () => (/* binding */ AssignmentSubmitButton)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _material_ui_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/icons */ "webpack/sharing/consume/default/@material-ui/icons/@material-ui/icons");
/* harmony import */ var _material_ui_icons__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style */ "./lib/components/assignment-panel/assignment-submit-form/assignment-submit-button/style.js");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! typestyle */ "webpack/sharing/consume/default/typestyle/typestyle");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(typestyle__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../style */ "./lib/components/style.js");





const AssignmentSubmitButton = ({ onClick, disabled = false }) => {
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { className: (0,typestyle__WEBPACK_IMPORTED_MODULE_2__.classes)(_style__WEBPACK_IMPORTED_MODULE_3__.assignmentSubmitButton, disabled && _style__WEBPACK_IMPORTED_MODULE_4__.disabledButtonClass), disabled: disabled, onClick: onClick },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_icons__WEBPACK_IMPORTED_MODULE_1__.PublishSharp, { style: { fontSize: 22, marginRight: 4 } }),
        " Submit Assignment"));
};


/***/ }),

/***/ "./lib/components/assignment-panel/assignment-submit-form/assignment-submit-button/style.js":
/*!**************************************************************************************************!*\
  !*** ./lib/components/assignment-panel/assignment-submit-form/assignment-submit-button/style.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assignmentSubmitButton: () => (/* binding */ assignmentSubmitButton)
/* harmony export */ });
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! typestyle */ "webpack/sharing/consume/default/typestyle/typestyle");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(typestyle__WEBPACK_IMPORTED_MODULE_0__);

const assignmentSubmitButton = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    fontSize: 14,
    backgroundColor: 'var(--md-blue-500)',
    border: 0,
    borderRadius: 3,
    cursor: 'pointer',
    color: 'white',
    height: 30.75,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
});


/***/ }),

/***/ "./lib/components/assignment-panel/assignment-submit-form/assignment-submit-form.js":
/*!******************************************************************************************!*\
  !*** ./lib/components/assignment-panel/assignment-submit-form/assignment-submit-form.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssignmentSubmitForm: () => (/* binding */ AssignmentSubmitForm)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/core */ "webpack/sharing/consume/default/@material-ui/core/@material-ui/core?8d99");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _assignment_submit_button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./assignment-submit-button */ "./lib/components/assignment-panel/assignment-submit-form/assignment-submit-button/assignment-submit-button.js");
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./style */ "./lib/components/assignment-panel/assignment-submit-form/style.js");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../contexts */ "./lib/contexts/assignment-context.js");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../contexts */ "./lib/contexts/backdrop-context.js");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../contexts */ "./lib/contexts/snackbar-context.js");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../api */ "./lib/api/api.js");






const AssignmentSubmitForm = ({}) => {
    const { assignment, path } = (0,_contexts__WEBPACK_IMPORTED_MODULE_2__.useAssignment)();
    const backdrop = (0,_contexts__WEBPACK_IMPORTED_MODULE_3__.useBackdrop)();
    const snackbar = (0,_contexts__WEBPACK_IMPORTED_MODULE_4__.useSnackbar)();
    const [summaryText, setSummaryText] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
    const [descriptionText, setDescriptionText] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
    const [submitting, setSubmitting] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const disabled = submitting || summaryText === "" || !(assignment === null || assignment === void 0 ? void 0 : assignment.isAvailable) || (assignment === null || assignment === void 0 ? void 0 : assignment.isClosed);
    const submitAssignment = async () => {
        if (!path) {
            // If this component is being rendered, this should never be possible.
            console.log("Unknown cwd, can't submit");
            return;
        }
        setSubmitting(true);
        try {
            // Use undefined for descriptionText if it is an empty string.
            const submission = await (0,_api__WEBPACK_IMPORTED_MODULE_5__.submitAssignment)(path, summaryText, descriptionText !== null && descriptionText !== void 0 ? descriptionText : undefined);
            // Only clear summary/description if the submission goes through.
            setSummaryText("");
            setDescriptionText("");
            snackbar.open({
                type: 'success',
                message: 'Successfully submitted assignment!'
            });
        }
        catch (e) {
            snackbar.open({
                type: 'error',
                message: 'Failed to submit assignment!'
            });
        }
        setSubmitting(false);
    };
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        backdrop.setLoading(submitting);
    }, [submitting]);
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _style__WEBPACK_IMPORTED_MODULE_6__.submitFormContainerClass },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.Input, { className: _style__WEBPACK_IMPORTED_MODULE_6__.summaryClass, classes: {
                root: _style__WEBPACK_IMPORTED_MODULE_6__.submitRootClass,
                focused: _style__WEBPACK_IMPORTED_MODULE_6__.activeStyle,
                disabled: _style__WEBPACK_IMPORTED_MODULE_6__.disabledStyle
            }, type: "text", placeholder: "Summary", title: "Enter a summary for the submission (preferably less than 50 characters)", value: summaryText, onChange: (e) => setSummaryText(e.target.value), onKeyDown: (e) => {
                if (disabled)
                    return;
                if (e.key === 'Enter')
                    submitAssignment();
            }, disabled: submitting, required: true, disableUnderline: true, fullWidth: true }),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.Input, { className: _style__WEBPACK_IMPORTED_MODULE_6__.descriptionClass, classes: {
                root: _style__WEBPACK_IMPORTED_MODULE_6__.submitRootClass,
                focused: _style__WEBPACK_IMPORTED_MODULE_6__.activeStyle,
                disabled: _style__WEBPACK_IMPORTED_MODULE_6__.disabledStyle
            }, multiline: true, rows: 5, rowsMax: 10, placeholder: "Description (optional)", title: "Enter a description for the submission", value: descriptionText, onChange: (e) => setDescriptionText(e.target.value), onKeyDown: (e) => {
                // if (disabled) return
                // if (e.key === 'Enter') submitAssignment()
            }, disabled: submitting, disableUnderline: true, fullWidth: true }),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_assignment_submit_button__WEBPACK_IMPORTED_MODULE_7__.AssignmentSubmitButton, { onClick: submitAssignment, disabled: disabled })));
};


/***/ }),

/***/ "./lib/components/assignment-panel/assignment-submit-form/style.js":
/*!*************************************************************************!*\
  !*** ./lib/components/assignment-panel/assignment-submit-form/style.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activeStyle: () => (/* binding */ activeStyle),
/* harmony export */   descriptionClass: () => (/* binding */ descriptionClass),
/* harmony export */   disabledStyle: () => (/* binding */ disabledStyle),
/* harmony export */   submitFormContainerClass: () => (/* binding */ submitFormContainerClass),
/* harmony export */   submitRootClass: () => (/* binding */ submitRootClass),
/* harmony export */   summaryClass: () => (/* binding */ summaryClass)
/* harmony export */ });
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! typestyle */ "webpack/sharing/consume/default/typestyle/typestyle");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(typestyle__WEBPACK_IMPORTED_MODULE_0__);

const submitFormContainerClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 8px',
    borderTop: 'var(--jp-border-width) solid var(--jp-border-color2)'
});
const submitRootClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    color: 'var(--jp-ui-font-color1) !important',
    fontSize: 'var(--jp-ui-font-size1) !important',
    fontFamily: 'var(--jp-ui-font-family) !important',
    backgroundColor: 'var(--jp-layout-color1) !important'
});
const summaryClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    height: '2em',
    marginBottom: '1em',
    padding: 'var(--jp-code-padding)',
    outline: 'none',
    overflowX: 'auto',
    border: 'var(--jp-border-width) solid var(--jp-border-color2)',
    borderRadius: 3,
    $nest: {
        '&.Mui-error': {
            border: 'calc(2 * var(--jp-border-width)) solid var(--jp-error-color1)'
        }
    }
});
const descriptionClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    marginBottom: '1em',
    padding: 'var(--jp-code-padding)',
    paddingLeft: '5px !important',
    paddingRight: '5px !important',
    outline: 'none',
    overflowX: 'auto',
    resize: 'none',
    border: 'var(--jp-border-width) solid var(--jp-border-color2)',
    borderRadius: 3,
    $nest: {
        '&>*::placeholder': {
            color: 'var(--jp-ui-font-color3)'
        },
        '&>*::-webkit-input-placeholder': {
            color: 'var(--jp-ui-font-color3)'
        },
        '&>*::-moz-placeholder': {
            color: 'var(--jp-ui-font-color3)'
        },
        '&>*::-ms-input-placeholder': {
            color: 'var(--jp-ui-font-color3)'
        }
    }
});
const activeStyle = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    outline: 'none',
    border: 'var(--jp-border-width) solid var(--jp-brand-color1)'
});
const disabledStyle = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    cursor: 'not-allowed !important',
    color: 'var(--jp-ui-font-color2) !important',
    backgroundColor: 'var(--jp-layout-color3) !important',
    pointerEvents: 'auto !important'
});


/***/ }),

/***/ "./lib/components/assignment-panel/assignments-list/assignments-list.js":
/*!******************************************************************************!*\
  !*** ./lib/components/assignment-panel/assignments-list/assignments-list.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssignmentsList: () => (/* binding */ AssignmentsList)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/core */ "webpack/sharing/consume/default/@material-ui/core/@material-ui/core?8d99");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _material_ui_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/icons */ "webpack/sharing/consume/default/@material-ui/icons/@material-ui/icons");
/* harmony import */ var _material_ui_icons__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! typestyle */ "webpack/sharing/consume/default/typestyle/typestyle");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(typestyle__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style */ "./lib/components/assignment-panel/assignments-list/style.js");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../contexts */ "./lib/contexts/commands-context.js");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../contexts */ "./lib/contexts/assignment-context.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../utils */ "./lib/utils/date-format.js");
/* harmony import */ var _assignment_submissions_style__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../assignment-submissions/style */ "./lib/components/assignment-panel/assignment-submissions/style.js");
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../style */ "./lib/components/style.js");









const ListItemAvatar = _material_ui_core__WEBPACK_IMPORTED_MODULE_1__.ListItemAvatar;
const ListHeader = ({ title }) => {
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: _style__WEBPACK_IMPORTED_MODULE_4__.assignmentListHeaderClass }, title));
};
const AssignmentListItem = ({ assignment }) => {
    const commands = (0,_contexts__WEBPACK_IMPORTED_MODULE_5__.useCommands)();
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.ListItem, { key: assignment.id, className: _style__WEBPACK_IMPORTED_MODULE_4__.assignmentListItemClass, dense: true, style: {
            padding: '4px 8px'
        } },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.ListItemText, { disableTypography: true },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: { fontSize: 14, fontWeight: 500, marginBottom: 4 } }, assignment.name),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: { fontSize: 13, color: 'var(--jp-ui-font-color2' } }, !assignment.isCreated ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, "No release date yet")) :
                assignment.isClosed ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { title: new _utils__WEBPACK_IMPORTED_MODULE_6__.DateFormat(assignment.adjustedDueDate).toBasicDatetime() },
                    "Closed on ",
                    new _utils__WEBPACK_IMPORTED_MODULE_6__.DateFormat(assignment.adjustedDueDate).toBasicDatetime())) : assignment.isAvailable ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { title: new _utils__WEBPACK_IMPORTED_MODULE_6__.DateFormat(assignment.adjustedDueDate).toBasicDatetime() },
                    "Closes in ",
                    new _utils__WEBPACK_IMPORTED_MODULE_6__.DateFormat(assignment.adjustedDueDate).toRelativeDatetime(),
                    assignment.isExtended && (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", null, "\u00A0(extended)")))) : (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: { display: 'flex', flexDirection: 'column' } },
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { title: new _utils__WEBPACK_IMPORTED_MODULE_6__.DateFormat(assignment.adjustedAvailableDate).toBasicDatetime() },
                        "Opens in ",
                        new _utils__WEBPACK_IMPORTED_MODULE_6__.DateFormat(assignment.adjustedAvailableDate).toRelativeDatetime()),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { title: new _utils__WEBPACK_IMPORTED_MODULE_6__.DateFormat(assignment.adjustedDueDate).toBasicDatetime(), style: { marginTop: 4, fontSize: 12, display: 'flex', alignItems: 'center' } },
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_icons__WEBPACK_IMPORTED_MODULE_2__.QueryBuilderOutlined, { style: { fontSize: 16 } }),
                        "\u00A0Lasts ",
                        new _utils__WEBPACK_IMPORTED_MODULE_6__.DateFormat(assignment.adjustedDueDate).toRelativeDatetime(assignment.adjustedAvailableDate)))))),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ListItemAvatar, { style: { minWidth: 0, marginLeft: 16 } },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.Avatar, { variant: "square" },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { className: (0,typestyle__WEBPACK_IMPORTED_MODULE_3__.classes)(_style__WEBPACK_IMPORTED_MODULE_4__.downloadAssignmentButtonClass, !assignment.isCreated && _style__WEBPACK_IMPORTED_MODULE_7__.disabledButtonClass), disabled: !assignment.isCreated, onClick: () => commands.execute('filebrowser:go-to-path', {
                        path: assignment.absoluteDirectoryPath,
                        dontShowBrowser: true
                    }) },
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_icons__WEBPACK_IMPORTED_MODULE_2__.OpenInNewSharp, null))))));
};
const AssignmentsBucket = ({ title, assignments, emptyText = "There are currently no assignments to work on.", defaultExpanded = false, }) => {
    const [expanded, setExpanded] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(defaultExpanded);
    const assignmentsSource = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (assignments === null || assignments === void 0 ? void 0 : assignments.sort((a, b) => { var _a, _b, _c, _d; return ((_b = (_a = a.adjustedAvailableDate) === null || _a === void 0 ? void 0 : _a.getTime()) !== null && _b !== void 0 ? _b : 0) - ((_d = (_c = b.adjustedAvailableDate) === null || _c === void 0 ? void 0 : _c.getTime()) !== null && _d !== void 0 ? _d : 0); })), [assignments]);
    const isEmpty = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => !assignmentsSource || assignmentsSource.length === 0, [assignmentsSource]);
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.ExpansionPanel, { className: _style__WEBPACK_IMPORTED_MODULE_4__.assignmentBucketContainerClass, square: true, expanded: expanded, onChange: () => setExpanded(!expanded) },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.ExpansionPanelSummary, { expandIcon: react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_icons__WEBPACK_IMPORTED_MODULE_2__.ExpandMoreSharp, null), style: { paddingLeft: 11 } },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ListHeader, { title: title })),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.ExpansionPanelDetails, { style: { display: 'flex', flexDirection: 'column', paddingTop: 0, paddingLeft: 11, paddingRight: 11 } }, !isEmpty ? (assignmentsSource === null || assignmentsSource === void 0 ? void 0 : assignmentsSource.map((assignment) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(AssignmentListItem, { key: assignment.id, assignment: assignment })))) : (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { style: { color: 'var(--jp-ui-font-color1)' } }, emptyText)))));
};
const AssignmentsList = () => {
    const { assignments } = (0,_contexts__WEBPACK_IMPORTED_MODULE_8__.useAssignment)();
    const upcomingAssignments = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => assignments === null || assignments === void 0 ? void 0 : assignments.filter((assignment) => !assignment.isAvailable), [assignments]);
    const activeAssignments = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => assignments === null || assignments === void 0 ? void 0 : assignments.filter((assignment) => assignment.isAvailable && !assignment.isClosed), [assignments]);
    const pastAssignments = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => assignments === null || assignments === void 0 ? void 0 : assignments.filter((assignment) => assignment.isAvailable && assignment.isClosed), [assignments]);
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: { flexGrow: 1, display: 'flex', flexDirection: 'column', width: 'calc(100% + 22px)' } },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _assignment_submissions_style__WEBPACK_IMPORTED_MODULE_9__.assignmentsListClass },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(AssignmentsBucket, { title: `Active${activeAssignments ? " (" + activeAssignments.length + ")" : ""}`, assignments: activeAssignments, emptyText: "There aren't any assignments available to work on at the moment.", defaultExpanded: true }),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(AssignmentsBucket, { title: `Upcoming${upcomingAssignments ? " (" + upcomingAssignments.length + ")" : ""}`, assignments: upcomingAssignments, emptyText: "There aren't any upcoming assignments right now.", defaultExpanded: true }),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(AssignmentsBucket, { title: `Past${pastAssignments ? " (" + pastAssignments.length + ")" : ""}`, assignments: pastAssignments, emptyText: "There aren't any past assignments.", defaultExpanded: false }))));
};


/***/ }),

/***/ "./lib/components/assignment-panel/assignments-list/style.js":
/*!*******************************************************************!*\
  !*** ./lib/components/assignment-panel/assignments-list/style.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assignmentBucketContainerClass: () => (/* binding */ assignmentBucketContainerClass),
/* harmony export */   assignmentListHeaderClass: () => (/* binding */ assignmentListHeaderClass),
/* harmony export */   assignmentListItemClass: () => (/* binding */ assignmentListItemClass),
/* harmony export */   downloadAssignmentButtonClass: () => (/* binding */ downloadAssignmentButtonClass)
/* harmony export */ });
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! typestyle */ "webpack/sharing/consume/default/typestyle/typestyle");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(typestyle__WEBPACK_IMPORTED_MODULE_0__);

const assignmentBucketContainerClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    '& .MuiExpansionPanelSummary-expandIcon': {
        paddingLeft: 6,
        paddingRight: 6
    }
});
const assignmentListItemClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    '&:first-child': {
        paddingTop: '0 !important',
    },
    '&:first-child > .MuiListItemText-root': {
        marginTop: '0 !important'
    }
});
const assignmentListHeaderClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    color: 'var(--jp-ui-font-color0)',
    fontSize: 13,
    fontWeight: 500
});
const downloadAssignmentButtonClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    backgroundColor: 'var(--md-blue-500)',
    border: 0,
    borderRadius: 0,
    cursor: 'pointer',
    color: 'white',
    fontSize: 'var(--jp-ui-font-size1)',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
});


/***/ }),

/***/ "./lib/components/assignment-panel/no-assignment-warning/no-assignment-warning.js":
/*!****************************************************************************************!*\
  !*** ./lib/components/assignment-panel/no-assignment-warning/no-assignment-warning.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NoAssignmentWarning: () => (/* binding */ NoAssignmentWarning)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/core */ "webpack/sharing/consume/default/@material-ui/core/@material-ui/core?8d99");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _material_ui_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/icons */ "webpack/sharing/consume/default/@material-ui/icons/@material-ui/icons");
/* harmony import */ var _material_ui_icons__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! typestyle */ "webpack/sharing/consume/default/typestyle/typestyle");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(typestyle__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./style */ "./lib/components/assignment-panel/no-assignment-warning/style.js");
/* harmony import */ var _assignments_list__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../assignments-list */ "./lib/components/assignment-panel/assignments-list/assignments-list.js");
/* harmony import */ var _text_divider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../text-divider */ "./lib/components/text-divider/text-divider.js");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../api */ "./lib/api/api.js");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../contexts */ "./lib/contexts/commands-context.js");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../contexts */ "./lib/contexts/assignment-context.js");
/* harmony import */ var _assignment_submit_form_style__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../assignment-submit-form/style */ "./lib/components/assignment-panel/assignment-submit-form/style.js");










const NoAssignmentWarning = ({ noRepository }) => {
    const commands = (0,_contexts__WEBPACK_IMPORTED_MODULE_4__.useCommands)();
    const { path } = (0,_contexts__WEBPACK_IMPORTED_MODULE_5__.useAssignment)();
    const [repositoryUrl, setRepositoryUrl] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [errorMessage, setErrorMessage] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const cloneRepository = async (repositoryUrl) => {
        if (!path) {
            console.log("Unknown cwd, can't clone");
            return;
        }
        setLoading(true);
        try {
            const repositoryRootPath = await (0,_api__WEBPACK_IMPORTED_MODULE_6__.cloneStudentRepository)(repositoryUrl, path);
            commands.execute('filebrowser:go-to-path', {
                path: repositoryRootPath,
                dontShowBrowser: true
            });
        }
        catch (e) {
            setErrorMessage(e.message);
        }
        setLoading(false);
    };
    if (noRepository)
        return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _style__WEBPACK_IMPORTED_MODULE_7__.containerClass },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: { width: '100%', marginBottom: 4 } },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: { display: 'flex', alignItems: 'stretch', width: '100%' } },
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.Input, { className: _assignment_submit_form_style__WEBPACK_IMPORTED_MODULE_8__.summaryClass, classes: {
                            root: _assignment_submit_form_style__WEBPACK_IMPORTED_MODULE_8__.submitRootClass,
                            focused: _assignment_submit_form_style__WEBPACK_IMPORTED_MODULE_8__.activeStyle,
                            // disabled: disabledStyle
                        }, style: {
                            borderRadius: 0,
                            borderRight: 'none',
                            marginBottom: 0,
                            flexGrow: 1,
                            height: '2.25em',
                            borderWidth: 1,
                            overflow: 'visible'
                        }, type: "url", placeholder: "Class repository URL", title: "Enter the URL to the class's git repository", error: errorMessage !== null, value: repositoryUrl, onChange: (e) => {
                            setErrorMessage(null);
                            setRepositoryUrl(e.target.value);
                        }, onKeyDown: (e) => {
                            if (loading)
                                return;
                            if (e.key === 'Enter')
                                cloneRepository(repositoryUrl);
                        }, 
                        // disabled={ loading }
                        required: true, disableUnderline: true, fullWidth: true }),
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { className: (0,typestyle__WEBPACK_IMPORTED_MODULE_3__.classes)(_style__WEBPACK_IMPORTED_MODULE_7__.openFileBrowserButtonClass, loading && _assignment_submit_form_style__WEBPACK_IMPORTED_MODULE_8__.disabledStyle), style: {
                            borderRadius: 0,
                            margin: 0,
                            width: '2.25em',
                            height: '2.25em',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }, disabled: loading, onClick: () => cloneRepository(repositoryUrl) }, !loading ? (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_icons__WEBPACK_IMPORTED_MODULE_2__.GetAppSharp, { style: { fontSize: 20 } })) : (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.CircularProgress, { color: "inherit", style: { width: 14, height: 14, color: 'white' } })))),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: { color: 'var(--jp-error-color1)', marginTop: 8, marginBottom: 4, fontSize: '0.75rem', wordBreak: 'break-all' } }, errorMessage)),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _style__WEBPACK_IMPORTED_MODULE_7__.textContainerClass }, "You are not currently in your class repository. If you haven't already cloned your class repository, you can download it here."),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _style__WEBPACK_IMPORTED_MODULE_7__.warningTextContainerClass }, "Warning: Don't clone the repository again if you've already downloaded it! Navigate to the repository in the file browser."),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { className: _style__WEBPACK_IMPORTED_MODULE_7__.openFileBrowserButtonClass, onClick: () => commands.execute('filebrowser:toggle-main') }, "Open the FileBrowser")));
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _style__WEBPACK_IMPORTED_MODULE_7__.containerClass },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: _style__WEBPACK_IMPORTED_MODULE_7__.textContainerClass }, "You are not currently in an assignment. To submit your work, navigate to an assignment in the filebrowser or open it here."),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_text_divider__WEBPACK_IMPORTED_MODULE_9__.TextDivider, { innerStyle: { fontSize: 15 }, style: { width: '100%', marginTop: 12 } }, "Assignments"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_assignments_list__WEBPACK_IMPORTED_MODULE_10__.AssignmentsList, null)));
};


/***/ }),

/***/ "./lib/components/assignment-panel/no-assignment-warning/style.js":
/*!************************************************************************!*\
  !*** ./lib/components/assignment-panel/no-assignment-warning/style.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   containerClass: () => (/* binding */ containerClass),
/* harmony export */   openFileBrowserButtonClass: () => (/* binding */ openFileBrowserButtonClass),
/* harmony export */   textContainerClass: () => (/* binding */ textContainerClass),
/* harmony export */   warningTextContainerClass: () => (/* binding */ warningTextContainerClass)
/* harmony export */ });
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! typestyle */ "webpack/sharing/consume/default/typestyle/typestyle");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(typestyle__WEBPACK_IMPORTED_MODULE_0__);

const containerClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '13px 11px 4px 11px',
});
const textContainerClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    width: '100%',
    fontSize: 'var(--jp-ui-font-size1)',
    lineHeight: 'var(--jp-content-line-height)',
    textAlign: 'left',
});
const openFileBrowserButtonClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    backgroundColor: 'var(--md-blue-500)',
    border: 0,
    borderRadius: 3,
    cursor: 'pointer',
    color: 'white',
    fontSize: 'var(--jp-ui-font-size1)',
    height: 28,
    margin: '8px 0',
    width: 200,
});
const warningTextContainerClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--jp-warn-color0)',
    margin: '8px 0'
});


/***/ }),

/***/ "./lib/components/assignment-panel/style.js":
/*!**************************************************!*\
  !*** ./lib/components/assignment-panel/style.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   panelHeaderClass: () => (/* binding */ panelHeaderClass),
/* harmony export */   panelWrapperClass: () => (/* binding */ panelWrapperClass)
/* harmony export */ });
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! typestyle */ "webpack/sharing/consume/default/typestyle/typestyle");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(typestyle__WEBPACK_IMPORTED_MODULE_0__);

const panelWrapperClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    color: 'var(--jp-ui-font-color1)',
    fontSize: 'var(--jp-ui-font-size1)',
    background: 'var(--jp-layout-color1) !important',
    '&, & *': { boxSizing: 'border-box' }
});
const panelHeaderClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    display: 'flex',
    alignItems: 'center',
    borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
    flex: '0 0 auto',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 1,
    margin: 0,
    // It appears slightly off-center vertically, so this is just a small adjustment to fix that.
    marginTop: 2,
    padding: '8px 12px',
    textTransform: 'uppercase'
});


/***/ }),

/***/ "./lib/components/style.js":
/*!*********************************!*\
  !*** ./lib/components/style.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   disabledButtonClass: () => (/* binding */ disabledButtonClass),
/* harmony export */   textDividerClass: () => (/* binding */ textDividerClass)
/* harmony export */ });
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! typestyle */ "webpack/sharing/consume/default/typestyle/typestyle");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(typestyle__WEBPACK_IMPORTED_MODULE_0__);

const textDividerClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({});
const disabledButtonClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    cursor: 'not-allowed !important',
    backgroundColor: 'var(--jp-layout-color3) !important',
    pointerEvents: 'auto !important'
});


/***/ }),

/***/ "./lib/components/text-divider/style.js":
/*!**********************************************!*\
  !*** ./lib/components/text-divider/style.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   textDividerContainerClass: () => (/* binding */ textDividerContainerClass),
/* harmony export */   textDividerTextClass: () => (/* binding */ textDividerTextClass)
/* harmony export */ });
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! typestyle */ "webpack/sharing/consume/default/typestyle/typestyle");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(typestyle__WEBPACK_IMPORTED_MODULE_0__);

const textDividerContainerClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    display: 'flex',
    alignItems: 'center',
    color: 'var(--jp-ui-font-color0)',
    fontWeight: 500,
    textAlign: 'center',
    '&::before, &::after': {
        content: '""',
        position: 'relative',
        width: '100%',
        borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
        transform: 'translateY(50%)'
    },
    // Left-align adjustments
    '&.left::before': {
        width: 'var(--orientation-margin)'
    },
    // Right-align adjustmments'
    '&.right::after': {
        width: 'var(--orientation-margin)'
    }
});
const textDividerTextClass = (0,typestyle__WEBPACK_IMPORTED_MODULE_0__.style)({
    display: 'inline-block'
});


/***/ }),

/***/ "./lib/components/text-divider/text-divider.js":
/*!*****************************************************!*\
  !*** ./lib/components/text-divider/text-divider.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TextDivider: () => (/* binding */ TextDivider)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! typestyle */ "webpack/sharing/consume/default/typestyle/typestyle");
/* harmony import */ var typestyle__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(typestyle__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style */ "./lib/components/text-divider/style.js");



const TextDivider = ({ orientation = 'left', orientationMargin = 0, innerStyle = {}, style = {}, children, ...props }) => {
    const textStyle = orientation === 'left' ? {
        marginLeft: orientationMargin,
        paddingLeft: orientationMargin !== 0 ? 12 : 0,
        paddingRight: 12
    } : orientation === 'right' ? {
        marginRight: orientationMargin,
        paddingRight: orientationMargin !== 0 ? 12 : 0,
        paddingLeft: 12
    } : {
        paddingLeft: 12,
        paddingRight: 12
    };
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: (0,typestyle__WEBPACK_IMPORTED_MODULE_1__.classes)(_style__WEBPACK_IMPORTED_MODULE_2__.textDividerContainerClass, orientation), style: {
            '--orientation-margin': `${orientationMargin}px`,
            ...style
        }, ...props },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: _style__WEBPACK_IMPORTED_MODULE_2__.textDividerTextClass, style: {
                ...textStyle,
                ...innerStyle
            } }, children)));
};


/***/ }),

/***/ "./lib/contexts/assignment-context.js":
/*!********************************************!*\
  !*** ./lib/contexts/assignment-context.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssignmentContext: () => (/* binding */ AssignmentContext),
/* harmony export */   AssignmentProvider: () => (/* binding */ AssignmentProvider),
/* harmony export */   useAssignment: () => (/* binding */ useAssignment)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const AssignmentContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(undefined);
const AssignmentProvider = ({ model, children }) => {
    const [currentPath, setCurrentPath] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const [currentAssignment, setCurrentAssignment] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(undefined);
    const [assignments, setAssignments] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(undefined);
    const [student, setStudent] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(undefined);
    const [course, setCourse] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(undefined);
    const loading = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (currentAssignment === undefined ||
        assignments === undefined ||
        student === undefined ||
        course === undefined), [currentAssignment, assignments, student, course]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        setCurrentPath(model.currentPath);
        setCurrentAssignment(model.currentAssignment);
        setAssignments(model.assignments);
        setStudent(model.student);
        setCourse(model.course);
        const onCurrentPathChanged = (model, change) => {
            setCurrentPath(change.newValue);
        };
        const onCurrentAssignmentChanged = (model, change) => {
            setCurrentAssignment(change.newValue);
        };
        const onAssignmentsChanged = (model, change) => {
            setAssignments(change.newValue);
        };
        const onStudentChanged = (model, change) => {
            setStudent(change.newValue);
        };
        const onCourseChanged = (model, change) => {
            setCourse(change.newValue);
        };
        model.currentPathChanged.connect(onCurrentPathChanged);
        model.currentAssignmentChanged.connect(onCurrentAssignmentChanged);
        model.assignmentsChanged.connect(onAssignmentsChanged);
        model.studentChanged.connect(onStudentChanged);
        model.courseChanged.connect(onCourseChanged);
        return () => {
            model.currentPathChanged.disconnect(onCurrentPathChanged);
            model.currentAssignmentChanged.disconnect(onCurrentAssignmentChanged);
            model.assignmentsChanged.disconnect(onAssignmentsChanged);
            model.studentChanged.disconnect(onStudentChanged);
            model.courseChanged.disconnect(onCourseChanged);
        };
    }, [model]);
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(AssignmentContext.Provider, { value: {
            assignment: currentAssignment,
            assignments,
            student,
            course,
            path: currentPath,
            loading
        } }, children));
};
const useAssignment = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(AssignmentContext);


/***/ }),

/***/ "./lib/contexts/backdrop-context.js":
/*!******************************************!*\
  !*** ./lib/contexts/backdrop-context.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BackdropContext: () => (/* binding */ BackdropContext),
/* harmony export */   BackdropProvider: () => (/* binding */ BackdropProvider),
/* harmony export */   useBackdrop: () => (/* binding */ useBackdrop)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/core */ "webpack/sharing/consume/default/@material-ui/core/@material-ui/core?8d99");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__);


const BackdropContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(undefined);
const BackdropProvider = ({ children }) => {
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(BackdropContext.Provider, { value: {
            setLoading
        } },
        children,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.Modal, { open: loading, disableAutoFocus: true, disableEnforceFocus: true },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    color: 'var(--jp-ui-inverse-font-color0)',
                    textAlign: 'center'
                } },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.CircularProgress, { color: "inherit" })))));
};
const useBackdrop = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(BackdropContext);


/***/ }),

/***/ "./lib/contexts/commands-context.js":
/*!******************************************!*\
  !*** ./lib/contexts/commands-context.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CommandsContext: () => (/* binding */ CommandsContext),
/* harmony export */   CommandsProvider: () => (/* binding */ CommandsProvider),
/* harmony export */   useCommands: () => (/* binding */ useCommands)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const CommandsContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(undefined);
const CommandsProvider = ({ commands, children }) => {
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(CommandsContext.Provider, { value: commands }, children));
};
const useCommands = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(CommandsContext);


/***/ }),

/***/ "./lib/contexts/settings-context.js":
/*!******************************************!*\
  !*** ./lib/contexts/settings-context.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsContext: () => (/* binding */ SettingsContext),
/* harmony export */   SettingsProvider: () => (/* binding */ SettingsProvider),
/* harmony export */   useSettings: () => (/* binding */ useSettings)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const SettingsContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(undefined);
const SettingsProvider = ({ settings, children }) => {
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(SettingsContext.Provider, { value: settings }, children));
};
const useSettings = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(SettingsContext);


/***/ }),

/***/ "./lib/contexts/snackbar-context.js":
/*!******************************************!*\
  !*** ./lib/contexts/snackbar-context.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SnackbarContext: () => (/* binding */ SnackbarContext),
/* harmony export */   SnackbarProvider: () => (/* binding */ SnackbarProvider),
/* harmony export */   useSnackbar: () => (/* binding */ useSnackbar)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/core */ "webpack/sharing/consume/default/@material-ui/core/@material-ui/core?8d99");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _material_ui_lab__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/lab */ "webpack/sharing/consume/default/@material-ui/lab/@material-ui/lab");
/* harmony import */ var _material_ui_lab__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_material_ui_lab__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! uuid */ "webpack/sharing/consume/default/uuid/uuid");
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_3__);




const SnackbarContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(undefined);
const SnackbarProvider = ({ children }) => {
    const [snackbars, setSnackbars] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
    const createSnackbar = (props) => {
        var _a, _b, _c;
        props.duration = (_a = props.duration) !== null && _a !== void 0 ? _a : 2500;
        props.key = (_b = props.key) !== null && _b !== void 0 ? _b : (0,uuid__WEBPACK_IMPORTED_MODULE_3__.v4)();
        props.alignment = (_c = props.alignment) !== null && _c !== void 0 ? _c : { vertical: 'bottom', horizontal: 'right' };
        console.log(props, props.type);
        if (!props.content)
            props.content = (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_lab__WEBPACK_IMPORTED_MODULE_2__.Alert, { variant: "filled", color: props.type, style: {
                    // Bug with Mui, Paper class overrides color/severity class styles
                    backgroundColor: props.type === 'error' ? 'rgb(253, 236, 234)'
                        : props.type === 'info' ? 'rgb(232, 244, 253)'
                            : props.type === 'success' ? 'rgb(237, 247, 237)'
                                : props.type === 'warning' ? 'rgb(255, 248, 230)'
                                    : undefined,
                    color: props.type === 'error' ? 'rgb(97, 26, 21)'
                        : props.type === 'info' ? 'rgb(13, 60, 97)'
                            : props.type === 'success' ? 'rgb(30, 70, 32)'
                                : props.type === 'warning' ? 'rgb(102, 77, 2)'
                                    : undefined
                }, onClose: () => destroySnackbar(props.key) }, props.message));
        setSnackbars((prevSnackbars) => ({
            ...prevSnackbars,
            [props.key]: props
        }));
        return props.key;
    };
    const destroySnackbar = (key) => {
        setSnackbars((prevSnackbars) => {
            const newSnackbars = { ...prevSnackbars };
            delete newSnackbars[key];
            return newSnackbars;
        });
    };
    window.open = createSnackbar;
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(SnackbarContext.Provider, { value: {
            open: createSnackbar,
            destroy: destroySnackbar
        } },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
            children,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.Portal, null, Object.keys(snackbars).map((key) => {
                const { className, duration, alignment, content } = snackbars[key];
                return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__.Snackbar, { key: key, className: className, open: true, autoHideDuration: duration, anchorOrigin: alignment, onClose: () => destroySnackbar(key) }, content));
            })))));
};
const useSnackbar = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(SnackbarContext);


/***/ }),

/***/ "./lib/handler.js":
/*!************************!*\
  !*** ./lib/handler.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   requestAPI: () => (/* binding */ requestAPI)
/* harmony export */ });
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/coreutils */ "webpack/sharing/consume/default/@jupyterlab/coreutils");
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/services */ "webpack/sharing/consume/default/@jupyterlab/services");
/* harmony import */ var _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__);


/**
 * Call the API extension
 *
 * @param endPoint API REST end point for the extension
 * @param init Initial values for the request
 * @returns The response body interpreted as JSON
 */
async function requestAPI(endPoint = '', init = {}) {
    // Make request to Jupyter API
    const settings = _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.makeSettings();
    const requestUrl = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.URLExt.join(settings.baseUrl, 'jupyterlab-eduhelx-submission', // API Namespace
    endPoint);
    let response;
    try {
        response = await _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.makeRequest(requestUrl, init, settings);
    }
    catch (error) {
        throw new _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.NetworkError(error);
    }
    let data = await response.text();
    if (data.length > 0) {
        try {
            data = JSON.parse(data);
        }
        catch (error) {
            console.log('Not a JSON response body.', response);
        }
    }
    if (!response.ok) {
        throw new _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.ResponseError(response, data.message || data);
    }
    return data;
}


/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/application */ "webpack/sharing/consume/default/@jupyterlab/application");
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_filebrowser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/filebrowser */ "webpack/sharing/consume/default/@jupyterlab/filebrowser");
/* harmony import */ var _jupyterlab_filebrowser__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_filebrowser__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./api */ "./lib/api/api.js");
/* harmony import */ var _widgets__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./widgets */ "./lib/widgets/assignment-widget.js");
/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./model */ "./lib/model.js");
/* harmony import */ var _style_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./style/icons */ "./lib/style/icons.js");







async function activate(app, fileBrowser, restorer, shell) {
    let serverSettings;
    try {
        serverSettings = await (0,_api__WEBPACK_IMPORTED_MODULE_3__.getServerSettings)();
    }
    catch (e) {
        console.error('Failed to load the eduhelx_jupyterlab_student extension settings', e);
        (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__.showErrorMessage)('Failed to load the jupyterlab_eduhelx_submission server extension', e.message, [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__.Dialog.warnButton({ label: 'Dismiss' })]);
        return;
    }
    // await (fileBrowser.model as any)._restored.promise
    const model = new _model__WEBPACK_IMPORTED_MODULE_4__.EduhelxSubmissionModel();
    Promise.all([app.restored, fileBrowser.model.restored]).then(() => {
        model.currentPath = fileBrowser.model.path;
    });
    fileBrowser.model.pathChanged.connect((fileBrowserModel, change) => {
        model.currentPath = change.newValue;
    });
    const submissionWidget = new _widgets__WEBPACK_IMPORTED_MODULE_5__.AssignmentWidget(model, app.commands, serverSettings);
    submissionWidget.id = 'jp-submission-widget';
    submissionWidget.title.icon = _style_icons__WEBPACK_IMPORTED_MODULE_6__.submissionIcon;
    submissionWidget.title.caption = 'Submit assignments';
    restorer.add(submissionWidget, 'submission-widget');
    shell.add(submissionWidget, 'left', { rank: 200 });
}
/**
 * Initialization data for the jupyterlab_eduhelx_submission extension.
 */
const plugin = {
    id: 'jupyterlab_eduhelx_submission:plugin',
    description: 'A JupyterLab extension tfor submitting assignments in EduHeLx',
    autoStart: true,
    requires: [
        _jupyterlab_filebrowser__WEBPACK_IMPORTED_MODULE_1__.IDefaultFileBrowser,
        _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__.ILayoutRestorer,
        _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__.ILabShell,
    ],
    activate
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugin);


/***/ }),

/***/ "./lib/model.js":
/*!**********************!*\
  !*** ./lib/model.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EduhelxSubmissionModel: () => (/* binding */ EduhelxSubmissionModel)
/* harmony export */ });
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lumino/signaling */ "webpack/sharing/consume/default/@lumino/signaling");
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lumino_signaling__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lumino_polling__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @lumino/polling */ "webpack/sharing/consume/default/@lumino/polling");
/* harmony import */ var _lumino_polling__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lumino_polling__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./api */ "./lib/api/api.js");



class EduhelxSubmissionModel {
    constructor() {
        this._isDisposed = false;
        this._currentPath = null;
        this._currentAssignment = undefined;
        this._assignments = undefined;
        this._student = undefined;
        this._course = undefined;
        this._currentPathChanged = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_0__.Signal(this);
        this._currentAssignmentChanged = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_0__.Signal(this);
        this._assignmentsChanged = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_0__.Signal(this);
        this._studentChanged = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_0__.Signal(this);
        this._courseChanged = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_0__.Signal(this);
        this._assignmentPoll = new _lumino_polling__WEBPACK_IMPORTED_MODULE_1__.Poll({
            factory: this._refreshModel.bind(this),
            frequency: {
                interval: 3000,
                backoff: true,
                max: 300 * 1000
            },
            standby: this._refreshStandby
        });
    }
    get isDisposed() {
        return this._isDisposed;
    }
    get assignments() {
        return this._assignments;
    }
    set assignments(v) {
        const change = {
            name: 'assignments',
            newValue: v,
            oldValue: this.assignments
        };
        this._assignments = v;
        this._assignmentsChanged.emit(change);
    }
    get assignmentsChanged() {
        return this._assignmentsChanged;
    }
    get student() {
        return this._student;
    }
    set student(v) {
        const change = {
            name: 'student',
            newValue: v,
            oldValue: this.student
        };
        this._student = v;
        this._studentChanged.emit(change);
    }
    get studentChanged() {
        return this._studentChanged;
    }
    get course() {
        return this._course;
    }
    set course(v) {
        const change = {
            name: 'course',
            newValue: v,
            oldValue: this.course
        };
        this._course = v;
        this._courseChanged.emit(change);
    }
    get courseChanged() {
        return this._courseChanged;
    }
    // Undefined: loading, null: no current assignment
    get currentAssignment() {
        return this._currentAssignment;
    }
    set currentAssignment(v) {
        const change = {
            name: 'currentAssignment',
            newValue: v,
            oldValue: this.currentAssignment
        };
        this._currentAssignment = v;
        this._currentAssignmentChanged.emit(change);
    }
    get currentAssignmentChanged() {
        return this._currentAssignmentChanged;
    }
    get currentPath() {
        return this._currentPath;
    }
    set currentPath(v) {
        const change = {
            name: 'currentPath',
            newValue: v,
            oldValue: this.currentPath
        };
        this._currentPath = v;
        this._currentPathChanged.emit(change);
        this.refreshAssignment();
    }
    get currentPathChanged() {
        return this._currentPathChanged;
    }
    async _loadAssignments() {
        // If the currentPath is loading, the assignment is also loading.
        if (this.currentPath === null) {
            return undefined;
        }
        try {
            return await (0,_api__WEBPACK_IMPORTED_MODULE_2__.getAssignments)(this.currentPath);
        }
        catch (e) {
            console.error(e);
            // If the request encouners an error, default to loading.
            // Don't want to mislead and say an assignment directory isn't an assignment due to an error here.
            return undefined;
        }
    }
    async _loadStudentAndCourse() {
        try {
            return await (0,_api__WEBPACK_IMPORTED_MODULE_2__.getStudentAndCourse)();
        }
        catch (e) {
            console.error(e);
            // If the request encouners an error, default to loading.
            return undefined;
        }
    }
    async refreshAssignment() {
        // Set assignment to loading.
        this.currentAssignment = undefined;
        this.assignments = undefined;
        this.student = undefined;
        // await this._assignmentPoll.refresh()
        this._refreshModel();
        await this._assignmentPoll.tick;
    }
    async _refreshModel() {
        const [assignmentsResponse, studentAndCourseResponse] = await Promise.all([
            this._loadAssignments(),
            this._loadStudentAndCourse()
        ]);
        if (assignmentsResponse === undefined) {
            this.assignments = undefined;
            this.currentAssignment = undefined;
        }
        else {
            this.assignments = assignmentsResponse.assignments;
            this.currentAssignment = assignmentsResponse.currentAssignment;
        }
        if (studentAndCourseResponse === undefined) {
            this.student = undefined;
            this.course = undefined;
        }
        else {
            this.student = studentAndCourseResponse.student;
            this.course = studentAndCourseResponse.course;
        }
    }
    /**
     * Determine if polling should temporarily suspend.
     *
     * Stand by, if:
     * - webpage hidden
     */
    _refreshStandby() {
        // if (this.currentPath === null) return true
        return 'when-hidden';
    }
    dispose() {
        if (this.isDisposed)
            return;
        this._isDisposed = true;
        this._assignmentPoll.dispose();
        _lumino_signaling__WEBPACK_IMPORTED_MODULE_0__.Signal.clearData(this);
    }
}


/***/ }),

/***/ "./lib/style/icons.js":
/*!****************************!*\
  !*** ./lib/style/icons.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   submissionIcon: () => (/* binding */ submissionIcon)
/* harmony export */ });
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_icons_publish_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../style/icons/publish.svg */ "./style/icons/publish.svg");


const submissionIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({ name: 'eduhelx-submission', svgstr: _style_icons_publish_svg__WEBPACK_IMPORTED_MODULE_1__ });


/***/ }),

/***/ "./lib/utils/date-format.js":
/*!**********************************!*\
  !*** ./lib/utils/date-format.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DateFormat: () => (/* binding */ DateFormat)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ "webpack/sharing/consume/default/moment/moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);


const ReactiveTime = ({ getTime }) => {
    const [time, setTime] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(getTime());
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        // Doesn't need to precisely sync to the internal time or anything
        // because the humanized moment is imprecise. 
        const interval = window.setInterval(() => {
            setTime(getTime());
        }, 1000);
        return () => {
            window.clearInterval(interval);
        };
    }, []);
    return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, time);
};
// The purpose of this is to standardize the date string formats used across the project.
class DateFormat {
    constructor(date) {
        this._date = date;
        this._moment = moment__WEBPACK_IMPORTED_MODULE_1___default()(date);
    }
    toBasicDatetime() {
        return this._moment.format("MMM DD [at] h[:]mm A");
    }
    toRelativeDatetime(referenceTime) {
        const getDuration = (date) => (0,moment__WEBPACK_IMPORTED_MODULE_1__.duration)(this._moment.diff(moment__WEBPACK_IMPORTED_MODULE_1___default()(date))).humanize();
        if (referenceTime)
            return getDuration(referenceTime);
        return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ReactiveTime, { getTime: () => getDuration(new Date()) });
    }
}


/***/ }),

/***/ "./lib/widgets/assignment-widget.js":
/*!******************************************!*\
  !*** ./lib/widgets/assignment-widget.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssignmentWidget: () => (/* binding */ AssignmentWidget)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/core/styles */ "./node_modules/@material-ui/styles/esm/StylesProvider/StylesProvider.js");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components */ "./lib/components/assignment-panel/assignment-panel.js");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../contexts */ "./lib/contexts/commands-context.js");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../contexts */ "./lib/contexts/settings-context.js");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../contexts */ "./lib/contexts/backdrop-context.js");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../contexts */ "./lib/contexts/snackbar-context.js");
/* harmony import */ var _contexts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../contexts */ "./lib/contexts/assignment-context.js");





class AssignmentWidget extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.ReactWidget {
    constructor(model, commands, serverSettings) {
        super();
        this.model = model;
        this.commands = commands;
        this.serverSettings = serverSettings;
    }
    render() {
        return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__["default"], { injectFirst: true },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contexts__WEBPACK_IMPORTED_MODULE_3__.CommandsProvider, { commands: this.commands },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contexts__WEBPACK_IMPORTED_MODULE_4__.SettingsProvider, { settings: this.serverSettings },
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contexts__WEBPACK_IMPORTED_MODULE_5__.BackdropProvider, null,
                        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contexts__WEBPACK_IMPORTED_MODULE_6__.SnackbarProvider, null,
                            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contexts__WEBPACK_IMPORTED_MODULE_7__.AssignmentProvider, { model: this.model },
                                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components__WEBPACK_IMPORTED_MODULE_8__.AssignmentPanel, null))))))));
    }
}


/***/ }),

/***/ "./style/icons/publish.svg":
/*!*********************************!*\
  !*** ./style/icons/publish.svg ***!
  \*********************************/
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\">\n    <path\n        class=\"jp-icon3 jp-icon-selectable\"\n        d=\"M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z\"\n        fill=\"#616161\"\n    />\n</svg>\n";

/***/ })

}]);
//# sourceMappingURL=lib_index_js.145449ba8616931d9a24.js.map