const Task = require("../../models/task.model");

const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

/**
 * @description - This function is used to create a new task.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 * 
 */
module.exports.createTask = catchAsync( async (req, res)=>{

    const { user } = req;

    if(!req.body.description) return res.status(400).json({
        status: "fail",
        message: "Description is required"
    });

    const task = new Task({
        ...req.body,
        owner: user._id
    });

    await task.save();

    return res.status(201).json({
        status: "success",
        data: {
            task
        }
    });
});

/**
 * @description - This function is used to get all tasks.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 * 
 */
module.exports.getAllTasks = catchAsync( async (req, res)=>{

    const { user } = req;

    const userWithTasks = await user.populate('tasks');
    const tasks = userWithTasks.tasks

    if(!tasks) return res.status(404).json({
        status: "fail",
        message: "No tasks found"
    });

    return res.status(200).json({
        status: "success",
        data: {
            tasks
        }
    });
});

/**
 * @description - This function is used to get a task by id.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 * 
 */
module.exports.getTaskById = catchAsync( async (req, res)=>{
    const { user } =req;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, owner: user._id }).populate("owner");

    if(!task) return res.status(404).json({
        status: "fail",
        message: "No task found"
    });

    return res.status(200).json({
        status: "success",
        data: {
            task
        }
    });
});

/**
 * @description - This function is used to update a task by id.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 * 
 */
module.exports.updateTaskById = catchAsync( async (req, res)=>{

    const allowedUpdates = ["description", "completed"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) return res.status(400).json({
        status: "fail",
        message: "Invalid updates",
        allowedUpdates
    })

    const { id } = req.params;

    const task = await Task.findById(id);

    if(!task) return res.status(404).json({
        status: "fail",
        message: "No task found"
    });

    updates.forEach(update => task[update] = req.body[update]);

    await task.save();

    if(!task) return res.status(404).json({
        status: "fail",
        message: "No task found"
    });

    return res.status(200).json({
        status: "success",
        data: {
            task
        }
    });
})

/**
 * @description - This function is used to delete a task by id.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
module.exports.deleteTaskById = catchAsync( async (req, res)=>{
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if(!task) return res.status(404).json({
        status: "fail",
        message: "No task found"
    });

    return res.status(200).json({
        status: "success",
        data: {
            task
        }
    });
});