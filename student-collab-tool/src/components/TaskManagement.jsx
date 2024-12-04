import React, { useState } from "react";
import "./TaskManagement.css";

const TaskManagementSystem = () => {
  const [teamMembers, setTeamMembers] = useState([
    "Carlos",
    "Curt",
    "Michael",
    "Alberto",
    "James",
  ]);
  const [newMemberName, setNewMemberName] = useState("");

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Research Project Proposal",
      description: "Develop initial research proposal outline",
      assignedTo: "Carlos",
      status: "In Progress",
      dueDate: "2024-12-15",
      completed: false,
    },
    {
      id: 2,
      title: "Frontend Design",
      description: "Create wireframes for user interface",
      assignedTo: "James",
      status: "Not Started",
      dueDate: "2024-11-30",
      completed: false,
    },
  ]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "Not Started",
    dueDate: "",
    completed: false,
  });

  const addTeamMember = () => {
    const trimmedName = newMemberName.trim();
    if (!trimmedName) {
      alert("Please enter a team member name");
      return;
    }

    if (
      teamMembers.some(
        (member) => member.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      alert("This team member already exists");
      return;
    }

    setTeamMembers([...teamMembers, trimmedName]);
    setNewMemberName("");
  };

  const removeTeamMember = (memberToRemove) => {
    const assignedTasks = tasks.filter(
      (task) => task.assignedTo === memberToRemove
    );

    if (assignedTasks.length > 0) {
      alert("Cannot remove team member who has assigned tasks");
      return;
    }

    setTeamMembers(teamMembers.filter((member) => member !== memberToRemove));
  };

  const addTask = () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      alert("Please fill in all required fields");
      return;
    }

    const taskToAdd = {
      ...newTask,
      id: tasks.length + 1,
    };

    setTasks([...tasks, taskToAdd]);

    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      status: "Not Started",
      dueDate: "",
      completed: false,
    });
  };

  const updateTaskStatus = (taskId, completed) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed,
              status: completed ? "Completed" : "In Progress",
            }
          : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="task-management-container">
      <div className="team-members-card">
        <h2>Team Members</h2>
        <div className="team-member-input-container">
          <input
            type="text"
            placeholder="Team Member Name"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
          />
          <button onClick={addTeamMember}>Add</button>
        </div>

        <div className="team-member-list">
          {teamMembers.map((member) => (
            <div key={member} className="team-member-item">
              <span>{member}</span>
              <button
                className="remove-button"
                onClick={() => removeTeamMember(member)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="team-members-card">
        <h2>Task Management</h2>
        <form
          className="task-form"
          onSubmit={(e) => {
            e.preventDefault();
            addTask();
          }}
        >
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <select
            value={newTask.assignedTo}
            onChange={(e) =>
              setNewTask({ ...newTask, assignedTo: e.target.value })
            }
            required
          >
            <option value="">Assign To</option>
            {teamMembers.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <button type="submit">Add Task</button>
        </form>

        <div>
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <div className="task-details">
                  <div className="task-title">{task.title}</div>
                  <div className="task-description">{task.description}</div>
                  <div className="task-metadata">
                    <span>Assigned to: {task.assignedTo}</span>
                    <span>Due: {task.dueDate}</span>
                    <span
                      className={`task-status status-${task.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
                <div className="task-actions">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) =>
                      updateTaskStatus(task.id, e.target.checked)
                    }
                  />
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskManagementSystem;
