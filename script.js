// App scripts
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function displayTasks(){
let list = document.getElementById("taskList");
list.innerHTML = "";

tasks.forEach((task,index)=>{
let li = document.createElement("li");
li.textContent = task;
list.appendChild(li);
});
}

function addTask(){

let input = document.getElementById("taskInput");
let task = input.value;

if(task === "") return;

tasks.push(task);

localStorage.setItem("tasks", JSON.stringify(tasks));

input.value = "";

displayTasks();
}

displayTasks();