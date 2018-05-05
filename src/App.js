import React, { Component } from 'react';
import './App.css';

import TaskForm from './components/TaskForm';
import Control from './components/Control';
import TaskList from './components/TaskList';
import randomstring from 'randomstring';
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            isDisplayForm: false,
            taskEditing: null
        }
    }

    componentWillMount() {
        if (localStorage && localStorage.getItem("tasks")) {
            var tasks = JSON.parse(localStorage.getItem("tasks"))
            this.setState({
                tasks: tasks
            })
        }
    }


    onToggleForm = () => {
        this.setState({
            isDisplayForm: !this.state.isDisplayForm
        })
    }
    onCloseForm = () => {
        this.setState({
            isDisplayForm: false
        })
    }
    onSubmit = (data) => {
        var { tasks } = this.state;
        data.id = randomstring.generate();
        tasks.push(data);
        this.setState({
            tasks: tasks
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));

    }
    onUpdateStatus = (id) => {
        var { tasks } = this.state;
        var index = this.findIndex(id);
        if (index !== -1) {
            tasks[index].status = !tasks[index].status;
            this.setState({
                tasks: tasks
            })
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
    findIndex = (id) => {
        var result = -1;
        var { tasks } = this.state;
        tasks.forEach((task, index) => {
            if (task.id === id)
                result = index;
        })
        return result;
    }
    onDelete = (id) => {
        var { tasks } = this.state;
        var index = this.findIndex(id);
        if (index !== -1) {
            tasks.splice(index, 1);
            this.setState({
                tasks: tasks
            })
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
        this.onCloseForm();
    }
    onShowForm = () => {
        this.setState({
            isDisplayForm: true
        })
    }
    onUpdate = (id) => {
        var { tasks } = this.state;
        var index = this.findIndex(id);
        var taskEditing = tasks[index];
        console.log(taskEditing);

        this.setState({
            taskEditing: taskEditing
        });
        this.onShowForm();
    }
    render() {
        var { tasks, isDisplayForm, taskEditing } = this.state;
        var elemTaskForm = isDisplayForm ?
            <TaskForm
                onCloseForm={this.onCloseForm}
                onSubmit={this.onSubmit}
                task={taskEditing}
            /> 
            : '';
        return (
            <div className="container">
                <div className="text-center">
                    <h1>Quản lý công việc</h1><br />
                </div>
                <div className="row">
                    {/* Form */}
                    {elemTaskForm}

                    <div className={isDisplayForm ? "col-xs-8 col-sm-8 col-md-8 col-lg-8" : "col-xs-12 col-sm-12 col-md-12 col-lg-12"}>
                        <button type="button" className="btn btn-primary" onClick={this.onToggleForm}>
                            <span className="fa fa-plus mr-5"></span>Thêm công việc
                        </button>
                        {/* Search & sort */}
                        <Control />

                        {/* List */}
                        <TaskList
                            tasks={tasks}
                            onUpdateStatus={this.onUpdateStatus}
                            onDelete={this.onDelete}
                            onUpdate={this.onUpdate}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
